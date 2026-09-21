/**
 * Dionlyonee Playground - Expanded Wheel of Fortune Official Puzzle Dataset
 * Features:
 * - 18 Diverse Categories (Jamaican Phrases, Pop Culture, Movies, Sayings, etc.)
 * - 3 Difficulty Tiers: easy, medium, hard
 * - Thoughtful Non-Spoiler Clues / Hints
 * - Unique IDs for Session No-Repeat Tracking
 */

(function () {
  'use strict';

  const WHEEL_PUZZLE_CATEGORIES = [
    'Common Phrases',
    'Jamaican Phrases',
    'Movies',
    'TV Shows',
    'Music',
    'Food',
    'Animals',
    'Video Games',
    'Pop Culture',
    'Internet Culture',
    'Places',
    'Sayings',
    'Everyday Life',
    'Funny Phrases',
    'Holidays',
    'Travel',
    'Famous People',
    'Books'
  ];

  const WHEEL_PUZZLES_MASTER = [
    // --- JAMAICAN PHRASES ---
    { id: 'jam_01', answer: 'WAH GWAAN', category: 'Jamaican Phrases', difficulty: 'easy', hint: 'The universal island greeting asking what is happening.' },
    { id: 'jam_02', answer: 'EVERYTING IRIE', category: 'Jamaican Phrases', difficulty: 'easy', hint: 'An uplifting declaration that all is well and peaceful.' },
    { id: 'jam_03', answer: 'MI SOON COME', category: 'Jamaican Phrases', difficulty: 'medium', hint: 'A flexible promise of arrival that might take longer than expected.' },
    { id: 'jam_04', answer: 'SMALL UP YUHSELF', category: 'Jamaican Phrases', difficulty: 'medium', hint: 'A polite request on a crowded bus or couch to make room.' },
    { id: 'jam_05', answer: 'WEH YUH A SEH', category: 'Jamaican Phrases', difficulty: 'easy', hint: 'A casual inquiry into what someone is talking about or doing.' },
    { id: 'jam_06', answer: 'NUFF RESPECT', category: 'Jamaican Phrases', difficulty: 'easy', hint: 'An expression showing profound admiration and highest honor.' },
    { id: 'jam_07', answer: 'WALK GOOD', category: 'Jamaican Phrases', difficulty: 'easy', hint: 'A warm parting blessing wishing someone safe travels.' },
    { id: 'jam_08', answer: 'TEK TIME', category: 'Jamaican Phrases', difficulty: 'easy', hint: 'Reminding someone to slow down and handle things patiently.' },
    { id: 'jam_09', answer: 'DUTTY WINE', category: 'Jamaican Phrases', difficulty: 'hard', hint: 'A famous energetic dancehall movement with intense neck motion.' },
    { id: 'jam_10', answer: 'TOUCH DI ROAD', category: 'Jamaican Phrases', difficulty: 'medium', hint: 'Stepping outside and heading out into town with energy.' },
    { id: 'jam_11', answer: 'ONE LOVE', category: 'Jamaican Phrases', difficulty: 'easy', hint: 'Global message of unity popularized by reggae royalty.' },
    { id: 'jam_12', answer: 'HOLD A VIBE', category: 'Jamaican Phrases', difficulty: 'medium', hint: 'Chilling out and relaxing in good company without any rush.' },

    // --- COMMON PHRASES ---
    { id: 'cph_01', answer: 'PIECE OF CAKE', category: 'Common Phrases', difficulty: 'easy', hint: 'Describes a task that requires very little effort to complete.' },
    { id: 'cph_02', answer: 'BLESSING IN DISGUISE', category: 'Common Phrases', difficulty: 'medium', hint: 'An apparent misfortune that eventually turns out beneficial.' },
    { id: 'cph_03', answer: 'BEATING AROUND THE BUSH', category: 'Common Phrases', difficulty: 'hard', hint: 'Deliberately delaying the main point of a conversation.' },
    { id: 'cph_04', answer: 'BREAK A LEG', category: 'Common Phrases', difficulty: 'easy', hint: 'A theatrical tradition wishing performers good fortune.' },
    { id: 'cph_05', answer: 'CALL IT A DAY', category: 'Common Phrases', difficulty: 'easy', hint: 'Deciding to stop working for the evening.' },
    { id: 'cph_06', answer: 'HIT THE JACKPOT', category: 'Common Phrases', difficulty: 'easy', hint: 'Achieving extraordinary sudden luck or financial reward.' },
    { id: 'cph_07', answer: 'SPILL THE BEANS', category: 'Common Phrases', difficulty: 'medium', hint: 'Prematurely revealing confidential information or secrets.' },
    { id: 'cph_08', answer: 'ON CLOUD NINE', category: 'Common Phrases', difficulty: 'easy', hint: 'A state of pure ecstasy and blissful joy.' },
    { id: 'cph_09', answer: 'BURN THE MIDNIGHT OIL', category: 'Common Phrases', difficulty: 'hard', hint: 'Staying awake deep into the darkness studying or working.' },
    { id: 'cph_10', answer: 'UNDER THE WEATHER', category: 'Common Phrases', difficulty: 'medium', hint: 'Feeling mildly unwell or slightly exhausted.' },

    // --- MOVIES ---
    { id: 'mov_01', answer: 'THE LION KING', category: 'Movies', difficulty: 'easy', hint: 'Animated royal saga set across the majestic African pride lands.' },
    { id: 'mov_02', answer: 'BACK TO THE FUTURE', category: 'Movies', difficulty: 'medium', hint: 'Temporal adventure featuring an iconic sports car reaching 88 mph.' },
    { id: 'mov_03', answer: 'PIRATES OF THE CARIBBEAN', category: 'Movies', difficulty: 'medium', hint: 'High-seas nautical fantasy starring a swaggering swashbuckler.' },
    { id: 'mov_04', answer: 'AVENGERS ENDGAME', category: 'Movies', difficulty: 'easy', hint: 'The cinematic culmination of superhero cosmic time defense.' },
    { id: 'mov_05', answer: 'JURASSIC PARK', category: 'Movies', difficulty: 'easy', hint: 'Genetically resurrected prehistoric creatures break island containment.' },
    { id: 'mov_06', answer: 'THE MATRIX', category: 'Movies', difficulty: 'easy', hint: 'A hacker chooses between two colored pills and discovers reality.' },
    { id: 'mov_07', answer: 'SPIDER MAN NO WAY HOME', category: 'Movies', difficulty: 'hard', hint: 'Multiverse collision bringing three generations of web-slingers together.' },
    { id: 'mov_08', answer: 'FORREST GUMP', category: 'Movies', difficulty: 'easy', hint: 'Life journey compared to an assorted box of chocolates.' },

    // --- TV SHOWS ---
    { id: 'tv_01', answer: 'STRANGER THINGS', category: 'TV Shows', difficulty: 'easy', hint: 'Hawkins teens battle supernatural horrors from an alternate dimension.' },
    { id: 'tv_02', answer: 'GAME OF THRONES', category: 'TV Shows', difficulty: 'medium', hint: 'Dynastic struggle for iron power amidst freezing northern threats.' },
    { id: 'tv_03', answer: 'BREAKING BAD', category: 'TV Shows', difficulty: 'medium', hint: 'A chemistry instructor transitions into desert crystal enterprise.' },
    { id: 'tv_04', answer: 'THE FRESH PRINCE', category: 'TV Shows', difficulty: 'easy', hint: 'West Philadelphia youth moves into wealthy California mansion.' },
    { id: 'tv_05', answer: 'SQUID GAME', category: 'TV Shows', difficulty: 'easy', hint: 'High-stakes childhood playground contests with life-or-death stakes.' },
    { id: 'tv_06', answer: 'THE OFFICE', category: 'TV Shows', difficulty: 'easy', hint: 'Mockumentary chronicles daily antics at a Scranton paper company.' },

    // --- MUSIC ---
    { id: 'mus_01', answer: 'BOHEMIAN RHAPSODY', category: 'Music', difficulty: 'medium', hint: 'Operatic rock anthem featuring layered harmonies and Galileo.' },
    { id: 'mus_02', answer: 'BILLIE JEAN', category: 'Music', difficulty: 'easy', hint: 'Iconic moonwalking track driven by an unforgettable bassline.' },
    { id: 'mus_03', answer: 'HOTLINE BLING', category: 'Music', difficulty: 'easy', hint: 'Late-night phone call groove with viral yellow sweater dance.' },
    { id: 'mus_04', answer: 'ROLLING IN THE DEEP', category: 'Music', difficulty: 'medium', hint: 'Powerhouse soulful lament propelled by driving stomps and claps.' },
    { id: 'mus_05', answer: 'SWEET CAROLINE', category: 'Music', difficulty: 'easy', hint: 'Crowd-favorite singalong with emphatic three-beat horn chants.' },
    { id: 'mus_06', answer: 'UPTOWN FUNK', category: 'Music', difficulty: 'easy', hint: 'High-energy brass groove that promises not to believe me, just watch.' },

    // --- FOOD ---
    { id: 'fd_01', answer: 'JERK CHICKEN AND RICE', category: 'Food', difficulty: 'easy', hint: 'Spiced grilled poultry seasoned with pimento and scotch bonnet.' },
    { id: 'fd_02', answer: 'LOADED CHEESEBURGER', category: 'Food', difficulty: 'easy', hint: 'Grilled beef patty stacked high with savory toppings and melted cheddar.' },
    { id: 'fd_03', answer: 'PEPPERONI PIZZA SLICE', category: 'Food', difficulty: 'easy', hint: 'Crispy triangle crust smothered in tomato sauce and spicy cured rounds.' },
    { id: 'fd_04', answer: 'OXTAIL WITH BUTTER BEANS', category: 'Food', difficulty: 'hard', hint: 'Rich, slow-simmered Caribbean delicacy steeped in brown savory gravy.' },
    { id: 'fd_05', answer: 'GOLDEN MACARONI AND CHEESE', category: 'Food', difficulty: 'medium', hint: 'Baked soul food staple with creamy elbows and baked cheesy crust.' },
    { id: 'fd_06', answer: 'BELGIAN CHOCOLATE WAFFLE', category: 'Food', difficulty: 'medium', hint: 'Deep-pocket breakfast pastry drizzled in rich European sweetness.' },

    // --- ANIMALS ---
    { id: 'an_01', answer: 'GOLDEN RETRIEVER', category: 'Animals', difficulty: 'easy', hint: 'Beloved friendly canine known for gentle nature and retrieving sticks.' },
    { id: 'an_02', answer: 'GREAT WHITE SHARK', category: 'Animals', difficulty: 'medium', hint: 'Apex marine predator patrolling deep coastal ocean waters.' },
    { id: 'an_03', answer: 'EMPEROR PENGUIN', category: 'Animals', difficulty: 'medium', hint: 'Majestic flightless bird enduring brutal Antarctic winter blizzards.' },
    { id: 'an_04', answer: 'AFRICAN ELEPHANT', category: 'Animals', difficulty: 'easy', hint: 'The largest walking terrestrial mammal with magnificent curved ivory.' },
    { id: 'an_05', answer: 'BALD EAGLE', category: 'Animals', difficulty: 'easy', hint: 'White-crested soaring raptor symbolizing liberty and sharp eyesight.' },

    // --- VIDEO GAMES ---
    { id: 'vg_01', answer: 'SUPER MARIO BROS', category: 'Video Games', difficulty: 'easy', hint: 'Mushroom Kingdom plumber leaping across green warp pipes.' },
    { id: 'vg_02', answer: 'CALL OF DUTY WARZONE', category: 'Video Games', difficulty: 'medium', hint: 'Tactical first-person battle royale dropping onto vast combat maps.' },
    { id: 'vg_03', answer: 'THE LEGEND OF ZELDA', category: 'Video Games', difficulty: 'medium', hint: 'Courageous green tunic hero exploring Hyrule to rescue princess.' },
    { id: 'vg_04', answer: 'MINECRAFT SURVIVAL', category: 'Video Games', difficulty: 'easy', hint: 'Pixelated sandbox realm of mining ores and crafting blocky shelters.' },
    { id: 'vg_05', answer: 'GRAND THEFT AUTO', category: 'Video Games', difficulty: 'easy', hint: 'Open-world crime syndicate sandbox driving fast through satire cities.' },

    // --- POP CULTURE & INTERNET CULTURE ---
    { id: 'pop_01', answer: 'GOING VIRAL ON TIKTOK', category: 'Internet Culture', difficulty: 'easy', hint: 'Sudden exponential view explosion across mobile video feeds.' },
    { id: 'pop_02', answer: 'TOUCH SOME GRASS', category: 'Internet Culture', difficulty: 'medium', hint: 'Humorous advice reminding online warriors to reconnect with reality.' },
    { id: 'pop_03', answer: 'NO CAP ALL FACTS', category: 'Internet Culture', difficulty: 'medium', hint: 'Slang affirmation emphasizing absolute sincerity and truth.' },
    { id: 'pop_04', answer: 'LIVING RENT FREE IN MY MIND', category: 'Pop Culture', difficulty: 'hard', hint: 'Fixating uncontrollably on someone or a catchy tune without reason.' },
    { id: 'pop_05', answer: 'SUPER BOWL HALFTIME SHOW', category: 'Pop Culture', difficulty: 'medium', hint: 'Massive musical spectacle mid-way through championship football Sunday.' },
    { id: 'pop_06', answer: 'RED CARPET MOMENT', category: 'Pop Culture', difficulty: 'easy', hint: 'Glamorous arrival runway where stars showcase dazzling evening fashion.' },

    // --- PLACES & TRAVEL ---
    { id: 'pl_01', answer: 'MONTEGO BAY JAMAICA', category: 'Places', difficulty: 'easy', hint: 'Renowned coastal resort sanctuary famous for Doctor’s Cave beach.' },
    { id: 'pl_02', answer: 'TIMES SQUARE NEW YORK', category: 'Places', difficulty: 'easy', hint: 'Bustling commercial crossroad illuminated by gigantic digital billboards.' },
    { id: 'pl_03', answer: 'EIFFEL TOWER PARIS', category: 'Places', difficulty: 'easy', hint: 'Iconic wrought-iron lattice monument rising above the Champ de Mars.' },
    { id: 'pl_04', answer: 'GREAT WALL OF CHINA', category: 'Places', difficulty: 'medium', hint: 'Ancient defensive masonry fortification snaking across northern ridges.' },
    { id: 'pl_05', answer: 'FIRST CLASS AIRLINE TICKET', category: 'Travel', difficulty: 'medium', hint: 'Luxury boarding pass granting lie-flat suites and complimentary bubbly.' },
    { id: 'pl_06', answer: 'PASSPORT AND SUNGLASSES', category: 'Travel', difficulty: 'easy', hint: 'Essential travel combo for tropical resort holiday departures.' },

    // --- SAYINGS & EVERYDAY LIFE ---
    { id: 'say_01', answer: 'BETTER LATE THAN NEVER', category: 'Sayings', difficulty: 'easy', hint: 'Arrival after the scheduled hour is still preferable to not showing up.' },
    { id: 'say_02', answer: 'ACTION SPEAKS LOUDER THAN WORDS', category: 'Sayings', difficulty: 'hard', hint: 'What someone actually accomplishes outweighs what they merely promise.' },
    { id: 'say_03', answer: 'EVERY CLOUD HAS A SILVER LINING', category: 'Sayings', difficulty: 'hard', hint: 'An optimistic outlook reminding us hope exists in gloomy times.' },
    { id: 'say_04', answer: 'MORNING COFFEE ROUTINE', category: 'Everyday Life', difficulty: 'easy', hint: 'The customary caffeinated brewing ritual before starting the day.' },
    { id: 'say_05', answer: 'CHARGING PHONE OVERNIGHT', category: 'Everyday Life', difficulty: 'easy', hint: 'Plugging in your mobile device beside the bed for a fresh 100% battery.' },
    { id: 'say_06', answer: 'SEARCHING FOR LOST KEYS', category: 'Everyday Life', difficulty: 'medium', hint: 'Frantic morning scramble checking couch cushions and jacket pockets.' },

    // --- FUNNY PHRASES ---
    { id: 'fun_01', answer: 'NOT MY CIRCUS NOT MY MONKEYS', category: 'Funny Phrases', difficulty: 'hard', hint: 'Refusing to get entangled in problems that do not belong to you.' },
    { id: 'fun_02', answer: 'HOLD YOUR HORSES', category: 'Funny Phrases', difficulty: 'easy', hint: 'Telling an over-eager companion to slow down and wait a second.' },
    { id: 'fun_03', answer: 'WHEN PIGS FLY', category: 'Funny Phrases', difficulty: 'easy', hint: 'Humorous way to declare that something has zero chance of happening.' },
    { id: 'fun_04', answer: 'TOO MANY COOKS IN THE KITCHEN', category: 'Funny Phrases', difficulty: 'hard', hint: 'Too many opinions ruining an otherwise straightforward endeavor.' }
  ];

  class WheelPuzzleDeck {
    constructor() {
      this.puzzles = WHEEL_PUZZLES_MASTER;
      this.usedIds = new Set();
      this.loadSessionStorage();
    }

    loadSessionStorage() {
      try {
        const raw = sessionStorage.getItem('dion_wheel_used_puzzles');
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            list.forEach((id) => this.usedIds.add(id));
          }
        }
      } catch (e) {}
    }

    saveSessionStorage() {
      try {
        sessionStorage.setItem('dion_wheel_used_puzzles', JSON.stringify(Array.from(this.usedIds)));
      } catch (e) {}
    }

    resetUsedSession() {
      this.usedIds.clear();
      this.saveSessionStorage();
    }

    getCategories() {
      return [...new Set(this.puzzles.map((p) => p.category))];
    }

    getRemainingCount(category = 'all', difficulty = 'all') {
      const pool = this.getFiltered(category, difficulty);
      const unused = pool.filter((p) => !this.usedIds.has(p.id));
      return unused.length;
    }

    /**
     * Get puzzles filtered by category and difficulty
     */
    getFiltered(category = 'all', difficulty = 'all') {
      if (typeof category === 'object' && category !== null) {
        difficulty = category.difficulty || 'all';
        category = category.category || 'all';
      }
      const cat = String(category || 'all').toLowerCase();
      const diff = String(difficulty || 'all').toLowerCase();
      return this.puzzles.filter((p) => {
        const catMatch = cat === 'all' || p.category.toLowerCase() === cat;
        const diffMatch = diff === 'all' || diff === 'mixed' || p.difficulty.toLowerCase() === diff;
        return catMatch && diffMatch;
      });
    }

    getRandomPuzzle(options = {}) {
      return this.pickNext(options);
    }

    /**
     * Pick a random puzzle that has NOT been used in the current session
     */
    pickNext(category = 'all', difficulty = 'all') {
      if (typeof category === 'object' && category !== null) {
        difficulty = category.difficulty || 'all';
        category = category.category || 'all';
      }
      let pool = this.getFiltered(category, difficulty);
      if (pool.length === 0) {
        pool = this.puzzles;
      }

      // Filter out used puzzles
      let unused = pool.filter((p) => !this.usedIds.has(p.id));

      // If all puzzles in pool have been used, reset pool to prevent stall
      if (unused.length === 0) {
        console.warn('All puzzles in filter exhausted. Resetting session history for category.');
        pool.forEach((p) => this.usedIds.delete(p.id));
        this.saveSessionStorage();
        unused = pool;
      }

      const picked = unused[Math.floor(Math.random() * unused.length)];
      if (picked) {
        this.usedIds.add(picked.id);
        this.saveSessionStorage();
      }

      return picked;
    }

    // Static fallback proxies
    static getCategories() {
      if (!WheelPuzzleDeck._instance) WheelPuzzleDeck._instance = new WheelPuzzleDeck();
      return WheelPuzzleDeck._instance.getCategories();
    }

    static getRemainingCount(cat, diff) {
      if (!WheelPuzzleDeck._instance) WheelPuzzleDeck._instance = new WheelPuzzleDeck();
      return WheelPuzzleDeck._instance.getRemainingCount(cat, diff);
    }

    static getRandomPuzzle(opts) {
      if (!WheelPuzzleDeck._instance) WheelPuzzleDeck._instance = new WheelPuzzleDeck();
      return WheelPuzzleDeck._instance.getRandomPuzzle(opts);
    }

    static pickNext(cat, diff) {
      if (!WheelPuzzleDeck._instance) WheelPuzzleDeck._instance = new WheelPuzzleDeck();
      return WheelPuzzleDeck._instance.pickNext(cat, diff);
    }
  }

  // Exports
  window.WHEEL_PUZZLE_CATEGORIES = WHEEL_PUZZLE_CATEGORIES;
  window.WHEEL_PUZZLES_MASTER = WHEEL_PUZZLES_MASTER;
  window.WheelPuzzleDeck = WheelPuzzleDeck;
  window.wheelPuzzleDeckInstance = new WheelPuzzleDeck();

  // Backward compatibility bridge for Jeopardy-style lookups
  const categoryMap = {};
  WHEEL_PUZZLE_CATEGORIES.forEach((cat) => {
    categoryMap[cat] = WHEEL_PUZZLES_MASTER.filter((p) => p.category === cat).map((p) => p.answer);
  });
  window.JEOPARDY_CATEGORIES = WHEEL_PUZZLE_CATEGORIES;
  window.JEOPARDY_PUZZLES = categoryMap;
})();
