/**
 * Rozpoznávanie reči – jedna spoločná služba pre všetky hry.
 *
 * - V prehliadači: Web Speech API (rovnaké nastavenie ako pôvodne v Bani: sk-SK,
 *   jedno slovo, len finálny výsledok, jedna alternatíva).
 * - V Android appke (Capacitor): natívny plugin @capacitor-community/speech-recognition,
 *   lebo Android WebView Web Speech API nemá.
 *
 * Použitie:
 *   const { transcript } = await speech.listen();
 *   speech.on('start', () => …); speech.on('end', () => …);
 * Chyby majú `code` ako Web Speech API: no-speech, audio-capture, not-allowed,
 * network, aborted, service-not-allowed, not-supported, unknown.
 */
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition as NativeSpeech } from '@capacitor-community/speech-recognition';

export const LANGUAGE = 'sk-SK';

export class SpeechError extends Error {
    constructor(code, message) {
        super(message || code);
        this.name = 'SpeechError';
        this.code = code;
    }
}

function getWebRecognitionClass() {
    if (typeof window === 'undefined') return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/** Preklad chybovej hlášky natívneho pluginu na kód ako vo Web Speech API. */
export function mapNativeError(err) {
    const msg = String(err?.message ?? err ?? '').toLowerCase();
    if (msg.includes('permission')) return 'not-allowed';
    if (msg.includes('network')) return 'network';
    if (msg.includes('no match') || msg.includes('no speech') || msg.includes("didn't understand")) return 'no-speech';
    if (msg.includes('audio')) return 'audio-capture';
    if (msg.includes('busy')) return 'aborted';
    return 'unknown';
}

export function createSpeechService({ language = LANGUAGE } = {}) {
    const listeners = { start: new Set(), end: new Set() };
    const emit = (name) => listeners[name].forEach((fn) => {
        try { fn(); } catch (e) { console.error(e); }
    });

    const isNative = () => Capacitor.isNativePlatform();
    let listening = false;
    let current = null; // aktuálna Web inštancia

    function setListening(value) {
        if (listening === value) return;
        listening = value;
        emit(value ? 'start' : 'end');
    }

    function listenWeb() {
        const Recognition = getWebRecognitionClass();
        if (!Recognition) return Promise.reject(new SpeechError('not-supported'));

        return new Promise((resolve, reject) => {
            const rec = new Recognition();
            current = rec;
            rec.lang = language;
            rec.continuous = false;
            rec.interimResults = false;
            rec.maxAlternatives = 1;

            let settled = false;
            const finish = (fn, value) => {
                if (settled) return;
                settled = true;
                fn(value);
            };

            rec.onstart = () => setListening(true);
            rec.onresult = (event) => {
                const alternatives = Array.from(event.results[0] || []).map((a) => a.transcript);
                finish(resolve, { transcript: alternatives[0] ?? '', alternatives });
            };
            rec.onerror = (event) => finish(reject, new SpeechError(event.error || 'unknown'));
            rec.onend = () => {
                if (current === rec) current = null;
                setListening(false);
                finish(reject, new SpeechError('no-speech'));
            };

            try {
                rec.start();
            } catch (error) {
                current = null;
                finish(reject, new SpeechError('aborted', error.message));
            }
        });
    }

    async function listenNative() {
        const { available } = await NativeSpeech.available();
        if (!available) throw new SpeechError('not-supported');

        let perm = await NativeSpeech.checkPermissions();
        if (perm.speechRecognition !== 'granted') perm = await NativeSpeech.requestPermissions();
        if (perm.speechRecognition !== 'granted') throw new SpeechError('not-allowed');

        setListening(true);
        try {
            const { matches = [] } = await NativeSpeech.start({
                language,
                maxResults: 1,
                partialResults: false,
                popup: false,
            });
            if (!matches.length) throw new SpeechError('no-speech');
            return { transcript: matches[0], alternatives: matches };
        } catch (err) {
            if (err instanceof SpeechError) throw err;
            throw new SpeechError(mapNativeError(err), err?.message);
        } finally {
            setListening(false);
        }
    }

    return {
        language,
        /** Podporuje zariadenie rozpoznávanie reči? (na Androide sa definitívne overí pri listen) */
        isSupported() {
            return isNative() || Boolean(getWebRecognitionClass());
        },
        get isListening() {
            return listening;
        },
        on(name, fn) {
            listeners[name].add(fn);
            return () => listeners[name].delete(fn);
        },
        /** Vypočuje jedno slovo. Ak už počúva, odmietne s kódom 'busy'. */
        listen() {
            if (listening) return Promise.reject(new SpeechError('busy'));
            return isNative() ? listenNative() : listenWeb();
        },
        stop() {
            if (isNative()) {
                NativeSpeech.stop().catch(() => {});
            } else if (current) {
                current.abort();
            }
        },
    };
}
