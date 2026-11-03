/**
 * Super Jožino – efekty: zvuky, častice, plávajúci text, mince letiace
 * do počítadla, spätná väzba „Správne / Skús znova“ (rovnaká ako v iných
 * cvičeniach) a efekty drahokamov.
 *
 * Rozširuje triedu Game (načítava sa po game.js).
 */
(function () {
    const SOUNDS = {
        jump: 'zvuky/effects/jump.mp3',
        coin: 'zvuky/effects/collectpoints.mp3',
        gem: 'zvuky/effects/zlato.wav',
        hit: 'zvuky/effects/error.mp3',
        stomp: 'zvuky/effects/click.mp3',
        brick: 'zvuky/effects/kopanie.wav',
        correct: 'zvuky/effects/spravne.mp3',
        wrong: 'zvuky/effects/zle.mp3',
        win: 'zvuky/effects/vyhra.mp3',
    };

    /** Zvuk efektu (cez spoločnú službu – rešpektuje vypnutý zvuk v nastaveniach). */
    function sfx(name) {
        try {
            const BJ = window.BJ;
            if (BJ && BJ.audio && SOUNDS[name]) BJ.audio.play(SOUNDS[name]);
        } catch (e) { /* bez zvuku */ }
    }
    window.SJSound = sfx;

    // ---------- obrázky efektov ----------
    const base = 'images/superjozino/assets/treasure/';
    function frames(folder, n) {
        return Array.from({ length: n }, (_, i) => {
            const im = new Image();
            im.src = `${base}${folder}/0${i + 1}.png`;
            return im;
        });
    }
    const FX_IMG = {
        coin: frames('Coin Effect', 3),
        gem: frames('Diamond Effect', 4),
    };

    const proto = Game.prototype;

    proto.fxInit = function () {
        this.particles = [];
        this.floaters = []; // plávajúce texty (svet)
        this.flyers = []; // mince letiace do počítadla (obrazovka)
        this.sprites = []; // krátke animácie zo sprite-ov (svet)
        this.shake = 0;
        this.power = { superJump: 0 }; // zostávajúce kroky power-upu
    };

    /** Výbuch častíc (svet). */
    proto.burst = function (x, y, color, n = 14, speed = 3.2, opts = {}) {
        for (let i = 0; i < n; i++) {
            const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
            const v = speed * (0.5 + Math.random() * 0.7);
            this.particles.push({
                x, y,
                vx: Math.cos(a) * v,
                vy: Math.sin(a) * v - (opts.up || 0),
                g: opts.gravity ?? 0.12,
                life: opts.life || 34 + Math.random() * 14,
                max: 0,
                size: opts.size || 4 + Math.random() * 3,
                color: Array.isArray(color) ? color[i % color.length] : color,
                square: !!opts.square,
            });
        }
    };

    /** Prach pod nohami (doskok, rozbeh). */
    proto.dust = function (x, y, n = 6) {
        for (let i = 0; i < n; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20, y,
                vx: (Math.random() - 0.5) * 2.4, vy: -Math.random() * 1.4,
                g: 0.02, life: 22 + Math.random() * 10, max: 0,
                size: 5 + Math.random() * 4, color: 'rgba(240,230,210,0.9)', round: true,
            });
        }
    };

    proto.floatText = function (x, y, text, color = '#FFD900') {
        this.floaters.push({ x, y, text, color, life: 50 });
    };

    proto.spriteFx = function (kind, x, y, size) {
        this.sprites.push({ kind, x, y, size, t: 0 });
    };

    /** Minca/srdce letí z miesta vo svete do rámčeka v hornej lište. */
    proto.flyToHud = function (wx, wy, hudId, kind) {
        const el = document.getElementById(hudId);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cr = this.canvas.getBoundingClientRect();
        if (!cr.width) return;
        const k = this.canvas.width / cr.width;
        const tx = (r.left + r.width * 0.25 - cr.left) * k;
        const ty = (r.top + r.height / 2 - cr.top) * k;
        const sx = (wx - this.camera.x) * this.scale;
        const sy = (wy - this.camera.y) * this.scale;
        this.flyers.push({ sx, sy, tx, ty, t: 0, kind, el });
    };

    proto.fxUpdate = function () {
        for (const p of this.particles) {
            p.max = p.max || p.life;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.g;
            p.life--;
        }
        this.particles = this.particles.filter((p) => p.life > 0);
        for (const f of this.floaters) { f.y -= 1.1; f.life--; }
        this.floaters = this.floaters.filter((f) => f.life > 0);
        for (const s of this.sprites) s.t++;
        this.sprites = this.sprites.filter((s) => s.t < 24);
        for (const f of this.flyers) {
            f.t += 1 / 36;
            if (f.t >= 1 && !f.done) {
                f.done = true;
                const box = f.el.closest('.sj-hud__item');
                if (box) {
                    box.classList.remove('is-bump');
                    void box.offsetWidth;
                    box.classList.add('is-bump');
                }
            }
        }
        this.flyers = this.flyers.filter((f) => f.t < 1);
        if (this.shake > 0) this.shake--;
        if (this.power.superJump > 0) {
            this.power.superJump--;
            if (this.power.superJump % 4 === 0) {
                const p = this.player;
                this.particles.push({
                    x: p.x + p.width / 2 + (Math.random() - 0.5) * 30, y: p.y + p.height - 4,
                    vx: (Math.random() - 0.5) * 0.6, vy: -0.8 - Math.random(), g: -0.01,
                    life: 30, max: 30, size: 5, color: '#5CFF7A',
                });
            }
            if (this.power.superJump === 0) this.toast('Super skok skončil');
        }
    };

    /** Kreslenie efektov vo svete (volá sa v transformácii kamery). */
    proto.fxDrawWorld = function () {
        const ctx = this.ctx;
        for (const s of this.sprites) {
            const list = FX_IMG[s.kind];
            const im = list && list[Math.min(list.length - 1, Math.floor(s.t / (24 / list.length)))];
            if (im && im.complete && im.naturalWidth) {
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(im, s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
            }
        }
        for (const p of this.particles) {
            ctx.globalAlpha = Math.max(0, Math.min(1, p.life / (p.max * 0.6)));
            ctx.fillStyle = p.color;
            if (p.square) {
                ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
        ctx.textAlign = 'center';
        ctx.font = '28px "Luckiest Guy", sans-serif';
        ctx.lineJoin = 'round';
        for (const f of this.floaters) {
            ctx.globalAlpha = Math.min(1, f.life / 20);
            ctx.lineWidth = 6;
            ctx.strokeStyle = '#000';
            ctx.strokeText(f.text, f.x, f.y);
            ctx.fillStyle = f.color;
            ctx.fillText(f.text, f.x, f.y);
        }
        ctx.globalAlpha = 1;
        // žiara power-upu okolo postavy
        if (this.power.superJump > 0) {
            const p = this.player;
            const blink = this.power.superJump < 120 && Math.floor(this.power.superJump / 8) % 2;
            if (!blink) {
                const g = ctx.createRadialGradient(p.x + p.width / 2, p.y + p.height / 2, 8, p.x + p.width / 2, p.y + p.height / 2, 60);
                g.addColorStop(0, 'rgba(92,255,122,0.35)');
                g.addColorStop(1, 'rgba(92,255,122,0)');
                ctx.fillStyle = g;
                ctx.fillRect(p.x - 50, p.y - 40, p.width + 100, p.height + 80);
            }
        }
    };

    /** Kreslenie na obrazovke (mimo kamery) – mince letiace do počítadla. */
    proto.fxDrawScreen = function () {
        const ctx = this.ctx;
        for (const f of this.flyers) {
            const t = f.t;
            const e = t * t * (3 - 2 * t);
            const x = f.sx + (f.tx - f.sx) * e;
            const y = f.sy + (f.ty - f.sy) * e - Math.sin(t * Math.PI) * 120;
            const size = (34 - 10 * t) * (this.scale / 1.6);
            if (f.kind === 'heart') {
                ctx.font = `${Math.round(size * 1.2)}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#ff4d5e';
                ctx.fillText('❤', x, y);
                ctx.textBaseline = 'alphabetic';
            } else {
                this.coinAnimationManager.draw(ctx, f.kind, x - size / 2, y - size / 2, size);
            }
        }
    };

    /**
     * Spätná väzba ako v iných cvičeniach: stmavená rozmazaná obrazovka,
     * veľká ikona ✓ / ✗ a text. Vráti Promise po skončení.
     */
    proto.feedback = function (ok, text, ms = 1300) {
        sfx(ok ? 'correct' : 'wrong');
        let el = document.getElementById('sjFeedback');
        if (!el) {
            el = document.createElement('div');
            el.id = 'sjFeedback';
            el.className = 'sj-feedback';
            (document.getElementById('bj-stage') || document.body).appendChild(el);
        }
        el.innerHTML = `<img src="images/${ok ? 'spravne' : 'nespravne'}.png" alt=""><div class="sj-feedback__text"></div>`;
        el.querySelector('.sj-feedback__text').textContent = text;
        el.className = 'sj-feedback is-visible ' + (ok ? 'is-ok' : 'is-bad');
        try { window.BJ && window.BJ.say(text); } catch (e) { /* bez hlasu */ }
        return new Promise((resolve) => setTimeout(() => {
            el.className = 'sj-feedback';
            setTimeout(resolve, 200);
        }, ms));
    };

    // ---------- drahokamy a mince ----------

    /** Zlatá minca. */
    proto.fxCoin = function (coin) {
        const cx = coin.x + coin.width / 2;
        const cy = coin.y + coin.height / 2;
        sfx('coin');
        this.spriteFx('coin', cx, cy, 48);
        this.floatText(cx, cy - 16, '+1');
        this.flyToHud(cx, cy, 'hudCoins', 'gold');
    };

    /**
     * Efekty drahokamov:
     *  - modrý: rečové cvičenie (modré iskry),
     *  - zelený: SUPER SKOK na 12 s (vyšší skok, zelená žiara),
     *  - červený: +1 život (srdce letí do počítadla, max. 5).
     */
    proto.fxGem = function (type, x, y) {
        sfx('gem');
        this.spriteFx('gem', x, y, 64);
        if (type === 'blueDiamond') {
            this.burst(x, y, ['#4FC3F7', '#B3E5FC', '#FFFFFF'], 18, 3.6);
        } else if (type === 'greenDiamond' || type === 'powerup') {
            this.burst(x, y, ['#5CFF7A', '#B9FFC6', '#FFFFFF'], 22, 4);
            this.power.superJump = 60 * 12;
            this.floatText(x, y - 20, 'SUPER SKOK!', '#5CFF7A');
            this.toast('Super skok! Skáčeš vyššie');
        } else if (type === 'redDiamond' || type === 'extraLife') {
            this.burst(x, y, ['#FF5A6E', '#FFB3BD', '#FFFFFF'], 22, 4);
            if (this.lives < 5) {
                this.lives++;
                this.floatText(x, y - 20, '+1 ŽIVOT', '#FF5A6E');
                this.flyToHud(x, y, 'hudLives', 'heart');
            } else {
                this.floatText(x, y - 20, 'PLNÉ ŽIVOTY', '#FF5A6E');
            }
        }
    };
})();

/**
 * Pixel Adventure: ovocie (namiesto mincí), štart, trofej v cieli, konfety,
 * efekt zberu ovocia a prach zo sprite-u balíka.
 */
(function () {
    const proto = Game.prototype;
    const SP = () => window.SJSprites;

    /** Ovocie sa mierne vznáša; vráti false, ak sprite ešte nie je načítaný. */
    proto.drawFruit = function (coin) {
        const sp = SP();
        if (!sp || !sp.ready(coin.fruit)) return false;
        const t = (this.tick || 0) + coin.x * 0.13;
        const y = coin.y + coin.height / 2 - 32 + Math.sin(t * 0.06) * 3;
        return sp.draw(this.ctx, coin.fruit, t / 3, coin.x + coin.width / 2 - 32, y, 64, 64);
    };

    proto.drawStart = function () {
        const L = this.currentLevelData;
        const sp = SP();
        if (!L.spawn || !L.tilemap || !sp) return;
        if (!L.tilemap.def.objects.some((o) => o.t === 'P')) return;
        const x = L.spawn.x + 16 - 64 - 70;
        const y = L.spawn.y + 64 - 128;
        sp.draw(this.ctx, 'start', (this.tick || 0) / 3, x, y, 128, 128);
    };

    proto.drawTrophy = function (e) {
        const sp = SP();
        if (!sp) return;
        if (e.pressedT != null) {
            e.pressedT++;
            sp.draw(this.ctx, 'endPressed', Math.min(7, e.pressedT / 3), e.x, e.y, e.width, e.height);
        } else {
            sp.draw(this.ctx, 'endIdle', 0, e.x, e.y + Math.sin((this.tick || 0) * 0.05) * 2, e.width, e.height);
        }
    };

    /** Konfety pri výhre (snímky sprite-u Confetti ako častice). */
    proto.confetti = function (x, y, n = 40) {
        for (let i = 0; i < n; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 9,
                vy: -5 - Math.random() * 7,
                g: 0.18,
                life: 90 + Math.random() * 40,
                max: 0,
                size: 20,
                sprite: 'confetti',
                frame: Math.floor(Math.random() * 6),
                spin: (Math.random() - 0.5) * 0.3,
            });
        }
    };

    // zber ovocia: efekt „Collected“, „+1“ a let do počítadla
    const origCoin = proto.fxCoin;
    proto.fxCoin = function (coin) {
        if (!coin.fruit) return origCoin.call(this, coin);
        const cx = coin.x + coin.width / 2;
        const cy = coin.y + coin.height / 2;
        window.SJSound && window.SJSound('coin');
        this.sprites.push({ kind: 'pa:collected', x: cx, y: cy, size: 64, t: 0 });
        this.floatText(cx, cy - 20, '+1');
        this.flyToHud(cx, cy, 'hudCoins', 'fruit:' + coin.fruit);
    };

    // prach zo sprite-u balíka
    proto.dust = function (x, y, n = 6) {
        for (let i = 0; i < n; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20, y: y - 6,
                vx: (Math.random() - 0.5) * 2.2, vy: -Math.random() * 1.2,
                g: 0.01, life: 22 + Math.random() * 10, max: 0,
                size: 18 + Math.random() * 10, sprite: 'dustParticle', frame: 0,
            });
        }
    };

    // kreslenie: sprite efekty a častice zo sprite-ov
    const origWorld = proto.fxDrawWorld;
    proto.fxDrawWorld = function () {
        const sp = SP();
        const ctx = this.ctx;
        // efekty zo sprite-ov PA (pa:názov) – ostatné kreslí pôvodná funkcia
        const pa = this.sprites.filter((s) => s.kind.startsWith('pa:'));
        this.sprites = this.sprites.filter((s) => !s.kind.startsWith('pa:'));
        const spriteParts = this.particles.filter((p) => p.sprite);
        this.particles = this.particles.filter((p) => !p.sprite);
        origWorld.call(this);
        this.particles.push(...spriteParts);
        this.sprites.push(...pa);
        if (!sp) return;
        for (const s of pa) {
            const name = s.kind.slice(3);
            const n = sp.frames(name);
            sp.draw(ctx, name, Math.min(n - 1, (s.t / 24) * n), s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
        }
        for (const p of spriteParts) {
            ctx.globalAlpha = Math.max(0, Math.min(1, p.life / ((p.max || p.life) * 0.6)));
            if (p.spin) {
                p.rot = (p.rot || 0) + p.spin;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                sp.draw(ctx, p.sprite, p.frame, -p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            } else {
                sp.draw(ctx, p.sprite, p.frame, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            }
        }
        ctx.globalAlpha = 1;
    };

    // ovocie letiace do počítadla
    const origScreen = proto.fxDrawScreen;
    proto.fxDrawScreen = function () {
        const sp = SP();
        const fruits = this.flyers.filter((f) => f.kind.startsWith('fruit:'));
        this.flyers = this.flyers.filter((f) => !f.kind.startsWith('fruit:'));
        origScreen.call(this);
        this.flyers.push(...fruits);
        if (!sp) return;
        for (const f of fruits) {
            const t = f.t;
            const e = t * t * (3 - 2 * t);
            const x = f.sx + (f.tx - f.sx) * e;
            const y = f.sy + (f.ty - f.sy) * e - Math.sin(t * Math.PI) * 120;
            const size = (70 - 26 * t) * (this.scale / 1.6);
            sp.draw(this.ctx, f.kind.slice(6), (this.tick || 0) / 3, x - size / 2, y - size / 2, size, size);
        }
    };
})();

/** Cieľ s trofejou: stlačenie trofeje, konfety, potom okno s výsledkom. */
(function () {
    const proto = Game.prototype;
    const origFinish = proto.checkFinish;
    proto.checkFinish = function () {
        if (this.finishing) return;
        const e = this.currentLevelData.endPoint;
        if (e && e.paEnd && this.collectedDiamonds >= this.requiredDiamonds && this.checkCollision(this.player, e)) {
            this.finishing = true;
            e.pressedT = 0;
            this.confetti(e.x + e.width / 2, e.y + 40, 50);
            window.SJSound && window.SJSound('correct');
            setTimeout(() => this.showLevelComplete(), 1400);
            return;
        }
        return origFinish.call(this);
    };
})();
