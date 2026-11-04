/**
 * Minihra „Rovnaké alebo iné?“ (úroveň 1 – Počúvam).
 * Dvaja baníci povedia slovo; dieťa určí, či to boli rovnaké alebo iné slová.
 * Nahrávky: zvuky/<1..15>/1.wav a 2.wav (dvojice podobných slov).
 *
 * URL: pocuvaj.html?level=t1_03
 */
import '../bridge.js';
import { h, centeredGlyph, topbar, say, ICONS, pause } from '../ui/kit.js';
import { bootTier1, finishLevel } from './tier1-common.js';
import { avatarById } from '../core/profiles.js';
import { makeRounds, starsForScore } from '../games/sameDifferent.js';

const BJ = window.BJ;
const app = document.getElementById('app');
let profile = null;

const MAX_ATTEMPTS = 2;

const ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.8 9.6 18 19.8 6.4" fill="none" stroke="#000" stroke-width="6.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 12.8 9.6 18 19.8 6.4" fill="none" stroke="#38e04a" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_CROSS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 18 18M18 6 6 18" fill="none" stroke="#000" stroke-width="6.4" stroke-linecap="round"/><path d="M6 6 18 18M18 6 6 18" fill="none" stroke="#ff5a4e" stroke-width="3.8" stroke-linecap="round"/></svg>';
const ICON_REPLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12a7 7 0 1 1-2.05-4.95" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round"/><path d="M19 12a7 7 0 1 1-2.05-4.95" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M19.8 3.6v5h-5z" fill="currentColor" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/></svg>';

/**
 * Animovaný baník (20 snímok státia zo sprite-ov Super Jožina).
 * avatar.image končí na „idle_000.png“ – ostatné snímky majú len iné číslo.
 */
function minerSprite(avatar) {
    const frames = Array.from({ length: 20 }, (_, i) => avatar.image.replace(/_000\.png$/, `_${String(i).padStart(3, '0')}.png`));
    frames.forEach((src) => { new Image().src = src; });
    const img = h('img.miner__img', { src: frames[0], alt: '', draggable: 'false' });
    let i = Math.floor(Math.random() * 20);
    setInterval(() => {
        i = (i + 1) % frames.length;
        img.src = frames[i];
    }, 75);
    return img;
}

/** Prehranie s poistkou – ak by zvuk nedohral (chyba), hra nezamrzne. */
function play(src, maxMs = 5000) {
    return Promise.race([BJ.audio.play(src), pause(maxMs)]);
}

