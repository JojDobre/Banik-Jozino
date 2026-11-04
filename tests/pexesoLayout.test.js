import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scatterLayout } from '../src/games/pexesoLayout.js';

function bbox(c, s) {
    const r = (Math.abs(c.rot) * Math.PI) / 180;
    const b = s * (Math.cos(r) + Math.sin(r));
    const cx = c.x + s / 2;
    const cy = c.y + s / 2;
    return { l: cx - b / 2, r: cx + b / 2, t: cy - b / 2, b: cy + b / 2 };
}

test('pexeso: karty sa neprekrývajú a sú celé na stole', () => {
    for (const count of [6, 8, 12, 16, 20]) {
        for (const [width, height] of [[1480, 600], [1300, 560], [1700, 760]]) {
            const { size, cards } = scatterLayout({ count, width, height, seed: count + width });
            assert.equal(cards.length, count);
            const boxes = cards.map((c) => bbox(c, size));
            for (const b of boxes) {
                assert.ok(b.l >= -0.5 && b.t >= -0.5 && b.r <= width + 0.5 && b.b <= height + 0.5, `${count} mimo stola`);
            }
            for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
                const a = boxes[i], b = boxes[j];
                assert.ok(a.r <= b.l || b.r <= a.l || a.b <= b.t || b.b <= a.t, `${count}: karty ${i} a ${j} sa prekrývajú`);
            }
        }
    }
});

test('pexeso: menej kariet = väčšie karty, stôl je využitý', () => {
    const s8 = scatterLayout({ count: 8, width: 1480, height: 600 }).size;
    const s20 = scatterLayout({ count: 20, width: 1480, height: 600 }).size;
    assert.ok(s8 > s20);
    // karty pokryjú aspoň štvrtinu stola (nie sú zbytočne malé)
    for (const count of [8, 12, 20]) {
        const { size } = scatterLayout({ count, width: 1480, height: 600, maxCard: 999 });
        assert.ok((count * size * size) / (1480 * 600) > 0.25, `${count}: ${size}`);
    }
});
