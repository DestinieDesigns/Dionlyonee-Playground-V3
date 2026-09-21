/**
 * Data Helper: Random Pickers
 */
(function () {
  const RandomHelper = {
    pick(arr) {
      if (!Array.isArray(arr) || arr.length === 0) return null;
      return arr[Math.floor(Math.random() * arr.length)];
    },

    pickN(arr, n = 1) {
      if (!Array.isArray(arr)) return [];
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, n);
    }
  };

  window.RandomHelper = RandomHelper;
})();
