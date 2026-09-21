/**
 * Dionlyonee Playground - Random Manager
 * Utilities for shuffling, weighted selection, and seedable randomness.
 */
(function () {
  const RandomManager = {
    shuffle(array) {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    pickOne(array) {
      if (!array || array.length === 0) return null;
      return array[Math.floor(Math.random() * array.length)];
    },

    range(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  };

  window.RandomManager = RandomManager;
})();
