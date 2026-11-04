/**
 * Pexeso (úroveň 3 – svety písmen) – karty rozhádzané na stole.
 *
 * Dieťa otáča po dve karty. Nájdený pár = rečové cvičenie (povedz slovo,
 * 3 pokusy, dá sa preskočiť), potom sa pár odloží na kôpku (pri viacerých
 * hráčoch k hráčovi, ktorý ho našiel – ten hrá znova). Hviezdy podľa
 * správne vyslovených slov.
 *
 * URL: pexeso.html?worldId=world_r&levelId=r_002
 *      pexeso.html?custom=true&words=["rak","ryba",…]&players=[{"name":"Adam"},…]&timeLimit=0
 */
import '../bridge.js';
import { h, topbar, ICONS, stars, say, pause, endStats, endActions } from '../ui/kit.js';
import { getWord } from '../content/words.js';
import { avatarById, AVATARS } from '../core/profiles.js';
import { scatterLayout } from '../games/pexesoLayout.js';
import { pexesoPairs, makeDeck, pexesoStars } from '../games/pexeso.js';
import { feedbackLayer, playWord } from './tier1-common.js';

const BJ = window.BJ;
const MAX_SPEECH = 3;
const MIC = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="3" width="7" height="12" rx="3.5" fill="currentColor" stroke="#000"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

const q = new URLSearchParams(location.search);
const custom = q.get('custom') === 'true';
const levelId = q.get('levelId') || q.get('level');
const config = !custom && levelId && typeof getLevelConfig === 'function' ? getLevelConfig(levelId) : null;
const profile = BJ.profiles.active();
const age = window.BJAge ? window.BJAge.group() : '5-6';

function parseList(value, fallback) {
    if (!value) return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
}

const wordImage = (w) => (getWord(w) || {}).image || `images/slova/${w}.png`;

// ----- nastavenie hry -----
const words = custom
    ? parseList(q.get('words'), ['rak', 'ryba', 'ruka', 'ruža'])
    : (config && config.words) || ['rak', 'ryba', 'ruka', 'ruža', 'rosa', 'roh'];
const pairs = custom
    ? Math.min(words.length, 20)
    : pexesoPairs({
        levelPairs: (config && config.gameConfig && config.gameConfig.pairs) || 6,
        ageGroup: age,
        maxPairs: (window.BJAge && window.BJAge.get('pexeso').maxPairs) || 10,
        words: new Set(words).size,
    });
const ageTimer = !window.BJAge || window.BJAge.get('bana').timeLimit;
const timeLimit = custom ? Number(q.get('timeLimit')) || null : (ageTimer && config && config.timeLimit) || null;
const players = (custom ? parseList(q.get('players'), null) : null) || [{ name: (profile && profile.name) || 'Hráč' }];
players.forEach((p, i) => {
    p.avatar = i === 0 && profile ? profile.avatar : AVATARS[(i + (profile ? AVATARS.findIndex((a) => a.id === profile.avatar) : 0)) % AVATARS.length].id;
    p.score = 0;
});
const multi = players.length > 1;
const backHref = 'worldsmenu.html';
const deck = makeDeck(words, pairs);

// ----- stav -----
let open = [];
let busy = true;
let found = 0;
let attempts = 0;
let correct = 0;
let turn = 0;
let seconds = 0;
let timer = null;
let ended = false;

// ----- hlavička -----
const dots = Array.from({ length: deck.length / 2 }, () => h('span.round-dot'));
const attemptsEl = h('b', { text: '0' });
const timeEl = h('b', { text: '' });
const timeStat = h('span.px-stat', {}, ['⏱ ', timeEl]);
const head = h('div.game-head', {}, [
    h('h1.game-sign', { text: 'Pexeso' }),
    h('div.game-progress', {}, [
        h('div.game-sub', { text: config ? `Level ${config.levelNumber}` : 'Tréning' }),
        h('div.round-dots', {}, dots),
        h('span.px-sep'),
        h('span.px-stat', {}, ['Pokusy ', attemptsEl]),
        timeLimit ? h('span.px-sep') : null,
        timeLimit ? timeStat : null,
    ]),
]);
function updateHead() {
    dots.forEach((d, i) => d.classList.toggle('is-done', i < found));
    attemptsEl.textContent = String(attempts);
    if (timeLimit) {
        const left = Math.max(0, timeLimit - seconds);
        timeEl.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
        timeStat.classList.toggle('is-low', left <= 10);
    }
}

