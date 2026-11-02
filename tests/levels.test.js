import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateLevelWords, generateWorldPlan, seededRandom } from '../src/core/levelGenerator.js';
import { findWords, getWord, WORDS } from '../src/content/words.js';
import { minigamesFor, isSuitable } from '../src/core/minigames.js';
import { TARGET_PHONEMES } from '../src/core/slovak.js';

test('slovník obsahuje slová so správnymi údajmi', () => {
    assert.ok(WORDS.length > 300);
    const rak = getWord('rak');
    assert.equal(rak.syllables, 1);
    assert.ok(rak.image);
    assert.deepEqual(rak.phonemes.R.positions, ['initial']);
});

test('level 1 vo svete R: slová s R na začiatku, bez zhlukov', () => {
    const { words } = generateLevelWords({ phoneme: 'R', levelNumber: 1, count: 5 });
    assert.equal(words.length, 5);
    for (const w of words) {
        const p = getWord(w).phonemes.R;
        assert.ok(p.positions.includes('initial'), w);
        assert.equal(p.cluster, false, w);
    }
});

test('generovanie je deterministické', () => {
    const a = generateLevelWords({ phoneme: 'Š', levelNumber: 6 });
    const b = generateLevelWords({ phoneme: 'Š', levelNumber: 6 });
    assert.deepEqual(a, b);
    assert.notEqual(seededRandom(1)(), seededRandom(2)());
});

test('pre 3–4 ročné deti len krátke slová', () => {
    const { words } = generateLevelWords({ phoneme: 'R', levelNumber: 14, ageGroup: '3-4', count: 4 });
    assert.ok(words.length > 0);
    for (const w of words) assert.ok(getWord(w).syllables <= 2, w);
});

test('každý svet vie vygenerovať 16 levelov s 5 slovami', () => {
    for (const phoneme of TARGET_PHONEMES) {
        const plan = generateWorldPlan({ phoneme });
        assert.equal(plan.length, 16, phoneme);
        for (const lvl of plan) assert.equal(lvl.words.length, 5, `${phoneme} level ${lvl.levelNumber}`);
    }
});

test('minihry podľa veku a úrovne', () => {
    const young = minigamesFor({ ageGroup: '3-4', tier: 3 }).map((g) => g.id);
    assert.deepEqual(young, []); // existujúce hry sú pre 5+
    const older = minigamesFor({ ageGroup: '7-8', tier: 3 }).map((g) => g.id);
    assert.deepEqual(older, ['banik', 'pexeso', 'mario']);
    assert.ok(minigamesFor({ ageGroup: '3-4', tier: 1, includePlanned: true }).length >= 2);
    assert.equal(isSuitable('mario', '5-6'), false);
    assert.equal(isSuitable('banik', undefined), true);
});

test('findWords – filter podľa veku', () => {
    const all = findWords({ phoneme: 'R' });
    const young = findWords({ phoneme: 'R', age: 3 });
    assert.ok(young.length < all.length);
    assert.ok(young.every((w) => w.minAge <= 3));
});
