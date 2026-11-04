/**
 * Obťažnosť podľa veku dieťaťa – jedno miesto pre všetky hry úrovne 3
 * (Baňa, Malá baňa, Pexeso, Super Jožino). Klasický skript, načítať pred hrou.
 *
 *   BJAge.group()        – '3-4' | '5-6' | '7-8' (z aktívneho profilu, predvolene '5-6')
 *   BJAge.get('bana')    – nastavenia hry pre vek dieťaťa
 *   BJAge.scale(n, k)    – počet predmetov upravený koeficientom (aspoň 1)
 *
 * Testovanie: ?age=3-4 v adrese prepíše vek z profilu.
 */
(function () {
    const TABLE = {
        '3-4': {
            // menej predmetov = menej cvičení naraz (kratšia pozornosť)
            bana: { mine: [22, 15], light: 5.4, items: 0.7, timeLimit: false },
            pexeso: { maxPairs: 4 },
            sj: { lives: 5, enemySpeed: 0.6, invulnerableMs: 2500 },
        },
        '5-6': {
            bana: { mine: [28, 19], light: 4.6, items: 1, timeLimit: false },
            pexeso: { maxPairs: 6 },
            sj: { lives: 5, enemySpeed: 0.75, invulnerableMs: 2200 },
        },
        '7-8': {
            // časomiera len pre najstarších a len v leveloch, ktoré ju majú
            bana: { mine: [34, 24], light: 4, items: 1.25, timeLimit: true },
            pexeso: { maxPairs: 10 },
            sj: { lives: 3, enemySpeed: 1, invulnerableMs: 1500 },
        },
    };

    function profileGroup() {
        try {
            const s = JSON.parse(localStorage.getItem('bj.profiles') || '{}');
            const p = s.profiles && s.profiles[s.activeId];
            if (!p) return null;
            if (p.ageGroup) return p.ageGroup;
            if (typeof p.age === 'number') return p.age <= 4 ? '3-4' : p.age <= 6 ? '5-6' : '7-8';
        } catch (e) { /* bez profilu */ }
        return null;
    }

    function group() {
        const q = new URLSearchParams(location.search).get('age');
        if (q && TABLE[q]) return q;
        const g = profileGroup();
        return TABLE[g] ? g : '5-6';
    }

    window.BJAge = {
        TABLE,
        group,
        get(game) {
            return TABLE[group()][game] || {};
        },
        scale(n, k) {
            if (!n) return n;
            return Math.max(1, Math.round(n * (k || 1)));
        },
    };
})();
