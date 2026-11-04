/**
 * Úroveň 3 – Slová: svety písmen (worldsmenu.html).
 *
 * Vľavo pás s písmenami, vpravo mapa sveta s cestou 16 levelov v troch radoch
 * (6 + 5 + 5, hadovito), ako cesta v úrovni 1. Hore: hviezdy sveta a tréningy
 * (pexeso, baňa). Zelené ▶ spustí aktuálny level.
 *
 * Postup ukladá js/managers/progressManager.js (window.progressManager).
 * URL: worldsmenu.html?world=world_r (inak naposledy vybraný svet)
 */
import '../bridge.js';
import { h, topbar, ICONS, stars, centeredGlyph, requireProfile, modal, say } from '../ui/kit.js';
import { avatarById } from '../core/profiles.js';

const app = document.getElementById('app');
const profile = requireProfile();
const KEY = 'bj.world';

const PLAYER = 'images/superjozino/assets/player/keyframes/yellow_hat/__yellow_hat_';
const TYPE = {
    banik: { img: `${PLAYER}use_pickaxe_002.png`, name: 'Baňa' },
    pexeso: { img: 'images/pexeso-icon.png', name: 'Pexeso' },
    mario: { img: `${PLAYER}jump_000.png`, name: 'Super Jožino' },
};
const I_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/></svg>';
const I_CARDS = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="11" height="15" rx="2" fill="#4FC3F7" stroke="#000" stroke-width="1.2" transform="rotate(-10 8.5 12.5)"/><rect x="9" y="3.5" width="11" height="15" rx="2" fill="#FFD54F" stroke="#000" stroke-width="1.2" transform="rotate(8 14.5 11)"/></svg>';
const I_PICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.5C7 4.5 15 3.5 21 6.5c-5-.6-9.3.3-13 3.2z" fill="#cfd8dc" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/><path d="M11.8 7.6 6 21" stroke="#000" stroke-width="4.2" stroke-linecap="round"/><path d="M11.8 7.6 6 21" stroke="#a0682f" stroke-width="2.4" stroke-linecap="round"/></svg>';
const I_UP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 15l7-7 7 7" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// ----- postup -----
const pm = () => window.progressManager;
function levelProg(world, level) {
    try {
        const w = pm() && pm().getWorldProgress(world.id);
        return (w && w.levels && w.levels[level.id]) || null;
    } catch {
        return null;
    }
}
function levelStars(world, level) {
    const p = levelProg(world, level);
    return (p && p.stars) || 0;
}
function isUnlocked(world, levels, i) {
    if (i === 0) return true;
    const p = levelProg(world, levels[i]);
    return !!(p && p.isUnlocked) || levelStars(world, levels[i - 1]) > 0;
}
function worldStars(world) {
    return getWorldLevels(world.id).reduce((s, l) => s + levelStars(world, l), 0);
}
function currentIndex(world, levels) {
    let cur = 0;
    levels.forEach((_, i) => {
        if (isUnlocked(world, levels, i)) cur = i;
    });
    // prvý odomknutý level bez hviezd (inak posledný odomknutý)
    const firstOpen = levels.findIndex((l, i) => isUnlocked(world, levels, i) && levelStars(world, l) === 0);
    return firstOpen >= 0 ? firstOpen : cur;
}
const levelUrl = (world, level) =>
    window.BJRoute ? window.BJRoute.levelUrl(world.id, level.id) : `game.html?worldId=${world.id}&levelId=${level.id}`;

// ----- mapa: 3 rady (6 + 5 + 5) hadovito -----
const VW = 1600;
const VH = 650;
const ROWS = [6, 5, 5];
function mapPoints(count) {
    const slot = (VW - 340) / 5;
    const pts = [];
    let r = 0;
    while (pts.length < count) {
        const n = ROWS[r] ?? 6;
        for (let k = 0; k < n && pts.length < count; k++) {
            const col = r % 2 === 0 ? k : 5 - k;
            pts.push({ x: 170 + col * slot, y: VH * (0.2 + r * 0.31) + 14 * Math.sin(k * 1.7 + r) });
        }
        r++;
    }
    return pts;
}
function roadPath(pts) {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        if (Math.abs(a.y - b.y) > VH * 0.2) {
            const side = a.x > VW / 2 ? 140 : -140;
            d += ` C ${a.x + side} ${a.y}, ${b.x + side} ${b.y}, ${b.x} ${b.y}`;
        } else d += ` Q ${(a.x + b.x) / 2} ${(a.y + b.y) / 2 - 34}, ${b.x} ${b.y}`;
    }
    return d;
}

