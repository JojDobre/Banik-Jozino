/**
 * Builder levelov Super Jožina (builder.html).
 *
 * - kreslenie dlaždíc v 3 vrstvách (zadná / hlavná / predná – bloky cez seba),
 *   veľké bloky, objekty, pasce a nepriatelia
 * - teleportačné miestnosti s rámikom a vzorovaným pozadím; portál „O“
 *   vedie do miestnosti, portál v miestnosti s „Späť“ vráti hráča späť
 * - späť/znova, uloženie (localStorage 'sj.custom'), export/import JSON,
 *   predlohy z levelov v repozitári, tlačidlo Hrať (superjozino.html?custom=id)
 *
 * Formát levelu a vykreslenie: public/js/superjozino/sj-world.js (SJWorld).
 */
const W = window.SJWorld;
const SP = window.SJSprites;
const TS = W.TS;
const STORE_KEY = 'sj.custom';

// ---------------- obrázky mimo SJSprites ----------------
const IMG = (src) => { const i = new Image(); i.src = src; return i; };
const EXTRA = {
    miner: IMG('images/superjozino/assets/player/keyframes/yellow_hat/__yellow_hat_idle_000.png'),
    gemBlue: IMG('images/superjozino/assets/treasure/Blue Diamond/01.png'),
    gemGreen: IMG('images/superjozino/assets/treasure/Green Diamond/01.png'),
    gemRed: IMG('images/superjozino/assets/treasure/Red Diamond/01.png'),
    coinSilver: IMG('images/superjozino/assets/treasure/Silver Coin/01.png'),
    checkpoint: IMG('images/superjozino/pa/items/checkpoints/checkpoint/checkpoint-no-flag.png'),
};

// ---------------- úložisko ----------------
function loadStore() {
    try {
        const s = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
        return { levels: s.levels || {}, last: s.last || null };
    } catch {
        return { levels: {}, last: null };
    }
}
function saveStore() {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(store));
        return true;
    } catch (e) {
        status('<span class="bad">Uloženie zlyhalo (plné úložisko prehliadača).</span>');
        return false;
    }
}
const newId = () => 'lvl-' + Date.now().toString(36);

/** Nový level: zem dole, štart a cieľ. */
function starterLevel() {
    const def = W.blank({ cols: 80, rows: 20, name: 'Môj level' });
    for (let r = 15; r < 20; r++) def.layers.main[r] = '1'.repeat(80);
    def.objects.push({ t: 'P', c: 4, r: 14 }, { t: 'E', c: 74, r: 14 }, { t: 'D', c: 30, r: 11 });
    return def;
}

/** Nová miestnosť: rámik, vzor, portál späť. Veľkosť sa zmestí na obrazovku telefónu. */
const ROOM_BG = ['blue', 'yellow', 'green', 'pink', 'purple', 'gray', 'brown'];
function starterRoom(n) {
    const def = W.blank({ cols: 32, rows: 14, room: true, name: 'Miestnosť ' + n });
    def.id = 'room' + Date.now().toString(36);
    def.bg = ROOM_BG[(n - 1) % ROOM_BG.length];
    def.frame = ['stone', 'wood', 'green'][(n - 1) % 3];
    def.objects.push({ t: 'O', c: 3, r: 13, to: '' });
    return def;
}

// ---------------- stav ----------------
let store = loadStore();
let levelId = null;
let level = null;
let roomIdx = -1; // -1 = hlavný level
let layer = 'main';
let mode = 'paint';
let brush = { kind: 'tile', id: '1' };
let selected = null; // vybraný objekt
const view = { z: 0.75, ox: 40, oy: 40 };
let undoStack = [];
let redoStack = [];
let dirty = false;

const target = () => (roomIdx < 0 ? level : level.rooms[roomIdx]);

function openLevel(id, def) {
    levelId = id;
    level = W.normalize(JSON.parse(JSON.stringify(def)));
    level.rooms = level.rooms || [];
    roomIdx = -1;
    selected = null;
    undoStack = [];
    redoStack = [];
    fitView();
    refreshAll();
}

// ---------------- DOM ----------------
const $ = (id) => document.getElementById(id);
const canvas = $('bldCanvas');
const ctx = canvas.getContext('2d');
const dialog = $('bldDialog');
let dpr = 1;

function status(html) {
    $('bldStatus').innerHTML = html;
}

function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    requestRender();
}

function fitView() {
    const def = target();
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    const pad = def.frame ? TS : 0;
    const zx = (r.width - 40) / (def.cols * TS + 2 * pad);
    const zy = (r.height - 40) / (def.rows * TS + 2 * pad);
    view.z = Math.max(0.25, Math.min(1.5, Math.min(zy, zx < 0.5 ? zy : zx)));
    view.ox = 20 + pad * view.z;
    view.oy = Math.max(20, (r.height - def.rows * TS * view.z) / 2);
    requestRender();
}

// ---------------- kreslenie objektov (ako v hre) ----------------
function drawPortal(c, x, y, w, h, back) {
    const cx = x + w / 2;
    const cy = y + h / 2 + 6;
    const g = c.createRadialGradient(cx, cy, 4, cx, cy, 44);
    g.addColorStop(0, '#fff');
    g.addColorStop(0.35, back ? '#FFD900' : '#b388ff');
    g.addColorStop(0.8, back ? '#ff9800' : '#4fc3f7');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = '#3a2e4a';
    c.fillRect(cx - 34, y + h - 10, 68, 10);
    c.fillStyle = g;
    c.beginPath();
    c.ellipse(cx, cy, 32, 46, 0, 0, Math.PI * 2);
    c.fill();
}

function drawImg(c, im, x, y, w, h) {
    if (im && im.complete && im.naturalWidth) {
        c.imageSmoothingEnabled = false;
        c.drawImage(im, x, y, w, h);
    }
}

