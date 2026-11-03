/**
 * Minihra „Zvončeky v bani“ (úroveň 1 – Počúvam, od 5 rokov).
 * Zvončeky pri lampách zahrajú poradie tónov – dieťa ho zopakuje ťukaním.
 * Poradie sa v každom kole predĺži. Tóny sa vytvárajú v prehliadači (Web Audio).
 *
 * URL: zvoncky.html?level=t1_04
 */
import '../bridge.js';
import { h, ICONS, say, pause } from '../ui/kit.js';
import { makeBellsPlan } from '../games/tier1Games.js';
import { starsForScore } from '../games/sameDifferent.js';
import { bootTier1, gameHead, feedbackLayer, finishLevel, gameTopbar } from './tier1-common.js';

const BJ = window.BJ;
const MAX_ATTEMPTS = 2;
// tóny zvončekov (C5, E5, G5, C6) a farby lámp
const TONES = [523.25, 659.25, 783.99, 1046.5];
const COLORS = ['#ff5a4e', '#ffd34d', '#4fc3f7', '#7cff7a'];

let actx = null;
function bell(freq, dur = 0.9) {
    if (BJ && BJ.settings && BJ.settings().sound === false) return;
    try {
        actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        if (actx.state === 'suspended') actx.resume();
        const t = actx.currentTime;
        const out = actx.createGain();
        out.gain.setValueAtTime(0.0001, t);
        out.gain.exponentialRampToValueAtTime(0.5, t + 0.01);
        out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        out.connect(actx.destination);
        // zvonček = základný tón + vyššie alikvoty
        [[1, 1], [2.76, 0.35], [5.4, 0.12]].forEach(([k, g]) => {
            const o = actx.createOscillator();
            const og = actx.createGain();
            o.type = 'sine';
            o.frequency.value = freq * k;
            og.gain.value = g;
            o.connect(og).connect(out);
            o.start(t);
            o.stop(t + dur);
        });
    } catch (e) { /* bez zvuku */ }
}

const BELL_SVG = (color) => `<svg viewBox="0 0 100 120" aria-hidden="true">
  <rect x="46" y="0" width="8" height="22" fill="#7a4a22"/>
  <circle cx="50" cy="24" r="8" fill="#5a3418" stroke="#000" stroke-width="2"/>
  <path d="M50 28c-20 0-28 18-28 38v18l-10 12h76l-10-12V66c0-20-8-38-28-38z" fill="${color}" stroke="#000" stroke-width="4" stroke-linejoin="round"/>
  <path d="M34 60c2-12 8-20 16-22" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="5" stroke-linecap="round"/>
  <circle cx="50" cy="104" r="9" fill="#5a3418" stroke="#000" stroke-width="3"/>
</svg>`;

function start({ level, path, profile, backHref }) {
    const plan = makeBellsPlan({ ageGroup: profile.ageGroup, levelNumber: level.number, seed: level.id });
    const head = gameHead('Zvončeky v bani', plan.rounds.length);
    const fb = feedbackLayer();
    let index = 0;
    let attempts = 0;
    let points = 0;
    let input = [];
    let busy = true;

    const hint = h('div.t1-hint', { text: 'Počúvaj…' });
    const bells = Array.from({ length: plan.bells }, (_, i) => {
        const b = h('button.t1-bell', { type: 'button', 'aria-label': `Zvonček ${i + 1}`, html: BELL_SVG(COLORS[i]), onpointerdown: (e) => { e.preventDefault(); tap(i); } });
        b.style.setProperty('--glow', COLORS[i]);
        return b;
    });
    const replay = h('button.t1-speaker.t1-speaker--small', { type: 'button', 'aria-label': 'Zahrať znova', html: ICONS.replay, onclick: () => !busy && playSeq() });

    async function ring(i, ms = 520) {
        bells[i].classList.add('is-ringing');
        bell(TONES[i]);
        await pause(ms);
        bells[i].classList.remove('is-ringing');
    }

    async function playSeq() {
        busy = true;
        input = [];
        hint.textContent = 'Počúvaj…';
        bells.forEach((b) => b.classList.add('is-listen'));
        await pause(350);
        for (const i of plan.rounds[index]) {
            await ring(i);
            await pause(180);
        }
        bells.forEach((b) => b.classList.remove('is-listen'));
        hint.textContent = 'Teraz ty!';
        busy = false;
    }

    async function tap(i) {
        if (busy) return;
        ring(i, 300);
        input.push(i);
        const seq = plan.rounds[index];
        const k = input.length - 1;
        if (input[k] !== seq[k]) {
            busy = true;
            attempts++;
            if (attempts < MAX_ATTEMPTS) {
                await fb.show(false, 'Skús ešte raz!', 1100);
                return playSeq();
            }
            await fb.show(false, 'Nevadí, ideme ďalej!', 1400);
            return next();
        }
        if (input.length === seq.length) {
            busy = true;
            points += attempts === 0 ? 1 : 0.5;
            await pause(350);
            await fb.show(true, 'Výborne!', 1100);
            return next();
        }
    }

    async function next() {
        index++;
        attempts = 0;
        head.update(level.number, index);
        if (index >= plan.rounds.length) {
            const earned = starsForScore(points / plan.rounds.length);
            return finishLevel({ level, path, backHref, earned, summary: `Správne: ${Math.round(points * 10) / 10} z ${plan.rounds.length}` });
        }
        await pause(300);
        return playSeq();
    }

    document.getElementById('app').replaceChildren(
        gameTopbar(backHref, profile),
        head.el,
        h('div.t1-stage.t1-stage--bells', {}, [h('div.t1-bells', {}, bells), h('div.t1-bells__bar', {}, [replay, hint])]),
        fb.el,
    );
    head.update(level.number, 0);

    window.BJGame = { get busy() { return busy; }, get index() { return index; }, plan, tap };

    (async () => {
        await Promise.race([say('Zvončeky zahrajú pesničku. Počúvaj a potom ju zopakuj.'), pause(4500)]);
        playSeq();
    })();
}

bootTier1(start);
