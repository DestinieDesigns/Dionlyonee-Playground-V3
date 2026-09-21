/**
 * Trivia Loader
 * Loads all category and question scripts dynamically across the trivia folder structure.
 */
(function () {
  const dataFiles = [
    // Core Helpers & Category definitions
    'trivia-helpers.js',
    'trivia-categories.js',
    'education/education-categories.js',
    'easy.js',

    // General Knowledge
    'general/general-knowledge.js',
    'general/animals.js',
    'general/food.js',
    'general/geography.js',
    'general/history.js',
    'general/random-facts.js',

    // Entertainment
    'entertainment/movies.js',
    'entertainment/television.js',
    'entertainment/music.js',
    'entertainment/anime.js',
    'entertainment/video-games.js',
    'entertainment/superheroes.js',
    'entertainment/pop-culture.js',

    // Culture
    'culture/jamaican-culture.js',
    'culture/jamaican-phrases.js',
    'culture/world-cultures.js',
    'culture/traditions.js',

    // Education - Math
    'education/math/basic-math.js',
    'education/math/addition.js',
    'education/math/subtraction.js',
    'education/math/multiplication.js',
    'education/math/division.js',
    'education/math/fractions.js',
    'education/math/decimals.js',
    'education/math/percentages.js',
    'education/math/pemdas.js',
    'education/math/algebra.js',
    'education/math/geometry.js',
    'education/math/word-problems.js',

    // Education - English
    'education/english/grammar.js',
    'education/english/spelling.js',
    'education/english/vocabulary.js',
    'education/english/reading-comprehension.js',
    'education/english/punctuation.js',
    'education/english/parts-of-speech.js',
    'education/english/synonyms.js',
    'education/english/antonyms.js',
    'education/english/writing.js',

    // Education - Science
    'education/science/general-science.js',
    'education/science/earth-science.js',
    'education/science/biology.js',
    'education/science/chemistry.js',
    'education/science/physics.js',
    'education/science/astronomy.js',
    'education/science/weather.js',
    'education/science/environment.js',
    'education/science/animals-science.js',

    // Education - Social Studies
    'education/social-studies/history.js',
    'education/social-studies/geography.js',
    'education/social-studies/government.js',
    'education/social-studies/civics.js',
    'education/social-studies/economics.js',
    'education/social-studies/world-history.js',
    'education/social-studies/us-history.js',
    'education/social-studies/cultures.js'
  ];

  // Derive base path of data/ folder
  function getBaseDataPath() {
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src || '';
      if (src.indexOf('trivia-loader.js') !== -1) {
        return src.substring(0, src.lastIndexOf('trivia-loader.js'));
      }
    }
    // Fallback relative resolution
    if (window.location.pathname.indexOf('/host') !== -1 ||
        window.location.pathname.indexOf('/live') !== -1 ||
        window.location.pathname.indexOf('/cohost') !== -1 ||
        window.location.pathname.indexOf('/waiting') !== -1) {
      return '../data/';
    }
    return 'data/';
  }

  const loadedFiles = new Set();

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      if (loadedFiles.has(url)) {
        return resolve();
      }
      const s = document.createElement('script');
      s.src = url;
      s.async = false;
      s.onload = () => {
        loadedFiles.add(url);
        resolve();
      };
      s.onerror = (err) => {
        console.warn(`[TriviaLoader] Notice: ${url} optional or not loaded:`, err);
        resolve(); // resolve so other scripts continue
      };
      document.head.appendChild(s);
    });
  }

  async function loadAll(customBasePath) {
    const base = customBasePath || getBaseDataPath();
    for (const file of dataFiles) {
      // Don't re-include trivia-loader itself
      if (file !== 'trivia-loader.js') {
        await loadScript(base + file);
      }
    }

    // Bridge window.TriviaData to TriviaHelpers for seamless compatibility
    syncLegacyTriviaData();

    // Trigger ready event
    window.dispatchEvent(new CustomEvent('trivia-data-loaded', {
      detail: {
        count: window.TriviaHelpers ? window.TriviaHelpers.getAll().length : (window.TriviaDataStore ? window.TriviaDataStore.length : 0)
      }
    }));

    return window.TriviaHelpers ? window.TriviaHelpers.getAll() : [];
  }

  function syncLegacyTriviaData() {
    if (!window.TriviaData) {
      window.TriviaData = {};
    }
    window.TriviaData.getAll = function () {
      if (window.TriviaHelpers) {
        return window.TriviaHelpers.getAll();
      }
      return window.TriviaDataStore || [];
    };
    window.TriviaData.getByTier = function (tier) {
      if (window.TriviaHelpers) {
        return window.TriviaHelpers.getByTier(tier);
      }
      const all = window.TriviaDataStore || [];
      if (!tier || tier === 'all') return all;
      return all.filter(q => (q.tier || q.difficulty || '').toLowerCase() === tier.toLowerCase());
    };
  }

  window.TriviaLoader = {
    dataFiles,
    loadAll,
    getBaseDataPath,
    syncLegacyTriviaData
  };

  // Auto-run on inclusion
  loadAll();
})();
