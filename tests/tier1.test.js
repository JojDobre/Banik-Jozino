import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTier1Path, roundsFor, CHAPTERS, LEVELS_PER_CHAPTER, levelUrl } from '../src/content/tier1.js';
import { createTierProgress } from '../src/core/tierProgress.js';
import { makeRounds, starsForScore, PAIR_FOLDERS, pairSources } from '../src/games/sameDifferent.js';
import { seededRandom } from '../src/core/levelGenerator.js';
import { createProfileStore, AVATARS, needsSetup, avatarById } from '../src/core/profiles.js';

function memoryStorage() {
    const m = new Map();
    return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}

test('cesta úrovne 1: kapitoly, míľniky, jedinečné id', () => {
    const path = buildTier1Path('5-6');
    assert.equal(path.length, CHAPTERS.length * LEVELS_PER_CHAPTER);
    assert.equal(new Set(path.map((l) => l.id)).size, path.length);
    assert.deepEqual(path.filter((l) => l.milestone).map((l) => l.number), [4, 8, 12, 16, 20, 24, 28]);
    assert.equal(path[0].chapter, 1);
    assert.equal(path[10].chapter, 2);
    assert.equal(levelUrl(path[0]), 'pocuvaj.html?level=t1_01');
    assert.equal(levelUrl(path[2]), 'zvpexeso.html?level=t1_03'); // minihry sa striedajú
});

test('mladšie deti majú kratšie levely, obťažnosť stúpa s kapitolou', () => {
    assert.ok(roundsFor(1, '3-4') < roundsFor(1, '7-8'));
    assert.ok(roundsFor(21, '5-6') > roundsFor(1, '5-6'));
});

test('postup: odomykanie, najlepšie hviezdy, prvé splnenie', () => {
    const s = memoryStorage();
    const path = buildTier1Path('5-6');
    const prog = createTierProgress(s, 'p1');
    assert.equal(prog.isUnlocked(path, 0), true);
    assert.equal(prog.isUnlocked(path, 1), false);

    let r = prog.record('t1_01', 0);
    assert.equal(r.firstCompletion, false);
    assert.equal(prog.isUnlocked(path, 1), false);

    r = prog.record('t1_01', 2);
    assert.deepEqual(r, { stars: 2, previousStars: 0, firstCompletion: true });
    assert.equal(prog.isUnlocked(path, 1), true);

    r = prog.record('t1_01', 1); // horší výsledok neprepíše lepší
    assert.equal(prog.stars('t1_01'), 2);
    assert.equal(r.firstCompletion, false);

    assert.equal(prog.currentIndex(path), 1);
    assert.equal(prog.totalStars(path), 2);
    // iný profil má vlastný postup
    assert.equal(createTierProgress(s, 'p2').stars('t1_01'), 0);
    // po opätovnom načítaní sa zachová
    assert.equal(createTierProgress(s, 'p1').stars('t1_01'), 2);
});

test('Rovnaké alebo iné: kolá sú vyvážené a z rôznych dvojíc', () => {
    const rounds = makeRounds(6, seededRandom(7));
    assert.equal(rounds.length, 6);
    assert.equal(rounds.filter((r) => r.same).length, 3);
    assert.equal(new Set(rounds.map((r) => r.folder || r.words.join('/'))).size, 6);
    for (const r of rounds) {
        assert.ok((r.folder >= 1 && r.folder <= PAIR_FOLDERS) || (r.words && r.words.length === 2));
        assert.ok(r.a && r.b);
        assert.equal(r.same, r.a === r.b);
        assert.match(r.a, /^(zvuky\/\d+\/[12]\.wav|hlas\/slova\/.+\.mp3)$/);
    }
});

test('hviezdy podľa úspešnosti', () => {
    assert.equal(starsForScore(1), 3);
    assert.equal(starsForScore(0.75), 2);
    assert.equal(starsForScore(0.4), 1);
    assert.equal(starsForScore(0.1), 0);
});

test('profil: avatar a potreba nastaviť vek', () => {
    const store = createProfileStore(memoryStorage());
    const p = store.ensureDefault();
    assert.equal(needsSetup(p), true);
    assert.equal(p.avatar, AVATARS[0].id);
    store.update(p.id, { age: 4, avatar: 'old_miner', name: 'Ema' });
    assert.equal(needsSetup(store.active()), false);
    assert.equal(avatarById(store.active().avatar).name, 'Dedko');
    assert.equal(avatarById('neexistuje').id, AVATARS[0].id);
});

test('Rovnaké alebo iné? má ľudské aj nové minimálne dvojice', () => {
    const src = pairSources();
    assert.ok(src.length >= 30);
    assert.ok(src.some((p) => p.folder) && src.some((p) => p.words));
});
