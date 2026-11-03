#!/usr/bin/env node
/**
 * Nahrávky slov zo slovníka (src/content/words.js) slovenským neurónovým hlasom
 * Piper (sk_SK-lili-medium) → public/hlas/slova/<id>.mp3
 * a zoznam src/content/wordAudio.generated.js (slovo → súbor).
 *
 * Slová s vlastnou (ľudskou) nahrávkou v public/zvuky/ ju majú prednostne –
 * nahrávka z Piperu sa použije len tam, kde iná nie je (viď src/content/words.js).
 *
 * Požiadavky: python s balíkom piper-tts (PIPER_PY=/cesta/k/pythonu), ffmpeg,
 * hlasový model v .cache/piper/ (stiahne ho `npm run build:voice`).
 *
 * Použitie: npm run build:word-audio           (len chýbajúce)
 *           npm run build:word-audio -- --all  (všetko odznova)
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import generated from '../src/content/words.generated.js';
import { lineId } from './lib/line-id.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'public', 'hlas', 'slova');
const CACHE = path.join(ROOT, '.cache', 'piper');
const MODEL = path.join(CACHE, 'sk_SK-lili-medium.onnx');
const ALL = process.argv.includes('--all');

function run(cmd, args, input) {
    const r = spawnSync(cmd, args, { input, encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`${cmd} zlyhal: ${r.stderr || r.error}`);
}

if (!existsSync(MODEL)) {
    console.error('Chýba hlasový model – spusti najprv npm run build:voice');
    process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const manifest = {};
const todo = [];
for (const { word } of generated) {
    const id = lineId(word);
    manifest[word] = `hlas/slova/${id}.mp3`;
    if (ALL || !existsSync(path.join(OUT, `${id}.mp3`))) todo.push([id, `${word}.`]); // bodka = prirodzená intonácia
}
// 1) Piper naraz (python + balík piper-tts; PIPER_PY = cesta k pythonu s piper-tts)
if (todo.length) {
    const tmp = path.join(CACHE, 'slova');
    mkdirSync(tmp, { recursive: true });
    const py = process.env.PIPER_PY || 'python3';
    const r = spawnSync(py, [path.join(ROOT, 'scripts', 'lib', 'piper_batch.py'), MODEL, tmp, '1.18'], { input: JSON.stringify(todo), encoding: 'utf8', stdio: ['pipe', 'inherit', 'inherit'] });
    if (r.status !== 0) throw new Error('piper_batch.py zlyhal');
    // 2) MP3: orezané ticho na začiatku aj na konci, vyrovnaná hlasitosť
    for (const [id] of todo) {
        const wav = path.join(tmp, `${id}.wav`);
        run('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav,
            '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,apad=pad_dur=0.15,loudnorm=I=-16:TP=-1.5',
            '-ac', '1', '-ar', '22050', '-b:a', '48k', path.join(OUT, `${id}.mp3`)]);
        rmSync(wav, { force: true });
    }
}
const made = todo.length;

writeFileSync(
    path.join(ROOT, 'src', 'content', 'wordAudio.generated.js'),
    `// VYGENEROVANÉ skriptom scripts/build-word-audio.mjs – neupravovať ručne.\n// Hlas: Piper sk_SK-lili-medium (licencia – viď docs/PLAN.md, fáza 7).\nexport default ${JSON.stringify(manifest, null, 1)};\n`,
);
console.log(`Slov: ${generated.length}, nových nahrávok: ${made} → public/hlas/slova/`);
