// NÁVRHY – svety písmen, vyhodnotenie, zatváranie okien (?v=…)
import '../src/bridge.js';
import { h, topbar, ICONS, stars, centeredGlyph } from '../src/ui/kit.js';

const v = new URLSearchParams(location.search).get('v') || 'a';
const profile = window.BJ.profiles.active();
const app = document.getElementById('app');
const world = getAllWorlds().find((w) => w.id === 'world_r');
const levels = getWorldLevels('world_r');
const STARS = [3, 2, 3, 1, 2, 0]; // hotové levely
const CURRENT = 5;
const PLAYER = 'images/superjozino/assets/player/keyframes/yellow_hat/__yellow_hat_';
const TYPE = {
    banik: { img: `${PLAYER}use_pickaxe_002.png`, name: 'Baňa' },
    pexeso: { img: 'images/pexeso-icon.png', name: 'Pexeso' },
    mario: { img: `${PLAYER}jump_000.png`, name: 'Super Jožino' },
};
const STAGES = ['Na začiatku', 'Na konci', 'V strede', 'Zhluky'];
const state = (i) => (i < CURRENT ? 'done' : i === CURRENT ? 'current' : 'locked');
const total = STARS.reduce((a, b) => a + b, 0);

// výber sveta – rovnaký vo všetkých variantoch
function worldPicker() {
    const letters = getAllWorlds().slice(0, 7);
    return h('div.mw-picker', {}, [
        h('button.chapter-arrow.chapter-arrow--left', { type: 'button' }),
        ...letters.map((w) => h(`button.mw-letter${w.id === world.id ? '.is-active' : ''}`, { type: 'button', style: { backgroundImage: `url('${w.icon}')` } }, [h('span', { text: w.name })])),
        h('button.chapter-arrow.chapter-arrow--right', { type: 'button' }),
    ]);
}

function typeBadge(t) {
    return h('span.mw-type', { title: TYPE[t].name }, [h('img', { src: TYPE[t].img, alt: '' })]);
}

// ===== A: cesta (ako v úrovni 1) =====
function variantA() {
    const W = 1760, H = 560;
    const pts = levels.map((_, i) => {
        const row = Math.floor(i / 8);
        const k = i % 8;
        const col = row === 0 ? k : 7 - k;
        return { x: 150 + col * ((W - 380) / 7), y: (row === 0 ? 150 : 410) + 30 * Math.sin(k * 1.3) };
    });
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        if (i === 8) d += ` C ${a.x + 150} ${a.y}, ${b.x + 150} ${b.y}, ${b.x} ${b.y}`;
        else d += ` Q ${(a.x + b.x) / 2} ${(a.y + b.y) / 2 - 50}, ${b.x} ${b.y}`;
    }
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'path-line');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.innerHTML = `<path d="${d}" class="path-line__shadow"/><path d="${d}" class="path-line__road"/>`;
    const nodes = levels.map((l, i) => {
        const st = state(i);
        return h(`div.path-node.is-${st === 'done' ? 'done' : st === 'current' ? 'open.is-current' : 'locked'}`.replace('.is-open.is-current', '.is-open.is-current'), { style: { left: `${(pts[i].x / W) * 100}%`, top: `${(pts[i].y / H) * 100}%` } }, [
            st === 'current' ? h('img.path-node__hero', { src: 'images/superjozino/assets/player/keyframes/yellow_hat/__yellow_hat_idle_000.png', alt: '' }) : null,
            st === 'locked'
                ? h('span.path-node__btn', { html: ICONS.lock })
                : h('a.path-node__btn', {}, [centeredGlyph(l.levelNumber, { size: 54, stroke: 3.2 })]),
            st !== 'locked' ? typeBadge(l.gameType) : null,
            st !== 'locked' ? stars(STARS[i] || 0) : null,
        ]);
    });
    const signs = STAGES.map((s, k) => {
        const p = pts[k * 4];
        return h('div.mw-sign', { text: s, style: { left: `${(p.x / W) * 100}%`, top: `${((p.y - 92) / H) * 100}%` } });
    });
    return [
        h('div.path-map.bj-panel.mw-map', { style: { backgroundImage: `url('${world.icon}')` } }, [h('div.path-map__shade'), svg, ...signs, ...nodes]),
        h('div.path-footer', {}, [
            h('button.bj-btn.mw-train', { type: 'button' }, [h('img', { src: 'images/pexeso-icon.png', alt: '' }), h('span', { text: 'Tréning' })]),
            h('div.path-footer__center', {}, [
                h('div.path-footer__stars', {}, [stars(1, 1), h('span', { text: `${total} / 48` })]),
                h('a.bj-btn.bj-btn--primary.path-play', { text: 'Hrať' }),
            ]),
            h('button.bj-btn.mw-train', { type: 'button' }, [h('img', { src: `${PLAYER}use_pickaxe_002.png`, alt: '' }), h('span', { text: 'Tréning' })]),
        ]),
    ];
}

