/**
 * Menu „Všetky hry“ – priame spustenie ktorejkoľvek hry (voľná hra).
 *
 *  - Počúvam: minihry úrovne 1 (?free=1 – bez zámkov, postup sa neukladá)
 *  - Slová: Baňa, Malá baňa, Pexeso, Super Jožino pre vybrané písmeno
 *    (prvý level daného typu vo svete písmena)
 *  - Tvorím: builder levelov a vlastný level Super Jožina
 *
 * Vybraná záložka a písmeno sa pamätajú (sessionStorage).
 */
import '../bridge.js';
import { h, topbar, requireProfile, speakerButton } from '../ui/kit.js';
import { MINIGAMES } from '../core/minigames.js';
import { getWord } from '../content/words.js';

const app = document.getElementById('app');
const profile = requireProfile();

const KEY = 'bj.hry';
function loadState() {
    try {
        return JSON.parse(sessionStorage.getItem(KEY) || '{}');
    } catch {
        return {};
    }
}
function saveState(s) {
    try {
        sessionStorage.setItem(KEY, JSON.stringify(s));
    } catch { /* bez pamäte */ }
}

const PLAYER = 'images/superjozino/assets/player/keyframes/yellow_hat/__yellow_hat_';
const wordImg = (w) => (getWord(w) || {}).image || '';

const BELL_SVG = `<svg viewBox="0 0 100 120" aria-hidden="true"><rect x="46" y="0" width="8" height="22" fill="#7a4a22"/><circle cx="50" cy="24" r="8" fill="#5a3418" stroke="#000" stroke-width="2"/><path d="M50 28c-20 0-28 18-28 38v18l-10 12h76l-10-12V66c0-20-8-38-28-38z" fill="#ffd34d" stroke="#000" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="104" r="9" fill="#5a3418" stroke="#000" stroke-width="3"/></svg>`;
const CART_SVG = `<svg viewBox="0 0 300 170" aria-hidden="true"><path d="M18 18h264l-26 112H44z" fill="#e8553f" stroke="#000" stroke-width="7" stroke-linejoin="round"/><text x="150" y="104" text-anchor="middle" font-family="Luckiest Guy" font-size="96" fill="#FFD900" stroke="#000" stroke-width="3">R</text><circle cx="84" cy="140" r="24" fill="#3a2a1c" stroke="#000" stroke-width="6"/><circle cx="216" cy="140" r="24" fill="#3a2a1c" stroke="#000" stroke-width="6"/></svg>`;
const SPEAKER_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="#FFD900" stroke="#000" stroke-width="1"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#FFD900" stroke-width="2.4" stroke-linecap="round"/></svg>';
const HAMMER_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="10.2" y="9" width="3.6" height="13" rx="1.2" fill="#a0682f" stroke="#000" stroke-width="1"/><path d="M4 4.5h12l3 2.5-3 2.5H4z" fill="#b8c2cc" stroke="#000" stroke-width="1.1" stroke-linejoin="round"/></svg>';

/** Dlaždice minihier úrovne 1 (poradie a stav z core/minigames.js). */
const TIER1_ART = {
    'same-different': { img: 'images/rovnake.png' },
    'find-picture': { img: wordImg('lopta') || wordImg('lev') },
    'sound-pexeso': { svg: SPEAKER_SVG },
    'mine-bells': { svg: BELL_SVG },
    'phoneme-train': { svg: CART_SVG },
};
const AGE_NOTE = { '5-6': 'od 5 rokov', '7-8': 'od 7 rokov' };

function tile({ title, note, href, img, svg, bg, planned }) {
    const art = h('div.game-tile__art', bg ? { style: { backgroundImage: `url('${bg}')` } } : {}, [
        img ? h('img', { src: img, alt: '', draggable: 'false' }) : h('span.game-tile__svg', { html: svg || '' }),
    ]);
    const body = [art, h('div.game-tile__title', { text: title }), note ? h('div.game-tile__note', { text: note }) : null];
    if (planned || !href) return h('div.game-tile.bj-panel.is-planned', { 'aria-disabled': 'true' }, [...body, h('div.game-tile__soon', { text: 'Čoskoro' })]);
    return h('a.game-tile.bj-panel', { href, 'aria-label': title }, body);
}

