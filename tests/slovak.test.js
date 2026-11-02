import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchesWord, normalizeTranscript, countSyllables, analyzePhoneme, tokenize } from '../src/core/slovak.js';

test('porovnanie slova je rovnaké ako v Bani (presná zhoda bez interpunkcie)', () => {
    assert.equal(matchesWord('Ryba.', 'ryba'), true);
    assert.equal(matchesWord('  RAK ', 'rak'), true);
    assert.equal(matchesWord('lyba', 'ryba'), false);
    assert.equal(matchesWord('ryby', 'ryba'), false);
    assert.equal(matchesWord('', 'ryba'), false);
    assert.equal(normalizeTranscript('šašo!'), 'šašo');
});

test('ch, dz, dž sú jedna hláska', () => {
    assert.deepEqual(tokenize('chata'), ['ch', 'a', 't', 'a']);
    assert.deepEqual(tokenize('džús'), ['dž', 'ú', 's']);
});

test('počet slabík', () => {
    assert.equal(countSyllables('rak'), 1);
    assert.equal(countSyllables('ryba'), 2);
    assert.equal(countSyllables('krokodíl'), 3);
    assert.equal(countSyllables('krtko'), 2); // slabikotvorné r
    assert.equal(countSyllables('vlk'), 1);
    assert.equal(countSyllables('mlieko'), 2); // dvojhláska ie
});

test('poloha hlásky a zhluky', () => {
    assert.deepEqual(analyzePhoneme('rak', 'R'), { positions: ['initial'], cluster: false });
    assert.deepEqual(analyzePhoneme('drak', 'R'), { positions: ['medial'], cluster: true });
    assert.deepEqual(analyzePhoneme('syr', 'R'), { positions: ['final'], cluster: false });
    assert.equal(analyzePhoneme('ryba', 'L'), null);
});

test('mäkčenie d, t, n pred e/i/í', () => {
    assert.equal(analyzePhoneme('deti', 'D'), null);
    assert.deepEqual(analyzePhoneme('deti', 'Ď').positions, ['initial']);
    assert.deepEqual(analyzePhoneme('deti', 'Ť').positions, ['medial']);
    assert.deepEqual(analyzePhoneme('dom', 'D').positions, ['initial']);
});

test('ch nie je C ani H', () => {
    assert.equal(analyzePhoneme('chata', 'C'), null);
});
