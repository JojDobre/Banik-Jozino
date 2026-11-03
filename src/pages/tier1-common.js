/**
 * Spoločné časti minihier úrovne 1 (Počúvam): spustenie levelu z cesty,
 * hlavička s kolami, spätná väzba, koniec levelu (hviezdy, postup, karty).
 */
import { h, topbar, requireProfile, say, stars, pause } from '../ui/kit.js';
import { buildTier1Path, TIER1_SET, CHAPTERS, levelUrl } from '../content/tier1.js';
import { getWord } from '../content/words.js';

const BJ = window.BJ;

/**
 * Spustí minihru pre level z adresy (?level=t1_05). Zamknutý level vráti na mapu.
 * @param {(ctx) => void} start – ctx: { level, path, profile, backHref }
 */
export function bootTier1(start) {
    const profile = requireProfile();
    if (!profile) return;
    const path = buildTier1Path(profile.ageGroup);
    const id = new URLSearchParams(location.search).get('level');
    const level = path.find((l) => l.id === id) || path[0];
    const prog = BJ.tierProgress();
    if (!prog.isUnlocked(path, path.indexOf(level))) {
        location.replace(`cesta.html?chapter=${level.chapter}`);
        return;
    }
    document.title = `Level ${level.number} – ${CHAPTERS[level.chapter - 1].title}`;
    start({ level, path, profile, backHref: `cesta.html?chapter=${level.chapter}` });
}

/** Hlavička: tabuľa s názvom hry, „Level N“ a bodky kôl. */
export function gameHead(title, count) {
    const dots = Array.from({ length: count }, () => h('span.round-dot'));
    const label = h('div.game-sub');
    const el = h('div.game-head', {}, [
        h('h1.game-sign', { text: title }),
        h('div.game-progress', {}, [label, h('div.round-dots', {}, dots)]),
    ]);
    return {
        el,
        update(levelNumber, index) {
            label.textContent = `Level ${levelNumber}`;
            dots.forEach((d, i) => {
                d.classList.toggle('is-done', i < index);
                d.classList.toggle('is-current', i === index);
            });
        },
    };
}

/** Spätná väzba cez celú obrazovku (rovnaká ako v „Rovnaké alebo iné?“). */
export function feedbackLayer() {
    const el = h('div.feedback', { 'aria-live': 'polite' });
    return {
        el,
        async show(ok, text, ms = 1400) {
            BJ.audio.playEffect(ok ? 'correct' : 'wrong');
            el.replaceChildren(
                h('img', { src: ok ? 'images/spravne.png' : 'images/nespravne.png', alt: '' }),
                h('div.feedback__text', { text }),
            );
            el.className = 'feedback is-visible ' + (ok ? 'is-ok' : 'is-bad');
            say(text);
            await pause(ms);
            el.className = 'feedback';
            await pause(180);
        },
    };
}

/** Prehranie slova (nahrávka zo slovníka), s poistkou proti zaseknutiu. */
export function playWord(word, maxMs = 3500) {
    const w = getWord(word);
    const src = w && w.audio;
    if (!src) return Promise.race([say(word), pause(1500)]);
    return Promise.race([BJ.audio.play(src), pause(maxMs)]);
}

/**
 * Koniec levelu: uloží hviezdy, ukáže výsledok (Znova / Ďalej) a udelí karty.
 * @param {object} o – { level, path, backHref, earned (0–3), summary (text) }
 */
export function finishLevel({ level, path, backHref, earned, summary }) {
    const prog = BJ.tierProgress();
    const result = prog.record(level.id, earned);
    const next = path[path.indexOf(level) + 1];
    const nextUnlocked = next && prog.isUnlocked(path, path.indexOf(next));
    const title = earned === 3 ? 'Výborne!' : earned >= 1 ? 'Dobrá práca!' : 'Skúsime znova?';
    const end = h('div.bj-modal', {}, [
        h('div.bj-modal__box.bj-panel.end-box', { 'data-reward-slot': '' }, [
            h('h2.bj-title.bj-title--yellow', { text: title }),
            h('div.end-stars', {}, [stars(earned)]),
            summary ? h('div.bj-text', { text: summary }) : null,
            h('div.bj-row', {}, [
                h('a.bj-btn', { href: location.href, text: 'Znova' }),
                nextUnlocked
                    ? h('a.bj-btn.bj-btn--primary', { href: levelUrl(next), text: 'Ďalej' })
                    : h('a.bj-btn.bj-btn--primary', { href: backHref, text: 'Mapa' }),
            ]),
        ]),
    ]);
    (document.getElementById('bj-stage') || document.body).append(end);
    if (earned >= 1) BJ.audio.playEffect('win');
    say(title);
    BJ.rewards.rewardLevel({
        worldId: TIER1_SET,
        levelNumber: level.number,
        stars: earned,
        previousStars: result.previousStars,
        firstCompletion: result.firstCompletion,
    });
}

/** Horná lišta minihry (späť na mapu, profil, nastavenia). */
export function gameTopbar(backHref, profile) {
    return topbar({ back: backHref, profile, album: false });
}
