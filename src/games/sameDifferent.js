/**
 * Logika minihry „Rovnaké alebo iné?“ (bez DOM – testovateľná).
 */
import { WORD_PAIRS } from '../content/pairs.js';
import wordAudio from '../content/wordAudio.generated.js';

export const PAIR_FOLDERS = 15;

/** Hviezdy podľa úspešnosti (0–1). Mierne k deťom. */
export function starsForScore(ratio) {
    if (ratio >= 0.9) return 3;
    if (ratio >= 0.6) return 2;
    if (ratio >= 0.3) return 1;
    return 0;
}

/**
 * Zdroje dvojíc: ľudské nahrávky (zvuky/<1..15>/1.wav a 2.wav) a minimálne
 * dvojice z src/content/pairs.js (hlas Piper).
 */
export function pairSources() {
    const human = Array.from({ length: PAIR_FOLDERS }, (_, i) => ({
        folder: i + 1,
        files: [`zvuky/${i + 1}/1.wav`, `zvuky/${i + 1}/2.wav`],
    }));
    const generated = WORD_PAIRS
        .filter(([a, b]) => wordAudio[a] && wordAudio[b])
        .map(([a, b, contrast]) => ({ words: [a, b], contrast, files: [wordAudio[a], wordAudio[b]] }));
    return [...human, ...generated];
}

/** Kolá: polovica rovnakých, polovica iných, rôzne dvojice slov, náhodné poradie. */
export function makeRounds(count, rng = Math.random) {
    const sources = pairSources().sort(() => rng() - 0.5);
    const rounds = Array.from({ length: count }, (_, i) => {
        const src = sources[i % sources.length];
        const same = i % 2 === 0;
        const first = rng() < 0.5 ? 0 : 1;
        const second = same ? first : 1 - first;
        return { folder: src.folder, words: src.words, contrast: src.contrast, same, a: src.files[first], b: src.files[second] };
    });
    return rounds.sort(() => rng() - 0.5);
}