function renderMap(world) {
    const levels = getWorldLevels(world.id);
    const pts = mapPoints(levels.length);
    const cur = currentIndex(world, levels);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'path-line');
    svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    const d = roadPath(pts);
    svg.innerHTML = `<path d="${d}" class="path-line__shadow"/><path d="${d}" class="path-line__road"/>`;
    const hero = avatarById(profile.avatar).image;
    const nodes = levels.map((l, i) => {
        const open = isUnlocked(world, levels, i);
        const s = levelStars(world, l);
        const cls = ['path-node', open ? (s > 0 ? 'is-done' : 'is-open') : 'is-locked'];
        if (i === cur) cls.push('is-current');
        const type = TYPE[l.gameType] || TYPE.banik;
        return h(`div.${cls.join('.')}`, { style: { left: `${(pts[i].x / VW) * 100}%`, top: `${(pts[i].y / VH) * 100}%` } }, [
            i === cur ? h(`img.path-node__hero${pts[i].x < VW * 0.25 ? '.is-right' : ''}`, { src: hero, alt: '' }) : null,
            open
                ? h('a.path-node__btn', { href: levelUrl(world, l), 'aria-label': `Level ${l.levelNumber}: ${type.name}` }, [centeredGlyph(l.levelNumber, { size: 54, stroke: 3.2 })])
                : h('span.path-node__btn', { 'aria-label': `Level ${l.levelNumber} – zamknutý`, html: ICONS.lock }),
            open ? h('span.sv-type', { title: type.name }, [h('img', { src: type.img, alt: '' })]) : null,
            open ? stars(s) : null,
        ]);
    });
    const play = h('a.sv-play', { href: levelUrl(world, levels[cur]), 'aria-label': 'Hrať', html: I_PLAY });
    return h('div.path-map.bj-panel.sv-map', { style: { backgroundImage: `url('${world.icon}')` } }, [h('div.path-map__shade'), svg, ...nodes, play]);
}

// ----- pás písmen -----
const RAIL = 6;
let railStart = 0;
function renderRail(worlds, world) {
    const idx = worlds.indexOf(world);
    if (idx < railStart) railStart = idx;
    if (idx >= railStart + RAIL) railStart = idx - RAIL + 1;
    railStart = Math.max(0, Math.min(railStart, worlds.length - RAIL));
    const visible = worlds.slice(railStart, railStart + RAIL);
    const arrow = (dir) =>
        h(`button.sv-rail__arrow.sv-rail__arrow--${dir}`, {
            type: 'button',
            'aria-label': dir === 'up' ? 'Predchádzajúce písmená' : 'Ďalšie písmená',
            html: I_UP,
            disabled: dir === 'up' ? railStart === 0 : railStart + RAIL >= worlds.length,
            onclick: () => {
                railStart += dir === 'up' ? -RAIL : RAIL;
                railStart = Math.max(0, Math.min(railStart, worlds.length - RAIL));
                render();
            },
        });
    return h('div.sv-rail', {}, [
        arrow('up'),
        ...visible.map((w) =>
            h(`button.sv-letter${w === world ? '.is-active' : ''}`, {
                type: 'button',
                'aria-label': `Svet písmena ${w.name}`,
                style: { backgroundImage: `url('${w.icon}')` },
                onclick: () => select(w.id),
            }, [h('span', { text: w.name })]),
        ),
        arrow('down'),
    ]);
}

// ----- tréningy -----
function wordsOf(world, onlyOpen) {
    const levels = getWorldLevels(world.id);
    const out = [];
    levels.forEach((l, i) => {
        if (onlyOpen && !isUnlocked(world, levels, i)) return;
        (l.words || []).forEach((w) => out.includes(w) || out.push(w));
    });
    return out;
}
function wordPicker(world, max) {
    const chosen = new Set(wordsOf(world, true).slice(0, max));
    const list = h('div.sv-words');
    let all = false;
    const draw = () => {
        list.replaceChildren(...wordsOf(world, !all).map((w) =>
            h(`button.sv-word${chosen.has(w) ? '.is-on' : ''}`, {
                type: 'button',
                text: w,
                onclick: () => {
                    if (chosen.has(w)) chosen.delete(w);
                    else if (chosen.size < max) chosen.add(w);
                    draw();
                },
            }),
        ));
    };
    draw();
    const toggle = h('label.sv-check', {}, [
        h('input', { type: 'checkbox', onchange: (e) => { all = e.target.checked; draw(); } }),
        h('span', { text: 'Ukázať aj slová zo zamknutých levelov' }),
    ]);
    return { el: h('div.sv-picker', {}, [list, toggle]), get words() { return [...chosen]; } };
}

