/**
 * Word Reveal Mystery - Word Engine
 * Core state manager for mystery text, revealed indices, letter masks, and fuzzy guess evaluation.
 */
(function () {
  class WordEngine {
    constructor() {
      this.currentText = '';
      this.revealedIndices = new Set();
      this.currentPuzzle = null;
      this.currentHintTier = 1;
      this.solved = false;
      this.lastRevealedIndex = -1;
    }

    setPuzzle(puzzle) {
      this.currentPuzzle = puzzle;
      this.currentHintTier = 1;
      this.solved = false;
      this.lastRevealedIndex = -1;
      const text = puzzle.phrase || puzzle.word || '';
      this.setText(text);
    }

    setText(text) {
      this.currentText = String(text || '').toUpperCase();
      this.revealedIndices.clear();
      this.solved = false;
      this.lastRevealedIndex = -1;

      // Auto-reveal punctuation, spaces, apostrophes, dashes, etc.
      for (let i = 0; i < this.currentText.length; i++) {
        if (!/[A-Z0-9]/.test(this.currentText[i])) {
          this.revealedIndices.add(i);
        }
      }
    }

    getHiddenLetterIndices() {
      const hidden = [];
      for (let i = 0; i < this.currentText.length; i++) {
        if (/[A-Z0-9]/.test(this.currentText[i]) && !this.revealedIndices.has(i)) {
          hidden.push(i);
        }
      }
      return hidden;
    }

    revealIndex(idx) {
      if (idx >= 0 && idx < this.currentText.length) {
        this.revealedIndices.add(idx);
        this.lastRevealedIndex = idx;
        this.checkIfFullyRevealed();
        return true;
      }
      return false;
    }

    revealNextLetter() {
      const hidden = this.getHiddenLetterIndices();
      if (hidden.length > 0) {
        const pick = hidden[Math.floor(Math.random() * hidden.length)];
        this.revealedIndices.add(pick);
        this.lastRevealedIndex = pick;
        this.checkIfFullyRevealed();
        return pick;
      }
      return -1;
    }

    revealVowels() {
      const revealed = [];
      for (let i = 0; i < this.currentText.length; i++) {
        const char = this.currentText[i];
        if (/[AEIOU]/.test(char) && !this.revealedIndices.has(i)) {
          this.revealedIndices.add(i);
          revealed.push(i);
        }
      }
      this.checkIfFullyRevealed();
      return revealed;
    }

    revealFirstAndLast() {
      const revealed = [];
      const words = this.currentText.split(' ');
      let charOffset = 0;

      words.forEach((word) => {
        const start = charOffset;
        const end = charOffset + word.length - 1;

        if (start < this.currentText.length && /[A-Z0-9]/.test(this.currentText[start])) {
          if (!this.revealedIndices.has(start)) {
            this.revealedIndices.add(start);
            revealed.push(start);
          }
        }
        if (end < this.currentText.length && /[A-Z0-9]/.test(this.currentText[end])) {
          if (!this.revealedIndices.has(end)) {
            this.revealedIndices.add(end);
            revealed.push(end);
          }
        }
        charOffset += word.length + 1; // account for space
      });

      this.checkIfFullyRevealed();
      return revealed;
    }

    revealAll() {
      for (let i = 0; i < this.currentText.length; i++) {
        this.revealedIndices.add(i);
      }
      this.solved = true;
    }

    checkIfFullyRevealed() {
      const hidden = this.getHiddenLetterIndices();
      if (hidden.length === 0) {
        this.solved = true;
      }
      return this.solved;
    }

    isFullyRevealed() {
      return this.solved || this.getHiddenLetterIndices().length === 0;
    }

    unlockNextHint() {
      if (this.currentHintTier < 3) {
        this.currentHintTier += 1;
        return this.currentHintTier;
      }
      return this.currentHintTier;
    }

    getRevealedCount() {
      let count = 0;
      for (let i = 0; i < this.currentText.length; i++) {
        if (/[A-Z0-9]/.test(this.currentText[i]) && this.revealedIndices.has(i)) {
          count++;
        }
      }
      return count;
    }

    getTotalLetterCount() {
      let count = 0;
      for (let i = 0; i < this.currentText.length; i++) {
        if (/[A-Z0-9]/.test(this.currentText[i])) {
          count++;
        }
      }
      return count;
    }

    calculatePoints(basePoints = 600) {
      const total = this.getTotalLetterCount();
      const revealed = this.getRevealedCount();
      const hiddenFraction = total > 0 ? (total - revealed) / total : 0;
      // Base points + bonus for solving with more hidden letters
      let calculated = Math.round(basePoints * (0.4 + hiddenFraction * 0.8));
      // Deduct penalty for higher hint tiers
      if (this.currentHintTier === 2) calculated = Math.max(100, calculated - 100);
      if (this.currentHintTier === 3) calculated = Math.max(50, calculated - 200);
      return calculated;
    }

    checkGuess(guessStr) {
      if (!guessStr || !this.currentText) return { isCorrect: false, isClose: false };

      const cleanTarget = this.currentText
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');

      const cleanGuess = String(guessStr)
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');

      if (!cleanGuess) return { isCorrect: false, isClose: false };

      if (cleanGuess === cleanTarget) {
        return { isCorrect: true, isClose: true, distance: 0 };
      }

      // Fuzzy check: allow 1-2 typos on longer phrases
      const dist = this.levenshtein(cleanGuess, cleanTarget);
      const tolerance = cleanTarget.length > 14 ? 2 : (cleanTarget.length > 7 ? 1 : 0);

      if (dist <= tolerance) {
        return { isCorrect: true, isClose: true, distance: dist };
      }

      if (dist <= tolerance + 2) {
        return { isCorrect: false, isClose: true, distance: dist };
      }

      return { isCorrect: false, isClose: false, distance: dist };
    }

    levenshtein(a, b) {
      if (a === b) return 0;
      if (a.length === 0) return b.length;
      if (b.length === 0) return a.length;

      const matrix = [];
      for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
      }
      for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
      }

      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1, // substitution
              Math.min(
                matrix[i][j - 1] + 1,     // insertion
                matrix[i - 1][j] + 1      // deletion
              )
            );
          }
        }
      }
      return matrix[b.length][a.length];
    }
  }

  window.WordEngine = new WordEngine();
})();
