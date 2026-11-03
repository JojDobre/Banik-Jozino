/**
 * Logika nových minihier úrovne 1 (bez DOM – testovateľná).
 *
 *  - Čo počuješ? (find-picture): zaznie slovo, dieťa ťukne na správny obrázok
 *  - Zvukové pexeso (sound-pexeso): karty hrajú slová, hľadajú sa dvojice podľa sluchu
 *  - Zvončeky v bani (mine-bells): zvončeky zahrajú poradie, dieťa ho zopakuje
 *
 * Slová: zo slovníka (obrázok + nahrávka), primerané veku.
 */
import { WORDS } from '../content/words.js';
import { seededRandom, shuffle } from '../core/levelGenerator.js';

const AGE_NUM = { '3-4': 4, '5-6': 6, '7-8': 8 };

/** Slová vhodné pre sluchové hry (obrázok + nahrávka, vek, krátke pre malých). */
export function listeningWords(ageGroup, words = WORDS) {
    const age = AGE_NUM[ageGroup] || 6;
    const maxSyl = ageGroup === '3-4' ? 2 : ageGroup === '5-6' ? 3 : 4;
    return words.filter((w) => w.image && w.audio && w.minAge <= age && w.syllables <= maxSyl);
}

/** Podobnosť slov (na pomýlenie): rovnaký začiatok, dĺžka, počet slabík. */
function similarity(a, b) {
    let s = 0;
    if (a.word[0] === b.word[0]) s += 3;
    if (a.word.slice(-2) === b.word.slice(-2)) s += 2;
    if (a.syllables === b.syllables) s += 1;
    if (Math.abs(a.word.length - b.word.length) <= 1) s += 1;
    return s;
}

/**
 * Kolá hry „Čo počuješ?“.
 * Počet obrázkov: 3–4 roky 2–3, 5–6 rokov 3, 7–8 rokov 4. Starší dostanú
 * podobnejšie slová (ťažšie rozlíšiť sluchom).
 * @returns [{ target, options: [word…] }]
 */
export function makePictureRounds({ count, ageGroup = '5-6', levelNumber = 1, seed = 'p', words = WORDS }) {
    const rng = seededRandom(`fp:${seed}:${levelNumber}:${ageGroup}`);
    const pool = listeningWords(ageGroup, words);
    const nOptions = ageGroup === '3-4' ? (levelNumber > 10 ? 3 : 2) : ageGroup === '5-6' ? 3 : 4;
    const hard = ageGroup !== '3-4' && levelNumber > 5;
    const targets = shuffle(pool, rng).slice(0, count);
    return targets.map((t) => {
        const others = pool.filter((w) => w.word !== t.word);
        let distract;
        if (hard) {
            // najpodobnejšie slová (s trochou náhody)
            distract = others
                .map((w) => ({ w, s: similarity(t, w) + rng() * 1.5 }))
                .sort((a, b) => b.s - a.s)
                .slice(0, nOptions - 1)
                .map((x) => x.w);
        } else {
            distract = shuffle(others, rng).slice(0, nOptions - 1);
        }
        return { target: t.word, options: shuffle([t, ...distract], rng).map((w) => w.word) };
    });
}

/**
 * Rozloženie zvukového pexesa: dvojice kariet s rovnakým slovom, zamiešané.
 * Počet dvojíc podľa veku a levelu: 3–4 roky 3–4, 5–6 rokov 4–5, 7–8 rokov 5–6.
 * @returns { pairs, cards: [word…] }
 */
export function makeSoundBoard({ ageGroup = '5-6', levelNumber = 1, seed = 's', words = WORDS }) {
    const rng = seededRandom(`sp:${seed}:${levelNumber}:${ageGroup}`);
    const base = { '3-4': 3, '5-6': 4, '7-8': 5 }[ageGroup] || 4;
    const pairs = base + (levelNumber > 12 ? 1 : 0);
    const pool = listeningWords(ageGroup, words);
    // dvojice čo najrozdielnejších slov (začínajú inou hláskou), aby išli rozlíšiť
    const chosen = [];
    for (const w of shuffle(pool, rng)) {
        if (chosen.length >= pairs) break;
        if (chosen.some((c) => c.word[0] === w.word[0])) continue;
        chosen.push(w);
    }
    for (const w of shuffle(pool, rng)) {
        if (chosen.length >= pairs) break;
        if (!chosen.includes(w)) chosen.push(w);
    }
    const cards = shuffle([...chosen, ...chosen].map((w) => w.word), rng);
    return { pairs: chosen.length, cards };
}

/** Hviezdy pexesa podľa počtu otočení dvojíc (menej = lepšie). */
export function soundPexesoStars(pairs, moves) {
    if (moves <= Math.ceil(pairs * 1.6)) return 3;
    if (moves <= Math.ceil(pairs * 2.6)) return 2;
    return 1;
}

/**
 * Plán hry „Zvončeky v bani“: počet zvončekov a dĺžky poradí v kolách.
 * Poradie začína krátke a predlžuje sa; vyššie levely = dlhšie.
 * @returns { bells, rounds: [[index…]…] }
 */
export function makeBellsPlan({ ageGroup = '5-6', levelNumber = 1, seed = 'b' }) {
    const rng = seededRandom(`mb:${seed}:${levelNumber}:${ageGroup}`);
    const bells = ageGroup === '3-4' ? 3 : 4;
    const start = 2 + Math.floor((levelNumber - 1) / 10);
    const roundsCount = ageGroup === '7-8' ? 4 : 3;
    const rounds = [];
    for (let i = 0; i < roundsCount; i++) {
        const len = start + i;
        const seq = [];
        for (let k = 0; k < len; k++) {
            let b = Math.floor(rng() * bells);
            // nie trikrát ten istý zvonček za sebou (ťažko počuť)
            if (k >= 2 && seq[k - 1] === b && seq[k - 2] === b) b = (b + 1) % bells;
            seq.push(b);
        }
        rounds.push(seq);
    }
    return { bells, rounds };
}
