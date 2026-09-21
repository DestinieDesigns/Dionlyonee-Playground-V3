/**
 * Wheel Letter Manager
 * Tracks called consonants and bought vowels ($250 cost).
 */
(function () {
  const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

  class LetterManager {
    constructor() {
      this.calledLetters = new Set();
    }

    isVowel(char) {
      return VOWELS.has(String(char).toUpperCase());
    }

    callLetter(char) {
      const c = String(char).toUpperCase();
      if (!this.calledLetters.has(c)) {
        this.calledLetters.add(c);
        return true;
      }
      return false;
    }

    hasCalled(char) {
      return this.calledLetters.has(String(char).toUpperCase());
    }

    reset() {
      this.calledLetters.clear();
    }

    getAllCalled() {
      return [...this.calledLetters];
    }
  }

  window.LetterManager = LetterManager;
})();
