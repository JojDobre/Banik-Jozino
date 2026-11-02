/**
 * Zberateľské karty – vykreslenie a okno s odmenou.
 * Okno s odmenou sa zobrazí na každej stránke (aj v pôvodných hrách),
 * keď bridge.js vyšle udalosť 'bj:rewards'.
 */
import { h } from './kit.js';

const RARITY_LABEL = { common: 'Bežná', rare: 'Vzácna', gold: 'Zlatá' };

/**
 * @param {object} card – položka z katalógu (rewards.buildCatalog)
 * @param {object} [opts] – { missing, count, big }
 */
export function cardElement(card, { missing = false, count = 0, big = false } = {}) {
    const cls = ['bj-card', `bj-card--${card.rarity}`];
    if (missing) cls.push('is-missing');
    if (big) cls.push('bj-card--big');
    const el = h(`div.${cls.join('.')}`, {
        'data-card': card.id,
        'aria-label': missing ? 'Chýbajúca karta' : `${card.name}, ${RARITY_LABEL[card.rarity] || ''} karta`,
    }, [
        h('div.bj-card__img', {}, [h('img', { src: card.image, alt: '', loading: 'lazy' })]),
        h('div.bj-card__name', { text: missing ? '???' : card.name }),
        h('span.bj-card__gem', { title: RARITY_LABEL[card.rarity] }),
        count > 1 ? h('span.bj-card__count', { text: `×${count}` }) : null,
    ]);
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

/**
 * Okno s odmenou. Vráti Promise, ktorý sa splní po zatvorení.
 * @param {Array} rewards – položky z rewards.grantLevelReward / openPack
 * @param {object} [opts] – { title }
 */
export function showRewards(rewards, { title } = {}) {
    if (!rewards?.length) return Promise.resolve();
    const byId = catalogById();
    const cards = rewards.filter((r) => r.type === 'card').map((r) => ({ r, card: byId.get(r.cardId) })).filter((x) => x.card);
    const packs = rewards.filter((r) => r.type === 'pack');
    const sparkles = cards.reduce((s, x) => s + (x.r.sparkles || 0), 0);

    const heading = title || (cards.length > 1 ? 'Nové karty!' : cards.length ? 'Nová karta!' : 'Balíček kariet!');
    const notes = [];
    const dup = cards.filter((x) => x.r.duplicate);
    if (dup.length) notes.push(`Túto kartu už máš – dostávaš ${sparkles} ${sparkles === 1 ? 'iskričku' : sparkles < 5 ? 'iskričky' : 'iskričiek'} ✨`);
    if (packs.length) notes.push('Bonus: balíček kariet! Otvoríš ho v albume.');

    return new Promise((resolve) => {
        const host = document.getElementById('bj-stage') || document.body;
        const btn = h('button.bj-btn.bj-btn--primary', { type: 'button', text: 'Super!' });
        const overlay = h('div.bj-reward', { role: 'dialog', 'aria-label': heading }, [
            h('div.bj-reward__box', {}, [
                h('div.bj-reward__title', { text: heading }),
                h('div.bj-reward__cards', {}, [
                    ...cards.map((x) => cardElement(x.card, { big: cards.length === 1 })),
                    ...(cards.length ? [] : packs.map(() => h('div.bj-pack', { text: '?' }))),
                ]),
                ...notes.map((n) => h('div.bj-reward__note', { text: n })),
                btn,
            ]),
        ]);
        const close = () => {
            overlay.remove();
            resolve();
        };
        btn.addEventListener('click', close);
        host.append(overlay);
        try {
            window.BJ.audio.playEffect('win');
        } catch {
            /* bez zvuku */
        }
    });
}

/** Zobrazí odmeny automaticky, keď ich bridge udelí (napr. po dohraní levelu). */
export function installRewardPopup() {
    const queue = [];
    let showing = false;
    async function next() {
        if (showing || !queue.length) return;
        showing = true;
        await showRewards(queue.shift());
        showing = false;
        next();
    }
    window.addEventListener('bj:rewards', (e) => {
        queue.push(e.detail.rewards);
        // počkaj, kým hra zobrazí výsledky, potom ukáž odmenu navrch
        setTimeout(next, 700);
    });
}
