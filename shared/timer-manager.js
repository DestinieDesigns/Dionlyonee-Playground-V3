/**
 * Dionlyonee Playground - Timer Manager
 * Precision countdown timers with audio cues and callback hooks.
 */
(function () {
  class TimerManager {
    constructor() {
      this.intervalId = null;
      this.secondsRemaining = 0;
      this.totalSeconds = 0;
      this.onTickCb = null;
      this.onFinishCb = null;
    }

    start(seconds, onTick, onFinish) {
      this.stop();
      this.secondsRemaining = seconds;
      this.totalSeconds = seconds;
      this.onTickCb = onTick;
      this.onFinishCb = onFinish;

      if (this.onTickCb) this.onTickCb(this.secondsRemaining);

      this.intervalId = setInterval(() => {
        this.secondsRemaining--;
        if (window.sounds) {
          if (this.secondsRemaining <= 3 && this.secondsRemaining > 0) {
            window.sounds.play('countdown');
          } else if (this.secondsRemaining === 0) {
            window.sounds.play('wrong');
          }
        }

        if (this.onTickCb) this.onTickCb(this.secondsRemaining);

        if (this.secondsRemaining <= 0) {
          this.stop();
          if (this.onFinishCb) this.onFinishCb();
        }
      }, 1000);
    }

    stop() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }

    reset() {
      this.stop();
      this.secondsRemaining = 0;
      if (this.onTickCb) this.onTickCb(0);
    }

    getSecondsRemaining() {
      return this.secondsRemaining;
    }
  }

  window.TimerManager = new TimerManager();
})();
