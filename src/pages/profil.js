/**
 * Výber a vytvorenie profilu dieťaťa (meno, vek, avatar).
 * Vek určuje, ktoré minihry a aké náročné slová sa ponúknu.
 *
 * URL: profil.html?next=<stránka>  – kam pokračovať po výbere (predvolene urovne.html)
 */
import '../bridge.js';
import { AVATARS, avatarById, needsSetup } from '../core/profiles.js';
import { h, ICONS, say, speakerButton, modal } from '../ui/kit.js';

const BJ = window.BJ;
const app = document.getElementById('app');
const params = new URLSearchParams(location.search);
const next = params.get('next') || 'urovne.html';
const AGES = [3, 4, 5, 6, 7, 8];

function go() {
    location.href = next;
}

function ageLabel(age) {
    if (age === null || age === undefined) return 'vek nezadaný';
    return `${age} ${age === 1 ? 'rok' : age < 5 ? 'roky' : 'rokov'}`;
}

/* ===== Zoznam profilov ===== */
function renderList() {
    const list = BJ.profiles.list();
    const active = BJ.profiles.active();
    const title = 'Kto bude hrať?';

    const tiles = list.map((p) => {
        const av = avatarById(p.avatar);
        return h('div.profile-tile', { 'data-profile': p.id }, [
            h('button.profile-tile__main.bj-panel' + (active?.id === p.id ? '.is-active' : ''), {
                type: 'button',
                'aria-label': `Hrať ako ${p.name}`,
                onclick: () => {
                    BJ.profiles.setActive(p.id);
                    if (needsSetup(p)) renderForm(p);
                    else go();
                },
            }, [
                h('img.profile-tile__avatar', { src: av.image, alt: '' }),
                h('div.profile-tile__name', { text: p.name }),
                h('div.profile-tile__age', { text: ageLabel(p.age) }),
            ]),
            h('button.profile-tile__edit', {
                type: 'button',
                'aria-label': `Upraviť profil ${p.name}`,
                text: 'Upraviť',
                onclick: () => renderForm(p),
            }),
        ]);
    });

    const add = h('div.profile-tile', {}, [
        h('button.profile-tile__main.profile-tile--add.bj-panel', {
            type: 'button',
            'aria-label': 'Nový hráč',
            onclick: () => renderForm(null),
        }, [h('div.profile-tile__plus', { text: '+' }), h('div.profile-tile__name', { text: 'Nový hráč' })]),
    ]);

    app.replaceChildren(
        h('div.bj-topbar', {}, [h('div.back-button', {}, [h('a', { href: 'index.html', 'aria-label': 'Späť', html: ICONS.back })])]),
        h('div.profile-head', {}, [h('h1.bj-title', { text: title }), speakerButton(title)]),
        h('div.profile-grid', {}, [...tiles, list.length < 6 ? add : null]),
    );
}

