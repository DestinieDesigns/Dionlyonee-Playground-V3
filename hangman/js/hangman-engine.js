/**
 * Dionlyonee Hangman Show - Core Game Engine
 * Manages game state, strike counts, letter evaluation, fuzzy word solving,
 * score calculation, and custom word injections.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HangmanEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  class HangmanEngine {
    constructor(options = {}) {
      this.maxStrikes = options.maxStrikes || 6;
      this.theme = options.theme || 'slime'; // 'slime' | 'classic' | 'pirate'
      this.reset();
    }

    reset() {
      this.currentWordObj = null;
      this.rawWord = '';
      this.cleanWord = '';
      this.category = '';
      this.difficulty = 'EASY';
      this.hint1 = '';
      this.hint2 = '';
      this.hint3 = '';
      this.funFact = '';
      
      this.guessedLetters = [];
      this.correctLetters = [];
      this.wrongLetters = [];
      this.strikes = 0;
      this.status = 'IDLE'; // 'IDLE' | 'PLAYING' | 'WON' | 'LOST'
      
      this.hintTier = 0; // 0: none, 1: hint1, 2: hint2, 3: hint3
      this.solveHistory = [];
      this.solver = null;
      this.roundPoints = 0;
      this.startTime = 0;
      this.finishTime = 0;
    }

    setWord(wordObj) {
      if (!wordObj) return;
      this.reset();
      this.currentWordObj = wordObj;
      this.rawWord = String(wordObj.word || '').toUpperCase().trim();
      this.cleanWord = this.rawWord.replace(/[^A-Z]/g, '');
      this.category = wordObj.category || 'GENERAL';
      this.difficulty = wordObj.difficulty || 'EASY';
      this.hint1 = wordObj.hint1 || wordObj.hint || '';
      this.hint2 = wordObj.hint2 || '';
      this.hint3 = wordObj.hint3 || '';
      this.funFact = wordObj.funFact || '';
      this.status = 'PLAYING';
      this.startTime = Date.now();
      return this.getState();
    }

    guessLetter(letter, guesser = 'Host') {
      if (this.status !== 'PLAYING') {
        return { valid: false, reason: 'Game is not in PLAYING state', state: this.getState() };
      }

      const char = String(letter || '').toUpperCase().trim();
      if (!char || char.length !== 1 || !/[A-Z]/.test(char)) {
        return { valid: false, reason: 'Invalid letter character', state: this.getState() };
      }

      if (this.guessedLetters.includes(char)) {
        return {
          valid: true,
          alreadyGuessed: true,
          letter: char,
          isCorrect: this.cleanWord.includes(char),
          state: this.getState()
        };
      }

      this.guessedLetters.push(char);

      const occurrences = (this.rawWord.match(new RegExp(char, 'g')) || []).length;
      const isCorrect = occurrences > 0;

      if (isCorrect) {
        this.correctLetters.push(char);
        // Check if word is completely solved
        const allGuessed = this.cleanWord.split('').every(ch => this.guessedLetters.includes(ch));
        if (allGuessed) {
          this.status = 'WON';
          this.solver = guesser;
          this.finishTime = Date.now();
          this.roundPoints = this.calculateSolvePoints();
        }
      } else {
        this.wrongLetters.push(char);
        this.strikes = Math.min(this.maxStrikes, this.strikes + 1);
        if (this.strikes >= this.maxStrikes) {
          this.status = 'LOST';
          this.finishTime = Date.now();
        }
      }

      return {
        valid: true,
        alreadyGuessed: false,
        letter: char,
        isCorrect,
        occurrences,
        strikes: this.strikes,
        maxStrikes: this.maxStrikes,
        status: this.status,
        guesser,
        state: this.getState()
      };
    }

    solveWord(guessPhrase, solver = 'Host') {
      if (this.status !== 'PLAYING') {
        return { isCorrect: false, reason: 'Game not in play' };
      }

      const cleanGuess = String(guessPhrase || '').toUpperCase().replace(/[^A-Z]/g, '');
      const target = this.cleanWord;

      if (!cleanGuess) return { isCorrect: false, reason: 'Empty guess' };

      // Exact match
      let isMatch = cleanGuess === target;

      // Fuzzy check if length >= 6 and distance <= 1 (allows minor typo)
      if (!isMatch && target.length >= 6) {
        const dist = this.levenshtein(cleanGuess, target);
        if (dist <= 1) isMatch = true;
      }

      if (isMatch) {
        // Mark all letters in target as guessed
        target.split('').forEach(ch => {
          if (!this.guessedLetters.includes(ch)) {
            this.guessedLetters.push(ch);
          }
          if (!this.correctLetters.includes(ch)) {
            this.correctLetters.push(ch);
          }
        });
        this.status = 'WON';
        this.solver = solver;
        this.finishTime = Date.now();
        this.roundPoints = this.calculateSolvePoints(true);
        return { isCorrect: true, solver, points: this.roundPoints, state: this.getState() };
      } else {
        // Wrong solve attempt incurs 1 strike
        this.strikes = Math.min(this.maxStrikes, this.strikes + 1);
        if (this.strikes >= this.maxStrikes) {
          this.status = 'LOST';
          this.finishTime = Date.now();
        }
        return { isCorrect: false, strikes: this.strikes, status: this.status, state: this.getState() };
      }
    }

    revealVowels() {
      if (this.status !== 'PLAYING') return [];
      const vowels = ['A', 'E', 'I', 'O', 'U'];
      const revealed = [];
      vowels.forEach(v => {
        if (this.rawWord.includes(v) && !this.guessedLetters.includes(v)) {
          this.guessedLetters.push(v);
          this.correctLetters.push(v);
          revealed.push(v);
        }
      });
      // Check win
      if (this.cleanWord.split('').every(ch => this.guessedLetters.includes(ch))) {
        this.status = 'WON';
        this.finishTime = Date.now();
      }
      return revealed;
    }

    revealFreeLetter() {
      if (this.status !== 'PLAYING') return null;
      const unguessedInWord = this.cleanWord.split('').filter(ch => !this.guessedLetters.includes(ch));
      if (unguessedInWord.length === 0) return null;

      const pick = unguessedInWord[Math.floor(Math.random() * unguessedInWord.length)];
      this.guessedLetters.push(pick);
      this.correctLetters.push(pick);

      if (this.cleanWord.split('').every(ch => this.guessedLetters.includes(ch))) {
        this.status = 'WON';
        this.finishTime = Date.now();
      }
      return pick;
    }

    advanceHintTier() {
      if (this.hintTier < 3) {
        this.hintTier++;
      }
      return this.hintTier;
    }

    calculateSolvePoints(isDirectSolve = false) {
      let base = 500;
      if (this.difficulty === 'MEDIUM') base = 750;
      if (this.difficulty === 'HARD') base = 1000;

      // Strike penalty
      const strikePenalty = this.strikes * 50;
      // Bonus if solved with fewer strikes
      const perfectionBonus = this.strikes === 0 ? 300 : 0;
      const directSolveBonus = isDirectSolve ? 250 : 0;

      return Math.max(100, base - strikePenalty + perfectionBonus + directSolveBonus);
    }

    getWordBlanks() {
      if (!this.rawWord) return [];
      const words = this.rawWord.split(' ');
      return words.map(w => {
        return w.split('').map(ch => {
          const isLetter = /[A-Z]/.test(ch);
          const isRevealed = !isLetter || this.guessedLetters.includes(ch) || this.status === 'WON' || this.status === 'LOST';
          return {
            char: ch,
            isLetter,
            isRevealed,
            isMissed: isLetter && !this.guessedLetters.includes(ch) && this.status === 'LOST'
          };
        });
      });
    }

    getRemainingCount() {
      if (!this.cleanWord) return 0;
      return this.cleanWord.split('').filter(ch => !this.guessedLetters.includes(ch)).length;
    }

    getState() {
      return {
        word: this.rawWord,
        cleanWord: this.cleanWord,
        category: this.category,
        difficulty: this.difficulty,
        hint1: this.hint1,
        hint2: this.hint2,
        hint3: this.hint3,
        funFact: this.funFact,
        guessedLetters: [...this.guessedLetters],
        correctLetters: [...this.correctLetters],
        wrongLetters: [...this.wrongLetters],
        strikes: this.strikes,
        maxStrikes: this.maxStrikes,
        status: this.status,
        hintTier: this.hintTier,
        solver: this.solver,
        roundPoints: this.roundPoints,
        remainingCount: this.getRemainingCount(),
        blanks: this.getWordBlanks(),
        theme: this.theme
      };
    }

    levenshtein(a, b) {
      const matrix = [];
      for (let i = 0; i <= b.length; i++) matrix[i] = [i];
      for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
            );
          }
        }
      }
      return matrix[b.length][a.length];
    }
  }

  return HangmanEngine;
});
