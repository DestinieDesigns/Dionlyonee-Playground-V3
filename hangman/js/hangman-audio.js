/**
 * Dionlyonee Hangman Show - Sound Engine
 * Dual-layered audio: integrates with playground sounds.js & provides
 * native Web Audio synthesizers for instant zero-latency feedback.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HangmanAudio = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  class HangmanAudio {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }

    initContext() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    setMuted(mute) {
      this.muted = !!mute;
    }

    playLetterHit() {
      if (this.muted) return;
      if (window.Sounds && typeof window.Sounds.correct === 'function') {
        window.Sounds.correct();
      }
      this.synthChime([523.25, 659.25, 783.99], 0.15); // C5, E5, G5
    }

    playLetterMiss() {
      if (this.muted) return;
      if (window.Sounds && typeof window.Sounds.wrong === 'function') {
        window.Sounds.wrong();
      }
      this.synthBuzzer();
    }

    playWordSolve() {
      if (this.muted) return;
      if (window.Sounds && typeof window.Sounds.winner === 'function') {
        window.Sounds.winner();
      } else if (window.Sounds && typeof window.Sounds.applause === 'function') {
        window.Sounds.applause();
      }
      // Big triumphal arpeggio
      this.synthChime([523.25, 659.25, 783.99, 1046.50, 1318.51], 0.28);
    }

    playSlimeSplash() {
      if (this.muted) return;
      if (window.Sounds && typeof window.Sounds.wrong === 'function') {
        window.Sounds.wrong();
      }
      this.synthSplash();
    }

    playTick() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } catch (e) {}
    }

    playHurry() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
      } catch (e) {}
    }

    playClueDrop() {
      if (this.muted) return;
      this.synthChime([880, 1108.73, 1318.51], 0.18);
    }

    synthChime(freqs = [523.25, 659.25], duration = 0.2) {
      this.initContext();
      if (!this.ctx) return;
      try {
        freqs.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (idx * 0.06));
          gain.gain.setValueAtTime(0.18, this.ctx.currentTime + (idx * 0.06));
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (idx * 0.06) + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + (idx * 0.06));
          osc.stop(this.ctx.currentTime + (idx * 0.06) + duration);
        });
      } catch (e) {}
    }

    synthBuzzer() {
      this.initContext();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
      } catch (e) {}
    }

    synthSplash() {
      this.initContext();
      if (!this.ctx) return;
      try {
        // Low bubbling thud
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.55);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.55);
      } catch (e) {}
    }
  }

  return new HangmanAudio();
});