// ----- ľavý stĺpec: kôpka alebo hráči -----
const pileStack = h('div.px-pile__stack');
const pileLabel = h('div.px-pile__label', { text: 'Tvoje páry: 0' });
const playerEls = players.map((p) =>
    h('div.px-player', {}, [
        h('img', { src: avatarById(p.avatar).image, alt: '' }),
        h('span.px-player__name', { text: p.name }),
        h('span.px-player__score', { text: '0' }),
    ]),
);
function updatePlayers() {
    playerEls.forEach((el, i) => {
        el.classList.toggle('is-turn', i === turn);
        if (i === turn) el.dataset.tag = 'Na rade';
        else delete el.dataset.tag;
        el.querySelector('.px-player__score').textContent = String(players[i].score);
    });
}
const side = multi ? h('div.px-players', {}, playerEls) : h('div.px-pile', {}, [pileStack, pileLabel]);

// ----- stôl -----
const area = h('div.px-table__area');
const table = h('div.px-table', {}, [area]);
const cards = deck.map((c) => {
    const el = h('button.px-card', { type: 'button', 'aria-label': 'Karta', onclick: () => tap(el) }, [
        h('span.px-card__in', {}, [
            h('span.px-face.px-back', {}, [h('img', { src: 'images/banik.png', alt: '', draggable: 'false' })]),
            h('span.px-face.px-front', {}, [h('img', { src: wordImage(c.word), alt: '', draggable: 'false' }), h('span', { text: c.word })]),
        ]),
    ]);
    el.card = c;
    return el;
});
area.append(...cards);

function layoutTable() {
    const W = area.offsetWidth;
    const H = area.offsetHeight;
    if (!W || !H) return;
    const { size, cards: pos } = scatterLayout({ count: cards.length, width: W, height: H, seed: levelId || 'custom' });
    cards.forEach((el, i) => {
        el.style.setProperty('--card', `${size}px`);
        el.style.left = `${pos[i].x}px`;
        el.style.top = `${pos[i].y}px`;
        el.style.transform = `rotate(${pos[i].rot}deg)`;
    });
}

const fb = feedbackLayer();

// ----- hra -----
async function tap(el) {
    if (busy || ended || el.classList.contains('is-open') || el.classList.contains('is-gone')) return;
    el.classList.add('is-open', 'is-picked');
    BJ.audio.playEffect('flip');
    open.push(el);
    if (open.length < 2) {
        playWord(el.card.word, 1800);
        return;
    }
    busy = true;
    attempts++;
    updateHead();
    await playWord(el.card.word, 1800);
    const [a, b] = open;
    open = [];
    if (a.card.word === b.card.word) {
        a.classList.replace('is-picked', 'is-pair');
        b.classList.replace('is-picked', 'is-pair');
        BJ.audio.playEffect('correct');
        await pause(700);
        const ok = await exercise(a.card.word);
        if (ok) correct++;
        players[turn].score++;
        found++;
        await collect(a, b);
        updateHead();
        if (multi) updatePlayers();
        if (found * 2 >= cards.length) return finish(false);
        busy = false; // pri viacerých hráčoch hrá ten istý hráč znova
        return;
    }
    a.classList.add('is-wrong');
    b.classList.add('is-wrong');
    BJ.audio.playEffect('wrong');
    await pause(1100);
    for (const el2 of [a, b]) el2.classList.remove('is-open', 'is-picked', 'is-wrong');
    if (multi) {
        turn = (turn + 1) % players.length;
        updatePlayers();
    }
    await pause(250);
    busy = false;
}

