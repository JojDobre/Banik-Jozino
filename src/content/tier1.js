/**
 * Úroveň 1 – Počúvam: cesta levelov (bez svetov).
 *
 * Cesta je rozdelená na kapitoly po 10 leveloch. Každý 4. level je míľnik
 * (truhlica = balíček kariet, viď rewards.MILESTONE_EVERY).
 * Minihry sa v ceste striedajú (nové stačí pridať do GAMES).
 */
import { MILESTONE_EVERY } from '../core/rewards.js';

export const TIER1_SET = 'tier1';

export const CHAPTERS = [
    { id: 1, title: 'Prvé zvuky', background: 'images/worlds/world_l.png' },
    { id: 2, title: 'Ozvena v bani', background: 'images/worlds/world_k.png' },
    { id: 3, title: 'Majster ucha', background: 'images/worlds/world_s.png' },
];

export const LEVELS_PER_CHAPTER = 10;

/**
 * Minihry úrovne 1 (poradie = striedanie v ceste). minAge = od koľkých rokov
 * (mladšie deti hru preskočia).
 */
export const GAMES = [
    { id: 'same-different', page: 'pocuvaj.html' },
    { id: 'find-picture', page: 'obrazky.html' },
    { id: 'sound-pexeso', page: 'zvpexeso.html' },
    { id: 'mine-bells', page: 'zvoncky.html', minAge: 5 },
    { id: 'phoneme-train', page: 'vlacik.html', minAge: 5 },
];

const AGE_MIN = { '3-4': 3, '5-6': 5, '7-8': 7 };
export function gamesFor(ageGroup) {
    const age = AGE_MIN[ageGroup] ?? 5;
    return GAMES.filter((g) => !g.minAge || age >= g.minAge);
}

/**
 * Počet kôl v leveli podľa veku a poradia levelu.
 * Mladšie deti majú kratšie hry, obťažnosť mierne stúpa s každou kapitolou.
 */
export function roundsFor(levelNumber, ageGroup) {
    const base = { '3-4': 3, '5-6': 4, '7-8': 5 }[ageGroup] ?? 4;
    const chapterBonus = Math.floor((levelNumber - 1) / LEVELS_PER_CHAPTER);
    return base + chapterBonus;
}

/**
 * Vytvorí cestu levelov úrovne 1.
 * @param {string} [ageGroup] – '3-4' | '5-6' | '7-8'
 */
export function buildTier1Path(ageGroup) {
    const total = CHAPTERS.length * LEVELS_PER_CHAPTER;
    return Array.from({ length: total }, (_, i) => {
        const number = i + 1;
        const games = gamesFor(ageGroup);
        const game = games[i % games.length];
        return {
            id: `t1_${String(number).padStart(2, '0')}`,
            number,
            chapter: Math.floor(i / LEVELS_PER_CHAPTER) + 1,
            game: game.id,
            page: game.page,
            rounds: roundsFor(number, ageGroup),
            milestone: number % MILESTONE_EVERY === 0,
        };
    });
}

export function levelUrl(level) {
    return `${level.page}?level=${encodeURIComponent(level.id)}`;
}