const ENEMY_ICON = { m: 'mushroomRun', c: 'chickenRun', n: 'snailWalk', s: 'slimeRun', b: 'bunnyRun', r: 'radishRun', p: 'pigWalk', u: 'birdFly', e: 'beeIdle', h: 'rinoIdle', t: 'turtleIdle' };

/** Objekt v súradniciach sveta (rovnaká poloha ako v hre). Vráti obdĺžnik. */
function drawObject(c, o) {
    const x = o.c * TS;
    const y = o.r * TS;
    const cx = x + 16;
    const cy = y + 16;
    const bottom = y + 32;
    let rect = { x, y, w: TS, h: TS };
    const sp = (name, rx, ry, rw, rh) => { SP.draw(c, name, 0, rx, ry, rw, rh); rect = { x: rx, y: ry, w: rw, h: rh }; };
    const line = (x1, y1, x2, y2) => {
        c.save();
        c.strokeStyle = 'rgba(255,255,255,0.8)';
        c.setLineDash([6, 6]);
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(x1, y1);
        c.lineTo(x2, y2);
        c.stroke();
        c.restore();
    };
    switch (o.t) {
        case 'P': drawImg(c, EXTRA.miner, cx - 48, bottom - 96, 96, 96); rect = { x: cx - 24, y: bottom - 72, w: 48, h: 72 }; break;
        case 'E': sp('endIdle', cx - 64, bottom - 128, 128, 128); break;
        case 'C': drawImg(c, EXTRA.checkpoint, cx - 64, bottom - 128, 128, 128); rect = { x: cx - 24, y: bottom - 96, w: 48, h: 96 }; break;
        case 'O': drawPortal(c, cx - 40, bottom - 112, 80, 112, !o.to || o.to === 'back'); rect = { x: cx - 40, y: bottom - 112, w: 80, h: 112 }; break;
        case 'o': sp('apple', cx - 32, cy - 32, 64, 64); rect = { x: cx - 18, y: cy - 18, w: 36, h: 36 }; break;
        case 'D': drawImg(c, EXTRA.gemBlue, cx - 28, cy - 28, 56, 56); rect = { x: cx - 28, y: cy - 28, w: 56, h: 56 }; break;
        case 'G': drawImg(c, EXTRA.gemGreen, cx - 28, cy - 28, 56, 56); rect = { x: cx - 28, y: cy - 28, w: 56, h: 56 }; break;
        case 'R': drawImg(c, EXTRA.gemRed, cx - 28, cy - 28, 56, 56); rect = { x: cx - 28, y: cy - 28, w: 56, h: 56 }; break;
        case 'L': drawImg(c, EXTRA.coinSilver, cx - 24, cy - 24, 48, 48); rect = { x: cx - 24, y: cy - 24, w: 48, h: 48 }; break;
        case 'X': sp(`box${o.variant || 1}`, cx - 28, bottom - 48, 56, 48); break;
        case 'B': sp('blockIdle', cx - 22, bottom - 44, 44, 44); break;
        case 'T': sp('trampoline', cx - 28, bottom - 56, 56, 56); break;
        case 'F': sp('fallingOn', cx - 32, y, 64, 20); break;
        case '~': { const r = (o.range ?? 3) * TS; line(cx - r, y + 8, cx + r, y + 8); sp('brownOn', cx - 32, y, 64, 16); break; }
        case '!': { const r = (o.range ?? 3) * TS; line(cx, y + 8 - r, cx, y + 8 + r); sp('greyOn', cx - 32, y, 64, 16); break; }
        case '^': sp('spikes', x, y, 32, 32); break;
        case 'S': {
            const r = (o.range ?? 3) * TS;
            if (o.vertical) line(cx, cy - r, cx, cy + r); else line(cx - r, cy, cx + r, cy);
            sp('sawOn', cx - 38, cy - 38, 76, 76);
            break;
        }
        case 'f': sp('fireOff', x, y - 32, 32, 64); break;
        case 'w': sp('fanOn', cx - 24, bottom - 16, 48, 16); break;
        case 'a': sp('arrowIdle', cx - 18, cy - 18, 36, 36); break;
        default: {
            const name = ENEMY_ICON[o.t];
            if (name) {
                const [w, h] = SP.size(name);
                if (o.t === 'u' || o.t === 'e') {
                    const r = (o.range ?? 3) * TS;
                    if (o.t === 'u') line(cx - r, cy, cx + r, cy); else line(cx, cy - r / 2, cx, cy + r / 2);
                }
                sp(name, cx - w / 2, bottom - h + 2, w, h);
            }
        }
    }
    return rect;
}

// ---------------- vykreslenie plochy ----------------
let renderQueued = false;
let hover = null; // { c, r }
let rectDrag = null; // { c0, r0, c1, r1 }

function requestRender() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => {
        renderQueued = false;
        render();
    });
}

