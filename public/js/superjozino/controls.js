/**
 * Super Jožino – ovládanie (dotyk aj klávesnica).
 *
 * Dotyk (prispôsobené malým deťom):
 *  - ĽAVÁ polovica obrazovky = pohyb. Dve veľké šípky ◀ ▶, ale počíta sa celá
 *    plocha: prst vľavo od stredu medzi šípkami = doľava, vpravo = doprava.
 *    Prst sa dá posúvať zo šípky na šípku bez zdvihnutia.
 *  - PRAVÁ polovica obrazovky = skok (ťuknutie kdekoľvek, nielen na tlačidlo).
 *  - Funguje viac prstov naraz (beh + skok).
 * Klávesnica: šípky / A D, skok medzerník / šípka hore / W.
 *
 * Stav je v window.SJInput: { left, right, jump, jumpPressed }.
 * jumpPressed = jednorazový impulz (hra ho po spracovaní zmaže).
 */
(function () {
    const input = { left: false, right: false, jump: false, jumpPressed: false };
    window.SJInput = input;

    const keys = new Set();
    function syncKeys() {
        input.keyLeft = keys.has('ArrowLeft') || keys.has('KeyA');
        input.keyRight = keys.has('ArrowRight') || keys.has('KeyD');
        input.keyJump = keys.has('Space') || keys.has('ArrowUp') || keys.has('KeyW');
        update();
    }

    // dotykové prsty: pointerId -> { zone: 'move'|'jump', x }
    const pointers = new Map();
    let moveDir = 0;
    let touchJump = false;

    function update() {
        const wasJump = input.jump;
        input.left = !!input.keyLeft || moveDir < 0;
        input.right = !!input.keyRight || moveDir > 0;
        input.jump = !!input.keyJump || touchJump;
        if (input.jump && !wasJump) input.jumpPressed = true;
    }

    window.addEventListener('keydown', (e) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) e.preventDefault();
        if (e.repeat) return;
        keys.add(e.code);
        syncKeys();
    });
    window.addEventListener('keyup', (e) => {
        keys.delete(e.code);
        syncKeys();
    });
    // stratené okno = pustiť všetko (inak by postava bežala ďalej)
    window.addEventListener('blur', () => {
        keys.clear();
        pointers.clear();
        moveDir = 0;
        touchJump = false;
        syncKeys();
        render();
    });

    let pad, btnL, btnR, btnJump, layer;

    /** Smer podľa polohy prsta voči stredu medzi šípkami (s malou mŕtvou zónou). */
    function dirFromX(clientX) {
        const rl = btnL.getBoundingClientRect();
        const rr = btnR.getBoundingClientRect();
        const mid = (rl.right + rr.left) / 2;
        const dead = Math.max(4, (rr.left - rl.right) / 4);
        if (clientX < mid - dead) return -1;
        if (clientX > mid + dead) return 1;
        return moveDir; // v mŕtvej zóne drží predchádzajúci smer
    }

    function recompute() {
        let dir = 0;
        let jump = false;
        for (const p of pointers.values()) {
            if (p.zone === 'move') dir = p.dir;
            else jump = true;
        }
        moveDir = dir;
        touchJump = jump;
        update();
        render();
    }

    function render() {
        if (!btnL) return;
        btnL.classList.toggle('is-active', moveDir < 0);
        btnR.classList.toggle('is-active', moveDir > 0);
        btnJump.classList.toggle('is-active', touchJump);
    }

    function onDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        // tlačidlá v hornej lište (späť, nastavenia) a okná majú prednosť
        if (e.target.closest('.sj-topbar, .speech-modal, .modal, #zvuky, .bj-modal, .bj-settings')) return;
        const zone = e.clientX < window.innerWidth / 2 ? 'move' : 'jump';
        const p = { zone, dir: 0 };
        if (zone === 'move') {
            moveDir = 0;
            p.dir = dirFromX(e.clientX);
        }
        pointers.set(e.pointerId, p);
        try { layer.setPointerCapture(e.pointerId); } catch (err) { /* nič */ }
        e.preventDefault();
        recompute();
    }

    function onMove(e) {
        const p = pointers.get(e.pointerId);
        if (!p || p.zone !== 'move') return;
        const d = dirFromX(e.clientX);
        if (d !== p.dir) {
            p.dir = d;
            recompute();
        }
    }

    function onUp(e) {
        if (!pointers.has(e.pointerId)) return;
        pointers.delete(e.pointerId);
        recompute();
    }

    function init() {
        pad = document.getElementById('sjControls');
        layer = document.getElementById('sjTouchLayer');
        btnL = document.getElementById('sjLeft');
        btnR = document.getElementById('sjRight');
        btnJump = document.getElementById('sjJump');
        if (!layer || !btnL || !btnR || !btnJump) return;
        layer.addEventListener('pointerdown', onDown);
        layer.addEventListener('pointermove', onMove);
        layer.addEventListener('pointerup', onUp);
        layer.addEventListener('pointercancel', onUp);
        layer.addEventListener('lostpointercapture', onUp);
        // žiadne kontextové menu / lupa pri dlhom podržaní
        layer.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /** Pustiť všetky vstupy (napr. keď sa otvorí okno s cvičením). */
    window.SJInput.reset = function () {
        keys.clear();
        pointers.clear();
        moveDir = 0;
        touchJump = false;
        input.keyLeft = input.keyRight = input.keyJump = false;
        input.left = input.right = input.jump = input.jumpPressed = false;
        render();
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
