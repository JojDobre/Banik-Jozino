/**
 * Ikona appky a úvodná obrazovka (Android) z obrázka baníka Jožina.
 *   node scripts/brand/build-icons.mjs
 * Výstup: android/app/src/main/res/mipmap-…, drawable…/splash.png, public/images/icons/
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const RES = path.join(ROOT, 'android/app/src/main/res');
const MINER = path.join(ROOT, 'public/images/banik.png');
const OUT = path.join(ROOT, 'public/images/icons');

// pozadie: zlatá žiara v bani
const bgSvg = (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 100 100">
  <defs>
    <radialGradient id="g" cx="50%" cy="42%" r="70%">
      <stop offset="0" stop-color="#ffd84a"/><stop offset=".38" stop-color="#e48a1c"/>
      <stop offset=".75" stop-color="#7a3510"/><stop offset="1" stop-color="#3a180a"/>
    </radialGradient>
  </defs>
  <rect width="100" height="100" fill="url(#g)"/>
  ${[[16, 20, 2.2], [84, 26, 1.6], [22, 80, 1.4], [80, 78, 2], [50, 10, 1.2], [10, 52, 1.2], [90, 52, 1.4]].map(([x, y, r]) =>
    `<path d="M${x} ${y - r * 2}L${x + r * .6} ${y - r * .6}L${x + r * 2} ${y}L${x + r * .6} ${y + r * .6}L${x} ${y + r * 2}L${x - r * .6} ${y + r * .6}L${x - r * 2} ${y}L${x - r * .6} ${y - r * .6}z" fill="#fff6c8" opacity=".85"/>`).join('')}
</svg>`;

// hlava a krompáč baníka (výrez z banik.png 1200×1038)
async function minerHead(size) {
    return sharp(MINER).extract({ left: 150, top: 0, width: 840, height: 840 }).resize(size, size).png().toBuffer();
}

// adaptívna ikona: vrstva 108 dp (bezpečná zóna 72 dp v strede) – baník siaha po spodný okraj
async function layer(size, withBg) {
    const hs = Math.round(size * 0.8);
    const head = await minerHead(hs);
    const base = withBg
        ? sharp(Buffer.from(bgSvg(size)))
        : sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } });
    return base.composite([{ input: head, left: Math.round(size * 0.1), top: Math.round(size * 0.14) }]).png().toBuffer();
}
const foreground = (size) => layer(size, false);

/** Klasická ikona = stred adaptívnej (zaoblený štvorec alebo kruh). */
async function icon(size, { round = false } = {}) {
    const big = Math.round(size / 0.8);
    const full = await layer(big, true);
    const off = Math.round((big - size) / 2);
    const crop = await sharp(full).extract({ left: off, top: off, width: size, height: size }).png().toBuffer();
    const shape = round
        ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/>`
        : `<rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}"/>`;
    const mask = Buffer.from(`<svg width="${size}" height="${size}">${shape}</svg>`);
    return sharp(crop).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
}

const DENS = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

async function splash(w, h) {
    const logo = Math.round(Math.min(w, h) * 0.42);
    const miner = await sharp(MINER).resize(logo).png().toBuffer();
    const meta = await sharp(miner).metadata();
    const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs><radialGradient id="g" cx="50%" cy="45%" r="65%"><stop offset="0" stop-color="#5a2a0e"/><stop offset="1" stop-color="#1c0f08"/></radialGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/></svg>`);
    return sharp(text).composite([{ input: miner, left: Math.round((w - logo) / 2), top: Math.round((h - meta.height) / 2) }]).png().toBuffer();
}

fs.mkdirSync(OUT, { recursive: true });
for (const [d, k] of Object.entries(DENS)) {
    const dir = path.join(RES, `mipmap-${d}`);
    fs.writeFileSync(path.join(dir, 'ic_launcher.png'), await icon(Math.round(48 * k)));
    fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), await icon(Math.round(48 * k), { round: true }));
    fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), await foreground(Math.round(108 * k)));
    fs.writeFileSync(path.join(dir, 'ic_launcher_background.png'), await sharp(Buffer.from(bgSvg(Math.round(108 * k)))).png().toBuffer());
    for (const o of ['port', 'land']) {
        const [w, hh] = o === 'port' ? [320 * k, 480 * k] : [480 * k, 320 * k];
        fs.writeFileSync(path.join(RES, `drawable-${o}-${d}`, 'splash.png'), await splash(Math.round(w), Math.round(hh)));
    }
}
fs.writeFileSync(path.join(RES, 'drawable', 'splash.png'), await splash(480, 320));
// web: favicon a veľká ikona (Google Play 512×512)
fs.writeFileSync(path.join(OUT, 'favicon.png'), await icon(64));
fs.writeFileSync(path.join(OUT, 'icon-512.png'), await icon(512));
fs.writeFileSync(path.join(OUT, 'icon-1024.png'), await icon(1024));
console.log('Ikony a úvodná obrazovka hotové.');
