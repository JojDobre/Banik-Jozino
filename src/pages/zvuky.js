/**
 * Úroveň 2 – Zvuky a hlásky (zvuky.html).
 *   zvuky.html            – výber hry
 *   zvuky.html?hra=balon  – Fúkaj na balón (fúkanie)
 *   zvuky.html?hra=had    – Had Sykáčik (sss)
 *   zvuky.html?hra=vcielka – Včielka Bzzz (zzz)
 *
 * Kým dieťa drží správny zvuk, postavička postupuje (balón rastie, had sa plazí,
 * včielka letí). Rozpoznávanie beží v zariadení (src/core/micListener.js).
 */
import '../bridge.js';
import { h, topbar, requireProfile, say, pause, stars, endStats, endActions, ICONS } from '../ui/kit.js';
import { SOUND_GAMES, getSoundGame, goalFor, soundStars, hintFor } from '../games/soundGames.js';
import { listenSounds, micErrorText } from '../core/micListener.js';

const BJ = window.BJ;
const app = document.getElementById('app');
const profile = requireProfile();
const q = new URLSearchParams(location.search);
const levelId = (id) => `t2_${id}`;

const ART = {
    balon: '<svg viewBox="0 0 100 120" aria-hidden="true"><path d="M50 8c-20 0-32 16-32 34 0 22 18 38 32 42 14-4 32-20 32-42C82 24 70 8 50 8z" fill="#ff5a4e" stroke="#000" stroke-width="4"/><path d="M46 84l4 6 4-6z" fill="#ff5a4e" stroke="#000" stroke-width="3"/><path d="M50 90c-6 10 6 16 0 26" fill="none" stroke="#000" stroke-width="2.5"/><ellipse cx="38" cy="30" rx="6" ry="10" fill="#fff" opacity=".55"/></svg>',
    had: '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M10 60c10-20 25-20 35 0s25 20 35 0 20-25 30-20" fill="none" stroke="#000" stroke-width="16" stroke-linecap="round"/><path d="M10 60c10-20 25-20 35 0s25 20 35 0 20-25 30-20" fill="none" stroke="#4caf50" stroke-width="10" stroke-linecap="round"/><circle cx="108" cy="40" r="12" fill="#4caf50" stroke="#000" stroke-width="4"/><circle cx="112" cy="36" r="3" fill="#000"/><path d="M119 44l8 2-8 2" stroke="#ff5a4e" stroke-width="2.5" fill="none"/></svg>',
    vcielka: '<svg viewBox="0 0 100 80" aria-hidden="true"><ellipse cx="40" cy="22" rx="14" ry="18" fill="#dff4ff" stroke="#000" stroke-width="3" opacity=".9"/><ellipse cx="60" cy="22" rx="14" ry="18" fill="#dff4ff" stroke="#000" stroke-width="3" opacity=".9"/><ellipse cx="50" cy="50" rx="30" ry="22" fill="#ffd34d" stroke="#000" stroke-width="4"/><path d="M42 30v40M58 30v40" stroke="#000" stroke-width="7"/><circle cx="78" cy="46" r="4" fill="#000"/><path d="M20 50h-10" stroke="#000" stroke-width="4"/></svg>',
};

// ===================== scény =====================
function balloonScene() {
    const balloon = h('div.zv-balloon', { html: ART.balon });
    const el = h('div.zv-scene.zv-scene--balon', {}, [h('div.zv-sky'), balloon]);
    return {
        el,
        set(p) { balloon.style.setProperty('--p', p.toFixed(3)); },
        async done() { balloon.classList.add('is-fly'); await pause(1100); balloon.classList.remove('is-fly'); },
    };
}
function snakeScene() {
    const snake = h('div.zv-snake', { html: ART.had });
    const apple = h('div.zv-goal', { text: '🍎' });
    const el = h('div.zv-scene.zv-scene--had', {}, [h('div.zv-grass'), apple, snake]);
    return {
        el,
        set(p) { snake.style.setProperty('--p', p.toFixed(3)); },
        moving(on) { snake.classList.toggle('is-moving', on); },
        async done() { apple.classList.add('is-eaten'); await pause(1100); apple.classList.remove('is-eaten'); },
    };
}
function beeScene() {
    const bee = h('div.zv-bee', { html: ART.vcielka });
    const flower = h('div.zv-goal.zv-goal--flower', { text: '🌼' });
    const el = h('div.zv-scene.zv-scene--vcielka', {}, [h('div.zv-sky'), h('div.zv-grass'), flower, bee]);
    return {
        el,
        set(p) { bee.style.setProperty('--p', p.toFixed(3)); bee.style.setProperty('--y', (Math.sin(p * Math.PI * 3) * 60).toFixed(1)); },
        moving(on) { bee.classList.toggle('is-moving', on); },
        async done() { flower.classList.add('is-happy'); await pause(1100); flower.classList.remove('is-happy'); },
    };
}
const SCENES = { balon: balloonScene, had: snakeScene, vcielka: beeScene };

