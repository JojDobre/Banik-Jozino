/**
 * Kreslené obrázky zberateľských kariet (SVG, cartoon štýl, animované).
 *
 * Každý obrázok je funkcia (u) => SVG reťazec. `u` je jedinečná prípona pre
 * id prechodov (gradientov) – na stránke môže byť tá istá karta viackrát.
 * Animácie sú cez CSS triedy (viď css/cards.css, sekcia „Animácie obrázkov“):
 *   .a-float  vznáša sa        .a-blink  žmurká        .a-flap-l/.a-flap-r  mávanie krídel
 *   .a-twinkle iskrička        .a-glow   pulzujúce svetlo  .a-spin  točenie
 *   .a-wiggle kývanie          .a-bob    hupkanie       .a-flicker  plamienok
 *   .a-coin   otáčanie mince    .a-swing  hojdanie      .a-tongue   jazyk
 * Rozmer: viewBox 0 0 200 200.
 */

const O = '#2b1608'; // obrys
const W = 'stroke-linejoin="round" stroke-linecap="round"';

const svg = (body, defs = '') =>
    `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="card-art" aria-hidden="true"><defs>${defs}</defs>${body}</svg>`;

const lin = (id, stops, x2 = 0, y2 = 1) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx = 0.4, cy = 0.35) =>
    `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="0.75">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>`;

/** Iskričky okolo predmetu (štvorcípe hviezdičky). */
function sparkles(points, color = '#fff') {
    return points
        .map(([x, y, s = 1, d = 0]) =>
            `<g class="a-twinkle" style="animation-delay:${d}s;transform-origin:${x}px ${y}px"><path d="M${x} ${y - 9 * s} Q${x + 1.6 * s} ${y - 1.6 * s} ${x + 9 * s} ${y} Q${x + 1.6 * s} ${y + 1.6 * s} ${x} ${y + 9 * s} Q${x - 1.6 * s} ${y + 1.6 * s} ${x - 9 * s} ${y} Q${x - 1.6 * s} ${y - 1.6 * s} ${x} ${y - 9 * s}Z" fill="${color}"/></g>`,
        )
        .join('');
}

/** Kreslené oko so žmurkaním. */
function eye(x, y, r = 9, look = 0) {
    return `<g class="a-blink" style="transform-origin:${x}px ${y}px"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.1}" fill="#fff" stroke="${O}" stroke-width="3"/><circle cx="${x + look}" cy="${y + 1}" r="${r * 0.55}" fill="${O}"/><circle cx="${x + look + r * 0.22}" cy="${y - r * 0.2}" r="${r * 0.2}" fill="#fff"/></g>`;
}

const shadow = (cx = 100, cy = 182, rx = 52) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="8" fill="rgba(0,0,0,0.18)"/>`;
const blush = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="5" fill="#ff8fa3" opacity="0.7"/>`;

/* ===================================================================
 * DRAHOKAMY
 * =================================================================== */

/** Klasický brús (bočný pohľad): korunka + pavilón. */
function gemClassic(u, [light, mid, dark], { wide = 1 } = {}) {
    const g = `g${u}`;
    const w = 62 * wide;
    return svg(
        `${shadow(100, 182, 46 * wide)}
<g class="a-float">
<polygon points="${100 - w},78 ${100 - w * 0.55},48 ${100 + w * 0.55},48 ${100 + w},78 100,168" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<polygon points="${100 - w * 0.55},48 ${100 - w * 0.2},78 ${100 - w},78" fill="${light}" opacity="0.85"/>
<polygon points="${100 - w * 0.2},78 100,48 ${100 + w * 0.2},78" fill="${light}" opacity="0.55"/>
<polygon points="${100 + w * 0.55},48 ${100 + w * 0.2},78 ${100 + w},78" fill="${dark}" opacity="0.35"/>
<polygon points="${100 - w},78 ${100 - w * 0.2},78 100,168" fill="${light}" opacity="0.35"/>
<polygon points="${100 + w * 0.2},78 ${100 + w},78 100,168" fill="${dark}" opacity="0.45"/>
<path d="M${100 - w} 78 H${100 + w} M${100 - w * 0.55} 48 L${100 - w * 0.2} 78 L100 48 L${100 + w * 0.2} 78 L${100 + w * 0.55} 48 M${100 - w * 0.2} 78 L100 168 L${100 + w * 0.2} 78" fill="none" stroke="${O}" stroke-width="2.5" opacity="0.6" ${W}/>
<path d="M${100 - w * 0.45} 58 L${100 - w * 0.3} 70" stroke="#fff" stroke-width="6" ${W} opacity="0.9"/>
</g>
${sparkles([[48, 52, 1, 0], [156, 66, 0.8, 0.6], [140, 150, 0.7, 1.2]])}`,
        lin(g, [[0, light], [0.5, mid], [1, dark]], 1, 1),
    );
}

