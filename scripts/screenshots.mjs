#!/usr/bin/env node
/**
 * Nafotí všetky obrazovky hry v rôznych rozlíšeniach (počítač, notebook,
 * tablet, telefón na šírku aj na výšku) a skontroluje chyby na stránkach.
 *
 * Použitie:
 *   npm run build && npm run screenshots
 *   (prvýkrát: npx playwright install chromium)
 *
 * Výsledok: screenshots/<zariadenie>/<stránka>.png a screenshots/report.html
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'screenshots');

export const DEVICES = [
    { id: 'desktop-1080p', width: 1920, height: 1080 },
    { id: 'desktop-browser', width: 1920, height: 900 },
    { id: 'laptop-1366', width: 1366, height: 768 },
    { id: 'desktop-1440p', width: 2560, height: 1440 },
    { id: 'tablet-4x3', width: 1024, height: 768, touch: true },
    { id: 'phone-landscape', width: 844, height: 390, touch: true },
    { id: 'phone-portrait', width: 390, height: 844, touch: true },
];

export const PAGES = [
    { id: 'menu', url: 'index.html' },
    { id: 'pravidla', url: 'index.html', action: async (p) => p.click('.show-rules') },
    { id: 'svety', url: 'worldsmenu.html' },
    { id: 'trening-pexeso', url: 'worldsmenu.html', action: async (p) => p.click('#pexeso-button') },
    { id: 'bana', url: 'game.html?worldId=world_r&levelId=r_001' },
    { id: 'bana-cvicenie', url: 'game.html?worldId=world_r&levelId=r_001', action: async (p) => p.evaluate(() => window.openCvicenie && window.openCvicenie()) },
    { id: 'pexeso', url: 'pexeso.html?' + new URLSearchParams({
        custom: 'true', training: 'true', worldId: 'world_r', pairs: '6', timeLimit: '0',
        words: JSON.stringify(['rak', 'ruka', 'ryba', 'ruža', 'rosa', 'rok']),
        players: JSON.stringify([{ name: 'Hráč 1', score: 0 }]),
    }) },
    { id: 'super-jozino', url: 'superjozino.html' },
];

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.webp': 'image/webp', '.woff2': 'font/woff2', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.json': 'application/json', '.ico': 'image/x-icon' };

function serve(dir) {
    const server = createServer(async (req, res) => {
        const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        const file = path.join(dir, url === '/' ? 'index.html' : url);
        try {
            const data = await readFile(file);
            res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
            res.end(data);
        } catch {
            res.writeHead(404);
            res.end();
        }
    });
    return new Promise((resolve) => server.listen(0, () => resolve(server)));
}

async function main() {
    if (!existsSync(DIST)) {
        console.error('Chýba dist/ – najprv spusti: npm run build');
        process.exit(1);
    }
    const only = process.argv.slice(2);
    const server = await serve(DIST);
    const base = `http://localhost:${server.address().port}/`;
    const browser = await chromium.launch();
    const problems = [];
    const rows = [];

    for (const device of DEVICES) {
        await mkdir(path.join(OUT, device.id), { recursive: true });
        const ctx = await browser.newContext({
            viewport: { width: device.width, height: device.height },
            hasTouch: Boolean(device.touch),
            isMobile: Boolean(device.touch) && device.width < 1000,
        });
        for (const pg of PAGES) {
            if (only.length && !only.includes(pg.id)) continue;
            const page = await ctx.newPage();
            const errors = [];
            page.on('pageerror', (e) => errors.push(e.message));
            page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url().replace(base, '')}`); });
            await page.goto(base + pg.url, { waitUntil: 'load' });
            await page.waitForTimeout(2500);
            if (pg.action) {
                page.setDefaultTimeout(4000);
                // Na výšku akciu blokuje výzva „otoč telefón“ – to je v poriadku.
                await pg.action(page).catch(() => {});
                await page.waitForTimeout(800);
            }
            const file = path.join(OUT, device.id, `${pg.id}.png`);
            await page.screenshot({ path: file });
            // Kontrola: neprečnieva obsah mimo obrazovky (posúvanie stránky)?
            const overflow = await page.evaluate(() => ({
                x: document.documentElement.scrollWidth > window.innerWidth + 1,
                y: document.documentElement.scrollHeight > window.innerHeight + 1,
            }));
            if (overflow.x || overflow.y) errors.push(`obsah presahuje obrazovku (${overflow.x ? 'šírka' : ''}${overflow.y ? ' výška' : ''})`);
            for (const e of errors) problems.push(`${device.id} / ${pg.id}: ${e}`);
            rows.push({ device: device.id, page: pg.id, file: path.relative(OUT, file), errors });
            await page.close();
        }
        await ctx.close();
    }
    await browser.close();
    server.close();

    const html = `<!doctype html><meta charset="utf-8"><title>Screenshoty</title>
<style>body{font-family:sans-serif;background:#222;color:#eee}section{display:flex;flex-wrap:wrap;gap:12px}figure{margin:0}img{max-width:420px;max-height:300px;border:1px solid #555}.err{color:#f88}</style>
${DEVICES.map((d) => `<h2>${d.id} (${d.width}×${d.height})</h2><section>${rows.filter((r) => r.device === d.id)
        .map((r) => `<figure><img src="${r.file}" loading="lazy"><figcaption>${r.page}${r.errors.map((e) => `<div class="err">${e}</div>`).join('')}</figcaption></figure>`).join('')}</section>`).join('')}`;
    await writeFile(path.join(OUT, 'report.html'), html);

    console.log(`Hotovo: ${rows.length} screenshotov v ${path.relative(ROOT, OUT)}/ (report.html)`);
    if (problems.length) {
        console.log(`\nProblémy (${problems.length}):\n` + problems.map((p) => '  ' + p).join('\n'));
    }
}

main();
