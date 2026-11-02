/**
 * Výber úrovne: 1 – Počúvam, 2 – Zvuky a hlásky, 3 – Slová.
 */
import '../bridge.js';
import { h, centeredGlyph, topbar, requireProfile, speakerButton, say, ICONS, stars } from '../ui/kit.js';
import { buildTier1Path } from '../content/tier1.js';
import { minigamesFor } from '../core/minigames.js';

const BJ = window.BJ;
const app = document.getElementById('app');
const profile = requireProfile();

/** Hviezdy v úrovni 3 – z pôvodného ProgressManagera (svety písmen). */
function tier3Stars() {
    try {
        const data = JSON.parse(localStorage.getItem(profile.progressKey) || 'null');
        let sum = 0;
        for (const w of Object.values(data?.worlds || {})) {
            for (const l of Object.values(w.levels || {})) sum += l.stars || 0;
        }
        return sum;
    } catch {
        return 0;
    }
}

function tierCard({ number, title, text, image, href, starsText, locked, note }) {
    const content = [
        h('div.tier-card__art', { style: { backgroundImage: `url('${image}')` } }, [h('div.tier-card__number', { 'aria-hidden': 'true' }, [centeredGlyph(number, { size: 72, stroke: 2.6 })])]),
        h('div.tier-card__body', {}, [
            h('div.tier-card__title', { text: title }),
            h('div.tier-card__text.bj-text', { text }),
            starsText ? h('div.tier-card__stars', {}, [stars(1, 1), h('span', { text: starsText })]) : null,
            note ? h('div.tier-card__note', { text: note }) : null,
        ]),
    ];
    if (locked) {
        content.push(h('div.tier-card__lock', {}, [h('span', { html: ICONS.lock }), h('span', { text: 'Čoskoro' })]));
        return h('div.tier-card.bj-panel.is-locked', { 'aria-disabled': 'true' }, content);
    }
    return h('a.tier-card.bj-panel', { href, 'aria-label': `Úroveň ${number}: ${title}` }, content);
}

if (profile) {
    const ageGroup = profile.ageGroup;
    const path1 = buildTier1Path(ageGroup);
    const prog = BJ.tierProgress();
    const s1 = prog.totalStars(path1);
    const tier3Games = minigamesFor({ ageGroup, tier: 3 });

    const title = 'Čo budeme cvičiť?';
    app.replaceChildren(
        topbar({ back: 'index.html', profile }),
        h('div.tiers-head', {}, [h('h1.bj-title', { text: title }), speakerButton('Čo budeme cvičiť? Počúvanie, zvuky alebo slová?')]),
        h('div.tiers', {}, [
            tierCard({
                number: 1,
                title: 'Počúvam',
                text: 'Počúvaj a rozlišuj slová a zvuky.',
                image: 'images/worlds/world_l.png',
                href: 'cesta.html',
                starsText: `${s1} / ${path1.length * 3}`,
            }),
            tierCard({
                number: 2,
                title: 'Zvuky a hlásky',
                text: 'Fúkanie, syčanie, bzučanie a slabiky.',
                image: 'images/worlds/world_s.png',
                locked: true,
            }),
            tierCard({
                number: 3,
                title: 'Slová',
                text: 'Vyslovuj slová vo svetoch písmen.',
                image: 'images/worlds/world_r.png',
                href: 'worldsmenu.html',
                starsText: String(tier3Stars()),
                // existujúce hry (Baňa, Pexeso) sú pre 5+; mladším to povieme
                note: tier3Games.length ? null : 'Odporúčame od 5 rokov',
            }),
        ]),
    );
    say('Čo budeme cvičiť?');
}
