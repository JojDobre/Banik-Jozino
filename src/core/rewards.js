/**
 * Zbierka kariet – odmeny za levely.
 *
 * Pravidlá (docs/PLAN.md):
 * - prvé splnenie levelu (≥ 1 ★) → 1 karta zo sady sveta
 * - prvé 3 ★ v leveli → ďalšia karta, aspoň vzácna
 * - každý MILESTONE_EVERY-tý level → balíček (otvára sa v albume)
 * - kým sada nie je kompletná, padajú prednostne nové karty
 * - duplikát → iskričky; za iskričky si dieťa vymení konkrétnu kartu
 * - nič sa nekupuje za peniaze
 *
 * Všetky funkcie sú čisté: dostanú stav zbierky a vrátia nový stav.
 * Náhoda sa dá podstrčiť (rng) – kvôli testom.
 */

export const RARITIES = ['common', 'rare', 'gold'];
export const SPARKLES_FOR_DUPLICATE = { common: 1, rare: 3, gold: 10 };
export const EXCHANGE_COST = { common: 5, rare: 15, gold: 40 };
export const MILESTONE_EVERY = 4;
export const PACK_SIZE = 3;

/** Stabilný hash reťazca → 0..1 (rovnaká karta má vždy rovnakú vzácnosť). */
function hash01(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return ((h >>> 0) % 10000) / 10000;
}

export function rarityFor(id) {
    const x = hash01(id);
    if (x < 0.08) return 'gold';
    if (x < 0.33) return 'rare';
    return 'common';
}

/**
 * Katalóg kariet z definícií (src/content/cards).
 * @param {Array} defs – { id, name, set, rarity?, art?, image? }
 */
export function buildCatalog(defs) {
    return defs.map((d) => ({
        id: d.id,
        name: d.name,
        set: d.set,
        rarity: d.rarity || rarityFor(d.id),
        art: d.art,
        image: d.image,
    }));
}

const clone = (c) => ({ cards: { ...c.cards }, sparkles: c.sparkles || 0, packs: [...(c.packs || [])] });

function pick(list, rng) {
    return list[Math.floor(rng() * list.length)];
}

/**
 * Vyber kartu: prednostne takú, ktorú dieťa ešte nemá.
 * @param {object} opts.minRarity – 'rare' = aspoň vzácna
 */
export function drawCard(catalog, collection, { set, minRarity, rng = Math.random } = {}) {
    const minIdx = minRarity ? RARITIES.indexOf(minRarity) : 0;
    // sada, ktorá v katalógu nie je (napr. svet z Bane), = vyber z celého katalógu
    if (set && !catalog.some((c) => c.set === set)) set = undefined;
    let pool = catalog.filter((c) => (!set || c.set === set) && RARITIES.indexOf(c.rarity) >= minIdx);
    if (!pool.length) pool = catalog.filter((c) => !set || c.set === set);
    if (!pool.length) pool = catalog;
    if (!pool.length) return null;
    const missing = pool.filter((c) => !collection.cards[c.id]);
    return pick(missing.length ? missing : pool, rng);
}

/** Pridá kartu do zbierky; duplikát sa premení na iskričky. */
export function addCard(collection, card) {
    const next = clone(collection);
    const duplicate = Boolean(next.cards[card.id]);
    next.cards[card.id] = (next.cards[card.id] || 0) + 1;
    let sparkles = 0;
    if (duplicate) {
        sparkles = SPARKLES_FOR_DUPLICATE[card.rarity] || 1;
        next.sparkles += sparkles;
    }
    return { collection: next, reward: { type: 'card', cardId: card.id, rarity: card.rarity, duplicate, sparkles } };
}

/**
 * Odmena za dohraný level.
 * @param {object} result – { worldId, levelNumber, stars, previousStars, firstCompletion }
 * @returns {{ collection, rewards: Array }}
 */
export function grantLevelReward(catalog, collection, result, rng = Math.random) {
    const { worldId, levelNumber, stars = 0, previousStars = 0, firstCompletion = false } = result;
    let col = clone(collection);
    const rewards = [];

    const give = (opts) => {
        const card = drawCard(catalog, col, { set: worldId, rng, ...opts });
        if (!card) return;
        const r = addCard(col, card);
        col = r.collection;
        rewards.push(r.reward);
    };

    if (firstCompletion && stars >= 1) {
        give();
        if (levelNumber && levelNumber % MILESTONE_EVERY === 0) {
            const pack = { id: `pack_${worldId}_${levelNumber}_${Date.now().toString(36)}`, set: worldId, size: PACK_SIZE };
            col.packs.push(pack);
            rewards.push({ type: 'pack', packId: pack.id, set: worldId });
        }
    }
    if (stars === 3 && previousStars < 3) give({ minRarity: 'rare' });

    return { collection: col, rewards };
}

/** Otvorenie balíčka: PACK_SIZE kariet, aspoň jedna vzácna. */
export function openPack(catalog, collection, packId, rng = Math.random) {
    const pack = (collection.packs || []).find((p) => p.id === packId);
    if (!pack) throw new Error(`Balíček ${packId} neexistuje`);
    let col = clone(collection);
    col.packs = col.packs.filter((p) => p.id !== packId);
    const rewards = [];
    for (let i = 0; i < pack.size; i++) {
        const card = drawCard(catalog, col, { set: pack.set, minRarity: i === 0 ? 'rare' : undefined, rng });
        if (!card) break;
        const r = addCard(col, card);
        col = r.collection;
        rewards.push(r.reward);
    }
    return { collection: col, rewards };
}

/** Výmena iskričiek za konkrétnu chýbajúcu kartu. */
export function exchangeForCard(catalog, collection, cardId) {
    const card = catalog.find((c) => c.id === cardId);
    if (!card) throw new Error(`Karta ${cardId} neexistuje`);
    if (collection.cards[cardId]) throw new Error('Túto kartu už máš');
    const cost = EXCHANGE_COST[card.rarity];
    if ((collection.sparkles || 0) < cost) throw new Error('Nemáš dosť iskričiek');
    const next = clone(collection);
    next.sparkles -= cost;
    next.cards[cardId] = 1;
    return { collection: next, cost };
}

/** Prehľad sady: koľko kariet má dieťa z koľkých. */
export function setProgress(catalog, collection, set) {
    const inSet = catalog.filter((c) => c.set === set);
    const owned = inSet.filter((c) => collection.cards[c.id]).length;
    return { owned, total: inSet.length, complete: inSet.length > 0 && owned === inSet.length };
}
