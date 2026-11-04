/**
 * Minihra „Zvukové pexeso“ (úroveň 1 – Počúvam).
 * Karty sú otočené – po ťuknutí zahrajú slovo (obrázok nevidieť). Dve karty
 * s rovnakým slovom = dvojica, ukáže sa obrázok. Hviezdy podľa počtu pokusov.
 *
 * URL: zvpexeso.html?level=t1_03
 */
import '../bridge.js';
import { h, ICONS, say, pause } from '../ui/kit.js';
import { makeSoundBoard, soundPexesoStars } from '../games/tier1Games.js';
import { getWord } from '../content/words.js';
import { bootTier1, gameHead, feedbackLayer, playWord, finishLevel, gameTopbar } from './tier1-common.js';

const BJ = window.BJ;

function start({ level, path, profile, backHref }) {
    const board = makeSoundBoard({ ageGroup: profile.ageGroup, levelNumber: level.number, seed: level.id });
    const head = gameHead('Zvukové pexeso', board.pairs);
    const fb = feedbackLayer();
    let open = [];
    let found = 0;
    let moves = 0;
    let busy = true;

    const grid = h('div.t1-grid', { style: { '--cols': String(Math.ceil(board.cards.length / 2)) } });
    const cards = board.cards.map((word, i) => {
        const w = getWord(word);
        const card = h('button.t1-flip', { type: 'button', 'aria-label': `Karta ${i + 1}`, onclick: () => tap(card) }, [
            h('span.t1-flip__inner', {}, [
                h('span.t1-flip__back', { html: ICONS.speaker }),
                h('span.t1-flip__front', {}, [h('img', { src: w.image, alt: '', draggable: 'false' })]),
            ]),
        ]);
        card.dataset.word = word;
        return card;
    });
    grid.append(...cards);

    async function tap(card) {
        if (busy || card.classList.contains('is-matched') || open.includes(card)) return;
        busy = true;
        open.push(card);
        card.classList.add('is-playing');
        await playWord(card.dataset.word);
        card.classList.remove('is-playing');
        card.classList.add('is-heard');
        if (open.length < 2) {
            busy = false;
            return;
        }
        moves++;
        const [a, b] = open;
        open = [];
        if (a.dataset.word === b.dataset.word) {
            a.classList.add('is-matched');
            b.classList.add('is-matched');
            found++;
            head.update(level.number, found);
            await pause(500);
            await fb.show(true, a.dataset.word, 1100);
            if (found >= board.pairs) return finish();
        } else {
            a.classList.add('is-wrong');
            b.classList.add('is-wrong');
            BJ.audio.playEffect('wrong');
            await pause(700);
            a.classList.remove('is-wrong', 'is-heard');
            b.classList.remove('is-wrong', 'is-heard');
        }
        busy = false;
    }

    function finish() {
        const earned = soundPexesoStars(board.pairs, moves);
        finishLevel({ level, path, backHref, earned, stats: [{ icon: 'pairs', value: String(board.pairs), label: 'dvojice' }, { icon: 'tries', value: String(moves), label: 'pokusy' }] });
    }

    document.getElementById('app').replaceChildren(gameTopbar(backHref, profile), head.el, h('div.t1-stage', {}, [grid]), fb.el);
    head.update(level.number, 0);

    window.BJGame = { get busy() { return busy; }, board, cards };

    (async () => {
        await Promise.race([say('Ťukni na kartu a počúvaj. Nájdi dve karty, ktoré povedia rovnaké slovo.'), pause(5500)]);
        busy = false;
    })();
}

bootTier1(start);
