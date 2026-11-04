#!/usr/bin/env node
/**
 * Vygeneruje nahrávky viet zo src/content/voiceLines.js slovenským neurónovým
 * hlasom → public/hlas/<id>.mp3 a zoznam src/content/voice.generated.js (text → súbor).
 *
 * Hlas: Microsoft sk-SK-ViktoriaNeural (predvolený, TTS=edge) cez balík edge-tts
 *   (TTS_PY=/cesta/k/pythonu s edge-tts), alebo Piper sk_SK-lili-medium (TTS=piper,
 *   PIPER=/cesta/k/piper; model sa stiahne do .cache/piper/).
 * Pred zverejnením appky: rovnaký hlas cez Azure Speech (licencia, docs/PLAN.md).
 * Potrebné aj ffmpeg.
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
const ENGINE = process.env.TTS || 'edge';
const EDGE_VOICE = 'sk-SK-ViktoriaNeural';
const EDGE_RATE = '-8%';

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

const model = ENGINE === 'piper' ? await ensureModel() : null;
mkdirSync(OUT, { recursive: true });
mkdirSync(CACHE, { recursive: true });
const AF = 'silenceremove=start_periods=1:start_threshold=-45dB,loudnorm=I=-16:TP=-1.5';

const unique = [...new Set(LINES.map((l) => l.trim()).filter(Boolean))];
const manifest = {};
let made = 0;
const todo = [];
for (const text of unique) {
    const id = lineId(text);
    manifest[text] = `hlas/${id}.mp3`;
    if (ALL || !existsSync(path.join(OUT, `${id}.mp3`))) todo.push([id, text]);
}
if (ENGINE === 'piper') {
    for (const [id, text] of todo) {
        const wav = path.join(CACHE, `${id}.wav`);
        run(PIPER, ['-m', model, '-f', wav, '--length-scale', LENGTH_SCALE, '--sentence-silence', '0.15'], text);
        run('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-af', AF, '-ac', '1', '-ar', '22050', '-b:a', '48k', path.join(OUT, `${id}.mp3`)]);
        rmSync(wav, { force: true });
        made++;
    }
} else if (todo.length) {
    const tmp = path.join(CACHE, 'edge-vety');
    mkdirSync(tmp, { recursive: true });
    const py = process.env.TTS_PY || 'python3';
    const r = spawnSync(py, [path.join(ROOT, 'scripts', 'lib', 'edge_batch.py'), tmp, EDGE_VOICE, EDGE_RATE], { input: JSON.stringify(todo), encoding: 'utf8', stdio: ['pipe', 'inherit', 'inherit'] });
    if (r.status !== 0) throw new Error('edge_batch.py zlyhal');
    for (const [id] of todo) {
        const raw = path.join(tmp, `${id}.mp3`);
        run('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', AF, '-ac', '1', '-ar', '24000', '-b:a', '48k', path.join(OUT, `${id}.mp3`)]);
        rmSync(raw, { force: true });
        made++;
    }
}

writeFileSync(
    path.join(ROOT, 'src', 'content', 'voice.generated.js'),
    `// VYGENEROVANÉ skriptom scripts/build-voice.mjs – neupravovať ručne.\n// Hlas: ${ENGINE === 'piper' ? `Piper ${VOICE}` : `Microsoft ${EDGE_VOICE}`}.\nexport default ${JSON.stringify(manifest, null, 1)};\n`,
);
console.log(`Viet: ${unique.length}, nových nahrávok: ${made} → public/hlas/`);
