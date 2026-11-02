/**
 * Profily detí (meno, vek, nastavenia, zbierka kariet).
 *
 * Postup v leveloch (hviezdy) zatiaľ ukladá pôvodný ProgressManager
 * (public/js/managers/progressManager.js). Každý profil má vlastný kľúč
 * `progressKey`, pod ktorým ProgressManager ukladá – takže každé dieťa
 * má svoj postup. Prvý profil používa pôvodný kľúč, aby sa nestratil
 * doterajší postup.
 */

export const STORAGE_KEY = 'bj.profiles';
export const LEGACY_PROGRESS_KEY = 'speechTherapyProgress';
export const AGE_GROUPS = ['3-4', '5-6', '7-8'];

/** Veková skupina z veku v rokoch. */
export function ageGroupFromAge(age) {
    if (age === null || age === undefined || age === '') return null;
    const a = Number(age);
    if (!Number.isFinite(a)) return null;
    if (a <= 4) return '3-4';
    if (a <= 6) return '5-6';
    return '7-8';
}

export function emptyCollection() {
    return { cards: {}, sparkles: 0, packs: [] };
}

function defaultSettings() {
    return { sound: true, music: true, voiceInstructions: true };
}

function newId() {
    return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function emptyData() {
    return { version: 2, activeId: null, profiles: {} };
}

/**
 * @param {Storage} storage – localStorage alebo náhrada s getItem/setItem (testy)
 */
export function createProfileStore(storage = globalThis.localStorage) {
    let data = load();

    function load() {
        try {
            const raw = storage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.version === 2 && parsed.profiles) return parsed;
            }
        } catch (e) {
            console.warn('Profily sa nepodarilo načítať:', e);
        }
        return emptyData();
    }

    function save() {
        storage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function create({ name = 'Hráč', age = null, progressKey } = {}) {
        const id = newId();
        const isFirst = Object.keys(data.profiles).length === 0;
        data.profiles[id] = {
            id,
            name,
            age: age === null ? null : Number(age),
            ageGroup: ageGroupFromAge(age),
            createdAt: new Date().toISOString(),
            // Prvý profil preberá pôvodný postup.
            progressKey: progressKey || (isFirst ? LEGACY_PROGRESS_KEY : `${LEGACY_PROGRESS_KEY}:${id}`),
            settings: defaultSettings(),
            collection: emptyCollection(),
        };
        if (!data.activeId) data.activeId = id;
        save();
        return data.profiles[id];
    }

    return {
        /** Zabezpečí, že existuje aspoň jeden profil (pri prvom spustení). */
        ensureDefault() {
            if (!data.activeId || !data.profiles[data.activeId]) {
                const first = Object.values(data.profiles)[0];
                if (first) {
                    data.activeId = first.id;
                    save();
                } else {
                    create();
                }
            }
            return this.active();
        },
        list() {
            return Object.values(data.profiles);
        },
        get(id) {
            return data.profiles[id] || null;
        },
        active() {
            return data.profiles[data.activeId] || null;
        },
        create,
        setActive(id) {
            if (!data.profiles[id]) throw new Error(`Profil ${id} neexistuje`);
            data.activeId = id;
            save();
        },
        /** Zmena mena / veku / nastavení. */
        update(id, patch) {
            const p = data.profiles[id];
            if (!p) throw new Error(`Profil ${id} neexistuje`);
            if (patch.name !== undefined) p.name = patch.name;
            if (patch.age !== undefined) {
                p.age = patch.age === null ? null : Number(patch.age);
                p.ageGroup = ageGroupFromAge(patch.age);
            }
            if (patch.settings) p.settings = { ...p.settings, ...patch.settings };
            save();
            return p;
        },
        /** Uloží zbierku kariet profilu (stav z rewards.js). */
        setCollection(id, collection) {
            const p = data.profiles[id];
            if (!p) throw new Error(`Profil ${id} neexistuje`);
            p.collection = collection;
            save();
        },
        remove(id) {
            const p = data.profiles[id];
            if (!p) return;
            delete data.profiles[id];
            if (p.progressKey !== LEGACY_PROGRESS_KEY) storage.removeItem?.(p.progressKey);
            if (data.activeId === id) data.activeId = Object.keys(data.profiles)[0] || null;
            save();
        },
    };
}
