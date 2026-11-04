/**
 * Minihra „Čo počuješ?“ (úroveň 1 – Počúvam).
 * Zaznie slovo, dieťa ťukne na obrázok, ktorý počulo. Počet obrázkov podľa veku;
 * starší dostanú podobné slová (rovnaký začiatok, dĺžka).
 *
 * URL: obrazky.html?level=t1_02
 */
import '../bridge.js';
import { h, ICONS, say, pause } from '../ui/kit.js';
import { makePictureRounds } from '../games/tier1Games.js';
import { starsForScore } from '../games/sameDifferent.js';
import { getWord } from '../content/words.js';
import { bootTier1, gameHead, feedbackLayer, playWord, finishLevel, gameTopbar } from './tier1-common.js';

const MAX_ATTEMPTS = 2;

function start({ level, path, profile, backHref }) {
    const rounds = makePictureRounds({ count: level.rounds, ageGroup: profile.ageGroup, levelNumber: level.number, seed: level.id });
    const head = gameHead('Čo počuješ?', rounds.length);
    const fb = feedbackLayer();
    let index = 0;
    let attempts = 0;
    let points = 0;
    let busy = true;

    const speaker = h('button.t1-speaker', { type: 'button', 'aria-label': 'Vypočuť znova', html: ICONS.speaker, onclick: () => !busy && playTarget() });
    const cardsBox = h('div.t1-cards');

    async function playTarget() {
        busy = true;
        speaker.classList.add('is-speaking');
        await playWord(rounds[index].target);
        speaker.classList.remove('is-speaking');
        busy = false;
    }

    function renderRound() {
        const r = rounds[index];
        cardsBox.className = `t1-cards t1-cards--${r.options.length}`;
        cardsBox.replaceChildren(...r.options.map((word) => {
            const w = getWord(word);
            const card = h('button.t1-card', { type: 'button', 'aria-label': word, onclick: () => choose(word, card) }, [
                h('img', { src: w.image, alt: '', draggable: 'false' }),
            ]);
            card.dataset.word = word;
            return card;
        }));
        head.update(level.number, index);
    }

    async function choose(word, card) {
        if (busy) return;
        busy = true;
        const r = rounds[index];
        if (word === r.target) {
            card.classList.add('is-right');
            points += attempts === 0 ? 1 : 0.5;
            await pause(350);
            await fb.show(true, 'Výborne!');
            return next();
        }
        attempts++;
        card.classList.add('is-wrong');
        setTimeout(() => card.classList.remove('is-wrong'), 600);
        if (attempts < MAX_ATTEMPTS) {
            await fb.show(false, 'Skús ešte raz!', 1100);
            card.disabled = true;
            card.classList.add('is-off');
            return playTarget();
        }
        // ukázať správny obrázok
        const right = cardsBox.querySelector(`[data-word="${CSS.escape(r.target)}"]`);
        if (right) right.classList.add('is-right');
        await fb.show(false, `Bolo to: ${r.target}`, 1700);
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
        await pause(300);
        return playTarget();
    }

    document.getElementById('app').replaceChildren(
        gameTopbar(backHref, profile),
        head.el,
        h('div.t1-stage', {}, [speaker, cardsBox]),
        fb.el,
    );
    renderRound();

    // stav hry pre automatické testy
    window.BJGame = { get round() { return rounds[index]; }, get index() { return index; }, get busy() { return busy; }, rounds };

    (async () => {
        await Promise.race([say('Počúvaj slovo a ťukni na obrázok, ktorý počuješ.'), pause(4500)]);
        await pause(250);
        playTarget();
    })();
}

bootTier1(start);