function gemHeart(u, [light, mid, dark]) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 182, 44)}
<g class="a-float">
<path d="M100 170 C40 128 28 92 44 66 C60 42 90 46 100 70 C110 46 140 42 156 66 C172 92 160 128 100 170Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<path d="M100 70 L100 170 M44 66 L100 108 L156 66 M58 120 L100 108 L142 120" fill="none" stroke="${O}" stroke-width="2.5" opacity="0.45" ${W}/>
<path d="M100 70 C92 52 70 50 58 62 L100 108Z" fill="${light}" opacity="0.6"/>
<path d="M62 74 Q66 64 76 62" stroke="#fff" stroke-width="7" fill="none" ${W}/>
</g>
${sparkles([[40, 46, 1, 0.2], [160, 52, 0.8, 0.9], [150, 150, 0.7, 1.4]])}`,
        lin(g, [[0, light], [0.55, mid], [1, dark]], 1, 1),
    );
}

function gemEmerald(u, [light, mid, dark]) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 182, 50)}
<g class="a-float">
<polygon points="62,40 138,40 162,64 162,136 138,160 62,160 38,136 38,64" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<polygon points="74,62 126,62 140,76 140,124 126,138 74,138 60,124 60,76" fill="${mid}" stroke="${O}" stroke-width="2.5" opacity="0.9" ${W}/>
<polygon points="62,40 138,40 126,62 74,62" fill="${light}" opacity="0.7"/>
<polygon points="38,64 62,40 74,62 60,76" fill="${light}" opacity="0.5"/>
<polygon points="162,136 138,160 126,138 140,124" fill="${dark}" opacity="0.5"/>
<polygon points="62,160 138,160 126,138 74,138" fill="${dark}" opacity="0.35"/>
<rect x="74" y="76" width="52" height="48" rx="4" fill="${light}" opacity="0.35"/>
<path d="M70 52 L96 52" stroke="#fff" stroke-width="6" ${W}/>
</g>
${sparkles([[34, 40, 1, 0.4], [168, 48, 0.8, 1], [170, 160, 0.7, 0]])}`,
        lin(g, [[0, light], [0.5, mid], [1, dark]], 1, 1),
    );
}

function gemOval(u, [light, mid, dark]) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 182, 44)}
<g class="a-float">
<ellipse cx="100" cy="100" rx="58" ry="74" fill="url(#${g})" stroke="${O}" stroke-width="4"/>
<ellipse cx="100" cy="100" rx="30" ry="40" fill="${mid}" stroke="${O}" stroke-width="2.5" opacity="0.85"/>
<path d="M100 26 L100 60 M100 140 L100 174 M42 100 L70 100 M130 100 L158 100 M60 46 L80 70 M140 46 L120 70 M60 154 L80 130 M140 154 L120 130" stroke="${O}" stroke-width="2.5" opacity="0.4" ${W}/>
<path d="M66 70 Q70 50 88 40" stroke="#fff" stroke-width="7" fill="none" ${W}/>
<ellipse cx="92" cy="88" rx="10" ry="14" fill="${light}" opacity="0.8"/>
</g>
${sparkles([[44, 44, 1, 0.1], [158, 70, 0.8, 0.8], [146, 158, 0.7, 1.5]])}`,
        rad(g, [[0, light], [0.6, mid], [1, dark]]),
    );
}

function gemCluster(u, [light, mid, dark]) {
    const g = `g${u}`;
    const prism = (x, y, w, h, rot) =>
        `<g transform="rotate(${rot} ${x} ${y + h})"><polygon points="${x - w},${y + 10} ${x},${y - 14} ${x + w},${y + 10} ${x + w},${y + h} ${x - w},${y + h}" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/><polygon points="${x - w},${y + 10} ${x},${y - 14} ${x},${y + h} ${x - w},${y + h}" fill="${light}" opacity="0.45"/><path d="M${x - w * 0.5} ${y + 14} V${y + h - 10}" stroke="#fff" stroke-width="5" opacity="0.8" ${W}/></g>`;
    return svg(
        `${shadow(100, 176, 66)}
<path d="M34 168 Q100 150 166 168 L160 178 Q100 168 40 178Z" fill="#7a5a43" stroke="${O}" stroke-width="4" ${W}/>
<g class="a-float">
${prism(62, 88, 18, 80, -22)}${prism(140, 84, 18, 84, 20)}${prism(100, 46, 24, 120, 0)}
</g>
${sparkles([[40, 56, 1, 0], [164, 48, 0.9, 0.7], [100, 26, 0.8, 1.3]])}`,
        lin(g, [[0, light], [0.5, mid], [1, dark]], 1, 1),
    );
}

function gemOpal(u) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 182, 48)}
<g class="a-float">
<ellipse cx="100" cy="104" rx="62" ry="58" fill="url(#${g})" stroke="${O}" stroke-width="4"/>
<g class="a-hue"><ellipse cx="82" cy="92" rx="20" ry="14" fill="#7cf7d4" opacity="0.7"/><ellipse cx="122" cy="112" rx="18" ry="12" fill="#ff8ad8" opacity="0.6"/><ellipse cx="96" cy="128" rx="16" ry="10" fill="#9ab6ff" opacity="0.7"/><ellipse cx="128" cy="84" rx="12" ry="9" fill="#ffe27a" opacity="0.7"/></g>
<path d="M60 84 Q70 60 96 54" stroke="#fff" stroke-width="8" fill="none" ${W} opacity="0.9"/>
</g>
${sparkles([[40, 56, 1, 0], [162, 62, 0.9, 0.5], [158, 150, 0.8, 1], [44, 150, 0.7, 1.5]])}`,
        rad(g, [[0, '#ffffff'], [0.45, '#d9f3ff'], [1, '#8fb4e8']]),
    );
}

