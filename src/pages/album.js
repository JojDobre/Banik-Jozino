/**
 * Album kariet: zbierka po sadách (svetoch), otváranie balíčkov,
 * výmena iskričiek za chýbajúcu kartu. Ťuknutím na kartu zaznie slovo –
 * dieťa ho môže zopakovať (album je aj cvičenie).
 *
 * URL: album.html?set=world_r (voliteľne)
 */
import '../bridge.js';
import { h, centeredGlyph, topbar, requireProfile, say, modal, ICONS } from '../ui/kit.js';
import { cardElement, showRewards } from '../ui/cards.js';
import { SETS, setById } from '../content/cards/index.js';
import { EXCHANGE_COST } from '../core/rewards.js';

const BJ = window.BJ;
const app = document.getElementById('app');
const profile = requireProfile();
const back = document.referrer && !document.referrer.includes('album.html') ? document.referrer : 'urovne.html';

let currentSet = new URLSearchParams(location.search).get('set') || 'all';

function sparklesWord(n) {
    return n === 1 ? 'iskrička' : n >= 2 && n <= 4 ? 'iskričky' : 'iskričiek';
}

/** Prečíta meno karty (dieťa ho môže zopakovať – album je aj cvičenie). */
function playCardWord(card) {
    say(card.name);
}

function openCard(card, owned, count) {
    const col = BJ.rewards.collection();
    if (owned) {
        playCardWord(card);
        const close = modal(
            h('div.card-detail', {}, [
                cardElement(card, { big: true, count }),
                h('div.card-detail__side', {}, [
                    h('div.bj-subtitle', { text: setById(card.set)?.name || '' }),
                    h('div.card-detail__word', { text: card.name }),
                    h('div.bj-text', { text: 'Ťukni na reproduktor a povedz meno karty nahlas!' }),
                    h('div.bj-row', {}, [
                        h('button.bj-icon-btn', { type: 'button', 'aria-label': 'Vypočuť meno karty', html: ICONS.speaker, onclick: () => playCardWord(card) }),
                        h('button.bj-btn', { type: 'button', text: 'Zavrieť', onclick: () => close() }),
                    ]),
                ]),
            ]),
        );
        return;
    }
    const cost = EXCHANGE_COST[card.rarity];
    const enough = (col.sparkles || 0) >= cost;
    const close = modal(
        h('div.card-detail', {}, [
            cardElement(card, { big: true, missing: true }),
            h('div.card-detail__side', {}, [
                h('div.bj-subtitle', { text: 'Túto kartu ešte nemáš' }),
                h('div.bj-text', { text: `Vymeň ju za ${cost} ${sparklesWord(cost)} ✨` }),
                h('div.bj-text', { text: `Máš ${col.sparkles || 0} ${sparklesWord(col.sparkles || 0)}.` }),
                h('div.bj-row', {}, [
                    h('button.bj-btn.bj-btn--primary', {
                        type: 'button',
                        text: 'Vymeniť',
                        disabled: !enough,
                        onclick: async () => {
                            BJ.rewards.exchange(card.id);
                            close();
                            await showRewards([{ type: 'card', cardId: card.id, rarity: card.rarity, duplicate: false, sparkles: 0 }], { title: 'Karta je tvoja!', pack: false });
                            render();
                        },
                    }),
                    h('button.bj-btn', { type: 'button', text: 'Zavrieť', onclick: () => close() }),
                ]),
                enough ? null : h('div.bj-text.album-hint', { text: 'Iskričky dostaneš za karty, ktoré už máš.' }),
            ]),
        ]),
    );
}

function openPack() {
    const col = BJ.rewards.collection();
    const pack = col.packs[0];
    if (!pack) return;
    // balíček sa otvorí s animáciou (ťuknutie → roztrhnutie → karty)
    const rewards = BJ.rewards.openPack(pack.id);
    showRewards(rewards, { title: 'Balíček otvorený!' }).then(render);
}

function render() {
    const catalog = BJ.rewards.catalog();
    const col = BJ.rewards.collection();
    const ownedCount = catalog.filter((c) => col.cards[c.id]).length;
    const packs = col.packs || [];

    const sets = SETS.filter((s) => catalog.some((c) => c.set === s.id));
    const setTab = (id, label, owned, total) =>
        h('button.set-tab' + (currentSet === id ? '.is-active' : ''), {
            type: 'button',
            'aria-pressed': String(currentSet === id),
            onclick: () => {
                currentSet = id;
                const url = new URL(location.href);
                url.searchParams.set('set', id);
                history.replaceState(null, '', url);
                render();
            },
        }, [h('span.set-tab__label', { text: label }), h('span.set-tab__count', { text: `${owned}/${total}` })]);

    const tabs = [
        setTab('all', 'Všetky', ownedCount, catalog.length),
        ...sets.map((s) => {
            const inSet = catalog.filter((c) => c.set === s.id);
            return setTab(s.id, s.name, inSet.filter((c) => col.cards[c.id]).length, inSet.length);
        }),
    ];

    // získané karty prvé, potom chýbajúce; v rámci skupiny podľa vzácnosti
    const rarityOrder = { gold: 0, rare: 1, common: 2 };
    const shown = catalog
        .filter((c) => currentSet === 'all' || c.set === currentSet)
        .sort((a, b) => (col.cards[b.id] ? 1 : 0) - (col.cards[a.id] ? 1 : 0) || rarityOrder[a.rarity] - rarityOrder[b.rarity] || a.name.localeCompare(b.name, 'sk'));

    const grid = h('div.album-grid', {}, shown.map((card) => {
        const count = col.cards[card.id] || 0;
        const el = cardElement(card, { missing: !count, count });
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.addEventListener('click', () => openCard(card, count > 0, count));
        return el;
    }));

    const empty = ownedCount === 0
        ? h('div.album-empty.bj-text', { text: 'Zatiaľ nemáš žiadne karty. Za každý splnený level dostaneš kartu!' })
        : null;

    app.replaceChildren(
        topbar({ back, profile, album: false }),
        h('div.album-head', {}, [
            h('h1.bj-title', { text: 'Moja zbierka' }),
            h('div.album-stats', {}, [
                h('div.album-stat', {}, [h('span.album-stat__num', { text: `${ownedCount}` }), h('span', { text: ` / ${catalog.length} kariet` })]),
                h('div.album-stat', {}, [h('span.album-stat__num', { text: `✨ ${col.sparkles || 0}` }), h('span', { text: ` ${sparklesWord(col.sparkles || 0)}` })]),
                packs.length
                    ? h('button.bj-btn.bj-btn--primary.album-pack-btn', { type: 'button', onclick: openPack }, [`Otvoriť balíček`, h('span.bj-badge', { 'aria-label': `${packs.length} balíčky` }, [centeredGlyph(packs.length, { size: 62, stroke: 0 })])])
                    : null,
            ]),
        ]),
        h('div.album-body', {}, [
            h('div.album-sets.bj-panel', {}, tabs),
            h('div.album-cards.bj-panel', {}, [empty, grid]),
        ]),
    );
}

if (profile) {
    render();
    const col = BJ.rewards.collection();
    if (col.packs?.length) say('Máš neotvorený balíček kariet!');
}
