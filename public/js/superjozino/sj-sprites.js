/**
 * Super Jožino – sprite-y z balíka Pixel Adventure 1 a 2 (Pixel Frog).
 * Súbory: public/images/superjozino/pa/ (pôvodné názvy zjednodušené).
 *
 * Každý sprite je pás snímok rovnakej veľkosti. SJSprites.draw() vykreslí
 * snímku podľa času (alebo zadaného indexu), voliteľne zrkadlovo.
 * Pixel art sa kreslí 2× (16 px dlaždica = 32 jednotiek sveta).
 */
(function () {
    const BASE = 'images/superjozino/pa/';
    const PX = 2; // mierka pixel artu vo svete

    /** názov: [cesta, šírka snímky, výška snímky, počet snímok] */
    const DEF = {
        // ovocie (namiesto mincí) a efekt zberu
        apple: ['items/fruits/apple.png', 32, 32, 17],
        bananas: ['items/fruits/bananas.png', 32, 32, 17],
        cherries: ['items/fruits/cherries.png', 32, 32, 17],
        kiwi: ['items/fruits/kiwi.png', 32, 32, 17],
        melon: ['items/fruits/melon.png', 32, 32, 17],
        orange: ['items/fruits/orange.png', 32, 32, 17],
        pineapple: ['items/fruits/pineapple.png', 32, 32, 17],
        strawberry: ['items/fruits/strawberry.png', 32, 32, 17],
        collected: ['items/fruits/collected.png', 32, 32, 6],
        // krabice
        box1: ['items/boxes/box1/idle.png', 28, 24, 1],
        box1Hit: ['items/boxes/box1/hit.png', 28, 24, 3],
        box1Break: ['items/boxes/box1/break.png', 28, 24, 4],
        box2: ['items/boxes/box2/idle.png', 28, 24, 1],
        box2Hit: ['items/boxes/box2/hit.png', 28, 24, 4],
        box2Break: ['items/boxes/box2/break.png', 28, 24, 4],
        box3: ['items/boxes/box3/idle.png', 28, 24, 1],
        box3Hit: ['items/boxes/box3/hit.png', 28, 24, 2],
        box3Break: ['items/boxes/box3/break.png', 28, 24, 4],
        // checkpointy, štart, cieľ
        start: ['items/checkpoints/start/start-moving.png', 64, 64, 17],
        startIdle: ['items/checkpoints/start/start-idle.png', 64, 64, 1],
        endIdle: ['items/checkpoints/end/end-idle.png', 64, 64, 1],
        endPressed: ['items/checkpoints/end/end-pressed.png', 64, 64, 8],
        // efekty
        appearing: ['main-characters/appearing.png', 96, 96, 7],
        desappearing: ['main-characters/desappearing.png', 96, 96, 7],
        confetti: ['other/confetti.png', 16, 16, 6],
        dustParticle: ['other/dust-particle.png', 16, 16, 1],
        // pasce a plošiny
        trampoline: ['traps/trampoline/idle.png', 28, 28, 1],
        trampolineJump: ['traps/trampoline/jump.png', 28, 28, 8],
        fallingOn: ['traps/falling-platforms/on.png', 32, 10, 4],
        fallingOff: ['traps/falling-platforms/off.png', 32, 10, 1],
        brownOn: ['traps/platforms/brown-on.png', 32, 8, 8],
        greyOn: ['traps/platforms/grey-on.png', 32, 8, 8],
        chain: ['traps/platforms/chain.png', 8, 8, 1],
        spikes: ['traps/spikes/idle.png', 16, 16, 1],
        sawOn: ['traps/saw/on.png', 38, 38, 8],
        sawChain: ['traps/saw/chain.png', 8, 8, 1],
        fireOff: ['traps/fire/off.png', 16, 32, 1],
        fireHit: ['traps/fire/hit.png', 16, 32, 4],
        fireOn: ['traps/fire/on.png', 16, 32, 3],
        fanOn: ['traps/fan/on.png', 24, 8, 4],
        arrowIdle: ['traps/arrow/idle.png', 18, 18, 10],
        arrowHit: ['traps/arrow/hit.png', 18, 18, 4],
        blockIdle: ['traps/blocks/idle.png', 22, 22, 1],
        blockHit: ['traps/blocks/hittop.png', 22, 22, 3],
        blockPart1: ['traps/blocks/part-1.png', 22, 22, 3],
        blockPart2: ['traps/blocks/part-2.png', 22, 22, 3],
        ice: ['traps/sand-mud-ice/sand-mud-ice.png', 16, 6, 1],
        // nepriatelia (Pixel Adventure 2)
        mushroomRun: ['enemies/mushroom/run.png', 32, 32, 16],
        mushroomHit: ['enemies/mushroom/hit.png', 32, 32, 5],
        chickenRun: ['enemies/chicken/run.png', 32, 34, 14],
        chickenHit: ['enemies/chicken/hit.png', 32, 34, 5],
        snailWalk: ['enemies/snail/walk.png', 38, 24, 10],
        snailHit: ['enemies/snail/hit.png', 38, 24, 5],
        slimeRun: ['enemies/slime/idle-run.png', 44, 30, 10],
        slimeHit: ['enemies/slime/hit.png', 44, 30, 5],
        bunnyRun: ['enemies/bunny/run.png', 34, 44, 12],
        bunnyHit: ['enemies/bunny/hit.png', 34, 44, 5],
        radishRun: ['enemies/radish/run.png', 30, 38, 12],
        radishHit: ['enemies/radish/hit.png', 30, 38, 5],
        pigWalk: ['enemies/angrypig/walk.png', 36, 30, 16],
        pigHit: ['enemies/angrypig/hit-1.png', 36, 30, 5],
        birdFly: ['enemies/bluebird/flying.png', 32, 32, 9],
        birdHit: ['enemies/bluebird/hit.png', 32, 32, 5],
        beeIdle: ['enemies/bee/idle.png', 36, 34, 6],
        beeHit: ['enemies/bee/hit.png', 36, 34, 5],
        rinoRun: ['enemies/rino/run.png', 52, 34, 6],
        rinoIdle: ['enemies/rino/idle.png', 52, 34, 11],
        rinoHit: ['enemies/rino/hit.png', 52, 34, 5],
        turtleIdle: ['enemies/turtle/idle-1.png', 44, 26, 14],
        turtleSpikesOut: ['enemies/turtle/spikes-out.png', 44, 26, 8],
        turtleSpikesIn: ['enemies/turtle/spikes-in.png', 44, 26, 8],
        turtleSpiked: ['enemies/turtle/idle-2.png', 44, 26, 14],
        turtleHit: ['enemies/turtle/hit.png', 44, 26, 5],
    };

    const cache = {};
    function img(name) {
        if (cache[name]) return cache[name];
        const d = DEF[name];
        if (!d) return null;
        const im = new Image();
        im.src = BASE + d[0];
        cache[name] = im;
        return im;
    }
    // načítať všetko vopred (malé súbory)
    Object.keys(DEF).forEach(img);

    window.SJSprites = {
        PX,
        DEF,
        /** veľkosť snímky vo svete */
        size(name) {
            const d = DEF[name];
            return d ? [d[1] * PX, d[2] * PX] : [0, 0];
        },
        frames(name) {
            return DEF[name] ? DEF[name][3] : 1;
        },
        ready(name) {
            const im = img(name);
            return !!(im && im.complete && im.naturalWidth);
        },
        /**
         * Vykreslí snímku. frame: číslo snímky (zaokrúhli sa, cyklí sa).
         * x, y = ľavý horný roh; w, h voliteľne (inak 2× veľkosť snímky).
         */
        draw(ctx, name, frame, x, y, w, h, flip = false) {
            const d = DEF[name];
            const im = img(name);
            if (!d || !im || !im.complete || !im.naturalWidth) return false;
            const n = d[3];
            const f = ((Math.floor(frame) % n) + n) % n;
            w = w || d[1] * PX;
            h = h || d[2] * PX;
            ctx.imageSmoothingEnabled = false;
            if (flip) {
                ctx.save();
                ctx.translate(x + w, y);
                ctx.scale(-1, 1);
                ctx.drawImage(im, f * d[1], 0, d[1], d[2], 0, 0, w, h);
                ctx.restore();
            } else {
                ctx.drawImage(im, f * d[1], 0, d[1], d[2], x, y, w, h);
            }
            return true;
        },
        /** Časť obrázka (napr. kúsok ľadu zo sprite-u Sand Mud Ice). */
        drawPart(ctx, name, sx, sy, sw, sh, x, y, w, h) {
            const im = img(name);
            if (!im || !im.complete || !im.naturalWidth) return false;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(im, sx, sy, sw, sh, x, y, w, h);
            return true;
        },
        image: img,
    };
})();
