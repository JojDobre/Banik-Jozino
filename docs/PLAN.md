# Baník Jožino – plán vývoja

Cieľ: z diplomovej práce spraviť skutočnú logopedickú hru pre deti 3–8 rokov,
dostupnú ako web aj ako Android appka na Google Play. Dieťa má vedieť cvičiť samo.

Stav: ✅ hotové · 🔄 rozpracované · ⬜ čaká

---

## Štruktúra hry

Hráč si na začiatku vyberie **úroveň**:

| Úroveň | Obsah | Členenie |
|---|---|---|
| **1 – Počúvam** | sluchové vnímanie: rozlišovanie slov, zvukov, syčania, bzučania… | žiadne svety, jedna **cesta levelov** (30–50 zastávok, minihry sa striedajú, míľnik každých ~10 levelov) |
| **2 – Zvuky a hlásky** | fúkanie, rozcvička jazýčka, izolované hlásky (sss, zzz, vrrr, ššš), slabiky | svety podľa skupín hlások: Fúkanie a jazýček · Sykavky S Z C · Šušťavky Š Ž Č · R a L · Ď Ť Ň / D T N · K G |
| **3 – Slová** | vyslovovanie slov | svety písmen (R, L, S, …), v každom postup: hláska na začiatku → na konci → v strede → zhluky (tr, dr, kr) |
| *4 – Vety (neskôr)* | riekanky, jazykolamy, doplň vetu | |

### Vekové kategórie
Rodič zadá vek dieťaťa pri vytvorení profilu: **3–4**, **5–6**, **7–8** rokov.
Každá minihra má v definícii, pre aký vek je, a obťažnosť (počet kariet, rýchlosť, dĺžka)
sa nastaví podľa veku. Minihry nevhodné pre vek sa nezobrazia.

```js
{ id: 'sound-pexeso', title: 'Zvukové pexeso', ages: ['5-6', '7-8'], tiers: [1], exercise: 'listening' }
```

### Slovník slov
Jeden zdroj pravdy namiesto zoznamov slov v každom leveli. Levely sa generujú z pravidiel
(„5 slov s R na začiatku, max. 2 slabiky“), nie ručne.

```js
{ word: 'ryba', image: 'ryba.png', audio: 'ryba.mp3', phoneme: 'R', position: 'initial', syllables: 2, minAge: 4 }
```

---

## Zbierka kariet

Motivácia, aby sa dieťa k hre vracalo.

**Ako sa karty získavajú**
- **Prvé splnenie levelu** (aspoň 1 ★) → 1 karta.
- **Ťažší / míľnikový level** (napr. každý 4. level vo svete, koniec cesty v úrovni 1) → **balíček** 3–5 kariet.
- **Denná séria** (napr. 3 dni po sebe) → bonusový balíček.
- 3 ★ prvýkrát → šanca na vzácnejšiu kartu v odmene.

**Zbierka (album)**
- Karty sú rozdelené do **sád** (podľa svetov / tém: zvieratá, drahokamy, baníci, postavy zo svetov).
- Vzácnosť: **bežná / vzácna / zlatá** (rámik, lesk, animácia pri otvorení).
- Dokončenie sady → odznak a **odomknutie odmeny**, napr. nového baníka. V hre už sú sprity
  ďalších baníkov (`green_miner`, `old_miner`, `red_head_miner`, `red_shirt_miner`).
- **Karta je aj cvičenie:** ťuknutím na kartu sa prehrá slovo a dieťa ho môže zopakovať.

**Pravidlá férovosti**
- Žiadne nákupy za peniaze, nič sa nedá kúpiť (dôležité aj pre pravidlá Google Play pre deti).
- Duplikáty: kým sada nie je kompletná, padajú prednostne nové karty. Duplikát sa premení
  na „iskričky“, za ktoré si dieťa môže vybrať konkrétnu chýbajúcu kartu.

**Dáta**
```js
// content/cards.json
{ id: 'r-rak', name: 'Rak', image: 'images/slova/rak.png', set: 'world_r', rarity: 'common', word: 'rak' }
// v profile dieťaťa
{ cards: { 'r-rak': 1 }, sparkles: 4, unopenedPacks: 1 }
```
Na začiatok stačia obrázky slov v pekných rámikoch (CSS), vlastná grafika kariet môže prísť neskôr.

