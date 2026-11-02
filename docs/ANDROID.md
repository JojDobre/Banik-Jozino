# Android appka (Capacitor)

Appka je tá istá webová hra zabalená cez [Capacitor](https://capacitorjs.com/).
Rozpoznávanie reči a hlasové pokyny idú cez natívne pluginy
(`@capacitor-community/speech-recognition`, `@capacitor-community/text-to-speech`),
lebo Android WebView nemá Web Speech API.

## Najrýchlejšie: hotové APK z GitHubu
Po každom pushi do `main` sa APK zostaví automaticky:
1. GitHub → záložka **Actions** → posledný beh **Android APK**.
2. Dole v časti **Artifacts** stiahni `banik-jozino-debug-apk` (ZIP s APK).
3. APK prenes do telefónu a otvor ho. Telefón sa spýta, či povoliť inštaláciu
   z neznámeho zdroja (prehliadač/Súbory) – povoľ.

Ide o testovaciu (debug) verziu – nie je určená na Google Play.

## Zostavenie na vlastnom počítači

### Čo treba mať
- [Android Studio](https://developer.android.com/studio) (obsahuje Android SDK a JDK 21)
- Node.js 22

### Prvé spustenie na telefóne
1. Na telefóne zapni *Možnosti pre vývojárov* a *Ladenie cez USB*, pripoj ho káblom.
2. V priečinku projektu:
   ```bash
   npm install
   npm run android:sync
   npm run android:open
   ```
3. V Android Studiu počkaj na dokončenie synchronizácie Gradle a stlač **Run ▶**.

Po každej zmene v kóde hry spusti znova `npm run android:sync` a potom Run.

## Čo otestovať (dôležité – overuje to celý plán)
1. **Mikrofón:** v Bani otvor rečové cvičenie (diamant) a ťukni na HOVORIŤ.
   Appka si má vypýtať povolenie mikrofónu.
2. **Správne slovo:** povedz slovo zo zadania → má sa zobraziť „Výborne!“.
3. **Nesprávne slovo:** povedz iné slovo → „Skúste znova“.
4. **Ticho:** nehovor nič → hláška „Nepočul som ťa“.
5. **Bez internetu:** vypni dáta aj Wi-Fi a skús znova – zapíš si, čo sa stane.
   Slovenské rozpoznávanie na väčšine telefónov internet potrebuje.
6. Napíš mi, či rozpoznané slová vyzerajú rovnako ako v prehliadači (Chrome).

Ak niečo nefunguje, pošli mi výpis z Android Studia (okno **Logcat**, filter `Capacitor`).

## Pred zverejnením na Google Play
- **ID aplikácie** je zatiaľ `sk.banikjozino.app` (v `capacitor.config.json`).
  Po prvom nahratí na Google Play sa už nedá zmeniť – ak chceš iné, povedz teraz.
- Ikona a úvodná obrazovka appky (zatiaľ predvolené od Capacitoru).
- Podpisový kľúč pre vydanie (vytvorí sa v Android Studiu: *Build → Generate Signed Bundle*).
