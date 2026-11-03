/**
 * Super Jožino – nepriatelia z Pixel Adventure 2.
 *
 *  - chodiaci (hríbik, sliepka, slimák, sliz, zajac, reďkovka, prasiatko):
 *    chodia sem a tam, otočia sa pri stene aj na okraji; skok na hlavu = porazený
 *  - lietajúci (vtáčik – letí sem a tam, včela – vznáša sa hore a dole)
 *  - nosorožec: stojí, keď ťa uvidí pred sebou, rozbehne sa
 *  - korytnačka: striedavo vystrčí ostne – vtedy sa na ňu nedá skočiť
 *
 * Objekty majú rovnaké rozhranie ako pôvodní nepriatelia (x, y, width,
 * height, alive, visible, killable, hit()), takže fungujú s existujúcimi
 * kolíziami v game.js. Kreslia sa cez SJSprites.
 */
(function () {
    const S = () => window.SJSprites;

    /** char: [druh, sprite pohybu, sprite zásahu, rýchlosť, hitbox šírka, výška] */
    const KINDS = {
        m: ['walker', 'mushroomRun', 'mushroomHit', 0.9, 40, 40],
        c: ['walker', 'chickenRun', 'chickenHit', 1.4, 40, 48],
        n: ['walker', 'snailWalk', 'snailHit', 0.5, 52, 36],
        s: ['walker', 'slimeRun', 'slimeHit', 0.6, 60, 36],
        b: ['walker', 'bunnyRun', 'bunnyHit', 1.6, 40, 60],
        r: ['walker', 'radishRun', 'radishHit', 1.0, 40, 52],
        p: ['walker', 'pigWalk', 'pigHit', 1.0, 52, 44],
        u: ['flyer', 'birdFly', 'birdHit', 1.2, 44, 36],
        e: ['hover', 'beeIdle', 'beeHit', 0.8, 44, 44],
        h: ['rino', 'rinoIdle', 'rinoHit', 3.2, 76, 50],
        t: ['turtle', 'turtleIdle', 'turtleHit', 0, 64, 36],
    };

    class PAEnemy {
        constructor(ch, cx, bottom, p = {}) {
            const k = KINDS[ch];
            this.kind = k[0];
            this.anim = k[1];
            this.hitAnim = k[2];
            this.speed = p.speed ?? k[3];
            this.width = k[4];
            this.height = k[5];
            this.x = cx - this.width / 2;
            this.y = bottom - this.height;
            this.x0 = this.x;
            this.y0 = this.y;
            this.range = (p.range ?? 3) * 32;
            this.dir = p.dir ?? -1; // sprite-y v balíku sa pozerajú doľava
            this.alive = true;
            this.visible = true;
            this.killable = true;
            this.stunnable = false;
            this.type = 'pa-' + ch;
            this.t = Math.random() * 100;
            this.state = 'move';
            this.isPA = true;
        }

        solids() {
            return (window.game && window.game.currentLevelData && window.game.currentLevelData.platforms) || [];
        }

        solidAt(px, py) {
            for (const r of this.solids()) {
                if (px >= r.x && px < r.x + r.width && py >= r.y && py < r.y + r.height) return true;
            }
            for (const b of (window.game && window.game.currentLevelData.blocks) || []) {
                if ((b.kind === 'box' || b.kind === 'block') && b.state !== 'gone' && px >= b.x && px < b.x + b.width && py >= b.y && py < b.y + b.height) return true;
            }
            return false;
        }

        update(dt = 1) {
            this.t += dt;
            if (this.state === 'dying') {
                this.vy += 0.45 * dt;
                this.y += this.vy * dt;
                this.x += this.vx * dt;
                if (this.y > (window.game ? window.game.worldH : 1000) + 200) this.visible = false;
                return;
            }
            if (this.kind === 'walker' || (this.kind === 'rino' && this.state === 'charge')) {
                const sp = this.kind === 'rino' ? this.speed : this.speed;
                const nx = this.x + this.dir * sp * dt;
                const front = this.dir > 0 ? nx + this.width + 1 : nx - 1;
                const wall = this.solidAt(front, this.y + this.height * 0.5);
                const ground = this.solidAt(front, this.y + this.height + 4);
                if (wall || !ground) {
                    if (this.kind === 'rino') {
                        this.state = 'idle';
                        this.cool = 60;
                        if (wall && window.game) window.game.shake = 8;
                    }
                    this.dir = -this.dir;
                } else {
                    this.x = nx;
                }
            } else if (this.kind === 'rino') {
                if (this.cool > 0) { this.cool -= dt; return; }
                const g = window.game;
                if (!g) return;
                const pl = g.player;
                const dy = Math.abs(pl.y + pl.height - (this.y + this.height));
                const dx = pl.x + pl.width / 2 - (this.x + this.width / 2);
                if (dy < 40 && Math.abs(dx) < 300) {
                    this.dir = Math.sign(dx) || this.dir;
                    this.state = 'charge';
                }
            } else if (this.kind === 'flyer') {
                this.x = this.x0 + Math.sin(this.t * 0.02 * this.speed) * this.range;
                this.dir = Math.cos(this.t * 0.02 * this.speed) >= 0 ? 1 : -1;
                this.y = this.y0 + Math.sin(this.t * 0.08) * 6;
            } else if (this.kind === 'hover') {
                this.y = this.y0 + Math.sin(this.t * 0.03 * this.speed) * this.range * 0.5;
            } else if (this.kind === 'turtle') {
                // 0–150 bez ostňov, 150–166 vystrkuje, 166–300 ostne, 300–316 zaťahuje
                const c = this.t % 316;
                this.spikes = c >= 150 && c < 316;
                this.killable = !this.spikes;
                this.anim = c < 150 ? 'turtleIdle' : c < 166 ? 'turtleSpikesOut' : c < 300 ? 'turtleSpiked' : 'turtleSpikesIn';
            }
        }

        hit() {
            if (this.state === 'dying') return;
            this.state = 'dying';
            this.alive = false;
            this.vy = -6;
            this.vx = this.dir * -1.5;
            this.hitT = 0;
        }

        paDraw(ctx) {
            const sp = S();
            if (!sp) return;
            let name = this.anim;
            let frame = this.t / 4;
            if (this.state === 'dying') {
                name = this.hitAnim;
                this.hitT = (this.hitT || 0) + 1;
                frame = Math.min(sp.frames(name) - 1, this.hitT / 4);
            } else if (this.kind === 'rino') {
                name = this.state === 'charge' ? 'rinoRun' : 'rinoIdle';
            } else if (this.kind === 'turtle') {
                const c = this.t % 316;
                frame = c < 150 ? c / 4 : c < 166 ? (c - 150) / 2 : c < 300 ? (c - 166) / 4 : (c - 300) / 2;
            }
            const [w, h] = sp.size(name);
            const x = this.x + this.width / 2 - w / 2;
            const y = this.y + this.height - h + 2;
            sp.draw(ctx, name, frame, x, y, w, h, this.dir > 0);
        }
    }

    window.SJMakeEnemy = (ch, cx, bottom, p) => (KINDS[ch] ? new PAEnemy(ch, cx, bottom, p) : null);

    // Kreslenie a animácia cez pôvodného správcu animácií – pre PA nepriateľov vlastné
    const mgr = EnemyAnimationManager.prototype;
    const origDraw = mgr.draw;
    const origUpd = mgr.updateAnimation;
    mgr.draw = function (ctx, enemy) {
        if (enemy && enemy.isPA) return enemy.paDraw(ctx);
        return origDraw.call(this, ctx, enemy);
    };
    mgr.updateAnimation = function (enemy, dt) {
        if (enemy && enemy.isPA) return;
        return origUpd.call(this, enemy, dt);
    };
})();