---

## Cvičenia

- **Úroveň 1:** len prehrávanie a ťukanie (bez mikrofónu, spoľahlivé, offline).
- **Úroveň 2:** analýza zvuku priamo v zariadení (Web Audio). Kalibrácia pri vytvorení profilu
  (ticho, „ááá“, „sss“), porovnávajú sa pomery energií namiesto pevných frekvencií,
  aby fungovalo pre chlapcov aj dievčatá. Najprv prototyp a test na deťoch.
  - fúkanie, dĺžka a hlasitosť „sss“ / „zzz“ → spoľahlivé
  - S oproti Š, Z oproti S → dobré, nie dokonalé
  - vrčanie R → experiment
  - slabiky → kontrola počtu a rytmu, obsah tolerantne cez rozpoznávanie reči
- **Úroveň 3:** automatické rozpoznávanie reči (súčasné riešenie z Bane – `js/game.js`).
- **Pokyny** nahovorené syntézou reči (TTS). **Vzorové slová** vopred vygenerované kvalitným
  hlasom, skontrolované a pribalené ako súbory (offline, na každom zariadení rovnaké).

## Minihry

| Minihra | Úroveň | Vek | Popis |
|---|---|---|---|
| Baňa | 3 (1) | 5+ | existuje |
| Pexeso | 3 | 5+ | existuje |
| Super Jožino | 3 | 7+ | existuje, treba zaradiť medzi levely |
| Kto to robí? | 1 | 3+ | zvuk → ťukni na zviera/predmet |
| Zvukové pexeso | 1 | 4+ | karty hrajú slovo; pri dvojici dieťa odpovie rovnaké/iné; rovnaké + správne = pár a bod; v balíčku aj podobné slová (rak/lak) |
| Zvončeky v bani | 1 | 5+ | zopakuj poradie zvukov; vyššia obťažnosť: nájdi dvojice pred zhasnutím lampy |
| Hláskový vláčik | 1 | 6+ | triedenie obrázkov do vagónov podľa hlásky |
| Fúkaj na balón | 2 | 3+ | sila fúkania hýbe balónom/loďkou |
| Had Sykáčik | 2 | 3+ | kým dieťa drží „sss“, had lezie |
| Včielka Bzzz | 2 | 4+ | kým bzučí „zzz“, včielka letí |
| Slabiková lavína | 2 | 5+ | opakuj sa-so-su, ra-ro-ru |
| Zrkadielko | 2 | 3+ | experiment: MediaPipe (offline) kontroluje pery/ústa; jazyk len s ukážkou |

---

## Fázy

### Fáza 0 – Upratovanie ✅
- ✅ odstránený Electron (`index.js`, `preload.js`)
- ✅ odstránený mŕtvy kód: `pexeso1.js`, `pexeso-old.css`, `pexesocustom.*`, `menu-pexeso.js`,
  `pexeso-menu.css`, `text.*`, `levels.js`, `words.json`, `slova.txt`, `js/debug/`
- ✅ zmazané zálohy a duplikáty: `images/worlds/zaloha/`, `images/slova.zip`, duplicitné `.webp`
- ✅ obrázky slov, ktoré existovali len ako `.webp` (kód žiada `.png`), prevedené na `.png`
- ✅ `package.json` + Vite (`npm run dev`)
- ✅ Howler.js a písmo lokálne (bez CDN)
- ✅ skript na zmenšenie obrázkov (`npm run optimize:images`)
- ✅ opravy: `lang="sk"`, favicon, duplicitný text pravidiel, chyba HTML vo `worldsmenu.html`,
  odkazy na neexistujúce stránky (`mario.html`, `worlds-menu.html`, `level-selector.html`)

### Fáza 1 – Jadro ✅ (okrem testu na telefóne)
- ✅ nový kód ako ES moduly v `src/`; staré hry ostávajú klasické skripty v `public/js`
  a nové služby používajú cez `window.BJ` (prevedú sa postupne pri redizajne)
- ✅ `SpeechService` (podľa Bane), `AudioService`, `TTSService` – prehliadač aj Android
- ✅ Baňa, Pexeso a Super Jožino rozpoznávajú reč cez spoločnú službu
  a porovnávajú slová rovnakým pravidlom ako Baňa (presná zhoda)
