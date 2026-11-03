import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makePictureRounds, makeSoundBoard, soundPexesoStars, makeBellsPlan, listeningWords } from '../src/games/tier1Games.js';
import { buildTier1Path, gamesFor } from '../src/content/tier1.js';
import { getWord } from '../src/content/words.js';

test('všetky slová v sluchových hrách majú obrázok aj nahrávku', () => {
    for (const age of ['3-4', '5-6', '7-8']) {
        const ws = listeningWords(age);
        assert.ok(ws.length > 50, age);
        for (const w of ws) assert.ok(w.image && w.audio, w.word);
    }
});

test('Čo počuješ?: správne slovo je medzi možnosťami, počet podľa veku', () => {
    for (const [age, n] of [['3-4', 2], ['5-6', 3], ['7-8', 4]]) {
        const rounds = makePictureRounds({ count: 4, ageGroup: age, levelNumber: 3, seed: 't' });
        assert.equal(rounds.length, 4);
        for (const r of rounds) {
            assert.equal(r.options.length, n);
            assert.ok(r.options.includes(r.target));
            assert.equal(new Set(r.options).size, n);
            for (const o of r.options) assert.ok(getWord(o));
        }
    }
});

test('Zvukové pexeso: každé slovo práve dvakrát', () => {
    const b = makeSoundBoard({ ageGroup: '5-6', levelNumber: 2, seed: 'x' });
    assert.equal(b.cards.length, b.pairs * 2);
    const counts = {};
    b.cards.forEach((w) => (counts[w] = (counts[w] || 0) + 1));
    assert.ok(Object.values(counts).every((c) => c === 2));
    assert.equal(soundPexesoStars(4, 5), 3);
    assert.equal(soundPexesoStars(4, 20), 1);
});

test('Zvončeky: poradie sa predlžuje a používa len existujúce zvončeky', () => {
    const p = makeBellsPlan({ ageGroup: '7-8', levelNumber: 12, seed: 'b' });
    p.rounds.forEach((seq, i) => {
        if (i) assert.equal(seq.length, p.rounds[i - 1].length + 1);
        assert.ok(seq.every((x) => x >= 0 && x < p.bells));
    });
});

test('cesta úrovne 1 strieda minihry, zvončeky až od 5 rokov', () => {
    const small = buildTier1Path('3-4');
    const big = buildTier1Path('5-6');
    assert.ok(!small.some((l) => l.game === 'mine-bells'));
    assert.ok(big.some((l) => l.game === 'mine-bells'));
    assert.deepEqual(big.slice(0, 4).map((l) => l.game), gamesFor('5-6').map((g) => g.id));
    assert.equal(new Set(big.map((l) => l.id)).size, big.length);
});
