/**
 * Trivia Questions Aggregator
 */
(function () {
  const TriviaData = {
    getAll() {
      const easy = window.TriviaEasy || [];
      const med = window.TriviaMedium || [];
      const hard = window.TriviaHard || [];
      const exp = window.TriviaExpert || [];
      return [...easy, ...med, ...hard, ...exp];
    },

    getByTier(tier) {
      if (tier === 'easy') return window.TriviaEasy || [];
      if (tier === 'medium') return window.TriviaMedium || [];
      if (tier === 'hard') return window.TriviaHard || [];
      if (tier === 'expert') return window.TriviaExpert || [];
      return this.getAll();
    }
  };

  window.TriviaData = TriviaData;
})();