function render() {
    const def = target();
    if (!def) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#211f30';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const z = view.z * dpr;
    ctx.setTransform(z, 0, 0, z, view.ox * dpr, view.oy * dpr);
    const Wd = def.cols * TS;
    const Hd = def.rows * TS;

    // pozadie levelu
    if (!def.bg || !W.drawPattern(ctx, def, 0)) {
        const g = ctx.createLinearGradient(0, 0, 0, Hd);
        g.addColorStop(0, '#7cc6ff');
        g.addColorStop(1, '#fff3c9');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, Wd, Hd);
    }

    // viditeľné dlaždice
    const r = canvas.getBoundingClientRect();
    const c0 = Math.floor(-view.ox / view.z / TS) - 1;
    const r0 = Math.floor(-view.oy / view.z / TS) - 1;
    const c1 = Math.ceil((r.width - view.ox) / view.z / TS) + 1;
    const r1 = Math.ceil((r.height - view.oy) / view.z / TS) + 1;
    const only = $('bldOnly').checked;
    for (const l of W.LAYERS) {
        ctx.globalAlpha = only && l !== layer ? 0.25 : l === 'back' ? 0.78 : 1;
        W.drawRegion(ctx, def, c0, r0, c1, r1, 0, 0, { layers: [l], dimBack: false });
    }
    ctx.globalAlpha = 1;
    W.drawFrame(ctx, def);

    // objekty
    for (const o of def.objects) {
        ctx.globalAlpha = only && layer !== 'main' ? 0.4 : 1;
        o._rect = drawObject(ctx, o);
    }
    ctx.globalAlpha = 1;

    // mriežka a okraj
    if ($('bldGrid').checked && view.z > 0.3) {
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1 / view.z;
        ctx.beginPath();
        for (let c = 0; c <= def.cols; c++) { ctx.moveTo(c * TS, 0); ctx.lineTo(c * TS, Hd); }
        for (let rr = 0; rr <= def.rows; rr++) { ctx.moveTo(0, rr * TS); ctx.lineTo(Wd, rr * TS); }
        ctx.stroke();
    }
    ctx.strokeStyle = '#ECCF17';
    ctx.lineWidth = 2 / view.z;
    ctx.strokeRect(0, 0, Wd, Hd);

    // výber
    if (selected && selected._rect) {
        const s = selected._rect;
        ctx.strokeStyle = '#FFD900';
        ctx.lineWidth = 3 / view.z;
        ctx.setLineDash([8 / view.z, 6 / view.z]);
        ctx.strokeRect(s.x - 4, s.y - 4, s.w + 8, s.h + 8);
        ctx.setLineDash([]);
    }

    // náhľad obdĺžnika
    if (rectDrag) {
        const [a, b] = [Math.min(rectDrag.c0, rectDrag.c1), Math.max(rectDrag.c0, rectDrag.c1)];
        const [p, q] = [Math.min(rectDrag.r0, rectDrag.r1), Math.max(rectDrag.r0, rectDrag.r1)];
        ctx.fillStyle = mode === 'erase' ? 'rgba(255,80,80,0.25)' : 'rgba(255,217,0,0.22)';
        ctx.fillRect(a * TS, p * TS, (b - a + 1) * TS, (q - p + 1) * TS);
        ctx.strokeStyle = '#FFD900';
        ctx.strokeRect(a * TS, p * TS, (b - a + 1) * TS, (q - p + 1) * TS);
    } else if (hover && (mode === 'paint' || mode === 'rect' || mode === 'erase')) {
        // náhľad štetca
        ctx.globalAlpha = 0.55;
        if (mode === 'erase') {
            ctx.fillStyle = 'rgba(255,80,80,0.5)';
            ctx.fillRect(hover.c * TS, hover.r * TS, TS, TS);
        } else if (brush.kind === 'stamp') {
            W.drawStamp(ctx, { id: brush.id, c: hover.c, r: hover.r });
        } else if (brush.kind === 'object') {
            drawObject(ctx, { t: brush.id, c: hover.c, r: hover.r, ...(W.OBJECTS[brush.id].params || {}) });
        } else {
            ctx.fillStyle = 'rgba(255,217,0,0.35)';
            ctx.fillRect(hover.c * TS, hover.r * TS, TS, TS);
        }
        ctx.globalAlpha = 1;
    }
}

// ---------------- úpravy levelu ----------------
function snapshot() {
    undoStack.push(JSON.stringify({ level, roomIdx }));
    if (undoStack.length > 80) undoStack.shift();
    redoStack = [];
}
function restore(json) {
    const s = JSON.parse(json);
    level = s.level;
    roomIdx = Math.min(s.roomIdx, level.rooms.length - 1);
    selected = null;
    changed(true);
}
function undo() {
    if (!undoStack.length) return;
    redoStack.push(JSON.stringify({ level, roomIdx }));
    restore(undoStack.pop());
}
function redo() {
    if (!redoStack.length) return;
    undoStack.push(JSON.stringify({ level, roomIdx }));
    restore(redoStack.pop());
}

let autosaveT = null;
function changed(full) {
    dirty = true;
    if (full) refreshAll();
    else {
        requestRender();
        validate();
    }
    clearTimeout(autosaveT);
    autosaveT = setTimeout(() => save(true), 800);
}

function setTile(def, l, c, r, ch) {
    if (c < 0 || r < 0 || c >= def.cols || r >= def.rows) return false;
    const row = def.layers[l][r];
    if (row[c] === ch) return false;
    def.layers[l][r] = row.slice(0, c) + ch + row.slice(c + 1);
    return true;
}

function objectAt(def, c, r) {
    return def.objects.find((o) => o.c === c && o.r === r);
}

function paintAt(c, r) {
    const def = target();
    if (c < 0 || r < 0 || c >= def.cols || r >= def.rows) return false;
    if (mode === 'erase') return eraseAt(c, r);
    if (brush.kind === 'tile') return setTile(def, layer, c, r, brush.id);
    if (brush.kind === 'stamp') {
        if (def.stamps.some((s) => s.id === brush.id && s.c === c && s.r === r && (s.layer || 'main') === layer)) return false;
        def.stamps.push({ id: brush.id, c, r, layer });
        return true;
    }
    if (brush.kind === 'object') {
        const meta = W.OBJECTS[brush.id];
        def.objects = def.objects.filter((o) => !(o.c === c && o.r === r) && !(meta.unique && o.t === brush.id));
        const o = { t: brush.id, c, r, ...(meta.params ? JSON.parse(JSON.stringify(meta.params)) : {}) };
        if (o.t === 'O' && brush.to !== undefined) o.to = brush.to;
        def.objects.push(o);
        if (meta.params) select(o);
        return true;
    }
    return false;
}

