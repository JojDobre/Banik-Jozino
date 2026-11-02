# Baník Jožino

A Slovak-language speech therapy game platform for children aged up to 8 with speech disorders. The platform combines three mini-games with browser-based speech recognition to make pronunciation practice engaging and effective.

Developed as a master's thesis project at the Technical University of Košice (TUKE FEI).

## Overview

Baník Jožino targets 16 problematic Slovak phonemes (R, L, S, Z, C, Š, Ž, Č, D, T, N, Ď, Ť, Ň, K, G), each represented by its own themed world. Every world contains 16+ levels with progressive difficulty, totaling over 256 playable levels. The platform aims to be a free, accessible complement to traditional speech therapy.

## Mini-games

- **Baník (Miner)** — Grid-based mining game. Collect gold freely; diamonds require a speech exercise, crystals require a listening exercise.
- **Pexeso** — Memory card game where matching a pair triggers a speech exercise on the matched word.
- **Super Jožino** — Side-scrolling platformer in the style of Mario, with speech and listening exercises tied to collected items.

## Tech stack

- **HTML5 / CSS3 / JavaScript** — application core
- **Vite** — dev server and build
- **Capacitor** — Android app (native speech recognition and text-to-speech)
- **Web Speech API** — in-browser speech recognition
- **Howler.js** — audio playback
- **Canvas API** — game rendering
- **localStorage** — progress persistence
- **Cache API** — asset preloading

## Project structure

```
Banik-Jozino/
├── src/                 # New modular code (ES modules, bundled by Vite)
│   ├── core/            # speech, tts, audio, profiles, rewards (cards),
│   │                    # minigames registry, level generator, Slovak helpers
│   ├── content/         # Word dictionary, tier 1 path, worlds
│   ├── games/           # Minigame logic (testable, no DOM)
│   ├── pages/           # New screens (profile, tiers, path, album, minigames)
│   ├── ui/              # UI helpers, collectible cards, reward popup
│   └── bridge.js        # Exposes services to the games as window.BJ
├── public/              # Copied to the build as-is
│   ├── js/              # Game logic (Baňa, Pexeso, Super Jožino, menus)
│   ├── config/          # World and level configuration
│   ├── images/ zvuky/   # Images and audio
│   └── fonts/
├── css/                 # Stylesheets per page
├── tests/               # Unit tests (node --test)
├── scripts/             # Tooling: word dictionary, image optimization
├── android/             # Android app project (Capacitor)
├── docs/                # PLAN.md (roadmap), ANDROID.md (building the app)
└── *.html               # Pages: index, profil, urovne, cesta, pocuvaj, album,
                         #        worldsmenu, game, pexeso, superjozino
```

## Getting started

Requires Node.js 22.

```bash
git clone https://github.com/JojDobre/Banik-Jozino.git
cd Banik-Jozino
npm install
npm run dev
```

Open the printed URL (e.g. `http://localhost:5173`) in Chrome or Edge.
Every screen is designed for a 1920×1080 stage that scales to the device (`public/js/stage.js`).
Speech recognition requires a secure context (`localhost` or HTTPS) and an internet connection.

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm test` | Unit tests |
| `npm run build` | Production build into `dist/` |
| `npm run build:words` | Regenerate the word dictionary from levels, images and audio |
| `npm run screenshots` | Screenshots of all screens on 7 device sizes + error check (after `npm run build`) |
| `npm run build:voice` | Generate spoken instructions with the Piper neural voice (needs `piper` + `ffmpeg`) |
| `npm run optimize:images` | Shrink oversized images (keeps names and formats) |
| `npm run android:sync` / `android:open` | Build and open the Android app – see [docs/ANDROID.md](docs/ANDROID.md) |

Pushing to `main` runs the tests and deploys the web version to GitHub Pages.
See [docs/PLAN.md](docs/PLAN.md) for the roadmap.

## How it works

The game is configuration-driven: worlds and levels are defined declaratively in `config/worlds.js` and `config/levels.js`, so new content can be added without touching game logic.

Player progress is handled by `ProgressManager` (a singleton stored in `localStorage`) and uses a star rating system based on actual rounds played:

| Stars | Required score |
|-------|----------------|
| 3     | ≥ 70 %         |
| 2     | 40–69 %        |
| 1     | 10–39 %        |
| 0     | below 10 % or incomplete |

Points are awarded only after a successful speech or listening exercise — not for collecting items alone.

## Browser support

In the browser, speech recognition relies on the Web Speech API — best supported on Chrome, Edge, and Opera, and on Safari with limitations. Firefox does not support it. The Android app uses the system speech recognizer through a Capacitor plugin.

## Author

**Bc. Adam Reňak**
Technical University of Košice — Faculty of Electrical Engineering and Informatics
Supervisor: Ing. Renát Haluška, PhD.

GitHub: [JojDobre](https://github.com/JojDobre)
