/**
 * Herné plátno (stage) – každá obrazovka je navrhnutá pre 1920×1080
 * a celé plátno sa zmenší/zväčší podľa obrazovky. Na každom zariadení
 * tak hra vyzerá rovnako, len je väčšia alebo menšia.
 *
 * Pri inom pomere strán (napr. širší telefón, 4:3 tablet) sa plátno
 * v jednom smere rozšíri – nevznikajú čierne pruhy, pozadie siaha všade.
 *
 * Klasický skript v <head>: nastaví CSS premenné ešte pred vykreslením
 * stránky, aby obsah neskákal.
 *   --stage-w, --stage-h  logický rozmer plátna (aspoň 1920 × 1080)
 *   --stage-scale         mierka plátna voči obrazovke
 */
(function () {
    var DESIGN_W = 1920;
    var DESIGN_H = 1080;
    var root = document.documentElement;
    var state = { scale: 1, width: DESIGN_W, height: DESIGN_H };

    function fit() {
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var scale = Math.min(vw / DESIGN_W, vh / DESIGN_H);
        state.scale = scale;
        state.width = vw / scale;
        state.height = vh / scale;
        root.style.setProperty('--stage-scale', String(scale));
        root.style.setProperty('--stage-w', state.width + 'px');
        root.style.setProperty('--stage-h', state.height + 'px');
        // Telefón na výšku – hra je na šírku, zobrazí sa výzva na otočenie.
        root.classList.toggle('bj-portrait', vh > vw && vw < 1000);
        root.classList.add('bj-staged');
    }

    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', function () {
        setTimeout(fit, 100);
    });

    document.addEventListener('DOMContentLoaded', function () {
        if (document.getElementById('bj-rotate')) return;
        var el = document.createElement('div');
        el.id = 'bj-rotate';
        el.setAttribute('role', 'alert');
        el.innerHTML =
            '<div class="bj-rotate-icon" aria-hidden="true">📱</div>' +
            '<div class="bj-rotate-text">Otoč telefón na šírku</div>';
        document.body.appendChild(el);
    });

    window.BJStage = {
        DESIGN_W: DESIGN_W,
        DESIGN_H: DESIGN_H,
        get scale() {
            return state.scale;
        },
        get width() {
            return state.width;
        },
        get height() {
            return state.height;
        },
        /**
         * Prepočet vzdialenosti v pixeloch obrazovky (napr. posun prsta)
         * na pixely plátna. `el` je prvok na plátne (na zistenie mierky).
         */
        toStage: function (px, el) {
            if (el && el.offsetWidth) {
                var rect = el.getBoundingClientRect();
                if (rect.width) return px * (el.offsetWidth / rect.width);
            }
            return px / state.scale;
        },
        refit: fit,
    };
})();