/** Pár odletí na kôpku (alebo k hráčovi) a zmizne zo stola. */
async function collect(a, b) {
    const target = multi ? playerEls[turn] : pileStack;
    const ar = area.getBoundingClientRect();
    const tr = target.getBoundingClientRect();
    const scale = ar.width / area.offsetWidth || 1;
    const size = a.offsetWidth;
    const tx = (tr.left + tr.width / 2 - ar.left) / scale - size / 2;
    const ty = (tr.top + tr.height / 2 - ar.top) / scale - size / 2;
    BJ.audio.playEffect('collect');
    for (const el of [a, b]) {
        el.style.zIndex = '5';
        el.style.left = `${tx}px`;
        el.style.top = `${ty}px`;
        el.style.transform = `rotate(${el === a ? -6 : 7}deg) scale(0.6)`;
    }
    await pause(560);
    a.classList.add('is-gone');
    b.classList.add('is-gone');
    if (!multi) {
        const w = a.card.word;
        const k = pileStack.children.length;
        pileStack.append(h('div.px-face.px-front.px-pile__card', { style: `transform:rotate(${(k % 2 ? 6 : -5) + (k % 3)}deg) translate(${(k % 4) * 3}px, ${-(k % 4) * 3}px)` }, [
            h('img', { src: wordImage(w), alt: '' }),
            h('span', { text: w }),
        ]));
        while (pileStack.children.length > 4) pileStack.firstElementChild.remove();
        pileLabel.textContent = `Tvoje páry: ${players[0].score}`;
    }
}

/** Rečové cvičenie: povedz slovo (3 pokusy, Preskočiť). @returns {Promise<boolean>} */
function exercise(word) {
    stopTimer();
    return new Promise((resolve) => {
        let tries = 0;
        let listening = false;
        const tryDots = Array.from({ length: MAX_SPEECH }, () => h('span.round-dot'));
        const renderDots = () => tryDots.forEach((d, i) => {
            d.classList.toggle('is-done', i < tries);
            d.classList.toggle('is-current', i === tries);
        });
        const hint = h('div.px-ex__hint', { text: 'Povedz slovo nahlas' });
        const speak = h('button.t1-speaker', { type: 'button', 'aria-label': 'Vypočuť slovo', html: ICONS.speaker, onclick: () => !listening && speakWord() });
        const micLabel = h('span', { text: 'Hovoriť' });
        const mic = h('button.bj-btn.bj-btn--primary.px-mic', { type: 'button', onclick: listen }, [h('span', { html: MIC }), micLabel]);
        const skip = h('button.bj-btn', { type: 'button', text: 'Preskočiť', onclick: () => !listening && done(false, null) });
        const modal = h('div.bj-modal', {}, [
            h('div.bj-modal__box.bj-panel.px-ex', {}, [
                h('div.bj-title.bj-title--yellow.px-ex__title', { text: multi ? `Pár: ${players[turn].name}` : 'Našiel si pár!' }),
                h('div.px-ex__head', {}, [speak, h('h2.px-ex__word', { text: word })]),
                h('div.px-ex__pic', {}, [h('img', { src: wordImage(word), alt: '' })]),
                h('div.round-dots', {}, tryDots),
                hint,
                h('div.bj-row', {}, [skip, mic]),
            ]),
        ]);
        renderDots();
        (document.getElementById('bj-stage') || document.body).append(modal);

        async function speakWord() {
            speak.classList.add('is-speaking');
            await playWord(word, 2500);
            speak.classList.remove('is-speaking');
        }

        async function done(ok, text) {
            modal.remove();
            if (text) await fb.show(ok, text, ok ? 1100 : 1300);
            startTimer();
            resolve(ok);
        }

        async function listen() {
            if (listening) return;
            const speech = BJ.speech;
            if (!speech || !speech.isSupported()) {
                hint.textContent = 'Toto zariadenie nevie počúvať. Ťukni na Preskočiť.';
                hint.classList.add('is-bad');
                return;
            }
            listening = true;
            mic.classList.add('is-listening');
            micLabel.textContent = 'Počúvam…';
            hint.classList.remove('is-bad');
            hint.textContent = 'Hovor teraz';
            let transcript = '';
            try {
                ({ transcript } = await speech.listen());
            } catch (error) {
                listening = false;
                mic.classList.remove('is-listening');
                micLabel.textContent = 'Hovoriť';
                if (error && error.code === 'busy') return;
                hint.textContent = 'Nepočul som ťa. Skús znova.';
                hint.classList.add('is-bad');
                return;
            }
            listening = false;
            mic.classList.remove('is-listening');
            micLabel.textContent = 'Hovoriť';
            tries++;
            if (BJ.matchesWord(transcript, word)) return done(true, 'Výborne!');
            if (tries >= MAX_SPEECH) return done(false, 'Nevadí, ideme ďalej!');
            renderDots();
            hint.textContent = `Skús znova – ešte ${MAX_SPEECH - tries === 1 ? '1 pokus' : '2 pokusy'}`;
            hint.classList.add('is-bad');
            BJ.audio.playEffect('wrong');
            speakWord();
        }

        // slovo zaznie hneď (dieťa nemusí vedieť čítať)
        setTimeout(speakWord, 300);
    });
}

