/**
 * Rozpoznávanie zvukov pre úroveň 2 (fúkanie, syčanie, bzučanie…) – priamo
 * v zariadení, bez internetu. Bez DOM: rovnaký kód beží v prehliadači
 * (src/core/micListener.js) aj v testoch (tests/soundFeatures.test.js).
 *
 * 1) features(frame, sampleRate) – akustické príznaky jedného rámca (~43 ms):
 *    hlasitosť, podiely energie v pásmach, ťažisko spektra, plochosť (šum vs. tón),
 *    znelosť (kmitanie hlasiviek, merané na nízkom pásme do 900 Hz).
 * 2) classify(f, calib) – zaradenie do triedy:
 *      ticho · fukanie · S · Š · Z · Ž · hlas (samohláska, mrmlanie) · sum
 *    Fonetika: S má energiu nad ~5 kHz, Š v pásme 2,5–5 kHz; Z/Ž sú to isté so
 *    znelosťou; fúkanie (vietor do mikrofónu) má energiu hlavne pod 1 kHz.
 *    Každá trieda dostane skóre 0–1 (mäkké hranice), vyhráva najvyššie.
 * 3) createTracker() – vyhladenie v čase (väčšina z posledných rámcov)
 *    a meranie výdrže: ako dlho dieťa drží správny zvuk bez prerušenia.
 *
 * Hranice sú nastavené podľa fonetiky a overené na nahrávkach hlások
 * (tests/fixtures/zvuky) – ladiť sa dajú v laboratóriu (zvuky-lab.html).
 */

export const CLASSES = ['ticho', 'fukanie', 'S', 'Š', 'Z', 'Ž', 'hlas', 'sum'];

export const LABELS = {
    ticho: 'ticho',
    fukanie: 'fúkanie',
    S: 'sss (had)',
    Š: 'ššš (vláčik)',
    Z: 'zzz (včielka)',
    Ž: 'žžž (chrobák)',
    hlas: 'hlas (ááá, mmm)',
    sum: 'iný zvuk',
};

// ===================== FFT =====================
const cache = new Map();
function tables(n) {
    if (cache.has(n)) return cache.get(n);
    const rev = new Uint32Array(n);
    const bits = Math.log2(n);
    for (let i = 0; i < n; i++) {
        let r = 0;
        for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b);
        rev[i] = r;
    }
    const cos = new Float64Array(n / 2);
    const sin = new Float64Array(n / 2);
    for (let i = 0; i < n / 2; i++) {
        cos[i] = Math.cos((2 * Math.PI * i) / n);
        sin[i] = -Math.sin((2 * Math.PI * i) / n);
    }
    const hann = new Float64Array(n);
    for (let i = 0; i < n; i++) hann[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1));
    const t = { rev, cos, sin, hann };
    cache.set(n, t);
    return t;
}

/** Výkonové spektrum (n/2+1 hodnôt) rámca s Hannovým oknom. n = mocnina 2. */
export function powerSpectrum(frame) {
    const n = frame.length;
    const { rev, cos, sin, hann } = tables(n);
    const re = new Float64Array(n);
    const im = new Float64Array(n);
    for (let i = 0; i < n; i++) re[rev[i]] = frame[i] * hann[i];
    for (let size = 2; size <= n; size *= 2) {
        const half = size / 2;
        const step = n / size;
        for (let i = 0; i < n; i += size) {
            for (let j = 0; j < half; j++) {
                const k = j * step;
                const tr = re[i + j + half] * cos[k] - im[i + j + half] * sin[k];
                const ti = re[i + j + half] * sin[k] + im[i + j + half] * cos[k];
                re[i + j + half] = re[i + j] - tr;
                im[i + j + half] = im[i + j] - ti;
                re[i + j] += tr;
                im[i + j] += ti;
            }
        }
    }
    const P = new Float64Array(n / 2 + 1);
    for (let i = 0; i <= n / 2; i++) P[i] = re[i] * re[i] + im[i] * im[i];
    return P;
}

// ===================== príznaky =====================
/** Pásma (Hz): b0 hlasivky, b1 nízke, b2 stredné, b3 Š, b4 S, b5 S vysoké. */
export const BANDS = [
    [50, 300],
    [300, 1000],
    [1000, 2500],
    [2500, 5000],
    [5000, 8000],
    [8000, 11000],
];

/**
 * Znelosť 0–1: normalizovaná autokorelácia signálu po dolnej priepusti
 * (~900 Hz) v rozsahu základného tónu 80–450 Hz. Šum ~0, hlas/bzučanie 0,5–1.
 */