function levelTile(l, i, big) {
    const st = state(i);
    return h(`div.mw-tile.is-${st}${big ? '.mw-tile--big' : ''}`, {}, [
        h('div.mw-tile__art', {}, [st === 'locked' ? h('span.mw-tile__lock', { html: ICONS.lock }) : h('img', { src: TYPE[l.gameType].img, alt: '' })]),
        h('div.mw-tile__num', {}, [centeredGlyph(l.levelNumber, { size: 60, stroke: 3 })]),
        st !== 'locked' ? stars(STARS[i] || 0) : h('div.mw-tile__type', { text: TYPE[l.gameType].name }),
    ]);
}

// ===== B: 4 etapy ako stĺpce =====
function variantB() {
    return [
        h('div.mw-stages', {}, STAGES.map((s, k) =>
            h(`div.mw-stage.bj-panel${k > 1 ? '.is-locked' : ''}`, {}, [
                h('div.mw-stage__head', {}, [h('span.mw-stage__n', {}, [centeredGlyph(k + 1, { size: 60, stroke: 3 })]), h('span', { text: `R ${s.toLowerCase()}` })]),
                h('div.mw-stage__grid', {}, levels.slice(k * 4, k * 4 + 4).map((l, j) => levelTile(l, k * 4 + j))),
                h('div.mw-stage__stars', {}, [stars(1, 1), h('span', { text: `${STARS.slice(k * 4, k * 4 + 4).reduce((a, b) => a + b, 0)} / 12` })]),
            ]),
        )),
    ];
}

// ===== C: karta sveta + mriežka levelov =====
function variantC() {
    return [
        h('div.mw-split', {}, [
            h('div.mw-world.bj-panel', {}, [
                h('div.mw-world__art', { style: { backgroundImage: `url('${world.icon}')` } }, [h('div.tier-card__number', {}, [centeredGlyph('R', { size: 72, stroke: 2.6 })])]),
                h('div.mw-world__title', { text: 'Svet písmena R' }),
                h('div.tier-card__stars', {}, [stars(1, 1), h('span', { text: `${total} / 48` })]),
                h('div.mw-world__train', {}, [
                    h('button.bj-btn', { type: 'button', text: 'Tréning pexeso' }),
                    h('button.bj-btn', { type: 'button', text: 'Tréning baňa' }),
                ]),
            ]),
            h('div.mw-grid', {}, levels.map((l, i) => levelTile(l, i))),
        ]),
    ];
}