function nugget(u) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 176, 62)}
<g class="a-float">
<path d="M46 128 C30 104 46 70 74 66 C84 44 120 40 136 60 C164 62 178 96 160 120 C164 146 132 164 104 156 C78 168 50 154 46 128Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<path d="M74 66 C80 84 70 96 58 104 M136 60 C126 78 132 96 150 104 M104 156 C100 136 116 124 132 124" fill="none" stroke="#b8860b" stroke-width="3" opacity="0.7" ${W}/>
<ellipse cx="88" cy="88" rx="16" ry="9" fill="#fff8c4" opacity="0.9" transform="rotate(-20 88 88)"/>
<circle cx="128" cy="134" r="5" fill="#fff8c4" opacity="0.8"/>
</g>
${sparkles([[40, 60, 1.1, 0], [168, 56, 0.9, 0.6], [100, 30, 0.8, 1.1], [166, 150, 0.7, 1.6]], '#fff7b0')}`,
        rad(g, [[0, '#fff39a'], [0.5, '#ffc928'], [1, '#c98a00']]),
    );
}

/* ===================================================================
 * ZVIERATKÁ Z PODZEMIA
 * =================================================================== */

function mole(u) {
    const g = `g${u}`;
    return svg(
        `${shadow()}
<g class="a-bob">
<path d="M42 176 C36 120 58 82 100 82 C142 82 164 120 158 176Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<ellipse cx="62" cy="168" rx="20" ry="11" fill="#ffb3a7" stroke="${O}" stroke-width="3"/><ellipse cx="138" cy="168" rx="20" ry="11" fill="#ffb3a7" stroke="${O}" stroke-width="3"/>
<path d="M54 74 Q100 30 146 74 L148 86 L52 86Z" fill="#ffcc33" stroke="${O}" stroke-width="4" ${W}/>
<rect x="88" y="52" width="24" height="18" rx="6" fill="#fff6c9" stroke="${O}" stroke-width="3"/>
<path class="a-glow" d="M100 56 L60 10 L140 10Z" fill="#fff6a8" opacity="0.45"/>
${eye(82, 112, 7)}${eye(118, 112, 7)}
<ellipse cx="100" cy="132" rx="15" ry="11" fill="#ff7a8a" stroke="${O}" stroke-width="3"/>
<ellipse cx="96" cy="128" rx="4" ry="3" fill="#fff" opacity="0.8"/>
${blush(70, 132)}${blush(130, 132)}
<path d="M90 148 Q100 156 110 148" fill="none" stroke="${O}" stroke-width="3" ${W}/>
</g>`,
        rad(g, [[0, '#8a6a58'], [1, '#4b3226']]),
    );
}

function bat(u) {
    const g = `g${u}`;
    const wing = (side) => {
        const s = side === 'l' ? -1 : 1;
        return `<g class="a-flap-${side}" style="transform-origin:${100 + s * 22}px 100px"><path d="M${100 + s * 22} 92 C${100 + s * 50} 60 ${100 + s * 80} 66 ${100 + s * 92} 82 C${100 + s * 80} 86 ${100 + s * 78} 100 ${100 + s * 84} 112 C${100 + s * 70} 108 ${100 + s * 62} 116 ${100 + s * 62} 126 C${100 + s * 50} 116 ${100 + s * 36} 116 ${100 + s * 26} 124Z" fill="#7b4fd6" stroke="${O}" stroke-width="4" ${W}/></g>`;
    };
    return svg(
        `${shadow(100, 182, 40)}
<g class="a-bob">
${wing('l')}${wing('r')}
<ellipse cx="100" cy="112" rx="36" ry="38" fill="url(#${g})" stroke="${O}" stroke-width="4"/>
<path d="M72 84 L66 56 L88 76Z M128 84 L134 56 L112 76Z" fill="#6a3fc4" stroke="${O}" stroke-width="4" ${W}/>
${eye(86, 104, 9, 1)}${eye(114, 104, 9, -1)}
<path d="M90 124 Q100 132 110 124" fill="none" stroke="${O}" stroke-width="3" ${W}/>
<path d="M93 126 L95 133 L98 127 M107 126 L105 133 L102 127" fill="#fff" stroke="${O}" stroke-width="1.5" ${W}/>
${blush(78, 120)}${blush(122, 120)}
</g>`,
        rad(g, [[0, '#a77df0'], [1, '#5a35b0']]),
    );
}

function firefly(u) {
    const g = `g${u}`;
    return svg(
        `<circle class="a-glow" cx="100" cy="128" r="58" fill="#fff59d" opacity="0.35"/>
<g class="a-bob">
<g class="a-flap-l" style="transform-origin:92px 86px"><ellipse cx="66" cy="72" rx="30" ry="18" fill="#d6f3ff" stroke="${O}" stroke-width="3" opacity="0.9" transform="rotate(-25 66 72)"/></g>
<g class="a-flap-r" style="transform-origin:108px 86px"><ellipse cx="134" cy="72" rx="30" ry="18" fill="#d6f3ff" stroke="${O}" stroke-width="3" opacity="0.9" transform="rotate(25 134 72)"/></g>
<ellipse class="a-glow" cx="100" cy="132" rx="30" ry="32" fill="url(#${g})" stroke="${O}" stroke-width="4"/>
<path d="M74 122 Q100 132 126 122" fill="none" stroke="#e0b100" stroke-width="3"/>
<circle cx="100" cy="88" r="30" fill="#3d2d6b" stroke="${O}" stroke-width="4"/>
<path d="M88 62 Q80 42 70 40 M112 62 Q120 42 130 40" fill="none" stroke="${O}" stroke-width="3" ${W}/>
<circle cx="70" cy="40" r="5" fill="#ffe14d" stroke="${O}" stroke-width="2"/><circle cx="130" cy="40" r="5" fill="#ffe14d" stroke="${O}" stroke-width="2"/>
${eye(89, 86, 8, 1)}${eye(111, 86, 8, -1)}
<path d="M92 100 Q100 106 108 100" fill="none" stroke="#fff" stroke-width="3" ${W}/>
</g>
${sparkles([[40, 140, 0.7, 0.3], [164, 146, 0.6, 1], [150, 30, 0.6, 1.6]], '#fff59d')}`,
        rad(g, [[0, '#ffffd0'], [0.5, '#ffe14d'], [1, '#f5b800']], 0.5, 0.5),
    );
}

function spider(u) {
    const g = `g${u}`;
    const legs = [-1, 1]
        .map((s) =>
            [0, 1, 2, 3]
                .map((i) => `<path d="M${100 + s * 24} ${112 + i * 7} Q${100 + s * (52 + i * 4)} ${88 + i * 14} ${100 + s * (66 + i * 2)} ${118 + i * 16}" fill="none" stroke="${O}" stroke-width="5" ${W}/>`)
                .join(''),
        )
        .join('');
    return svg(
        `<line x1="100" y1="0" x2="100" y2="84" stroke="#e8e8e8" stroke-width="2"/>
