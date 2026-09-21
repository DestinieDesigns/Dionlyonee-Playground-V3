/**
 * Dionlyonee Hangman Show - Hint Engine Helper
 * Tiered hint system: Tier 1 (Warm Clue), Tier 2 (Direct Hint), Tier 3 (Free Vowel/Letter)
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HangmanHints = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  return {
    formatHintTier: function (wordObj, tier = 1) {
      if (!wordObj) return '';
      if (tier === 1) {
        return wordObj.hint1 || wordObj.hint || 'No primary clue available';
      } else if (tier === 2) {
        return wordObj.hint2 || wordObj.hint1 || wordObj.hint || 'No secondary clue';
      } else {
        return wordObj.hint3 || wordObj.hint2 || 'Bonus Clue Revealed!';
      }
    },

    getLetterHints: function (word) {
      if (!word) return { vowels: [], consonants: [], length: 0 };
      const clean = word.toUpperCase().replace(/[^A-Z]/g, '');
      const vowels = Array.from(new Set(clean.split('').filter(ch => 'AEIOU'.includes(ch))));
      const consonants = Array.from(new Set(clean.split('').filter(ch => !'AEIOU'.includes(ch))));
      return {
        vowels,
        consonants,
        length: clean.length,
        wordCount: word.trim().split(/\s+/).length
      };
    }
  };
});
