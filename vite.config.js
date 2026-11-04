import { defineConfig, createLogger } from 'vite';
import { resolve } from 'node:path';

// Viacstránková aplikácia. Staré hry (klasické skripty) a assety sú v public/
// a kopírujú sa do buildu bez zmeny; nové moduly sú v src/ a Vite ich zbalí.
// CSS odkazuje na obrázky v public/ relatívne (../images/...). Vite ich nevie
// vyriešiť pri builde, ale za behu fungujú – tieto varovania preto skryjeme.
const logger = createLogger();
const warnOnce = logger.warnOnce;
logger.warnOnce = (msg, opts) => {
    if (msg.includes("didn't resolve at build time")) return;
    warnOnce(msg, opts);
};

const pages = ['index', 'profil', 'urovne', 'cesta', 'pocuvaj', 'album', 'worldsmenu', 'game', 'pexeso', 'superjozino', 'builder', 'bana', 'obrazky', 'zvpexeso', 'zvoncky', 'vlacik', 'hry', 'zvuky-lab', 'zvuky'];

export default defineConfig({
    // Relatívne cesty – funguje na GitHub Pages (podpriečinok) aj v Capacitor appke.
    base: './',
    customLogger: logger,
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: Object.fromEntries(pages.map((p) => [p, resolve(__dirname, `${p}.html`)])),
        },
    },
    server: { host: true },
});
