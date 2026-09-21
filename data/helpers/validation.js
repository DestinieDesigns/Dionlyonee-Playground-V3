/**
 * Data Helper: Validation & Normalization
 */
(function () {
  const ValidationHelper = {
    normalizeAnswer(str) {
      if (!str) return '';
      return String(str)
        .trim()
        .toLowerCase()
        .replace(/^(the|a|an)\s+/i, '')
        .replace(/[^a-z0-9]/gi, '');
    },

    isMatch(input, expected) {
      const a = this.normalizeAnswer(input);
      const b = this.normalizeAnswer(expected);
      return a === b;
    }
  };

  window.ValidationHelper = ValidationHelper;
})();
