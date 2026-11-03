/**
 * Super Jožino – levely z dlaždíc (štýl Pixel Adventure).
 *
 * Level sa zapisuje ako textová mapa (pole riadkov, 1 znak = 1 dlaždica
 * 32×32 jednotiek sveta = 16×16 px pixel artu 2×). Terén sa automaticky
 * poskladá – horný okraj má trávu, krajné stĺpce obrys, vnútro je hlina.
 *
 * TERÉN
 *   #  zem (farba podľa štýlu levelu: green / orange / pink)
 *   I  ľad (klzký)
 *   K  sivá kovová kocka      Z  zlatá kocka      =  hnedá kocka
 *   -  tenká drevená plošina (dá sa na ňu vyskočiť zdola)
 * HRÁČ A CIEĽ
 *   P  štart      C  checkpoint      E  cieľ (trofej)
 * ZBIERANIE
 *   o  ovocie
 *   D  modrý diamant (rečové cvičenie)   L  strieborná minca (posluchové cvičenie)
 *   G  zelený drahokam (super skok)      R  červený drahokam (+1 život)
 * BLOKY A PASCE
 *   X  krabica s ovocím     B  rozbitný blok     T  trampolína
 *   F  padajúca plošina     ~  plošina vodorovne  !  plošina zvislo
 *   ^  ostne   S  píla   f  oheň   w  ventilátor (fúka hore)   a  šípka (vystrelí hore)
 * NEPRIATELIA
 *   m hríbik   c sliepka   n slimák   s sliz   b zajac   r reďkovka
 *   p prasiatko   u vtáčik (letí)   e včela (letí)   h nosorožec   t korytnačka
 *
 * Voliteľné parametre pre jednotlivé výskyty: def.params['~'] = [{ range: 4 }, …]
 * (podľa poradia v mape zľava doprava, zhora nadol).
 *
 * Súbor rozširuje triedu Game a pridáva funkciu SJBuildLevel.
 */