// ----- čas -----
function startTimer() {
    if (timer || ended) return;
    timer = setInterval(() => {
        seconds++;
        updateHead();
        if (timeLimit && seconds >= timeLimit) finish(true);
    }, 1000);
}
function stopTimer() {
    clearInterval(timer);
    timer = null;
}

// ----- koniec -----
function finish(timeout) {
    if (ended) return;
    ended = true;
    busy = true;
    stopTimer();
    const earned = timeout ? 0 : pexesoStars(correct, found);
    if (config && window.progressManager && !multi) {
        try {
            window.progressManager.saveLevelProgress(config.worldId, config.id, earned, {
                time: seconds,
                attempts,
                speechCorrect: correct,
                completion: Math.round((found / (cards.length / 2)) * 100),
            });
        } catch (e) {
            console.error('Uloženie postupu zlyhalo', e);
        }
    }
    const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    let box;
    if (multi) {
        const best = Math.max(...players.map((p) => p.score));
        const winners = players.filter((p) => p.score === best);
        const ranked = players.map((p, i) => ({ p, i })).sort((x, y) => y.p.score - x.p.score);
        box = h('div.bj-modal__box.bj-panel.end-box', {}, [
            h('h2.bj-title.bj-title--yellow', { text: winners.length > 1 ? 'Remíza!' : `Víťaz: ${winners[0].name}` }),
            h('div.px-rank', {}, ranked.map(({ p, i }) => {
                const el = playerEls[i].cloneNode(true);
                el.classList.remove('is-turn');
                if (p.score === best) el.dataset.tag = 'Víťaz';
                else delete el.dataset.tag;
                return el;
            })),
            endStats([
                { icon: 'mic', value: `${correct} / ${found}`, label: 'slová' },
                { icon: 'tries', value: String(attempts), label: 'pokusy' },
                { icon: 'time', value: time, label: 'čas' },
            ]),
            endActions({ replay: location.href, map: backHref }),
        ]);
        say(winners.length > 1 ? 'Remíza!' : 'Máme víťaza!');
    } else {
        const title = timeout ? 'Čas vypršal!' : earned === 3 ? 'Výborne!' : earned >= 1 ? 'Dobrá práca!' : 'Skúsime znova?';
        const next = config && earned >= 1 && typeof getNextLevel === 'function' ? getNextLevel(config.id) : null;
        const nextUrl = next ? (window.BJRoute ? window.BJRoute.levelUrl(next.worldId, next.id) : `pexeso.html?worldId=${next.worldId}&levelId=${next.id}`) : null;
        box = h('div.bj-modal__box.bj-panel.end-box', { 'data-reward-slot': '' }, [
            h('h2.bj-title.bj-title--yellow', { text: title }),
            h('div.end-stars', {}, [stars(earned)]),
            endStats([
                { icon: 'mic', value: `${correct} / ${found}`, label: 'slová' },
                { icon: 'pairs', value: `${found} / ${cards.length / 2}`, label: 'páry' },
                { icon: 'tries', value: String(attempts), label: 'pokusy' },
                { icon: 'time', value: time, label: 'čas' },
            ]),
            endActions({ replay: location.href, map: backHref, next: nextUrl }),
        ]);
        say(title);
    }
    if (!timeout) BJ.audio.playEffect('win');
    (document.getElementById('bj-stage') || document.body).append(h('div.bj-modal', {}, [box]));
}

// ----- spustenie -----
document.getElementById('app').replaceChildren(
    topbar({ back: backHref, profile, album: false }),
    head,
    h('div.px-stage', {}, [side, table]),
    fb.el,
);
updateHead();
if (multi) updatePlayers();
requestAnimationFrame(layoutTable);
window.addEventListener('resize', () => requestAnimationFrame(layoutTable));

// stav hry pre automatické testy
window.BJGame = {
    deck,
    cards,
    get busy() { return busy; },
    get found() { return found; },
    get ended() { return ended; },
    tap: (i) => tap(cards[i]),
};

(async () => {
    await Promise.race([say(multi ? 'Hráči sa striedajú. Nájdi dve rovnaké karty.' : 'Otáčaj karty a nájdi dve rovnaké.'), pause(3500)]);
    busy = false;
    startTimer();
})();
