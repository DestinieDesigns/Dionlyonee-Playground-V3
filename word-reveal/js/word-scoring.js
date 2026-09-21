/**
 * Word Reveal Scoring
 */
(function () {
  const WordScoring = {
    calculatePoints(basePoints, revealedLetterCount, totalLetters) {
      const hiddenFraction = 1 - (revealedLetterCount / Math.max(1, totalLetters));
      return Math.round(basePoints * (0.5 + hiddenFraction * 0.5));
    }
  };

  window.WordScoring = WordScoring;
})();
