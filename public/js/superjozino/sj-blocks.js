/**
 * Super Jožino – bloky a pasce (grafika Pixel Adventure 1).
 *
 *  box     krabica s ovocím: úder zdola alebo skok zhora; box1 vydrží 1 úder,
 *          box2 2, box3 3 (variant), potom sa rozpadne a vypadne ovocie
 *  block   rozbitný blok – úder zdola alebo skok zhora ho rozbije
 *  spring  trampolína – stačí na ňu vojsť / skočiť, vystrelí vysoko
 *  mover   hnedá plošina na reťazi (dxRange vodorovne / dyRange zvislo), vezie
 *  faller  plošina s vrtuľkou – po stúpení sa zatrasie a spadne, potom sa vráti
 *  spikes  ostne (zraní)
 *  saw     píla na reťazi – jazdí sem a tam (zraní)
 *  fire    ohnivý blok – keď naň stúpiš, o chvíľu vzbĺkne (zraní)
 *  fan     ventilátor – fúka hore, nadnáša postavu
 *  arrow   šípka – dotyk ťa vystrelí hore a vráti dvojitý skok
 *
 * Staršie názvy z pôvodných máp: bonus → box, brick → block.
 * Rozširuje triedu Game (načítava sa po game.js a sj-sprites.js).
 */
