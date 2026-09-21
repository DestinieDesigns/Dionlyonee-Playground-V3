/**
 * Trivia Randomizer
 */
(function () {
  const TriviaRandomizer = {
    pickQuestion(tier = 'all', category = 'all') {
      let pool = [];
      if (window.TriviaHelpers) {
        if (category && category !== 'all') {
          pool = window.TriviaHelpers.getByCategoryAndTier(category, tier);
        } else {
          pool = window.TriviaHelpers.getByTier(tier);
        }
      } else if (window.TriviaData) {
        pool = tier === 'all' ? window.TriviaData.getAll() : window.TriviaData.getByTier(tier);
        if (category && category !== 'all') {
          pool = pool.filter(q => q.category === category);
        }
      }

      if (!pool || pool.length === 0) {
        pool = window.TriviaHelpers ? window.TriviaHelpers.getAll() : (window.TriviaData ? window.TriviaData.getAll() : []);
      }

      if (window.UsedContentManager && pool.length > 0) {
        const unused = window.UsedContentManager.filterUnused(pool);
        const source = unused.length > 0 ? unused : pool;
        const q = source[Math.floor(Math.random() * source.length)];
        if (q) window.UsedContentManager.markUsed(q.id);
        return q;
      }
      return pool[Math.floor(Math.random() * pool.length)];
    }
  };

  window.TriviaRandomizer = TriviaRandomizer;
})();
