/**
 * Rozloženie kariet pexesa „ako na stole“ (bez DOM – testovateľné).
 *
 * Karty sú rozhádzané: stôl sa rozdelí na mriežku s ~12 % voľných políčok
 * navyše, karty sa náhodne rozmiestnia do políčok, posunú a pootočia.
 * Veľkosť kariet sa prispôsobí počtu a ploche – karty sa nikdy neprekrývajú
 * a nevyčnievajú zo stola (pootočená karta sa zmestí do svojho políčka).
 */
import { seededRandom, shuffle } from '../core/levelGenerator.js';

const MAX_ROT = 8; // ° – najväčšie pootočenie karty

/**
 * @param {object} o
 * @param {number} o.count – počet kariet
 * @param {number} o.width, o.height – plocha stola (px)
 * @param {string|number} [o.seed]
 * @param {number} [o.maxCard=300] – najväčšia veľkosť karty
 * @param {number} [o.spare=0.12] – podiel voľných políčok navyše (rozhádzanosť)
 * @returns {{ size: number, cards: { x: number, y: number, rot: number }[] }}
 *   x, y = ľavý horný roh nepootočenej karty
 */
export function scatterLayout({ count, width, height, seed = 1, maxCard = 300, spare = 0.12 }) {
    const rng = seededRandom(`px:${seed}:${count}`);
    const cells = count + Math.ceil(count * spare);
    // políčka môžu byť obdĺžnikové – využije sa celý stôl
    let best = null;
    for (let cols = 1; cols <= cells; cols++) {
        const rows = Math.ceil(cells / cols);
        const cell = Math.min(width / cols, height / rows);
        if (!best || cell > best.cell) best = { cols, rows, cell };
    }
    const { cols, rows } = best;
    const cw = width / cols;
    const ch = height / rows;
    const rad = (MAX_ROT * Math.PI) / 180;
    const grow = Math.cos(rad) + Math.sin(rad); // bounding box pootočenej karty
    const size = Math.floor(Math.min(maxCard, (Math.min(cw, ch) * 0.92) / grow));
    const box = size * grow;
    const slackX = Math.max(0, (cw - box) / 2);
    const slackY = Math.max(0, (ch - box) / 2);

    // ktoré políčka budú obsadené (rovnomerne rozložené: každý riadok dostane podobný počet)
    const all = Array.from({ length: cols * rows }, (_, i) => i);
    const picked = shuffle(all, rng).slice(0, count).sort((a, b) => a - b);

    const cards = picked.map((i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const cx = c * cw + cw / 2 + (rng() * 2 - 1) * slackX;
        const cy = r * ch + ch / 2 + (rng() * 2 - 1) * slackY;
        return { x: cx - size / 2, y: cy - size / 2, rot: Math.round((rng() * 2 - 1) * MAX_ROT * 10) / 10 };
    });
    return { size, cards: shuffle(cards, rng) };
}
