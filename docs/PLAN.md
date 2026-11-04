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
| Baňa | 3 (1) | 3+ | pôvodná pre 3–4 roky, nová s preskúmavaním bane pre 5+ (fáza 3c) |
| Pexeso | 3 | 5+ | existuje |
| Super Jožino | 3 | 5+ | hotové v štýle Pixel Adventure, zaradené ako typ levelu `mario` (R-3), builder levelov |
| Kto to robí? | 1 | 3+ | zvuk → ťukni na zviera/predmet |
| Zvukové pexeso | 1 | 4+ | karty hrajú slovo; pri dvojici dieťa odpovie rovnaké/iné; rovnaké + správne = pár a bod; v balíčku aj podobné slová (rak/lak) |
| Zvončeky v bani | 1 | 5+ | zopakuj poradie zvukov; vyššia obťažnosť: nájdi dvojice pred zhasnutím lampy |
| Hláskový vláčik | 1 | 5+ | triedenie obrázkov do vagónov podľa hlásky |
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
- ✅ jednotný dizajn pre mobil: rovnaká mierka plátna na všetkých stránkach, dizajnové
  premenné (okrúhle tlačidlá, lišty, čipy, nadpisy), čitateľné texty, kontrola
  `npm run audit:ui` (mierka, tlačidlá, najmenší text, prvky mimo obrazovky)
- ✅ bez preblikávania: písma vopred (`preload`, `font-display: block`), obrazovka sa ukáže
  až keď sú písma a obrázky pripravené, „Načítavam…“ len pri prvom spustení
- ✅ svety písmen (úroveň 3) z generátora slov: `npm run build:levels` vytvorí
  `public/config/levels.js` (pravidlá `src/core/worldLevels.js`, testy `tests/worldLevels.test.js`)
  - 16 svetov × 16 levelov, etapy: hláska na začiatku → na konci → v strede → zhluky;
    etapa bez dosť slov sa vynechá (napr. Z a G na konci)
  - hry sa striedajú (cyklus 8): na svet 10× Baňa, 4× Pexeso, 2× Super Jožino;
    deti 3–4 roky hrajú namiesto Super Jožina Baňu
  - počty predmetov a slov stúpajú s levelom, susedné levely majú iné slová,
    jedinečné názvy, odomykanie postupne; id levelov ostali (postup sa nestratil)
  - karta levelu ukazuje ikonu hry, okno levelu etapu („R na začiatku slova“)
- ⬜ ikona a úvodná obrazovka appky

### Fáza 3b – Super Jožino ✅
- ✅ mobilné ovládanie: ľavá polovica = pohyb (šípky, prst sa dá posúvať), pravá = skok,
  viac prstov naraz; plynulé zrýchľovanie, tolerantný skok (coyote time, jump buffer)
- ✅ výkon: odstránené umelé spomalenie, pevný krok fyziky 60×/s, kreslí sa len viditeľné,
  terén v cache; svet priblížený, kamera aj zvislo
- ✅ grafika **Pixel Adventure 1 a 2** (Pixel Frog, CC0 – `public/images/superjozino/pa/CREDITS.md`),
  postava ostáva baník Jožino, pozadie svetov ostáva
- ✅ baník: dvojitý skok so saltom, šmýkanie po stene a odraz, šmyk po ľade, zásah, pád,
  objavenie sa; po oživení sa neovláda, kým nedopadne
- ✅ ovocie, krabice, rozbitné bloky, trampolína, plošiny na reťazi, padajúce plošiny,
  ostne, píla, oheň, ventilátor, šípka; 11 nepriateľov z PA2; checkpointy, trofej, konfety
- ✅ drahokamy: modrý = rečové cvičenie (3 pokusy, reproduktor, Preskočiť),
  zelený = super skok, červený = +1 život; strieborná minca = „Rovnaké alebo iné?“
- ✅ efekty a zvuky, spätná väzba Správne / Skús znova ako v ostatných cvičeniach
- ✅ napojenie na svety: `gameType: 'mario'` + `gameConfig.sjLevel`, slová z levelu,
  hviezdy do postupu, odmena (karty)
- ✅ 3 levely z dlaždíc (`sj-levels.js`), pôvodné mapy ako 101 a 102
- ✅ **builder levelov** (`builder.html`): 3 vrstvy (bloky cez seba), veľké bloky, objekty,
  pasce, nepriatelia, späť/znova, moje levely, predlohy, export/import JSON, Hrať;
  „TEST JOZINO“ v menu spúšťa vlastný level
