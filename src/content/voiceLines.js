/**
 * Vety, ktoré hra číta nahlas. Pre každú sa vopred vygeneruje nahrávka
 * (npm run build:voice → public/hlas/*.mp3 + src/content/voice.generated.js).
 * Ak nahrávka pre nejaký text chýba, prečíta ho systémový hlas (TTS).
 *
 * Novú vetu pridáš sem a spustíš npm run build:voice.
 */
import { CARDS, SETS } from './cards/index.js';

export const LINES = [
    // profil
    'Ahoj! Ako sa voláš? Koľko máš rokov?',
    'Kto bude hrať?',
    'Nový hráč',
    'Upraviť hráča',
    // úrovne a cesta
    'Čo budeme cvičiť?',
    'Čo budeme cvičiť? Počúvanie, zvuky alebo slová?',
    'Počúvam. Ťukni na tlačidlo Hrať.',
    'Ťukni na tlačidlo Hrať.',
    // minihra Rovnaké alebo iné
    'Počúvaj dvoch baníkov. Povedali rovnaké slovo, alebo iné?',
    'Rovnaké alebo iné?',
    'Výborne!',
    'Skús ešte raz!',
    'Boli rovnaké.',
    'Boli iné.',
    'Dobrá práca!',
    'Skúsime znova?',
    // karty a album
    'Máš neotvorený balíček kariet!',
    'Máš odmenu! Ťukni na balíček.',
    'Ťukni na balíček!',
    'Nová karta!',
    'Nové karty!',
    'Túto kartu už máš.',
    'Moja zbierka',
    // nastavenia
    'Nastavenia',
    ...SETS.map((s) => s.name),
    ...CARDS.map((c) => c.name),
];
