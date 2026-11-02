import { test } from 'node:test';
import assert from 'node:assert/strict';

// Simulácia Web Speech API v prehliadači
let behavior = { type: 'result', text: 'ryba' };
const instances = [];
class FakeRecognition {
    constructor() { instances.push(this); }
    start() {
        setTimeout(() => {
            this.onstart?.();
            if (behavior.type === 'result') {
                this.onresult?.({ results: [[{ transcript: behavior.text }]] });
            } else if (behavior.type === 'error') {
                this.onerror?.({ error: behavior.code });
            } else if (behavior.type === 'hold') {
                return; // počúva, kým ho niekto nezastaví (abort)
            }
            this.onend?.();
        }, 5);
    }
    abort() { this.onerror?.({ error: 'aborted' }); this.onend?.(); }
}
globalThis.window = { SpeechRecognition: FakeRecognition };

const { createSpeechService, mapNativeError } = await import('../src/core/speech.js');

test('nastavenie ako v Bani: sk-SK, jedno slovo, jedna alternatíva', async () => {
    const speech = createSpeechService();
    behavior = { type: 'result', text: 'ryba' };
    const res = await speech.listen();
    assert.equal(res.transcript, 'ryba');
    const rec = instances.at(-1);
    assert.equal(rec.lang, 'sk-SK');
    assert.equal(rec.continuous, false);
    assert.equal(rec.interimResults, false);
    assert.equal(rec.maxAlternatives, 1);
});

test('udalosti start/end a stav isListening', async () => {
    const speech = createSpeechService();
    const events = [];
    speech.on('start', () => events.push(['start', speech.isListening]));
    speech.on('end', () => events.push(['end', speech.isListening]));
    behavior = { type: 'result', text: 'rak' };
    await speech.listen();
    await new Promise((r) => setTimeout(r, 1));
    assert.deepEqual(events, [['start', true], ['end', false]]);
});

test('chyba má kód ako Web Speech API', async () => {
    const speech = createSpeechService();
    behavior = { type: 'error', code: 'no-speech' };
    await assert.rejects(speech.listen(), (e) => e.code === 'no-speech');
    behavior = { type: 'error', code: 'not-allowed' };
    await assert.rejects(speech.listen(), (e) => e.code === 'not-allowed');
});

test('koniec bez výsledku = no-speech', async () => {
    const speech = createSpeechService();
    behavior = { type: 'silent' };
    await assert.rejects(speech.listen(), (e) => e.code === 'no-speech');
});

test('druhé spustenie počas počúvania sa odmietne (busy), stop() ho ukončí', async () => {
    const speech = createSpeechService();
    behavior = { type: 'hold' };
    const first = speech.listen();
    await new Promise((r) => setTimeout(r, 10));
    assert.equal(speech.isListening, true);
    await assert.rejects(speech.listen(), (e) => e.code === 'busy');
    speech.stop();
    await assert.rejects(first, (e) => e.code === 'aborted');
    assert.equal(speech.isListening, false);
});

test('preklad chýb natívneho pluginu', () => {
    assert.equal(mapNativeError(new Error('Missing permission')), 'not-allowed');
    assert.equal(mapNativeError(new Error('No match')), 'no-speech');
    assert.equal(mapNativeError(new Error('Network timeout')), 'network');
    assert.equal(mapNativeError('Something odd'), 'unknown');
});
