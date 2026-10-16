# Destinie image inventory (existing vs. new)

## Existing image files (untouched)
| Path | Used by | Role |
|---|---|---|
| `assets/images/destinie-games-room.svg` | `index.html`, `shared/destinie-ui.js`, `shared/stream-game-live.js`, `*/waiting/index.html`, `*/live/index.html` | Hero / waiting-room illustration |
| `assets/images/dionlyonee-pon-di-app.png` / `.svg` (plus copies at repo root, `wheel/`, `jeopardy/`, `*/waiting/`) | waiting screens, `scripts/generate-waiting-screen.cjs` | App / share image |

## Games found (one thumbnail each, `assets/images/games/game-<id>.webp`, 800×450, 16:9)
wheel, trivia, jeopardy, word-reveal, speak-out, charades, emoji-guess, finish-the-sentence, guess-lyrics, hangman, hot-take, most-likely, unscramble-it, what-would-you-do, who-dis, who-would-you-pick, would-you-rather (each has its own folder with `index.html`; the first five also appear in `games/games-data.js`).

## Required slots → new files
| Role | Aspect | Target px | Files |
|---|---|---|---|
| Homepage hero (`index.html` `.destinie-hero`) | 16:9 | 1920×1080 | `backgrounds/destinie-hero.webp` |
| Alt. backgrounds | 16:9 | 1920×1080 | `backgrounds/destinie-{forest-background,moonlit-garden,crystal-cavern}.webp` |
| Banners | 3.2:1 | 1920×600 | `banners/banner-{enchanted-forest,moonlit-castle,magical-waterfall,crystal-kingdom}.webp` |
| Portraits | 1:1 | 1024×1024 | `characters/character-*.webp` (6) |
| Full body | 2:3 | 1024×1536 | `characters/destinie-{fox-fullbody,fairy-fullbody,magical-companion}.webp` |
| Game thumbnails | 16:9 | 800×450 | `games/game-*.webp` (17) |
| Decorations | – | ≥512 | `decorations/*.png` (8) |
| Wordmark | 3:1 | 1200×400 | `branding/destinie-logo.{png,svg}` |

All of the new files are *missing before this change* (no `backgrounds/`, `banners/`, `characters/`, `games/`, `decorations/`, `branding/` folders existed). The app's code does not yet reference them; wiring them in is intentionally left out of this task.
