#!/usr/bin/env node
/**
 * Vygeneruje slovník slov src/content/words.generated.js z:
 *  - slov v public/config/levels.js (a do ktorého sveta patria)
 *  - obrázkov v public/images/slova/
 *  - nahrávok v public/zvuky/
 *
 * Ručné opravy NEROBTE vo vygenerovanom súbore – patria do
 * src/content/word-overrides.js (prepíšu sa pri ďalšom generovaní).
 *
 * Použitie: npm run build:words
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { analyzeWord } from '../src/core/slovak.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const pub = (...p) => path.join(ROOT, 'public', ...p);

async function loadConfig(file, names) {
    const code = await readFile(pub('config', file), 'utf8');
    const ctx = { console: { log() {}, warn() {}, error() {} } };
    vm.createContext(ctx);
    vm.runInContext(`${code}\n;${names.map((n) => `this.${n} = ${n};`).join('')}`, ctx);
    return ctx;
}

const { WORLDS_CONFIG } = await loadConfig('worlds.js', ['WORLDS_CONFIG']);
const { LEVELS_CONFIG } = await loadConfig('levels.js', ['LEVELS_CONFIG']);

const worldPhoneme = Object.fromEntries(WORLDS_CONFIG.map((w) => [w.id, w.name.toUpperCase()]));

const files = (dir, ext) =>
    readdir(dir).then((list) => new Map(list.filter((f) => ext.includes(path.extname(f).toLowerCase()))
        .map((f) => [path.basename(f, path.extname(f)).normalize('NFC').toLowerCase(), f.normalize('NFC')])));

const images = await files(pub('images', 'slova'), ['.png']);
const sounds = await files(pub('zvuky'), ['.wav', '.mp3']);

// slovo -> množina svetov
const usage = new Map();
for (const [worldId, levels] of Object.entries(LEVELS_CONFIG)) {
    for (const level of levels) {
        for (const raw of level.words || []) {
            const word = String(raw).normalize('NFC').trim().toLowerCase();
            if (!word) continue;
            if (!usage.has(word)) usage.set(word, new Set());
            usage.get(word).add(worldId);
        }
    }
}
// aj slová, ktoré majú len obrázok (zatiaľ nie sú v žiadnom leveli)
for (const word of images.keys()) if (!usage.has(word)) usage.set(word, new Set());

const minAgeFor = (syllables, hasCluster) => {
    let age = syllables <= 2 ? 3 : syllables === 3 ? 5 : 6;
    if (hasCluster) age += 1;
    return Math.min(age, 7);
};

const entries = [...usage.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'sk'))
    .map(([word, worlds]) => {
        const { syllables, phonemes } = analyzeWord(word);
        const worldList = [...worlds].sort();
        // zhluk pre hlásky svetov, kde sa slovo používa
        const relevant = worldList.map((w) => phonemes[worldPhoneme[w]]).filter(Boolean);
        const hasCluster = relevant.some((p) => p.cluster);
        return {
            word,
            image: images.has(word) ? `images/slova/${images.get(word)}` : null,
            audio: sounds.has(word) ? `zvuky/${sounds.get(word)}` : null,
            syllables,
            minAge: minAgeFor(syllables, hasCluster),
            worlds: worldList,
            phonemes,
        };
    });

const header = `// VYGENEROVANÉ skriptom scripts/build-words.mjs – neupravovať ručne.
// Opravy patria do src/content/word-overrides.js.
`;
await writeFile(path.join(ROOT, 'src/content/words.generated.js'),
    `${header}export default ${JSON.stringify(entries, null, 1)};\n`);

const noImage = entries.filter((e) => e.worlds.length && !e.image).map((e) => e.word);
const withAudio = entries.filter((e) => e.audio).length;
console.log(`Slov: ${entries.length} (v leveloch: ${entries.filter((e) => e.worlds.length).length}), s nahrávkou: ${withAudio}`);
if (noImage.length) console.log(`Slová v leveloch bez obrázka (${noImage.length}): ${noImage.join(', ')}`);
