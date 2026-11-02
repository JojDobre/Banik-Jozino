/**
 * Slovník slov – jeden zdroj pravdy pre všetky hry.
 * Položka: { word, image, audio, syllables, minAge, worlds, phonemes: { R: { positions, cluster } } }
 */
import generated from './words.generated.js';
import overrides from './word-overrides.js';

function merge(entry) {
    const o = overrides[entry.word];
    if (!o) return entry;
    return { ...entry, ...o, phonemes: { ...entry.phonemes, ...(o.phonemes || {}) } };
}

export const WORDS = generated.map(merge).filter((w) => !w.exclude);

const byWord = new Map(WORDS.map((w) => [w.word, w]));

export function getWord(word) {
    return byWord.get(String(word).toLowerCase()) || null;
}

/**
 * Vyhľadanie slov podľa kritérií.
 * @param {object} q
 * @param {string} [q.phoneme]       – napr. 'R'
 * @param {string[]} [q.positions]   – 'initial' | 'medial' | 'final' (stačí jedna zhoda)
 * @param {boolean} [q.cluster]      – true = len zhluky, false = bez zhlukov, undefined = jedno
 * @param {number} [q.maxSyllables]
 * @param {number} [q.age]           – vek dieťaťa; slová s vyšším minAge sa vynechajú
 * @param {boolean} [q.requireImage=true]
 * @param {boolean} [q.requireAudio=false]
 */
export function findWords(q = {}, words = WORDS) {
    const { phoneme, positions, cluster, maxSyllables, age, requireImage = true, requireAudio = false } = q;
    return words.filter((w) => {
        if (requireImage && !w.image) return false;
        if (requireAudio && !w.audio) return false;
        if (maxSyllables && w.syllables > maxSyllables) return false;
        if (age && w.minAge > age) return false;
        if (phoneme) {
            const p = w.phonemes[phoneme.toUpperCase()];
            if (!p) return false;
            if (positions && !positions.some((pos) => p.positions.includes(pos))) return false;
            if (cluster !== undefined && p.cluster !== cluster) return false;
        }
        return true;
    });
}
