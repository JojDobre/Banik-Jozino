/**
 * Super Jožino – stavba levelu z formátu sj-world.js, miestnosti a portály.
 *
 *  - SJBuildDef(def)    level vo formáte JSON (builder) → objekt Level pre hru
 *  - SJBuildLevel(def)  textová mapa (sj-levels.js) → Level (cez SJWorld.fromAscii)
 *  - teleportačné miestnosti: portál „O“ s parametrom to = id miestnosti;
 *    portál v miestnosti s to = '' (alebo 'back') vráti hráča späť
 *  - miestnosti majú rámik a vzorované pozadie (ako v Pixel Adventure)
 *
 * Legenda objektov a dlaždíc: SJWorld.OBJECTS a SJWorld.TILES (sj-world.js).
 * Rozširuje triedu Game.
 */
(function () {
    const W = () => window.SJWorld;
    const TS = 32;
    const H = TS / 2;
    const FRUITS = ['apple', 'strawberry', 'bananas', 'cherries', 'orange', 'kiwi', 'pineapple', 'melon'];
    const NAVY = '#211f30';

    function buildOne(def) {
        const world = W();
        world.normalize(def);
        const platforms = world.collisions(def);
        const coins = [];
        const diamonds = [];
        const checkpoints = [];
        const enemies = [];
        const blocks = [];
        const portals = [];
        let endPoint = null;
        let spawn = null;
        let fruitIdx = 0;

        for (const o of def.objects) {
            const x = o.c * TS;
            const y = o.r * TS;
            const cx = x + H;
            const cy = y + H;
            const bottom = y + TS;
            const p = o;
            switch (o.t) {
                case 'P': spawn = { x: cx - 16, y: bottom - 64 }; break;
                case 'C': checkpoints.push({ x: cx - 64, y: bottom - 128, width: 128, height: 128, active: false, flagHeight: 30 }); break;
                case 'E': endPoint = { x: cx - 64, y: bottom - 128, width: 128, height: 128, paEnd: true }; break;
                case 'O': portals.push({ x: cx - 40, y: bottom - 112, width: 80, height: 112, to: o.to || '' }); break;
                case 'o': {
                    const coin = new Coin(cx - 20, cy - 20, 'gold');
                    coin.fruit = FRUITS[Math.floor(fruitIdx++ / 4) % FRUITS.length];
                    coins.push(coin);
                    break;
                }
                case 'D': case 'G': case 'R': case 'L': {
                    const type = { D: 'blueDiamond', G: 'greenDiamond', R: 'redDiamond', L: 'silver' }[o.t];
                    const gem = new Coin(cx - 28, cy - 28, type);
                    gem.width = 56;
                    gem.height = 56;
                    diamonds.push(gem);
                    break;
                }
                case 'X': blocks.push({ type: 'box', x: cx - 28, y: bottom - 48, variant: p.variant, fruits: p.fruits }); break;
                case 'B': blocks.push({ type: 'block', x: cx - 22, y: bottom - 44 }); break;
                case 'T': blocks.push({ type: 'spring', x: cx - 28, y: bottom - 56 }); break;
                case 'F': blocks.push({ type: 'faller', x: cx - 32, y }); break;
                case '~': blocks.push({ type: 'mover', x: cx - 32, y, dxRange: (p.range ?? 3) * TS, speed: p.speed }); break;
                case '!': blocks.push({ type: 'mover', x: cx - 32, y, dyRange: (p.range ?? 3) * TS, speed: p.speed }); break;
                case '^': blocks.push({ type: 'spikes', x, y }); break;
                case 'S': blocks.push({ type: 'saw', x: cx - 38, y: cy - 38, range: (p.range ?? 3) * TS, vertical: !!p.vertical, speed: p.speed }); break;
                case 'f': blocks.push({ type: 'fire', x, y: y - TS }); break;
                case 'w': blocks.push({ type: 'fan', x: cx - 24, y: bottom - 16 }); break;
                case 'a': blocks.push({ type: 'arrow', x: cx - 18, y: cy - 18 }); break;
                default:
                    if (window.SJMakeEnemy) {
                        const en = window.SJMakeEnemy(o.t, cx, bottom, p);
                        if (en) enemies.push(en);
                    }
            }
        }
        if (!spawn && portals.length) spawn = { x: portals[0].x + 64, y: portals[0].y + portals[0].height - 64 };
        if (!spawn) spawn = { x: 64, y: 0 };

        const L = new Level(def.cols * TS, platforms, [], enemies, [], [], coins, checkpoints, diamonds, endPoint);
        L.blocks = blocks;
        L.height = def.rows * TS;
        L.spawn = spawn;
        L.belowWorld = 0;
        L.tilemap = { def };
        L.portals = portals;
        L.name = def.name;
        L.room = !!def.frame || !!def.isRoom;
        return L;
    }

    /** Level vo formáte JSON (aj s miestnosťami) → Level. */
    window.SJBuildDef = function (def) {
        const L = buildOne(def);
        L.rooms = {};
        for (const rd of def.rooms || []) {
            const R = buildOne(rd);
            R.id = rd.id;
            R.isRoom = true;
            L.rooms[rd.id] = R;
        }
        // cieľ: ak chýba v leveli, môže byť v miestnosti; inak na konci levelu
        if (!L.endPoint && !Object.values(L.rooms).some((r) => r.endPoint)) {
            L.endPoint = { x: L.width - 200, y: L.height - 5 * TS - 128, width: 128, height: 128, paEnd: true };
        }
        for (const R of Object.values(L.rooms)) {
            if (!R.endPoint) R.endPoint = { x: -9999, y: -9999, width: 1, height: 1, paEnd: true, hidden: true };
            R.rooms = L.rooms;
            R.mainLevel = L;
        }
        if (!L.endPoint) L.endPoint = { x: -9999, y: -9999, width: 1, height: 1, paEnd: true, hidden: true };
        L.mainLevel = L;
        return L;
    };

    /** Textová mapa → Level (pôvodné levely v sj-levels.js). */
    window.SJBuildLevel = function (ascii) {
        return window.SJBuildDef(W().fromAscii(ascii));
    };

    // ---------------- vykreslenie ----------------

    const CHUNK = 512;

    function renderChunk(def, ci) {
        const cols = Math.ceil(CHUNK / TS);
        const c0 = ci * cols;
        const cv = document.createElement('canvas');
        cv.width = Math.min(CHUNK, (def.cols - c0) * TS);
        cv.height = def.rows * TS;
        const ctx = cv.getContext('2d');
        W().drawRegion(ctx, def, c0, 0, c0 + cols, def.rows, -c0 * TS, 0);
        return cv;
    }

    const proto = Game.prototype;

    /** Terén levelu: vzorované pozadie, dlaždice (kúsky v cache) a rámik. */
    proto.drawTilemap = function () {
        const L = this.currentLevelData;
        if (!L.tilemap || !W().ready()) return;
        const def = L.tilemap.def;
        const ctx = this.ctx;
        if (def.bg) W().drawPattern(ctx, def, this.tick || 0);
        L._chunks = L._chunks || [];
        const n = Math.ceil(L.width / CHUNK);
        const first = Math.max(0, Math.floor((this.camera.x - 40) / CHUNK));
        const last = Math.min(n - 1, Math.floor((this.camera.x + this.viewW + 40) / CHUNK));
        for (let ci = first; ci <= last; ci++) {
            if (!L._chunks[ci]) L._chunks[ci] = renderChunk(def, ci);
            ctx.drawImage(L._chunks[ci], ci * CHUNK, 0);
        }
        if (def.frame) W().drawFrame(ctx, def);
        this.drawPortals();
    };

    // pozadie: pri miestnostiach (rámik / vzor) tmavé okolie namiesto lesa
    const origBg = proto.drawBackground;
    proto.drawBackground = function () {
        const L = this.currentLevelData;
        const def = L && L.tilemap && L.tilemap.def;
        if (def && (def.frame || def.bg)) {
            this.ctx.fillStyle = NAVY;
            this.ctx.fillRect(0, 0, this.width, this.height);
            return;
        }
        return origBg.call(this);
    };

    // kamera: malý level / miestnosť je v strede obrazovky; rámik je vidieť
    const origCam = proto.updateCamera;
    proto.updateCamera = function (snap) {
        origCam.call(this, snap);
        const L = this.currentLevelData;
        if (!L || !L.tilemap || !this.viewW) return;
        const def = L.tilemap.def;
        const pad = def.frame ? TS : 0;
        const cam = this.camera;
        if (L.width + 2 * pad <= this.viewW) cam.x = (L.width - this.viewW) / 2;
        else if (pad) cam.x = Math.max(-pad, Math.min(L.width + pad - this.viewW, cam.x));
        if (def.frame) {
            if (L.height + 2 * pad <= this.viewH) cam.y = (L.height - this.viewH) / 2;
            else cam.y = Math.max(-pad, Math.min(L.height + pad - this.viewH, cam.y));
        }
    };

    // ---------------- portály a miestnosti ----------------

    /** Portál: vírivý kruh (kreslený) s iskrami. */
    proto.drawPortals = function () {
        const L = this.currentLevelData;
        const ctx = this.ctx;
        const t = (this.tick || 0) / 60;
        for (const p of L.portals || []) {
            const cx = p.x + p.width / 2;
            const cy = p.y + p.height / 2 + 6;
            const back = !p.to || p.to === 'back';
            const c1 = back ? '#FFD900' : '#b388ff';
            const c2 = back ? '#ff9800' : '#4fc3f7';
            ctx.save();
            // podstavec
            ctx.fillStyle = '#3a2e4a';
            ctx.fillRect(cx - 34, p.y + p.height - 10, 68, 10);
            ctx.fillStyle = '#5b4a73';
            ctx.fillRect(cx - 30, p.y + p.height - 14, 60, 6);
            // vír
            const g = ctx.createRadialGradient(cx, cy, 4, cx, cy, 44);
            g.addColorStop(0, '#ffffff');
            g.addColorStop(0.35, c1);
            g.addColorStop(0.8, c2);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.ellipse(cx, cy, 32 + Math.sin(t * 3) * 2, 46 + Math.sin(t * 3) * 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.75)';
            ctx.lineWidth = 3;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.ellipse(cx, cy, 14 + i * 8, 22 + i * 10, 0, t * 4 + i * 2, t * 4 + i * 2 + Math.PI * 1.2);
                ctx.stroke();
            }
            ctx.restore();
            if ((this.tick || 0) % 7 === 0 && this.particles) {
                const a = Math.random() * Math.PI * 2;
                this.particles.push({ x: cx + Math.cos(a) * 30, y: cy + Math.sin(a) * 42, vx: 0, vy: -0.6, g: -0.01, life: 30, max: 30, size: 4, color: c1 });
            }
        }
    };

    /** Pripraví miestnosti (bloky, počty ovocia a diamantov) – volá sa pri štarte. */
    proto.prepareRooms = function () {
        const L = this.currentLevelData;
        if (!L.rooms) return;
        for (const R of Object.values(L.rooms)) {
            this.currentLevelData = R;
            this.blocksInit();
            this.totalCoins += R.coins.length + this.bonusCoins;
            this.requiredDiamonds += R.diamonds.filter((d) => d.type === 'blueDiamond').length;
        }
        this.currentLevelData = L;
        this.portalStack = [];
    };

    /** Kontrola portálov (volá sa každý krok spolu s cieľom). */
    proto.checkPortals = function () {
        const L = this.currentLevelData;
        const p = this.player;
        if (!L.portals || this.teleport) return;
        const inside = (o) => p.x + p.width > o.x + 20 && p.x < o.x + o.width - 20 && p.y + p.height > o.y + 20 && p.y < o.y + o.height;
        // po príchode musí hráč z portálu najprv vystúpiť
        if (this.portalBlock && !inside(this.portalBlock)) this.portalBlock = null;
        for (const o of L.portals) {
            if (o === this.portalBlock || !inside(o)) continue;
            const back = !o.to || o.to === 'back';
            let target = null;
            if (back) {
                const prev = this.portalStack && this.portalStack.pop();
                if (prev) target = prev;
            } else if (L.rooms && L.rooms[o.to]) {
                (this.portalStack = this.portalStack || []).push({ level: L, portal: o });
                const R = L.rooms[o.to];
                const exit = R.portals.find((q) => !q.to || q.to === 'back') || R.portals[0];
                target = { level: R, portal: exit, spawn: R.tilemap.def.objects.some((q) => q.t === 'P') ? R.spawn : null };
            }
            if (!target) return;
            this.startTeleport(target);
            return;
        }
    };

    proto.startTeleport = function (target) {
        this.teleport = { t: 0, target, switched: false };
        if (window.SJInput) window.SJInput.reset();
        window.SJSound && window.SJSound('gem');
        const p = this.player;
        if (this.sprites) this.sprites.push({ kind: 'pa:desappearing', x: p.x + p.width / 2, y: p.y + p.height - 48, size: 192, t: 0 });
    };

    /** Priebeh teleportu: zmiznutie → tma → nová miestnosť → objavenie. */
    proto.updateTeleport = function () {
        const tp = this.teleport;
        if (!tp) return false;
        tp.t++;
        const p = this.player;
        p.velocityX = 0;
        p.velocityY = 0;
        if (!tp.switched && tp.t >= 24) {
            tp.switched = true;
            const { level, portal, spawn } = tp.target;
            if (this.currentLevelData) this.currentLevelData._lastCp = this.lastCheckpoint;
            this.currentLevelData = level;
            this.lastCheckpoint = level._lastCp || null;
            this.worldH = level.height || 800;
            this.belowWorld = level.belowWorld ?? 0;
            if (spawn) {
                p.x = spawn.x;
                p.y = spawn.y;
            } else if (portal) {
                // vedľa portálu (vpravo, ak je tam miesto) – dá sa doň hneď vrátiť
                const right = portal.x + portal.width + 6;
                p.x = right + p.width < level.width - 8 ? right : portal.x - p.width - 6;
                p.y = portal.y + portal.height - p.height - 14;
                p.facing = p.x > portal.x ? 1 : -1;
                this.portalBlock = portal;
            }
            p.standOn = null;
            p.onGround = false;
            this.updateCamera(true);
            p.appear = 21;
        }
        if (tp.t >= 44) this.teleport = null;
        return true;
    };

    /** Stmavenie obrazovky počas teleportu (na obrazovke). */
    proto.drawTeleportOverlay = function () {
        const tp = this.teleport;
        if (!tp) return;
        const a = tp.t < 24 ? tp.t / 24 : Math.max(0, 1 - (tp.t - 24) / 20);
        this.ctx.fillStyle = `rgba(33, 31, 48, ${a})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
    };

    // napojenie: portály sa kontrolujú s cieľom; teleport zastaví hráča
    const origFinish = proto.checkFinish;
    proto.checkFinish = function () {
        this.checkPortals();
        return origFinish.call(this);
    };
    const origPlayer = proto.updatePlayer;
    proto.updatePlayer = function () {
        if (this.updateTeleport()) {
            if (this.player.appear > 0) this.player.appear--;
            return;
        }
        return origPlayer.call(this);
    };
    const origScreen = proto.fxDrawScreen;
    proto.fxDrawScreen = function () {
        origScreen.call(this);
        this.drawTeleportOverlay();
    };
    // počas zmiznutia v portáli sa baník nekreslí
    const origDrawPlayer = proto.drawPlayer;
    proto.drawPlayer = function () {
        if (this.teleport && !this.teleport.switched) return;
        return origDrawPlayer.call(this);
    };
    // skrytý cieľ (level s cieľom v miestnosti) sa nekreslí
    const origTrophy = proto.drawTrophy;
    proto.drawTrophy = function (e) {
        if (e.hidden) return;
        return origTrophy.call(this, e);
    };
})();
