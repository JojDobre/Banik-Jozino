/**
 * Minihra „Rovnaké alebo iné?“ (úroveň 1 – Počúvam).
 * Dvaja baníci povedia slovo; dieťa určí, či to boli rovnaké alebo iné slová.
 * Nahrávky: zvuky/<1..15>/1.wav a 2.wav (dvojice podobných slov).
 *
 * URL: pocuvaj.html?level=t1_03
 */
import '../bridge.js';
import { h, topbar, requireProfile, say, ICONS, stars, pause } from '../ui/kit.js';
import { buildTier1Path, TIER1_SET, CHAPTERS } from '../content/tier1.js';
import { avatarById } from '../core/profiles.js';
import { makeRounds, starsForScore } from '../games/sameDifferent.js';

const BJ = window.BJ;
const app = document.getElementById('app');
const profile = requireProfile();

const MAX_ATTEMPTS = 2;

/** Prehranie s poistkou – ak by zvuk nedohral (chyba), hra nezamrzne. */
function play(src, maxMs = 5000) {
    return Promise.race([BJ.audio.play(src), pause(maxMs)]);
}

function start(level, path) {
    const backHref = `cesta.html?chapter=${level.chapter}`;
    const rounds = makeRounds(level.rounds);
    const leftAv = avatarById(profile.avatar);
    const rightAv = avatarById(profile.avatar === 'old_miner' ? 'yellow_hat' : 'old_miner');
    let index = 0;
    let points = 0;
    let attempts = 0;
    let busy = true;

    const dots = rounds.map(() => h('span.round-dot'));
    const roundLabel = h('div.game-sub');

    const bubbleA = h('button.miner__bubble', { type: 'button', 'aria-label': 'Prvé slovo', html: ICONS.speaker, onclick: () => !busy && replayOne('a') });
    const bubbleB = h('button.miner__bubble', { type: 'button', 'aria-label': 'Druhé slovo', html: ICONS.speaker, onclick: () => !busy && replayOne('b') });
    const minerA = h('div.miner', {}, [bubbleA, h('img.miner__img', { src: leftAv.image, alt: '' })]);
    const minerB = h('div.miner.miner--right', {}, [bubbleB, h('img.miner__img', { src: rightAv.image, alt: '' })]);

    const replayBtn = h('button.bj-btn.bj-btn--small', { type: 'button', onclick: () => !busy && playPair() }, [h('span', { html: ICONS.replay, style: { width: '48px', height: '48px', display: 'inline-flex' } }), 'Znova']);
    const btnSame = h('button.answer-btn', { type: 'button', 'aria-label': 'Rovnaké', onclick: () => answer(true) }, [h('img', { src: 'images/rovnake.png', alt: '' }), h('span', { text: 'Rovnaké' })]);
    const btnDiff = h('button.answer-btn', { type: 'button', 'aria-label': 'Iné', onclick: () => answer(false) }, [h('img', { src: 'images/rozdielne.png', alt: '' }), h('span', { text: 'Iné' })]);
    const feedback = h('div.feedback', { 'aria-live': 'polite' });

    function setBusy(v) {
        busy = v;
        btnSame.disabled = v;
        btnDiff.disabled = v;
        replayBtn.disabled = v;
    }

    async function speakBubble(bubble, miner, src) {
        bubble.classList.add('is-speaking');
        miner.classList.add('is-speaking');
        await play(src);
        bubble.classList.remove('is-speaking');
        miner.classList.remove('is-speaking');
    }

    async function playPair() {
        setBusy(true);
        const r = rounds[index];
        await speakBubble(bubbleA, minerA, r.a);
        await pause(450);
        await speakBubble(bubbleB, minerB, r.b);
        setBusy(false);
    }

    async function replayOne(which) {
        setBusy(true);
        const r = rounds[index];
        if (which === 'a') await speakBubble(bubbleA, minerA, r.a);
        else await speakBubble(bubbleB, minerB, r.b);
        setBusy(false);
    }

    function updateHeader() {
        roundLabel.textContent = `Level ${level.number} · kolo ${Math.min(index + 1, rounds.length)} / ${rounds.length}`;
        dots.forEach((d, i) => {
            d.classList.toggle('is-done', i < index);
            d.classList.toggle('is-current', i === index);
        });
    }

    function showFeedback(ok, text) {
        feedback.replaceChildren(
            h('img', { src: ok ? 'images/spravne.png' : 'images/nespravne.png', alt: '' }),
            h('div.feedback__text', { text }),
        );
        feedback.className = 'feedback is-visible ' + (ok ? 'is-ok' : 'is-bad');
    }

    function hideFeedback() {
        feedback.className = 'feedback';
    }

    async function answer(same) {
        if (busy) return;
        setBusy(true);
        const r = rounds[index];
        const correct = same === r.same;
        if (correct) {
            points += attempts === 0 ? 1 : 0.5;
            BJ.audio.playEffect('correct');
            showFeedback(true, 'Výborne!');
            await pause(1500);
            hideFeedback();
            return nextRound();
        }
        attempts++;
        BJ.audio.playEffect('wrong');
        if (attempts < MAX_ATTEMPTS) {
            showFeedback(false, 'Skús ešte raz!');
            await pause(1400);
            hideFeedback();
            return playPair();
        }
        showFeedback(false, r.same ? 'Boli rovnaké.' : 'Boli iné.');
        await pause(1800);
        hideFeedback();
        return nextRound();
    }

    async function nextRound() {
        index++;
        attempts = 0;
        updateHeader();
        if (index >= rounds.length) return finish();
        await pause(300);
        return playPair();
    }

    function finish() {
        const earned = starsForScore(points / rounds.length);
        const prog = BJ.tierProgress();
        const result = prog.record(level.id, earned);
        const nextLevel = path[path.indexOf(level) + 1];
        const nextUnlocked = nextLevel && prog.isUnlocked(path, path.indexOf(nextLevel));

        const title = earned === 3 ? 'Výborne!' : earned >= 1 ? 'Dobrá práca!' : 'Skúsime znova?';
        const end = h('div.bj-modal', {}, [
            h('div.bj-modal__box.bj-panel.end-box', {}, [
                h('h2.bj-title.bj-title--yellow', { text: title }),
                h('div.end-stars', {}, [stars(earned)]),
                h('div.bj-text', { text: `Správne: ${Math.round(points * 10) / 10} z ${rounds.length}` }),
                h('div.bj-row', {}, [
                    h('a.bj-btn', { href: location.href, text: 'Znova' }),
                    nextUnlocked
                        ? h('a.bj-btn.bj-btn--primary', { href: `pocuvaj.html?level=${nextLevel.id}`, text: 'Ďalej' })
                        : h('a.bj-btn.bj-btn--primary', { href: backHref, text: 'Mapa' }),
                ]),
            ]),
        ]);
        (document.getElementById('bj-stage') || document.body).append(end);
        if (earned >= 1) BJ.audio.playEffect('win');
        say(title);

        // karty za level (okno s odmenou sa zobrazí samo – viď ui/cards.js)
        BJ.rewards.rewardLevel({
            worldId: TIER1_SET,
            levelNumber: level.number,
            stars: earned,
            previousStars: result.previousStars,
            firstCompletion: result.firstCompletion,
        });
    }

    app.replaceChildren(
        topbar({ back: backHref, profile, album: false }),
        h('div.game-head', {}, [h('h1.bj-title', { text: 'Rovnaké alebo iné?' }), roundLabel, h('div.round-dots', {}, dots)]),
        h('div.duel', {}, [minerA, h('div.duel__vs', { text: '?' }), minerB]),
        h('div.answers', {}, [btnSame, replayBtn, btnDiff]),
        feedback,
    );
    updateHeader();
    setBusy(true);

    // stav hry pre automatické testy (scripts/, tests/)
    window.BJGame = {
        get round() { return rounds[index]; },
        get index() { return index; },
        get busy() { return busy; },
        rounds,
    };

    // úvod: pokyn a prvé kolo
    (async () => {
        await Promise.race([say('Počúvaj dvoch baníkov. Povedali rovnaké slovo, alebo iné?'), pause(4500)]);
        await pause(300);
        playPair();
    })();
}

if (profile) {
    const path = buildTier1Path(profile.ageGroup);
    const id = new URLSearchParams(location.search).get('level');
    const level = path.find((l) => l.id === id) || path[0];
    const prog = BJ.tierProgress();
    if (!prog.isUnlocked(path, path.indexOf(level))) {
        location.replace(`cesta.html?chapter=${level.chapter}`);
    } else {
        document.title = `Level ${level.number} – ${CHAPTERS[level.chapter - 1].title}`;
        start(level, path);
    }
}
