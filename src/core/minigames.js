/**
 * Zoznam minihier: pre ktorú úroveň a vek sú, a či sú už hotové.
 *
 * tiers: 1 = Počúvam, 2 = Zvuky a hlásky, 3 = Slová
 * ages:  vekové skupiny z profiles.AGE_GROUPS
 * status: 'ready' (hrateľná) | 'planned' (v pláne, zatiaľ sa nezobrazuje)
 */
export const TIERS = [
    { id: 1, title: 'Počúvam', description: 'Sluchové cvičenia – rozlišovanie slov a zvukov' },
    { id: 2, title: 'Zvuky a hlásky', description: 'Fúkanie, rozcvička jazýčka, syčanie, bzučanie, slabiky' },
    { id: 3, title: 'Slová', description: 'Vyslovovanie slov vo svetoch písmen' },
];

export const MINIGAMES = [
    // existujúce hry
    { id: 'banik', title: 'Baňa', tiers: [3], ages: ['3-4', '5-6', '7-8'], exercise: ['speech', 'listening'], page: 'game.html', status: 'ready' },
    { id: 'pexeso', title: 'Pexeso', tiers: [3], ages: ['5-6', '7-8'], exercise: ['speech'], page: 'pexeso.html', status: 'ready' },
    { id: 'mario', title: 'Super Jožino', tiers: [3], ages: ['7-8'], exercise: ['speech', 'listening'], page: 'superjozino.html', status: 'ready' },

    // úroveň 1 – Počúvam
    { id: 'same-different', title: 'Rovnaké alebo iné?', tiers: [1], ages: ['3-4', '5-6', '7-8'], exercise: ['listening'], page: 'pocuvaj.html', status: 'ready' },
    { id: 'find-picture', title: 'Čo počuješ?', tiers: [1], ages: ['3-4', '5-6', '7-8'], exercise: ['listening'], page: 'obrazky.html', status: 'ready' },
    { id: 'who-makes-it', title: 'Kto to robí?', tiers: [1], ages: ['3-4', '5-6', '7-8'], exercise: ['listening'], status: 'planned' }, // chýbajú zvuky zvierat/predmetov
    { id: 'sound-pexeso', title: 'Zvukové pexeso', tiers: [1], ages: ['3-4', '5-6', '7-8'], exercise: ['listening'], page: 'zvpexeso.html', status: 'ready' },
    { id: 'mine-bells', title: 'Zvončeky v bani', tiers: [1], ages: ['5-6', '7-8'], exercise: ['listening'], page: 'zvoncky.html', status: 'ready' },
    { id: 'phoneme-train', title: 'Hláskový vláčik', tiers: [1], ages: ['5-6', '7-8'], exercise: ['listening'], page: 'vlacik.html', status: 'ready' },

    // úroveň 2 – Zvuky a hlásky
    { id: 'blow-balloon', title: 'Fúkaj na balón', tiers: [2], ages: ['3-4', '5-6', '7-8'], exercise: ['breath'], page: 'zvuky.html?hra=balon', status: 'ready' },
    { id: 'hissing-snake', title: 'Had Sykáčik', tiers: [2], ages: ['3-4', '5-6', '7-8'], exercise: ['sound'], page: 'zvuky.html?hra=had', status: 'ready' },
    { id: 'buzzing-bee', title: 'Včielka Bzzz', tiers: [2], ages: ['3-4', '5-6', '7-8'], exercise: ['sound'], page: 'zvuky.html?hra=vcielka', status: 'ready' },
    { id: 'syllable-avalanche', title: 'Slabiková lavína', tiers: [2], ages: ['5-6', '7-8'], exercise: ['syllables'], status: 'planned' },
    { id: 'mirror', title: 'Zrkadielko', tiers: [2], ages: ['3-4', '5-6', '7-8'], exercise: ['oromotor'], status: 'planned' },
];

/**
 * Obťažnosť podľa veku – výber slov a minihry úrovne 1. Hry úrovne 3
 * (Baňa, Pexeso, Super Jožino) majú nastavenia v public/js/age-difficulty.js.
 */
export const AGE_DIFFICULTY = {
    '3-4': { pexesoCards: 8, maxSyllables: 2, sessionMinutes: 3, allowClusters: false },
    '5-6': { pexesoCards: 12, maxSyllables: 3, sessionMinutes: 5, allowClusters: true },
    '7-8': { pexesoCards: 20, maxSyllables: 5, sessionMinutes: 8, allowClusters: true },
};

export function getMinigame(id) {
    return MINIGAMES.find((g) => g.id === id) || null;
}

/**
 * Minihry vhodné pre vek a úroveň.
 * @param {object} q – { ageGroup, tier, includePlanned }
 */
export function minigamesFor({ ageGroup, tier, includePlanned = false } = {}) {
    return MINIGAMES.filter(
        (g) =>
            (includePlanned || g.status === 'ready') &&
            (!tier || g.tiers.includes(tier)) &&
            (!ageGroup || g.ages.includes(ageGroup)),
    );
}

/** Hodí sa minihra pre dieťa? (bez zadaného veku sa zobrazí všetko) */
export function isSuitable(gameId, ageGroup) {
    const g = getMinigame(gameId);
    if (!g) return false;
    return !ageGroup || g.ages.includes(ageGroup);
}