function eraseAt(c, r) {
    const def = target();
    let did = false;
    const before = def.objects.length;
    def.objects = def.objects.filter((o) => !(o.c === c && o.r === r));
    if (def.objects.length !== before) did = true;
    const sb = def.stamps.length;
    def.stamps = def.stamps.filter((s) => {
        const st = W.STAMPS[s.id];
        return !((s.layer || 'main') === layer && c >= s.c && c < s.c + st.cw && r >= s.r && r < s.r + st.ch);
    });
    if (def.stamps.length !== sb) did = true;
    if (setTile(def, layer, c, r, ' ')) did = true;
    if (did && selected && !def.objects.includes(selected)) select(null);
    return did;
}

function fillRect(a, b) {
    const def = target();
    let did = false;
    for (let r = Math.min(a.r, b.r); r <= Math.max(a.r, b.r); r++) {
        for (let c = Math.min(a.c, b.c); c <= Math.max(a.c, b.c); c++) {
            if (mode === 'erase') did = eraseAt(c, r) || did;
            else if (brush.kind === 'tile') did = setTile(def, layer, c, r, brush.id) || did;
        }
    }
    return did;
}

// ---------------- ovládanie plochy ----------------
const pointers = new Map();
let drag = null; // { kind: 'paint'|'pan'|'rect', ... }
let spaceDown = false;

function toCell(ev) {
    const r = canvas.getBoundingClientRect();
    const wx = (ev.clientX - r.left - view.ox) / view.z;
    const wy = (ev.clientY - r.top - view.oy) / view.z;
    return { c: Math.floor(wx / TS), r: Math.floor(wy / TS), wx, wy };
}

function hitObject(wx, wy) {
    const def = target();
    for (let i = def.objects.length - 1; i >= 0; i--) {
        const o = def.objects[i];
        const s = o._rect;
        if (s && wx >= s.x && wx <= s.x + s.w && wy >= s.y && wy <= s.y + s.h) return o;
    }
    return null;
}

canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
        // dva prsty: posun a priblíženie
        const [a, b] = [...pointers.values()];
        drag = { kind: 'pinch', d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, z: view.z, ox: view.ox, oy: view.oy };
        rectDrag = null;
        return;
    }
    const cell = toCell(e);
    if (e.button === 1 || mode === 'pan' || spaceDown) {
        drag = { kind: 'pan', x: e.clientX, y: e.clientY, ox: view.ox, oy: view.oy };
        canvas.classList.add('is-pan');
        return;
    }
    if (mode === 'select') {
        select(hitObject(cell.wx, cell.wy));
        return;
    }
    const erasing = e.button === 2;
    const prevMode = mode;
    if (erasing) mode = 'erase';
    if (mode === 'rect' || e.shiftKey) {
        drag = { kind: 'rect', restore: erasing ? prevMode : null };
        rectDrag = { c0: cell.c, r0: cell.r, c1: cell.c, r1: cell.r };
        requestRender();
        return;
    }
    snapshot();
    const did = paintAt(cell.c, cell.r);
    drag = { kind: 'paint', last: cell, did, restore: erasing ? prevMode : null };
    if (did) changed();
    else undoStack.pop();
});

canvas.addEventListener('pointermove', (e) => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const cell = toCell(e);
    if (!hover || hover.c !== cell.c || hover.r !== cell.r) {
        hover = { c: cell.c, r: cell.r };
        requestRender();
    }
    if (!drag) return;
    if (drag.kind === 'pinch' && pointers.size >= 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const z = Math.max(0.2, Math.min(3, drag.z * (d / drag.d)));
        const rr = canvas.getBoundingClientRect();
        const wx = (drag.mx - rr.left - drag.ox) / drag.z;
        const wy = (drag.my - rr.top - drag.oy) / drag.z;
        view.z = z;
        view.ox = mx - rr.left - wx * z;
        view.oy = my - rr.top - wy * z;
        requestRender();
    } else if (drag.kind === 'pan') {
        view.ox = drag.ox + (e.clientX - drag.x);
        view.oy = drag.oy + (e.clientY - drag.y);
        requestRender();
    } else if (drag.kind === 'rect') {
        rectDrag.c1 = cell.c;
        rectDrag.r1 = cell.r;
        requestRender();
    } else if (drag.kind === 'paint' && (brush.kind === 'tile' || mode === 'erase')) {
        if (cell.c !== drag.last.c || cell.r !== drag.last.r) {
            // spojitá čiara (aj pri rýchlom ťahu)
            const n = Math.max(Math.abs(cell.c - drag.last.c), Math.abs(cell.r - drag.last.r));
            let did = false;
            for (let i = 1; i <= n; i++) {
                const c = Math.round(drag.last.c + ((cell.c - drag.last.c) * i) / n);
                const r = Math.round(drag.last.r + ((cell.r - drag.last.r) * i) / n);
                did = paintAt(c, r) || did;
            }
            if (did) {
                if (!drag.did) { drag.did = true; }
                changed();
            }
            drag.last = cell;
        }
    }
});

function endPointer(e) {
    pointers.delete(e.pointerId);
    if (!drag) return;
    if (drag.kind === 'rect' && rectDrag) {
        snapshot();
        if (fillRect({ c: rectDrag.c0, r: rectDrag.r0 }, { c: rectDrag.c1, r: rectDrag.r1 })) changed();
        else undoStack.pop();
        rectDrag = null;
    }
    if (drag.restore) mode = drag.restore;
    canvas.classList.remove('is-pan');
    if (pointers.size === 0) drag = null;
    requestRender();
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);
canvas.addEventListener('pointerleave', () => { hover = null; requestRender(); });

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.ctrlKey || Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const r = canvas.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;
        const z = Math.max(0.2, Math.min(3, view.z * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
        view.ox = mx - ((mx - view.ox) / view.z) * z;
        view.oy = my - ((my - view.oy) / view.z) * z;
        view.z = z;
    } else {
        view.ox -= e.deltaX;
    }
    requestRender();
}, { passive: false });

