import { readFileSync } from 'node:fs';

/** Jednoduché načítanie PCM16 WAV (mono) → { sampleRate, samples: Float32Array } */
export function readWav(file) {
    const b = readFileSync(file);
    let p = 12;
    let sampleRate = 0;
    let channels = 1;
    let data = null;
    while (p < b.length) {
        const id = b.toString('ascii', p, p + 4);
        const size = b.readUInt32LE(p + 4);
        if (id === 'fmt ') {
            channels = b.readUInt16LE(p + 10);
            sampleRate = b.readUInt32LE(p + 12);
        } else if (id === 'data') {
            data = b.subarray(p + 8, p + 8 + size);
        }
        p += 8 + size + (size % 2);
    }
    const n = Math.floor(data.length / 2 / channels);
    const samples = new Float32Array(n);
    for (let i = 0; i < n; i++) samples[i] = data.readInt16LE(i * 2 * channels) / 32768;
    return { sampleRate, samples };
}

/** Rámce dĺžky n s posunom hop. */
export function* frames(samples, n = 1024, hop = 512) {
    for (let i = 0; i + n <= samples.length; i += hop) yield samples.subarray(i, i + n);
}