// ===== vyhodnotenie levelu =====
function stat(icon, value, label, cls = '') {
    return h(`div.mw-stat${cls}`, {}, [h('div.mw-stat__icon', { html: icon }), h('div.mw-stat__value', { text: value }), h('div.mw-stat__label', { text: label })]);
}
const I_TIME = '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8" fill="#fff7e0" stroke="#000" stroke-width="1.6"/><path d="M12 9v4.5l3 2" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/><rect x="10" y="2.5" width="4" height="3" rx="1" fill="#ECCF17" stroke="#000"/></svg>';
const I_MOUTH = '<svg viewBox="0 0 24 24"><rect x="8.5" y="3" width="7" height="12" rx="3.5" fill="#FFD900" stroke="#000"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" fill="none" stroke="#FFD900" stroke-width="2.4" stroke-linecap="round"/></svg>';
const I_EAR = ICONS.speaker;
function endModal(kind) {
    const good = kind !== 'bad';
    const title = good ? 'Výborne!' : 'Skúsime znova?';
    let body;
    if (kind === 'b' || kind === 'bad') {
        body = h('div.mw-endB', {}, [
            h('img.mw-endB__hero', { src: good ? 'images/banik.png' : 'images/banik.png', alt: '' }),
            h('div.mw-endB__right', {}, [
                h('h2.bj-title.bj-title--yellow', { text: title }),
                h('div.end-stars', {}, [stars(good ? 2 : 0)]),
                h('ul.mw-check', {}, [
                    h(`li${good ? '.is-ok' : ''}`, {}, [h('span', { text: good ? '✔' : '✖' }), `Povedal si ${good ? 3 : 1} zo 4 slov`]),
                    h('li.is-ok', {}, [h('span', { text: '✔' }), 'Rozpoznal si 2 z 2 dvojíc']),
                    h('li.is-info', {}, [h('span', { html: I_TIME }), 'Čas: 1:42']),
                ]),
                h('div.bj-row', {}, [h('a.bj-btn', { text: 'Znova' }), h('a.bj-btn', { text: 'Mapa' }), good ? h('a.bj-btn.bj-btn--primary', { text: 'Ďalej' }) : null]),
            ]),
        ]);
    } else {
        body = h('div.mw-endA', {}, [
            h('h2.bj-title.bj-title--yellow', { text: title }),
            h('div.end-stars', {}, [stars(2)]),
            h('div.mw-stats', {}, [stat(I_MOUTH, '3 / 4', 'slová'), stat(I_EAR, '2 / 2', 'počúvanie'), stat(I_TIME, '1:42', 'čas')]),
            h('div.bj-row', {}, [h('a.bj-btn', { text: 'Znova' }), h('a.bj-btn', { text: 'Mapa' }), h('a.bj-btn.bj-btn--primary', { text: 'Ďalej' })]),
        ]);
    }
    return h('div.bj-modal', {}, [h('div.bj-modal__box.bj-panel.mw-end', {}, [body])]);
}