- ✅ **teleportačné miestnosti**: rámik, vzorované pozadie, portály tam a späť
- ⬜ test na telefóne: ovládanie, obťažnosť pre 5–6 rokov, výkon
- ⬜ viac levelov (z buildera) a ich zaradenie do svetov písmen (nielen R-3)
- ⬜ obťažnosť podľa veku (3–4: viac životov, bez dier, pomalší nepriatelia)
- ⬜ uloženie levelov z buildera do repa (teraz len v zariadení; export JSON → repo)

### Fáza 3c – Baňa pre mobil ✅ (prvá verzia)
Pôvodná Baňa (`game.html`, celá baňa naraz) ostáva pre deti **3–4 roky**; staršie deti
hrajú novú Baňu na preskúmavanie (`bana.html`). Výber robí `js/bana-route.js` podľa veku
v profile (`?classic=1` = vždy pôvodná). Herná logika, cvičenia, hodnotenie, ukladanie
a karty sú spoločné (`js/game.js`); nová verzia mení len vzhľad a hranie (`js/bana/explore.js`).
- ✅ hra na celú obrazovku, horná lišta s počtami v rámčekoch, kamera sleduje baníka
- ✅ baňa sa vytvorí sama podľa počtu predmetov v leveli (rovnaký level = rovnaká baňa);
  veľkosť podľa veku (5–6: 28×19, 7–8: 34×24) alebo `gameConfig.mineSize`
- ✅ tma pre všetkých, svetlo lampy baníka, prebádané miesta tlmene viditeľné,
  lampy na podperách (štart, staré jaskyne)
- ✅ poklady ukryté v hornine (iskry), tvrdé kamene sa nedajú prekopať (každý poklad
  je vždy dosiahnuteľný), mini-mapa + celá mapa, šípka k najbližšiemu pokladu
- ✅ ovládanie: smerový kríž + krompáč (kope sa len krompáčom), klávesnica
- ✅ baník podľa profilu dieťaťa (5 baníkov, animácie do všetkých smerov)
- ✅ efekty: hlina sa rozpadne, poklad sa zatrasie, zber letí do počítadla
- ✅ časomiera predvolene vypnutá – zobrazí sa len pri leveli s `timeLimit`
  (alebo `gameConfig.timeLimit`) v `config/levels.js`
- ✅ okno výsledkov sa na telefóne zmestí (aj v pôvodnej Bani)
- ⬜ test na telefóne a doladenie (rýchlosť pohybu, veľkosť bane, obťažnosť)
- ⬜ zvuky a okná cvičení v štýle Super Jožina (zatiaľ pôvodné okná z Bane)

### Fáza 4 – Minihry úrovne 1 🔄
- ✅ nahrávky všetkých 425 slov hlasom Piper (`npm run build:word-audio` → `public/hlas/slova/`);
  ľudské nahrávky (`public/zvuky/`) majú prednosť
- ✅ **Čo počuješ?** (`obrazky.html`) – zaznie slovo, ťukni na obrázok; 2–4 obrázky podľa veku,
  starší dostanú podobné slová; 2 pokusy (namiesto „Kto to robí?“ – na to chýbajú zvuky zvierat)
- ✅ **Zvukové pexeso** (`zvpexeso.html`) – karty hrajú slová, dvojice podľa sluchu;
  3–6 dvojíc podľa veku, hviezdy podľa počtu pokusov
- ✅ **Zvončeky v bani** (`zvoncky.html`, od 5 rokov) – zopakuj poradie tónov, predlžuje sa
- ✅ cesta úrovne 1 strieda 4 minihry (3–4 roky bez zvončekov); „Ďalej“ vedie na správnu hru
- ✅ logika minihier v `src/games/tier1Games.js` + testy
- ⬜ Kto to robí? – treba zvuky zvierat a predmetov (napr. Freesound / Kenney, CC0)
- ✅ Hláskový vláčik (vlacik.html, od 5 rokov) – slovo s obrázkom sa naloží do vozíka s hláskou,
  na ktorú začína; dvojice R–L, S–Š, K–G, Z–Ž, T–D, C–Č sa striedajú po leveloch, na vozíku ukážka
- ✅ viac dvojíc pre „Rovnaké alebo iné?“ – 15 ľudských + 21 minimálnych dvojíc (src/content/pairs.js,
  hlas Piper: rak/lak, kasa/kaša, koza/koža, kúra/túra…)

### Obťažnosť podľa veku ✅
- ✅ public/js/age-difficulty.js – tabuľka pre 3–4 / 5–6 / 7–8, hry si berú svoje hodnoty
- ⬜ ladenie čísel podľa testov s deťmi

