// Audit jednotnosti UI: na každej stránke zmeria (v px OBRAZOVKY telefónu)
// okrúhle tlačidlá, nadpisy, najmenší text a prekrývanie prvkov.
// Spustenie: npm run build && npm run audit:ui [-- desk]
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const dist = path.join(__dirname, '..', 'dist');
const mime = (f) => f.endsWith('.js') ? 'text/javascript' : f.endsWith('.css') ? 'text/css' : f.endsWith('.html') ? 'text/html' : f.endsWith('.woff2') ? 'font/woff2' : 'application/octet-stream';
const PAGES = ['index.html', 'profil.html', 'urovne.html', 'cesta.html', 'pocuvaj.html?level=t1_01', 'album.html',
  'worldsmenu.html', 'game.html?worldId=world_r&levelId=r_001', 'pexeso.html?worldId=world_r&levelId=r_002', 'superjozino.html'];
const ROUND = '.back-button a, a.back-button, .bj-round-btn, .sj-gear, #menuButton, .bj-icon-btn';
const desk = process.argv.includes('desk');
const srv = http.createServer((q, r) => { const f = path.join(dist, decodeURIComponent(new URL(q.url, 'http://x').pathname)); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': mime(f) }); r.end(d); } }); }).listen(0, async () => {
  const base = `http://localhost:${srv.address().port}/`;
  const b = await chromium.launch();
  const ctx = await b.newContext(desk ? { viewport: { width: 1920, height: 1080 } } : { viewport: { width: 892, height: 412 }, deviceScaleFactor: 2.25, hasTouch: true, isMobile: true });
  await ctx.addInitScript(() => {
    if (localStorage.getItem('bj.profiles')) return;
    localStorage.setItem('bj.profiles', JSON.stringify({ version: 2, activeId: 'p', profiles: { p: { id: 'p', name: 'Peter', age: 5, ageGroup: '5-6', avatar: 'yellow_hat', progressKey: 'speechTherapyProgress', settings: { sound: false, voiceInstructions: false }, collection: { cards: { rubin: 1 }, sparkles: 0, packs: [{ id: 'k', set: 'drahokamy', size: 3 }] } } } }));
  });
  let problems = 0;
  for (const url of PAGES) {
    const p = await ctx.newPage();
    await p.goto(base + url); await p.waitForTimeout(2500);
    const r = await p.evaluate((ROUND) => {
      const vis = (e) => { const s = getComputedStyle(e); const rc = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0 && rc.width > 0 && rc.height > 0 && !e.closest('#loading-screen,.loading-screen,[style*="display: none"],.modal:not([style*="block"]),.dialogove-okno,#endgame,#cvicenie,#zvuky,.bj-modal,.bj-reward,.bj-settings,#bj-rotate'); };
      const round = [...document.querySelectorAll(ROUND)].filter(vis).map((e) => Math.round(e.getBoundingClientRect().height));
      // najmenší viditeľný text (výška písma na obrazovke)
      let minText = 1e9, minSel = '';
      const sc = window.BJStage ? BJStage.scale : 1;
      for (const e of document.querySelectorAll('#bj-stage *')) {
        if (!vis(e)) continue;
        const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
        if (!own) continue;
        const fs = parseFloat(getComputedStyle(e).fontSize) * sc;
        if (fs < minText) { minText = fs; minSel = (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : e.tagName) + ' "' + e.textContent.trim().slice(0, 14) + '"'; }
      }
      // prekrývanie: okrúhle tlačidlá / čipy vs. texty
      const ctrls = [...document.querySelectorAll(ROUND + ', .bj-chip')].filter(vis);
      const texts = [...document.querySelectorAll('h1,h2,h3,.bj-title,.game-sign,.album-stat,.chapter-title')].filter(vis);
      const overlaps = [];
      for (const c of ctrls) { const a = c.getBoundingClientRect(); for (const t of texts) { if (c.contains(t) || t.contains(c)) continue; const q = t.getBoundingClientRect(); const ix = Math.min(a.right, q.right) - Math.max(a.left, q.left), iy = Math.min(a.bottom, q.bottom) - Math.max(a.top, q.top); if (ix > 2 && iy > 2) overlaps.push(c.className.toString().split(' ')[0] + ' × ' + (t.className.toString().split(' ')[0] || t.tagName)); } }
      // prečnievanie mimo obrazovky
      const off = [...document.querySelectorAll('#bj-stage button, #bj-stage a, .bj-chip')].filter(vis).filter((e) => { const q = e.getBoundingClientRect(); return q.left < -1 || q.top < -1 || q.right > innerWidth + 1 || q.bottom > innerHeight + 1; }).map((e) => e.className.toString().split(' ')[0] || e.tagName);
      return { scale: sc.toFixed(3), round: [...new Set(round)], minText: Math.round(minText * 10) / 10, minSel, overlaps: [...new Set(overlaps)], off: [...new Set(off)] };
    }, ROUND);
    const bad = [];
    if (r.round.some((x) => Math.abs(x - r.round[0]) > 2)) bad.push('rôzne veľké okrúhle tlačidlá');
    if (!desk && r.round.some((x) => x < 40)) bad.push('okrúhle tlačidlo < 40 px');
    if (!desk && r.minText < 9) bad.push('text < 9 px');
    if (r.overlaps.length) bad.push('prekrytie');
    if (r.off.length) bad.push('mimo obrazovky');
    problems += bad.length;
    console.log(url.split('?')[0].padEnd(17), 'mierka', r.scale, '| okrúhle', JSON.stringify(r.round), '| min. text', r.minText + 'px', r.minSel, r.overlaps.length ? '| PREKRYTIE ' + r.overlaps.join(', ') : '', r.off.length ? '| MIMO ' + r.off.join(',') : '', bad.length ? '  <-- ' + bad.join('; ') : '');
    await p.close();
  }
  await b.close(); srv.close();
  console.log(problems ? `\n${problems} problém(ov)` : '\nOK'); process.exit(problems ? 1 : 0);
});
