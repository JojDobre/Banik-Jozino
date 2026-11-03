import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAllLevels, buildWorldLevels, WORLD_PHONEME, GAME_CYCLE, splitLevels } from '../src/core/worldLevels.js';
import { getWord } from '../src/content/words.js';

const all = buildAllLevels();

test('každý svet má 16 levelov s poradovými číslami a jedinečnými id', () => {
    const ids = new Set();
    for (const [worldId, levels] of Object.entries(all)) {
        assert.equal(levels.length, 16, worldId);
        levels.forEach((l, i) => {
            assert.equal(l.levelNumber, i + 1, l.id);
            assert.ok(!ids.has(l.id), 'duplicitné id ' + l.id);
            ids.add(l.id);
        });
    }
});

test('slová sú zo slovníka, obsahujú hlásku sveta a je ich dosť na cvičenia', () => {
    for (const [worldId, levels] of Object.entries(all)) {
        const ph = WORLD_PHONEME[worldId];
        for (const l of levels) {
            assert.ok(l.words.length >= 4, l.id);
            assert.equal(new Set(l.words).size, l.words.length, 'duplicitné slovo v ' + l.id);
            assert.ok(l.gameConfig.diamonds <= l.words.length, l.id);
            for (const w of l.words) {
                const e = getWord(w);
                assert.ok(e, `${w} nie je v slovníku (${l.id})`);
                assert.ok(e.phonemes[ph], `${w} nemá hlásku ${ph} (${l.id})`);
            }
        }
    }
});

test('susedné levely nemajú rovnaké slová', () => {
    for (const levels of Object.values(all)) {
        for (let i = 1; i < levels.length; i++) {
            assert.notDeepEqual([...levels[i].words].sort(), [...levels[i - 1].words].sort(), levels[i].id);
        }
    }
});

test('levely sa odomykajú postupne, hry sa striedajú', () => {
    for (const levels of Object.values(all)) {
        assert.equal(levels[0].unlockRequirement, null);
        for (let i = 1; i < levels.length; i++) assert.equal(levels[i].unlockRequirement.levelId, levels[i - 1].id);
        levels.forEach((l, i) => assert.equal(l.gameType, GAME_CYCLE[i % GAME_CYCLE.length]));
        for (const l of levels) {
            if (l.gameType === 'pexeso') assert.ok(l.gameConfig.pairs >= 6);
            if (l.gameType === 'mario') assert.ok(l.gameConfig.sjLevel >= 1 && l.gameConfig.sjLevel <= 3);
        }
    }
});

test('generovanie je deterministické', () => {
    assert.deepEqual(buildWorldLevels('world_r'), buildWorldLevels('world_r'));
});

test('rozdelenie levelov medzi etapy', () => {
    assert.deepEqual(splitLevels(16, 4), [4, 4, 4, 4]);
    assert.deepEqual(splitLevels(16, 3), [6, 5, 5]);
});
