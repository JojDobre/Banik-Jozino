/**
 * Ručné opravy slovníka. Prepíšu položky z words.generated.js podľa slova.
 *
 * Príklady:
 *   'telefón': { phonemes: { T: { positions: ['initial'], cluster: false } } }, // cudzie slovo – „te“ je tvrdé
 *   'krokodíl': { minAge: 5 },
 *   'syr': { exclude: true },   // slovo sa nebude ponúkať v generovaných leveloch
 */
export default {
    rocket: { exclude: true }, // anglické slovo (obrázok rakety) – po slovensky „raketa“
    facka: { exclude: true }, // nevhodné pre deti
    donut: { exclude: true }, // anglické slovo
    'šampón.jpg': { exclude: true }, // chybná položka (duplicitný obrázok)
    rakva: { exclude: true }, // nevhodné pre deti
    žiletka: { exclude: true }, // nevhodné pre deti
};
