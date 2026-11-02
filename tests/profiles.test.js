import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProfileStore, ageGroupFromAge, LEGACY_PROGRESS_KEY, STORAGE_KEY } from '../src/core/profiles.js';

function memoryStorage() {
    const m = new Map();
    return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), _m: m };
}

test('vekové skupiny', () => {
    assert.equal(ageGroupFromAge(3), '3-4');
    assert.equal(ageGroupFromAge(4), '3-4');
    assert.equal(ageGroupFromAge(5), '5-6');
    assert.equal(ageGroupFromAge(8), '7-8');
    assert.equal(ageGroupFromAge(null), null);
});

test('prvý profil preberá pôvodný postup, ďalšie majú vlastný', () => {
    const s = memoryStorage();
    const store = createProfileStore(s);
    const first = store.ensureDefault();
    assert.equal(first.progressKey, LEGACY_PROGRESS_KEY);
    const second = store.create({ name: 'Ema', age: 5 });
    assert.notEqual(second.progressKey, LEGACY_PROGRESS_KEY);
    assert.equal(second.ageGroup, '5-6');
    assert.equal(store.active().id, first.id);
    store.setActive(second.id);

    // po opätovnom načítaní sa stav zachová
    const again = createProfileStore(s);
    assert.equal(again.active().name, 'Ema');
    assert.equal(again.list().length, 2);
    assert.ok(JSON.parse(s.getItem(STORAGE_KEY)).version === 2);
});

test('úprava veku a nastavení, zmazanie profilu', () => {
    const s = memoryStorage();
    const store = createProfileStore(s);
    const p = store.ensureDefault();
    store.update(p.id, { age: 7, settings: { sound: false } });
    assert.equal(store.active().ageGroup, '7-8');
    assert.equal(store.active().settings.sound, false);
    assert.equal(store.active().settings.music, true);
    const other = store.create({ name: 'Jakub' });
    s.setItem(other.progressKey, '{}');
    store.remove(other.id);
    assert.equal(s.getItem(other.progressKey), null);
    assert.equal(store.list().length, 1);
});
