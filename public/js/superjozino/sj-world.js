/**
 * Super Jožino – svet z dlaždíc: formát levelu, vykreslenie a kolízie.
 * Spoločné pre hru (superjozino.html) aj builder levelov (builder.html).
 * Nezávisí od triedy Game.
 *
 * FORMÁT LEVELU (JSON, verzia 1)
 * {
 *   v: 1, name, cols, rows,
 *   style: 'green' | 'orange' | 'pink'   – farba zeme pre znak '#'
 *   bg: null | 'blue' | 'brown' | 'gray' | 'green' | 'pink' | 'purple' | 'yellow'
 *                                        – null = pozadie sveta (les), inak vzor
 *   frame: null | 'stone' | 'wood' | 'green' – rámik okolo (miestnosti)
 *   layers: { back: [riadky], main: [riadky], front: [riadky] }
 *       back  = zadná vrstva (len vzhľad, nedá sa na ňu stúpiť)
 *       main  = hlavná vrstva (pevná)
 *       front = predná vrstva (pevná, kreslí sa NAD hlavnou – bloky cez seba)
 *   stamps:  [{ id, c, r, layer }]  – veľké bloky (2×2, 3×1, 1×3)
 *   objects: [{ t, c, r, ...parametre }]
 *   rooms:   [{ id, name, cols, rows, bg, frame, layers, stamps, objects }]
 * }
 * 1 dlaždica = 32×32 jednotiek sveta = 16×16 px pixel artu (2×).
 */
