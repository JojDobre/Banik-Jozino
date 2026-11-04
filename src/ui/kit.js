/**
 * Malé UI pomôcky pre nové obrazovky (bez frameworku).
 */
import { avatarById, needsSetup } from '../core/profiles.js';

/**
 * Vytvorenie elementu: h('div.bj-panel', { onclick }, [deti])
 * Selektor: 'tag.trieda.trieda#id'
 */
export function h(selector, props = {}, children = []) {
    const [, tag = 'div', rest = ''] = selector.match(/^([a-z0-9-]*)(.*)$/i);
    const el = document.createElement(tag || 'div');
    for (const part of rest.match(/[.#][^.#]+/g) || []) {
        if (part[0] === '.') el.classList.add(part.slice(1));
        else el.id = part.slice(1);
    }
    for (const [k, v] of Object.entries(props || {})) {
        if (v === undefined || v === null || v === false) continue;
        if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k in el && typeof v !== 'string') el[k] = v;
        else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of [].concat(children)) {
        if (c === null || c === undefined || c === false) continue;
        el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
}

const GEAR_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="#000" stroke-width="0.8" d="M10.3 2h3.4l.5 2.6c.6.2 1.2.5 1.7.9l2.5-.9 1.7 2.9-2 1.8c.1.6.1 1.2 0 1.8l2 1.8-1.7 2.9-2.5-.9c-.5.4-1.1.7-1.7.9l-.5 2.6h-3.4l-.5-2.6c-.6-.2-1.2-.5-1.7-.9l-2.5.9-1.7-2.9 2-1.8a5 5 0 0 1 0-1.8l-2-1.8 1.7-2.9 2.5.9c.5-.4 1.1-.7 1.7-.9zM12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z" transform="translate(0 1)"/></svg>';

export const ICONS = {
    gear: GEAR_ICON,
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5 7.5 12l7 7" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="#000" stroke-width="1"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="#000" stroke-width="1"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="#FFD900" stroke="#000" stroke-width="1.4"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="#FFD900" stroke-width="2.6"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="#000" stroke-width="0.8"/><circle cx="12" cy="15.5" r="1.6" fill="#000"/></svg>',
    cards: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="11" height="15" rx="2" fill="#4FC3F7" stroke="#000" stroke-width="1.2" transform="rotate(-10 8.5 12.5)"/><rect x="9" y="3.5" width="11" height="15" rx="2" fill="#FFD54F" stroke="#000" stroke-width="1.2" transform="rotate(8 14.5 11)"/></svg>',
};

/**
 * Číslo / znak presne v strede krúžku – vykreslené ako SVG.
 * (HTML text sa na telefóne pri zmenšenom plátne zaokrúhľuje na celé pixely
 *  a číslo „uteká“ nahor; SVG sa škáluje ako vektor.)
 * Poloha z metrík písma Luckiest Guy: stred číslic je 0,359 em nad účiarím.
 * Farba = CSS `color` rodiča, obrys čierny.
 * @param {string} text
 * @param {object} [o] – size: výška písma v % priemeru krúžku, stroke: hrúbka obrysu
 */
// Luckiest Guy: posun stredu kresby od stredu znaku (x) a výška stredu kresby
// nad účiarím (y), v em – z metrík písma (fontTools, public/fonts/luckiest-guy-latin.woff2).
const GLYPH_METRICS = {
    0: [0, 0.35], 1: [-0.018, 0.36], 2: [-0.002, 0.372], 3: [-0.004, 0.369], 4: [-0.009, 0.364],
    5: [0.001, 0.357], 6: [0.004, 0.354], 7: [-0.002, 0.362], 8: [0, 0.359], 9: [-0.002, 0.357], '?': [0, 0.336],
};

export function centeredGlyph(text, { size = 56, stroke = 4 } = {}) {
    const str = String(text);
    // pre viacciferné čísla priemer metrík
    const ms = [...str].map((c) => GLYPH_METRICS[c] || [0, 0.359]);
    const dx = ms.reduce((a, m) => a + m[0], 0) / ms.length;
    const vy = ms.reduce((a, m) => a + m[1], 0) / ms.length;
    const x = (50 - dx * size).toFixed(2);
    const y = (50 + vy * size).toFixed(2);
    const el = document.createElement('span');
    el.className = 'bj-glyph';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<svg viewBox="0 0 100 100"><text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" fill="currentColor" stroke="#000" stroke-width="${stroke}" stroke-linejoin="round" paint-order="stroke">${str.replace(/[<&]/g, '')}</text></svg>`;
    return el;
}

/** Hviezdy 0–3 */
export function stars(count, max = 3) {
    return h(
        'span.bj-stars',
        { 'aria-label': `${count} z ${max} hviezd` },
        Array.from({ length: max }, (_, i) =>
            h(`img${i < count ? '' : '.off'}`, { src: 'images/star_active.png', alt: '' }),
        ),
    );
}

/** Tlačidlo späť (štýl z css/common.css). */
export function backButton(href) {
    return h('div.back-button', {}, [h('a', { href, 'aria-label': 'Späť', html: ICONS.back })]);
}

/**
 * Zabezpečí, že je zvolený profil s vekom – inak presmeruje na výber profilu.
 * @returns profil alebo null (ak presmeroval)
 */
export function requireProfile() {
    const p = window.BJ.profiles.active();
    if (needsSetup(p)) {
        const next = encodeURIComponent(location.pathname.split('/').pop() + location.search);
        location.replace(`profil.html?next=${next}`);
        return null;
    }
    return p;
}

/** Čip s avatarom a menom (odkaz na výber profilu). */
export function profileChip(profile) {
    const av = avatarById(profile.avatar);
    return h('a.bj-chip', { href: 'profil.html', 'aria-label': 'Zmeniť hráča' }, [
        h('img', { src: av.image, alt: '' }),
        h('span', { text: profile.name }),
    ]);
}

/** Tlačidlo albumu kariet s počtom kariet a odznakom neotvorených balíčkov. */
export function albumChip() {
    const col = window.BJ.rewards.collection() || { cards: {}, packs: [] };
    const owned = Object.keys(col.cards || {}).length;
    const packs = (col.packs || []).length;
    return h('a.bj-chip', { href: 'album.html', 'aria-label': 'Album kariet' }, [
        h('span', { html: ICONS.cards, style: { width: '64px', height: '64px', display: 'inline-flex', paddingTop: '0' } }),
        h('span', { text: String(owned) }),
        packs ? h('span.bj-badge', { 'aria-label': `${packs} neotvorené balíčky` }, [centeredGlyph(packs, { size: 62, stroke: 0 })]) : null,
    ]);
}

/** Okrúhle tlačidlo nastavení (ozubené koliesko). */
export function settingsButton() {
    return h('button.bj-round-btn.bj-settings-btn', {
        type: 'button',
        'aria-label': 'Nastavenia',
        html: GEAR_ICON,
        onclick: () => window.BJ.openSettings(),
    });
}

/** Horná lišta: späť vľavo, vpravo album, profil a nastavenia. */
export function topbar({ back, profile, album = true, settings = true } = {}) {
    return h('div.bj-topbar', {}, [
        back ? backButton(back) : null,
        album ? albumChip() : null,
        profile ? profileChip(profile) : null,
        settings ? settingsButton() : null,
    ]);
}

/**
 * Hlasový pokyn. V Android appke zaznie hneď; v prehliadači len po kliknutí
 * (prehliadače nedovolia hovoriť bez interakcie) – preto aj tlačidlo s reproduktorom.
 */
export function say(text) {
    try {
        return window.BJ.say(text);
    } catch {
        return Promise.resolve(false);
    }
}

export function speakerButton(text) {
    return h('button.bj-icon-btn', {
        type: 'button',
        'aria-label': 'Prečítať pokyn',
        html: ICONS.speaker,
        onclick: () => say(text),
    });
}

/** Ikona zatvorenia (X) – rovnaká vo všetkých oknách (css/common.css: .bj-close). */
export const CLOSE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="3.6" stroke-linecap="round"/></svg>';

/** Okrúhle tlačidlo zatvorenia na pravom hornom rohu okna. */
export function closeButton(onclick) {
    return h('button.bj-close', { type: 'button', 'aria-label': 'Zavrieť', html: CLOSE_ICON, onclick });
}

/** Modálne okno; vráti funkciu na zatvorenie. */
export function modal(content, { onClose, dismissable = true } = {}) {
    const stage = document.getElementById('bj-stage') || document.body;
    const box = h('div.bj-modal__box.bj-panel', {}, [content]);
    const wrap = h('div.bj-modal', {}, [box]);
    const close = () => {
        wrap.remove();
        onClose?.();
    };
    if (dismissable) box.append(closeButton(close));
    if (dismissable) {
        wrap.addEventListener('click', (e) => {
            if (e.target === wrap) close();
        });
    }
    stage.append(wrap);
    return close;
}

export const pause = (ms) => new Promise((r) => setTimeout(r, ms));
