/**
 * Most medzi novými modulmi a pôvodnými hrami (klasické skripty v public/js).
 *
 * Sprístupní služby ako `window.BJ`. Modul sa spustí pred udalosťou
 * DOMContentLoaded, takže hry ho môžu používať od svojej inicializácie.
 *
 * Pri dohraní levelu ProgressManager vyšle udalosť `bj:level-progress`;
 * tu sa podľa nej udelia karty a uložia do profilu.
 */
import { createSpeechService, SpeechError } from './core/speech.js';
import { matchesWord, normalizeTranscript, analyzeWord } from './core/slovak.js';
import { createTTSService } from './core/tts.js';
import { createAudioService } from './core/audio.js';
import { createVoiceService } from './core/voice.js';
import { createProfileStore, ageGroupFromAge, AGE_GROUPS } from './core/profiles.js';
import * as rewards from './core/rewards.js';
import * as minigames from './core/minigames.js';
import * as levels from './core/levelGenerator.js';
import { WORDS, findWords, getWord } from './content/words.js';
import { CARDS, SETS } from './content/cards/index.js';
import { installRewardPopup } from './ui/cards.js';
import { openSettings } from './ui/settings.js';
import { createTierProgress } from './core/tierProgress.js';

const profiles = createProfileStore(window.localStorage);
profiles.ensureDefault();

const speech = createSpeechService();
const tts = createTTSService();
const audio = createAudioService();
const voice = createVoiceService({ tts });

let catalog = null;
const getCatalog = () => (catalog ??= rewards.buildCatalog(CARDS));

/**
 * Prevod starej zbierky: karty, ktoré už v katalógu nie sú (pôvodné karty so
 * slovami), sa premenia na iskričky – nič sa nestratí.
 */
function migrateCollection() {
    const p = profiles.active();
    const col = p?.collection;
    if (!col?.cards) return;
    const ids = new Set(getCatalog().map((c) => c.id));
    let sparkles = 0;
    const cards = {};
    for (const [id, n] of Object.entries(col.cards)) {
        if (ids.has(id)) cards[id] = n;
        else sparkles += n;
    }
    if (sparkles) profiles.setCollection(p.id, { ...col, cards, sparkles: (col.sparkles || 0) + sparkles });
}
migrateCollection();

function applySettings() {
    const p = profiles.active();
    if (!p) return;
    const sound = p.settings.sound !== false;
    const speak = p.settings.voiceInstructions !== false;
    audio.setMuted(!sound);
    // pôvodné hry (Baňa, Pexeso…) prehrávajú cez Howler – vypne sa aj ich zvuk
    if (window.Howler) window.Howler.mute(!sound);
    tts.setEnabled(speak);
    voice.setEnabled(speak);
}
applySettings();

/**
 * Udelenie odmeny za level. Volá sa z udalosti, ale dá sa zavolať aj priamo.
 * @returns {Array} zoznam odmien (karty, balíčky)
 */
function rewardLevel(result) {
    const p = profiles.active();
    if (!p) return [];
    const { collection, rewards: given } = rewards.grantLevelReward(getCatalog(), p.collection, result);
    if (given.length) {
        profiles.setCollection(p.id, collection);
        window.dispatchEvent(new CustomEvent('bj:rewards', { detail: { profileId: p.id, rewards: given } }));
    }
    return given;
}

// Okno s odmenou (karta, balíček) – na každej stránke vrátane pôvodných hier.
installRewardPopup();

window.addEventListener('bj:level-progress', (e) => {
    try {
        const given = rewardLevel(e.detail);
        if (given.length) console.log('🃏 Odmeny za level:', given);
    } catch (err) {
        console.error('Chyba pri udeľovaní kariet:', err);
    }
});

window.BJ = {
    version: '0.4.0',
    speech,
    SpeechError,
    matchesWord,
    normalizeTranscript,
    analyzeWord,
    tts,
    audio,
    voice,
    /** Prečíta pokyn (nahratý hlas, inak syntéza). */
    say: (text) => voice.say(text),
    /** Zmena nastavení aktívneho profilu ({ sound, voiceInstructions }). */
    setSettings(patch) {
        const p = profiles.active();
        if (!p) return;
        profiles.update(p.id, { settings: patch });
        applySettings();
    },
    openSettings,
    settings: () => ({ sound: true, voiceInstructions: true, ...(profiles.active()?.settings || {}) }),
    profiles,
    ageGroupFromAge,
    AGE_GROUPS,
    applySettings,
    content: { WORDS, findWords, getWord },
    /** Postup v úrovniach 1 a 2 pre aktívny profil. */
    tierProgress: () => createTierProgress(window.localStorage, profiles.active().id),
    minigames,
    levels,
    rewards: {
        ...rewards,
        catalog: getCatalog,
        sets: SETS,
        rewardLevel,
        collection: () => profiles.active()?.collection,
        openPack(packId) {
            const p = profiles.active();
            const r = rewards.openPack(getCatalog(), p.collection, packId);
            profiles.setCollection(p.id, r.collection);
            return r.rewards;
        },
        exchange(cardId) {
            const p = profiles.active();
            const r = rewards.exchangeForCard(getCatalog(), p.collection, cardId);
            profiles.setCollection(p.id, r.collection);
            return r;
        },
    },
};
