/**
 * Hry úrovne 2 – Zvuky a hlásky (bez DOM – testovateľné).
 * Dieťa drží zvuk (fúkanie, sss, zzz…), kým postavička nedôjde do cieľa.
 * Rozpoznávanie: src/core/soundFeatures.js, mikrofón: src/core/micListener.js.
 */

/** Koľko ms správneho zvuku treba na jedno kolo (podľa veku). */
const GOAL_MS = { '3-4': 2500, '5-6': 3500, '7-8': 4500 };

export const SOUND_GAMES = [
    {
        id: 'balon',
        title: 'Fúkaj na balón',
        target: 'fukanie',
        sound: 'fúú',
        intro: 'Fúkaj do mikrofónu a nafúkaj balón!',
        hint: 'Fúkaj!',
        hints: {
            S: 'Nesyč, fúkaj: fúú!',
            Š: 'Nesyč, fúkaj: fúú!',
            hlas: 'Bez hlasu, len fúkaj: fúú!',
            Z: 'Bez hlasu, len fúkaj: fúú!',
            Ž: 'Bez hlasu, len fúkaj: fúú!',
        },
        rounds: 3,
    },
    {
        id: 'had',
        title: 'Had Sykáčik',
        target: 'S',
        sound: 'sss',
        intro: 'Syč ako had: sss! Had sa plazí, kým syčíš.',
        hint: 'Syč: sss!',
        hints: {
            Š: 'To je ššš. Úsmev a syč: sss!',
            Ž: 'To je ššš. Úsmev a syč: sss!',
            Z: 'Bez hlasu, len syč: sss!',
            hlas: 'Syč ako had: sss!',
            fukanie: 'Nefúkaj, syč: sss!',
        },
        rounds: 3,
    },
    {
        id: 'vcielka',
        title: 'Včielka Bzzz',
        target: 'Z',
        sound: 'zzz',
        intro: 'Bzuč ako včielka: zzz! Včielka letí, kým bzučíš.',
        hint: 'Bzuč: zzz!',
        hints: {
            S: 'Zapni hlas: zzz, nie sss!',
            Š: 'Úsmev a bzuč: zzz!',
            Ž: 'Úsmev a bzuč: zzz!',
            hlas: 'Zuby k sebe a bzuč: zzz!',
            fukanie: 'Nefúkaj, bzuč: zzz!',
        },
        rounds: 3,
    },
];

export function getSoundGame(id) {
    return SOUND_GAMES.find((g) => g.id === id) || null;
}

export function goalFor(ageGroup) {
    return GOAL_MS[ageGroup] || GOAL_MS['5-6'];
}

/**
 * Hviezdy za hru podľa najdlhšej neprerušenej výdrže (v pomere k cieľu kola):
 * dlhý plynulý zvuk je cieľom logopedického cvičenia.
 */
export function soundStars(bestHoldMs, goalMs) {
    const r = bestHoldMs / goalMs;
    if (r >= 0.6) return 3;
    if (r >= 0.3) return 2;
    return 1;
}

/** Rada pre nesprávny zvuk (alebo null, ak je zvuk správny / ticho). */
export function hintFor(game, label) {
    if (!label || label === game.target || label === 'ticho') return null;
    return game.hints[label] || game.hint;
}
