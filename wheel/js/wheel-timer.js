/**
 * Wheel Timer Specialization
 */
(function () {
  const WheelTimer = {
    DEFAULT_LETTER_TIME: 15,
    DEFAULT_SOLVE_TIME: 20,

    startLetterTimer(onTick, onTimeout) {
      if (window.TimerManager) {
        window.TimerManager.start(this.DEFAULT_LETTER_TIME, onTick, onTimeout);
      }
    },

    startSolveTimer(onTick, onTimeout) {
      if (window.TimerManager) {
        window.TimerManager.start(this.DEFAULT_SOLVE_TIME, onTick, onTimeout);
      }
    },

    stop() {
      if (window.TimerManager) {
        window.TimerManager.stop();
      }
    }
  };

  window.WheelTimer = WheelTimer;
})();
