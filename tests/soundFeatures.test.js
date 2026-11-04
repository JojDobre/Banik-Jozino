import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { features, classify, calibrate, createTracker } from '../src/core/soundFeatures.js';
import { readWav, frames } from './helpers/wav.js';

const SR = 48000;
const N = 2048;

// ---------- umelé zvuky ----------
function rng(seed = 1) {
    let s = seed >>> 0;
    return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296) * 2 - 1;
}
/** biquad (RBJ) – 'lp' | 'hp' | 'bp' */
function biquad(x, type, f0, q = 0.707) {
    const w = (2 * Math.PI * f0) / SR;
    const al = Math.sin(w) / (2 * q);
    const c = Math.cos(w);
    let b0, b1, b2;
    if (type === 'lp') [b0, b1, b2] = [(1 - c) / 2, 1 - c, (1 - c) / 2];
    else if (type === 'hp') [b0, b1, b2] = [(1 + c) / 2, -(1 + c), (1 + c) / 2];
    else [b0, b1, b2] = [al, 0, -al];
    const a0 = 1 + al;
    const a1 = -2 * c;
    const a2 = 1 - al;
    const y = new Float32Array(x.length);
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < x.length; i++) {
        const v = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
        x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
    }
    return y;
}
const noise = (n, seed) => { const r = rng(seed); return Float32Array.from({ length: n }, r); };
const scale = (x, peak) => { let m = 0; for (const v of x) m = Math.max(m, Math.abs(v)); return x.map((v) => (v / (m || 1)) * peak); };
const mix = (...xs) => xs[0].map((_, i) => xs.reduce((s, x) => s + x[i], 0));
/** „hlasivky“: pílový tón s harmonickými, zaoblený dolnou priepusťou */
function voice(n, f0, cutoff = 1200) {
    const x = new Float32Array(n);
    for (let i = 0; i < n; i++) x[i] = 2 * ((i * f0) / SR % 1) - 1;
    return biquad(biquad(x, 'lp', cutoff), 'lp', cutoff);
}
const LEN = SR; // 1 s
const SYN = {
    S: () => scale(biquad(biquad(noise(LEN, 3), 'hp', 5500), 'hp', 5500), 0.3),
    Š: () => scale(biquad(biquad(noise(LEN, 4), 'bp', 3500, 1.2), 'bp', 3500, 1.2), 0.3),
    Z: () => mix(scale(biquad(biquad(noise(LEN, 5), 'hp', 5500), 'hp', 5500), 0.25), scale(voice(LEN, 190), 0.12)),
    Ž: () => mix(scale(biquad(biquad(noise(LEN, 6), 'bp', 3500, 1.2), 'bp', 3500, 1.2), 0.25), scale(voice(LEN, 190), 0.12)),
    hlas: () => scale(voice(LEN, 220, 900), 0.3),
    fukanie: () => scale(biquad(biquad(noise(LEN, 7), 'lp', 400), 'lp', 400), 0.5),
    ticho: () => scale(noise(LEN, 8), 0.0004),
};

function labelsOf(x, sr = SR, n = N) {
    const out = [];
    for (const fr of frames(x, n, n / 2)) out.push(classify(features(fr, sr)).label);
    return out;
}
const share = (arr, label) => arr.filter((l) => [].concat(label).includes(l)).length / arr.length;

for (const [label, make] of Object.entries(SYN)) {
    test(`zvuk: umelé ${label} sa rozpozná`, () => {
        const labels = labelsOf(make());
        assert.ok(share(labels, label) >= 0.85, `${label}: ${JSON.stringify(labels.slice(0, 12))}`);
    });
}

test('zvuk: S a Š sa nemýlia ani pri tichšom zvuku', () => {
    const s = labelsOf(SYN.S().map((v) => v * 0.15));
    const sh = labelsOf(SYN.Š().map((v) => v * 0.15));
    assert.equal(share(s, ['Š', 'Ž']), 0);
    assert.equal(share(sh, ['S', 'Z']), 0);
});

// ---------- nahrávky hlások (hlas Viktória a Lukáš, tests/fixtures/zvuky) ----------
// Nahrávky obsahujú aj samohlásky medzi hláskami – hodnotíme len syčiace rámce:
// miesto artikulácie (S/Z oproti Š/Ž) sa musí trafiť aspoň v 80 % (mužský hlas má Š vyššie).
const DIR = new URL('./fixtures/zvuky/', import.meta.url).pathname;
const PLACE = { s: ['S', 'Z'], z: ['S', 'Z'], sh: ['Š', 'Ž'], zh: ['Š', 'Ž'] };
for (const file of readdirSync(DIR).filter((f) => f.endsWith('.wav'))) {
    const kind = file.split('_')[0];
    test(`zvuk: nahrávka ${file}`, () => {
        const { sampleRate, samples } = readWav(DIR + file);
        const labels = labelsOf(samples, sampleRate, 1024);
        const fric = labels.filter((l) => ['S', 'Z', 'Š', 'Ž'].includes(l));
        if (kind === 'a') {
            // samohláska: takmer všetko „hlas“, žiadne syčanie
            const loud = labels.filter((l) => l !== 'ticho');
            assert.ok(share(loud, 'hlas') >= 0.8, file);
            assert.ok(fric.length <= 3, file);
            return;
        }
        assert.ok(fric.length >= 15, `${file}: málo syčiacich rámcov (${fric.length})`);
        assert.ok(share(fric, PLACE[kind]) >= 0.8, `${file}: ${JSON.stringify(fric)}`);
    });
}

// ---------- kalibrácia a výdrž ----------
test('zvuk: kalibrácia podľa šumu miestnosti', () => {
    const quiet = Array.from({ length: 20 }, () => ({ db: -70 }));
    assert.equal(calibrate(quiet).minDb, -52);
    const noisy = Array.from({ length: 20 }, () => ({ db: -45 }));
    assert.equal(calibrate(noisy).minDb, -35);
});

test('zvuk: výdrž – krátke prerušenie nevadí, dlhé áno', () => {
    const t = createTracker({ target: 'S', window: 1, gapMs: 200 });
    const push = (label, n) => { let r; for (let i = 0; i < n; i++) r = t.push({ label }, 50); return r; };
    push('S', 20); // 1 s
    let r = push('ticho', 3); // 150 ms výpadok
    r = push('S', 10);
    assert.ok(r.held >= 1600, `held ${r.held}`);
    push('ticho', 6); // 300 ms – preruší
    r = push('S', 2);
    assert.ok(r.held <= 150);
    assert.ok(r.best >= 1600);
});
