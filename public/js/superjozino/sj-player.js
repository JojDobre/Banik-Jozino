/**
 * Super Jožino – pohyb a animácie baníka (štýl Pixel Adventure).
 *
 *  - dvojitý skok (vo vzduchu ešte raz) so saltom
 *  - šmýkanie po stene: vo vzduchu pri stene so šípkou k stene sa šmýka
 *    pomaly dole (animácia vertical_slide); skok = odraz od steny
 *  - ľad: klzké, pri šmyku animácia horizontal_slide
 *  - zásah: animácia hurt; pád do diery: animácia die
 *  - štart a oživenie: efekt „objavenia sa“ (Appearing z Pixel Adventure)
 *
 * Nahrádza updatePlayer z game.js. Rozširuje triedu Game.
 */
(function () {
    const proto = Game.prototype;
    const DOUBLE_JUMP = -10;
    const WALL_SLIDE_MAX = 2.2;

    proto.updatePlayer = function () {
        const p = this.player;
        const inp = window.SJInput || {};
        const L = this.currentLevelData;

        if (p.appear > 0) {
            p.appear--;
            inp.jumpPressed = false;
            p.velocityX = 0;
            p.velocityY = 0;
            return;
        }

        // po oživení sa postava neovláda, kým nedopadne na zem
        if (p.locked) {
            if (p.onGround) p.locked = false;
            inp.jumpPressed = false;
            p.jumpBuffer = 0;
            p.coyote = 0;
        }
        if (p.wallJumpLock > 0) p.wallJumpLock--;
        if (p.hurtT > 0) p.hurtT--;
        if (p.spin > 0) p.spin--;

        if (this.finishing) {
            // v cieli – postava sa zastaví
            inp.jumpPressed = false;
            p.jumpBuffer = 0;
        }
        let dir = p.locked || this.finishing ? 0 : (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
        if (p.wallJumpLock > 0) dir = Math.sign(p.velocityX) || 0;

        const ice = p.onGround && p.surface === 'ice';
        if (dir !== 0) {
            const accel = ice ? 0.14 : p.onGround ? 0.75 : 0.5;
            const turning = Math.sign(p.velocityX) === -dir;
            p.velocityX += dir * accel * (turning && p.onGround && !ice ? 2 : 1);
            const max = ice ? p.speed * 1.25 : p.speed;
            if (Math.abs(p.velocityX) > max) p.velocityX = Math.sign(p.velocityX) * max;
            p.facing = dir;
        } else {
            p.velocityX *= ice ? 0.985 : p.onGround ? 0.7 : 0.9;
            if (Math.abs(p.velocityX) < 0.05) p.velocityX = 0;
        }
        p.sliding = ice && Math.abs(p.velocityX) > 2 && (dir === 0 || Math.sign(p.velocityX) !== dir);

        // šmýkanie po stene
        p.wallSlide = false;
        if (!p.onGround && !p.locked && p.velocityY > 0 && dir !== 0) {
            const probe = { x: p.x + (dir > 0 ? p.width : -2), y: p.y + 8, width: 2, height: p.height - 20 };
            const touching = this.solidsNear(10).some((r) => !Game.isOneWay(r) &&
                probe.x < r.x + r.width && probe.x + probe.width > r.x && probe.y < r.y + r.height && probe.y + probe.height > r.y);
            if (touching) {
                p.wallSlide = true;
                p.wallSide = dir;
                p.canDouble = true;
                if (p.velocityY > WALL_SLIDE_MAX) p.velocityY = WALL_SLIDE_MAX;
                if (this.tick % 6 === 0) this.dust(p.x + (dir > 0 ? p.width : 0), p.y + p.height - 10, 1);
            }
        }

        // skok, dvojitý skok, odraz od steny
        if (p.onGround) p.canDouble = true;
        p.coyote = p.onGround && !p.locked ? 7 : Math.max(0, p.coyote - 1);
        if (inp.jumpPressed) {
            p.jumpBuffer = 9;
            inp.jumpPressed = false;
        } else {
            p.jumpBuffer = Math.max(0, p.jumpBuffer - 1);
        }
        const boost = this.power && this.power.superJump > 0 ? 1.28 : 1;
        if (!p.locked && p.jumpBuffer > 0) {
            if (p.coyote > 0) {
                p.velocityY = p.jumpForce * boost;
                p.coyote = 0;
                p.jumpBuffer = 0;
                p.isJumping = true;
                p.onGround = false;
                if (window.SJSound) window.SJSound('jump');
                this.dust(p.x + p.width / 2, p.y + p.height, 4);
            } else if (p.wallSlide) {
                p.velocityY = p.jumpForce * 0.95 * boost;
                p.velocityX = -p.wallSide * 5.5;
                p.facing = -p.wallSide;
                p.wallJumpLock = 12;
                p.jumpBuffer = 0;
                p.wallSlide = false;
                if (window.SJSound) window.SJSound('jump');
                this.dust(p.x + (p.wallSide > 0 ? p.width : 0), p.y + p.height / 2, 4);
            } else if (p.canDouble) {
                p.velocityY = DOUBLE_JUMP * boost;
                p.canDouble = false;
                p.jumpBuffer = 0;
                p.spin = 20;
                if (window.SJSound) window.SJSound('jump');
                this.burst(p.x + p.width / 2, p.y + p.height, ['#ffffff', '#e0f0ff'], 8, 1.8, { gravity: 0.02 });
            }
        }

        // gravitácia (pri páde o niečo silnejšia)
        p.velocityY += p.velocityY > 0 ? this.gravity * 1.15 : this.gravity;
        if (p.velocityY > this.maxFallSpeed) p.velocityY = this.maxFallSpeed;

        this.moveAndCollide();

        if (p.x < 0) { p.x = 0; p.velocityX = 0; }
        if (p.x + p.width > L.width) { p.x = L.width - p.width; p.velocityX = 0; }

        // prach pri behu
        if (p.onGround && Math.abs(p.velocityX) > 3 && this.tick % 9 === 0) this.dust(p.x + p.width / 2, p.y + p.height, 1);
    };

    /** Výber animácie baníka. */
    proto.updatePlayerAnimation = function () {
        const p = this.player;
        const am = this.animationManager;
        if (p.facing > 0) am.setDirection('right');
        else if (p.facing < 0) am.setDirection('left');
        let a;
        if (this.deathAnimation.active) a = 'die';
        else if (p.hurtT > 0) a = 'hurt';
        else if (p.wallSlide) {
            a = 'vertical_slide';
            // sprite: stena je za chrbtom vľavo – pri stene vpravo zrkadlovo
            am.setDirection(p.wallSide > 0 ? 'left' : 'right');
        } else if (p.sliding) a = 'horizontal_slide';
        else if (!p.onGround) a = p.velocityY > 1.5 ? 'falling' : 'jump';
        else if (Math.abs(p.velocityX) > 3) a = 'run';
        else if (Math.abs(p.velocityX) > 0.3) a = 'walk';
        else a = 'idle';
        am.setAnimation(a);
        // „die“ sa neopakuje – zostane na poslednej snímke
        if (a === 'die' && am.currentFrame >= 4) return;
        am.update(1);
    };

    /** Kreslenie baníka (sadnutie, salto, objavenie sa). */
    proto.drawPlayer = function () {
        const p = this.player;
        const ctx = this.ctx;
        const sp = window.SJSprites;
        if (p.appear > 0) {
            // efekt objavenia (7 snímok, kým beží, postava nie je vidieť)
            const f = Math.floor((21 - p.appear) / 3);
            if (sp) sp.draw(ctx, 'appearing', f, p.x + p.width / 2 - 96, p.y + p.height - 144, 192, 192);
            return;
        }
        if (this.isInvulnerable) ctx.globalAlpha = Math.sin(Date.now() / 100) > 0 ? 1 : 0.35;
        let sx = 1;
        let sy = 1;
        if (p.squash > 0) {
            const k = Math.sin((p.squash / 8) * Math.PI);
            sx = 1 + k * 0.18;
            sy = 1 - k * 0.16;
            p.squash -= 0.5;
        } else if (!p.onGround && p.velocityY < -4 && !p.spin) {
            sx = 0.92;
            sy = 1.08;
        }
        const w = p.spriteWidth * sx;
        const h = p.spriteHeight * sy;
        const feetY = p.y + p.spriteOffsetY + p.spriteHeight;
        const cx = p.x + p.spriteOffsetX + p.spriteWidth / 2;
        if (p.spin > 0) {
            // salto pri dvojitom skoku
            const cy = feetY - h / 2;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(((20 - p.spin) / 20) * Math.PI * 2 * (p.facing || 1));
            this.animationManager.draw(ctx, -w / 2, -h / 2, w, h);
            ctx.restore();
        } else {
            this.animationManager.draw(ctx, cx - w / 2, feetY - h, w, h);
        }
        ctx.globalAlpha = 1;
    };

    /** Objavenie sa postavy (štart, oživenie). */
    proto.appearPlayer = function () {
        this.player.appear = 21;
        if (window.SJSound) window.SJSound('gem');
    };
})();
