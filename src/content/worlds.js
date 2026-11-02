/**
 * Svety písmen (úroveň 3) – poradie a názvy pre nové obrazovky.
 * Zodpovedá public/config/worlds.js (pôvodná konfigurácia svetov).
 */
export const WORLD_ORDER = [
    'world_r', 'world_l', 'world_c', 'world_z', 'world_s', 'world_ch', 'world_zh', 'world_sh',
    'world_k', 'world_g', 'world_d', 'world_t', 'world_n', 'world_dh', 'world_th', 'world_nh',
];

const LABELS = {
    world_r: 'R', world_l: 'L', world_c: 'C', world_z: 'Z', world_s: 'S',
    world_ch: 'Č', world_zh: 'Ž', world_sh: 'Š', world_k: 'K', world_g: 'G',
    world_d: 'D', world_t: 'T', world_n: 'N', world_dh: 'Ď', world_th: 'Ť', world_nh: 'Ň',
};

export function worldLabel(id) {
    return LABELS[id] || id;
}
