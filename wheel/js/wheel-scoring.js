/**
 * Wheel Scoring Logic
 */
(function () {
  const WheelScoring = {
    VOWEL_COST: 250,

    calculateLetterScore(wedgeValue, occurrenceCount) {
      if (!occurrenceCount || occurrenceCount <= 0) return 0;
      return Number(wedgeValue || 0) * occurrenceCount;
    },

    applyBankrupt(contestant) {
      if (contestant) contestant.roundScore = 0;
    }
  };

  window.WheelScoring = WheelScoring;
})();