function voicing(frame, sampleRate) {
    // dvojitý jednopólový filter dolnej priepusti + decimácia
    const a = Math.exp((-2 * Math.PI * 900) / sampleRate);
    const dec = Math.max(1, Math.floor(sampleRate / 6000));
    const out = [];
    let y1 = 0;
    let y2 = 0;
    for (let i = 0; i < frame.length; i++) {
        y1 = (1 - a) * frame[i] + a * y1;
        y2 = (1 - a) * y1 + a * y2;
        if (i % dec === 0) out.push(y2);
    }
    const sr = sampleRate / dec;
    const n = out.length;
    let mean = 0;
    for (const v of out) mean += v;
    mean /= n;
    for (let i = 0; i < n; i++) out[i] -= mean;
    let e0 = 0;
    for (const v of out) e0 += v * v;
    if (e0 <= 1e-12) return 0;
    const lo = Math.floor(sr / 450);
    const hi = Math.min(n - 1, Math.ceil(sr / 80));
    let best = 0;
    for (let lag = lo; lag <= hi; lag++) {
        let s = 0;
        let ea = 0;
        let eb = 0;
        for (let i = 0; i + lag < n; i++) {
            s += out[i] * out[i + lag];
            ea += out[i] * out[i];
            eb += out[i + lag] * out[i + lag];
        }
        const r = s / Math.sqrt(ea * eb + 1e-12);
        if (r > best) best = r;
    }
    return Math.max(0, Math.min(1, best));
}

/**
 * Príznaky rámca.
 * @param {Float32Array|number[]} frame – vzorky -1..1, dĺžka mocnina 2 (1024/2048)
 * @param {number} sampleRate
 */
export function features(frame, sampleRate) {
    let sum = 0;
    for (let i = 0; i < frame.length; i++) sum += frame[i] * frame[i];
    const rms = Math.sqrt(sum / frame.length);
    const db = 20 * Math.log10(rms + 1e-9);
    const P = powerSpectrum(frame);
    const hz = sampleRate / frame.length;
    const bin = (f) => Math.min(P.length - 1, Math.max(0, Math.round(f / hz)));
    const band = BANDS.map(([a, b]) => {
        let e = 0;
        for (let i = bin(a); i < bin(b); i++) e += P[i];
        return e;
    });
    const total = band.reduce((x, y) => x + y, 0) + 1e-12;
    const share = band.map((e) => e / total);
    const high = band[2] + band[3] + band[4] + band[5] + 1e-12; // nad 1 kHz
    // ťažisko a plochosť spektra (200 Hz – 11 kHz)
    let num = 0;
    let den = 0;
    let logSum = 0;
    let cnt = 0;
    const top = bin(Math.min(11000, sampleRate / 2 - hz));
    for (let i = bin(200); i <= top; i++) {
        num += P[i] * i * hz;
        den += P[i];
        logSum += Math.log(P[i] + 1e-20);
        cnt++;
    }
    const centroid = den > 0 ? num / den : 0;
    const flatness = cnt && den > 0 ? Math.exp(logSum / cnt) / (den / cnt) : 0;
    // ťažisko len nad 1 kHz – rozlíši S od Š aj pri znelých Z/Ž (hlasivky ho neposúvajú)
    let hn = 0;
    let hd = 0;
    for (let i = bin(1000); i <= top; i++) {
        hn += P[i] * i * hz;
        hd += P[i];
    }
    const centroidHigh = hd > 0 ? hn / hd : 0;
    // „šumovosť“ nad 2,5 kHz: syčanie = šum (blízko 1), samohláska = ostré harmonické (blízko 0)
    let hl = 0;
    let hs = 0;
    let hc = 0;
    for (let i = bin(2500); i <= top; i++) {
        hl += Math.log(P[i] + 1e-20);
        hs += P[i];
        hc++;
    }
    const flatHigh = hc && hs > 0 ? Math.exp(hl / hc) / (hs / hc) : 0;
    const hissShare = share[3] + share[4] + share[5]; // energia nad 2,5 kHz
    // S vs. Š: log10(energia nad 5 kHz / energia 2,5–5 kHz). S > 0, Š < 0.
    // Menej citlivé na mikrofón telefónu (oslabené výšky) než samotné ťažisko.
    const sRatio = Math.log10((band[4] + band[5] + 1e-12) / (band[3] + 1e-12));
    return {
        db,
        rms,
        share, // podiely pásiem (súčet 1)
        low: share[0] + share[1], // pod 1 kHz
        highShare: high / total, // nad 1 kHz
        sRel: (band[4] + band[5]) / high, // „S“ pásmo v rámci vysokých frekvencií
        shRel: band[3] / high, // „Š“ pásmo v rámci vysokých frekvencií
        centroid,
        centroidHigh,
        flatness,
        flatHigh,
        hissShare,
        sRatio,
        voicing: voicing(frame, sampleRate),
    };
}

// ===================== klasifikácia =====================
/** mäkký prah: 0 pod a, 1 nad b (lineárne medzi) */
const above = (x, a, b) => Math.max(0, Math.min(1, (x - a) / (b - a)));
const below = (x, a, b) => 1 - above(x, a, b);

/** Predvolená kalibrácia (prepíše ju meranie ticha v miestnosti). */
export const DEFAULT_CALIB = { floorDb: -62, minDb: -48 };

/**
 * Kalibrácia z rámcov ticha (prvá sekunda po zapnutí mikrofónu).
 * Prah hlasitosti = šum miestnosti + 10 dB (aspoň -52 dB, najviac -30 dB).
 */
