/**
 * Malá baňa (game.html): počítadlá zlata, diamantov a kryštálov hore –
 * rovnaké ako v novej Bani. Čísla berie z premenných js/game.js.
 */
(function () {
    const hud = document.createElement('div');
    hud.className = 'bx-hud';
    hud.innerHTML = [
        ['gold', 'images/gold.png'],
        ['dia', 'images/diamond.png'],
        ['kov', 'images/kov.png'],
    ].map(([id, src]) => `<div class="bx-chip" data-k="${id}"><img src="${src}" alt=""><span>0/0</span></div>`).join('');
    (document.getElementById('bj-stage') || document.body).append(hud);
    const chips = {};
    hud.querySelectorAll('.bx-chip').forEach((c) => { chips[c.dataset.k] = c; });
    const last = {};
    function set(k, text) {
        if (last[k] === text) return;
        const c = chips[k];
        if (last[k] !== undefined) {
            c.classList.remove('is-bump');
            void c.offsetWidth;
            c.classList.add('is-bump');
        }
        last[k] = text;
        c.querySelector('span').textContent = text;
    }
    setInterval(() => {
        try {
            /* global goldsCollected, PocetGenGolds, diamondsCollected, PocetGenDiamant, kovCollected, PocetGenKov */
            set('gold', `${goldsCollected}/${PocetGenGolds}`);
            set('dia', `${diamondsCollected}/${PocetGenDiamant}`);
            set('kov', `${kovCollected}/${PocetGenKov}`);
        } catch (e) { /* hra sa ešte načítava */ }
    }, 200);
})();
