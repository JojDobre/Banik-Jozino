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
- **Vite** — local dev server
- **Web Speech API** — in-browser speech recognition
- **Howler.js** — audio playback
- **Canvas API** — game rendering
- **localStorage** — progress persistence
- **Cache API** — asset preloading

## Project structure

```
Speech-Therapy-Game/
├── config/          # World and level configuration
│   ├── worlds.js
│   └── levels.js
├── js/
│   ├── basics/      # Menu logic
│   ├── managers/    # ProgressManager, GameRouter, CachePreloader
│   ├── game.js      # Baník game logic
│   ├── pexeso/      # Pexeso game logic
│   ├── superjozino/ # Super Jožino game logic
│   └── vendor/      # Third-party libraries (Howler.js)
├── css/             # Stylesheets per game
├── docs/            # Development plan (PLAN.md)
├── fonts/           # Local fonts (works offline)
├── images/          # Sprites, icons, world assets
├── scripts/         # Tooling (image optimization)
├── zvuky/           # Audio assets
├── index.html       # Main menu
├── worldsmenu.html  # World and level selection
├── game.html        # Baník entry point
├── pexeso.html      # Pexeso entry point
└── superjozino.html # Super Jožino entry point
```

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/JojDobre/Speech-Therapy-Game-v2.git
cd Speech-Therapy-Game-v2
npm install
npm run dev
```

Then open the printed URL (e.g. `http://localhost:5173`) in a Chromium-based browser (Chrome or Edge recommended).
Speech recognition requires a secure context (`localhost` or HTTPS) and an internet connection.

To shrink oversized images (keeps file names and formats):

```bash
npm run optimize:images
```

See [docs/PLAN.md](docs/PLAN.md) for the development roadmap.

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

Speech recognition relies on the Web Speech API. Best supported on Chrome, Edge, and Opera (desktop and Android), and on Safari with limitations. Firefox does not support speech recognition.

## Author

**Bc. Adam Reňak**
Technical University of Košice — Faculty of Electrical Engineering and Informatics
Supervisor: Ing. Renát Haluška, PhD.

GitHub: [JojDobre](https://github.com/JojDobre)