<g class="a-swing" style="transform-origin:100px 0px">
<line x1="100" y1="0" x2="100" y2="84" stroke="#fff" stroke-width="2" opacity="0.8"/>
${legs}
<circle cx="100" cy="118" r="34" fill="url(#${g})" stroke="${O}" stroke-width="4"/>
${eye(88, 112, 9, 1)}${eye(112, 112, 9, -1)}
<path d="M90 132 Q100 140 110 132" fill="none" stroke="#fff" stroke-width="3" ${W}/>
${blush(78, 128)}${blush(122, 128)}
<path d="M84 90 Q100 80 116 90" fill="none" stroke="#ff7ac1" stroke-width="6" ${W}/>
</g>`,
        rad(g, [[0, '#5a5a7a'], [1, '#22223a']]),
    );
}

function snail(u) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 176, 70)}
<g class="a-bob">
<path d="M30 168 C30 150 46 140 66 140 L150 140 C164 140 174 120 172 96 C171 82 160 76 152 82 C146 88 150 100 146 112 L134 150 L134 168Z" fill="#9be38a" stroke="${O}" stroke-width="4" ${W}/>
<g class="a-wiggle" style="transform-origin:156px 84px"><path d="M152 82 Q148 60 140 52 M162 84 Q166 62 174 54" fill="none" stroke="${O}" stroke-width="3.5" ${W}/><circle cx="140" cy="52" r="6" fill="#9be38a" stroke="${O}" stroke-width="3"/><circle cx="174" cy="54" r="6" fill="#9be38a" stroke="${O}" stroke-width="3"/></g>
<circle cx="88" cy="108" r="50" fill="url(#${g})" stroke="${O}" stroke-width="4"/>
<path d="M88 108 m0 -6 a6 6 0 1 1 -6 6 a12 12 0 1 1 12 12 a20 20 0 1 1 -20 -20 a30 30 0 1 1 30 30" fill="none" stroke="#a0522d" stroke-width="5" ${W}/>
${eye(150, 100, 6)}
<path d="M150 116 Q158 120 164 114" fill="none" stroke="${O}" stroke-width="3" ${W}/>
</g>`,
        rad(g, [[0, '#ffd28a'], [1, '#e8913a']]),
    );
}

function mouse(u) {
    const g = `g${u}`;
    return svg(
        `${shadow()}
<g class="a-wiggle" style="transform-origin:150px 160px"><path d="M146 160 C176 160 182 132 170 120" fill="none" stroke="#f4a3b4" stroke-width="6" ${W}/></g>
<g class="a-bob">
<ellipse cx="100" cy="140" rx="50" ry="38" fill="url(#${g})" stroke="${O}" stroke-width="4"/>
<circle cx="62" cy="62" r="26" fill="#b8b8c8" stroke="${O}" stroke-width="4"/><circle cx="62" cy="62" r="15" fill="#ffb3c1"/>
<circle cx="138" cy="62" r="26" fill="#b8b8c8" stroke="${O}" stroke-width="4"/><circle cx="138" cy="62" r="15" fill="#ffb3c1"/>
<ellipse cx="100" cy="100" rx="42" ry="38" fill="url(#${g})" stroke="${O}" stroke-width="4"/>
${eye(85, 96, 8, 1)}${eye(115, 96, 8, -1)}
<circle cx="100" cy="114" r="7" fill="#ff7a8a" stroke="${O}" stroke-width="3"/>
<path d="M78 116 L56 110 M78 122 L56 124 M122 116 L144 110 M122 122 L144 124" stroke="${O}" stroke-width="2.5" ${W}/>
${blush(76, 112)}${blush(124, 112)}
<path d="M70 166 Q100 146 130 166" fill="#fff" stroke="${O}" stroke-width="3" opacity="0.4"/>
</g>`,
        rad(g, [[0, '#e6e6f0'], [1, '#a2a2b8']]),
    );
}

function lizard(u) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 178, 66)}
<g class="a-bob">
<path d="M58 150 C26 150 22 118 44 112 C58 108 64 124 54 128" fill="none" stroke="#43b05c" stroke-width="16" ${W}/>
<path d="M58 150 C26 150 22 118 44 112 C58 108 64 124 54 128" fill="none" stroke="${O}" stroke-width="3" opacity="0.4" ${W}/>
<ellipse cx="100" cy="142" rx="52" ry="26" fill="url(#${g})" stroke="${O}" stroke-width="4"/>
<path d="M70 162 L64 176 M130 162 L136 176 M76 124 L68 112 M124 124 L132 112" stroke="${O}" stroke-width="6" ${W}/>
<circle cx="142" cy="102" r="34" fill="url(#${g})" stroke="${O}" stroke-width="4"/>
<circle cx="90" cy="134" r="6" fill="#ffe14d"/><circle cx="110" cy="146" r="5" fill="#ffe14d"/><circle cx="120" cy="130" r="4" fill="#ffe14d"/>
${eye(132, 92, 9, 2)}${eye(156, 92, 8, 2)}
<path d="M150 116 Q160 120 170 112" fill="none" stroke="${O}" stroke-width="3" ${W}/>
<g class="a-tongue" style="transform-origin:170px 112px"><path d="M170 112 L190 108 M190 108 L196 102 M190 108 L196 114" stroke="#ff4d6d" stroke-width="4" ${W}/></g>
</g>`,
        rad(g, [[0, '#8be38f'], [1, '#2f9a48']]),
    );
}

function owl(u) {
    const g = `g${u}`;
    return svg(
        `${shadow()}