function zoomBy(k) {
    const r = canvas.getBoundingClientRect();
    const mx = r.width / 2;
    const my = r.height / 2;
    const z = Math.max(0.2, Math.min(3, view.z * k));
    view.ox = mx - ((mx - view.ox) / view.z) * z;
    view.oy = my - ((my - view.oy) / view.z) * z;
    view.z = z;
    requestRender();
}

window.addEventListener('keydown', (e) => {
    if (e.target.closest('input, select, textarea, dialog')) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
    else if (e.code === 'Space') { spaceDown = true; canvas.classList.add('is-pan'); e.preventDefault(); }
    else if (e.key === 'Delete' && selected) { snapshot(); target().objects = target().objects.filter((o) => o !== selected); select(null); changed(); }
    else if (e.key === '1') setLayer('back');
    else if (e.key === '2') setLayer('main');
    else if (e.key === '3') setLayer('front');
});
window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') { spaceDown = false; canvas.classList.remove('is-pan'); }
});

// ---------------- paleta ----------------
function thumb(drawFn, bounds) {
    const cv = document.createElement('canvas');
    cv.width = 64;
    cv.height = 64;
    const c = cv.getContext('2d');
    c.imageSmoothingEnabled = false;
    const s = Math.min(60 / bounds.w, 60 / bounds.h);
    c.setTransform(s, 0, 0, s, 32 - (bounds.x + bounds.w / 2) * s, 32 - (bounds.y + bounds.h / 2) * s);
    drawFn(c);
    return cv;
}

function tileThumb(ch) {
    const t = W.TILES[ch];
    const cols = t.thin ? 3 : 2;
    const rows = t.thin ? 1 : 2;
    const def = W.blank({ cols, rows });
    def.layers.main = Array.from({ length: rows }, () => ch.repeat(cols));
    def.frame = null;
    // bez pokračovania terénu za okrajom (náhľad ukazuje okraje)
    def.frame = 'x';
    const b = { x: 0, y: 0, w: cols * TS, h: (t.thin ? 0.5 : rows) * TS };
    return thumb((c) => { W.drawRegion(c, def, 0, 0, cols, rows, 0, 0, { dimBack: false }); }, b);
}

const PALETTE = () => {
    const groups = [
        { title: 'Terén', items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((id) => ({ kind: 'tile', id })) },
        { title: 'Kocky a lišty', items: ['K', 'Z', 'N', 'Q', '-', '_', ':'].map((id) => ({ kind: 'tile', id })) },
        { title: 'Veľké bloky', items: Object.keys(W.STAMPS).map((id) => ({ kind: 'stamp', id })) },
    ];
    const byGroup = {};
    for (const [id, o] of Object.entries(W.OBJECTS)) (byGroup[o.group] = byGroup[o.group] || []).push({ kind: 'object', id });
    for (const [title, items] of Object.entries(byGroup)) groups.push({ title, items });
    return groups;
};

function itemName(it) {
    if (it.kind === 'tile') return W.TILES[it.id].name;
    if (it.kind === 'stamp') return W.STAMPS[it.id].name;
    return W.OBJECTS[it.id].name;
}

function itemThumb(it) {
    if (it.kind === 'tile') return tileThumb(it.id);
    if (it.kind === 'stamp') {
        const s = W.STAMPS[it.id];
        return thumb((c) => W.drawStamp(c, { id: it.id, c: 0, r: 0 }), { x: 0, y: 0, w: s.cw * TS, h: s.ch * TS });
    }
    const o = { t: it.id, c: 0, r: 0, ...(W.OBJECTS[it.id].params || {}), range: 0.6 };
    // obdĺžnik objektu zistíme skúšobným vykreslením
    const probe = document.createElement('canvas').getContext('2d');
    const r = drawObject(probe, o);
    return thumb((c) => drawObject(c, o), { x: r.x - 4, y: r.y - 4, w: r.w + 8, h: r.h + 8 });
}

function buildPalette() {
    const pal = $('bldPalette');
    pal.innerHTML = '';
    for (const g of PALETTE()) {
        const box = document.createElement('section');
        box.className = 'bld-group';
        box.innerHTML = `<h3>${g.title}</h3>`;
        const grid = document.createElement('div');
        grid.className = 'bld-items';
        for (const it of g.items) {
            const b = document.createElement('button');
            b.className = 'bld-item';
            b.type = 'button';
            b.title = itemName(it);
            b.setAttribute('aria-label', itemName(it));
            b.dataset.kind = it.kind;
            b.dataset.id = it.id;
            b.appendChild(itemThumb(it));
            b.onclick = () => {
                brush = { kind: it.kind, id: it.id };
                if (mode !== 'paint' && mode !== 'rect') setMode('paint');
                if (it.kind !== 'tile' && mode === 'rect') setMode('paint');
                markBrush();
                status(`Štetec: <b>${itemName(it)}</b>${it.kind === 'tile' ? ` · vrstva <b>${layerName(layer)}</b>` : ''}`);
            };
            grid.appendChild(b);
        }
        box.appendChild(grid);
        pal.appendChild(box);
    }
    markBrush();
}

function markBrush() {
    document.querySelectorAll('.bld-item').forEach((b) => b.classList.toggle('is-on', b.dataset.kind === brush.kind && b.dataset.id === brush.id));
}

const layerName = (l) => ({ back: 'zadná', main: 'hlavná', front: 'predná' }[l]);

function setLayer(l) {
    layer = l;
    document.querySelectorAll('.bld-layers button').forEach((b) => b.classList.toggle('is-on', b.dataset.layer === l));
    status(`Vrstva: <b>${layerName(l)}</b> – ${l === 'back' ? 'len vzhľad (za hráčom), nedá sa na ňu stúpiť' : l === 'front' ? 'pevná, kreslí sa cez hlavnú (bloky cez seba)' : 'pevná vrstva'}`);
    requestRender();
}