(function () {
    const S = () => window.SJSprites;
    const SPRING_FORCE = -17;
    const RENAME = { bonus: 'box', brick: 'block' };
    const FRUITS = ['apple', 'strawberry', 'bananas', 'cherries', 'orange', 'kiwi', 'pineapple', 'melon'];

    const proto = Game.prototype;

    proto.blocksInit = function () {
        const L = this.currentLevelData;
        let extraFruit = 0;
        L.blocks = (L.blocks || []).map((src, i) => {
            const b = { ...src, kind: RENAME[src.type] || src.type };
            b.x0 = b.x;
            b.y0 = b.y;
            b.t = 0;
            b.st = 0;
            b.dx = 0;
            b.dy = 0;
            b.state = 'idle';
            switch (b.kind) {
                case 'box':
                    b.variant = b.variant || (src.type === 'bonus' ? 1 : 1 + (i % 3));
                    b.hp = b.variant;
                    b.fruits = b.fruits ?? b.variant;
                    b.width = 56; b.height = 48;
                    extraFruit += b.fruits;
                    break;
                case 'block': b.width = 44; b.height = 44; break;
                case 'spring': b.width = 56; b.height = 56; break;
                case 'mover': b.width = 64; b.height = 16; break;
                case 'faller': b.width = 64; b.height = 20; break;
                case 'spikes': b.width = 32; b.height = 32; break;
                case 'saw': b.width = 76; b.height = 76; b.range = b.range ?? 96; break;
                case 'fire': b.width = 32; b.height = 64; break;
                case 'fan': b.width = 48; b.height = 16; b.lift = b.lift || 220; break;
                case 'arrow': b.width = 36; b.height = 36; break;
                default: b.width = b.width || 40; b.height = b.height || 40;
            }
            return b;
        });
        this.bonusCoins = extraFruit;
    };

    /** Kolízna plocha bloku (časť sprite-u, ktorá je naozaj „pevná“). */
    function body(b) {
        switch (b.kind) {
            case 'spring': return { x: b.x + 8, y: b.y + 26, width: b.width - 16, height: b.height - 26, kind: 'spring', ref: b };
            case 'fire': return { x: b.x, y: b.y + 32, width: 32, height: 32, kind: 'fire', ref: b };
            case 'mover': return { x: b.x, y: b.y, width: b.width, height: 12, kind: 'mover', ref: b, dy: b.dy };
            case 'faller': return { x: b.x, y: b.y, width: b.width, height: 12, kind: 'faller', ref: b, dy: b.dy };
            default: return { x: b.x, y: b.y, width: b.width, height: b.height, kind: b.kind, ref: b };
        }
    }
    const SOLID_KINDS = new Set(['box', 'block', 'fire', 'fan']);
    const ONEWAY_KINDS = new Set(['mover', 'faller', 'spring']);

    const overlapR = (a, r) => a.x < r.x + r.width && a.x + a.width > r.x && a.y < r.y + r.height && a.y + a.height > r.y;

    proto.blocksUpdate = function () {
        const L = this.currentLevelData;
        const p = this.player;
        for (const b of L.blocks) {
            b.t++;
            if (b.hitT > 0) b.hitT--;
            if (b.useT > 0) b.useT--;
            switch (b.kind) {
                case 'mover': {
                    const sp = b.speed || 0.018;
                    const nx = b.x0 + (b.dxRange ? Math.sin(b.t * sp) * b.dxRange : 0);
                    const ny = b.y0 + (b.dyRange ? Math.sin(b.t * sp) * b.dyRange : 0);
                    b.dx = nx - b.x;
                    b.dy = ny - b.y;
                    b.x = nx;
                    b.y = ny;
                    break;
                }
                case 'faller':
                    b.dx = 0;
                    b.dy = 0;
                    if (b.state === 'shake') {
                        if (++b.st > 30) { b.state = 'fall'; b.vy = 0; }
                    } else if (b.state === 'fall') {
                        b.vy = Math.min(12, b.vy + 0.35);
                        b.dy = b.vy;
                        b.y += b.vy;
                        if (b.y > this.worldH + 300) { b.state = 'gone'; b.st = 0; }
                    } else if (b.state === 'gone' && ++b.st > 200) {
                        b.state = 'idle';
                        b.x = b.x0;
                        b.y = b.y0;
                        this.burst(b.x + b.width / 2, b.y + 6, ['#cfd8dc', '#ffffff'], 10, 2, { gravity: 0 });
                    }
                    break;
                case 'saw': {
                    const s = Math.sin(b.t * (b.speed || 0.02));
                    b.x = b.x0 + (b.vertical ? 0 : s * b.range);
                    b.y = b.y0 + (b.vertical ? s * b.range : 0);
                    const cx = b.x + 38;
                    const cy = b.y + 38;
                    const nx = Math.max(p.x, Math.min(cx, p.x + p.width));
                    const ny = Math.max(p.y, Math.min(cy, p.y + p.height));
                    if ((nx - cx) ** 2 + (ny - cy) ** 2 < 28 * 28) this.hurtBy(b);
                    break;
                }
                case 'spikes':
                    if (overlapR(p, { x: b.x + 4, y: b.y + 18, width: 24, height: 14 })) this.hurtBy(b);
                    break;
                case 'fire':
                    if (b.state === 'warm' && ++b.st > 24) { b.state = 'on'; b.st = 0; }
                    else if (b.state === 'on' && ++b.st > 110) { b.state = 'idle'; b.st = 0; }
                    if (b.state === 'on' && overlapR(p, { x: b.x + 4, y: b.y + 4, width: 24, height: 30 })) this.hurtBy(b);
                    break;
                case 'fan':
                    if (p.x + p.width > b.x + 4 && p.x < b.x + b.width - 4 && p.y + p.height <= b.y + 2 && p.y + p.height > b.y - b.lift) {
                        p.velocityY = Math.max(-8, p.velocityY - 1.05);
                        p.onGround = false;
                        p.canDouble = true;
                    }
                    if (b.t % 5 === 0) {
                        this.particles.push({ x: b.x + 6 + Math.random() * (b.width - 12), y: b.y - 4, vx: 0, vy: -3 - Math.random() * 2, g: 0, life: 40, max: 40, size: 3, color: 'rgba(255,255,255,0.7)' });
                    }
                    break;
                case 'arrow':
                    if (b.state === 'gone') {
                        if (++b.st > 180) { b.state = 'idle'; this.burst(b.x + 18, b.y + 18, ['#ffffff'], 8, 1.6, { gravity: 0 }); }
                    } else if (overlapR(p, b)) {
                        p.velocityY = -14;
                        p.onGround = false;
                        p.canDouble = true;
                        p.locked = false;
                        b.state = 'gone';
                        b.st = 0;
                        b.useT = 16;
                        window.SJSound && window.SJSound('jump');
                        this.burst(b.x + 18, b.y + 18, ['#FFD900', '#ffffff'], 12, 3, { gravity: 0.05 });
                    }
                    break;
            }
        }
        if (p.standOn && p.standOn.kind === 'faller' && p.standOn.ref.state === 'idle') {
            p.standOn.ref.state = 'shake';
            p.standOn.ref.st = 0;
        }
        if (p.standOn && p.standOn.kind === 'fire' && p.standOn.ref.state === 'idle') {
            p.standOn.ref.state = 'warm';
            p.standOn.ref.st = 0;
        }
    };

    /** Zranenie pascou (s ochranou – rovnako ako nepriateľ). */
    proto.hurtBy = function (b) {
        if (this.isInvulnerable || this.deathAnimation.active) return;
        this.hitByEnemy({ x: b.x, width: b.width });
    };

    /** Pevné prekážky okolo hráča (pre kolízie aj šmýkanie po stene). */
    proto.solidsNear = function (pad = 60) {
        const p = this.player;
        const L = this.currentLevelData;
        const near = (r) => r.x < p.x + p.width + pad && r.x + r.width > p.x - pad;
        const out = [];
        for (const pl of L.platforms) if (near(pl)) out.push(pl);
        for (const w of L.walls) if (near(w)) out.push(w);
        for (const b of L.blocks || []) {
            if (b.state === 'gone' || b.broken) continue;
            if (!SOLID_KINDS.has(b.kind) && !ONEWAY_KINDS.has(b.kind)) continue;
            if (near(b)) out.push(body(b));
        }
        return out;
    };

    const isOneWay = (r) => r.type === 'platform' || ONEWAY_KINDS.has(r.kind);
    Game.isOneWay = isOneWay;

    /**
     * Kolízie po osiach. Zem, steny, krabice a bloky sú pevné; plošiny,
     * pohyblivé a padajúce plošiny a trampolína sú „priechodné“ zdola.
     */
    proto.moveAndCollide = function () {
        const p = this.player;
        const L = this.currentLevelData;

        if (p.standOn && (p.standOn.kind === 'mover' || p.standOn.kind === 'faller')) {
            p.x += p.standOn.ref.dx;
            p.y += p.standOn.ref.dy;
        }

        const solids = this.solidsNear();
        const overlap = (r) => overlapR(p, r);

        // vodorovne
        p.x += p.velocityX;
        p.wallDir = 0;
        for (const r of solids) {
            if (isOneWay(r) || !overlap(r)) continue;
            if (p.y + p.height - r.y <= 6) continue; // schodík
            if (p.velocityX > 0) { p.x = r.x - p.width; p.wallDir = 1; }
            else if (p.velocityX < 0) { p.x = r.x + r.width; p.wallDir = -1; }
            p.velocityX = 0;
        }

        // zvislo
        const wasGround = p.onGround;
        const fallSpeed = p.velocityY;
        const prevBottom = p.y + p.height;
        const prevTop = p.y;
        p.prevBottom = prevBottom;
        p.y += p.velocityY;
        p.onGround = false;
        p.standOn = null;
        p.surface = null;
        let headHit = null;
        let stompHit = null;
        for (const r of solids) {
            if (!overlap(r)) continue;
            if (r.kind === 'spring' && p.velocityY >= 0 && prevBottom <= r.y + r.height + 1) {
                p.y = r.y - p.height;
                p.velocityY = SPRING_FORCE;
                p.isJumping = true;
                p.canDouble = true;
                r.ref.useT = 32;
                window.SJSound && window.SJSound('jump');
                this.burst(r.x + r.width / 2, r.y, ['#FFD900', '#ffffff'], 10, 2.4, { gravity: 0.05 });
                continue;
            }
            const tol = 2 + Math.max(0, -(r.dy || 0)) + (r.kind === 'mover' ? 4 : 0);
            if (p.velocityY >= 0 && prevBottom <= r.y + tol) {
                p.y = r.y - p.height;
                p.velocityY = 0;
                p.onGround = true;
                p.isJumping = false;
                p.standOn = r.kind ? r : null;
                p.surface = r.surface || null;
                if ((r.kind === 'box' || r.kind === 'block') && fallSpeed > 3) stompHit = r.ref;
            } else if (!isOneWay(r) && p.velocityY < 0 && prevTop >= r.y + r.height - 2) {
                p.y = r.y + r.height;
                p.velocityY = 0;
                if (r.ref) headHit = headHit || r.ref;
            }
        }
        if (headHit) this.hitBlock(headHit, 'below');
        if (stompHit) {
            this.hitBlock(stompHit, 'above');
            p.velocityY = -8;
            p.onGround = false;
        }

        if (p.onGround && !wasGround && fallSpeed > 5) {
            this.dust(p.x + p.width / 2, p.y + p.height, 7);
            p.squash = 8;
        }

        if (p.velocityY < 0 || headHit) {
            for (const block of L.specialBlocks) {
                if (!block.hit && overlap(block)) {
                    block.hit = true;
                    this.collectSpecialItem(block.itemType, block);
                }
            }
        }
    };

    /** Úder do krabice / bloku. */
    proto.hitBlock = function (b) {
        if (b.kind === 'box') {
            if (b.hitT > 0) return;
            b.hitT = 12;
            b.hp--;
            window.SJSound && window.SJSound('stomp');
            if (b.hp > 0) return;
            b.state = 'gone';
            b.broken = true;
            window.SJSound && window.SJSound('brick');
            this.pieces(b, `box${b.variant}Break`, 4);
            // ovocie vyskočí a samo sa zoberie
            for (let i = 0; i < b.fruits; i++) {
                const fx = b.x + b.width / 2 + (i - (b.fruits - 1) / 2) * 30;
                setTimeout(() => {
                    this.collectedCoins++;
                    this.fxCoin({ x: fx - 20, y: b.y - 50, width: 40, height: 40, fruit: FRUITS[(Math.round(b.x0 / 32) + i) % FRUITS.length] });
                }, 90 * i);
            }
        } else if (b.kind === 'block') {
            b.state = 'gone';
            b.broken = true;
            window.SJSound && window.SJSound('brick');
            this.shake = 6;
            this.pieces(b, 'blockPart1', 3, true);
            this.pieces(b, 'blockPart2', 3, true);
        }
    };

    /** Kúsky rozbitého predmetu (snímky sprite-u ako letiace časti). */
    proto.pieces = function (b, sprite, n, random) {
        this.debris = this.debris || [];
        for (let i = 0; i < n; i++) {
            this.debris.push({
                sprite,
                frame: random ? Math.floor(Math.random() * n) : i,
                x: b.x + (random ? (Math.random() - 0.5) * b.width * 0.5 : 0),
                y: b.y + (random ? (Math.random() - 0.5) * b.height * 0.4 : 0),
                w: b.width,
                h: b.height,
                vx: (i % 2 ? 1 : -1) * (1.5 + Math.random() * 2.5),
                vy: -4 - Math.random() * 3,
                rot: 0,
                vr: (Math.random() - 0.5) * 0.3,
                life: 70,
            });
        }
    };

    proto.drawBlocks = function (visible) {
        const ctx = this.ctx;
        const sp = S();
        if (!sp) return;
        const blocks = this.currentLevelData.blocks || [];
        for (const b of blocks) {
            if ((b.kind === 'mover' || b.kind === 'saw') && visible({ x: b.x0 - 200, width: b.width + 400 })) this.drawChain(b);
        }
        for (const b of blocks) {
            if (b.state === 'gone' && b.kind !== 'arrow') continue;
            if (!visible(b)) continue;
            switch (b.kind) {
                case 'box': {
                    const hit = b.hitT > 0;
                    sp.draw(ctx, hit ? `box${b.variant}Hit` : `box${b.variant}`, hit ? (12 - b.hitT) / 4 : 0, b.x, b.y, b.width, b.height);
                    break;
                }
                case 'block':
                    sp.draw(ctx, 'blockIdle', 0, b.x, b.y, b.width, b.height);
                    break;
                case 'spring':
                    if (b.useT > 0) sp.draw(ctx, 'trampolineJump', (32 - b.useT) / 4, b.x, b.y, b.width, b.height);
                    else sp.draw(ctx, 'trampoline', 0, b.x, b.y, b.width, b.height);
                    break;
                case 'mover':
                    sp.draw(ctx, 'brownOn', b.t / 3, b.x, b.y, b.width, b.height);
                    break;
                case 'faller': {
                    const sx = b.state === 'shake' ? Math.sin(b.st * 1.7) * 2.5 : 0;
                    const fy = b.state === 'idle' ? Math.sin(b.t * 0.08) * 2 : 0;
                    sp.draw(ctx, b.state === 'fall' ? 'fallingOff' : 'fallingOn', b.t / 3, b.x + sx, b.y + fy, b.width, b.height);
                    break;
                }
                case 'spikes':
                    sp.draw(ctx, 'spikes', 0, b.x, b.y, 32, 32);
                    break;
                case 'saw':
                    sp.draw(ctx, 'sawOn', b.t / 2, b.x, b.y, 76, 76);
                    break;
                case 'fire':
                    if (b.state === 'on') sp.draw(ctx, 'fireOn', b.t / 4, b.x, b.y, 32, 64);
                    else if (b.state === 'warm') sp.draw(ctx, 'fireHit', b.st / 6, b.x, b.y, 32, 64);
                    else sp.draw(ctx, 'fireOff', 0, b.x, b.y, 32, 64);
                    break;
                case 'fan':
                    sp.draw(ctx, 'fanOn', b.t / 2, b.x, b.y, 48, 16);
                    break;
                case 'arrow':
                    if (b.state === 'gone') {
                        if (b.useT > 0) sp.draw(ctx, 'arrowHit', (16 - b.useT) / 4, b.x, b.y, 36, 36);
                    } else {
                        sp.draw(ctx, 'arrowIdle', b.t / 4, b.x, b.y + Math.sin(b.t * 0.06) * 3, 36, 36);
                    }
                    break;
            }
        }
        // kúsky rozbitých predmetov
        if (this.debris && this.debris.length) {
            for (const d of this.debris) {
                d.vy += 0.35;
                d.x += d.vx;
                d.y += d.vy;
                d.rot += d.vr;
                d.life--;
                ctx.save();
                ctx.globalAlpha = Math.max(0, Math.min(1, d.life / 20));
                ctx.translate(d.x + d.w / 2, d.y + d.h / 2);
                ctx.rotate(d.rot);
                sp.draw(ctx, d.sprite, d.frame, -d.w / 2, -d.h / 2, d.w, d.h);
                ctx.restore();
            }
            this.debris = this.debris.filter((d) => d.life > 0);
        }
    };

    /** Reťaz pohyblivej plošiny / píly (bodky po dráhe). */
    proto.drawChain = function (b) {
        const sp = S();
        const isSaw = b.kind === 'saw';
        const range = isSaw ? b.range : (b.dxRange || b.dyRange || 0);
        const vertical = isSaw ? b.vertical : !!b.dyRange;
        const cx = b.x0 + b.width / 2;
        const cy = b.y0 + (isSaw ? b.height / 2 : 8);
        const name = isSaw ? 'sawChain' : 'chain';
        for (let d = -range; d <= range; d += 16) {
            const x = vertical ? cx : cx + d;
            const y = vertical ? cy + d : cy;
            sp.draw(this.ctx, name, 0, x - 8, y - 8, 16, 16);
        }
    };
})();
