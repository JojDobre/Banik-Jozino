/**
 * Super Jožino – cvičenia v hre.
 *
 *  - Rečové (modrý diamant): slovo s obrázkom, reproduktor (vypočuť znova),
 *    3 pokusy; po 3. nesprávnom pokuse sa ide ďalej („Nevadí, ideme ďalej!“).
 *    Tlačidlo „Preskočiť“ – dieťa sa nikdy nezasekne.
 *  - Posluchové (strieborná minca): „Rovnaké alebo iné?“ – dvaja baníci
 *    povedia slovo (nahrávky zvuky/<1..15>/1.wav a 2.wav), 2 pokusy.
 *  - Spätná väzba ako v iných cvičeniach (Game.feedback v sj-fx.js).
 *
 * Rozširuje triedu Game (načítava sa po game.js).
 */
(function () {
    const MAX_SPEECH = 3;
    const MAX_LISTEN = 2;
    const PAIR_FOLDERS = 15;

    const ICON = {
        speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="#000" stroke-width="1"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
        mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="3" width="7" height="12" rx="3.5" fill="currentColor" stroke="#000" stroke-width="1"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
        check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.8 9.6 18 19.8 6.4" fill="none" stroke="#000" stroke-width="6.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 12.8 9.6 18 19.8 6.4" fill="none" stroke="#38e04a" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        cross: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 18 18M18 6 6 18" fill="none" stroke="#000" stroke-width="6.4" stroke-linecap="round"/><path d="M6 6 18 18M18 6 6 18" fill="none" stroke="#ff5a4e" stroke-width="3.8" stroke-linecap="round"/></svg>',
    };

    const BJ = () => window.BJ;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    /** Prehrá zvuk s poistkou (hra nezamrzne, keď súbor chýba). */
    function play(src, maxMs = 4000) {
        try {
            if (BJ() && BJ().audio) return Promise.race([BJ().audio.play(src), wait(maxMs)]);
        } catch (e) { /* nič */ }
        return wait(300);
    }

    /** Slovo nahlas: nahrávka slova, inak hlas aplikácie. */
    async function speakWord(word) {
        const ok = await play(`zvuky/${word}.wav`, 2500);
        if (ok !== true) {
            try { BJ() && BJ().say(word); } catch (e) { /* nič */ }
        }
    }

    const proto = Game.prototype;

    /** Otvorí okno (zastaví hru a pustí ovládanie). */
    proto.openExercise = function (html, state) {
        if (window.SJInput) window.SJInput.reset();
        this.gameState = state;
        this.speechModal.className = 'speech-modal sj-ex';
        this.speechModal.innerHTML = html;
        this.speechModal.style.display = 'flex';
        return this.speechModal;
    };

    proto.closeExercise = function () {
        this.speechModal.style.display = 'none';
        this.speechModal.innerHTML = '';
        if (window.SJInput) window.SJInput.reset();
        this.gameState = 'playing';
    };

    // ================== REČOVÉ CVIČENIE ==================

    proto.showSpeechExercise = function (exercise) {
        exercise.attempts = exercise.attempts || 0;
        const m = this.openExercise(`
            <div class="speech-content sj-ex__box sj-ex--speech">
                <div class="sj-ex__head">
                    <button class="sj-round sj-ex__speak" type="button" aria-label="Vypočuť slovo">${ICON.speaker}</button>
                    <h2 class="sj-ex__word"></h2>
                </div>
                <div class="speech-image"><img alt=""></div>
                <div class="sj-ex__dots" aria-label="Pokusy"></div>
                <div class="sj-ex__hint">Povedz slovo nahlas</div>
                <div class="sj-ex__actions">
                    <button class="button sj-ex__skip" type="button">Preskočiť</button>
                    <button class="button button--primary sj-ex__mic" type="button">${ICON.mic}<span>Hovoriť</span></button>
                </div>
            </div>`, 'speech');
        m.querySelector('.sj-ex__word').textContent = exercise.word;
        const img = m.querySelector('.speech-image img');
        img.src = exercise.imageUrl;
        img.alt = exercise.word;
        const dots = m.querySelector('.sj-ex__dots');
        const hint = m.querySelector('.sj-ex__hint');
        const mic = m.querySelector('.sj-ex__mic');
        const skip = m.querySelector('.sj-ex__skip');
        const speak = m.querySelector('.sj-ex__speak');

        const renderDots = () => {
            dots.innerHTML = '';
            for (let i = 0; i < MAX_SPEECH; i++) {
                const d = document.createElement('span');
                d.className = 'sj-ex__dot' + (i < exercise.attempts ? ' is-used' : '') + (i === exercise.attempts ? ' is-current' : '');
                dots.appendChild(d);
            }
        };
        renderDots();

        let busy = false;
        const setBusy = (v) => {
            busy = v;
            mic.disabled = v;
            skip.disabled = v;
            speak.disabled = v;
        };

        speak.onclick = async () => {
            if (busy) return;
            speak.classList.add('is-speaking');
            await speakWord(exercise.word);
            speak.classList.remove('is-speaking');
        };

        const finish = async (ok, text) => {
            this.speechModal.style.display = 'none';
            await this.feedback(ok, text);
            this.closeExercise();
        };

        skip.onclick = () => {
            if (busy) return;
            exercise.skipped = true;
            this.closeExercise();
        };

        mic.onclick = async () => {
            if (busy) return;
            const speech = BJ() && BJ().speech;
            if (!speech || !speech.isSupported()) {
                hint.textContent = 'Toto zariadenie nevie počúvať. Ťukni na Preskočiť.';
                hint.classList.add('is-bad');
                return;
            }
            setBusy(true);
            mic.classList.add('is-listening');
            mic.querySelector('span').textContent = 'Počúvam…';
            hint.classList.remove('is-bad');
            hint.textContent = 'Hovor teraz';
            let transcript = '';
            try {
                ({ transcript } = await speech.listen());
            } catch (error) {
                mic.classList.remove('is-listening');
                mic.querySelector('span').textContent = 'Hovoriť';
                setBusy(false);
                if (error && error.code === 'busy') return;
                hint.textContent = 'Nepočul som ťa. Skús znova.';
                hint.classList.add('is-bad');
                return;
            }
            mic.classList.remove('is-listening');
            mic.querySelector('span').textContent = 'Hovoriť';
            exercise.attempts++;

            if (BJ().matchesWord(transcript, exercise.word)) {
                exercise.completed = true;
                await finish(true, 'Výborne!');
                return;
            }
            if (exercise.attempts >= MAX_SPEECH) {
                await finish(false, 'Nevadí, ideme ďalej!');
                return;
            }
            // nesprávne – krátka spätná väzba a ďalší pokus
            this.speechModal.style.display = 'none';
            await this.feedback(false, 'Skús znova', 1000);
            this.speechModal.style.display = 'flex';
            renderDots();
            hint.textContent = `Ešte ${MAX_SPEECH - exercise.attempts === 1 ? '1 pokus' : '2 pokusy'}`;
            setBusy(false);
            speakWord(exercise.word);
        };

        // slovo zaznie hneď (dieťa nemusí vedieť čítať)
        setTimeout(() => speakWord(exercise.word), 250);
    };

    // ================== POSLUCHOVÉ CVIČENIE ==================

    function makePair() {
        const folder = 1 + Math.floor(Math.random() * PAIR_FOLDERS);
        const same = Math.random() < 0.5;
        const first = Math.random() < 0.5 ? 1 : 2;
        const second = same ? first : 3 - first;
        return { same, a: `zvuky/${folder}/${first}.wav`, b: `zvuky/${folder}/${second}.wav` };
    }

    proto.showListeningExercise = function (done) {
        const pair = makePair();
        let attempts = 0;
        const m = this.openExercise(`
            <div class="speech-content sj-ex__box sj-ex--listen">
                <h2>Rovnaké alebo iné?</h2>
                <div class="sj-ex__pair">
                    <button class="sj-round sj-ex__voice" data-v="a" type="button" aria-label="Prvé slovo">${ICON.speaker}<b aria-hidden="true"><svg viewBox="0 0 100 100"><text x="51.1" y="72.3" font-size="62" text-anchor="middle" fill="#fff" stroke="#000" stroke-width="3" paint-order="stroke" font-family="Luckiest Guy, sans-serif">1</text></svg></b></button>
                    <button class="sj-round sj-ex__voice" data-v="b" type="button" aria-label="Druhé slovo">${ICON.speaker}<b aria-hidden="true"><svg viewBox="0 0 100 100"><text x="50.1" y="73.1" font-size="62" text-anchor="middle" fill="#fff" stroke="#000" stroke-width="3" paint-order="stroke" font-family="Luckiest Guy, sans-serif">2</text></svg></b></button>
                </div>
                <div class="sj-ex__hint">Počúvaj pozorne</div>
                <div class="sj-ex__actions">
                    <button class="sj-answer sj-answer--same" type="button"><span class="sj-answer__btn">${ICON.check}</span><span class="sj-answer__label">Rovnaké</span></button>
                    <button class="sj-answer sj-answer--diff" type="button"><span class="sj-answer__btn">${ICON.cross}</span><span class="sj-answer__label">Iné</span></button>
                </div>
            </div>`, 'listening');
        const [va, vb] = m.querySelectorAll('.sj-ex__voice');
        const btnSame = m.querySelector('.sj-answer--same');
        const btnDiff = m.querySelector('.sj-answer--diff');
        const hint = m.querySelector('.sj-ex__hint');
        let busy = true;
        const setBusy = (v) => {
            busy = v;
            [va, vb, btnSame, btnDiff].forEach((b) => { b.disabled = v; });
        };
        const voice = async (btn, src) => {
            btn.classList.add('is-speaking');
            await play(src);
            btn.classList.remove('is-speaking');
        };
        const playPair = async () => {
            setBusy(true);
            await wait(300);
            await voice(va, pair.a);
            await wait(400);
            await voice(vb, pair.b);
            setBusy(false);
        };
        va.onclick = async () => { if (!busy) { setBusy(true); await voice(va, pair.a); setBusy(false); } };
        vb.onclick = async () => { if (!busy) { setBusy(true); await voice(vb, pair.b); setBusy(false); } };

        const answer = async (same) => {
            if (busy) return;
            setBusy(true);
            attempts++;
            const ok = same === pair.same;
            if (ok || attempts >= MAX_LISTEN) {
                this.speechModal.style.display = 'none';
                await this.feedback(ok, ok ? 'Správne!' : (pair.same ? 'Boli rovnaké' : 'Boli iné'));
                this.closeExercise();
                if (done) done(ok);
                return;
            }
            this.speechModal.style.display = 'none';
            await this.feedback(false, 'Skús znova', 1000);
            this.speechModal.style.display = 'flex';
            hint.textContent = 'Vypočuj si ich ešte raz';
            playPair();
        };
        btnSame.onclick = () => answer(true);
        btnDiff.onclick = () => answer(false);
        playPair();
    };
})();