function setMode(m) {
    mode = m;
    document.querySelectorAll('.bld-modes button').forEach((b) => b.classList.toggle('is-on', b.dataset.mode === m));
    canvas.classList.toggle('is-pan', m === 'pan');
    if (m !== 'select') select(null);
    requestRender();
}

// ---------------- vlastnosti objektu ----------------
function select(o) {
    selected = o;
    const box = $('bldProps');
    if (!o) {
        box.hidden = true;
        requestRender();
        return;
    }
    const meta = W.OBJECTS[o.t];
    box.hidden = false;
    box.innerHTML = `<h3>${meta.name}</h3>`;
    const field = (label, input) => {
        const f = document.createElement('label');
        f.className = 'bld-field';
        f.textContent = label;
        f.appendChild(input);
        box.appendChild(f);
        return input;
    };
    const commit = (fn) => { snapshot(); fn(); changed(); };
    if (o.t === 'O') {
        const s = document.createElement('select');
        const opts = [];
        if (roomIdx >= 0) opts.push(['', 'Späť (kde hráč prišiel)']);
        level.rooms.forEach((r, i) => { if (i !== roomIdx) opts.push([r.id, r.name || r.id]); });
        if (roomIdx < 0 && !level.rooms.length) opts.push(['', '— najprv pridaj miestnosť (+ Miestnosť) —']);
        for (const [v, t] of opts) { const op = document.createElement('option'); op.value = v; op.textContent = t; s.appendChild(op); }
        s.value = o.to || '';
        s.onchange = () => commit(() => { o.to = s.value; });
        field('Kam vedie portál', s);
    }
    if ('range' in (meta.params || {})) {
        const i = document.createElement('input');
        i.type = 'number';
        i.min = '0.5';
        i.max = '12';
        i.step = '0.5';
        i.value = o.range ?? 3;
        i.onchange = () => commit(() => { o.range = Math.max(0.5, Math.min(12, parseFloat(i.value) || 3)); });
        field('Dráha (dlaždice na každú stranu)', i);
    }
    if (o.t === 'S') {
        const i = document.createElement('input');
        i.type = 'checkbox';
        i.checked = !!o.vertical;
        i.onchange = () => commit(() => { o.vertical = i.checked; });
        field('Zvislo', i);
    }
    if (o.t === 'X') {
        const s = document.createElement('select');
        [[1, 'Ľahká (1 úder, 1 ovocie)'], [2, 'Stredná (2 údery, 2 ovocia)'], [3, 'Pevná (3 údery, 3 ovocia)']].forEach(([v, t]) => {
            const op = document.createElement('option'); op.value = v; op.textContent = t; s.appendChild(op);
        });
        s.value = o.variant || 1;
        s.onchange = () => commit(() => { o.variant = +s.value; });
        field('Krabica', s);
    }
    const del = document.createElement('button');
    del.className = 'bld-btn bld-btn--danger';
    del.textContent = 'Zmazať';
    del.onclick = () => commit(() => { target().objects = target().objects.filter((x) => x !== o); select(null); });
    box.appendChild(del);
    requestRender();
}

// ---------------- záložky (level a miestnosti) ----------------
function buildTabs() {
    const tabs = $('bldTabs');
    tabs.innerHTML = '';
    const mk = (label, idx, cls = '') => {
        const b = document.createElement('button');
        b.className = 'bld-tab ' + cls + (idx === roomIdx ? ' is-on' : '');
        b.textContent = label;
        b.onclick = () => {
            if (idx === 'add') return addRoom();
            roomIdx = idx;
            select(null);
            fitView();
            refreshAll();
        };
        tabs.appendChild(b);
    };
    mk('Level', -1);
    level.rooms.forEach((r, i) => mk(r.name || 'Miestnosť ' + (i + 1), i));
    mk('+ Miestnosť', 'add', 'bld-tab--add');
}

function addRoom() {
    snapshot();
    const room = starterRoom(level.rooms.length + 1);
    level.rooms.push(room);
    roomIdx = level.rooms.length - 1;
    brush = { kind: 'object', id: 'O' };
    fitView();
    changed(true);
    status(`Pridaná <b>${room.name}</b> s portálom späť. V záložke <b>Level</b> polož portál (☉ v skupine Hráč) a v „Vybrať“ mu nastav, že vedie sem.`);
}

// ---------------- dialógy ----------------
function openDialog(html, wire) {
    dialog.innerHTML = html;
    wire && wire(dialog);
    dialog.querySelectorAll('[data-close]').forEach((b) => (b.onclick = () => dialog.close()));
    dialog.showModal();
}

