/**
 * Prehrávanie zvukov (efekty, nahrávky slov) – tenký obal nad Howler.js.
 * Howler sa načítava ako klasický skript (public/js/vendor/howler.min.js),
 * preto ho berieme z window.Howl.
 */

export const EFFECTS = {
    correct: 'zvuky/effects/spravne.mp3',
    wrong: 'zvuky/effects/zle.mp3',
    win: 'zvuky/effects/vyhra.mp3',
    click: 'zvuky/effects/click.mp3',
    flip: 'zvuky/effects/flipcard.mp3',
    collect: 'zvuky/effects/collectpoints.mp3',
};

/** Cesta k nahrávke slova (ak existuje). */
export const wordAudioPath = (word) => `zvuky/${word}.wav`;

export function createAudioService({ effects = EFFECTS } = {}) {
    const cache = new Map();
    let muted = false;
    let volume = 1;

    const HowlClass = () => (typeof window !== 'undefined' ? window.Howl : undefined);

    function get(src) {
        if (cache.has(src)) return cache.get(src);
        const Howl = HowlClass();
        if (!Howl) return null;
        const howl = new Howl({ src: [src], volume, preload: true });
        cache.set(src, howl);
        return howl;
    }

    /** Prehrá súbor; vráti Promise, ktorý sa splní po dohraní. */
    function play(src) {
        if (muted) return Promise.resolve(false);
        const howl = get(src);
        if (howl) {
            return new Promise((resolve) => {
                const id = howl.play();
                howl.once('end', () => resolve(true), id);
                howl.once('playerror', () => resolve(false), id);
                howl.once('loaderror', () => resolve(false));
            });
        }
        // Záloha bez Howleru
        if (typeof Audio === 'undefined') return Promise.resolve(false);
        const el = new Audio(src);
        el.volume = volume;
        return new Promise((resolve) => {
            el.onended = () => resolve(true);
            el.onerror = () => resolve(false);
            el.play().catch(() => resolve(false));
        });
    }

    return {
        effects,
        play,
        playEffect(name) {
            const src = effects[name];
            return src ? play(src) : Promise.resolve(false);
        },
        playWord(word) {
            return play(wordAudioPath(word));
        },
        preload(srcs) {
            srcs.forEach(get);
        },
        setMuted(value) {
            muted = Boolean(value);
            if (muted) cache.forEach((h) => h.stop());
        },
        get muted() {
            return muted;
        },
        setVolume(value) {
            volume = Math.min(1, Math.max(0, value));
            cache.forEach((h) => h.volume(volume));
        },
    };
}
