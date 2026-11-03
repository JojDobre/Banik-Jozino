/**
 * Levely svetov písmen (úroveň 3) zo slovníka – podklad pre public/config/levels.js
 * (generuje `npm run build:levels`, súbor sa ručne neupravuje).
 *
 * Svet má 16 levelov rozdelených do etáp (hláska na začiatku → na konci →
 * v strede → zhluky). Etapa, pre ktorú slovník nemá dosť slov (napr. Z a G
 * na konci – v slovenčine sa vyslovujú ako S a K), sa vynechá a levely sa
 * rozdelia medzi ostatné. Slová v etape sa rozdeľujú postupne, aby sa
 * susedné levely čo najmenej opakovali. Rovnaký vstup = rovnaký výstup.
 *
 * Hry sa striedajú v cykle 8 levelov (GAME_CYCLE): 10× Baňa, 4× Pexeso, 2× Super Jožino
 * na svet. Super Jožino má zatiaľ len 3 mapy, preto je ho menej.
 */
import { findWords, WORDS } from '../content/words.js';
import { STAGES, seededRandom, shuffle } from './levelGenerator.js';

export const LEVELS_PER_WORLD = 16;
export const GAME_CYCLE = ['banik', 'pexeso', 'banik', 'mario', 'banik', 'banik', 'pexeso', 'banik'];
export const SJ_MAPS = 3; // počet máp Super Jožina (js/superjozino/sj-levels.js)
const MIN_STAGE_WORDS = 3;

/** Hláska sveta podľa id (world_ch → Č …). */
export const WORLD_PHONEME = {
    world_r: 'R', world_l: 'L', world_c: 'C', world_z: 'Z', world_s: 'S',
    world_ch: 'Č', world_zh: 'Ž', world_sh: 'Š', world_k: 'K', world_g: 'G',
    world_d: 'D', world_t: 'T', world_n: 'N', world_dh: 'Ď', world_th: 'Ť', world_nh: 'Ň',
};

/** Krátka predpona id levelu (r_001, ch_001 …) – zhodná s pôvodnými levelmi. */
export const WORLD_PREFIX = {
    world_r: 'r', world_l: 'l', world_c: 'c', world_z: 'z', world_s: 's',
    world_ch: 'ch', world_zh: 'zh', world_sh: 'sh', world_k: 'k', world_g: 'g',
    world_d: 'd', world_t: 't', world_n: 'n', world_dh: 'dh', world_th: 'th', world_nh: 'nh',
};

const STAGE_TITLE = ['na začiatku', 'na konci', 'v strede', 'v zhlukoch'];
const STAGE_FULL = ['na začiatku slova', 'na konci slova', 'v strede slova', 'v zhlukoch hlások (tr, dr, kr…)'];
const GAME_TITLE = { banik: 'Baňa', pexeso: 'Pexeso', mario: 'Super Jožino' };

/** Etapy, pre ktoré má slovník dosť slov, a ich slová. */
export function stagesFor(phoneme, words = WORDS) {
    return STAGES.map((s, i) => ({ ...s, index: i, pool: findWords({ ...s.query, phoneme }, words) }))
        .filter((s) => s.pool.length >= MIN_STAGE_WORDS);
}

/** Rozdelenie n levelov medzi k etáp (zvyšok dostanú prvé etapy). */
export function splitLevels(n, k) {
    const base = Math.floor(n / k);
    return Array.from({ length: k }, (_, i) => base + (i < n % k ? 1 : 0));
}

/** Počty predmetov a slov podľa poradia levelu (1–16) – obťažnosť stúpa pomaly. */
export function amountsFor(levelNumber) {
    const n = levelNumber - 1;
    return {
        words: 4 + Math.floor(n / 6), // 4–6
        diamonds: Math.min(4, 1 + Math.floor(n / 4)), // rečové cvičenia 1–4
        golds: 3 + Math.floor(n / 4), // 3–6
        crystals: 1 + Math.floor(n / 8), // posluchové cvičenia 1–2
        pairs: levelNumber <= 8 ? 6 : 8, // pexeso 12 / 16 kariet
    };
}

/**
 * Levely jedného sveta.
 * @param {string} worldId
 * @param {object} [o] – { words: slovník (testy), levels: počet }
 */
export function buildWorldLevels(worldId, { words = WORDS, levels = LEVELS_PER_WORLD } = {}) {
    const phoneme = WORLD_PHONEME[worldId];
    const prefix = WORLD_PREFIX[worldId];
    if (!phoneme) throw new Error('Neznámy svet ' + worldId);
    const stages = stagesFor(phoneme, words);
    const fallback = findWords({ phoneme }, words);
    const counts = splitLevels(levels, stages.length || 1);
    const out = [];
    let levelNumber = 0;
    let sjCounter = 0;

    (stages.length ? stages : [{ index: 0, pool: fallback }]).forEach((stage, si) => {
        const rng = seededRandom(`${worldId}:${stage.index}`);
        const pool = shuffle(stage.pool, rng).map((w) => w.word);
        const others = fallback.map((w) => w.word).filter((w) => !pool.includes(w));
        let cursor = 0;
        for (let k = 0; k < counts[si]; k++) {
            levelNumber++;
            const amt = amountsFor(levelNumber);
            // slová etapy postupne (cyklicky); pri malej etape len časť a zvyšok
            // opakovanie iných slov s hláskou (pre každý level iné)
            const take = Math.min(amt.words, Math.max(2, Math.floor(pool.length / 2)));
            const chosen = [];
            for (let i = 0; i < pool.length && chosen.length < take; i++) {
                const w = pool[(cursor + i) % pool.length];
                if (!chosen.includes(w)) chosen.push(w);
            }
            cursor += take;
            const review = shuffle(others.length ? others : pool, seededRandom(`${worldId}:${levelNumber}:r`));
            for (const w of review) {
                if (chosen.length >= amt.words) break;
                if (!chosen.includes(w)) chosen.push(w);
            }
            const gameType = GAME_CYCLE[(levelNumber - 1) % GAME_CYCLE.length];
            const id = `${prefix}_${String(levelNumber).padStart(3, '0')}`;
            const prevId = levelNumber > 1 ? `${prefix}_${String(levelNumber - 1).padStart(3, '0')}` : null;
            const gameConfig = {
                diamonds: Math.min(amt.diamonds, chosen.length),
                golds: amt.golds,
                crystals: amt.crystals,
                speechExercises: Math.min(amt.diamonds, chosen.length),
                listeningExercises: amt.crystals,
            };
            if (gameType === 'pexeso') gameConfig.pairs = amt.pairs;
            if (gameType === 'mario') gameConfig.sjLevel = (sjCounter++ % SJ_MAPS) + 1;
            out.push({
                id,
                worldId,
                levelNumber,
                name: `${phoneme} ${STAGE_TITLE[stage.index]} · ${GAME_TITLE[gameType]}`,
                stage: STAGE_FULL[stage.index],
                gameType,
                difficulty: Math.min(5, 1 + Math.floor((levelNumber - 1) / 4)),
                words: chosen,
                gameConfig,
                unlockRequirement: prevId ? { levelId: prevId, minStars: 1 } : null,
                timeLimit: null,
                minStarsToPass: 1,
                isUnlocked: levelNumber === 1,
            });
        }
    });
    return out;
}

/** Všetky svety. */
export function buildAllLevels(worldIds = Object.keys(WORLD_PHONEME), opts) {
    return Object.fromEntries(worldIds.map((id) => [id, buildWorldLevels(id, opts)]));
}
