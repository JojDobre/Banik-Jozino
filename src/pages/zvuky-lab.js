/**
 * Laboratórium zvukov (zvuky-lab.html) – živý pohľad na rozpoznávanie zvukov
 * úrovne 2: čo model práve počuje, istota pre každý zvuk, hlavné príznaky.
 * Slúži na skúšku v telefóne a ladenie hraníc (src/core/soundFeatures.js).
 * „Nahrať vzorku“ uloží príznaky 3 s zvoleného zvuku – dajú sa stiahnuť (JSON).
 */
import '../bridge.js';
import { h, topbar, requireProfile } from '../ui/kit.js';
import { CLASSES, LABELS } from '../core/soundFeatures.js';
import { listenSounds, micErrorText } from '../core/micListener.js';

const app = document.getElementById('app');
const profile = requireProfile();
const COLORS = { ticho: '#7a6a5a', fukanie: '#4fc3f7', S: '#7cff7a', Š: '#2fe0c0', Z: '#ffd34d', Ž: '#ff9f43', hlas: '#c792ea', sum: '#ff5a4e' };

let mic = null;
const samples = [];
let recording = null;

const big = h('div.zl-big', {}, [h('div.zl-big__label', { text: 'Ťukni na Štart' }), h('div.zl-big__sub', { text: '' })]);
const meter = h('div.zl-meter', {}, [h('div.zl-meter__fill')]);
const held = h('div.zl-held', { text: '' });
const bars = CLASSES.map((c) => {
    const fill = h('div.zl-bar__fill', { style: { background: COLORS[c] } });
    const row = h('div.zl-bar', {}, [h('span.zl-bar__name', { text: LABELS[c] }), h('div.zl-bar__track', {}, [fill])]);
    row.fill = fill;
    row.cls = c;
    return row;
});
const info = h('div.zl-info');
const recInfo = h('div.zl-rec', { text: 'Vzorky: 0' });
const targetSel = h('select.zl-select', {}, CLASSES.filter((c) => c !== 'sum').map((c) => h('option', { value: c, text: LABELS[c] })));
const btnStart = h('button.bj-btn.bj-btn--primary', { type: 'button', text: 'Štart', onclick: toggle });
const btnCal = h('button.bj-btn', { type: 'button', text: 'Kalibrovať ticho', onclick: () => mic && mic.recalibrate() });
const btnRec = h('button.bj-btn', { type: 'button', text: 'Nahrať vzorku 3 s', onclick: record });
const btnDl = h('button.bj-btn', { type: 'button', text: 'Stiahnuť', onclick: download });

function update(s) {
    if (s.phase === 'calib') {
        big.firstChild.textContent = 'Ticho…';
        big.lastChild.textContent = 'meriam šum v miestnosti';
        big.style.setProperty('--c', '#7a6a5a');
        return;
    }
    big.firstChild.textContent = LABELS[s.label] || s.label;
    big.lastChild.textContent = `istota ${Math.round(s.confidence * 100)} %`;
    big.style.setProperty('--c', COLORS[s.label] || '#fff');
    meter.firstChild.style.width = `${Math.round(s.level * 100)}%`;
    bars.forEach((b) => { b.fill.style.width = `${Math.round((s.scores[b.cls] || 0) * 100)}%`; });
    const f = s.f;
    info.textContent = `hlasitosť ${f.db.toFixed(0)} dB (prah ${s.calib.minDb.toFixed(0)}) · ťažisko nad 1 kHz ${(f.centroidHigh / 1000).toFixed(1)} kHz · syčanie ${(f.hissShare * 100).toFixed(0)} % · pod 1 kHz ${(f.low * 100).toFixed(0)} % · znelosť ${(f.voicing * 100).toFixed(0)} %`;
    if (recording) {
        recording.frames.push({ label: s.raw, db: +f.db.toFixed(1), share: f.share.map((v) => +v.toFixed(4)), centroidHigh: Math.round(f.centroidHigh), hissShare: +f.hissShare.toFixed(4), low: +f.low.toFixed(4), voicing: +f.voicing.toFixed(3), flatness: +f.flatness.toFixed(4) });
        if (performance.now() - recording.start > 3000) {
            samples.push({ target: recording.target, frames: recording.frames, ok: recording.frames.filter((x) => x.label === recording.target).length });
            const last = samples[samples.length - 1];
            recInfo.textContent = `Vzorky: ${samples.length} · posledná: ${LABELS[last.target]} – rozpoznané ${Math.round((last.ok / last.frames.length) * 100)} % rámcov`;
            recording = null;
            btnRec.disabled = false;
        }
    }
}

async function toggle() {
    if (mic) {
        mic.stop();
        mic = null;
        btnStart.textContent = 'Štart';
        return;
    }
    try {
        mic = await listenSounds({ onUpdate: update });
        btnStart.textContent = 'Stop';
    } catch (e) {
        big.firstChild.textContent = micErrorText(e);
    }
}

function record() {
    if (!mic) return;
    recording = { target: targetSel.value, start: performance.now(), frames: [] };
    btnRec.disabled = true;
    recInfo.textContent = `Nahrávam: ${LABELS[recording.target]}…`;
}

function download() {
    const blob = new Blob([JSON.stringify({ when: new Date().toISOString(), ua: navigator.userAgent, samples }, null, 1)], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: 'zvuky-vzorky.json' });
    document.body.append(a);
    a.click();
    a.remove();
}

if (profile) {
    app.replaceChildren(
        topbar({ back: 'hry.html', profile, album: false }),
        h('div.tiers-head', {}, [h('h1.bj-title', { text: 'Laboratórium zvukov' })]),
        h('div.zl', {}, [
            h('div.zl-left.bj-panel', {}, [big, meter, held, h('div.zl-row', {}, [btnStart, btnCal])]),
            h('div.zl-right.bj-panel', {}, [...bars, info, h('div.zl-row', {}, [targetSel, btnRec, btnDl]), recInfo]),
        ]),
    );
}
