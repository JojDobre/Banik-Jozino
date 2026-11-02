import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCatalog, grantLevelReward, openPack, exchangeForCard, addCard, setProgress, EXCHANGE_COST } from '../src/core/rewards.js';
import { emptyCollection } from '../src/core/profiles.js';
import { seededRandom } from '../src/core/levelGenerator.js';

import { CARDS, SETS } from '../src/content/cards/index.js';

// malý testovací katalóg s jednou sadou (world_r) – pravidlá odmien
const defs = ['rak', 'ryba', 'ruka', 'ruza', 'rosa', 'rok'].map((id) => ({ id: `world_r:${id}`, name: id, set: 'world_r' }));
const catalog = buildCatalog(defs);

test('katalóg z definícií; vzácnosť sa doplní, ak chýba', () => {
    assert.equal(catalog.length, 6);
    assert.ok(catalog.every((c) => c.set === 'world_r' && ['common', 'rare', 'gold'].includes(c.rarity)));
});

test('karty s témami: každá má obrázok, sadu a jedinečné id', () => {
    const real = buildCatalog(CARDS);
    assert.equal(new Set(real.map((c) => c.id)).size, real.length);
    for (const c of real) {
        assert.equal(typeof c.art, 'function', c.id);
        assert.ok(SETS.some((s) => s.id === c.set), c.id);
        const svgText = c.art('t');
        assert.match(svgText, /^<svg[\s\S]*<\/svg>$/, c.id);
    }
    // v každej sade sú bežné aj vzácnejšie karty
    for (const s of SETS) {
        const inSet = real.filter((c) => c.set === s.id);
        assert.ok(inSet.some((c) => c.rarity === 'common') && inSet.some((c) => c.rarity !== 'common'), s.id);
    }
});

test('odmena zo sady, ktorá v katalógu nie je (svet z Bane), padne z celého katalógu – aj vzácna', () => {
    const real = buildCatalog(CARDS);
    const r = grantLevelReward(real, emptyCollection(), { worldId: 'world_r', levelNumber: 1, stars: 3, previousStars: 0, firstCompletion: true }, seededRandom(9));
    assert.equal(r.rewards.length, 2);
    assert.notEqual(r.rewards[1].rarity, 'common');
});

test('prvé splnenie levelu dá kartu, opakované už nie', () => {
    const rng = seededRandom(1);
    const r1 = grantLevelReward(catalog, emptyCollection(), { worldId: 'world_r', levelNumber: 1, stars: 1, previousStars: 0, firstCompletion: true }, rng);
    assert.equal(r1.rewards.length, 1);
    assert.equal(r1.rewards[0].type, 'card');
    const r2 = grantLevelReward(catalog, r1.collection, { worldId: 'world_r', levelNumber: 1, stars: 1, previousStars: 1, firstCompletion: false }, rng);
    assert.equal(r2.rewards.length, 0);
});

test('0 hviezd = žiadna karta', () => {
    const r = grantLevelReward(catalog, emptyCollection(), { worldId: 'world_r', levelNumber: 1, stars: 0, firstCompletion: false });
    assert.equal(r.rewards.length, 0);
});

test('míľnikový level dá balíček, 3 hviezdy dajú vzácnu kartu', () => {
    const r = grantLevelReward(catalog, emptyCollection(), { worldId: 'world_r', levelNumber: 4, stars: 3, previousStars: 0, firstCompletion: true }, seededRandom(2));
    const types = r.rewards.map((x) => x.type);
    assert.deepEqual(types, ['card', 'pack', 'card']);
    assert.equal(r.collection.packs.length, 1);
    assert.notEqual(r.rewards[2].rarity, 'common');
});

test('kým sada nie je kompletná, nepadajú duplikáty', () => {
    let col = emptyCollection();
    const rng = seededRandom(3);
    for (let lvl = 1; lvl <= 6; lvl++) {
        const r = grantLevelReward(catalog, col, { worldId: 'world_r', levelNumber: lvl * 10 + 1, stars: 1, previousStars: 0, firstCompletion: true }, rng);
        assert.equal(r.rewards[0].duplicate, false, `level ${lvl}`);
        col = r.collection;
    }
    assert.equal(setProgress(catalog, col, 'world_r').complete, true);
});

test('duplikát sa premení na iskričky', () => {
    const card = catalog[0];
    let { collection } = addCard(emptyCollection(), card);
    const r = addCard(collection, card);
    assert.equal(r.reward.duplicate, true);
    assert.ok(r.collection.sparkles > 0);
    assert.equal(r.collection.cards[card.id], 2);
});

test('otvorenie balíčka a výmena iskričiek', () => {
    const r = grantLevelReward(catalog, emptyCollection(), { worldId: 'world_r', levelNumber: 4, stars: 1, previousStars: 0, firstCompletion: true }, seededRandom(4));
    const pack = r.collection.packs[0];
    const opened = openPack(catalog, r.collection, pack.id, seededRandom(5));
    assert.equal(opened.rewards.length, 3);
    assert.equal(opened.collection.packs.length, 0);
    assert.throws(() => openPack(catalog, opened.collection, pack.id));

    const missing = catalog.find((c) => !opened.collection.cards[c.id]);
    if (missing) {
        assert.throws(() => exchangeForCard(catalog, opened.collection, missing.id), /iskričiek/);
        const rich = { ...opened.collection, sparkles: 100 };
        const ex = exchangeForCard(catalog, rich, missing.id);
        assert.equal(ex.collection.sparkles, 100 - EXCHANGE_COST[missing.rarity]);
        assert.equal(ex.collection.cards[missing.id], 1);
    }
});
