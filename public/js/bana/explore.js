/**
 * Nová Baňa – preskúmavanie bane (bana.html).
 *
 * Herná logika je z pôvodnej Bane (js/game.js): údery do predmetov, rečové
 * a posluchové cvičenie, hodnotenie, ukladanie postupu, karty. Tento súbor
 * mení len vzhľad a hranie:
 *  - baňa sa vytvorí sama (podľa počtu predmetov v leveli a veku dieťaťa),
 *    rovnaký level = rovnaká baňa
 *  - hra na celú obrazovku, kamera sleduje baníka
 *  - tma: baník vidí len okolo lampy, prebádané miesta ostanú tlmene vidieť
 *  - poklady sú ukryté v hornine (prezradia ich iskry), tvrdé kamene sa
 *    nedajú prekopať, lampy na podperách svietia natrvalo
 *  - mini-mapa a šípka k najbližšiemu pokladu
 *  - ovládanie: smerový kríž + krompáč (aj klávesnica: šípky/WASD + medzerník)
 *
 * Načítava sa po game.js – prepíše jeho funkcie na generovanie a kreslenie.
 */
(function () {
    const B = blockSize; // 50 – súradnice predmetov v game.js sú v násobkoch B
    const OPEN = 0;
    const CLAY = 1;
    const ROCK = 2;

    // ---------------- stav ----------------
    const S = {
        W: 30, H: 20,
        G: [], // mriežka: 0 chodba, 1 hlina, 2 tvrdý kameň
        lamps: [], // [c, r]
        explored: new Set(),
        start: { c: 3, r: 3 },
        vis: { x: 3, y: 3 }, // plynulá poloha baníka (v dlaždiciach)
        moveFrom: null, moveT: 1,
        held: null, lastMove: 0,
        pickHeld: false, lastPick: 0,
        digT: 0, // animácia krompáča
        facing: 'right', // left/right/up/down
        hHorizontal: 'right',
        anim: 0,
        particles: [], floaters: [], flyers: [],
        shake: 0,
        lastCounts: { g: 0, d: 0, k: 0 },
        hits: new Map(), // zatrasenie zasiahnutých predmetov
        mapOpen: false,
        hintShown: {},
        ready: false,
    };
    window.BanaExplore = S;

    // ---------------- obrázky ----------------
    const IMG = (src) => { const i = new Image(); i.src = src; return i; };
    const IM = {
        bg: IMG('images/pozadie.jpg'),
        stone: IMG('images/stone.png'),
        gold: IMG('images/gold.png'),
        dia: IMG('images/diamond.png'),
        kov: IMG('images/kov.png'),
    };

    /** Baník podľa profilu dieťaťa (rovnaké animácie ako v Super Jožinovi). */
    const MINERS = {
        yellow_hat: '__yellow_hat_', green_miner: '__green_miner_', red_head_miner: '__miner_',
        red_shirt_miner: '__red_shirt_miner_', old_miner: '__old_miner_',
    };
    const ANIMS = { idle: 20, walk: 8, walk_forward_facing: 8, walk_backward: 8, use_pickaxe: 7, idle_front_facing: 20, idle_back: 20 };
    const minerFrames = {};
    (function loadMiner() {
        let id = 'yellow_hat';
        try {
            const s = JSON.parse(localStorage.getItem('bj.profiles') || '{}');
            const p = s.profiles && s.profiles[s.activeId];
            if (p && MINERS[p.avatar]) id = p.avatar;
        } catch (e) { /* predvolený baník */ }
        const base = `images/superjozino/assets/player/keyframes/${id}/${MINERS[id]}`;
        for (const [a, n] of Object.entries(ANIMS)) {
            minerFrames[a] = Array.from({ length: n }, (_, i) => IMG(`${base}${a}_${String(i).padStart(3, '0')}.png`));
        }
    })();

    // ---------------- náhoda so semienkom ----------------
    function hash(str) {
        let h = 2166136261;
        for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
        return (h >>> 0) || 1;
    }
    let seed = 1;
    const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) / 4294967296);
    const rint = (a, b) => a + Math.floor(rnd() * (b - a + 1));

    // ---------------- generovanie bane ----------------
    function mineSize() {
        const cfg = currentLevelConfig && currentLevelConfig.gameConfig;
        if (cfg && cfg.mineSize && cfg.mineSize.width) return [cfg.mineSize.width, cfg.mineSize.height];
        const a = window.BJAge ? BJAge.get('bana') : null;
        return (a && a.mine) || [28, 19];
    }

    // dosah lampy (dlaždice) podľa veku – mladší vidia ďalej
    const LIGHT = (window.BJAge && BJAge.get('bana').light) || 4.4;

    const key = (c, r) => c + ',' + r;
    const inside = (c, r) => c >= 0 && r >= 0 && c < S.W && r < S.H;

    function buildMine() {
        const id = (currentLevelConfig && currentLevelConfig.id) || new URLSearchParams(location.search).get('config') || 'trening';
        seed = hash('bana:' + id);
        [S.W, S.H] = mineSize();
        const { W, H } = S;
        S.G = Array.from({ length: H }, (_, r) => Array.from({ length: W }, (_, c) => (c === 0 || r === 0 || c === W - 1 || r === H - 1 ? ROCK : CLAY)));
        const G = S.G;
        // štart: vchod do bane s lampou
        S.start = { c: 3, r: 3 };
        for (let r = 2; r <= 3; r++) for (let c = 2; c <= 5; c++) G[r][c] = OPEN;
        S.lamps = [[2, 2]];
        // prirodzené jaskyne (niektoré so starou lampou)
        const caves = 3 + Math.floor((W * H) / 220);
        for (let i = 0; i < caves; i++) {
            const cc = rint(4, W - 5);
            const cr = rint(4, H - 5);
            if (Math.hypot(cc - S.start.c, cr - S.start.r) < 7) continue;
            const rw = rint(1, 2);
            const rh = rint(1, 2);
            for (let r = cr - rh; r <= cr + rh; r++) for (let c = cc - rw; c <= cc + rw; c++) {
                if (inside(c, r) && G[r][c] !== ROCK && (Math.abs(c - cc) < rw || Math.abs(r - cr) < rh || rnd() < 0.5)) G[r][c] = OPEN;
            }
            if (rnd() < 0.5) S.lamps.push([cc, cr]);
        }
        // tvrdé kamene (zhluky)
        const rocks = Math.floor(W * H * 0.05);
        let placed = 0;
        for (let tries = 0; placed < rocks && tries < rocks * 6; tries++) {
            let c = rint(2, W - 3);
            let r = rint(2, H - 3);
            const len = rint(2, 5);
            for (let k = 0; k < len; k++) {
                if (G[r][c] === CLAY && Math.hypot(c - S.start.c, r - S.start.r) > 3) { G[r][c] = ROCK; placed++; }
                if (rnd() < 0.5) c += rnd() < 0.5 ? 1 : -1; else r += rnd() < 0.5 ? 1 : -1;
                c = Math.max(1, Math.min(W - 2, c));
                r = Math.max(1, Math.min(H - 2, r));
            }
        }
        // poklady: ďaleko od štartu a od seba; ďalej = vzácnejšie
        const total = PocetGenGolds + PocetGenDiamant + PocetGenKov;
        const spots = [];
        for (let minGap = 4; minGap >= 1 && spots.length < total; minGap--) {
            for (let tries = 0; tries < 4000 && spots.length < total; tries++) {
                const c = rint(2, W - 3);
                const r = rint(2, H - 3);
                if (G[r][c] !== CLAY) continue;
                if (Math.hypot(c - S.start.c, r - S.start.r) < 5) continue;
                if (spots.some(([a, b]) => Math.abs(a - c) + Math.abs(b - r) < minGap)) continue;
                spots.push([c, r]);
            }
        }
        spots.sort((a, b) => Math.hypot(a[0] - 3, a[1] - 3) - Math.hypot(b[0] - 3, b[1] - 3));
        const golds_ = spots.slice(0, PocetGenGolds);
        const rest = spots.slice(PocetGenGolds);
        const kov_ = rest.slice(rest.length - PocetGenKov);
        const dia_ = rest.slice(0, rest.length - PocetGenKov);
        // každý poklad musí byť dosiahnuteľný (tvrdé kamene sa nedajú prekopať)
        ensureReachable(spots);
        diamonds.length = 0;
        kov.length = 0;
        golds.length = 0;
        generatedPositions = [];
        for (const [c, r] of dia_) { const p = { x: c * B, y: r * B }; diamonds.push(p); generatedPositions.push(p); }
        for (const [c, r] of kov_) { const p = { x: c * B, y: r * B }; kov.push(p); generatedPositions.push(p); }
        for (const [c, r] of golds_) { const p = { x: c * B, y: r * B }; golds.push(p); generatedPositions.push(p); }

        playerX = S.start.c * B;
        playerY = S.start.r * B;
        S.vis = { x: S.start.c, y: S.start.r };
        S.moveFrom = null;
        S.explored = new Set();
        explore(S.start.c, S.start.r);
        S.lastCounts = { g: 0, d: 0, k: 0 };
        S.ready = true;
        S.hintShown = {};
        setTimeout(() => toast('Hľadaj poklady! Kopaj krompáčom.'), 900);
    }

    function ensureReachable(spots) {
        const G = S.G;
        for (let guard = 0; guard < 400; guard++) {
            const seen = new Set([key(S.start.c, S.start.r)]);
            const q = [[S.start.c, S.start.r]];
            while (q.length) {
                const [c, r] = q.shift();
                for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                    const nc = c + dc;
                    const nr = r + dr;
                    if (!inside(nc, nr) || G[nr][nc] === ROCK || seen.has(key(nc, nr))) continue;
                    seen.add(key(nc, nr));
                    q.push([nc, nr]);
                }
            }
            const bad = spots.find(([c, r]) => !seen.has(key(c, r)));
            if (!bad) return;
            // odstráň najbližší tvrdý kameň pri nedosiahnuteľnom poklade
            let best = null;
            for (let r = 1; r < S.H - 1; r++) for (let c = 1; c < S.W - 1; c++) {
                if (G[r][c] !== ROCK) continue;
                const d = Math.abs(c - bad[0]) + Math.abs(r - bad[1]);
                if (!best || d < best[2]) best = [c, r, d];
            }
            if (!best) return;
            G[best[1]][best[0]] = CLAY;
        }
    }

    function explore(c, r) {
        for (let dr = -3; dr <= 3; dr++) for (let dc = -3; dc <= 3; dc++) {
            if (dc * dc + dr * dr <= 11 && inside(c + dc, r + dr)) S.explored.add(key(c + dc, r + dr));
        }
    }

    // ---------------- prepísanie funkcií z game.js ----------------
    // generovanie: celú baňu vytvorí generateDiamonds (volá sa prvá v resetGame)
    generateDiamonds = function () { buildMine(); initializeDiamonds(PocetGenDiamant); };
    generateKov = function () { initializeKov(PocetGenKov); };
    generateGolds = function () { initializeGolds(PocetGenGolds); };
    generateClay = function () {
        clay.length = 0;
        const items = new Set([...diamonds, ...kov, ...golds].map((p) => key(p.x / B, p.y / B)));
        for (let r = 0; r < S.H; r++) for (let c = 0; c < S.W; c++) {
            if (S.G[r][c] === CLAY && !items.has(key(c, r))) clay.push({ x: c * B, y: r * B });
        }
    };
    // kreslenie robí tento súbor (vlastná slučka)
    drawPlayer = function () {};
    drawClay = function () {};
    drawDiamonds = function () {};
    drawKov = function () {};
    drawGolds = function () {};
    gameLoop = function () {};

    function itemAt(c, r) {
        const x = c * B;
        const y = r * B;
        for (const [list, type] of [[golds, 'gold'], [diamonds, 'dia'], [kov, 'kov']]) {
            for (const it of list) if (it.x === x && it.y === y && !it.destroyed) return { it, type };
        }
        return null;
    }
    const revealed = (c, r) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dc, dr]) => inside(c + dc, r + dr) && S.G[r + dr][c + dc] === OPEN);

    function blocked() {
        if (isExerciseActive || S.mapOpen) return true;
        for (const id of ['endgame', 'dialogove-okno', 'cvicenie', 'zvuky']) {
            const el = document.getElementById(id);
            if (el && el.style.display && el.style.display !== 'none') return true;
        }
        return false;
    }

    const DIRS = { up: [0, -1, 0], down: [0, 1, 180], left: [-1, 0, 270], right: [1, 0, 90] };

    /** Krok baníka; do horniny sa len otočí (kope sa krompáčom). */
    function tryMove(dir) {
        const [dc, dr, rot] = DIRS[dir];
        playerRotation = rot;
        S.facing = dir;
        if (dir === 'left' || dir === 'right') S.hHorizontal = dir;
        playerDirection = dir === 'left' ? 'vlavo' : dir === 'right' ? 'vpravo' : 'front';
        const c = playerX / B;
        const r = playerY / B;
        const nc = c + dc;
        const nr = r + dr;
        if (!inside(nc, nr) || S.G[nr][nc] !== OPEN || itemAt(nc, nr)) {
            if (inside(nc, nr) && S.G[nr][nc] === CLAY && !S.hintShown.dig) {
                S.hintShown.dig = true;
                toast('Ťukni na krompáč a kopaj!');
            }
            return false;
        }
        S.moveFrom = { x: c, y: r };
        S.moveT = 0;
        playerX = nc * B;
        playerY = nr * B;
        explore(nc, nr);
        return true;
    }
    movePlayer = function (direction) { if (!blocked()) tryMove(direction); };

    // kopanie: tvrdý kameň sa nedá, hlina zmizne, poklad sa zatrasie
    const origDestroy = destroyBlock;
    destroyBlock = function () {
        if (blocked()) return;
        const [dc, dr] = DIRS[{ 0: 'up', 90: 'right', 180: 'down', 270: 'left' }[playerRotation] || 'right'];
        const tc = playerX / B + dc;
        const tr = playerY / B + dr;
        if (!inside(tc, tr)) return;
        S.digT = 1;
        if (S.G[tr][tc] === ROCK) {
            burst(tc + 0.5, tr + 0.5, ['#cfd8dc', '#90a4ae'], 6, 0.06);
            if (!S.hintShown.rock) { S.hintShown.rock = true; toast('Tvrdý kameň – obíď ho!'); }
            try { effectZle.play(); } catch (e) { /* bez zvuku */ }
            return;
        }
        const item = itemAt(tc, tr);
        const before = clay.length;
        origDestroy();
        if (clay.length < before) {
            S.G[tr][tc] = OPEN;
            burst(tc + 0.5, tr + 0.5, ['#8d5a32', '#6b4226', '#a87444'], 12, 0.09, true);
            S.shake = 3;
        } else if (item) {
            S.hits.set(key(tc, tr), 12);
            const col = item.type === 'gold' ? ['#ffe066', '#fff3b0'] : item.type === 'dia' ? ['#7fd6ff', '#e0f7ff'] : ['#d7a8ff', '#f3e5ff'];
            burst(tc + 0.5, tr + 0.5, col, 8, 0.07);
        }
        S.lastTarget = { c: tc, r: tr };
    };
    animateDigging = function () {
        if (blocked()) return;
        S.digT = 1;
        try { effectkopanie.play(); } catch (e) { /* bez zvuku */ }
    };

    // ---------------- efekty ----------------
    function burst(x, y, colors, n, sp, chunks) {
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2;
            const v = sp * (0.4 + Math.random());
            S.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (chunks ? 0.05 : 0), g: chunks ? 0.006 : 0.002, life: 30 + Math.random() * 20, max: 50, size: chunks ? 0.12 + Math.random() * 0.1 : 0.07, color: colors[i % colors.length], square: !!chunks });
        }
    }
    function floatText(x, y, text, color = '#FFD900') { S.floaters.push({ x, y, text, color, life: 50 }); }
    function flyToHud(x, y, id, img) {
        const el = document.getElementById(id);
        if (el) S.flyers.push({ x, y, el, img, t: 0 });
    }
    let toastT = null;
    function toast(text) {
        const el = document.getElementById('bxToast');
        if (!el) return;
        el.textContent = text;
        el.classList.add('is-visible');
        clearTimeout(toastT);
        toastT = setTimeout(() => el.classList.remove('is-visible'), 2600);
        try { window.BJ && window.BJ.say(text); } catch (e) { /* bez hlasu */ }
    }

    /** Zber pokladu (počty mení game.js) → efekt na mieste posledného úderu. */
    function watchCollected() {
        const t = S.lastTarget || { c: playerX / B, r: playerY / B };
        const fx = (n, type, chip, img) => {
            if (n <= 0) return;
            const col = type === 'gold' ? ['#ffe066', '#fff'] : type === 'dia' ? ['#7fd6ff', '#fff'] : ['#d7a8ff', '#fff'];
            burst(t.c + 0.5, t.r + 0.5, col, 22, 0.1);
            floatText(t.c + 0.5, t.r, '+1');
            flyToHud(t.c + 0.5, t.r + 0.5, chip, img);
        };
        if (goldsCollected > S.lastCounts.g) fx(goldsCollected - S.lastCounts.g, 'gold', 'bxGold', IM.gold);
        if (diamondsCollected > S.lastCounts.d) fx(diamondsCollected - S.lastCounts.d, 'dia', 'bxDia', IM.dia);
        if (kovCollected > S.lastCounts.k) fx(kovCollected - S.lastCounts.k, 'kov', 'bxKov', IM.kov);
        S.lastCounts = { g: goldsCollected, d: diamondsCollected, k: kovCollected };
        // vyzbieraný poklad = voľné miesto (dá sa cezeň prejsť)
        for (const list of [golds, diamonds, kov]) {
            for (const it of list) {
                if (it.destroyed && !it._open) {
                    it._open = true;
                    S.G[it.y / B][it.x / B] = OPEN;
                }
            }
        }
    }

    // ---------------- vykreslenie ----------------
    let T = 60; // veľkosť dlaždice na plátne (px)
    let cw = 0;
    let ch = 0;
    let dpr = 1;
    const clayTiles = [];
    let clayTileSize = 0;

    function fit() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        cw = Math.round((window.innerWidth || 900) * dpr);
        ch = Math.round((window.innerHeight || 500) * dpr);
        if (canvas.width !== cw) canvas.width = cw;
        if (canvas.height !== ch) canvas.height = ch;
        const phone = document.documentElement.classList.contains('bj-compact');
        T = Math.round(ch / (phone ? 8.2 : 10));
    }

    /** Pripravené dlaždice horniny (výrezy z textúry), aby sa nekreslili stále znova. */
    function clayTile(i) {
        if (clayTileSize !== T || !clayTiles.length) {
            if (!IM.bg.complete || !IM.bg.naturalWidth) return null;
            clayTiles.length = 0;
            clayTileSize = T;
            for (let k = 0; k < 6; k++) {
                const cv = document.createElement('canvas');
                cv.width = T;
                cv.height = T;
                const x = cv.getContext('2d');
                const src = IM.bg.naturalWidth / 4.5;
                x.drawImage(IM.bg, (k % 3) * src * 1.3, Math.floor(k / 3) * src * 1.7, src, src, 0, 0, T, T);
                x.fillStyle = 'rgba(255,190,130,0.14)';
                x.fillRect(0, 0, T, T);
                clayTiles.push(cv);
            }
        }
        return clayTiles[i % clayTiles.length];
    }

    function camera() {
        const vw = cw / T;
        const vh = ch / T;
        let x = S.vis.x + 0.5 - vw / 2;
        let y = S.vis.y + 0.5 - vh * 0.52;
        x = S.W <= vw ? (S.W - vw) / 2 : Math.max(0, Math.min(S.W - vw, x));
        y = S.H <= vh ? (S.H - vh) / 2 : Math.max(-0.6, Math.min(S.H - vh + 0.6, y));
        return [x, y, vw, vh];
    }

    const darkCv = document.createElement('canvas');

    function render(now) {
        const [camX, camY, vw, vh] = camera();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#0b0710';
        ctx.fillRect(0, 0, cw, ch);
        const sh = S.shake > 0 ? (Math.random() - 0.5) * S.shake * dpr : 0;
        ctx.setTransform(T, 0, 0, T, Math.round(-camX * T + sh), Math.round(-camY * T + sh));
        const c0 = Math.max(0, Math.floor(camX) - 1);
        const r0 = Math.max(0, Math.floor(camY) - 1);
        const c1 = Math.min(S.W, Math.ceil(camX + vw) + 1);
        const r1 = Math.min(S.H, Math.ceil(camY + vh) + 1);
        const G = S.G;
        const open = (c, r) => inside(c, r) && G[r][c] === OPEN;
        const px = 1 / T;

        for (let r = r0; r < r1; r++) for (let c = c0; c < c1; c++) {
            const v = G[r][c];
            if (v === OPEN) {
                ctx.fillStyle = (c + r) % 2 ? '#26170e' : '#2a1a10';
                ctx.fillRect(c, r, 1, 1);
                ctx.fillStyle = 'rgba(130,90,55,0.35)';
                ctx.fillRect(c + ((c * 7) % 10) / 14, r + ((r * 11) % 10) / 14, 0.08, 0.06);
                ctx.fillRect(c + ((c * 13) % 9) / 12 + 0.1, r + ((r * 5) % 8) / 11 + 0.25, 0.06, 0.06);
                continue;
            }
            const tile = clayTile((c * 7 + r * 13) % 6);
            if (tile) ctx.drawImage(tile, c, r, 1 + px, 1 + px);
            else { ctx.fillStyle = '#6b4226'; ctx.fillRect(c, r, 1, 1); }
            if (v === ROCK) {
                ctx.fillStyle = 'rgba(20,14,24,0.45)';
                ctx.fillRect(c, r, 1, 1);
                if (IM.stone.complete) ctx.drawImage(IM.stone, c + 0.04, r + 0.04, 0.92, 0.92);
            }
            // reliéf: pod hornou je chodba = hrana steny; nad ňou svetlá hrana
            if (open(c, r + 1)) {
                ctx.fillStyle = '#5a3418';
                ctx.fillRect(c, r + 0.78, 1, 0.22);
                ctx.fillStyle = '#3a210f';
                ctx.fillRect(c, r + 0.92, 1, 0.08);
            }
            if (open(c, r - 1)) { ctx.fillStyle = 'rgba(255,220,170,0.35)'; ctx.fillRect(c, r, 1, 0.07); }
            if (open(c - 1, r)) { ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(c, r, 0.08, 1); }
            if (open(c + 1, r)) { ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(c + 0.92, r, 0.08, 1); }
        }

        // poklady: odkryté = vidieť v stene, ukryté = iskry
        for (const [list, type, img] of [[golds, 'gold', IM.gold], [diamonds, 'dia', IM.dia], [kov, 'kov', IM.kov]]) {
            for (const it of list) {
                if (it.destroyed) continue;
                const c = it.x / B;
                const r = it.y / B;
                if (c < c0 || c >= c1 || r < r0 || r >= r1) continue;
                const k = key(c, r);
                const hit = S.hits.get(k) || 0;
                const sx = hit ? Math.sin(hit * 2.2) * 0.05 : 0;
                if (revealed(c, r)) {
                    ctx.fillStyle = 'rgba(0,0,0,0.25)';
                    ctx.fillRect(c, r, 1, 1);
                    if (img.complete) ctx.drawImage(img, c + 0.08 + sx, r + 0.08, 0.84, 0.84);
                } else if (Math.hypot(c - S.vis.x, r - S.vis.y) < 6.5) {
                    const col = type === 'gold' ? '#ffe066' : type === 'dia' ? '#9be3ff' : '#e1b8ff';
                    for (let n = 0; n < 3; n++) {
                        const tw = (Math.sin(now / 260 + n * 2 + c) + 1) / 2;
                        const z = (n === 0 ? 0.13 : 0.08) * (0.6 + tw * 0.6);
                        const a = n * 2.1 + c;
                        star(c + 0.5 + Math.cos(a) * 0.24, r + 0.5 + Math.sin(a) * 0.2, z, col);
                    }
                }
            }
        }
        S.hits.forEach((v, k) => { if (v <= 1) S.hits.delete(k); else S.hits.set(k, v - 1); });

        // lampy na podperách
        for (const [c, r] of S.lamps) {
            if (c < c0 || c >= c1 || r < r0 || r >= r1) continue;
            ctx.fillStyle = '#7a4a22';
            ctx.fillRect(c + 0.08, r, 0.12, 1);
            ctx.fillRect(c + 0.8, r, 0.12, 1);
            ctx.fillRect(c + 0.04, r + 0.04, 0.92, 0.14);
            ctx.fillStyle = '#3a2210';
            ctx.fillRect(c + 0.44, r + 0.18, 0.12, 0.12);
            const fl = 0.85 + Math.sin(now / 120 + c) * 0.08;
            ctx.fillStyle = `rgba(255, 210, 80, ${fl})`;
            ctx.beginPath();
            ctx.arc(c + 0.5, r + 0.4, 0.12, 0, Math.PI * 2);
            ctx.fill();
        }

        drawMiner(now);
        drawParticles();

        // tma (malé plátno 1 px = 1 dlaždica, zväčšené s vyhladením)
        if (darkCv.width !== S.W) { darkCv.width = S.W; darkCv.height = S.H; }
        const dx = darkCv.getContext('2d');
        const img = dx.createImageData(S.W, S.H);
        const lx = S.vis.x + 0.5;
        const ly = S.vis.y + 0.4;
        for (let r = 0; r < S.H; r++) for (let c = 0; c < S.W; c++) {
            let a = S.explored.has(key(c, r)) ? 0.7 : 0.985;
            let light = Math.max(0, 1 - Math.hypot(c + 0.5 - lx, r + 0.5 - ly) / LIGHT);
            for (const [lc, lr] of S.lamps) light = Math.max(light, 0.9 * Math.max(0, 1 - Math.hypot(c - lc, r - lr) / 3));
            a *= 1 - light;
            const i = (r * S.W + c) * 4;
            img.data[i] = 8; img.data[i + 1] = 5; img.data[i + 2] = 12;
            img.data[i + 3] = Math.round(a * 255);
        }
        dx.putImageData(img, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(darkCv, 0, 0, S.W, S.H);
        // iskry ukrytých pokladov blízko baníka prenikajú tmou
        for (const [list, type] of [[golds, 'gold'], [diamonds, 'dia'], [kov, 'kov']]) {
            for (const it of list) {
                if (it.destroyed) continue;
                const c = it.x / B;
                const r = it.y / B;
                if (revealed(c, r) || Math.hypot(c - S.vis.x, r - S.vis.y) > 6.5) continue;
                const rgb = type === 'gold' ? '255,224,102' : type === 'dia' ? '155,227,255' : '225,184,255';
                const g = ctx.createRadialGradient(c + 0.5, r + 0.5, 0.02, c + 0.5, r + 0.5, 0.42);
                g.addColorStop(0, `rgba(${rgb},${0.55 + Math.sin(now / 300 + c) * 0.2})`);
                g.addColorStop(1, `rgba(${rgb},0)`);
                ctx.fillStyle = g;
                ctx.fillRect(c, r, 1, 1);
            }
        }
        // teplé svetlo lampy baníka
        const g = ctx.createRadialGradient(lx, ly, 0.2, lx, ly, 4.2);
        g.addColorStop(0, 'rgba(255,200,90,0.2)');
        g.addColorStop(1, 'rgba(255,200,90,0)');
        ctx.fillStyle = g;
        ctx.fillRect(lx - 4.2, ly - 4.2, 8.4, 8.4);
        drawFloaters();

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        drawFlyers(camX, camY);
    }

    function star(x, y, z, col) {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(x, y - z);
        ctx.lineTo(x + z * 0.3, y - z * 0.3);
        ctx.lineTo(x + z, y);
        ctx.lineTo(x + z * 0.3, y + z * 0.3);
        ctx.lineTo(x, y + z);
        ctx.lineTo(x - z * 0.3, y + z * 0.3);
        ctx.lineTo(x - z, y);
        ctx.lineTo(x - z * 0.3, y - z * 0.3);
        ctx.fill();
    }

    function drawMiner(now) {
        let anim;
        let flip = S.hHorizontal === 'left';
        const moving = S.moveT < 1;
        if (S.digT > 0) anim = 'use_pickaxe';
        else if (moving) anim = S.facing === 'up' ? 'walk_backward' : S.facing === 'down' ? 'walk_forward_facing' : 'walk';
        else anim = S.facing === 'up' ? 'idle_back' : S.facing === 'down' ? 'idle_front_facing' : 'idle';
        if (S.digT > 0 && (S.facing === 'left' || S.facing === 'right')) flip = S.facing === 'left';
        if (anim !== 'walk' && anim !== 'idle' && anim !== 'use_pickaxe') flip = false;
        const frames = minerFrames[anim];
        let f;
        if (anim === 'use_pickaxe') f = Math.min(frames.length - 1, Math.floor((1 - S.digT) * frames.length));
        else f = Math.floor(now / (anim.startsWith('idle') ? 70 : 55)) % frames.length;
        const im = frames[f];
        if (!im || !im.complete || !im.naturalWidth) return;
        const h = 1.85; // sprite má okolo postavy priehľadný okraj
        const w = h * (im.naturalWidth / im.naturalHeight);
        const cx = S.vis.x + 0.5;
        const bottom = S.vis.y + 1.02;
        ctx.save();
        // tieň pod nohami
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(cx, bottom - 0.06, 0.32, 0.09, 0, 0, Math.PI * 2);
        ctx.fill();
        if (flip) {
            ctx.translate(cx, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(im, -w / 2, bottom - h, w, h);
        } else {
            ctx.drawImage(im, cx - w / 2, bottom - h, w, h);
        }
        ctx.restore();
    }

    function drawParticles() {
        for (const p of S.particles) {
            ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 25));
            ctx.fillStyle = p.color;
            if (p.square) ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
        }
        ctx.globalAlpha = 1;
    }

    function drawFloaters() {
        ctx.save();
        ctx.font = '0.45px "Luckiest Guy", sans-serif';
        ctx.textAlign = 'center';
        ctx.lineJoin = 'round';
        for (const f of S.floaters) {
            ctx.globalAlpha = Math.min(1, f.life / 20);
            ctx.lineWidth = 0.09;
            ctx.strokeStyle = '#000';
            ctx.strokeText(f.text, f.x, f.y);
            ctx.fillStyle = f.color;
            ctx.fillText(f.text, f.x, f.y);
        }
        ctx.restore();
    }

    function drawFlyers(camX, camY) {
        const cr = canvas.getBoundingClientRect();
        if (!cr.width) return;
        const k = cw / cr.width;
        for (const f of S.flyers) {
            const r = f.el.getBoundingClientRect();
            const tx = (r.left - cr.left + 10) * k;
            const ty = (r.top - cr.top + r.height / 2) * k;
            const sx = (f.x - camX) * T;
            const sy = (f.y - camY) * T;
            const t = f.t;
            const e = t * t * (3 - 2 * t);
            const x = sx + (tx - sx) * e;
            const y = sy + (ty - sy) * e - Math.sin(t * Math.PI) * T * 1.5;
            const size = T * (0.9 - 0.4 * t);
            if (f.img.complete) ctx.drawImage(f.img, x - size / 2, y - size / 2, size, size);
        }
    }

    // ---------------- HUD, mini-mapa, šípka ----------------
    const $ = (id) => document.getElementById(id);
    let hudCache = '';
    function updateHud() {
        const s = `${goldsCollected}/${PocetGenGolds}|${diamondsCollected}/${PocetGenDiamant}|${kovCollected}/${PocetGenKov}`;
        if (s !== hudCache) {
            hudCache = s;
            const [g, d, k] = s.split('|');
            $('bxGold').textContent = g;
            $('bxDia').textContent = d;
            $('bxKov').textContent = k;
        }
        // čas len pri leveloch s časovým limitom (predvolene vypnutý)
        const ageTimer = !window.BJAge || BJAge.get('bana').timeLimit;
        const limit = ageTimer && currentLevelConfig && (currentLevelConfig.timeLimit || (currentLevelConfig.gameConfig && currentLevelConfig.gameConfig.timeLimit));
        const chip = $('bxTimeChip');
        if (chip) {
            chip.hidden = !limit;
            if (limit) {
                const t = $('game-timer');
                if (t && $('bxTime').textContent !== t.textContent) $('bxTime').textContent = t.textContent;
            }
        }
    }

    function drawMap(cv, cell, withItems) {
        cv.width = S.W * cell;
        cv.height = S.H * cell;
        const m = cv.getContext('2d');
        m.fillStyle = '#140d09';
        m.fillRect(0, 0, cv.width, cv.height);
        for (let r = 0; r < S.H; r++) for (let c = 0; c < S.W; c++) {
            if (!S.explored.has(key(c, r))) continue;
            const v = S.G[r][c];
            m.fillStyle = v === OPEN ? '#c08a52' : v === ROCK ? '#777' : '#5b3a22';
            m.fillRect(c * cell, r * cell, cell, cell);
        }
        if (withItems) {
            for (const [list, col] of [[golds, '#ffe066'], [diamonds, '#7fd6ff'], [kov, '#d7a8ff']]) {
                for (const it of list) {
                    const c = it.x / B;
                    const r = it.y / B;
                    if (it.destroyed || !S.explored.has(key(c, r))) continue;
                    m.fillStyle = col;
                    m.fillRect(c * cell + cell * 0.15, r * cell + cell * 0.15, cell * 0.7, cell * 0.7);
                }
            }
        }
        for (const [c, r] of S.lamps) {
            if (!S.explored.has(key(c, r))) continue;
            m.fillStyle = '#ff9800';
            m.fillRect(c * cell + cell * 0.25, r * cell + cell * 0.25, cell * 0.5, cell * 0.5);
        }
        m.fillStyle = '#FFD900';
        m.strokeStyle = '#000';
        m.lineWidth = Math.max(1, cell * 0.25);
        m.beginPath();
        m.arc((S.vis.x + 0.5) * cell, (S.vis.y + 0.5) * cell, cell * 0.9, 0, Math.PI * 2);
        m.fill();
        m.stroke();
    }

    let miniT = 0;
    function updateMini(now) {
        if (now - miniT < 250) return;
        miniT = now;
        const cv = $('bxMini');
        if (cv) drawMap(cv, 4, true);
    }

    function nearestItem() {
        let best = null;
        for (const [list, type] of [[golds, 'gold'], [diamonds, 'dia'], [kov, 'kov']]) {
            for (const it of list) {
                if (it.destroyed) continue;
                const d = Math.hypot(it.x / B - S.vis.x, it.y / B - S.vis.y);
                if (!best || d < best.d) best = { it, type, d };
            }
        }
        return best;
    }

    function updateCompass(camX, camY) {
        const el = $('bxCompass');
        if (!el) return;
        const n = nearestItem();
        if (!n || n.d < 4.5) { el.classList.remove('is-on'); return; }
        const ang = Math.atan2(n.it.y / B - S.vis.y, n.it.x / B - S.vis.x);
        el.className = 'bx-compass is-on bx-compass--' + n.type;
        // pri okraji obrazovky v smere pokladu
        const cr = canvas.getBoundingClientRect();
        const mx = cr.width / 2;
        const my = cr.height * 0.52;
        const rx = cr.width * 0.38;
        const ry = cr.height * 0.32;
        el.style.left = `${mx + Math.cos(ang) * rx}px`;
        el.style.top = `${my + Math.sin(ang) * ry}px`;
        el.style.transform = `translate(-50%, -50%) rotate(${ang}rad)`;
    }

    // ---------------- herná slučka ----------------
    let last = 0;
    function loop(now) {
        requestAnimationFrame(loop);
        if (!S.ready) return;
        const dt = Math.min(50, now - (last || now));
        last = now;
        // pohyb
        if (S.moveT < 1) {
            S.moveT = Math.min(1, S.moveT + dt / 150);
            const e = S.moveT;
            S.vis.x = S.moveFrom.x + (playerX / B - S.moveFrom.x) * e;
            S.vis.y = S.moveFrom.y + (playerY / B - S.moveFrom.y) * e;
        } else {
            S.vis.x = playerX / B;
            S.vis.y = playerY / B;
            const dir = S.held || keyDir();
            if (dir && !blocked() && now - S.lastMove > 60) {
                if (tryMove(dir)) S.lastMove = now;
                else if (S.facing !== dir) S.lastMove = now;
            }
        }
        if (S.pickHeld && !blocked() && now - S.lastPick > 320) {
            S.lastPick = now;
            destroyBlock();
            animateDigging();
        }
        if (S.digT > 0) S.digT = Math.max(0, S.digT - dt / 300);
        if (S.shake > 0) S.shake = Math.max(0, S.shake - dt / 40);
        for (const p of S.particles) { p.x += p.vx; p.y += p.vy; p.vy += p.g; p.life--; }
        S.particles = S.particles.filter((p) => p.life > 0);
        for (const f of S.floaters) { f.y -= 0.02; f.life--; }
        S.floaters = S.floaters.filter((f) => f.life > 0);
        for (const f of S.flyers) {
            f.t += dt / 650;
            if (f.t >= 1 && !f.done) {
                f.done = true;
                const chipEl = f.el.closest('.bx-chip');
                if (chipEl) { chipEl.classList.remove('is-bump'); void chipEl.offsetWidth; chipEl.classList.add('is-bump'); }
            }
        }
        S.flyers = S.flyers.filter((f) => f.t < 1);
        watchCollected();
        render(now);
        updateHud();
        updateMini(now);
        const [camX, camY] = camera();
        updateCompass(camX, camY);
    }

    // ---------------- ovládanie ----------------
    const keys = new Set();
    const KEYDIR = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };
    let keyOrder = [];
    function keyDir() {
        for (let i = keyOrder.length - 1; i >= 0; i--) if (keys.has(keyOrder[i])) return KEYDIR[keyOrder[i]];
        return null;
    }
    // zachytenie skôr ako pôvodné ovládanie v game.js (to počíta s mapou 16×16)
    window.addEventListener('keydown', (e) => {
        if (e.target && e.target.closest && e.target.closest('input, textarea')) return;
        if (KEYDIR[e.code]) {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (!keys.has(e.code)) { keys.add(e.code); keyOrder.push(e.code); }
        } else if (e.code === 'Space') {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (!e.repeat) { destroyBlock(); animateDigging(); }
        } else if (e.code === 'KeyM') {
            toggleMap();
        }
    }, true);
    window.addEventListener('keyup', (e) => {
        if (KEYDIR[e.code]) {
            keys.delete(e.code);
            keyOrder = keyOrder.filter((k) => k !== e.code);
            e.stopImmediatePropagation();
        }
    }, true);
    window.addEventListener('blur', () => { keys.clear(); keyOrder = []; S.held = null; S.pickHeld = false; });

    function toggleMap(force) {
        const el = $('bxMap');
        if (!el) return;
        S.mapOpen = force !== undefined ? force : !S.mapOpen;
        el.hidden = !S.mapOpen;
        if (S.mapOpen) {
            const cv = $('bxMapCanvas');
            const cell = Math.max(6, Math.floor(Math.min(900 / S.W, 520 / S.H)));
            drawMap(cv, cell, true);
        }
    }

    function initControls() {
        document.querySelectorAll('.bx-arrow').forEach((b) => {
            const dir = b.dataset.dir;
            const down = (e) => {
                e.preventDefault();
                try { b.setPointerCapture(e.pointerId); } catch (err) { /* nič */ }
                S.held = dir;
                b.classList.add('is-active');
            };
            const up = () => {
                if (S.held === dir) S.held = null;
                b.classList.remove('is-active');
            };
            b.addEventListener('pointerdown', down);
            b.addEventListener('pointerup', up);
            b.addEventListener('pointercancel', up);
            b.addEventListener('lostpointercapture', up);
            b.addEventListener('contextmenu', (e) => e.preventDefault());
        });
        const pick = $('bxPick');
        if (pick) {
            pick.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                try { pick.setPointerCapture(e.pointerId); } catch (err) { /* nič */ }
                S.pickHeld = true;
                S.lastPick = performance.now();
                pick.classList.add('is-active');
                destroyBlock();
                animateDigging();
            });
            const up = () => { S.pickHeld = false; pick.classList.remove('is-active'); };
            pick.addEventListener('pointerup', up);
            pick.addEventListener('pointercancel', up);
            pick.addEventListener('lostpointercapture', up);
            pick.addEventListener('contextmenu', (e) => e.preventDefault());
        }
        const mini = $('bxMiniBtn');
        if (mini) mini.addEventListener('click', () => toggleMap(true));
        const close = $('bxMapClose');
        if (close) close.addEventListener('click', () => toggleMap(false));
        const map = $('bxMap');
        if (map) map.addEventListener('click', (e) => { if (e.target === map) toggleMap(false); });
    }

    fit();
    window.addEventListener('resize', fit);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
    document.addEventListener('DOMContentLoaded', initControls);
    requestAnimationFrame(loop);
})();
