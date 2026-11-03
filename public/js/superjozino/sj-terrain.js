/**
 * Super Jožino – vykreslenie terénu bez deformácie.
 *
 * Sprite terrain.png (Pixel Adventure 1, Pixel Frog) je mriežka dlaždíc 16×16 px:
 *  - blok zeme 3×3 dlaždice: horný rad = tráva, stredný = hlina, krajné stĺpce = okraj,
 *  - plošiny sú lišty z 3 častí (začiatok, stred, koniec).
 * Predtým sa jedna dlaždica natiahla na celú plochu (zem zvislo, plošina
 * vodorovne) – preto bol terén „deformovaný“. Teraz sa dlaždice opakujú
 * v pevnej veľkosti a okraje sa kreslia zvlášť.
 *
 * Každý kus terénu sa vykreslí raz do pomocného plátna (cache) a potom
 * sa len kopíruje – menej práce pre telefón.
 *
 * Súbor rozširuje triedu Game (načítava sa po game.js).
 */
(function () {
    const T = 16; // veľkosť dlaždice v sprite-e

    /** Zdroje v terrain.png (ľavý horný roh). */
    const SRC = {
        grass: { x: 96, y: 0 }, // blok 3×3 – zem s trávou
        bar: { x: 192, y: 0 }, // hnedá lišta 3×1 – plošiny
        vbar: { x: 240, y: 0 }, // hnedá zvislá lišta 1×3 – steny
        goldSmall: { x: 272, y: 144 }, // zlatá kocka 16×16 – bonusový blok
        ironSmall: { x: 192, y: 80 }, // sivá kocka 16×16 – použitý bonusový blok
        brick: { x: 272, y: 64 }, // tehly 32×32
        woodBar: { x: 272, y: 16, w: 48, h: 5 }, // drevená tenká lišta – pohyblivá plošina
        ironBar: { x: 272, y: 32, w: 48, h: 5 }, // železná tenká lišta – padajúca plošina
    };

    const GROUND_CELL = 32; // dlaždica zeme vo svete (2× pixel)

    function makeCanvas(w, h) {
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.ceil(w));
        c.height = Math.max(1, Math.ceil(h));
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        return c;
    }

    function cached(game, key, w, h, paint) {
        game._terrainCache = game._terrainCache || new Map();
        let c = game._terrainCache.get(key);
        if (!c) {
            c = makeCanvas(w, h);
            paint(c.getContext('2d'));
            game._terrainCache.set(key, c);
        }
        return c;
    }

    /** Zem: horný rad tráva, pod ním hlina; ľavý a pravý okraj s obrysom. */
    function paintGround(img, ctx, w, h) {
        const C = GROUND_CELL;
        const s = SRC.grass;
        const rows = Math.ceil(h / C);
        const cols = Math.ceil(w / C);
        for (let r = 0; r < rows; r++) {
            const sy = s.y + (r === 0 ? 0 : T);
            const y = r * C;
            for (let c = 0; c < cols; c++) {
                ctx.drawImage(img, s.x + T, sy, T, T, c * C, y, C, C);
            }
            // okraje
            ctx.drawImage(img, s.x, sy, T, T, 0, y, C, C);
            ctx.drawImage(img, s.x + 2 * T, sy, T, T, w - C, y, C, C);
        }
    }

    /** Vodorovná lišta z 3 častí (začiatok – stred opakovane – koniec). */
    function paintBar(img, ctx, w, h, s) {
        const C = h; // štvorcové dlaždice vo výške plošiny
        const cols = Math.ceil(w / C);
        for (let c = 0; c < cols; c++) ctx.drawImage(img, s.x + T, s.y, T, T, c * C, 0, C, C);
        ctx.drawImage(img, s.x, s.y, T, T, 0, 0, C, C);
        ctx.drawImage(img, s.x + 2 * T, s.y, T, T, w - C, 0, C, C);
    }

    /** Zvislá lišta z 3 častí (vrch – stred opakovane – spodok). */
    function paintVBar(img, ctx, w, h, s) {
        const C = w;
        const rows = Math.ceil(h / C);
        for (let r = 0; r < rows; r++) ctx.drawImage(img, s.x, s.y + T, T, T, 0, r * C, C, C);
        ctx.drawImage(img, s.x, s.y, T, T, 0, 0, C, C);
        ctx.drawImage(img, s.x, s.y + 2 * T, T, T, 0, h - C, C, C);
    }

    const proto = Game.prototype;

    proto.drawGroundTerrain = function (tileName, x, y, width, height) {
        const img = this.terrainSprite;
        if (!img.loaded) {
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(x, y, width, height);
            return;
        }
        const w = Math.round(width);
        const h = Math.round(height);
        const c = cached(this, `g:${w}x${h}`, w, h, (ctx) => paintGround(img, ctx, w, h));
        this.ctx.drawImage(c, Math.round(x), Math.round(y));
    };

    proto.drawPlatform = function (tileName, x, y, width, height) {
        const img = this.terrainSprite;
        if (!img.loaded) {
            this.ctx.fillStyle = '#CD853F';
            this.ctx.fillRect(x, y, width, height);
            return;
        }
        const w = Math.round(width);
        const h = Math.round(height);
        let c;
        if (h > w) {
            // stena (vyššia ako širšia)
            c = cached(this, `v:${w}x${h}`, w, h, (ctx) => paintVBar(img, ctx, w, h, SRC.vbar));
        } else {
            c = cached(this, `b:${w}x${h}`, w, h, (ctx) => paintBar(img, ctx, w, h, SRC.bar));
        }
        this.ctx.drawImage(c, Math.round(x), Math.round(y));
    };

    /** Jedna dlaždica zo sprite-u (bloky). */
    proto.drawSprite = function (name, x, y, w, h) {
        const img = this.terrainSprite;
        const s = SRC[name];
        if (!img.loaded || !s) {
            this.ctx.fillStyle = '#b8860b';
            this.ctx.fillRect(x, y, w, h);
            return;
        }
        const sw = s.w || (name === 'brick' ? 32 : T);
        const sh = s.h || (name === 'brick' ? 32 : T);
        this.ctx.drawImage(img, s.x, s.y, sw, sh, x, y, w, h);
    };

    /** Tenká lišta (pohyblivá / padajúca plošina) – stred sa opakuje. */
    proto.drawThinBar = function (name, x, y, w, h) {
        const img = this.terrainSprite;
        const s = SRC[name];
        if (!img.loaded) {
            this.ctx.fillStyle = '#8b5a2b';
            this.ctx.fillRect(x, y, w, h);
            return;
        }
        const W = Math.round(w);
        const H = Math.round(h);
        const c = cached(this, `t:${name}:${W}x${H}`, W, H, (ctx) => {
            const cap = 4; // zaoblené konce lišty v sprite-e
            const k = H / s.h;
            const capW = cap * k;
            for (let px = capW; px < W - capW; px += (s.w - 2 * cap) * k) {
                ctx.drawImage(img, s.x + cap, s.y, s.w - 2 * cap, s.h, px, 0, (s.w - 2 * cap) * k, H);
            }
            ctx.drawImage(img, s.x, s.y, cap, s.h, 0, 0, capW, H);
            ctx.drawImage(img, s.x + s.w - cap, s.y, cap, s.h, W - capW, 0, capW, H);
        });
        this.ctx.drawImage(c, Math.round(x), Math.round(y));
    };
})();
