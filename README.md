# Dionlyonee Stream Playground

A premier, multi-device live streaming gameshow platform built with HTML, CSS, and Vanilla JavaScript.

## Directory Structure

```
Dionlyonee-Playground/
│
├── index.html                 # Main Playground Hub & Game Launcher
├── README.md                  # Project documentation & Architecture
│
├── assets/
│   ├── images/                # Logos, game icons, stream graphics
│   ├── sounds/                # SFX (correct, wrong, countdown, spin, applause, winner)
│   └── fonts/                 # Custom stream typography
│
├── css/
│   ├── global.css             # Base CSS reset, typography, utilities
│   ├── playground.css         # Main hub styles & game cards
│   ├── animations.css         # Transitions, spin loops, glows, flashes
│   ├── responsive.css         # Mobile phone & tablet viewport adaptations
│   └── theme.css              # Dionlyonee stream gold/amber/slate palette
│
├── shared/
│   ├── firebase-config.js     # Firebase credentials & options
│   ├── firebase-room.js       # Real-time room synchronization & state sync
│   ├── game-session.js        # Active game state & session coordinator
│   ├── room-ui.js             # Room code HUD, QR code modal & phone link generator
│   ├── host-auth.js           # Host passcode gate & security (Default: Brown123)
│   ├── room-manager.js        # Room creation, dynamic room codes & discovery
│   ├── game-router.js         # Navigation between games & multi-screen modes
│   ├── contestant-manager.js  # Contestant roster, active turn, avatar rendering
│   ├── score-manager.js       # Real-time points, round bank, cash calculation
│   ├── timer-manager.js       # Precision stream countdowns & sound cues
│   ├── sound-manager.js       # Web Audio synthesizer & MP3 sound effects engine
│   ├── random-manager.js      # Deterministic PRNG & randomized game selections
│   ├── used-content-manager.js# Tracking used questions & puzzles per stream session
│   └── dionlyonee-theme.css   # Stream branding, badges, and TV broadcast overlays
│
├── data/
│   ├── contestants.js         # Default stream contestants & guest roster
│   ├── categories/            # Category definitions for all 4 games
│   │   ├── trivia-categories.js
│   │   ├── wheel-categories.js
│   │   ├── jeopardy-categories.js
│   │   └── word-categories.js
│   └── helpers/               # Pure data utilities
│       ├── shuffle.js
│       ├── random.js
│       ├── difficulty.js
│       └── validation.js
│
├── games/
│   ├── games-data.js          # Registry of available playground game modes
│   ├── game-launcher.js       # Launcher dialogs, mode select, direct URL routing
│   ├── games.css              # Game card layouts, status badges & launcher modals
│   └── game-lobby.js          # Room lobby & contestant sync view
│
├── wheel/                     # Wheel of Fortune Show
│   ├── index.html             # Wheel game hub / mode selector
│   ├── host/                  # Host control console (spin, reveal, score, timer)
│   ├── cohost/                # Co-host mobile companion & live buzzer
│   ├── live/                  # Audience & stream broadcast stage
│   ├── waiting/               # Stream standby & intermission screen
│   ├── data/                  # Puzzles, categories, prize wedges
│   ├── js/                    # Wheel physics engine, letter manager, puzzle engine
│   └── css/                   # Stage neon styling, wheel board, spin animations
│
├── trivia/                    # Dionlyonee Trivia Showdown
│   ├── index.html             # Trivia game hub
│   ├── host/                  # Host question controller & answer checker
│   ├── cohost/                # Co-host buzzer desk & clue assist
│   ├── live/                  # Live audience trivia display
│   ├── waiting/               # Intermission lobby
│   ├── data/                  # Question banks (Easy, Medium, Hard, Expert)
│   ├── js/                    # Trivia engine, timer, scoring, randomizer
│   └── css/                   # Broadcast trivia boards & animations
│
├── jeopardy/                  # Dionlyonee Jeopardy Show
│   ├── index.html             # Jeopardy hub
│   ├── host/                  # Grid host controller & clue reader
│   ├── cohost/                # Contestant podium buzzer monitor
│   ├── live/                  # TV grid board & daily doubles
│   ├── waiting/               # Waiting screen
│   ├── data/                  # Categories, dollar values, clues & responses
│   ├── js/                    # Grid engine, buzzer queue, Final Jeopardy
│   └── css/                   # Classic TV Jeopardy neon blue board
│
├── word-reveal/               # Dionlyonee Word Reveal / Most Likely To
│   ├── index.html             # Word Reveal hub
│   ├── host/                  # Host reveal & hint controls
│   ├── cohost/                # Co-host hint runner
│   ├── live/                  # Stage phrase uncover animation
│   ├── waiting/               # Intermission screen
│   ├── data/                  # Words, phrases, hints, categories
│   ├── js/                    # Letter-by-letter reveal engine, timers
│   └── css/                   # Word reveal styling & stage effects
│
├── connections/               # Player & Phone Join Portal
│   ├── join.html              # Mobile contestant join page (QR/code)
│   ├── join.js                # Participant room sync & buzzer
│   └── join.css               # Clean mobile-first touch UI
│
└── admin/                     # Stream Administrator Console
    ├── index.html             # Room overview, reset controls, content manager
    ├── admin.js               # Admin controls & stream settings
    └── admin.css              # Dark telemetry dashboard
```

## Security Passcode
- **Host Console**: `Brown123`
- **Admin Console**: `Brown123`
