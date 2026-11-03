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
    // minihry úrovne 1
    'Počúvaj slovo a ťukni na obrázok, ktorý počuješ.',
    'Ťukni na kartu a počúvaj. Nájdi dve karty, ktoré povedia rovnaké slovo.',
    'Zvončeky zahrajú pesničku. Počúvaj a potom ju zopakuj.',
    'Počúvaj slovo. Na akú hlásku začína? Ťukni na správny vozík.',
    'Nevadí, ideme ďalej!',
    'Dobrá práca!',
    'Skúsime znova?',
    // Super Jožino a Baňa
    'Super skok! Skáčeš vyššie',
    'Hľadaj poklady! Kopaj krompáčom.',
    'Ťukni na krompáč a kopaj!',
    'Tvrdý kameň – obíď ho!',
    'Výborne! Level je hotový.',
    'Skús znova',
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
