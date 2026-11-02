#!/usr/bin/env node
/**
 * Zmenšenie a prekomprimovanie obrázkov.
 *
 * - Názvy ani formáty súborov sa NEMENIA (kód odkazuje na .png/.jpg),
 *   takže netreba upravovať žiadne cesty v kóde.
 * - Obrázok sa zmenší tak, aby dlhšia strana neprekročila limit pre daný priečinok.
 * - Súbor sa prepíše iba vtedy, ak je výsledok menší ako originál.
 *
 * Použitie:
 *   npm run optimize:images            # spracuje všetky priečinky z RULES
 *   npm run optimize:images -- --dry   # len vypíše, čo by sa ušetrilo
 */
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'public');
const DRY = process.argv.includes('--dry');

// Pravidlá: priečinok -> maximálna dĺžka dlhšej strany v px.
// Poradie je dôležité – prvé pravidlo, ktoré sedí, vyhráva.
const RULES = [
    { dir: 'images/slova', maxSize: 512, recursive: true },
    { dir: 'images/superjozino/assets/player', maxSize: 400, recursive: true },
    { dir: 'images/superjozino', maxSize: 1024, recursive: true },
    { dir: 'images/worlds', maxSize: 1920, recursive: true },
    { dir: 'images', maxSize: 1920, recursive: false },
];

const EXT = new Set(['.png', '.jpg', '.jpeg']);

async function* walk(dir, recursive) {
    let entries;
    try {
        entries = await readdir(dir, { withFileTypes: true });
    } catch {
        return;
    }
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
            if (recursive) yield* walk(full, recursive);
        } else if (EXT.has(path.extname(e.name).toLowerCase())) {
            yield full;
        }
    }
}

async function optimize(file, maxSize) {
    const input = await readFile(file);
    const ext = path.extname(file).toLowerCase();
    let pipeline = sharp(input, { failOn: 'none' }).rotate().resize({
        width: maxSize,
        height: maxSize,
        fit: 'inside',
        withoutEnlargement: true,
    });

    pipeline = ext === '.png'
        ? pipeline.png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 })
        : pipeline.jpeg({ quality: 82, mozjpeg: true });

    const output = await pipeline.toBuffer();
    if (output.length < input.length) {
        if (!DRY) await writeFile(file, output);
        return { before: input.length, after: output.length };
    }
    return { before: input.length, after: input.length };
}

const done = new Set();
let totalBefore = 0;
let totalAfter = 0;
let count = 0;

for (const rule of RULES) {
    for await (const file of walk(path.join(ROOT, rule.dir), rule.recursive)) {
        if (done.has(file)) continue;
        done.add(file);
        try {
            const { before, after } = await optimize(file, rule.maxSize);
            totalBefore += before;
            totalAfter += after;
            count++;
            if (before - after > 500 * 1024) {
                console.log(`${path.relative(ROOT, file)}: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(2)} MB`);
            }
        } catch (err) {
            console.warn(`Preskakujem ${path.relative(ROOT, file)}: ${err.message}`);
        }
    }
}

const mb = (b) => (b / 1048576).toFixed(1);
console.log(`\n${DRY ? '[DRY] ' : ''}Spracovaných ${count} súborov: ${mb(totalBefore)} MB -> ${mb(totalAfter)} MB (ušetrené ${mb(totalBefore - totalAfter)} MB)`);
