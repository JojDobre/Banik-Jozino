/**
 * Super Jožino – nové bloky a kolízie.
 *
 * Bloky v leveli (pole `blocks` v js/superjozino/levels.js):
 *  - bonus:  zlatá kocka; úder hlavou zdola = vyskočí minca (potom sivá)
 *  - brick:  tehla; úder hlavou zdola = rozbije sa
 *  - spring: pružina; skok na ňu vystrelí postavu vysoko
 *  - mover:  drevená plošina, ktorá sa hýbe (vodorovne `dx` alebo zvislo `dy`)
 *            a vezie postavu so sebou
 *  - faller: železná plošina; keď na ňu postava stúpi, zatrasie sa a spadne
 *            (o chvíľu sa vráti)
 *
 * Rozširuje triedu Game (načítava sa po game.js).
 */
(function () {
    const BLOCK = 40; // veľkosť bonusového bloku a tehly vo svete
    const SPRING_FORCE = -19;

    const proto = Game.prototype;

    /** Príprava blokov pri načítaní levelu. */
    proto.blocksInit = function () {
        const L = this.currentLevelData;
        L.blocks = (L.blocks || []).map((b) => {
            const o = { ...b, kind: b.type };
            if (o.kind === 'bonus' || o.kind === 'brick') {
                o.width = BLOCK;
                o.height = BLOCK;
            } else if (o.kind === 'spring') {
                o.width = 44;
                o.height = 26;
            } else {
                o.width = o.width || 110;
                o.height = 12;
            }
            o.x0 = o.x;
            o.y0 = o.y;
            o.t = 0;
            o.dx = 0;
            o.dy = 0;
            o.bump = 0;
            o.state = 'idle';
            return o;
        });
        this.bonusCoins = L.blocks.filter((b) => b.kind === 'bonus').length;
    };

    proto.blocksUpdate = function () {
        const L = this.currentLevelData;
        const p = this.player;
        for (const b of L.blocks) {
            if (b.bump > 0) b.bump--;
            if (b.squash > 0) b.squash--;
            if (b.kind === 'mover') {
                b.t++;
                const speed = b.speed || 0.012;
                const nx = b.x0 + (b.dxRange ? Math.sin(b.t * speed) * b.dxRange : 0);
                const ny = b.y0 + (b.dyRange ? Math.sin(b.t * speed) * b.dyRange : 0);
                b.dx = nx - b.x;
                b.dy = ny - b.y;
                b.x = nx;
                b.y = ny;
            } else if (b.kind === 'faller') {
                b.dx = 0;
                b.dy = 0;
                if (b.state === 'shake') {
                    b.t++;
                    if (b.t > 32) { b.state = 'fall'; b.vy = 0; }
                } else if (b.state === 'fall') {
                    b.vy = Math.min(12, b.vy + 0.35);
                    b.dy = b.vy;
                    b.y += b.vy;
                    if (b.y > this.worldH + 300) { b.state = 'gone'; b.t = 0; }
                } else if (b.state === 'gone') {
                    b.t++;
                    if (b.t > 200) {
                        b.state = 'idle';
                        b.x = b.x0;
                        b.y = b.y0;
                        b.t = 0;
                        this.burst(b.x + b.width / 2, b.y + 6, ['#cfd8dc', '#ffffff'], 10, 2, { gravity: 0 });
                    }
                }
            }
        }
        // stojí na padajúcej plošine → spustiť
        if (p.standOn && p.standOn.kind === 'faller' && p.standOn.state === 'idle') {
            p.standOn.state = 'shake';
            p.standOn.t = 0;
        }
    };

    function solidKinds(b) {
        return b.kind === 'bonus' || b.kind === 'brick';
    }

    /**
     * Kolízie po osiach (nahrádza verziu z game.js – pribudli bloky).
     * Zem, steny, bonusové bloky a tehly sú pevné; plošiny, pohyblivé
     * a padajúce plošiny a pružina sú „priechodné“ zdola.
     */
    proto.moveAndCollide = function () {
        const p = this.player;
        const L = this.currentLevelData;

        // vezenie na pohyblivej / padajúcej plošine
        if (p.standOn && (p.standOn.kind === 'mover' || p.standOn.kind === 'faller')) {
            p.x += p.standOn.dx;
            p.y += p.standOn.dy;
        }

        const near = (r) => r.x < p.x + p.width + 60 && r.x + r.width > p.x - 60;
        const solids = [];
        for (const pl of L.platforms) if (near(pl)) solids.push(pl);
        for (const w of L.walls) if (near(w)) solids.push(w);
        for (const b of L.blocks || []) {
            if (b.state === 'gone' || (b.kind === 'brick' && b.broken)) continue;
            if (near(b)) solids.push(b);
        }
        const oneWay = (r) => r.type === 'platform' || r.kind === 'mover' || r.kind === 'faller' || r.kind === 'spring';
        const overlap = (r) => p.x < r.x + r.width && p.x + p.width > r.x && p.y < r.y + r.height && p.y + p.height > r.y;

        // vodorovne
        p.x += p.velocityX;
        for (const r of solids) {
            if (oneWay(r) || !overlap(r)) continue;
            if (p.y + p.height - r.y <= 6) continue; // schodík
            if (p.velocityX > 0) p.x = r.x - p.width;
            else if (p.velocityX < 0) p.x = r.x + r.width;
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
        let headHit = null;
        for (const r of solids) {
            if (!overlap(r)) continue;
            // pohyblivá plošina ide hore – tolerancia podľa jej pohybu
            const tol = 2 + Math.max(0, -(r.dy || 0)) + (r.kind === 'mover' ? 4 : 0);
            // pružina: stačí na ňu vojsť alebo skočiť (nohy v jej výške)
            if (r.kind === 'spring' && p.velocityY >= 0 && prevBottom <= r.y + r.height + 1) {
                p.y = r.y - p.height;
                p.velocityY = SPRING_FORCE;
                p.isJumping = true;
                r.squash = 12;
                window.SJSound && window.SJSound('jump');
                this.burst(r.x + r.width / 2, r.y, ['#FFD900', '#ffffff'], 10, 2.4, { gravity: 0.05 });
                continue;
            }
            if (p.velocityY >= 0 && prevBottom <= r.y + tol) {
                p.y = r.y - p.height;
                p.velocityY = 0;
                p.onGround = true;
                p.isJumping = false;
                p.standOn = r.kind ? r : null;
            } else if (!oneWay(r) && p.velocityY < 0 && prevTop >= r.y + r.height - 2) {
                p.y = r.y + r.height;
                p.velocityY = 0;
                if (r.kind) headHit = headHit || r;
            }
        }
        if (headHit) this.hitBlock(headHit);

        // doskok – prach a „sadnutie“ postavy
        if (p.onGround && !wasGround && fallSpeed > 5) {
            this.dust(p.x + p.width / 2, p.y + p.height, 7);
            p.squash = 8;
        }

        // špeciálne bloky z pôvodných levelov (drahokam nad hlavou)
        if (p.velocityY < 0 || headHit) {
            for (const block of L.specialBlocks) {
                if (!block.hit && overlap(block)) {
                    block.hit = true;
                    this.collectSpecialItem(block.itemType, block);
                }
            }
        }
    };

    /** Úder hlavou do bloku. */
    proto.hitBlock = function (b) {
        if (b.kind === 'bonus') {
            b.bump = 10;
            if (b.used) {
                window.SJSound && window.SJSound('stomp');
                return;
            }
            b.used = true;
            this.collectedCoins++;
            const cx = b.x + b.width / 2;
            this.fxCoin({ x: b.x, y: b.y - BLOCK, width: BLOCK, height: BLOCK });
            this.burst(cx, b.y, ['#FFD900', '#FFF59D'], 10, 2.6, { up: 2 });
        } else if (b.kind === 'brick') {
            b.broken = true;
            b.state = 'gone';
            window.SJSound && window.SJSound('brick');
            this.shake = 6;
            this.burst(b.x + b.width / 2, b.y + b.height / 2, ['#c0392b', '#e57368', '#7f2a1f'], 16, 4.2, { up: 3, square: true, size: 7, gravity: 0.3 });
        }
    };

    /** Kreslenie blokov (vo svete). */
    proto.drawBlocks = function (visible) {
        const ctx = this.ctx;
        for (const b of this.currentLevelData.blocks || []) {
            if (b.state === 'gone' || !visible(b)) continue;
            const by = b.y - (b.bump > 0 ? Math.sin((b.bump / 10) * Math.PI) * 10 : 0);
            if (b.kind === 'bonus') {
                this.drawSprite(b.used ? 'ironSmall' : 'goldSmall', b.x, by, b.width, b.height);
                if (!b.used) {
                    // blikajúci otáznik – „tu niečo je“
                    const a = 0.65 + Math.sin(Date.now() / 220) * 0.35;
                    ctx.globalAlpha = a;
                    ctx.font = '26px "Luckiest Guy", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = '#5a3a00';
                    ctx.strokeText('?', b.x + b.width / 2, by + b.height - 9);
                    ctx.fillStyle = '#FFF8D0';
                    ctx.fillText('?', b.x + b.width / 2, by + b.height - 9);
                    ctx.globalAlpha = 1;
                }
            } else if (b.kind === 'brick') {
                this.drawSprite('brick', b.x, by, b.width, b.height);
                ctx.strokeStyle = '#2b1d14';
                ctx.lineWidth = 2;
                ctx.strokeRect(b.x + 1, by + 1, b.width - 2, b.height - 2);
            } else if (b.kind === 'spring') {
                this.drawSpring(b);
            } else if (b.kind === 'mover') {
                this.drawThinBar('woodBar', b.x, b.y, b.width, b.height);
            } else if (b.kind === 'faller') {
                const sx = b.state === 'shake' ? Math.sin(b.t * 1.7) * 2.5 : 0;
                this.drawThinBar('ironBar', b.x + sx, b.y, b.width, b.height);
            }
        }
    };

    /** Pružina (kreslená): podstavec, závity, červený vrch. */
    proto.drawSpring = function (b) {
        const ctx = this.ctx;
        const sq = b.squash > 0 ? Math.sin((b.squash / 12) * Math.PI) : 0;
        const h = b.height * (1 - sq * 0.45);
        const x = b.x;
        const bottom = b.y + b.height;
        // podstavec
        ctx.fillStyle = '#455a64';
        ctx.fillRect(x + 4, bottom - 6, b.width - 8, 6);
        // závity
        ctx.strokeStyle = '#cfd8dc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const turns = 4;
        for (let i = 0; i <= turns * 2; i++) {
            const yy = bottom - 6 - ((h - 12) * i) / (turns * 2);
            const xx = i % 2 ? x + b.width - 10 : x + 10;
            if (i === 0) ctx.moveTo(xx, yy);
            else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
        // vrch
        const top = bottom - h;
        ctx.fillStyle = '#e53935';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, top, b.width, 8, 3) : ctx.rect(x, top, b.width, 8);
        ctx.fill();
        ctx.stroke();
    };
})();