<path d="M30 170 H170" stroke="#7a4a24" stroke-width="10" ${W}/>
<g class="a-bob">
<path d="M52 160 C40 110 50 60 100 56 C150 60 160 110 148 160Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<path d="M58 66 L52 36 L82 58Z M142 66 L148 36 L118 58Z" fill="#8a5a34" stroke="${O}" stroke-width="4" ${W}/>
<ellipse cx="100" cy="128" rx="30" ry="28" fill="#f1d9b0"/>
<path d="M84 120 Q90 126 96 120 M104 120 Q110 126 116 120 M90 136 Q96 142 102 136 M98 136 Q104 142 110 136" fill="none" stroke="#c9a06a" stroke-width="2.5" ${W}/>
<circle cx="78" cy="92" r="20" fill="#fff4d6" stroke="${O}" stroke-width="3"/><circle cx="122" cy="92" r="20" fill="#fff4d6" stroke="${O}" stroke-width="3"/>
${eye(78, 92, 12)}${eye(122, 92, 12)}
<path d="M94 104 L106 104 L100 114Z" fill="#ffb02e" stroke="${O}" stroke-width="3" ${W}/>
<path d="M72 162 l-6 10 M80 162 v12 M120 162 v12 M128 162 l6 10" stroke="#ffb02e" stroke-width="4" ${W}/>
</g>`,
        rad(g, [[0, '#c48a55'], [1, '#7a4a24']]),
    );
}

/* ===================================================================
 * BANÍKOVA VÝBAVA
 * =================================================================== */

function pickaxe(u) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 182, 40)}
<g class="a-swing" style="transform-origin:100px 170px">
<rect x="92" y="60" width="16" height="116" rx="7" fill="#b5713b" stroke="${O}" stroke-width="4" transform="rotate(-6 100 118)"/>
<path d="M96 72 V160" stroke="#d99a62" stroke-width="4" transform="rotate(-6 100 118)" ${W}/>
<path d="M28 74 C56 44 144 44 172 74 C150 62 120 58 100 60 C80 58 50 62 28 74Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<rect x="86" y="48" width="28" height="22" rx="6" fill="#8a8fa0" stroke="${O}" stroke-width="4"/>
<path d="M44 64 Q70 52 92 52" stroke="#fff" stroke-width="5" fill="none" opacity="0.8" ${W}/>
</g>
${sparkles([[30, 92, 0.8, 0.2], [172, 92, 0.8, 0.9]])}`,
        lin(g, [[0, '#eef2f8'], [0.5, '#b8c0d0'], [1, '#6c7488']]),
    );
}

function lantern(u) {
    const g = `g${u}`;
    return svg(
        `<circle class="a-glow" cx="100" cy="112" r="70" fill="#ffd56b" opacity="0.35"/>
<g class="a-swing" style="transform-origin:100px 20px">
<path d="M100 20 V40" stroke="${O}" stroke-width="4"/>
<path d="M80 52 Q100 22 120 52" fill="none" stroke="#5a5f6e" stroke-width="7" ${W}/>
<rect x="70" y="50" width="60" height="16" rx="6" fill="#c0392b" stroke="${O}" stroke-width="4"/>
<path d="M74 66 L68 150 H132 L126 66Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<path class="a-flicker" style="transform-origin:100px 132px" d="M100 86 C88 104 84 118 92 130 C96 136 104 136 108 130 C116 118 112 104 100 86Z" fill="#ff9f1c" stroke="#e85d04" stroke-width="3"/>
<path d="M100 104 C95 114 95 122 100 128 C105 122 105 114 100 104Z" fill="#fff3b0"/>
<path d="M74 66 V150 M126 66 V150 M100 66 V84" stroke="${O}" stroke-width="3" opacity="0.5"/>
<rect x="62" y="148" width="76" height="16" rx="6" fill="#c0392b" stroke="${O}" stroke-width="4"/>
</g>`,
        lin(g, [[0, '#fff7cc'], [1, '#ffd166']]),
    );
}

function helmet(u) {
    const g = `g${u}`;
    return svg(
        `<path class="a-glow" d="M100 92 L30 20 L170 20Z" fill="#fff6a8" opacity="0.4"/>
${shadow(100, 176, 72)}
<g class="a-float">
<path d="M34 140 C34 84 62 58 100 58 C138 58 166 84 166 140Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<path d="M20 140 Q100 124 180 140 Q184 156 168 158 Q100 146 32 158 Q16 156 20 140Z" fill="#f2b705" stroke="${O}" stroke-width="4" ${W}/>
<path d="M100 60 V140" stroke="#e0a400" stroke-width="10"/>
<circle cx="100" cy="94" r="20" fill="#cfd6e0" stroke="${O}" stroke-width="4"/>
<circle class="a-glow" cx="100" cy="94" r="12" fill="#fffbe0"/>
<path d="M58 90 Q66 72 84 66" stroke="#fff" stroke-width="7" fill="none" opacity="0.8" ${W}/>
</g>`,
        lin(g, [[0, '#ffe066'], [1, '#f2a900']]),
    );
}