- ✅ profily detí (meno, vek, nastavenia); každý profil má vlastný postup,
  prvý profil preberá doterajší postup
- ✅ zbierka kariet – logika a ukladanie (karta za level, balíček za každý 4. level,
  vzácna karta za prvé 3 ★, iskričky za duplikáty); karty sa už udeľujú, obrazovka albumu príde vo fáze 3
- ✅ slovník slov (`src/content/words.js`, generuje `npm run build:words`),
  generátor levelov, zoznam minihier s vekom
- ✅ `npm run build`, automatické testy (`npm test`) a nasadenie webu (GitHub Actions → Pages)
- 🔄 Android projekt (Capacitor) pripravený – **čaká na test rozpoznávania reči na reálnom telefóne**
  (návod v `docs/ANDROID.md`)

### Fáza 2 – Dizajn ✅
- ✅ herné plátno 1920×1080 (`public/js/stage.js`, `css/stage.css`) – každá obrazovka sa
  zmenší/zväčší podľa displeja a vyzerá všade rovnako; pri inom pomere strán sa plátno
  rozšíri (bez čiernych pruhov)
- ✅ odstránených ~2 500 riadkov media queries podľa šírky, ktoré posúvali prvky
- ✅ výzva „otoč telefón“ na výšku; v appke je orientácia zamknutá na šírku
- ✅ dotykové ovládanie (joystick, krompáč/skok) podľa dotykovej obrazovky, nie šírky okna;
  zväčšené pre detský prst a presne sleduje prst aj na zmenšenom plátne
- ✅ zväčšené tlačidlá späť / menu / šípky svetov na dotykových zariadeniach
- ✅ automatické screenshoty 8 obrazoviek × 7 zariadení (`npm run screenshots`)
- ✅ opravené chyby nájdené pri screenshotoch:
  - Pexeso nezobrazovalo karty (chyba Chromia s `container-type` – týkala by sa aj appky)
  - „duch“ pod zámkami levelov a zdvojené pozadie pod oknami (backdrop-filter pri škálovaní)
  - okná Pexeso tréningu a výberu levelu sa vkladali mimo plátna (na telefóne obrovské)
  - chýbajúce súbory: priečinok `Checkpoint` (veľké písmeno – na Androide by nefungoval),
    ikona sveta Z, ikony v posluchovom cvičení Super Jožina, `banik.ico`
  - Super Jožino už nepadá pri štarte
- ✅ doladenie vzhľadu (`css/common.css`):
  - karty levelov: číslo a hviezdy v strede, väčšie hviezdy, mriežka vycentrovaná v paneli
  - logo JOŽINO/BANÍK: jedna definícia pre všetky obrazovky, farebný prechod pokrýva aj dĺžeň
  - texty s farebným prechodom: dĺžne a mäkčene (Á, Č, Š…) už nie sú len obrysy
  - pravidlá a nastavenia tréningu v čitateľnom písme Nunito, väčšie ovládacie prvky
  - koniec hry: veľké hviezdy, okno sa prispôsobí obsahu (Baňa sa predtým nezmestila)
  - Baňa: bočný panel zarovnaný s hracou plochou, väčšie ikony
  - nové okrúhle tlačidlo späť, rovnako veľké tlačidlo menu v hrách
- ⬜ vlastná ikona appky a úvodná obrazovka (presunuté do fázy 6)

### Fáza 3 – Nová štruktúra ✅ (čiastočne)
- ✅ profily detí (`profil.html`): meno, vek 3–8, avatar (5 baníkov), viac hráčov,
  úprava a zmazanie; pri prvom spustení privítanie „Ahoj! Ako sa voláš?“
- ✅ výber úrovne (`urovne.html`): 1 Počúvam, 2 Zvuky a hlásky (zatiaľ „Čoskoro“),
  3 Slová (pôvodné svety písmen); hviezdy za úroveň, upozornenie na vek
- ✅ cesta levelov úrovne 1 (`cesta.html`): 3 kapitoly × 10 levelov, darček každý 4. level,
  postup pre každý profil zvlášť (`src/core/tierProgress.js`)
- ✅ prvá minihra úrovne 1 „Rovnaké alebo iné?“ (`pocuvaj.html`) – dĺžka podľa veku
- ✅ zbierka kariet: okno s odmenou po leveli (aj v Bani a Pexese), album (`album.html`)
  so sadami podľa svetov, otváranie balíčkov, výmena iskričiek, ťuknutie na kartu prehrá slovo
