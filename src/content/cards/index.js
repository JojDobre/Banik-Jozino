/**
 * Zberateľské karty – sady (témy) a karty.
 * Obrázky sú kreslené SVG s animáciou (./art.js).
 *
 * Vzácnosť: common (bežná), rare (vzácna – dúhový lesk), gold (zlatá – lesk a iskričky).
 * Novú kartu pridáš: nakresli ju v art.js (ART.<id>) a dopíš ju sem.
 */
import { ART } from './art.js';

export const SETS = [
    { id: 'drahokamy', name: 'Drahokamy', bg: ['#2b1d5c', '#6a3fc4'], icon: 'rubin' },
    { id: 'zvieratka', name: 'Zvieratká', bg: ['#1f4d2b', '#4caf50'], icon: 'krtko' },
    { id: 'vybava', name: 'Výbava', bg: ['#5a2a0e', '#c9824a'], icon: 'krompac' },
    { id: 'poklady', name: 'Poklady', bg: ['#6b3a00', '#ffb703'], icon: 'koruna' },
];

const C = (id, set, name, rarity) => ({ id, set, name, rarity, art: ART[id] });

export const CARDS = [
    // Drahokamy
    C('rubin', 'drahokamy', 'Rubín', 'common'),
    C('smaragd', 'drahokamy', 'Smaragd', 'common'),
    C('topas', 'drahokamy', 'Topás', 'common'),
    C('ametyst', 'drahokamy', 'Ametyst', 'common'),
    C('zafir', 'drahokamy', 'Zafír', 'rare'),
    C('srdiecko', 'drahokamy', 'Srdiečko', 'rare'),
    C('opal', 'drahokamy', 'Opál', 'rare'),
    C('nuget', 'drahokamy', 'Zlatý nuget', 'gold'),
    // Zvieratká z podzemia
    C('krtko', 'zvieratka', 'Krtko Kopáčik', 'common'),
    C('netopier', 'zvieratka', 'Netopier Nočko', 'common'),
    C('pavucik', 'zvieratka', 'Pavúčik Osmička', 'common'),
    C('slimak', 'zvieratka', 'Slimák Pomalík', 'common'),
    C('myska', 'zvieratka', 'Myška Pišťalka', 'common'),
    C('svetluska', 'zvieratka', 'Svetluška Iskra', 'rare'),
    C('jasterica', 'zvieratka', 'Jašterica Rýchla', 'rare'),
    C('sova', 'zvieratka', 'Sova Huhulka', 'gold'),
    // Baníkova výbava
    C('krompac', 'vybava', 'Krompáč', 'common'),
    C('lopata', 'vybava', 'Lopata', 'common'),
    C('prilba', 'vybava', 'Prilba', 'common'),
    C('lampa', 'vybava', 'Lampáš', 'common'),
    C('kompas', 'vybava', 'Kompas', 'rare'),
    C('vozik', 'vybava', 'Vozík', 'rare'),
    C('klucik', 'vybava', 'Zlatý kľúčik', 'rare'),
    C('mapa', 'vybava', 'Mapa pokladu', 'gold'),
    // Poklady
    C('minca', 'poklady', 'Zlatá minca', 'common'),
    C('kalich', 'poklady', 'Kalich', 'common'),
    C('prsten', 'poklady', 'Prsteň', 'rare'),
    C('truhlica', 'poklady', 'Truhlica', 'rare'),
    C('hviezda', 'poklady', 'Čarovná hviezda', 'rare'),
    C('koruna', 'poklady', 'Koruna', 'gold'),
    C('vajce', 'poklady', 'Dračie vajce', 'gold'),
    C('diamant', 'poklady', 'Veľký diamant', 'gold'),
];

export function setById(id) {
    return SETS.find((s) => s.id === id) || null;
}