function cart(u) {
    const g = `g${u}`;
    const wheel = (x) => `<g class="a-spin" style="transform-origin:${x}px 152px"><circle cx="${x}" cy="152" r="18" fill="#5a5f6e" stroke="${O}" stroke-width="4"/><path d="M${x - 12} 152 H${x + 12} M${x} 140 V164" stroke="#a8afbe" stroke-width="3"/><circle cx="${x}" cy="152" r="5" fill="#a8afbe" stroke="${O}" stroke-width="2"/></g>`;
    return svg(
        `<path d="M10 172 H190" stroke="#7a4a24" stroke-width="6"/><path d="M20 180 v-8 M60 180 v-8 M100 180 v-8 M140 180 v-8 M180 180 v-8" stroke="#7a4a24" stroke-width="5"/>
<g class="a-bob">
<path d="M66 82 C70 58 96 52 104 70 C116 50 142 60 138 82Z" fill="#ffd23f" stroke="${O}" stroke-width="4" ${W}/>
<polygon points="128,64 142,48 150,70" fill="#4fc3f7" stroke="${O}" stroke-width="3" ${W}/>
<polygon points="78,66 70,50 92,58" fill="#e63946" stroke="${O}" stroke-width="3" ${W}/>
<path d="M36 80 H164 L150 142 H50Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<path d="M42 96 H158 M46 118 H154" stroke="${O}" stroke-width="3" opacity="0.45"/>
<circle cx="56" cy="88" r="3" fill="${O}"/><circle cx="144" cy="88" r="3" fill="${O}"/>
${wheel(70)}${wheel(130)}
</g>
${sparkles([[96, 40, 0.8, 0.3], [160, 46, 0.7, 1]], '#fff7b0')}`,
        lin(g, [[0, '#c9824a'], [1, '#8a4f22']]),
    );
}

function shovel(u) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 182, 46)}
<g class="a-swing" style="transform-origin:100px 176px">
<rect x="92" y="20" width="16" height="96" rx="7" fill="#b5713b" stroke="${O}" stroke-width="4"/>
<path d="M78 22 H122 V36 H78Z" fill="#b5713b" stroke="${O}" stroke-width="4" ${W}/>
<path d="M62 112 H138 L134 150 Q100 184 66 150Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<path d="M88 112 V100 H112 V112" fill="#8a8fa0" stroke="${O}" stroke-width="4" ${W}/>
<path d="M74 124 Q76 144 88 152" stroke="#fff" stroke-width="5" fill="none" opacity="0.8" ${W}/>
</g>
<g class="a-bob"><ellipse cx="150" cy="168" rx="22" ry="10" fill="#8a5a34" stroke="${O}" stroke-width="3"/><circle cx="142" cy="162" r="5" fill="#ffd23f" stroke="${O}" stroke-width="2"/></g>`,
        lin(g, [[0, '#eef2f8'], [1, '#8a92a6']], 1, 1),
    );
}

function treasureMap(u) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 182, 70)}
<g class="a-float">
<path d="M30 40 L74 54 L126 38 L170 52 L170 166 L126 152 L74 168 L30 154Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<path d="M74 54 V168 M126 38 V152" stroke="#c9a06a" stroke-width="3"/>
<path class="a-dash" d="M46 140 C60 110 90 132 100 104 C108 82 132 96 144 78" fill="none" stroke="#c0392b" stroke-width="4" stroke-dasharray="8 8" ${W}/>
<g class="a-twinkle" style="transform-origin:146px 74px"><path d="M136 64 L156 84 M156 64 L136 84" stroke="#c0392b" stroke-width="7" ${W}/></g>
<path d="M42 66 Q50 58 58 66 Q66 74 58 82" fill="none" stroke="#6b8f3a" stroke-width="4" ${W}/>
<circle cx="50" cy="146" r="6" fill="#4a6fa5"/>
<path d="M150 130 l8 14 h-16Z" fill="#7a5a43"/>
</g>`,
        lin(g, [[0, '#fff3d1'], [1, '#e7c98f']], 1, 1),
    );
}

function key(u) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 182, 50)}
<g class="a-wiggle" style="transform-origin:100px 100px">
<circle cx="70" cy="100" r="36" fill="url(#${g})" stroke="${O}" stroke-width="4"/>
<circle cx="70" cy="100" r="14" fill="#5a2a0e" stroke="${O}" stroke-width="4"/>
<path d="M104 92 H172 V108 H104Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<path d="M144 108 V128 H158 V108 M164 108 V122 H172 V108" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<path d="M48 84 Q56 70 72 68" stroke="#fff" stroke-width="6" fill="none" ${W}/>
<circle cx="70" cy="70" r="6" fill="#e63946" stroke="${O}" stroke-width="2"/>
</g>
${sparkles([[42, 50, 1, 0], [160, 70, 0.8, 0.7], [150, 150, 0.7, 1.3]], '#fff7b0')}`,
        lin(g, [[0, '#fff39a'], [0.5, '#ffc928'], [1, '#c98a00']], 1, 1),
    );
}

function compass(u) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 182, 52)}
<g class="a-float">
<circle cx="100" cy="104" r="64" fill="url(#${g})" stroke="${O}" stroke-width="4"/>
<circle cx="100" cy="104" r="50" fill="#fff8e6" stroke="${O}" stroke-width="3"/>
<rect x="90" y="30" width="20" height="16" rx="5" fill="#ffc928" stroke="${O}" stroke-width="4"/>
<path d="M100 60 V68 M100 140 V148 M56 104 H64 M136 104 H144" stroke="${O}" stroke-width="3"/>
<g class="a-needle" style="transform-origin:100px 104px"><path d="M100 64 L110 104 L100 104Z" fill="#e63946" stroke="${O}" stroke-width="2"/><path d="M100 64 L90 104 L100 104Z" fill="#ff6b6b" stroke="${O}" stroke-width="2"/><path d="M100 144 L110 104 L90 104Z" fill="#cfd6e0" stroke="${O}" stroke-width="2"/></g>
<circle cx="100" cy="104" r="6" fill="#ffc928" stroke="${O}" stroke-width="2"/>
<path d="M66 78 Q74 66 88 62" stroke="#fff" stroke-width="5" fill="none" opacity="0.8" ${W}/>
</g>`,
        lin(g, [[0, '#ffd36b'], [1, '#c98a00']], 1, 1),
    );
}

