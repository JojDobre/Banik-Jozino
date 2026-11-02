/**
 * Úroveň 1 – Počúvam: cesta levelov rozdelená na kapitoly.
 * URL: cesta.html?chapter=2 (voliteľne)
 */
import '../bridge.js';
import { h, centeredGlyph, topbar, requireProfile, speakerButton, say, ICONS, stars } from '../ui/kit.js';
import { buildTier1Path, CHAPTERS, LEVELS_PER_CHAPTER, levelUrl } from '../content/tier1.js';
import { avatarById } from '../core/profiles.js';

const BJ = window.BJ;
const app = document.getElementById('app');
const profile = requireProfile();

// Rozmery mapy (px plátna) a poloha zastávok – vlnitý chodník zľava doprava.
const MAP_W = 1760;
const MAP_H = 700;
function nodePosition(i) {
    const x = 120 + i * ((MAP_W - 240) / (LEVELS_PER_CHAPTER - 1));
    const y = MAP_H / 2 + 175 * Math.sin(i * 0.95 + 0.4);
    return { x, y };
}

/** Hladká krivka cez body (Catmull-Rom → Bézier) pre SVG chodník. */
function smoothPath(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;
        const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
        const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
        d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
    }
    return d;
}

function render(path, prog, chapterId) {
    const chapter = CHAPTERS.find((c) => c.id === chapterId);
    const levels = path.filter((l) => l.chapter === chapterId);
    const firstIndex = path.indexOf(levels[0]);
    const current = prog.currentIndex(path);
    const chapterStars = levels.reduce((s, l) => s + prog.stars(l.id), 0);
    const points = levels.map((_, i) => nodePosition(i));

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'path-line');
    svg.setAttribute('viewBox', `0 0 ${MAP_W} ${MAP_H}`);
    // Mapa môže byť na telefóne nižšia (flex ju stlačí) – cestička sa natiahne
    // presne na plochu mapy a zastávky sú v percentách, takže vždy sedia.
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.innerHTML = `<path d="${smoothPath(points)}" class="path-line__shadow"/><path d="${smoothPath(points)}" class="path-line__road"/>`;

    const avatar = avatarById(profile.avatar);
    const nodes = levels.map((level, i) => {
        const index = firstIndex + i;
        const unlocked = prog.isUnlocked(path, index);
        const s = prog.stars(level.id);
        const isCurrent = index === current && unlocked;
        const { x, y } = points[i];
        const cls = ['path-node', unlocked ? (s > 0 ? 'is-done' : 'is-open') : 'is-locked'];
        if (isCurrent) cls.push('is-current');
        const node = h(`div.${cls.join('.')}`, { style: { left: `${(x / MAP_W) * 100}%`, top: `${(y / MAP_H) * 100}%` } }, [
            isCurrent ? h('img.path-node__hero', { src: avatar.image, alt: '' }) : null,
            unlocked
                ? h('a.path-node__btn', { href: levelUrl(level), 'aria-label': `Level ${level.number}` }, [centeredGlyph(level.number, { size: 54, stroke: 3.2 })])
                : h('span.path-node__btn', { 'aria-label': `Level ${level.number} – zamknutý`, html: ICONS.lock }),
            level.milestone ? h('span.path-node__gift', { title: 'Balíček kariet', text: '🎁' }) : null,
            unlocked ? stars(s) : null,
        ]);
        return node;
    });

    const prevCh = CHAPTERS.find((c) => c.id === chapterId - 1);
    const nextCh = CHAPTERS.find((c) => c.id === chapterId + 1);
    const nav = (ch, dir) =>
        h('button.chapter-arrow.chapter-arrow--' + dir, {
            type: 'button',
            'aria-label': dir === 'left' ? 'Predchádzajúca kapitola' : 'Ďalšia kapitola',
            disabled: !ch,
            onclick: () => ch && show(ch.id),
        });

    const currentLevel = path[current];
    const playHref = currentLevel && currentLevel.chapter === chapterId ? levelUrl(currentLevel) : levelUrl(levels.find((l, i) => prog.isUnlocked(path, firstIndex + i)) || levels[0]);
    const chapterUnlocked = prog.isUnlocked(path, firstIndex);

    app.replaceChildren(
        topbar({ back: 'urovne.html', profile }),
        h('div.chapter-head', {}, [
            nav(prevCh, 'left'),
            h('div.chapter-title', {}, [
                h('div.chapter-title__small', { text: `Počúvam · kapitola ${chapterId}` }),
                h('h1.bj-title', { text: chapter.title }),
            ]),
            nav(nextCh, 'right'),
        ]),
        h('div.path-map.bj-panel', { style: { backgroundImage: `url('${chapter.background}')` } }, [
            h('div.path-map__shade'),
            svg,
            ...nodes,
        ]),
        h('div.path-footer', {}, [
            h('div.path-footer__stars', {}, [stars(1, 1), h('span', { text: `${chapterStars} / ${levels.length * 3}` })]),
            chapterUnlocked
                ? h('a.bj-btn.bj-btn--primary.path-play', { href: playHref, text: 'Hrať' })
                : h('div.bj-text', { text: 'Dokonči predchádzajúcu kapitolu.' }),
            speakerButton('Ťukni na tlačidlo Hrať.'),
        ]),
    );
}

let path;
let prog;
function show(chapterId) {
    const url = new URL(location.href);
    url.searchParams.set('chapter', chapterId);
    history.replaceState(null, '', url);
    render(path, prog, chapterId);
}

if (profile) {
    path = buildTier1Path(profile.ageGroup);
    prog = BJ.tierProgress();
    const fromUrl = Number(new URLSearchParams(location.search).get('chapter'));
    const chapter = CHAPTERS.some((c) => c.id === fromUrl) ? fromUrl : path[prog.currentIndex(path)].chapter;
    show(chapter);
    say('Počúvam. Ťukni na tlačidlo Hrať.');
}
