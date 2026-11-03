#!/usr/bin/env node
/**
 * Vygeneruje nahrávky viet zo src/content/voiceLines.js slovenským neurónovým
 * hlasom Piper (sk_SK-lili-medium) → public/hlas/<id>.mp3
 * a zoznam src/content/voice.generated.js (text → súbor).
 *
 * Požiadavky (len pri generovaní, hra ich nepotrebuje):
 *   pip install piper-tts      (príkaz `piper` v PATH, alebo PIPER=/cesta/k/piper)
 *   ffmpeg
 * Hlasový model sa stiahne automaticky do .cache/piper/.
 *
 * Použitie: npm run build:voice            (len chýbajúce)
 *           npm run build:voice -- --all   (všetko odznova)
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { LINES } from '../src/content/voiceLines.js';
import { lineId } from './lib/line-id.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'public', 'hlas');
const CACHE = path.join(ROOT, '.cache', 'piper');
const VOICE = 'sk_SK-lili-medium';
const VOICE_URL = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/sk/sk_SK/lili/medium/';
const PIPER = process.env.PIPER || 'piper';
const ALL = process.argv.includes('--all');

// Tempo (vyššie = pomalšie) – pre deti trochu pomalšie ako normálna reč.
const LENGTH_SCALE = '1.12';

export { lineId };

async function ensureModel() {
    mkdirSync(CACHE, { recursive: true });
    for (const ext of ['.onnx', '.onnx.json']) {
        const file = path.join(CACHE, VOICE + ext);
        if (existsSync(file)) continue;
        console.log(`Sťahujem hlas ${VOICE}${ext}…`);
        const res = await fetch(VOICE_URL + VOICE + ext);
        if (!res.ok) throw new Error(`Hlas sa nepodarilo stiahnuť: ${res.status}`);
        writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    }
    return path.join(CACHE, VOICE + '.onnx');
}

function run(cmd, args, input) {
    const r = spawnSync(cmd, args, { input, encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`${cmd} zlyhal: ${r.stderr || r.error}`);
}

const model = await ensureModel();
mkdirSync(OUT, { recursive: true });

const unique = [...new Set(LINES.map((l) => l.trim()).filter(Boolean))];
const manifest = {};
let made = 0;
for (const text of unique) {
    const id = lineId(text);
    const mp3 = path.join(OUT, `${id}.mp3`);
    manifest[text] = `hlas/${id}.mp3`;
    if (!ALL && existsSync(mp3)) continue;
    const wav = path.join(CACHE, `${id}.wav`);
    run(PIPER, ['-m', model, '-f', wav, '--length-scale', LENGTH_SCALE, '--sentence-silence', '0.15'], text);
    // mono MP3, mierne zosilnené a orezané ticho na začiatku
    run('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav,
        '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,loudnorm=I=-16:TP=-1.5',
        '-ac', '1', '-ar', '22050', '-b:a', '48k', mp3]);
    rmSync(wav, { force: true });
    made++;
}

writeFileSync(
    path.join(ROOT, 'src', 'content', 'voice.generated.js'),
    `// VYGENEROVANÉ skriptom scripts/build-voice.mjs – neupravovať ručne.\n// Hlas: Piper ${VOICE}.\nexport default ${JSON.stringify(manifest, null, 1)};\n`,
);
console.log(`Viet: ${unique.length}, nových nahrávok: ${made} → public/hlas/`);
