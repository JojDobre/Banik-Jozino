/**
 * Hlasové pokyny: prednostne vopred nahratý neurónový hlas (public/hlas/*.mp3,
 * viď scripts/build-voice.mjs), inak systémová syntéza reči (tts.js).
 * Hlas sa vypína v nastaveniach zvlášť od zvukových efektov.
 */
import manifest from '../content/voice.generated.js';

export function createVoiceService({ tts, files = manifest } = {}) {
    let enabled = true;
    let current = null;

    // Hlas sa prehráva cez <audio>, nie cez Howler – vypnutie zvukových
    // efektov (Howler.mute) tak hlas nestlmí.
    function stop() {
        if (current) {
            const el = current;
            current = null;
            el.pause();
            el.onended = el.onerror = null;
            el._done?.(false); // prerušená veta – nech nikto nečaká donekonečna
        }
        tts?.stop();
    }

    function playFile(src) {
        if (typeof Audio === 'undefined') return Promise.resolve(false);
        return new Promise((resolve) => {
            const el = new Audio(src);
            current = el;
            const done = (ok) => {
                if (current === el) current = null;
                el._done = null;
                resolve(ok);
            };
            el._done = done;
            el.onended = () => done(true);
            el.onerror = () => done(false);
            el.play().catch(() => done(false));
        });
    }

    return {
        get enabled() {
            return enabled;
        },
        setEnabled(v) {
            enabled = Boolean(v);
            if (!enabled) stop();
        },
        /** Má text vopred nahratú verziu? */
        has(text) {
            return Boolean(files[String(text).trim()]);
        },
        /** Prečíta text; vráti Promise po dočítaní. */
        async say(text) {
            if (!enabled || !text) return false;
            stop();
            const src = files[String(text).trim()];
            if (src) {
                const ok = await playFile(src);
                if (ok) return true;
            }
            return tts ? tts.speak(text) : false;
        },
        stop,
    };
}