// ===== jednotné tlačidlo zatvorenia =====
const closeBtn = () => h('button.mw-close', { type: 'button', 'aria-label': 'Zavrieť', html: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="3.6" stroke-linecap="round"/></svg>' });
function closeDemo() {
    return h('div.bj-modal', {}, [
        h('div.mw-closedemo', {}, [
            h('div.bj-modal__box.bj-panel.mw-mini', {}, [closeBtn(), h('h2.bj-title.bj-title--yellow', { text: 'Nastavenia' }), h('div.bj-text', { text: 'Zvuky, hlas…' })]),
            h('div.bj-modal__box.bj-panel.mw-mini', {}, [closeBtn(), h('h2.bj-title.bj-title--yellow', { text: 'Level 6' }), h('div.bj-text', { text: 'R na konci slova · Baňa' })]),
            h('div.bj-modal__box.bj-panel.mw-mini', {}, [closeBtn(), h('h2.bj-title.bj-title--yellow', { text: 'Pravidlá' }), h('div.bj-text', { text: 'Vitaj v hre…' })]),
        ]),
    ]);
}

const head = h('div.mw-head', {}, [worldPicker()]);
const tb = topbar({ back: 'urovne.html', profile });
if (v === 'a') app.replaceChildren(tb, head, ...variantA());
if (v === 'b') app.replaceChildren(tb, head, ...variantB());
if (v === 'c') app.replaceChildren(tb, head, ...variantC());
if (v.startsWith('end')) {
    app.replaceChildren(tb, head, ...variantB());
    document.getElementById('bj-stage').append(endModal(v.slice(3)));
}
if (v === 'close') {
    app.replaceChildren(tb, head, ...variantB());
    document.getElementById('bj-stage').append(closeDemo());
}

// ===== kolo 2: cesta A bez tabuliek, nové menu písmen, ovládanie na mape =====
const I_PLAY = '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/></svg>';
const I_REPLAY = '<svg viewBox="0 0 24 24"><path d="M19 12a7 7 0 1 1-2.05-4.95" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M18.5 3.5v4.5H14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const I_MAP = '<svg viewBox="0 0 24 24"><path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" fill="currentColor" stroke="#000" stroke-width="1.3" stroke-linejoin="round"/><path d="M9 4v13.5M15 6.5V20" stroke="#000" stroke-width="1.3"/></svg>';
const I_CARDS = '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="11" height="15" rx="2" fill="#4FC3F7" stroke="#000" stroke-width="1.2" transform="rotate(-10 8.5 12.5)"/><rect x="9" y="3.5" width="11" height="15" rx="2" fill="#FFD54F" stroke="#000" stroke-width="1.2" transform="rotate(8 14.5 11)"/></svg>';
const I_PICK = '<svg viewBox="0 0 24 24"><path d="M3 9.5C7 4.5 15 3.5 21 6.5c-5-.6-9.3.3-13 3.2z" fill="#cfd8dc" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/><path d="M11.8 7.6 6 21" stroke="#000" stroke-width="4.2" stroke-linecap="round"/><path d="M11.8 7.6 6 21" stroke="#a0682f" stroke-width="2.4" stroke-linecap="round"/></svg>';

function cestaMap(W, H) {
    // 3 rady (6 + 5 + 5) hadovito, rovnaké odstupy – nič sa neprekrýva
    const ROWS = [6, 5, 5];
    const slot = (W - 340) / 5;
    const pts = [];
    ROWS.forEach((n, r) => {
        for (let k = 0; k < n; k++) {
            const col = r % 2 === 0 ? k : 5 - k;
            pts.push({ x: 170 + col * slot, y: H * (0.2 + r * 0.31) + 14 * Math.sin(k * 1.7 + r) });
        }
    });
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        if (Math.abs(a.y - b.y) > H * 0.2) {
            const side = a.x > W / 2 ? 140 : -140;
            d += ` C ${a.x + side} ${a.y}, ${b.x + side} ${b.y}, ${b.x} ${b.y}`;
        } else d += ` Q ${(a.x + b.x) / 2} ${(a.y + b.y) / 2 - 34}, ${b.x} ${b.y}`;
    }
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'path-line');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.innerHTML = `<path d="${d}" class="path-line__shadow"/><path d="${d}" class="path-line__road"/>`;
    const nodes = levels.map((l, i) => {
        const st = state(i);
        return h(`div.path-node.is-${st === 'done' ? 'done' : st === 'current' ? 'open.is-current' : 'locked'}`, { style: { left: `${(pts[i].x / W) * 100}%`, top: `${(pts[i].y / H) * 100}%` } }, [
            st === 'current' ? h('img.path-node__hero', { src: `${PLAYER}idle_000.png`, alt: '' }) : null,
            st === 'locked' ? h('span.path-node__btn', { html: ICONS.lock }) : h('a.path-node__btn', {}, [centeredGlyph(l.levelNumber, { size: 54, stroke: 3.2 })]),
            st !== 'locked' ? typeBadge(l.gameType) : null,
            st !== 'locked' ? stars(STARS[i] || 0) : null,
        ]);
    });
    // ovládanie priamo na mape: tréningy vpravo hore, Hrať vpravo dole
    const corner = h('div.mw-corner', {}, [
        h('button.mw-round', { type: 'button', 'aria-label': 'Tréning pexeso', html: I_CARDS }),
        h('button.mw-round', { type: 'button', 'aria-label': 'Tréning baňa', html: I_PICK }),
    ]);
    const play = h('button.mw-play', { type: 'button', 'aria-label': 'Hrať', html: I_PLAY });
    return h('div.path-map.bj-panel.mw-map2', { style: { width: `${W}px`, height: `${H}px`, backgroundImage: `url('${world.icon}')` } }, [h('div.path-map__shade'), svg, ...nodes, play]);
}

const starsChip = () => h('div.mw-topleft', {}, [
    h('div.mw-starchip', {}, [stars(1, 1), h('span', { text: `${total} / 48` })]),
    h('button.mw-round.mw-round--bar', { type: 'button', 'aria-label': 'Tréning pexeso', html: I_CARDS }),
    h('button.mw-round.mw-round--bar', { type: 'button', 'aria-label': 'Tréning baňa', html: I_PICK }),
]);

