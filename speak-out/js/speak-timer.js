/**
 * DIONLYONEE SPEAK OUT! - Synchronized Precision Timer
 * Prevents timer drift using server/timestamp synchronization.
 */
(function () {
  class SpeakTimer {
    constructor() {
      this.duration = 20;
      this.remaining = 20;
      this.running = false;
      this.startedAt = 0;
      this.pausedAt = 0;
      this.timerInterval = null;
      this.callbacks = [];
      this.lastTickPlayed = null;
      this.hasPlayedTimeUp = false;
    }

    onTick(cb) {
      if (typeof cb === 'function') this.callbacks.push(cb);
      return () => {
        const idx = this.callbacks.indexOf(cb);
        if (idx !== -1) this.callbacks.splice(idx, 1);
      };
    }

    start(seconds = null) {
      if (seconds !== null) {
        this.duration = Number(seconds);
        this.remaining = Number(seconds);
      }
      this.running = true;
      this.startedAt = Date.now() - ((this.duration - this.remaining) * 1000);
      this.lastTickPlayed = null;
      this.hasPlayedTimeUp = false;
      this.startInternalLoop();
      return this.getState();
    }

    pause() {
      if (!this.running) return this.getState();
      this.calculateCurrentRemaining();
      this.running = false;
      this.pausedAt = Date.now();
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.notify(this.remaining);
      return this.getState();
    }

    resume() {
      if (this.running || this.remaining <= 0) return this.getState();
      this.running = true;
      this.startedAt = Date.now() - ((this.duration - this.remaining) * 1000);
      this.startInternalLoop();
      return this.getState();
    }

    reset(seconds = null) {
      this.running = false;
      if (seconds !== null) {
        this.duration = Number(seconds);
      }
      this.remaining = this.duration;
      this.startedAt = 0;
      this.pausedAt = 0;
      this.lastTickPlayed = null;
      this.hasPlayedTimeUp = false;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.notify(this.remaining);
      return this.getState();
    }

    addSeconds(secs = 5) {
      this.duration += secs;
      this.remaining += secs;
      if (this.running) {
        this.startedAt += secs * 1000;
      }
      this.notify(this.remaining);
      return this.getState();
    }

    calculateCurrentRemaining() {
      if (!this.running) return this.remaining;
      const elapsedMs = Date.now() - this.startedAt;
      const rem = Math.max(0, this.duration - (elapsedMs / 1000));
      this.remaining = Math.round(rem * 10) / 10;
      return this.remaining;
    }

    startInternalLoop() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        const rem = this.calculateCurrentRemaining();
        this.checkSoundTriggers(rem);
        this.notify(rem);

        if (rem <= 0) {
          this.running = false;
          clearInterval(this.timerInterval);
          this.timerInterval = null;
          if (!this.hasPlayedTimeUp) {
            this.hasPlayedTimeUp = true;
            this.playAudio('timeup');
          }
        }
      }, 100);
    }

    checkSoundTriggers(rem) {
      const ceil = Math.ceil(rem);
      if (ceil <= 3 && ceil >= 1 && this.lastTickPlayed !== ceil && this.running) {
        this.lastTickPlayed = ceil;
        this.playAudio('tick');
      }
    }

    playAudio(soundName) {
      if (window.SoundManager && typeof window.SoundManager.playSound === 'function') {
        window.SoundManager.playSound(soundName);
      } else if (window.FirebaseRoom && typeof window.FirebaseRoom.broadcastSound === 'function') {
        window.FirebaseRoom.broadcastSound(soundName);
      }
    }

    notify(rem) {
      const formatted = Math.max(0, Math.ceil(rem)).toString();
      const percent = this.duration > 0 ? Math.max(0, Math.min(100, (rem / this.duration) * 100)) : 0;
      this.callbacks.forEach(cb => {
        try { cb(rem, formatted, percent, this.running); } catch (e) {}
      });
    }

    syncFromState(timerState) {
      if (!timerState) return;
      const oldRunning = this.running;
      this.duration = typeof timerState.duration === 'number' ? timerState.duration : this.duration;
      this.running = Boolean(timerState.running);
      this.startedAt = typeof timerState.startedAt === 'number' ? timerState.startedAt : this.startedAt;
      this.remaining = typeof timerState.remaining === 'number' ? timerState.remaining : this.remaining;

      if (this.running) {
        this.startInternalLoop();
      } else {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
        this.notify(this.remaining);
      }
    }

    getState() {
      this.calculateCurrentRemaining();
      return {
        duration: this.duration,
        remaining: this.remaining,
        running: this.running,
        startedAt: this.startedAt,
        pausedAt: this.pausedAt,
        timestamp: Date.now()
      };
    }
  }

  window.SpeakTimer = SpeakTimer;
})();