(function () {
    const TS = 32;
    const H = TS / 2;

    const IMG = (src) => { const i = new Image(); i.src = src; return i; };
    const SHEETS = {
        terrain: IMG('images/superjozino/pa/terrain/terrain.png'),
        smi: IMG('images/superjozino/pa/traps/sand-mud-ice/sand-mud-ice.png'),
    };
    const BG = {};
    ['blue', 'brown', 'gray', 'green', 'pink', 'purple', 'yellow'].forEach((n) => { BG[n] = IMG(`images/superjozino/pa/background/${n}.png`); });

    /** Dlaždice 1×1 vo vrstvách. auto = 3×3 blok so samočinnými okrajmi. */
    const TILES = {
        '1': { name: 'Tráva zelená', auto: { sheet: 'terrain', x: 96, y: 0 } },
        '2': { name: 'Tráva oranžová', auto: { sheet: 'terrain', x: 96, y: 64 } },
        '3': { name: 'Tráva ružová', auto: { sheet: 'terrain', x: 96, y: 128 } },
        '4': { name: 'Piesok', auto: { sheet: 'smi', x: 0, y: 0 } },
        '5': { name: 'Blato', auto: { sheet: 'smi', x: 64, y: 0 } },
        '6': { name: 'Ľad', auto: { sheet: 'smi', x: 128, y: 0 }, surface: 'ice' },
        '7': { name: 'Tehly', auto: { sheet: 'terrain', x: 272, y: 64 } },
        '8': { name: 'Kameň (rám)', auto: { sheet: 'terrain', x: 0, y: 0 } },
        '9': { name: 'Drevo (rám)', auto: { sheet: 'terrain', x: 0, y: 64 } },
        '0': { name: 'Machový kameň (rám)', auto: { sheet: 'terrain', x: 0, y: 128 } },
        K: { name: 'Kovová kocka', single: { x: 192, y: 80 } },
        Z: { name: 'Zlatá kocka', single: { x: 272, y: 144 } },
        N: { name: 'Hnedá kocka', single: { x: 192, y: 16 } },
        Q: { name: 'Oranžová kocka', single: { x: 192, y: 144 } },
        '-': { name: 'Drevená lišta', thin: { x: 272, y: 16 } },
        '_': { name: 'Zlatá lišta', thin: { x: 272, y: 0 } },
        ':': { name: 'Železná lišta', thin: { x: 272, y: 32 } },
        // staršie znaky (textové mapy)
        '#': { name: 'Zem (podľa štýlu)', auto: null, legacy: true },
        I: { name: 'Ľad', auto: { sheet: 'smi', x: 128, y: 0 }, surface: 'ice', legacy: true },
        '=': { name: 'Hnedá kocka', single: { x: 192, y: 16 }, legacy: true },
    };
    const STYLE_SET = { green: '1', orange: '2', pink: '3' };

    /** Veľké bloky: zdroj v terrain.png a veľkosť v dlaždiciach. */
    const STAMPS = {
        brownBig: { name: 'Hnedý blok 2×2', x: 208, y: 16, w: 32, h: 32 },
        brownBar: { name: 'Hnedá lišta 3×1', x: 192, y: 0, w: 48, h: 16 },
        brownV: { name: 'Hnedý stĺp 1×3', x: 240, y: 0, w: 16, h: 48 },
        metalBig: { name: 'Kovový blok 2×2', x: 208, y: 80, w: 32, h: 32 },
        metalBar: { name: 'Kovová lišta 3×1', x: 192, y: 64, w: 48, h: 16 },
        metalV: { name: 'Kovový stĺp 1×3', x: 240, y: 64, w: 16, h: 48 },
        orangeBig: { name: 'Oranžový blok 2×2', x: 208, y: 144, w: 32, h: 32 },
        orangeBar: { name: 'Oranžová lišta 3×1', x: 192, y: 128, w: 48, h: 16 },
        orangeV: { name: 'Oranžový stĺp 1×3', x: 240, y: 128, w: 16, h: 48 },
        goldBig: { name: 'Zlatý blok 2×2', x: 288, y: 144, w: 32, h: 32 },
        goldBar: { name: 'Zlatá lišta 3×1', x: 272, y: 128, w: 48, h: 16 },
        goldV: { name: 'Zlatý stĺp 1×3', x: 320, y: 128, w: 16, h: 48 },
    };
    Object.values(STAMPS).forEach((s) => { s.cw = s.w / 16; s.ch = s.h / 16; });

    const FRAMES = { stone: '8', wood: '9', green: '0' };

    /** Objekty (1 na dlaždicu). icon = sprite pre builder. */
    const OBJECTS = {
        P: { name: 'Štart', group: 'Hráč', icon: 'startIdle', unique: true },
        E: { name: 'Cieľ (trofej)', group: 'Hráč', icon: 'endIdle', unique: true },
        C: { name: 'Checkpoint', group: 'Hráč', icon: 'checkpointIdle' },
        O: { name: 'Portál', group: 'Hráč', icon: 'portal', params: { to: '' } },
        o: { name: 'Ovocie', group: 'Zbieranie', icon: 'apple' },
        D: { name: 'Modrý diamant (rečové)', group: 'Zbieranie', icon: 'gemBlue' },
        L: { name: 'Strieborná minca (posluchové)', group: 'Zbieranie', icon: 'coinSilver' },
        G: { name: 'Zelený drahokam (super skok)', group: 'Zbieranie', icon: 'gemGreen' },
        R: { name: 'Červený drahokam (+1 život)', group: 'Zbieranie', icon: 'gemRed' },
        X: { name: 'Krabica s ovocím', group: 'Bloky a pasce', icon: 'box1', params: { variant: 1 } },
        B: { name: 'Rozbitný blok', group: 'Bloky a pasce', icon: 'blockIdle' },
        T: { name: 'Trampolína', group: 'Bloky a pasce', icon: 'trampoline' },
        F: { name: 'Padajúca plošina', group: 'Bloky a pasce', icon: 'fallingOn' },
        '~': { name: 'Plošina vodorovne', group: 'Bloky a pasce', icon: 'brownOn', params: { range: 3 } },
        '!': { name: 'Plošina zvislo', group: 'Bloky a pasce', icon: 'greyOn', params: { range: 3 } },
        '^': { name: 'Ostne', group: 'Bloky a pasce', icon: 'spikes' },
        S: { name: 'Píla', group: 'Bloky a pasce', icon: 'sawOn', params: { range: 3, vertical: false } },
        f: { name: 'Oheň', group: 'Bloky a pasce', icon: 'fireOff' },
        w: { name: 'Ventilátor', group: 'Bloky a pasce', icon: 'fanOn' },
        a: { name: 'Šípka (vystrelí hore)', group: 'Bloky a pasce', icon: 'arrowIdle' },
        m: { name: 'Hríbik', group: 'Nepriatelia', icon: 'mushroomRun' },
        c: { name: 'Sliepka', group: 'Nepriatelia', icon: 'chickenRun' },
        n: { name: 'Slimák', group: 'Nepriatelia', icon: 'snailWalk' },
        s: { name: 'Sliz', group: 'Nepriatelia', icon: 'slimeRun' },
        b: { name: 'Zajac', group: 'Nepriatelia', icon: 'bunnyRun' },
        r: { name: 'Reďkovka', group: 'Nepriatelia', icon: 'radishRun' },
        p: { name: 'Prasiatko', group: 'Nepriatelia', icon: 'pigWalk' },
        u: { name: 'Vtáčik (letí)', group: 'Nepriatelia', icon: 'birdFly', params: { range: 3 } },
        e: { name: 'Včela (vznáša sa)', group: 'Nepriatelia', icon: 'beeIdle', params: { range: 3 } },
        h: { name: 'Nosorožec', group: 'Nepriatelia', icon: 'rinoIdle' },
        t: { name: 'Korytnačka (ostne)', group: 'Nepriatelia', icon: 'turtleIdle' },
    };

    const LAYERS = ['back', 'main', 'front'];

    // ---------- pomocné ----------

    function emptyRows(cols, rows) {
        return Array.from({ length: rows }, () => ' '.repeat(cols));
    }

    /** Prístup k znaku vrstvy (mimo mriežky: dole a do strán pokračuje rovnaký znak). */
    function cellGetter(def, layer) {
        const rows = (def.layers && def.layers[layer]) || [];
        const R = def.rows;
        const C = def.cols;
        return (c, r) => {
            if (r < 0) return ' ';
            const rr = Math.min(r, R - 1);
            const cc = Math.max(0, Math.min(c, C - 1));
            const row = rows[rr] || '';
            const ch = row[cc] || ' ';
            if (r >= R || c < 0 || c >= C) {
                // za okrajom pokračuje len terén (bez rámika), aby nebol vidieť obrys
                return def.frame ? ' ' : (TILES[ch] && TILES[ch].auto !== undefined ? ch : ' ');
            }
            return ch;
        };
    }

    function legacyConnect(a, b) {
        const L = '#KZ=';
        return L.includes(a) && L.includes(b);
    }

    function drawAuto(ctx, set, x, y, up, down, left, right) {
        const img = SHEETS[set.sheet];
        for (let qy = 0; qy < 2; qy++) {
            for (let qx = 0; qx < 2; qx++) {
                const cr = qy === 0 ? (up ? 1 : 0) : (down ? 1 : 2);
                const cc = qx === 0 ? (left ? 1 : 0) : (right ? 1 : 2);
                ctx.drawImage(img, set.x + cc * 16 + qx * 8, set.y + cr * 16 + qy * 8, 8, 8, x + qx * H, y + qy * H, H, H);
            }
        }
    }

    function autoSet(def, ch) {
        if (ch === '#') return TILES[STYLE_SET[def.style] || '1'].auto;
        return TILES[ch] && TILES[ch].auto;
    }

    function drawCell(ctx, def, get, ch, c, r, x, y) {
        const t = TILES[ch];
        if (!t) return;
        if (t.auto !== undefined) {
            const set = autoSet(def, ch);
            if (!set) return;
            const same = (cc, rr) => {
                const n = get(cc, rr);
                return n === ch || (ch === '#' && legacyConnect(ch, n));
            };
            drawAuto(ctx, set, x, y, same(c, r - 1), same(c, r + 1), same(c - 1, r), same(c + 1, r));
        } else if (t.single) {
            ctx.drawImage(SHEETS.terrain, t.single.x, t.single.y, 16, 16, x, y, TS, TS);
        } else if (t.thin) {
            const l = get(c - 1, r) === ch;
            const rr = get(c + 1, r) === ch;
            ctx.drawImage(SHEETS.terrain, t.thin.x + (l ? 16 : 0), t.thin.y, 8, 5, x, y, H, 10);
            ctx.drawImage(SHEETS.terrain, t.thin.x + (rr ? 24 : 40), t.thin.y, 8, 5, x + H, y, H, 10);
        }
    }

    function drawStamp(ctx, st, ox = 0, oy = 0) {
        const s = STAMPS[st.id];
        if (!s) return;
        ctx.drawImage(SHEETS.terrain, s.x, s.y, s.w, s.h, st.c * TS + ox, st.r * TS + oy, s.cw * TS, s.ch * TS);
    }

    /**
     * Vykreslí vrstvy (a veľké bloky) v oblasti dlaždíc [c0, c1) × [r0, r1).
     * ox, oy = posun (napr. pri kreslení do kúska plátna).
     * opts.dimBack = zadnú vrstvu stmaviť (aby bolo vidieť, že je „za“).
     */
    function drawRegion(ctx, def, c0, r0, c1, r1, ox = 0, oy = 0, opts = {}) {
        if (!ready()) return false;
        ctx.imageSmoothingEnabled = false;
        const layers = opts.layers || LAYERS;
        for (const layer of layers) {
            const get = cellGetter(def, layer);
            const rows = (def.layers && def.layers[layer]) || [];
            for (let r = Math.max(0, r0); r < Math.min(def.rows, r1); r++) {
                const row = rows[r] || '';
                for (let c = Math.max(0, c0); c < Math.min(def.cols, c1); c++) {
                    const ch = row[c];
                    if (!ch || ch === ' ') continue;
                    drawCell(ctx, def, get, ch, c, r, c * TS + ox, r * TS + oy);
                }
            }
            for (const st of def.stamps || []) {
                if ((st.layer || 'main') !== layer) continue;
                const s = STAMPS[st.id];
                if (!s || st.c + s.cw < c0 || st.c > c1 || st.r + s.ch < r0 || st.r > r1) continue;
                drawStamp(ctx, st, ox, oy);
            }
            if (layer === 'back' && opts.dimBack !== false) {
                // zadná vrstva o niečo tmavšia – je „za“ hlavnou
                ctx.save();
                ctx.globalCompositeOperation = 'source-atop';
                ctx.fillStyle = 'rgba(20, 16, 40, 0.28)';
                ctx.fillRect(c0 * TS + ox, r0 * TS + oy, (c1 - c0) * TS, (r1 - r0) * TS);
                ctx.restore();
            }
        }
        return true;
    }

    /** Rámik okolo levelu / miestnosti (1 dlaždica mimo mriežky). */
    function drawFrame(ctx, def, ox = 0, oy = 0) {
        if (!def.frame || !ready()) return;
        const set = TILES[FRAMES[def.frame]].auto;
        const C = def.cols;
        const R = def.rows;
        const ring = (c, r) => (c === -1 || c === C || r === -1 || r === R) && c >= -1 && c <= C && r >= -1 && r <= R;
        ctx.imageSmoothingEnabled = false;
        for (let r = -1; r <= R; r++) {
            for (let c = -1; c <= C; c++) {
                if (!ring(c, r)) continue;
                // rohy = samostatná kocka (ako v miestnostiach Pixel Adventure)
                const corner = (c === -1 || c === C) && (r === -1 || r === R);
                if (corner) drawAuto(ctx, set, c * TS + ox, r * TS + oy, false, false, false, false);
                else drawAuto(ctx, set, c * TS + ox, r * TS + oy, ring(c, r - 1), ring(c, r + 1), ring(c - 1, r), ring(c + 1, r));
            }
        }
    }

    /** Vzorované pozadie miestnosti (dlaždice 64×64 px = 128 jednotiek), posun t. */
    function drawPattern(ctx, def, t = 0, ox = 0, oy = 0) {
        const img = def.bg && BG[def.bg];
        if (!img || !img.complete || !img.naturalWidth) return false;
        const T = 128;
        const W = def.cols * TS;
        const Hh = def.rows * TS;
        const off = (t * 0.25) % T;
        ctx.save();
        ctx.beginPath();
        ctx.rect(ox, oy, W, Hh);
        ctx.clip();
        ctx.imageSmoothingEnabled = false;
        for (let y = -T + off; y < Hh; y += T) {
            for (let x = -T + off; x < W; x += T) ctx.drawImage(img, ox + x, oy + y, T, T);
        }
        ctx.restore();
        return true;
    }

    function ready() {
        return SHEETS.terrain.complete && SHEETS.terrain.naturalWidth > 0 && SHEETS.smi.complete && SHEETS.smi.naturalWidth > 0;
    }

    /** Kolízne obdĺžniky (hlavná a predná vrstva, veľké bloky, rámik). */
    function collisions(def) {
        const out = [];
        const isSolid = (ch) => TILES[ch] && !TILES[ch].thin;
        const isThin = (ch) => TILES[ch] && TILES[ch].thin;
        // pevné dlaždice z oboch vrstiev v jednej mriežke
        const grid = [];
        for (let r = 0; r < def.rows; r++) {
            const row = [];
            for (let c = 0; c < def.cols; c++) {
                let v = ' ';
                for (const layer of ['main', 'front']) {
                    const ch = ((def.layers[layer] || [])[r] || '')[c] || ' ';
                    if (isSolid(ch)) v = TILES[ch].surface === 'ice' ? 'I' : (v === 'I' ? 'I' : 'S');
                    else if (isThin(ch) && v === ' ') v = '-';
                }
                row.push(v);
            }
            grid.push(row);
        }
        for (let r = 0; r < def.rows; r++) {
            let c = 0;
            while (c < def.cols) {
                const v = grid[r][c];
                if (v === ' ') { c++; continue; }
                let e = c;
                while (e + 1 < def.cols && grid[r][e + 1] === v) e++;
                if (v === '-') out.push({ x: c * TS, y: r * TS, width: (e - c + 1) * TS, height: 12, type: 'platform', tile: true });
                else out.push({ x: c * TS, y: r * TS, width: (e - c + 1) * TS, height: TS, type: 'tile', tile: true, surface: v === 'I' ? 'ice' : null });
                c = e + 1;
            }
        }
        for (const st of def.stamps || []) {
            if ((st.layer || 'main') === 'back') continue;
            const s = STAMPS[st.id];
            if (s) out.push({ x: st.c * TS, y: st.r * TS, width: s.cw * TS, height: s.ch * TS, type: 'tile', tile: true });
        }
        if (def.frame) {
            const W = def.cols * TS;
            const Hh = def.rows * TS;
            out.push({ x: -TS, y: -TS, width: W + 2 * TS, height: TS, type: 'tile', tile: true });
            out.push({ x: -TS, y: Hh, width: W + 2 * TS, height: TS, type: 'tile', tile: true });
            out.push({ x: -TS, y: 0, width: TS, height: Hh, type: 'tile', tile: true });
            out.push({ x: W, y: 0, width: TS, height: Hh, type: 'tile', tile: true });
        }
        return out;
    }

    /** Textová mapa (sj-levels.js) → formát levelu. */
    function fromAscii(a) {
        const rows = a.map.map((r) => r.replace(/\s+$/, ''));
        const cols = Math.max(...rows.map((r) => r.length));
        const main = [];
        const objects = [];
        const counters = {};
        rows.forEach((row, r) => {
            let line = '';
            for (let c = 0; c < cols; c++) {
                const ch = row[c] || ' ';
                if (TILES[ch]) line += ch;
                else {
                    line += ' ';
                    if (ch !== ' ' && OBJECTS[ch]) {
                        const i = counters[ch] = (counters[ch] ?? -1) + 1;
                        const p = (a.params && a.params[ch] && a.params[ch][i]) || {};
                        objects.push({ t: ch, c, r, ...p });
                    }
                }
            }
            main.push(line);
        });
        return { v: 1, name: a.name || '', cols, rows: rows.length, style: a.style || 'green', bg: a.bg || null, frame: a.frame || null, layers: { back: emptyRows(cols, rows.length), main, front: emptyRows(cols, rows.length) }, stamps: [], objects, rooms: a.rooms || [] };
    }

    /** Prázdny level / miestnosť. */
    function blank({ cols = 60, rows = 20, room = false, name = '' } = {}) {
        const def = { v: 1, name, cols, rows, style: 'green', bg: room ? 'blue' : null, frame: room ? 'stone' : null, layers: { back: emptyRows(cols, rows), main: emptyRows(cols, rows), front: emptyRows(cols, rows) }, stamps: [], objects: [] };
        if (!room) def.rooms = [];
        return def;
    }

    /** Doplní chýbajúce časti (napr. po importe) a zjednotí dĺžky riadkov. */
    function normalize(def) {
        def.v = 1;
        def.cols = Math.max(4, def.cols | 0);
        def.rows = Math.max(4, def.rows | 0);
        def.layers = def.layers || {};
        for (const l of LAYERS) {
            const rows = def.layers[l] || [];
            def.layers[l] = Array.from({ length: def.rows }, (_, r) => (rows[r] || '').padEnd(def.cols, ' ').slice(0, def.cols));
        }
        def.stamps = def.stamps || [];
        def.objects = def.objects || [];
        if (def.rooms) def.rooms.forEach(normalize);
        return def;
    }

    window.SJWorld = { TS, TILES, STAMPS, OBJECTS, FRAMES, LAYERS, BG, SHEETS, STYLE_SET, drawRegion, drawFrame, drawPattern, drawStamp, collisions, fromAscii, blank, normalize, emptyRows, ready };
})();
