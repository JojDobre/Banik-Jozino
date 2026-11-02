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
import { createProfileStore, ageGroupFromAge, AGE_GROUPS } from './core/profiles.js';
import * as rewards from './core/rewards.js';
import * as minigames from './core/minigames.js';
import * as levels from './core/levelGenerator.js';
import { WORDS, findWords, getWord } from './content/words.js';

const profiles = createProfileStore(window.localStorage);
profiles.ensureDefault();

const speech = createSpeechService();
const tts = createTTSService();
const audio = createAudioService();

let catalog = null;
const getCatalog = () => (catalog ??= rewards.buildCatalog(WORDS));

function applySettings() {
    const p = profiles.active();
    if (!p) return;
    audio.setMuted(!p.settings.sound);
    tts.setEnabled(p.settings.voiceInstructions);
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

window.addEventListener('bj:level-progress', (e) => {
    try {
        const given = rewardLevel(e.detail);
        if (given.length) console.log('🃏 Odmeny za level:', given);
    } catch (err) {
        console.error('Chyba pri udeľovaní kariet:', err);
    }
});

window.BJ = {
    version: '0.3.0',
    speech,
    SpeechError,
    matchesWord,
    normalizeTranscript,
    analyzeWord,
    tts,
    audio,
    profiles,
    ageGroupFromAge,
    AGE_GROUPS,
    applySettings,
    content: { WORDS, findWords, getWord },
    minigames,
    levels,
    rewards: {
        ...rewards,
        catalog: getCatalog,
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