/* ===== Formulár: nový / úprava profilu ===== */
function renderForm(profile) {
    const isNew = !profile;
    const firstRun = profile && needsSetup(profile) && profile.name === 'Hráč';
    const state = {
        name: isNew || firstRun ? '' : profile.name,
        age: profile?.age ?? null,
        avatar: profile?.avatar || AVATARS[(BJ.profiles.list().length) % AVATARS.length].id,
    };

    const title = firstRun ? 'Ahoj! Ako sa voláš?' : isNew ? 'Nový hráč' : 'Upraviť hráča';

    const nameInput = h('input.form-input', {
        type: 'text',
        maxlength: 16,
        placeholder: 'Meno',
        value: state.name,
        autocomplete: 'off',
        'aria-label': 'Meno',
        oninput: (e) => {
            state.name = e.target.value;
            validate();
        },
    });

    const ageButtons = AGES.map((a) =>
        h('button.age-btn' + (state.age === a ? '.is-selected' : ''), {
            type: 'button',
            'aria-label': ageLabel(a),
            'aria-pressed': String(state.age === a),
            text: String(a),
            onclick: (e) => {
                state.age = a;
                ageButtons.forEach((b) => {
                    const on = b === e.currentTarget;
                    b.classList.toggle('is-selected', on);
                    b.setAttribute('aria-pressed', String(on));
                });
                validate();
            },
        }),
    );

    const avatarButtons = AVATARS.map((av) =>
        h('button.avatar-btn' + (state.avatar === av.id ? '.is-selected' : ''), {
            type: 'button',
            'aria-label': av.name,
            'aria-pressed': String(state.avatar === av.id),
            onclick: (e) => {
                state.avatar = av.id;
                avatarButtons.forEach((b) => {
                    const on = b === e.currentTarget;
                    b.classList.toggle('is-selected', on);
                    b.setAttribute('aria-pressed', String(on));
                });
            },
        }, [h('img', { src: av.image, alt: '' })]),
    );

    const saveBtn = h('button.bj-btn.bj-btn--primary', { type: 'button', text: firstRun || isNew ? 'Hráme!' : 'Uložiť', onclick: save });
    const hint = h('div.form-hint.bj-text');

    function validate() {
        const ok = state.name.trim().length > 0 && state.age !== null;
        saveBtn.disabled = !ok;
        hint.textContent = ok ? '' : !state.name.trim() ? 'Napíš meno.' : 'Vyber vek.';
    }

    function save() {
        const data = { name: state.name.trim(), age: state.age, avatar: state.avatar };
        let p;
        if (isNew) {
            p = BJ.profiles.create(data);
        } else {
            p = BJ.profiles.update(profile.id, data);
        }
        BJ.profiles.setActive(p.id);
        go();
    }

    const canDelete = !isNew && BJ.profiles.list().length > 1;
    const del = canDelete
        ? h('button.link-btn', {
              type: 'button',
              text: 'Zmazať hráča',
              onclick: () => {
                  const close = modal(
                      h('div.bj-row', { style: { flexDirection: 'column', gap: '30px' } }, [
                          h('div.bj-subtitle', { text: `Naozaj zmazať hráča ${profile.name}?` }),
                          h('div.bj-text', { text: 'Zmaže sa aj postup a zbierka kariet.' }),
                          h('div.bj-row', {}, [
                              h('button.bj-btn.bj-btn--danger', {
                                  type: 'button',
                                  text: 'Zmazať',
                                  onclick: () => {
                                      localStorage.removeItem('bj.tiers.' + profile.id);
                                      BJ.profiles.remove(profile.id);
                                      close();
                                      renderList();
                                  },
                              }),
                              h('button.bj-btn', { type: 'button', text: 'Nie', onclick: () => close() }),
                          ]),
                      ]),
                  );
              },
          })
        : null;

    const showBack = !firstRun || BJ.profiles.list().length > 1;

    app.replaceChildren(
        h('div.bj-topbar', {}, [
            showBack
                ? h('div.back-button', {}, [h('a', { href: '#', 'aria-label': 'Späť', html: ICONS.back, onclick: (e) => { e.preventDefault(); renderList(); } })])
                : h('div.back-button', {}, [h('a', { href: 'index.html', 'aria-label': 'Späť', html: ICONS.back })]),
        ]),
        h('div.profile-head', {}, [h('h1.bj-title', { text: title }), speakerButton(title)]),
        h('div.profile-form.bj-panel', {}, [
            h('div.form-row', {}, [h('label.form-label', { text: 'Meno' }), nameInput]),
            h('div.form-row', {}, [h('label.form-label', { text: 'Koľko máš rokov?' }), h('div.age-row', {}, ageButtons)]),
            h('div.form-row', {}, [h('label.form-label', { text: 'Vyber si baníka' }), h('div.avatar-row', {}, avatarButtons)]),
            h('div.form-actions', {}, [saveBtn, hint, del]),
        ]),
    );
    validate();
    if (firstRun) say('Ahoj! Ako sa voláš? Koľko máš rokov?');
}

/* ===== Štart ===== */
const active = BJ.profiles.active();
if (BJ.profiles.list().length === 1 && needsSetup(active)) {
    renderForm(active);
} else {
    renderList();
}
