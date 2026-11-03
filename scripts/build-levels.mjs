/**
 * Vygeneruje public/config/levels.js (levely svetov písmen) zo slovníka slov.
 *   npm run build:levels
 * Logika: src/core/worldLevels.js. Pomocné funkcie na konci súboru
 * (getLevelConfig, getNextLevel …): scripts/templates/levels-helpers.js.
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { buildAllLevels } from '../src/core/worldLevels.js';

// poradie svetov ako v pôvodnej konfigurácii
const ORDER = ['world_r', 'world_l', 'world_s', 'world_ch', 'world_z', 'world_c', 'world_sh', 'world_zh',
    'world_dh', 'world_d', 'world_t', 'world_th', 'world_n', 'world_nh', 'world_k', 'world_g'];

const all = buildAllLevels(ORDER);
const helpers = readFileSync(new URL('./templates/levels-helpers.js', import.meta.url), 'utf8');

const header = `/**
 * Konfigurácia levelov svetov písmen (úroveň 3).
 *
 * VYGENEROVANÉ skriptom scripts/build-levels.mjs (npm run build:levels) zo slovníka
 * slov – neupravovať ručne. Pravidlá: src/core/worldLevels.js.
 *
 * Štruktúra levelu:
 * - id, worldId, levelNumber, name, stage (etapa: hláska na začiatku / na konci / …)
 * - gameType: 'banik' (Baňa – pôvodná pre 3–4 roky, nová s preskúmavaním od 5 rokov),
 *   'pexeso', 'mario' (Super Jožino, mapa gameConfig.sjLevel)
 * - words: slová na precvičovanie
 * - gameConfig: diamonds (rečové cvičenia), golds, crystals (posluchové cvičenia),
 *   pairs (pexeso), sjLevel (Super Jožino), voliteľne mineSize, timeLimit
 * - unlockRequirement: { levelId, minStars } – predchádzajúci level
 * - timeLimit: časový limit v sekundách (null = bez časomiery)
 */

`;

let body = 'const LEVELS_CONFIG = {\n';
for (const id of ORDER) {
    body += `    // ===== ${id} =====\n    ${id}: [\n`;
    for (const lvl of all[id]) body += `        ${JSON.stringify(lvl)},\n`;
    body += '    ],\n';
}
body += '};\n\n';

writeFileSync(new URL('../public/config/levels.js', import.meta.url), header + body + helpers);
const total = Object.values(all).reduce((n, l) => n + l.length, 0);
const types = {};
Object.values(all).flat().forEach((l) => { types[l.gameType] = (types[l.gameType] || 0) + 1; });
console.log(`levels.js: ${total} levelov`, types);
