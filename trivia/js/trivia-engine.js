/**
 * Trivia Engine Core
 */
(function () {
  class TriviaEngine {
    constructor() {
      this.currentQuestion = null;
      this.isLocked = false;
      this.activeBuzzer = null;
    }

    loadQuestion(q) {
      this.currentQuestion = q;
      this.isLocked = false;
      this.activeBuzzer = null;
      return this.currentQuestion;
    }

    lockBuzzer(player) {
      if (this.isLocked) return false;
      this.isLocked = true;
      this.activeBuzzer = player;
      return true;
    }

    checkAnswer(option) {
      if (!this.currentQuestion) return false;
      return option === this.currentQuestion.answer;
    }
  }

  window.TriviaEngine = new TriviaEngine();
})();