function settingsDialog() {
    const def = target();
    const isRoom = roomIdx >= 0;
    const sw = (name, cur, values) => `<div class="bld-swatches" data-name="${name}">${values.map(([v, label, style]) =>
        `<button type="button" class="bld-swatch ${v === cur ? 'is-on' : ''} ${style || ''}" data-v="${v}" title="${label}" aria-label="${label}"></button>`).join('')}</div>`;
    const bgs = [['', 'Pozadie sveta (les)', 'bld-swatch--none'], ...Object.keys(W.BG).map((n) => [n, n])];
    const frames = [['', 'Bez rámika', 'bld-swatch--none'], ['stone', 'Kameň'], ['wood', 'Drevo'], ['green', 'Mach']];
    openDialog(`
        <h2>${isRoom ? 'Nastavenia miestnosti' : 'Nastavenia levelu'}</h2>
        ${isRoom ? '<label class="bld-field">Názov miestnosti<input id="sName" maxlength="30"></label>' : ''}
        <div class="bld-grid2">
            <label class="bld-field">Šírka (dlaždice)<input id="sCols" type="number" min="10" max="400"></label>
            <label class="bld-field">Výška (dlaždice)<input id="sRows" type="number" min="8" max="60"></label>
        </div>
        ${isRoom ? '<p>Miestnosť 32 × 14 sa celá zmestí na obrazovku telefónu.</p>' : ''}
        <h3>Pozadie</h3>${sw('bg', def.bg || '', bgs)}
        <h3>Rámik</h3>${sw('frame', def.frame || '', frames)}
        <p>Rámik ohraničí level zo všetkých strán (ako v miestnostiach Pixel Adventure).</p>
        <div class="bld-dialog__actions">
            ${isRoom ? '<button class="bld-btn bld-btn--danger" id="sDel">Zmazať miestnosť</button>' : ''}
            <button class="bld-btn" data-close>Zrušiť</button>
            <button class="bld-btn bld-btn--play" id="sOk">Použiť</button>
        </div>`, (d) => {
        d.querySelector('#sCols').value = def.cols;
        d.querySelector('#sRows').value = def.rows;
        if (isRoom) d.querySelector('#sName').value = def.name || '';
        d.querySelectorAll('.bld-swatches').forEach((g) => {
            g.querySelectorAll('.bld-swatch').forEach((b) => {
                const v = b.dataset.v;
                if (g.dataset.name === 'bg' && v) b.style.backgroundImage = `url(images/superjozino/pa/background/${v}.png)`;
                if (g.dataset.name === 'frame' && v) {
                    const t = tileThumb(W.FRAMES[v]);
                    b.style.backgroundImage = `url(${t.toDataURL()})`;
                    b.style.backgroundSize = 'cover';
                }
                b.onclick = () => { g.querySelectorAll('.bld-swatch').forEach((x) => x.classList.remove('is-on')); b.classList.add('is-on'); };
            });
        });
        d.querySelector('#sOk').onclick = () => {
            snapshot();
            const cols = Math.max(10, Math.min(400, +d.querySelector('#sCols').value || def.cols));
            const rows = Math.max(8, Math.min(60, +d.querySelector('#sRows').value || def.rows));
            def.cols = cols;
            def.rows = rows;
            W.normalize(def);
            def.objects = def.objects.filter((o) => o.c < cols && o.r < rows);
            def.stamps = def.stamps.filter((s) => s.c < cols && s.r < rows);
            def.bg = d.querySelector('[data-name="bg"] .is-on')?.dataset.v || null;
            def.frame = d.querySelector('[data-name="frame"] .is-on')?.dataset.v || null;
            if (isRoom) def.name = d.querySelector('#sName').value.trim() || def.name;
            dialog.close();
            fitView();
            changed(true);
        };
        const del = d.querySelector('#sDel');
        if (del) del.onclick = () => {
            if (!confirm('Zmazať túto miestnosť?')) return;
            snapshot();
            const id = level.rooms[roomIdx].id;
            level.rooms.splice(roomIdx, 1);
            for (const def2 of [level, ...level.rooms]) for (const o of def2.objects) if (o.t === 'O' && o.to === id) o.to = '';
            roomIdx = -1;
            dialog.close();
            fitView();
            changed(true);
        };
    });
}

