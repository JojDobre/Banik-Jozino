/**
 * Výber stránky hry podľa typu levelu a veku dieťaťa.
 *
 *  - Baňa: deti 3–4 roky hrajú pôvodnú Baňu (game.html – celá baňa naraz),
 *    staršie novú Baňu na preskúmavanie (bana.html – tma, lampa, väčšia baňa)
 *  - Pexeso: pexeso.html, Super Jožino: superjozino.html
 *
 * Vek sa číta priamo z uloženého profilu (funguje aj pred načítaním window.BJ).
 */
(function () {
    function activeProfile() {
        try {
            const s = JSON.parse(localStorage.getItem('bj.profiles') || '{}');
            return (s.profiles && s.profiles[s.activeId]) || null;
        } catch (e) {
            return null;
        }
    }
    function ageGroup() {
        const p = activeProfile();
        if (!p) return null;
        if (p.ageGroup) return p.ageGroup;
        if (typeof p.age === 'number') return p.age <= 4 ? '3-4' : p.age <= 6 ? '5-6' : '7-8';
        return null;
    }
    window.BJRoute = {
        ageGroup,
        /** pôvodná Baňa len pre najmenších (alebo ?classic=1) */
        banikPage() {
            if (/[?&]classic=1/.test(location.search)) return 'game.html';
            return ageGroup() === '3-4' ? 'game.html' : 'bana.html';
        },
        pageFor(gameType) {
            // Super Jožino je od 5 rokov – najmenšie deti hrajú namiesto neho Baňu
            if (gameType === 'mario' && ageGroup() === '3-4') return 'game.html';
            return { banik: this.banikPage(), pexeso: 'pexeso.html', mario: 'superjozino.html' }[gameType] || this.banikPage();
        },
        levelUrl(worldId, levelId) {
            const cfg = typeof getLevelConfig === 'function' ? getLevelConfig(levelId) : null;
            return `${this.pageFor(cfg && cfg.gameType)}?worldId=${worldId}&levelId=${levelId}`;
        },
        /** aktuálna stránka (pre „Hrať znova“) */
        currentPage() {
            return location.pathname.split('/').pop() || 'game.html';
        },
    };
})();
