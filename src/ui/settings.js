/**
 * Okno Nastavenia – funguje na každej stránke (aj v pôvodných hrách).
 * Prepínače sa ukladajú do profilu dieťaťa (BJ.setSettings).
 */
import { h, closeButton } from './kit.js';

const OPTIONS = [
    { key: 'sound', icon: '🔊', title: 'Zvuky', text: 'Zvukové efekty v hrách' },
    { key: 'voiceInstructions', icon: '🗣️', title: 'Hlas', text: 'Čítanie pokynov a mien kariet' },
];

export function openSettings() {
    const BJ = window.BJ;
    const host = document.getElementById('bj-stage') || document.body;
    const old = document.querySelector('.bj-settings');
    if (old) old.remove();

    const rows = OPTIONS.map((o) => {
        const sw = h('button.bj-switch', {
            type: 'button',
            role: 'switch',
            'aria-label': o.title,
        }, [h('span.bj-switch__knob')]);
        const sync = () => {
            const on = BJ.settings()[o.key] !== false;
            sw.classList.toggle('is-on', on);
            sw.setAttribute('aria-checked', String(on));
        };
        sw.addEventListener('click', () => {
            const on = BJ.settings()[o.key] !== false;
            BJ.setSettings({ [o.key]: !on });
            sync();
            if (!on && o.key === 'sound') BJ.audio.playEffect('click');
            if (!on && o.key === 'voiceInstructions') BJ.say('Nastavenia');
        });
        sync();
        return h('div.bj-settings__row', {}, [
            h('span.bj-settings__icon', { text: o.icon }),
            h('div.bj-settings__label', {}, [h('div.bj-settings__title', { text: o.title }), h('div.bj-settings__text', { text: o.text })]),
            sw,
        ]);
    });

    const close = () => overlay.remove();
    const profile = BJ.profiles.active();
    const overlay = h('div.bj-settings', { role: 'dialog', 'aria-label': 'Nastavenia' }, [
        h('div.bj-settings__box', {}, [
            closeButton(close),
            h('div.bj-settings__head', { text: 'Nastavenia' }),
            profile?.name && profile.age !== null ? h('div.bj-settings__who', { text: `Hráč: ${profile.name}` }) : null,
            ...rows,
            h('button.bj-settings__ok', { type: 'button', text: 'Hotovo', onclick: close }),
        ]),
    ]);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
    host.append(overlay);
}
