/**
 * Data Helper: Difficulty Tiers & Points Multipliers
 */
(function () {
  const DifficultyHelper = {
    TIERS: {
      EASY: { id: 'easy', label: 'EASY', multiplier: 1, timerSec: 25, points: 200 },
      MEDIUM: { id: 'medium', label: 'MEDIUM', multiplier: 1.5, timerSec: 20, points: 400 },
      HARD: { id: 'hard', label: 'HARD', multiplier: 2, timerSec: 15, points: 600 },
      EXPERT: { id: 'expert', label: 'EXPERT', multiplier: 3, timerSec: 12, points: 1000 }
    },

    getTier(name) {
      const key = String(name || 'medium').toUpperCase();
      return this.TIERS[key] || this.TIERS.MEDIUM;
    }
  };

  window.DifficultyHelper = DifficultyHelper;
})();
