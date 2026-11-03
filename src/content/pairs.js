/**
 * Minimálne dvojice – slová, ktoré sa líšia jedinou hláskou (pre „Rovnaké
 * alebo iné?“). Nahrávky: npm run build:word-audio (hlas Piper), súbory
 * v public/hlas/slova/. Popri nich ostávajú ľudské nahrávky v zvuky/<1..15>/.
 *
 * [slovo A, slovo B, rozdiel] – rozdiel slúži na neskoršie štatistiky pre rodiča.
 */
export const WORD_PAIRS = [
    // R – L
    ['rak', 'lak', 'R–L'],
    ['bar', 'bál', 'R–L'],
    ['ráno', 'láno', 'R–L'],
    ['rampa', 'lampa', 'R–L'],
    ['kora', 'kola', 'R–L'],
    ['mor', 'mol', 'R–L'],
    // S – Š
    ['kasa', 'kaša', 'S–Š'],
    ['sál', 'šál', 'S–Š'],
    ['sila', 'šila', 'S–Š'],
    ['kos', 'koš', 'S–Š'],
    // Z – Ž
    ['koza', 'koža', 'Z–Ž'],
    ['váza', 'váža', 'Z–Ž'],
    // C – Č
    ['cíp', 'čip', 'C–Č'],
    ['pec', 'peč', 'C–Č'],
    // K – T
    ['kúra', 'túra', 'K–T'],
    ['kanec', 'tanec', 'K–T'],
    // K – G
    ['kôl', 'gól', 'K–G'],
    // D – T
    ['dúha', 'túha', 'D–T'],
    ['drak', 'trak', 'D–T'],
    // B – P
    ['bije', 'pije', 'B–P'],
    ['bas', 'pas', 'B–P'],
];

/** Všetky slová z dvojíc (na generovanie nahrávok). */
export const PAIR_WORDS = [...new Set(WORD_PAIRS.flatMap(([a, b]) => [a, b]))];