function start({ level, path, backHref, profile: p }) {
    profile = p;
    const rounds = makeRounds(level.rounds);
    const leftAv = avatarById(profile.avatar);
    const rightAv = avatarById(profile.avatar === 'old_miner' ? 'yellow_hat' : 'old_miner');
    let index = 0;
    let points = 0;
    let attempts = 0;
    let busy = true;

    const dots = rounds.map(() => h('span.round-dot'));
    const roundLabel = h('div.game-sub');

    const station = (av, side, label) => {
        const bubble = h('button.miner__bubble', {
            type: 'button',
            'aria-label': label,
            html: ICONS.speaker,
            onclick: () => !busy && replayOne(side),
        }, []);
        bubble.append(h('span.miner__num', { 'aria-hidden': 'true' }, [centeredGlyph(side === 'a' ? '1' : '2', { size: 62, stroke: 5 })]));
        const el = h(`div.miner.miner--${side}`, {}, [
            bubble,
            h('div.miner__stage', {}, [h('div.miner__spot'), h('div.miner__body', {}, [minerSprite(av)])]),
        ]);
        return { el, bubble };
    };
    const A = station(leftAv, 'a', 'Prvé slovo');
    const B = station(rightAv, 'b', 'Druhé slovo');
    const bubbleA = A.bubble;
    const bubbleB = B.bubble;
    const minerA = A.el;
    const minerB = B.el;

    const roundBtn = (cls, label, icon, onclick) =>
        h(`button.round-action.${cls}`, { type: 'button', 'aria-label': label, onclick }, [
            h('span.round-action__btn', { html: icon }),
            h('span.round-action__label', { text: label }),
        ]);
    const replayBtn = roundBtn('round-action--replay', 'Znova', ICON_REPLAY, () => !busy && playPair());
    const btnSame = roundBtn('round-action--same', 'Rovnaké', ICON_CHECK, () => answer(true));
    const btnDiff = roundBtn('round-action--diff', 'Iné', ICON_CROSS, () => answer(false));
    const feedback = h('div.feedback', { 'aria-live': 'polite' });

    function setBusy(v) {
        busy = v;
        btnSame.disabled = v;
        btnDiff.disabled = v;
        replayBtn.disabled = v;
    }

    async function speakBubble(bubble, miner, src) {
        bubble.classList.add('is-speaking');
        miner.classList.add('is-speaking');
        await play(src);
        bubble.classList.remove('is-speaking');
        miner.classList.remove('is-speaking');
    }

    async function playPair() {
        setBusy(true);
        const r = rounds[index];
        await speakBubble(bubbleA, minerA, r.a);
        await pause(450);
        await speakBubble(bubbleB, minerB, r.b);
        setBusy(false);
    }

    async function replayOne(which) {
        setBusy(true);
        const r = rounds[index];
        if (which === 'a') await speakBubble(bubbleA, minerA, r.a);
        else await speakBubble(bubbleB, minerB, r.b);
        setBusy(false);
    }

    function updateHeader() {
        roundLabel.textContent = `Level ${level.number}`;
        dots.forEach((d, i) => {
            d.classList.toggle('is-done', i < index);
            d.classList.toggle('is-current', i === index);
        });
    }

    function showFeedback(ok, text) {
        feedback.replaceChildren(
            h('img', { src: ok ? 'images/spravne.png' : 'images/nespravne.png', alt: '' }),
            h('div.feedback__text', { text }),
        );
        feedback.className = 'feedback is-visible ' + (ok ? 'is-ok' : 'is-bad');
    }

    function hideFeedback() {
        feedback.className = 'feedback';
    }

    async function answer(same) {
        if (busy) return;
        setBusy(true);
        const r = rounds[index];
        const correct = same === r.same;
        if (correct) {
            points += attempts === 0 ? 1 : 0.5;
            BJ.audio.playEffect('correct');
            showFeedback(true, 'Výborne!');
            await pause(1500);
            hideFeedback();
            return nextRound();
        }
        attempts++;
        BJ.audio.playEffect('wrong');
        if (attempts < MAX_ATTEMPTS) {
            showFeedback(false, 'Skús ešte raz!');
            await pause(1400);
            hideFeedback();
            return playPair();
        }
        showFeedback(false, r.same ? 'Boli rovnaké.' : 'Boli iné.');
        await pause(1800);
        hideFeedback();
        return nextRound();
    }

    async function nextRound() {
        index++;
        attempts = 0;
        updateHeader();
        if (index >= rounds.length) return finish();
        await pause(300);
        return playPair();
    }

    function finish() {
        const earned = starsForScore(points / rounds.length);
        finishLevel({ level, path, backHref, earned, stats: [{ icon: 'tries', value: `${Math.round(points * 10) / 10} / ${rounds.length}`, label: 'správne' }] });
    }

    app.replaceChildren(
        topbar({ back: backHref, profile, album: false }),
        h('div.game-head', {}, [
            h('h1.game-sign', { text: 'Rovnaké alebo iné?' }),
            h('div.game-progress', {}, [roundLabel, h('div.round-dots', {}, dots)]),
        ]),
        h('div.arena', {}, [
            minerA,
            h('div.arena__middle', {}, [h('div.arena__q', {}, [centeredGlyph('?', { size: 78, stroke: 4.5 })]), replayBtn]),
            minerB,
        ]),
        h('div.answers', {}, [btnSame, btnDiff]),
        feedback,
    );
    updateHeader();
    setBusy(true);

    // stav hry pre automatické testy (scripts/, tests/)
    window.BJGame = {
        get round() { return rounds[index]; },
        get index() { return index; },
        get busy() { return busy; },
        rounds,
    };

    // úvod: pokyn a prvé kolo
    (async () => {
        await Promise.race([say('Počúvaj dvoch baníkov. Povedali rovnaké slovo, alebo iné?'), pause(4500)]);
        await pause(300);
        playPair();
    })();
}

bootTier1(start);