- ✅ nahovorené pokyny (tlačidlo s reproduktorom; v appke zaznejú aj automaticky)
- ✅ animované zberateľské karty: 32 kreslených kariet v 4 témach (Drahokamy, Zvieratká,
  Výbava, Poklady) – `src/content/cards/`; vzácne s dúhovým leskom, zlaté so zlatým;
  veľká karta sa nakláňa podľa prsta; staré slovné karty sa premenili na iskričky
- ✅ spätná väzba z telefónu:
  - appka na celú obrazovku (skrytý stavový riadok aj navigácia, obrazovka nezhasína)
  - väčšie UI na telefóne – kompaktné plátno, výška podľa stránky (`<html data-phone-h>`)
  - Nastavenia: zvuky a hlas zvlášť (hlavné menu, horná lišta, menu v Bani a Pexese)
  - lepší hlas: vety a mená kariet vopred nahraté neurónovým hlasom Piper
    (`npm run build:voice` → `public/hlas/`), systémový hlas len ako záloha
  - odmena: najprv výsledky levelu, v nich darček; po ťuknutí animácia balíčka
    (zatrasenie, roztrhnutie, karty vyletia a otočia sa, iskry/konfety podľa vzácnosti)
  - nový vzhľad minihry „Rovnaké alebo iné?“ – tabuľa, animovaní baníci na podstavcoch
    s reflektorom, okrúhle drevené tlačidlá
- ⬜ svety písmen (úroveň 3) s levelmi z generátora slov – zatiaľ ostávajú pôvodné levely
- ⬜ ikona a úvodná obrazovka appky

### Fáza 4 – Minihry úrovne 1 ⬜
- ⬜ Kto to robí?, Zvukové pexeso, Zvončeky v bani, Hláskový vláčik
- ⬜ zvukový obsah: viac dvojíc slov (cieľ 50+), nahrávky pre všetky slová

### Fáza 5 – Úroveň 2 ⬜
- ⬜ prototyp analýzy zvuku + kalibrácia, test na deťoch
- ⬜ Fúkaj na balón, Had Sykáčik, Včielka Bzzz, Slabiková lavína
- ⬜ Zrkadielko (experiment)

### Fáza 6 – Android appka ⬜
- ⬜ Capacitor, pluginy (rozpoznávanie reči, TTS, mikrofón), orientácia na šírku
- ⬜ hlásenie pri chýbajúcom internete (rozpoznávanie slovenčiny ho potrebuje)
- ⬜ testy na viacerých telefónoch

### Fáza 7 – Rodič a Google Play ⬜
- ⬜ **overiť licenciu hlasu** Piper `sk_SK-lili-medium`: dáta CC0, ale model je dotrénovaný
  z anglického hlasu lessac (dáta s licenciou možno len na nekomerčné použitie) –
  pred vydaním potvrdiť, prípadne nahradiť (vlastné nahrávky / komerčný neurónový hlas)
- ⬜ rodičovská brána, štatistiky pre rodiča
- ⬜ zásady ochrany súkromia, program Families, Data safety
- ⬜ uzavreté testovanie (osobný účet: 12 testerov / 14 dní), zverejnenie

---

## Známe chyby (na opravu neskôr)
- ~~Baňa padala po zobrazení výsledkov (`showUnlockNotificationsInGame` neexistuje)~~ – opravené vo fáze 3.
- Super Jožino: netopier (`Bat`) nemá animáciu `walk` (len varovanie v konzole). Pád hry na chýbajúcom obrázku je opravený.
- Všetkých 260 levelov je typu `banik`; Pexeso a Super Jožino nie sú v postupe.
- Posluchové cvičenie má len 15 dvojíc zvukov.
- Opakujúce sa názvy levelov (napr. 24× „Prvé Ď-čka“).
- Všetky svety sú odomknuté, podmienky odomknutia sú zakomentované.
- Pexeso a Super Jožino stále používajú vlastné zvukové efekty (nie `AudioService`).
- ~~Pexeso volalo neexistujúcu metódu `saveLevelProgress`, postup sa neukladal~~ – opravené vo fáze 1.
