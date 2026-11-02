/**
 * Logika minihry „Rovnaké alebo iné?“ (bez DOM – testovateľná).
 */

export const PAIR_FOLDERS = 15;

/** Hviezdy podľa úspešnosti (0–1). Mierne k deťom. */
export function starsForScore(ratio) {
    if (ratio >= 0.9) return 3;
    if (ratio >= 0.6) return 2;
    if (ratio >= 0.3) return 1;
    return 0;
}

/** Kolá: polovica rovnakých, polovica iných, rôzne dvojice slov, náhodné poradie. */
export function makeRounds(count, rng = Math.random) {
    const folders = Array.from({ length: PAIR_FOLDERS }, (_, i) => i + 1).sort(() => rng() - 0.5);
    const rounds = Array.from({ length: count }, (_, i) => {
        const folder = folders[i % folders.length];
        const same = i % 2 === 0;
        const first = rng() < 0.5 ? 1 : 2;
        const second = same ? first : 3 - first;
        return { folder, same, a: `zvuky/${folder}/${first}.wav`, b: `zvuky/${folder}/${second}.wav` };
    });
    return rounds.sort(() => rng() - 0.5);
}
