/**
 * Word Reveal Mystery - Timer & Autopilot Engine
 */
(function () {
  class WordTimer {
    constructor() {
      this.timerInterval = null;
      this.secondsRemaining = 0;
      this.totalSeconds = 20;

      // Autopilot Letter Reveal
      this.autoInterval = null;
      this.autoSeconds = 5;
      this.autoRemaining = 5;
      this.isAutopilotActive = false;

      // Intermission
      this.intermissionInterval = null;
    }

    startRoundTimer(duration = 20, onTick, onTimeout) {
      this.stopRoundTimer();
      this.totalSeconds = duration;
      this.secondsRemaining = duration;

      if (typeof onTick === 'function') onTick(this.secondsRemaining, this.totalSeconds);

      this.timerInterval = setInterval(() => {
        this.secondsRemaining--;
        if (typeof onTick === 'function') onTick(this.secondsRemaining, this.totalSeconds);

        if (this.secondsRemaining <= 0) {
          this.stopRoundTimer();
          if (typeof onTimeout === 'function') onTimeout();
        }
      }, 1000);
    }

    stopRoundTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    startAutopilot(paceSeconds = 5, onAutoTick, onTriggerLetter) {
      this.stopAutopilot();
      this.isAutopilotActive = true;
      this.autoSeconds = paceSeconds;
      this.autoRemaining = paceSeconds;

      if (typeof onAutoTick === 'function') {
        onAutoTick(this.autoRemaining, this.autoSeconds);
      }

      this.autoInterval = setInterval(() => {
        this.autoRemaining--;
        if (typeof onAutoTick === 'function') {
          onAutoTick(this.autoRemaining, this.autoSeconds);
        }

        if (this.autoRemaining <= 0) {
          this.autoRemaining = this.autoSeconds;
          if (typeof onTriggerLetter === 'function') {
            onTriggerLetter();
          }
        }
      }, 1000);
    }

    stopAutopilot() {
      this.isAutopilotActive = false;
      if (this.autoInterval) {
        clearInterval(this.autoInterval);
        this.autoInterval = null;
      }
    }

    startIntermission(delaySeconds = 5, onTick, onComplete) {
      this.stopIntermission();
      let remaining = delaySeconds;

      if (typeof onTick === 'function') onTick(remaining);

      this.intermissionInterval = setInterval(() => {
        remaining--;
        if (typeof onTick === 'function') onTick(remaining);

        if (remaining <= 0) {
          this.stopIntermission();
          if (typeof onComplete === 'function') onComplete();
        }
      }, 1000);
    }

    stopIntermission() {
      if (this.intermissionInterval) {
        clearInterval(this.intermissionInterval);
        this.intermissionInterval = null;
      }
    }

    stopAll() {
      this.stopRoundTimer();
      this.stopAutopilot();
      this.stopIntermission();
    }
  }

  window.WordTimer = new WordTimer();
})();