// ===================== hra =====================
function playGame(game) {
    const goal = goalFor(profile.ageGroup);
    const scene = SCENES[game.id]();
    const dots = Array.from({ length: game.rounds }, () => h('span.round-dot'));
    const head = h('div.game-head', {}, [
        h('h1.game-sign', { text: game.title }),
        h('div.game-progress', {}, [h('div.game-sub', { text: `Výdrž ${(goal / 1000).toFixed(1)} s` }), h('div.round-dots', {}, dots)]),
    ]);
    const sign = h('div.zv-sign', { text: game.intro });
    const meter = h('div.zv-meter', {}, [h('div.zv-meter__fill')]);
    const bar = h('div.zv-bar', {}, [h('div.zv-progress', {}, [h('div.zv-progress__fill')]), meter]);
    const startBtn = h('button.zv-start', { type: 'button', 'aria-label': 'Začať', html: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/></svg>' });
    const overlay = h('div.zv-overlay', {}, [startBtn, h('div.zv-overlay__text', { text: 'Ťukni a začni' })]);

    let round = 0;
    let progress = 0;
    let best = 0;
    let total = 0;
    let mic = null;
    let busy = false;
    let lastHint = 0;

    const setDots = () => dots.forEach((d, i) => { d.classList.toggle('is-done', i < round); d.classList.toggle('is-current', i === round); });
    setDots();
    scene.set(0);

    function onUpdate(s) {
        if (s.phase === 'calib') {
            sign.textContent = 'Chvíľku ticho…';
            return;
        }
        meter.firstChild.style.width = `${Math.round(s.level * 100)}%`;
        if (busy) return;
        const ok = s.label === game.target;
        scene.moving && scene.moving(ok);
        if (ok) {
            progress = Math.min(1, progress + 33 / goal);
            total += 33;
            best = Math.max(best, s.held);
            sign.textContent = game.hint;
            sign.classList.remove('is-bad');
            sign.classList.add('is-good');
        } else {
            sign.classList.remove('is-good');
            const hint = hintFor(game, s.label);
            if (hint && s.confidence > 0.5) {
                sign.textContent = hint;
                sign.classList.add('is-bad');
                const now = performance.now();
                if (now - lastHint > 6000) { lastHint = now; say(hint); }
            } else if (s.label === 'ticho') {
                sign.textContent = game.hint;
                sign.classList.remove('is-bad');
            }
        }
        scene.set(progress);
        bar.firstChild.firstChild.style.width = `${Math.round(progress * 100)}%`;
        if (progress >= 1) roundDone();
    }

    async function roundDone() {
        busy = true;
        scene.moving && scene.moving(false);
        BJ.audio.playEffect('correct');
        sign.textContent = 'Výborne!';
        await scene.done();
        round++;
        setDots();
        if (round >= game.rounds) return finish();
        progress = 0;
        scene.set(0);
        bar.firstChild.firstChild.style.width = '0%';
        mic && mic.resetHold();
        sign.textContent = game.hint;
        busy = false;
    }

    function finish() {
        mic && mic.stop();
        mic = null;
        const earned = soundStars(best, goal);
        BJ.tierProgress().record(levelId(game.id), earned);
        const title = earned === 3 ? 'Výborne!' : 'Dobrá práca!';
        (document.getElementById('bj-stage') || document.body).append(h('div.bj-modal', {}, [
            h('div.bj-modal__box.bj-panel.end-box', {}, [
                h('h2.bj-title.bj-title--yellow', { text: title }),
                h('div.end-stars', {}, [stars(earned)]),
                endStats([
                    { icon: 'time', value: `${(best / 1000).toFixed(1)} s`, label: 'najdlhšie' },
                    { icon: 'tries', value: `${(total / 1000).toFixed(1)} s`, label: 'spolu' },
                ]),
                endActions({ replay: location.href, map: 'zvuky.html' }),
            ]),
        ]));
        BJ.audio.playEffect('win');
        say(title);
    }

    startBtn.onclick = async () => {
        overlay.remove();
        try {
            mic = await listenSounds({ target: game.target, onUpdate });
            say(game.intro);
        } catch (e) {
            sign.textContent = micErrorText(e);
            sign.classList.add('is-bad');
        }
    };
    window.addEventListener('pagehide', () => mic && mic.stop());

    app.replaceChildren(
        topbar({ back: 'zvuky.html', profile, album: false }),
        head,
        h('div.zv-stage', {}, [h('div.zv-frame.bj-panel', {}, [scene.el, overlay]), h('div.zv-under', {}, [sign, bar])]),
    );
    // stav pre automatické testy
    window.BJGame = { game, get progress() { return progress; }, get round() { return round; }, feed: onUpdate };
}

// ===================== výber hry =====================
function menu() {
    const prog = BJ.tierProgress();
    app.replaceChildren(
        topbar({ back: 'urovne.html', profile }),
        h('div.tiers-head', {}, [h('h1.bj-title', { text: 'Zvuky a hlásky' })]),
        h('div.zv-menu', {}, SOUND_GAMES.map((g) =>
            h('a.zv-card.bj-panel', { href: `zvuky.html?hra=${g.id}` }, [
                h('div.zv-card__art', { html: ART[g.id] }),
                h('div.zv-card__title', { text: g.title }),
                h('div.zv-card__sound', { text: g.sound }),
                stars(prog.stars(levelId(g.id))),
            ]),
        )),
    );
    say('Vyber si hru. Budeme fúkať, syčať a bzučať.');
}

if (profile) {
    const game = getSoundGame(q.get('hra'));
    if (game) playGame(game);
    else menu();
}
