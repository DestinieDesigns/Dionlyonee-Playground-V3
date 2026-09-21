/**
 * Trivia Timer
 */
(function () {
  const TriviaTimer = {
    start(seconds, onTick, onFinish) {
      if (window.TimerManager) {
        window.TimerManager.start(seconds, onTick, onFinish);
      }
    },
    stop() {
      if (window.TimerManager) {
        window.TimerManager.stop();
      }
    }
  };

  window.TriviaTimer = TriviaTimer;
})();