/* ===================================================================
 * POKLADY
 * =================================================================== */

function chest(u) {
    const g = `g${u}`;
    return svg(
        `<circle class="a-glow" cx="100" cy="96" r="62" fill="#ffe066" opacity="0.4"/>
${shadow(100, 178, 72)}
<path d="M36 104 H164 V164 Q164 172 156 172 H44 Q36 172 36 164Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<g class="a-lid" style="transform-origin:36px 104px">
<path d="M36 104 V82 C36 52 164 52 164 82 V104Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<path d="M70 58 V104 M130 58 V104" stroke="#e0a400" stroke-width="10"/>
</g>
<path d="M70 104 V172 M130 104 V172" stroke="#e0a400" stroke-width="10"/>
<path d="M36 104 H164" stroke="${O}" stroke-width="4"/>
<rect x="88" y="96" width="24" height="28" rx="5" fill="#ffd23f" stroke="${O}" stroke-width="4"/>
<circle cx="100" cy="108" r="4" fill="${O}"/>
${sparkles([[60, 40, 1, 0], [146, 44, 0.9, 0.6], [100, 22, 0.8, 1.2]], '#fff7b0')}`,
        lin(g, [[0, '#b5713b'], [1, '#6b3a17']]),
    );
}

function crown(u) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 176, 62)}
<g class="a-float">
<path d="M34 150 L28 66 L66 102 L100 50 L134 102 L172 66 L166 150Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<rect x="32" y="142" width="136" height="22" rx="8" fill="#ffc928" stroke="${O}" stroke-width="4"/>
<circle cx="28" cy="62" r="9" fill="#ffd23f" stroke="${O}" stroke-width="3"/><circle cx="100" cy="46" r="10" fill="#ffd23f" stroke="${O}" stroke-width="3"/><circle cx="172" cy="62" r="9" fill="#ffd23f" stroke="${O}" stroke-width="3"/>
<ellipse cx="100" cy="122" rx="12" ry="15" fill="#e63946" stroke="${O}" stroke-width="3"/>
<ellipse cx="62" cy="128" rx="9" ry="11" fill="#4fc3f7" stroke="${O}" stroke-width="3"/><ellipse cx="138" cy="128" rx="9" ry="11" fill="#43b05c" stroke="${O}" stroke-width="3"/>
<path d="M50 112 Q56 96 66 102" stroke="#fff" stroke-width="5" fill="none" ${W}/>
</g>
${sparkles([[40, 34, 1, 0], [164, 34, 0.9, 0.8], [100, 18, 0.8, 1.4]], '#fff7b0')}`,
        lin(g, [[0, '#fff39a'], [0.5, '#ffc928'], [1, '#c98a00']]),
    );
}

function coin(u) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 182, 46)}
<g class="a-coin" style="transform-origin:100px 100px">
<circle cx="100" cy="100" r="66" fill="#c98a00" stroke="${O}" stroke-width="4"/>
<circle cx="100" cy="96" r="62" fill="url(#${g})" stroke="${O}" stroke-width="4"/>
<circle cx="100" cy="96" r="46" fill="none" stroke="#c98a00" stroke-width="4" stroke-dasharray="4 6"/>
<path d="M100 66 L108 86 L130 88 L113 102 L118 124 L100 112 L82 124 L87 102 L70 88 L92 86Z" fill="#fff39a" stroke="#c98a00" stroke-width="3" ${W}/>
<path d="M58 72 Q66 54 86 46" stroke="#fff" stroke-width="7" fill="none" opacity="0.85" ${W}/>
</g>
${sparkles([[40, 44, 1, 0.2], [162, 60, 0.8, 0.9]], '#fff7b0')}`,
        lin(g, [[0, '#fff39a'], [0.5, '#ffd23f'], [1, '#e0a400']], 1, 1),
    );
}

