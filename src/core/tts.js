/**
 * Nahovorené pokyny (syntéza reči).
 *
 * - Android appka: @capacitor-community/text-to-speech (systémový hlas, slovenčina
 *   je na väčšine telefónov dostupná).
 * - Prehliadač: speechSynthesis; ak slovenský hlas nie je, služba mlčí
 *   (hra musí fungovať aj bez hlasu – text je vždy aj na obrazovke).
 *
 * Pozn.: na VZOROVÉ slová, ktoré má dieťa napodobniť, TTS nepoužívame –
 * tie budú vopred nahraté súbory (viď docs/PLAN.md).
 */
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

export const LANGUAGE = 'sk-SK';

function pickWebVoice(voices, language) {
    const lang = language.toLowerCase();
    const prefix = lang.split('-')[0];
    return (
        voices.find((v) => v.lang?.toLowerCase() === lang) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith(prefix)) ||
        null
    );
}

function loadWebVoices(timeoutMs = 1500) {
    const synth = window.speechSynthesis;
    const now = synth.getVoices();
    if (now.length) return Promise.resolve(now);
    return new Promise((resolve) => {
        const done = () => resolve(synth.getVoices());
        synth.addEventListener('voiceschanged', done, { once: true });
        setTimeout(done, timeoutMs);
    });
}

export function createTTSService({ language = LANGUAGE, rate = 0.9 } = {}) {
    let enabled = true;
    let webVoice; // undefined = ešte nezistené, null = nie je

    async function getWebVoice() {
        if (webVoice !== undefined) return webVoice;
        if (typeof window === 'undefined' || !window.speechSynthesis) return (webVoice = null);
        webVoice = pickWebVoice(await loadWebVoices(), language);
        return webVoice;
    }

    return {
        setEnabled(value) {
            enabled = Boolean(value);
            if (!enabled) this.stop();
        },
        get enabled() {
            return enabled;
        },
        /** Je k dispozícii slovenský hlas? */
        async isAvailable() {
            if (Capacitor.isNativePlatform()) {
                try {
                    const { languages } = await TextToSpeech.getSupportedLanguages();
                    return languages.some((l) => l.toLowerCase().startsWith(language.slice(0, 2)));
                } catch {
                    return false;
                }
            }
            return Boolean(await getWebVoice());
        },
        /** Prečíta text. Vráti sa, keď dočíta (alebo hneď, ak hlas nie je). */
        async speak(text, { rate: r = rate } = {}) {
            if (!enabled || !text) return false;
            if (Capacitor.isNativePlatform()) {
                try {
                    await TextToSpeech.speak({ text, lang: language, rate: r, pitch: 1.0, volume: 1.0 });
                    return true;
                } catch (e) {
                    console.warn('TTS:', e);
                    return false;
                }
            }
            const voice = await getWebVoice();
            if (!voice) return false;
            const synth = window.speechSynthesis;
            synth.cancel();
            return new Promise((resolve) => {
                const u = new SpeechSynthesisUtterance(text);
                u.voice = voice;
                u.lang = voice.lang;
                u.rate = r;
                u.onend = () => resolve(true);
                u.onerror = () => resolve(false);
                synth.speak(u);
            });
        },
        stop() {
            if (Capacitor.isNativePlatform()) {
                TextToSpeech.stop().catch(() => {});
            } else if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        },
    };
}
