/**
 * Minihra „Hláskový vláčik“ (úroveň 1 – Počúvam, od 5 rokov).
 * Zaznie slovo s obrázkom – dieťa ho naloží do vozíka s hláskou, na ktorú
 * slovo začína (dvojice R–L, S–Š, K–G…). Na vozíku je ukážkový obrázok.
 *
 * URL: vlacik.html?level=t1_05
 */
import '../bridge.js';
import { h, ICONS, say, pause } from '../ui/kit.js';
import { makeTrainRounds } from '../games/tier1Games.js';
import { starsForScore } from '../games/sameDifferent.js';
import { getWord } from '../content/words.js';
import { bootTier1, gameHead, feedbackLayer, playWord, finishLevel, gameTopbar } from './tier1-common.js';

const BJ = window.BJ;
const MAX_ATTEMPTS = 2;
const CART_COLORS = ['#e8553f', '#3f8ee8'];

const CART_SVG = (color) => `<svg class="t1-cart__body" viewBox="0 0 300 170" aria-hidden="true">
  <path d="M18 18h264l-26 112H44z" fill="${color}" stroke="#000" stroke-width="7" stroke-linejoin="round"/>
  <path d="M30 40h240" stroke="rgba(0,0,0,.25)" stroke-width="6"/>
  <path d="M50 18v108M250 18v108" stroke="rgba(0,0,0,.2)" stroke-width="6"/>
  <circle cx="84" cy="140" r="24" fill="#3a2a1c" stroke="#000" stroke-width="6"/>
  <circle cx="216" cy="140" r="24" fill="#3a2a1c" stroke="#000" stroke-width="6"/>
  <circle cx="84" cy="140" r="7" fill="#c9a24a"/><circle cx="216" cy="140" r="7" fill="#c9a24a"/>
</svg>`;

function start({ level, path, profile, backHref }) {
    const plan = makeTrainRounds({ count: level.rounds, ageGroup: profile.ageGroup, levelNumber: level.number, seed: level.id });
    const rounds = plan.rounds;
    const head = gameHead('Hláskový vláčik', rounds.length);
    const fb = feedbackLayer();
    let index = 0;
    let attempts = 0;
    let points = 0;
    let busy = true;

    const picture = h('img', { alt: '', draggable: 'false' });
    const card = h('button.t1-card.t1-card--word', { type: 'button', 'aria-label': 'Vypočuť znova', onclick: () => !busy && playTarget() }, [picture]);
    const speaker = h('button.t1-speaker.t1-speaker--small', { type: 'button', 'aria-label': 'Vypočuť znova', html: ICONS.speaker, onclick: () => !busy && playTarget() });

    const carts = plan.letters.map((letter, side) => {
        const ex = getWord(plan.examples[side]);
        const load = h('div.t1-cart__load');
        const cart = h('button.t1-cart', { type: 'button', 'aria-label': `Vozík ${letter}`, onclick: () => choose(side) }, [
            load,
            h('div.t1-cart__wrap', { html: CART_SVG(CART_COLORS[side]) }, [
                h('span.t1-cart__letter', { text: letter }),
                ex ? h('span.t1-cart__example', {}, [h('img', { src: ex.image, alt: '', draggable: 'false' })]) : null,
            ]),
        ]);
        cart.load = load;
        return cart;
    });

    async function playTarget() {
        busy = true;
        speaker.classList.add('is-speaking');
        await playWord(rounds[index].word);
        speaker.classList.remove('is-speaking');
        busy = false;
    }

    function renderRound() {
        const w = getWord(rounds[index].word);
        picture.src = w ? w.image : '';
        card.classList.remove('is-loading');
        card.style.transform = '';
        carts.forEach((c) => c.classList.remove('is-off', 'is-right', 'is-wrong'));
        head.update(level.number, index);
    }

    /** Obrázok „preletí“ do vozíka a vozík sa pohne. */
    async function loadInto(cart) {
        const a = card.getBoundingClientRect();
        const b = cart.load.getBoundingClientRect();
        const scale = a.width / card.offsetWidth || 1; // plátno je škálované
        const dx = (b.left + b.width / 2 - (a.left + a.width / 2)) / scale;
        const dy = (b.top + b.height / 2 - (a.top + a.height / 2)) / scale;
        card.classList.add('is-loading');
        card.style.transform = `translate(${dx}px, ${dy}px) scale(0.32) rotate(-8deg)`;
        await pause(520);
        const thumb = h('img', { src: picture.src, alt: '', draggable: 'false' });
        cart.load.append(thumb);
        if (cart.load.children.length > 4) cart.load.firstElementChild.remove();
        cart.classList.add('is-right');
        await pause(380);
    }

    async function choose(side) {
        if (busy) return;
        busy = true;
        const r = rounds[index];
        const cart = carts[side];
        if (side === r.answer) {
            points += attempts === 0 ? 1 : 0.5;
            await loadInto(cart);
            await fb.show(true, 'Výborne!', 1000);
            return next();
        }
        attempts++;
        cart.classList.add('is-wrong');
        BJ.audio.playEffect('wrong');
        setTimeout(() => cart.classList.remove('is-wrong'), 600);
        if (attempts < MAX_ATTEMPTS) {
            await fb.show(false, 'Skús ešte raz!', 1100);
            return playTarget();
        }
        await fb.show(false, `${r.word} – na ${plan.letters[r.answer]}`, 1700);
        await loadInto(carts[r.answer]);
        return next();
    }

    async function next() {
        index++;
        attempts = 0;
        if (index >= rounds.length) {
            head.update(level.number, index);
            const earned = starsForScore(points / rounds.length);
            return finishLevel({ level, path, backHref, earned, stats: [{ icon: 'tries', value: `${Math.round(points * 10) / 10} / ${rounds.length}`, label: 'správne' }] });
        }
        renderRound();
        await pause(250);
        return playTarget();
    }

    document.getElementById('app').replaceChildren(
        gameTopbar(backHref, profile),
        head.el,
        h('div.t1-stage.t1-stage--train', {}, [
            h('div.t1-train__top', {}, [speaker, card]),
            h('div.t1-train', {}, [...carts, h('div.t1-rails')]),
        ]),
        fb.el,
    );
    renderRound();

    window.BJGame = { get round() { return rounds[index]; }, get index() { return index; }, get busy() { return busy; }, plan, choose };

    (async () => {
        await Promise.race([say('Počúvaj slovo. Na akú hlásku začína? Ťukni na správny vozík.'), pause(5500)]);
        await pause(250);
        playTarget();
    })();
}

bootTier1(start);
