/**
 * Postup v nových úrovniach (1 – Počúvam, 2 – Zvuky a hlásky).
 * Úroveň 3 (svety písmen) zatiaľ ukladá pôvodný ProgressManager.
 *
 * Ukladá sa zvlášť pre každý profil: localStorage['bj.tiers.<profileId>'] =
 *   { levels: { 't1_01': { stars: 2, plays: 3, lastPlayed: '…' } } }
 */

export const STORAGE_PREFIX = 'bj.tiers.';

export function createTierProgress(storage, profileId) {
    const key = STORAGE_PREFIX + profileId;
    let data = load();

    function load() {
        try {
            const parsed = JSON.parse(storage.getItem(key) || 'null');
            if (parsed && parsed.levels) return parsed;
        } catch {
            /* poškodené dáta – začneme odznova */
        }
        return { levels: {} };
    }

    function save() {
        storage.setItem(key, JSON.stringify(data));
    }

    return {
        /** Počet hviezd levelu (0, ak ešte nehraný). */
        stars(levelId) {
            return data.levels[levelId]?.stars || 0;
        },
        /**
         * Zapíše výsledok hry. Hviezdy sa ukladajú najlepšie dosiahnuté.
         * @returns {{ stars, previousStars, firstCompletion }} – pre udelenie kariet
         */
        record(levelId, stars) {
            const prev = data.levels[levelId] || { stars: 0, plays: 0 };
            const best = Math.max(prev.stars, stars);
            data.levels[levelId] = { stars: best, plays: prev.plays + 1, lastPlayed: new Date().toISOString() };
            save();
            return { stars: best, previousStars: prev.stars, firstCompletion: prev.stars === 0 && stars >= 1 };
        },
        /** Level je odomknutý, ak je prvý, alebo ak má predchádzajúci aspoň 1 hviezdu. */
        isUnlocked(path, index) {
            if (index <= 0) return true;
            return this.stars(path[index - 1].id) >= 1;
        },
        /** Súčet hviezd v ceste. */
        totalStars(path) {
            return path.reduce((sum, l) => sum + this.stars(l.id), 0);
        },
        /** Index prvého nedohraného (alebo posledného odomknutého) levelu. */
        currentIndex(path) {
            const i = path.findIndex((l) => this.stars(l.id) === 0);
            return i === -1 ? path.length - 1 : i;
        },
    };
}