export function calibrate(featureList) {
    if (!featureList.length) return { ...DEFAULT_CALIB };
    const dbs = featureList.map((f) => f.db).sort((a, b) => a - b);
    const floorDb = dbs[Math.floor(dbs.length * 0.8)];
    return { floorDb, minDb: Math.min(-30, Math.max(-52, floorDb + 10)) };
}

/**
 * Naučenie hranice S/Š pre konkrétne dieťa a mikrofón: z rámcov, keď dieťa
 * hovorí „sss“ a „ššš“, nastaví hranicu do stredu medzi nimi.
 * @returns {{ sBoundary, sWidth, sMedian, shMedian } | null}
 */
export function learnPlace(sFeatures, shFeatures) {
    const pick = (list) => list.filter((f) => f.hissShare > 0.3).map((f) => f.sRatio).sort((a, b) => a - b);
    const a = pick(sFeatures);
    const c = pick(shFeatures);
    if (a.length < 5 || c.length < 5) return null;
    const med = (x) => x[Math.floor(x.length / 2)];
    const sMedian = med(a);
    const shMedian = med(c);
    if (sMedian <= shMedian + 0.1) return null; // nerozlíšiteľné – nechať predvolené
    return { sBoundary: (sMedian + shMedian) / 2, sWidth: Math.max(0.05, Math.min(0.3, (sMedian - shMedian) / 4)), sMedian, shMedian };
}

/**
 * Skóre tried pre rámec. @returns {{ label, confidence, scores }}
 */
export function classify(f, calib = DEFAULT_CALIB) {
    const loud = above(f.db, calib.minDb - 3, calib.minDb + 3);
    // znelosť = periodicita v nízkom pásme A energia hlasiviek pod 1 kHz
    // (čistý šum S/Š má pod 1 kHz takmer nič, falošná periodicita sa neráta)
    const voiced = above(f.voicing, 0.45, 0.6) * above(f.low, 0.03, 0.07);
    const unvoiced = 1 - voiced;
    // syčanie = energia nad 2,5 kHz (samohlásky tam majú do ~3 %, S/Š 65–99 %)
    const hiss = above(f.hissShare, 0.3, 0.5);
    const hissVoiced = above(f.hissShare, 0.08, 0.2); // pri Z/Ž časť energie berú hlasivky
    // S vs. Š podľa pomeru pásiem (sRatio); hranicu si model vie naučiť pre
    // konkrétne dieťa a telefón (learnPlace) – inak predvolená 0,2 ± 0,15
    const b = calib.sBoundary ?? 0.2;
    const w = calib.sWidth ?? 0.15;
    const sLike = above(f.sRatio, b - w, b + w);
    const shLike = (1 - sLike) * above(f.centroidHigh, 2000, 2600);
    const scores = {
        ticho: 1 - loud,
        fukanie: loud * unvoiced * Math.max(above(f.low, 0.45, 0.65), below(f.centroid, 1800, 2600) * above(f.flatness, 0.12, 0.25)),
        S: loud * unvoiced * hiss * sLike,
        Š: loud * unvoiced * hiss * shLike,
        Z: loud * voiced * hissVoiced * sLike,
        Ž: loud * voiced * hissVoiced * shLike,
        hlas: loud * voiced * below(f.hissShare, 0.08, 0.2),
    };
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    let label = best[0];
    let confidence = best[1];
    if (confidence < 0.35) {
        label = loud > 0.5 ? 'sum' : 'ticho';
        confidence = loud > 0.5 ? 1 - confidence : 1 - loud;
    }
    scores.sum = label === 'sum' ? confidence : 0;
    return { label, confidence, scores };
}

// ===================== vyhladenie a výdrž =====================
/**
 * Sledovanie zvuku v čase.
 *   push(result, dtMs) → { label, held } – label = väčšina z posledných `window`
 *   rámcov; held = ako dlho (ms) bez prerušenia trvá cieľový zvuk.
 * Krátke výpadky (do `gapMs`) výdrž neprerušia – deti sa nadychujú a kolíšu.
 * @param {{ target?: string|string[], window?: number, gapMs?: number }} o
 */
export function createTracker({ target = null, window = 5, gapMs = 220 } = {}) {
    const targets = target ? [].concat(target) : null;
    const recent = [];
    let held = 0;
    let gap = 0;
    let total = 0;
    let best = 0;
    return {
        push(result, dtMs) {
            recent.push(result.label);
            if (recent.length > window) recent.shift();
            const counts = {};
            for (const l of recent) counts[l] = (counts[l] || 0) + 1;
            const label = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
            if (targets) {
                if (targets.includes(label)) {
                    held += dtMs + gap;
                    total += dtMs;
                    gap = 0;
                } else if (held > 0 && gap + dtMs <= gapMs) {
                    gap += dtMs;
                } else {
                    held = 0;
                    gap = 0;
                }
                best = Math.max(best, held);
            }
            return { label, held, total, best };
        },
        reset() {
            recent.length = 0;
            held = 0;
            gap = 0;
            total = 0;
            best = 0;
        },
    };
}
