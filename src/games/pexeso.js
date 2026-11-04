/**
 * Logika pexesa (bez DOM – testovateľná): výber slov, počet párov, hviezdy.
 */
import { seededRandom, shuffle } from '../core/levelGenerator.js';

/**
 * Počet párov podľa levelu a veku (js/age-difficulty.js: maxPairs).
 * Najstarší dostanú o 2 páry viac. Nikdy viac párov ako slov.
 */
export function pexesoPairs({ levelPairs = 6, ageGroup = '5-6', maxPairs = 10, words = 99 }) {
    const bonus = ageGroup === '7-8' ? 2 : 0;
    return Math.max(2, Math.min(levelPairs + bonus, maxPairs, words));
}

/** Karty: každé slovo dvakrát, zamiešané. */
export function makeDeck(words, pairs, seed = Date.now()) {
    const rng = seededRandom(`deck:${seed}`);
    const unique = [...new Set(words.map((w) => String(w).toLowerCase()))];
    const chosen = shuffle(unique, rng).slice(0, pairs);
    return shuffle(chosen.flatMap((word) => [word, word]), rng).map((word, id) => ({ id, word }));
}

/** Hviezdy podľa správne vyslovených slov (ako pôvodné pexeso). */
export function pexesoStars(correctSpeech, pairs) {
    if (!pairs) return 0;
    const ratio = correctSpeech / pairs;
    if (ratio >= 0.9) return 3;
    if (ratio >= 0.7) return 2;
    return 1;
}
