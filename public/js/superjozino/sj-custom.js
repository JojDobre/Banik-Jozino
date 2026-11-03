/**
 * Super Jožino – vlastný level z buildera (builder.html).
 *
 * superjozino.html?custom=last   naposledy uložený level z buildera
 * superjozino.html?custom=<id>   konkrétny uložený level
 * Levely z buildera sú v localStorage pod kľúčom 'sj.custom'
 * ({ levels: { id: def }, last: id }). Keď level neexistuje, otvorí sa builder.
 */
(function () {
    const q = new URLSearchParams(location.search);
    const want = q.get('custom');
    if (!want) return;
    let store = {};
    try { store = JSON.parse(localStorage.getItem('sj.custom') || '{}'); } catch (e) { store = {}; }
    const id = want === 'last' ? store.last : want;
    const def = store.levels && id && store.levels[id];
    if (!def) {
        location.replace('builder.html');
        return;
    }
    try {
        LEVELS.custom = { name: def.name, unlocked: true, stars: 0, completion: 0, data: SJBuildDef(JSON.parse(JSON.stringify(def))) };
        SJ.map = 'custom';
        SJ.custom = id;
        SJ.backUrl = 'index.html';
    } catch (e) {
        console.error('Vlastný level sa nedá načítať:', e);
        location.replace('builder.html?edit=' + encodeURIComponent(id));
        return;
    }
    // v hornej lište tlačidlo „Upraviť level“ (späť do buildera)
    document.addEventListener('DOMContentLoaded', () => {
        const bar = document.querySelector('.sj-topbar');
        if (!bar) return;
        const a = document.createElement('a');
        a.className = 'sj-edit bj-round-btn';
        a.href = 'builder.html?edit=' + encodeURIComponent(id);
        a.setAttribute('aria-label', 'Upraviť level');
        a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.6L15.6 5a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" fill="currentColor" stroke="#000" stroke-width="1"/><path d="M13.5 7l3.5 3.5" stroke="#000" stroke-width="1.2"/></svg>';
        bar.appendChild(a);
    });
})();
