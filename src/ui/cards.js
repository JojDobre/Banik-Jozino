/**
 * Zberateľské karty – vykreslenie a okno s odmenou.
 * Okno s odmenou sa zobrazí na každej stránke (aj v pôvodných hrách),
 * keď bridge.js vyšle udalosť 'bj:rewards'.
 */
import { h } from './kit.js';

import { setById } from '../content/cards/index.js';

const RARITY_LABEL = { common: 'Bežná', rare: 'Vzácna', gold: 'Zlatá' };
let uid = 0;

/** Obrázok karty: kreslené animované SVG (karty s témami) alebo obrázok. */
function cardArt(card) {
    if (card.art) {
        uid += 1;
        return h('div.bj-card__art', { html: card.art(`c${uid}`) });
    }
    return h('img', { src: card.image, alt: '', loading: 'lazy' });
}

/**
 * Naklonenie karty podľa prsta/myši (3D efekt) – pre veľké karty.
 */
export function enableTilt(el) {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const move = (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        el.style.setProperty('--tilt-x', `${(-y * 12).toFixed(2)}deg`);
        el.style.setProperty('--tilt-y', `${(x * 14).toFixed(2)}deg`);
        el.style.setProperty('--foil-x', `${50 + x * 40}%`);
        el.style.setProperty('--foil-y', `${50 + y * 40}%`);
        el.classList.add('is-tilting');
    };
    const leave = () => {
        el.classList.remove('is-tilting');
        el.style.removeProperty('--tilt-x');
        el.style.removeProperty('--tilt-y');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('pointerup', leave);
}

/**
 * @param {object} card – položka z katalógu (rewards.buildCatalog)
 * @param {object} [opts] – { missing, count, big, tilt }
 */
export function cardElement(card, { missing = false, count = 0, big = false, tilt = big } = {}) {
    const set = setById(card.set);
    const cls = ['bj-card', `bj-card--${card.rarity}`];
    if (missing) cls.push('is-missing');
    if (big) cls.push('bj-card--big');
    const el = h(`div.${cls.join('.')}`, {
        'data-card': card.id,
        'aria-label': missing ? 'Chýbajúca karta' : `${card.name}, ${RARITY_LABEL[card.rarity] || ''} karta`,
    }, [
        h('div.bj-card__img', {}, [cardArt(card), missing ? null : h('div.bj-card__foil')]),
        h('div.bj-card__name' + (missing ? '' : card.name.length > 13 ? '.is-xlong' : card.name.length > 9 ? '.is-long' : ''), { text: missing ? '???' : card.name }),
        h('span.bj-card__gem', { title: RARITY_LABEL[card.rarity] }),
        set && !missing ? h('span.bj-card__set', { text: set.name }) : null,
        count > 1 ? h('span.bj-card__count', { text: `×${count}` }) : null,
    ]);
    // farby sady (pozadie obrázka)
    if (set) {
        el.style.setProperty('--set-a', set.bg[0]);
        el.style.setProperty('--set-b', set.bg[1]);
    }
    if (tilt && !missing) enableTilt(el);
    return el;
}

export function cardBack() {
    return h('div.bj-card.bj-card--back', {}, [h('div.bj-card__back-logo', { text: '?' })]);
}

function catalogById() {
    const map = new Map();
    for (const c of window.BJ.rewards.catalog()) map.set(c.id, c);
    return map;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function sparklesWord(n) {
    return n === 1 ? 'iskričku' : n >= 2 && n <= 4 ? 'iskričky' : 'iskričiek';
}

function effect(name) {
    try {
        window.BJ.audio.playEffect(name);
    } catch {
        /* bez zvuku */
    }
}

function speak(text) {
    try {
        window.BJ.say(text);
    } catch {
        /* bez hlasu */
    }
}

/** Balíček kariet (kreslený CSS): vrchná časť sa pri otvorení odtrhne. */
function packElement(gold) {
    return h('div.bj-pack2' + (gold ? '.is-gold' : ''), { 'aria-hidden': 'true' }, [
        h('div.bj-pack2__body', {}, [
            h('div.bj-pack2__shine'),
            h('div.bj-pack2__logo', {}, [h('span', { text: '★' })]),
            h('div.bj-pack2__label', { text: 'Baník Jožino' }),
        ]),
        h('div.bj-pack2__top'),
    ]);
}

/** Konfety / iskry z bodu (x, y v px plátna relatívne k rodičovi). */
function burst(parent, x, y, { count = 26, colors, spread = 320 } = {}) {
    const palette = colors || ['#FFD900', '#ff5ca8', '#4FC3F7', '#2fe03a', '#ff8a00', '#ffffff'];
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const dist = spread * (0.45 + Math.random() * 0.55);
        const p = h('i.bj-confetti', {
            style: {
                left: `${x}px`,
                top: `${y}px`,
                background: palette[i % palette.length],
                animationDelay: `${Math.random() * 0.08}s`,
            },
        });
        p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--dy', `${Math.sin(angle) * dist + 80}px`);
        p.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
        parent.append(p);
        setTimeout(() => p.remove(), 1500);
    }
}

/**
 * Animácia odmeny: balíček → ťuknutie → roztrhnutie → karty vyletia a otočia sa.
 * @param {Array} rewards – položky z rewards.grantLevelReward / openPack
 * @param {object} [opts] – { title, pack = true (bez balíčka sa karty len otočia) }
 * @returns Promise – splní sa po zatvorení okna
 */
export function showRewards(rewards, { title, pack = true } = {}) {
    if (!rewards?.length) return Promise.resolve();
    const byId = catalogById();
    const cards = rewards.filter((r) => r.type === 'card').map((r) => ({ r, card: byId.get(r.cardId) })).filter((x) => x.card);
    const bonusPacks = rewards.filter((r) => r.type === 'pack');
    const sparkles = cards.reduce((s, x) => s + (x.r.sparkles || 0), 0);
    const hasGold = cards.some((x) => x.card.rarity === 'gold');

    const heading = title || (cards.length > 1 ? 'Nové karty!' : 'Nová karta!');
    const notes = [];
    if (cards.some((x) => x.r.duplicate)) notes.push(`Túto kartu už máš – dostávaš ${sparkles} ${sparklesWord(sparkles)} ✨`);
    if (bonusPacks.length) notes.push('Bonus: balíček kariet! Otvoríš ho v albume.');

    return new Promise((resolve) => {
        const host = document.getElementById('bj-stage') || document.body;
        const titleEl = h('div.bj-reward__title', { text: pack ? 'Ťukni na balíček!' : heading });
        const stageEl = h('div.bj-reward__stage');
        const notesEl = h('div.bj-reward__notes');
        const btn = h('button.bj-btn.bj-btn--primary.bj-reward__ok', { type: 'button', text: 'Super!' });
        const overlay = h('div.bj-reward', { role: 'dialog', 'aria-label': heading }, [
            h('div.bj-reward__rays'),
            h('div.bj-reward__box', {}, [titleEl, stageEl, notesEl, btn]),
        ]);
        const close = () => {
            overlay.remove();
            resolve();
        };
        btn.addEventListener('click', close);
        host.append(overlay);

        // miesta pre karty (rozostúpené vedľa seba)
        const slots = h('div.bj-reward__cards');
        const flips = cards.map((x) => {
            const flip = h('div.bj-flip', {}, [
                h('div.bj-flip__face.bj-flip__back', {}, [cardBack()]),
                h('div.bj-flip__face.bj-flip__front', {}, [cardElement(x.card, { big: cards.length === 1, tilt: false })]),
            ]);
            if (cards.length === 1) flip.classList.add('is-big');
            return flip;
        });
        flips.forEach((f) => slots.append(f));

        async function reveal() {
            titleEl.textContent = heading;
            titleEl.classList.add('is-pop');
            for (let i = 0; i < flips.length; i++) {
                const f = flips[i];
                f.classList.add('is-out');
                await wait(380);
                f.classList.add('is-flipped');
                const rarity = cards[i].card.rarity;
                effect(rarity === 'common' ? 'flip' : 'win');
                await wait(260);
                const r = f.getBoundingClientRect();
                const o = overlay.getBoundingClientRect();
                const k = overlay.offsetWidth / o.width; // px obrazovky → px plátna
                const cx = (r.left + r.width / 2 - o.left) * k;
                const cy = (r.top + r.height / 2 - o.top) * k;
                if (rarity === 'gold') burst(overlay, cx, cy, { count: 40, spread: 420 });
                else if (rarity === 'rare') burst(overlay, cx, cy, { count: 22, colors: ['#4FC3F7', '#b3e5fc', '#ffffff', '#ff5ca8'] });
                await wait(240);
            }
            speak(heading);
            for (const n of notes) notesEl.append(h('div.bj-reward__note', { text: n }));
            btn.classList.add('is-visible');
            // veľká karta sa po odhalení nakláňa podľa prsta
            flips.forEach((f) => enableTilt(f.querySelector('.bj-flip__front .bj-card')));
        }

        if (!pack) {
            stageEl.append(slots);
            reveal();
            return;
        }

        const packEl = packElement(hasGold);
        const packWrap = h('button.bj-pack2-btn', { type: 'button', 'aria-label': 'Otvoriť balíček' }, [packEl]);
        stageEl.append(packWrap);
        speak('Ťukni na balíček!');

        let opened = false;
        const open = async () => {
            if (opened) return;
            opened = true;
            packWrap.classList.add('is-shaking');
            effect('click');
            await wait(700);
            packWrap.classList.remove('is-shaking');
            packWrap.classList.add('is-opening');
            overlay.classList.add('is-flash');
            effect('collect');
            const r = packWrap.getBoundingClientRect();
            const o = overlay.getBoundingClientRect();
            const k = overlay.offsetWidth / o.width;
            burst(overlay, (r.left + r.width / 2 - o.left) * k, (r.top + r.height * 0.3 - o.top) * k, { count: 30, spread: 360 });
            await wait(650);
            packWrap.remove();
            stageEl.append(slots);
            await reveal();
        };
        packWrap.addEventListener('click', open);
        // ak dieťa neťukne, balíček sa po chvíli otvorí sám
        setTimeout(open, 6000);
    });
}

/**
 * Darček s odmenou na obrazovke výsledkov. Najprv sa ukážu výsledky levelu,
 * dieťa potom ťukne na darček a otvorí sa balíček (showRewards).
 *
 * Miesto pre darček: prvok [data-reward-slot] (nové minihry) alebo okno
 * výsledkov pôvodných hier (#endgame); inak sa darček ukáže v rohu obrazovky.
 */
export function installRewardPopup() {
    const pending = [];
    let gift = null;

    function findSlot() {
        const candidates = ['[data-reward-slot]', '#endgame .gameend', '#endgame .cvicenie-content-2'];
        for (const sel of candidates) {
            const el = document.querySelector(sel);
            if (el && el.offsetParent !== null) return el;
        }
        return null;
    }

    function placeGift(attempt = 0) {
        if (!pending.length || gift) return;
        const slot = findSlot();
        // výsledky sa ešte nezobrazili – skús znova (max ~3 s)
        if (!slot && attempt < 10) {
            setTimeout(() => placeGift(attempt + 1), 300);
            return;
        }
        gift = h('button.bj-gift' + (slot ? '' : '.is-floating'), { type: 'button', 'aria-label': 'Otvoriť odmenu' }, [
            h('span.bj-gift__box', { text: '🎁' }),
            h('span.bj-gift__text', { text: 'Máš odmenu! Ťukni' }),
        ]);
        gift.addEventListener('click', async () => {
            const rewards = pending.splice(0).flat();
            gift.remove();
            gift = null;
            await showRewards(rewards);
            placeGift();
        });
        if (slot) slot.prepend(gift);
        else (document.getElementById('bj-stage') || document.body).append(gift);
        speak('Máš odmenu! Ťukni na balíček.');
    }

    window.addEventListener('bj:rewards', (e) => {
        pending.push(e.detail.rewards);
        setTimeout(() => placeGift(), 600);
    });
}