function levelsDialog() {
    const mine = Object.entries(store.levels).sort((a, b) => (b[1].updated || 0) - (a[1].updated || 0));
    const fmt = (t) => (t ? new Date(t).toLocaleString('sk-SK', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');
    const templates = Object.entries(window.SJ_MAPS || {});
    openDialog(`
        <h2>Levely</h2>
        <h3>Moje levely</h3>
        <div class="bld-list">${mine.map(([id, d]) => `
            <div class="bld-list__item">
                <div class="bld-list__name">${esc(d.name || 'Bez názvu')}${id === levelId ? ' ✎' : ''}<small>${d.cols}×${d.rows} · ${(d.rooms || []).length} miestn. · ${fmt(d.updated)}${id === store.last ? ' · v teste' : ''}</small></div>
                <button class="bld-btn" data-open="${id}">Otvoriť</button>
                <button class="bld-btn" data-copy="${id}" title="Kópia">⧉</button>
                <button class="bld-btn bld-btn--danger" data-del="${id}" title="Zmazať">✕</button>
            </div>`).join('') || '<p>Zatiaľ žiadny uložený level.</p>'}</div>
        <div class="bld-dialog__actions" style="justify-content:flex-start">
            <button class="bld-btn bld-btn--play" id="lNew">+ Nový level</button>
            <button class="bld-btn" id="lExport">Exportovať tento level</button>
            <button class="bld-btn" id="lImport">Importovať zo súboru</button>
        </div>
        <h3>Predlohy (levely z hry)</h3>
        <p>Otvorí sa ako nový vlastný level – originál v hre sa nezmení.</p>
        <div class="bld-list">${templates.map(([n, m]) => `
            <div class="bld-list__item"><div class="bld-list__name">${n}. ${esc(m.name)}</div><button class="bld-btn" data-tpl="${n}">Otvoriť ako nový</button></div>`).join('')}</div>
        <div class="bld-dialog__actions"><button class="bld-btn" data-close>Zavrieť</button></div>`, (d) => {
        d.querySelectorAll('[data-open]').forEach((b) => (b.onclick = () => { dialog.close(); openLevel(b.dataset.open, store.levels[b.dataset.open]); }));
        d.querySelectorAll('[data-copy]').forEach((b) => (b.onclick = () => {
            const src = store.levels[b.dataset.copy];
            const id = newId();
            store.levels[id] = { ...JSON.parse(JSON.stringify(src)), name: (src.name || 'Level') + ' (kópia)', updated: Date.now() };
            saveStore();
            levelsDialog();
        }));
        d.querySelectorAll('[data-del]').forEach((b) => (b.onclick = () => {
            if (!confirm('Naozaj zmazať tento level?')) return;
            delete store.levels[b.dataset.del];
            if (store.last === b.dataset.del) store.last = Object.keys(store.levels)[0] || null;
            saveStore();
            if (b.dataset.del === levelId) {
                const id = newId();
                openLevel(id, starterLevel());
            }
            levelsDialog();
        }));
        d.querySelectorAll('[data-tpl]').forEach((b) => (b.onclick = () => {
            const m = window.SJ_MAPS[b.dataset.tpl];
            const def = W.fromAscii(m);
            def.name = m.name + ' (moja verzia)';
            dialog.close();
            openLevel(newId(), def);
            save();
        }));
        d.querySelector('#lNew').onclick = () => { dialog.close(); openLevel(newId(), starterLevel()); save(); };
        d.querySelector('#lExport').onclick = exportLevel;
        d.querySelector('#lImport').onclick = () => $('bldFile').click();
    });
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function cleanDef() {
    const out = JSON.parse(JSON.stringify(level, (k, v) => (k === '_rect' ? undefined : v)));
    out.name = $('bldName').value.trim() || out.name || 'Môj level';
    return out;
}

function exportLevel() {
    const def = cleanDef();
    const json = JSON.stringify(def, null, 1);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    a.download = (def.name || 'level').toLowerCase().replace(/[^a-z0-9áäčďéíľĺňóôŕšťúýž]+/gi, '-') + '.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    try { navigator.clipboard && navigator.clipboard.writeText(json); } catch { /* nič */ }
    status('Level exportovaný do súboru (a skopírovaný do schránky).');
}

$('bldFile').onchange = async (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
        const def = JSON.parse(await f.text());
        if (!def.layers || !def.cols) throw new Error('nie je to level');
        dialog.close();
        openLevel(newId(), def);
        save();
        status(`Importovaný level <b>${esc(def.name || '')}</b>.`);
    } catch (err) {
        alert('Súbor sa nedá načítať: ' + err.message);
    }
};

// ---------------- uloženie, hra ----------------
function save(silent) {
    if (!level) return;
    const def = cleanDef();
    def.updated = Date.now();
    level.name = def.name;
    store.levels[levelId] = def;
    store.last = levelId;
    if (saveStore()) {
        dirty = false;
        if (!silent) status('<span class="ok">Uložené.</span> Level sa spustí aj tlačidlom <b>TEST JOZINO</b> v menu.');
    }
}

function play() {
    save(true);
    location.href = 'superjozino.html?custom=' + encodeURIComponent(levelId);
}

// ---------------- kontrola levelu ----------------
function validate() {
    if (!level) return;
    const all = [level, ...level.rooms];
    const count = (t) => all.reduce((n, d) => n + d.objects.filter((o) => o.t === t).length, 0);
    const msgs = [];
    if (!level.objects.some((o) => o.t === 'P')) msgs.push('<span class="bad">Chýba štart (P) v leveli.</span>');
    if (!count('E')) msgs.push('<span class="bad">Chýba cieľ (trofej).</span>');
    const d = count('D');
    msgs.push(d ? `Modré diamanty: <b>${d}</b>` : '<span class="bad">Žiadny modrý diamant – rečové cvičenie sa nezobrazí.</span>');
    for (const def of all) {
        for (const o of def.objects) {
            if (o.t === 'O' && o.to && !level.rooms.some((r) => r.id === o.to)) msgs.push('<span class="bad">Portál vedie do neexistujúcej miestnosti.</span>');
        }
    }
    level.rooms.forEach((r) => {
        if (!r.objects.some((o) => o.t === 'O' && !o.to)) msgs.push(`<span class="bad">${esc(r.name)}: chýba portál späť.</span>`);
        if (![level, ...level.rooms].some((d2) => d2.objects.some((o) => o.t === 'O' && o.to === r.id))) msgs.push(`<span class="bad">Do „${esc(r.name)}“ nevedie žiadny portál.</span>`);
    });
    const def = target();
    status(`${roomIdx < 0 ? 'Level' : esc(def.name)} ${def.cols}×${def.rows} · vrstva <b>${layerName(layer)}</b> · ${msgs.join(' · ')}`);
}

function refreshAll() {
    $('bldName').value = level.name || '';
    buildTabs();
    validate();
    requestRender();
    $('bldUndo').disabled = !undoStack.length;
}

// ---------------- napojenie tlačidiel ----------------
document.querySelectorAll('.bld-layers button').forEach((b) => (b.onclick = () => setLayer(b.dataset.layer)));
document.querySelectorAll('.bld-modes button').forEach((b) => (b.onclick = () => setMode(b.dataset.mode)));
$('bldUndo').onclick = undo;
$('bldRedo').onclick = redo;
$('bldSave').onclick = () => save();
$('bldPlay').onclick = play;
$('bldSettings').onclick = settingsDialog;
$('bldLevels').onclick = levelsDialog;
$('bldZoomIn').onclick = () => zoomBy(1.25);
$('bldZoomOut').onclick = () => zoomBy(0.8);
$('bldGrid').onchange = requestRender;
$('bldOnly').onchange = requestRender;
$('bldName').oninput = () => { level.name = $('bldName').value; changed(); };
window.addEventListener('resize', resize);
window.addEventListener('beforeunload', () => { if (dirty) save(true); });

// ---------------- štart ----------------
(function start() {
    const q = new URLSearchParams(location.search);
    const edit = q.get('edit');
    resize();
    if (edit && store.levels[edit]) openLevel(edit, store.levels[edit]);
    else if (store.last && store.levels[store.last]) openLevel(store.last, store.levels[store.last]);
    else { openLevel(newId(), starterLevel()); save(true); }
    // paleta až keď sú obrázky načítané (náhľady)
    const tryPalette = (n = 0) => {
        const ok = W.ready() && SP.ready('apple') && SP.ready('box1') && SP.ready('mushroomRun');
        if (ok || n > 40) { buildPalette(); requestRender(); }
        else setTimeout(() => tryPalette(n + 1), 100);
    };
    tryPalette();
    window.addEventListener('load', () => { buildPalette(); fitView(); requestRender(); });
})();