function ring(u) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 182, 46)}
<g class="a-float">
<ellipse cx="100" cy="124" rx="52" ry="46" fill="none" stroke="${O}" stroke-width="20"/>
<ellipse cx="100" cy="124" rx="52" ry="46" fill="none" stroke="url(#${g})" stroke-width="13"/>
<path d="M60 112 Q66 92 86 84" stroke="#fff" stroke-width="5" fill="none" opacity="0.8" ${W}/>
<path d="M80 80 L90 62 H110 L120 80 L100 102Z" fill="#e8f9ff" stroke="${O}" stroke-width="4" ${W}/>
<path d="M90 62 L100 80 L110 62 M80 80 H120 M100 80 V102" stroke="#9fd8ff" stroke-width="2.5" ${W}/>
</g>
${sparkles([[100, 44, 1.2, 0], [140, 66, 0.8, 0.7], [58, 60, 0.7, 1.3]])}`,
        lin(g, [[0, '#fff39a'], [0.5, '#ffc928'], [1, '#c98a00']], 1, 1),
    );
}

function goblet(u) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 182, 46)}
<g class="a-float">
<path d="M52 40 H148 C148 96 128 118 100 120 C72 118 52 96 52 40Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<rect x="92" y="118" width="16" height="34" fill="url(#${g})" stroke="${O}" stroke-width="4"/>
<path d="M64 168 Q100 144 136 168Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<ellipse cx="100" cy="42" rx="48" ry="9" fill="#7b2cbf" stroke="${O}" stroke-width="3"/>
<circle cx="100" cy="76" r="10" fill="#e63946" stroke="${O}" stroke-width="3"/><circle cx="74" cy="70" r="6" fill="#4fc3f7" stroke="${O}" stroke-width="2"/><circle cx="126" cy="70" r="6" fill="#43b05c" stroke="${O}" stroke-width="2"/>
<path d="M62 54 Q64 80 76 96" stroke="#fff" stroke-width="5" fill="none" opacity="0.8" ${W}/>
</g>
${sparkles([[40, 38, 1, 0], [162, 46, 0.8, 0.8], [150, 140, 0.7, 1.4]], '#fff7b0')}`,
        lin(g, [[0, '#fff39a'], [0.5, '#ffc928'], [1, '#c98a00']], 1, 0),
    );
}

function magicStar(u) {
    const g = `g${u}`;
    return svg(
        `<circle class="a-glow" cx="100" cy="100" r="70" fill="#fff59d" opacity="0.35"/>
<g class="a-spin-slow" style="transform-origin:100px 100px">
<path d="M100 22 L122 74 L178 78 L135 114 L149 170 L100 140 L51 170 L65 114 L22 78 L78 74Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
</g>
${eye(88, 102, 8)}${eye(112, 102, 8)}
<path d="M90 120 Q100 130 110 120" fill="none" stroke="${O}" stroke-width="3" ${W}/>
${blush(78, 118)}${blush(122, 118)}
${sparkles([[30, 30, 1, 0], [172, 34, 0.9, 0.5], [174, 168, 0.8, 1], [28, 166, 0.8, 1.5]], '#fff7b0')}`,
        rad(g, [[0, '#fffbe0'], [0.5, '#ffe14d'], [1, '#f5b800']], 0.5, 0.5),
    );
}

function dragonEgg(u) {
    const g = `g${u}`;
    return svg(
        `${shadow(100, 180, 46)}
<path d="M44 176 Q60 150 100 150 Q140 150 156 176Z" fill="#f2c94c" stroke="${O}" stroke-width="4" ${W}/>
<path d="M50 172 l10 -14 M70 168 l6 -16 M130 168 l-6 -16 M150 172 l-10 -14" stroke="#c98a00" stroke-width="3" ${W}/>
<g class="a-wiggle" style="transform-origin:100px 160px">
<path d="M100 30 C140 30 158 96 152 124 C146 152 124 162 100 162 C76 162 54 152 48 124 C42 96 60 30 100 30Z" fill="url(#${g})" stroke="${O}" stroke-width="4" ${W}/>
<path d="M72 70 l10 8 l-12 6Z M124 60 l10 10 l-14 2Z M118 118 l12 8 l-14 6Z M70 124 l12 4 l-10 10Z" fill="#ff8a00" stroke="${O}" stroke-width="2.5" ${W}/>
<path d="M98 92 l8 12 l-6 8 l8 12" fill="none" stroke="${O}" stroke-width="3" ${W}/>
<path d="M70 56 Q76 42 90 38" stroke="#fff" stroke-width="6" fill="none" opacity="0.8" ${W}/>
</g>
${sparkles([[40, 50, 1, 0], [164, 54, 0.9, 0.6], [100, 14, 0.8, 1.2]], '#fff7b0')}`,
        rad(g, [[0, '#b3f5a0'], [0.55, '#3fbf6a'], [1, '#1e7a43']]),
    );
}

/* ===================================================================
 * Mapa id → kresba
 * =================================================================== */
export const ART = {
    // drahokamy
    rubin: (u) => gemClassic(u, ['#ff9aa8', '#e63946', '#8b0f1f']),
    smaragd: (u) => gemEmerald(u, ['#a8f5c0', '#2fbf6a', '#0f6b38']),
    zafir: (u) => gemOval(u, ['#b3d9ff', '#2f6fe0', '#13348a']),
    ametyst: (u) => gemCluster(u, ['#e3c2ff', '#9b5de5', '#4a1d8a']),
    topas: (u) => gemClassic(u, ['#fff1a8', '#ffb703', '#b86e00'], { wide: 0.85 }),
    srdiecko: (u) => gemHeart(u, ['#ffc2e2', '#ff5ca8', '#9e1458']),
    opal: (u) => gemOpal(u),
    nuget: (u) => nugget(u),
    // zvieratká
    krtko: mole,
    netopier: bat,
    svetluska: firefly,
    pavucik: spider,
    slimak: snail,
    myska: mouse,
    jasterica: lizard,
    sova: owl,
    // výbava
    krompac: pickaxe,
    lampa: lantern,
    prilba: helmet,
    vozik: cart,
    lopata: shovel,
    mapa: treasureMap,
    klucik: key,
    kompas: compass,
    // poklady
    truhlica: chest,
    koruna: crown,
    minca: coin,
    prsten: ring,
    kalich: goblet,
    hviezda: magicStar,
    vajce: dragonEgg,
    diamant: (u) => gemClassic(u, ['#ffffff', '#bdeeff', '#5fb6e0'], { wide: 1.1 }),
};