function trainingBana(world) {
    const picker = wordPicker(world, 8);
    const m = modal(h('div.sv-train', {}, [
        h('h2.bj-title.bj-title--yellow', { text: 'Tréning – Baňa' }),
        h('div.bj-text', { text: 'Vyber slová, ktoré chceš precvičiť (najviac 8).' }),
        picker.el,
        h('div.bj-row', {}, [
            h('button.bj-btn.bj-btn--primary', {
                type: 'button',
                text: 'Hrať',
                onclick: () => {
                    const words = picker.words;
                    if (!words.length) return;
                    const n = words.length;
                    const config = {
                        words,
                        timeLimit: null,
                        isTraining: true,
                        gameConfig: { diamonds: n, golds: n + 2, crystals: Math.max(1, Math.round(n / 3)), speechExercises: n, listeningExercises: Math.max(1, Math.round(n / 3)) },
                    };
                    const page = window.BJRoute ? window.BJRoute.banikPage() : 'game.html';
                    location.href = `${page}?training=true&config=${encodeURIComponent(JSON.stringify(config))}`;
                },
            }),
        ]),
    ]));
    return m;
}

function trainingPexeso(world) {
    const picker = wordPicker(world, 10);
    let count = 1;
    const names = Array.from({ length: 4 }, (_, i) => h('input.sv-name', { type: 'text', maxlength: '12', value: i === 0 ? profile.name : `Hráč ${i + 1}`, 'aria-label': `Meno hráča ${i + 1}` }));
    const namesBox = h('div.sv-names');
    const countBtns = [1, 2, 3, 4].map((n) => h('button.sv-count', { type: 'button', text: String(n), onclick: () => { count = n; draw(); } }));
    const draw = () => {
        countBtns.forEach((b, i) => b.classList.toggle('is-on', i + 1 === count));
        namesBox.replaceChildren(...(count > 1 ? names.slice(0, count) : []));
    };
    draw();
    modal(h('div.sv-train', {}, [
        h('h2.bj-title.bj-title--yellow', { text: 'Tréning – Pexeso' }),
        h('div.bj-text', { text: 'Vyber slová (najviac 10) a počet hráčov.' }),
        picker.el,
        h('div.sv-players', {}, [h('span.sv-label', { text: 'Hráči' }), ...countBtns]),
        namesBox,
        h('div.bj-row', {}, [
            h('button.bj-btn.bj-btn--primary', {
                type: 'button',
                text: 'Hrať',
                onclick: () => {
                    const words = picker.words;
                    if (words.length < 2) return;
                    const players = names.slice(0, count).map((el, i) => ({ name: el.value.trim() || `Hráč ${i + 1}` }));
                    const params = new URLSearchParams({ custom: 'true', training: 'true', words: JSON.stringify(words), players: JSON.stringify(players), timeLimit: '0', worldId: world.id });
                    location.href = `pexeso.html?${params}`;
                },
            }),
        ]),
    ]));
}

// ----- obrazovka -----
let worlds = [];
let world = null;

function render() {
    const total = getWorldLevels(world.id).length * 3;
    app.replaceChildren(
        topbar({ back: 'urovne.html', profile }),
        h('div.sv-topleft', {}, [
            h('div.sv-starchip', { 'aria-label': 'Hviezdy v tomto svete' }, [stars(1, 1), h('span', { text: `${worldStars(world)} / ${total}` })]),
            h('button.sv-round', { type: 'button', 'aria-label': 'Tréning – Pexeso', html: I_CARDS, onclick: () => trainingPexeso(world) }),
            h('button.sv-round', { type: 'button', 'aria-label': 'Tréning – Baňa', html: I_PICK, onclick: () => trainingBana(world) }),
        ]),
        h('div.chapter-head.sv-title', {}, [
            h('div.chapter-title', {}, [h('div.chapter-title__small', { text: 'Slová · svet písmena' }), h('h1.bj-title', { text: `Písmeno ${world.name}` })]),
        ]),
        h('div.sv-body', {}, [renderRail(worlds, world), renderMap(world)]),
    );
}

function select(id) {
    world = worlds.find((w) => w.id === id) || worlds[0];
    try {
        sessionStorage.setItem(KEY, world.id);
    } catch { /* bez pamäte */ }
    const url = new URL(location.href);
    url.searchParams.set('world', world.id);
    history.replaceState(null, '', url);
    render();
}

if (profile) {
    worlds = getAllWorlds().filter((w) => getWorldLevels(w.id).length);
    const q = new URLSearchParams(location.search);
    let start = q.get('world') || q.get('worldId');
    try {
        start = start || sessionStorage.getItem(KEY);
    } catch { /* bez pamäte */ }
    select(start || worlds[0].id);
    say('Vyber si písmeno a ťukni na zelené tlačidlo.');
}
