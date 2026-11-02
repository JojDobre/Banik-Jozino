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
    // Telefón: jedna výška plátna pre VŠETKY stránky → rovnaká mierka všade
    // (rovnaké tlačidlo je na každej obrazovke rovnako veľké).
    var PHONE_H = 860;
    var root = document.documentElement;
    var state = { scale: 1, width: DESIGN_W, height: DESIGN_H, compact: false };

    /**
     * Telefón: kompaktné plátno (nižšie a užšie) => všetko je väčšie.
     * Výška kompaktného plátna je rovnaká pre všetky stránky (PHONE_H).
     */
    function isPhone(vw, vh) {
        var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        return coarse && Math.min(vw, vh) < 600;
    }

    function fit() {
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var compact = isPhone(vw, vh) && vw > vh;
        var dh = compact ? PHONE_H : DESIGN_H;
        var dw = DESIGN_W * (dh / DESIGN_H);
        var scale = Math.min(vw / dw, vh / dh);
        state.compact = compact;
        root.classList.toggle('bj-compact', compact);
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
    // Android: výška sa mení aj po skrytí systémových líšt (immersive) –
    // nie vždy príde „resize“, preto aj visualViewport a kontrola po načítaní.
    if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
    window.addEventListener('load', function () {
        [100, 400, 1000, 2000].forEach(function (t) { setTimeout(fit, t); });
    });
    window.addEventListener('orientationchange', function () {
        setTimeout(fit, 100);
    });

    // Poistka: hra sa nikdy neposúva (ani keď WebView niečo „doscrolluje“).
    document.addEventListener('scroll', function (e) {
        var t = e.target;
        if (t === document || t === document.documentElement) {
            if (window.scrollX || window.scrollY) window.scrollTo(0, 0);
            return;
        }
        if (t && t.nodeType === 1 && (t.id === 'bj-stage' || t.classList.contains('bj-screen'))) {
            t.scrollTop = 0;
            t.scrollLeft = 0;
        }
    }, true);

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
