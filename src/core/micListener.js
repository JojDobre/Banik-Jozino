/**
 * Mikrofón pre úroveň 2: živé rozpoznávanie zvukov (src/core/soundFeatures.js).
 *
 *   const mic = await listenSounds({ target: 'S', onUpdate(state) {…} });
 *   mic.stop();
 *
 * state = { phase: 'calib' | 'listen', label, confidence, scores, held, best,
 *           total, level (0–1 hlasitosť pre ukazovateľ), f (príznaky) }
 *
 * - Potlačenie šumu, ozveny a automatické zosilnenie sú vypnuté – inak by
 *   telefón syčanie a fúkanie „vyčistil“ ako šum.
 * - Prvých ~0,8 s meria ticho v miestnosti (kalibrácia prahu hlasitosti).
 * - V Android appke si najprv vypýta povolenie mikrofónu (rovnaké ako pre reč).
 */
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition as NativeSpeech } from '@capacitor-community/speech-recognition';
import { features, classify, calibrate, createTracker, DEFAULT_CALIB } from './soundFeatures.js';

/** Naučená hranica S/Š pre toto zariadenie (laboratórium zvukov) – localStorage. */
const PLACE_KEY = 'bj.soundPlace';
export function loadPlace() {
    try {
        return JSON.parse(localStorage.getItem(PLACE_KEY) || 'null');
    } catch {
        return null;
    }
}
export function savePlace(place) {
    try {
        if (place) localStorage.setItem(PLACE_KEY, JSON.stringify({ ...place, updated: new Date().toISOString() }));
        else localStorage.removeItem(PLACE_KEY);
    } catch { /* bez pamäte */ }
}

export class MicError extends Error {
    constructor(code, message) {
        super(message || code);
        this.code = code; // 'not-supported' | 'not-allowed' | 'audio-capture'
    }
}

async function ensurePermission() {
    if (!Capacitor.isNativePlatform()) return;
    try {
        const st = await NativeSpeech.checkPermissions();
        if (st.speechRecognition !== 'granted') {
            const r = await NativeSpeech.requestPermissions();
            if (r.speechRecognition !== 'granted') throw new MicError('not-allowed');
        }
    } catch (e) {
        if (e instanceof MicError) throw e;
        /* plugin nedostupný – skúsime priamo getUserMedia */
    }
}

/**
 * @param {object} o
 * @param {string|string[]} [o.target] – cieľový zvuk (meria sa výdrž)
 * @param {(state) => void} o.onUpdate
 * @param {object} [o.calib] – uložená kalibrácia (preskočí meranie ticha)
 * @param {number} [o.calibMs=800]
 */
export async function listenSounds({ target = null, onUpdate, calib = null, calibMs = 800, window: win = 5, gapMs = 220 } = {}) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new MicError('not-supported');
    await ensurePermission();
    let stream;
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 },
        });
    } catch (e1) {
        // niektoré zariadenia nepodporujú vypnutie filtrov – skúsiť bez nastavení
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
            const err = new MicError(e && e.name === 'NotAllowedError' ? 'not-allowed' : 'audio-capture', e && e.message);
            err.detail = `${(e && e.name) || ''} ${(e && e.message) || ''}`.trim();
            throw err;
        }
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    // ~43 ms rámec pri 48 kHz
    analyser.fftSize = ctx.sampleRate > 30000 ? 2048 : 1024;
    analyser.smoothingTimeConstant = 0;
    src.connect(analyser);
    const buf = new Float32Array(analyser.fftSize);

    const tracker = createTracker({ target, window: win, gapMs });
    const calibFrames = [];
    let cal = calib ? { ...calib, ...(loadPlace() || {}) } : null;
    const started = performance.now();
    let last = started;
    let stopped = false;

    const tick = () => {
        if (stopped) return;
        const now = performance.now();
        const dt = Math.min(200, now - last);
        last = now;
        analyser.getFloatTimeDomainData(buf);
        const f = features(buf, ctx.sampleRate);
        if (!cal) {
            calibFrames.push(f);
            if (now - started >= calibMs) cal = { ...calibrate(calibFrames), ...(loadPlace() || {}) };
            onUpdate && onUpdate({ phase: 'calib', label: 'ticho', confidence: 0, scores: {}, held: 0, best: 0, total: 0, level: 0, f });
            return;
        }
        const r = classify(f, cal);
        const t = tracker.push(r, dt);
        const level = Math.max(0, Math.min(1, (f.db - cal.minDb + 12) / 36));
        onUpdate && onUpdate({ phase: 'listen', label: t.label, raw: r.label, confidence: r.confidence, scores: r.scores, held: t.held, best: t.best, total: t.total, level, f, calib: cal });
    };
    const timer = setInterval(tick, 33);

    return {
        get calib() { return cal || DEFAULT_CALIB; },
        recalibrate() { cal = null; calibFrames.length = 0; },
        /** po naučení S/Š – hneď použiť novú hranicu */
        applyPlace(place) { if (cal) Object.assign(cal, place || { sBoundary: undefined, sWidth: undefined }); },
        resetHold() { tracker.reset(); },
        stop() {
            stopped = true;
            clearInterval(timer);
            try { src.disconnect(); } catch { /* ok */ }
            stream.getTracks().forEach((t) => t.stop());
            ctx.close().catch(() => {});
        },
    };
}

/** Text chyby pre dieťa/rodiča. */
export function micErrorText(e) {
    if (e && e.code === 'not-allowed') return 'Povoľ mikrofón, aby som ťa počul.';
    if (e && e.code === 'not-supported') return 'Toto zariadenie nevie počúvať mikrofónom.';
    return 'Mikrofón sa nepodarilo zapnúť.';
}
