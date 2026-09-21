/**
 * Trivia Scoring
 */
(function () {
  const TriviaScoring = {
    calculateScore(basePoints, timeRemaining, totalTime) {
      const speedBonus = Math.floor((timeRemaining / totalTime) * 100);
      return basePoints + speedBonus;
    }
  };

  window.TriviaScoring = TriviaScoring;
})();
