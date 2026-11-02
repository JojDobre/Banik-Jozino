/**
 * Pomôcky pre slovenčinu: porovnanie rozpoznaného slova, slabiky, poloha hlásky v slove.
 *
 * Analýza je heuristická (podľa pravopisu, nie výslovnosti). Pre väčšinu slov
 * v hre sedí; výnimky sa dajú ručne opraviť v src/content/word-overrides.js.
 */

/** Hlásky (svety), ktoré hra precvičuje. */
export const TARGET_PHONEMES = ['R', 'L', 'C', 'Z', 'S', 'Č', 'Ž', 'Š', 'K', 'G', 'D', 'T', 'N', 'Ď', 'Ť', 'Ň'];

const VOWELS = new Set(['a', 'á', 'ä', 'e', 'é', 'i', 'í', 'o', 'ó', 'ô', 'u', 'ú', 'y', 'ý']);
const DIGRAPHS = ['dž', 'dz', 'ch'];
const SYLLABIC = new Set(['r', 'l', 'ŕ', 'ĺ']);
/** D, T, N pred e/i/í sa vyslovujú mäkko (deti = ďeťi). */
const SOFTENS = { d: 'ď', t: 'ť', n: 'ň' };
const SOFTENING_VOWELS = new Set(['e', 'i', 'í']);

/**
 * Normalizácia rozpoznaného textu – rovnaká ako v pôvodnej hre Baňa (js/game.js).
 */
export function normalizeTranscript(text) {
    return String(text ?? '')
        .trim()
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
}

/**
 * Zhoduje sa rozpoznaný text s očakávaným slovom?
 * Zámerne prísne (presná zhoda) – takto to fungovalo v Bani a osvedčilo sa.
 */
export function matchesWord(transcript, expectedWord) {
    return normalizeTranscript(transcript) === String(expectedWord ?? '').toLowerCase();
}

/** Rozdelenie slova na grafémy (ch, dz, dž ako jedna hláska). */
export function tokenize(word) {
    const w = String(word).toLowerCase();
    const tokens = [];
    for (let i = 0; i < w.length; ) {
        const di = DIGRAPHS.find((d) => w.startsWith(d, i));
        if (di) {
            tokens.push(di);
            i += di.length;
        } else {
            tokens.push(w[i]);
            i += 1;
        }
    }
    return tokens;
}

const isVowel = (t) => VOWELS.has(t);
const isLetter = (t) => /\p{L}/u.test(t);
const isConsonant = (t) => isLetter(t) && !isVowel(t);

/**
 * Počet slabík (približne). Dvojhlásky ia/ie/iu sú jedna slabika,
 * slabikotvorné r/l medzi spoluhláskami (krtko, vlk) sa počítajú ako slabika.
 */
export function countSyllables(word) {
    const t = tokenize(word).filter(isLetter);
    let count = 0;
    for (let i = 0; i < t.length; i++) {
        const cur = t[i];
        if (isVowel(cur)) {
            const prev = t[i - 1];
            if (prev === 'i' && (cur === 'a' || cur === 'e' || cur === 'u')) continue; // dvojhláska
            count++;
        } else if (SYLLABIC.has(cur)) {
            const prev = t[i - 1];
            const next = t[i + 1];
            const prevCons = prev !== undefined && isConsonant(prev);
            const nextCons = next === undefined || isConsonant(next);
            if (prevCons && nextCons) count++;
        }
    }
    return Math.max(count, 1);
}

/** Hláska, ktorá v slove reálne zaznie (s mäkčením d/t/n pred e/i/í). */
function spokenPhoneme(tokens, i) {
    const t = tokens[i];
    const next = tokens[i + 1];
    if (SOFTENS[t] && next && SOFTENING_VOWELS.has(next)) return SOFTENS[t].toUpperCase();
    return t.toUpperCase();
}

/**
 * Kde sa v slove nachádza hláska?
 * @returns {{ positions: string[], cluster: boolean } | null}
 *   positions: 'initial' | 'medial' | 'final'; cluster = stojí vedľa inej spoluhlásky (dr, kr, st…)
 */
export function analyzePhoneme(word, phoneme) {
    const target = phoneme.toUpperCase();
    const tokens = tokenize(word).filter(isLetter);
    const positions = new Set();
    let cluster = false;
    tokens.forEach((_, i) => {
        if (spokenPhoneme(tokens, i) !== target) return;
        if (i === 0) positions.add('initial');
        else if (i === tokens.length - 1) positions.add('final');
        else positions.add('medial');
        const prev = tokens[i - 1];
        const next = tokens[i + 1];
        if ((prev && isConsonant(prev)) || (next && isConsonant(next))) cluster = true;
    });
    if (positions.size === 0) return null;
    return { positions: [...positions], cluster };
}

/** Všetky precvičované hlásky, ktoré sa v slove vyskytujú. */
export function analyzeWord(word) {
    const phonemes = {};
    for (const p of TARGET_PHONEMES) {
        const a = analyzePhoneme(word, p);
        if (a) phonemes[p] = a;
    }
    return { syllables: countSyllables(word), phonemes };
}