function tier1Tiles() {
    return MINIGAMES.filter((g) => g.tiers.includes(1)).map((g) => {
        const art = TIER1_ART[g.id] || {};
        const minAge = g.ages[0];
        return tile({
            title: g.title,
            note: AGE_NOTE[minAge] || null,
            href: g.page ? `${g.page}?free=1` : null,
            planned: g.status !== 'ready',
            bg: 'images/worlds/world_l.png',
            ...art,
        });
    });
}

/** Svety písmen (z config/worlds.js) – len tie, ktoré majú levely. */
function letterWorlds() {
    const all = typeof getAllWorlds === 'function' ? getAllWorlds() : [];
    return all.filter((w) => typeof getWorldLevels === 'function' && getWorldLevels(w.id).length);
}

function firstLevel(worldId, type) {
    return getWorldLevels(worldId).find((l) => l.gameType === type) || null;
}

function wordTiles(world) {
    const q = (type, page) => {
        const l = firstLevel(world.id, type);
        return l ? `${page}?worldId=${world.id}&levelId=${l.id}` : null;
    };
    const bg = world.icon;
    return [
        tile({ title: 'Baňa', note: 'preskúmaj tmavú baňu', href: q('banik', 'bana.html'), img: `${PLAYER}use_pickaxe_002.png`, bg }),
        tile({ title: 'Malá baňa', note: 'pre najmenších', href: q('banik', 'game.html'), img: 'images/banik-icon.png', bg }),
        tile({ title: 'Pexeso', note: 'nájdi dvojice', href: q('pexeso', 'pexeso.html'), img: 'images/pexeso-icon.png', bg }),
        tile({ title: 'Super Jožino', note: 'skákacia hra', href: q('mario', 'superjozino.html'), img: `${PLAYER}jump_000.png`, bg }),
    ];
}

function makerTiles() {
    let hasCustom = false;
    try {
        hasCustom = !!JSON.parse(localStorage.getItem('sj.custom') || 'null')?.last;
    } catch { /* nič */ }
    return [
        tile({ title: 'Staviteľ levelov', note: 'postav si level Super Jožina', href: 'builder.html', svg: HAMMER_SVG, bg: 'images/worlds/world_k.png' }),
        tile({
            title: 'Môj level',
            note: hasCustom ? 'zahraj si posledný postavený' : 'najprv ho postav v staviteľovi',
            href: hasCustom ? 'superjozino.html?custom=last' : 'builder.html',
            img: `${PLAYER}run_000.png`,
            bg: 'images/worlds/world_k.png',
        }),
    ];
}

const TABS = [
    { id: 'listen', title: 'Počúvam' },
    { id: 'words', title: 'Slová' },
    { id: 'make', title: 'Tvorím' },
];

if (profile) {
    const state = { tab: 'listen', world: 'world_r', ...loadState() };
    const worlds = letterWorlds();
    if (!worlds.some((w) => w.id === state.world) && worlds[0]) state.world = worlds[0].id;

    const tabsEl = h('div.hry-tabs', { role: 'tablist' });
    const letters = h('div.hry-letters');
    const grid = h('div.hry-grid');

    function render() {
        saveState(state);
        tabsEl.replaceChildren(...TABS.map((t) => h('button.hry-tab', {
            type: 'button',
            role: 'tab',
            'aria-selected': String(state.tab === t.id),
            class: `hry-tab${state.tab === t.id ? ' is-active' : ''}`,
            text: t.title,
            onclick: () => { state.tab = t.id; render(); },
        })));
        letters.hidden = state.tab !== 'words';
        if (state.tab === 'words') {
            letters.replaceChildren(...worlds.map((w) => h('button', {
                type: 'button',
                class: `hry-letter${state.world === w.id ? ' is-active' : ''}`,
                text: w.name,
                'aria-label': `Písmeno ${w.name}`,
                onclick: () => { state.world = w.id; render(); },
            })));
        }
        const world = worlds.find((w) => w.id === state.world);
        const tiles = state.tab === 'listen' ? tier1Tiles() : state.tab === 'words' ? (world ? wordTiles(world) : []) : makerTiles();
        grid.className = `hry-grid hry-grid--${tiles.length}`;
        grid.replaceChildren(...tiles);
    }

    app.replaceChildren(
        topbar({ back: 'index.html', profile }),
        h('div.bj-say', {}, [speakerButton('Vyber si hru, ktorú chceš hrať.')]),
        h('div.tiers-head', {}, [h('h1.bj-title', { text: 'Všetky hry' })]),
        h('div.hry', {}, [tabsEl, letters, grid]),
    );
    render();
}