(function () {
    const TS = 32;
    const H = TS / 2;

    // 3×3 bloky v sprite-och (ľavý horný roh)
    const TERRAIN_SETS = {
        green: { sheet: 'terrain', x: 96, y: 0 },
        orange: { sheet: 'terrain', x: 96, y: 64 },
        pink: { sheet: 'terrain', x: 96, y: 128 },
        ice: { sheet: 'smi', x: 128, y: 0 },
    };
    const SINGLE = {
        K: { x: 192, y: 80 }, // sivá kocka
        Z: { x: 272, y: 144 }, // zlatá kocka
        '=': { x: 192, y: 16 }, // hnedá kocka
    };
    const SOLID = new Set(['#', 'I', 'K', 'Z', '=']);
    const FRUITS = ['apple', 'strawberry', 'bananas', 'cherries', 'orange', 'kiwi', 'pineapple', 'melon'];

    const sheets = {
        terrain: (() => { const i = new Image(); i.src = 'images/superjozino/pa/terrain/terrain.png'; return i; })(),
        smi: (() => { const i = new Image(); i.src = 'images/superjozino/pa/traps/sand-mud-ice/sand-mud-ice.png'; return i; })(),
    };

    /**
     * Vytvorí level (rovnaký tvar ako Level z levels.js) z textovej mapy.
     * @param {{ map: string[], style?: string, params?: object, name?: string }} def
     */
    window.SJBuildLevel = function (def) {
        const rows = def.map.map((r) => r.replace(/\s+$/, ''));
        const GH = rows.length;
        const GW = Math.max(...rows.map((r) => r.length));
        const grid = rows.map((r) => r.padEnd(GW, ' ').split(''));
        const at = (c, r) => (r < 0 ? ' ' : r >= GH ? '#' : c < 0 || c >= GW ? (grid[r][c < 0 ? 0 : GW - 1] === '#' ? '#' : ' ') : grid[r][c]);

        const platforms = [];
        const coins = [];
        const diamonds = [];
        const checkpoints = [];
        const enemies = [];
        const blocks = [];
        let endPoint = null;
        let spawn = { x: 64, y: 0 };
        const counters = {};
        const param = (ch) => {
            const i = counters[ch] = (counters[ch] ?? -1) + 1;
            return (def.params && def.params[ch] && def.params[ch][i]) || {};
        };
        let fruitIdx = 0;

        // kolízne obdĺžniky: súvislé úseky v riadku
        for (let r = 0; r < GH; r++) {
            let c = 0;
            while (c < GW) {
                const ch = grid[r][c];
                if (SOLID.has(ch)) {
                    const ice = ch === 'I';
                    let e = c;
                    while (e + 1 < GW && SOLID.has(grid[r][e + 1]) && (grid[r][e + 1] === 'I') === ice) e++;
                    platforms.push({ x: c * TS, y: r * TS, width: (e - c + 1) * TS, height: TS, type: 'tile', tile: true, surface: ice ? 'ice' : null });
                    c = e + 1;
                } else if (ch === '-') {
                    let e = c;
                    while (e + 1 < GW && grid[r][e + 1] === '-') e++;
                    platforms.push({ x: c * TS, y: r * TS, width: (e - c + 1) * TS, height: 12, type: 'platform', tile: true });
                    c = e + 1;
                } else c++;
            }
        }

        // objekty
        for (let r = 0; r < GH; r++) {
            for (let c = 0; c < GW; c++) {
                const ch = grid[r][c];
                const x = c * TS;
                const y = r * TS;
                const cx = x + H;
                const cy = y + H;
                const bottom = y + TS;
                switch (ch) {
                    case 'P': spawn = { x: cx - 16, y: bottom - 64 }; break;
                    case 'C': checkpoints.push({ x: cx - 64, y: bottom - 128, width: 128, height: 128, active: false, flagHeight: 30 }); break;
                    case 'E': endPoint = { x: cx - 64, y: bottom - 128, width: 128, height: 128, paEnd: true }; break;
                    case 'o': {
                        const coin = new Coin(cx - 20, cy - 20, 'gold');
                        coin.fruit = FRUITS[Math.floor(fruitIdx++ / 4) % FRUITS.length];
                        coins.push(coin);
                        break;
                    }
                    case 'D': case 'G': case 'R': case 'L': {
                        // drahokamy väčšie ako v pôvodných mapách – dobre viditeľné
                        const type = { D: 'blueDiamond', G: 'greenDiamond', R: 'redDiamond', L: 'silver' }[ch];
                        const gem = new Coin(cx - 28, cy - 28, type);
                        gem.width = 56;
                        gem.height = 56;
                        diamonds.push(gem);
                        break;
                    }
                    case 'X': blocks.push({ type: 'box', x: cx - 28, y: bottom - 48, ...param('X') }); break;
                    case 'B': blocks.push({ type: 'block', x: cx - 22, y: bottom - 44, ...param('B') }); break;
                    case 'T': blocks.push({ type: 'spring', x: cx - 28, y: bottom - 56, ...param('T') }); break;
                    case 'F': blocks.push({ type: 'faller', x: cx - 32, y, ...param('F') }); break;
                    case '~': { const p = param('~'); blocks.push({ type: 'mover', x: cx - 32, y, dxRange: (p.range ?? 3) * TS, speed: p.speed, ...p }); break; }
                    case '!': { const p = param('!'); blocks.push({ type: 'mover', x: cx - 32, y, dyRange: (p.range ?? 3) * TS, speed: p.speed, ...p }); break; }
                    case '^': blocks.push({ type: 'spikes', x, y, ...param('^') }); break;
                    case 'S': { const p = param('S'); blocks.push({ type: 'saw', x: cx - 38, y: cy - 38, range: (p.range ?? 3) * TS, vertical: !!p.vertical, ...p }); break; }
                    case 'f': blocks.push({ type: 'fire', x, y: y - TS, ...param('f') }); break;
                    case 'w': blocks.push({ type: 'fan', x: cx - 24, y: bottom - 16, ...param('w') }); break;
                    case 'a': blocks.push({ type: 'arrow', x: cx - 18, y: cy - 18, ...param('a') }); break;
                    default:
                        if (window.SJMakeEnemy && 'mcnsbrpueht'.includes(ch)) {
                            const en = window.SJMakeEnemy(ch, cx, bottom, param(ch));
                            if (en) enemies.push(en);
                        }
                }
            }
        }

        const L = new Level(GW * TS, platforms, [], enemies, [], [], coins, checkpoints, diamonds,
            endPoint || { x: GW * TS - 200, y: (GH - 4) * TS - 128, width: 128, height: 128, paEnd: true });
        L.blocks = blocks;
        L.height = GH * TS;
        L.spawn = spawn;
        L.belowWorld = 0;
        L.tilemap = { grid, GW, GH, style: def.style || 'green', at };
        L.name = def.name;
        return L;
    };

    // ---------------- vykreslenie terénu ----------------

    /** Dlaždica so samočinnými okrajmi (4 štvrtiny podľa susedov). */
    function drawAuto(ctx, set, img, x, y, up, down, left, right) {
        for (let qy = 0; qy < 2; qy++) {
            for (let qx = 0; qx < 2; qx++) {
                const cr = qy === 0 ? (up ? 1 : 0) : (down ? 1 : 2);
                const cc = qx === 0 ? (left ? 1 : 0) : (right ? 1 : 2);
                ctx.drawImage(img, set.x + cc * 16 + qx * 8, set.y + cr * 16 + qy * 8, 8, 8, x + qx * H, y + qy * H, H, H);
            }
        }
    }

    const CHUNK = 512;

    function renderChunk(L, ci) {
        const tm = L.tilemap;
        const W = Math.min(CHUNK, L.width - ci * CHUNK);
        const cv = document.createElement('canvas');
        cv.width = W;
        cv.height = tm.GH * TS;
        const ctx = cv.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        const c0 = Math.floor((ci * CHUNK) / TS);
        const c1 = Math.ceil((ci * CHUNK + W) / TS);
        const ox = -ci * CHUNK;
        const terrain = TERRAIN_SETS[tm.style] || TERRAIN_SETS.green;
        for (let r = 0; r < tm.GH; r++) {
            for (let c = c0; c < c1; c++) {
                const ch = tm.grid[r][c];
                const x = c * TS + ox;
                const y = r * TS;
                if (ch === '#' || ch === 'I') {
                    const same = (cc, rr) => {
                        const n = tm.at(cc, rr);
                        return ch === '#' ? SOLID.has(n) && n !== 'I' : n === 'I';
                    };
                    const set = ch === 'I' ? TERRAIN_SETS.ice : terrain;
                    drawAuto(ctx, set, sheets[set.sheet], x, y, same(c, r - 1), same(c, r + 1), same(c - 1, r), same(c + 1, r));
                } else if (SINGLE[ch]) {
                    const s = SINGLE[ch];
                    ctx.drawImage(sheets.terrain, s.x, s.y, 16, 16, x, y, TS, TS);
                } else if (ch === '-') {
                    // drevená lišta (zaoblené konce na krajoch úseku)
                    const l = tm.at(c - 1, r) === '-';
                    const rr = tm.at(c + 1, r) === '-';
                    // ľavá polovica dlaždice: koniec lišty alebo stred; pravá rovnako
                    ctx.drawImage(sheets.terrain, l ? 288 : 272, 16, 8, 5, x, y, H, 10);
                    ctx.drawImage(sheets.terrain, rr ? 296 : 312, 16, 8, 5, x + H, y, H, 10);
                }
            }
        }
        return cv;
    }

    const proto = Game.prototype;

    /** Kreslenie terénu dlaždicového levelu (vo svete). */
    proto.drawTilemap = function () {
        const L = this.currentLevelData;
        if (!L.tilemap) return;
        if (!sheets.terrain.complete || !sheets.terrain.naturalWidth || !sheets.smi.complete) return;
        L._chunks = L._chunks || [];
        const first = Math.max(0, Math.floor((this.camera.x - 40) / CHUNK));
        const last = Math.min(Math.ceil(L.width / CHUNK) - 1, Math.floor((this.camera.x + this.viewW + 40) / CHUNK));
        for (let ci = first; ci <= last; ci++) {
            if (!L._chunks[ci]) L._chunks[ci] = renderChunk(L, ci);
            this.ctx.drawImage(L._chunks[ci], ci * CHUNK, 0);
        }
    };
})();