### Fáza 5 – Úroveň 2 ⬜
- ⬜ prototyp analýzy zvuku + kalibrácia, test na deťoch
- ⬜ Fúkaj na balón, Had Sykáčik, Včielka Bzzz, Slabiková lavína
- ⬜ Zrkadielko (experiment)

### Fáza 6 – Android appka ⬜
- ⬜ Capacitor, pluginy (rozpoznávanie reči, TTS, mikrofón), orientácia na šírku
- ⬜ hlásenie pri chýbajúcom internete (rozpoznávanie slovenčiny ho potrebuje)
- ⬜ testy na viacerých telefónoch

### Fáza 7 – Rodič a Google Play ⬜
- ⬜ **licencia hlasu**: vety a slová sú teraz nahraté hlasom Microsoft `sk-SK-ViktoriaNeural`
  (Piper bol zle zrozumiteľný). Na testovanie vygenerované cez edge-tts; pred vydaním
  pregenerovať rovnakým hlasom cez **Azure Speech** (oficiálna licencia, bezplatný limit stačí –
  treba účet a kľúč), prípadne nahradiť ľudskými nahrávkami
  (`npm run build:voice -- --all`, `npm run build:word-audio -- --all`, TTS_PY = python s edge-tts)
- ⬜ rodičovská brána, štatistiky pre rodiča
- ⬜ zásady ochrany súkromia, program Families, Data safety
- ⬜ uzavreté testovanie (osobný účet: 12 testerov / 14 dní), zverejnenie

---

## Známe chyby (na opravu neskôr)
- ~~Baňa padala po zobrazení výsledkov (`showUnlockNotificationsInGame` neexistuje)~~ – opravené vo fáze 3.
- Super Jožino (pôvodné mapy 101/102): netopier (`Bat`) nemá animáciu `walk` (len varovanie v konzole).
- ~~Levely boli takmer všetky typu `banik`~~ – svety sa generujú, hry sa striedajú.
- Builder: levely sú len v zariadení (localStorage) – pri vymazaní dát appky sa stratia, treba exportovať.
- Posluchové cvičenie „Rovnaké alebo iné?“ má len 15 dvojíc zvukov.
- ~~Opakujúce sa názvy levelov~~ – opravené generátorom.
- Všetky svety sú odomknuté, podmienky odomknutia sú zakomentované.
- Pexeso stále používa vlastné zvukové efekty (nie `AudioService`).
- ~~Pexeso volalo neexistujúcu metódu `saveLevelProgress`, postup sa neukladal~~ – opravené vo fáze 1.

---

## Čo ďalej (poradie)

1. **Test na telefóne (APK)** – Super Jožino (ovládanie, obťažnosť, výkon), rozpoznávanie reči
   v appke, celý postup profil → úroveň → level → odmena.
2. **Baňa pre mobil (fáza 3c)** – prvá verzia hotová, čaká na test na telefóne.
3. **Svety písmen z generátora (úroveň 3)** ✅ – hotové; ďalej viac máp Super Jožina
   (z buildera) a kontrola slovníka logopédom (niektoré priradenia hlások).
4. **Minihry úrovne 1 (fáza 4)** 🔄 – Čo počuješ?, Zvukové pexeso, Zvončeky, Hláskový vláčik
   a nové dvojice hotové; zostáva len Kto to robí? (chýbajú zvuky zvierat a predmetov)
5. **Obťažnosť podľa veku** ✅ – public/js/age-difficulty.js (jedno miesto pre úroveň 3):
   Baňa (veľkosť bane, počet predmetov a cvičení, dosah lampy, časomiera len 7–8),
   Pexeso (3–4: 4 páry, 5–6: max 6, 7–8: +2 páry až 10), Super Jožino (životy 5/5/3,
   pomalší nepriatelia a píly, dlhšia nezraniteľnosť). Test: ?age=3-4 v adrese hry.
6. **Ikona appky a úvodná obrazovka** ✅ (zlatá ikona s baníkom, úvod s poskakujúcim baníkom,
   scripts/brand/build-icons.mjs) a **nové pexeso** ✅ (karty rozhádzané na stole, páry na kôpku,
   cvičenie v štýle appky, viac hráčov). Ďalej **fáza 7** (rodičovská brána, licencia hlasu,
   zásady súkromia, uzavreté testovanie na Google Play).
7. **Úroveň 2 (fáza 5)** – najprv prototyp analýzy zvuku a test na deťoch.
