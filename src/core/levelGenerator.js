/**
 * Generovanie levelov z pravidiel namiesto ručného zoznamu slov.
 *
 * Postup vo svete písmena (úroveň 3), po 4 leveloch:
 *   1–4   hláska na začiatku slova, bez zhlukov, krátke slová
 *   5–8   hláska na konci slova
 *   9–12  hláska v strede slova
 *   13–16 zhluky (dr, tr, kr…) a dlhšie slová
 * Generovanie je deterministické (seed) – ten istý level má vždy tie isté slová.
 */
import { findWords, WORDS } from '../content/words.js';
import { AGE_DIFFICULTY } from './minigames.js';

export const STAGES = [
    { from: 1, to: 4, name: 'Na začiatku slova', query: { positions: ['initial'], cluster: false, maxSyllables: 2 } },
    { from: 5, to: 8, name: 'Na konci slova', query: { positions: ['final'], cluster: false, maxSyllables: 3 } },
    { from: 9, to: 12, name: 'V strede slova', query: { positions: ['medial'], cluster: false, maxSyllables: 3 } },
    { from: 13, to: Infinity, name: 'Zhluky a dlhšie slová', query: { cluster: true, maxSyllables: 5 } },
];

/** Deterministický generátor náhodných čísel (mulberry32). */
export function seededRandom(seed) {
    let s = typeof seed === 'number' ? seed : hashSeed(String(seed));
    return () => {
        s |= 0;
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function hashSeed(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return h >>> 0;
}

export function shuffle(list, rng) {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function stageFor(levelNumber) {
    return STAGES.find((s) => levelNumber >= s.from && levelNumber <= s.to);
}

/**
 * Vyberie slová pre level.
 * Ak je vhodných slov málo, postupne uvoľňuje podmienky (dĺžka, zhluky, pozícia),
 * aby level mal vždy dosť slov.
 *
 * @param {object} opts
 * @param {string} opts.phoneme       – hláska sveta, napr. 'R'
 * @param {number} opts.levelNumber   – 1…16
 * @param {number} [opts.count=5]
 * @param {number} [opts.age]         – vek dieťaťa (vynechá príliš ťažké slová)
 * @param {string} [opts.ageGroup]    – '3-4' | '5-6' | '7-8'
 * @param {Array}  [opts.words]       – slovník (kvôli testom)
 */
export function generateLevelWords({ phoneme, levelNumber, count = 5, age, ageGroup, words = WORDS }) {
    const stage = stageFor(levelNumber);
    const diff = AGE_DIFFICULTY[ageGroup] || {};
    const base = { ...stage.query, phoneme, age };
    if (diff.maxSyllables) base.maxSyllables = Math.min(base.maxSyllables ?? 99, diff.maxSyllables);
    if (diff.allowClusters === false && base.cluster) base.cluster = false;

    const attempts = [
        base,
        { ...base, maxSyllables: undefined },
        { ...base, maxSyllables: undefined, cluster: undefined },
        { phoneme, age },
        { phoneme },
    ];

    const rng = seededRandom(`${phoneme}:${levelNumber}:${ageGroup || ''}`);
    const chosen = [];
    for (const q of attempts) {
        const pool = shuffle(findWords(q, words), rng).filter((w) => !chosen.includes(w));
        for (const w of pool) {
            if (chosen.length >= count) break;
            chosen.push(w);
        }
        if (chosen.length >= count) break;
    }
    return { stage: stage.name, words: chosen.map((w) => w.word) };
}

/**
 * Plán celého sveta: pre každý level slová a minihru.
 * @param {object} opts – { phoneme, levels = 16, wordsPerLevel = 5, age, ageGroup, games = ['banik'] }
 */
export function generateWorldPlan({ phoneme, levels = 16, wordsPerLevel = 5, age, ageGroup, games = ['banik'] }) {
    return Array.from({ length: levels }, (_, i) => {
        const levelNumber = i + 1;
        const { stage, words } = generateLevelWords({ phoneme, levelNumber, count: wordsPerLevel, age, ageGroup });
        return { levelNumber, stage, words, gameType: games[i % games.length] };
    });
}