// 1: jeden čip sveta hore (◀ R ▶), ťuknutím sa otvorí výber všetkých písmen
function letters1() {
    return h('div.mw-head2', {}, [
        h('div.mw-worldchip', {}, [
            h('button.chapter-arrow.chapter-arrow--left', { type: 'button' }),
            h('button.mw-worldchip__main', { type: 'button' }, [
                h('span.mw-worldchip__letter', { style: { backgroundImage: `url('${world.icon}')` } }, [h('span', { text: 'R' })]),
                h('span.mw-worldchip__text', {}, [h('small', { text: 'Svet písmena' }), h('b', { text: 'R' })]),
                h('span.mw-worldchip__more', { text: '▾' }),
            ]),
            h('button.chapter-arrow.chapter-arrow--right', { type: 'button' }),
        ]),
    ]);
}
function pickerModal() {
    const all = getAllWorlds();
    return h('div.bj-modal', {}, [
        h('div.bj-modal__box.bj-panel.mw-pick', {}, [
            h('button.mw-close', { type: 'button', html: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="3.6" stroke-linecap="round"/></svg>' }),
            h('h2.bj-title.bj-title--yellow', { text: 'Vyber písmeno' }),
            h('div.mw-pick__grid', {}, all.map((w, i) => h(`button.mw-pick__w${w.id === world.id ? '.is-active' : ''}${i > 9 ? '.is-locked' : ''}`, { type: 'button', style: { backgroundImage: `url('${w.icon}')` } }, [
                h('span.mw-pick__l', { text: w.name }),
                h('span.mw-pick__s', {}, [stars(1, 1), h('span', { text: i === 0 ? '11' : i < 4 ? String(9 - i * 2) : '0' })]),
            ]))),
        ]),
    ]);
}
// 2: písmená ako zvislý pás vľavo
function letters2() {
    const all = getAllWorlds().slice(0, 6);
    return h('div.mw-rail', {}, [
        h('button.mw-rail__arrow', { type: 'button', text: '▲' }),
        ...all.map((w) => h(`button.mw-letter${w.id === world.id ? '.is-active' : ''}`, { type: 'button', style: { backgroundImage: `url('${w.icon}')` } }, [h('span', { text: w.name })])),
        h('button.mw-rail__arrow', { type: 'button', text: '▼' }),
    ]);
}
// 3: písmená ako pás dolu pod mapou
function letters3() {
    const all = getAllWorlds().slice(0, 12);
    return h('div.mw-strip', {}, [
        h('button.chapter-arrow.chapter-arrow--left', { type: 'button' }),
        ...all.map((w) => h(`button.mw-letter.mw-letter--sm${w.id === world.id ? '.is-active' : ''}`, { type: 'button', style: { backgroundImage: `url('${w.icon}')` } }, [h('span', { text: w.name })])),
        h('button.chapter-arrow.chapter-arrow--right', { type: 'button' }),
    ]);
}
const title3 = () => h('div.chapter-head.mw-title3', {}, [h('div.chapter-title', {}, [h('div.chapter-title__small', { text: 'Slová · svet písmena' }), h('h1.bj-title', { text: 'Písmeno R' })])]);

if (v === 'a1' || v === 'pick') {
    app.replaceChildren(tb, letters1(), h('div.mw-body', {}, [cestaMap(1760, 650)]), starsChip());
    if (v === 'pick') document.getElementById('bj-stage').append(pickerModal());
}
if (v === 'a2') app.replaceChildren(tb, title3(), h('div.mw-body.mw-body--rail', {}, [letters2(), cestaMap(1600, 650)]), starsChip());
if (v === 'a3') app.replaceChildren(tb, title3(), h('div.mw-body', {}, [cestaMap(1760, 520)]), letters3(), starsChip());

// vyhodnotenie 1 s ikonami
if (v === 'endI') {
    app.replaceChildren(tb, letters1(), h('div.mw-body', {}, [cestaMap(1760, 650)]));
    document.getElementById('bj-stage').append(h('div.bj-modal', {}, [h('div.bj-modal__box.bj-panel.mw-end', {}, [
        h('div.mw-endA', {}, [
            h('h2.bj-title.bj-title--yellow', { text: 'Výborne!' }),
            h('div.end-stars', {}, [stars(2)]),
            h('div.mw-stats', {}, [stat(I_MOUTH, '3 / 4', 'slová'), stat(I_EAR, '2 / 2', 'počúvanie'), stat(I_TIME, '1:42', 'čas')]),
            h('div.mw-iconrow', {}, [
                h('button.mw-ibtn', { type: 'button', 'aria-label': 'Znova', html: I_REPLAY }),
                h('button.mw-ibtn', { type: 'button', 'aria-label': 'Mapa', html: I_MAP }),
                h('button.mw-ibtn.mw-ibtn--go', { type: 'button', 'aria-label': 'Ďalej', html: I_PLAY }),
            ]),
        ]),
    ])]));
}
