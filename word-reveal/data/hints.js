/**
 * Word Reveal Mystery - Dynamic Hint Engine Data Helper
 */
(function () {
  const HintsData = {
    getTierHint(item, tier = 1) {
      if (!item) return 'A mystery awaits!';
      if (tier === 1) return item.hintTier1 || item.hint || 'General Theme Clue.';
      if (tier === 2) return item.hintTier2 || item.hint || 'Specific Riddle Clue.';
      if (tier === 3) return item.hintTier3 || 'High-Risk Clue: Dead Giveaway!';
      return item.hintTier1 || item.hint || 'Solve the mystery phrase.';
    },

    getMysteryStats(text) {
      const clean = String(text || '').toUpperCase().trim();
      const words = clean.split(/\s+/).filter(Boolean);
      const letters = clean.replace(/[^A-Z]/g, '');
      const vowels = clean.replace(/[^AEIOU]/g, '');
      const consonants = clean.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/g, '');

      return {
        wordCount: words.length,
        letterCount: letters.length,
        vowelCount: vowels.length,
        consonantCount: consonants.length,
        firstLetter: letters.length > 0 ? letters[0] : '',
        lastLetter: letters.length > 0 ? letters[letters.length - 1] : ''
      };
    }
  };

  window.HintsData = HintsData;
})();
