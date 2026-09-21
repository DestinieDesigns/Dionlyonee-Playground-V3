/**
 * DIONLYONEE SPEAK OUT! - Randomizer Engine
 */
(function () {
  const SpeakRandomizer = {
    modes: [
      'tongue-twister',
      'rapid-fire',
      'forbidden-words',
      'voice-challenge',
      'keep-talking',
      'finish-the-phrase'
    ],

    difficulties: ['easy', 'medium', 'hard', 'extreme'],

    getRandomMode(excludeCurrent = null) {
      const candidates = excludeCurrent ? this.modes.filter(m => m !== excludeCurrent) : this.modes;
      const idx = Math.floor(Math.random() * candidates.length);
      return candidates[idx] || 'tongue-twister';
    },

    getRandomDifficulty() {
      // Weighted distribution: 40% easy, 40% medium, 15% hard, 5% extreme
      const r = Math.random();
      if (r < 0.40) return 'easy';
      if (r < 0.80) return 'medium';
      if (r < 0.95) return 'hard';
      return 'extreme';
    },

    shuffleArray(arr) {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
  };

  window.SpeakRandomizer = SpeakRandomizer;
})();
