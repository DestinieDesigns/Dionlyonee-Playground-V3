/**
 * Jeopardy Clue Timer
 */
(function () {
  const JeopardyTimer = {
    DEFAULT_CLUE_TIME: 15,

    start(onTick, onTimeout) {
      if (window.TimerManager) {
        window.TimerManager.start(this.DEFAULT_CLUE_TIME, onTick, onTimeout);
      }
    },

    stop() {
      if (window.TimerManager) {
        window.TimerManager.stop();
      }
    }
  };

  window.JeopardyTimer = JeopardyTimer;
})();
