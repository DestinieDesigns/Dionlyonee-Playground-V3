/**
 * Trivia Game Coordinator
 */
(function () {
  class TriviaGame {
    constructor() {
      this.currentQ = null;
      this.activePlayer = null;
    }

    startQuestion(q) {
      this.currentQ = q;
      if (window.FirebaseRoom) {
        window.FirebaseRoom.broadcastState({
          gameType: 'trivia',
          phase: 'question',
          question: q,
          timestamp: Date.now()
        }, 'reveal');
      }
    }

    revealAnswer() {
      if (!this.currentQ) return;
      if (window.FirebaseRoom) {
        window.FirebaseRoom.broadcastState({
          gameType: 'trivia',
          phase: 'answer',
          question: this.currentQ,
          answer: this.currentQ.answer,
          timestamp: Date.now()
        }, 'correct');
      }
    }
  }

  window.TriviaGame = new TriviaGame();
})();
