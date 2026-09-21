/**
 * Dionlyonee Playground - Universal Game Transition Engine
 * Lightweight, GPU-accelerated phase transitions between:
 * WAITING -> PREPARE -> ACTIVE GAMEPLAY -> RESULT -> COOLDOWN -> WAITING
 * Optimized for TikTok Studio, OBS, and Mobile (Zero heavy blur, zero DOM destruction)
 */

(function () {
  'use strict';

  const ROTATING_MESSAGES = [
    '❤️ SUPPORT THE LIVE — Tap the heart and share!',
    '⭐ JOIN THE CLUB — Follow the stream for daily games!',
    '👆 TAP UP THE LIVE — Double tap your screen for likes!',
    '💬 COMMENT A QUICK HELLO — Say hi in the chat to play along!',
    '🎮 DIONLYONEE PLAYGROUND — The #1 interactive live game show!',
    '🔴 LIVE ON STREAM — Puzzles, cash prizes, and big vibes!'
  ];

  class UniversalTransitionEngine {
    constructor() {
      this.currentPhase = 'waiting';
      this.isTransitioning = false;
      this.messageIndex = 0;
      this.messageTimer = null;
    }

    /**
     * Set up wait screen and game screen containers on a live stage
     */
    initStage(options = {}) {
      const stageElem = options.stage || document.getElementById('live-stage');
      const waitScreen = options.waitScreen || document.getElementById('wait-screen');
      const gameScreen = options.gameScreen || document.getElementById('game-screen');

      this.stageElem = stageElem;
      this.waitScreen = waitScreen;
      this.gameScreen = gameScreen;

      this.startMessageRotation(options.rotatingMessageElem || document.getElementById('wait-rotating-message'));

      // Initial state
      if (options.initialPhase) {
        this.applyPhase(options.initialPhase, false);
      }
    }

    /**
     * Start rotating engagement messages on the wait screen
     */
    startMessageRotation(elem) {
      if (!elem) elem = document.getElementById('wait-rotating-message');
      if (!elem) return;

      if (this.messageTimer) clearInterval(this.messageTimer);

      elem.textContent = ROTATING_MESSAGES[0];
      this.messageTimer = setInterval(() => {
        this.messageIndex = (this.messageIndex + 1) % ROTATING_MESSAGES.length;
        elem.style.opacity = '0';
        elem.style.transform = 'translateY(4px)';
        setTimeout(() => {
          elem.textContent = ROTATING_MESSAGES[this.messageIndex];
          elem.style.opacity = '1';
          elem.style.transform = 'translateY(0)';
        }, 300);
      }, 4500);
    }

    /**
     * Determine if a phase represents wait/cooldown state
     */
    isWaitPhase(phase) {
      return phase === 'waiting' || phase === 'cooldown' || phase === 'standby';
    }

    /**
     * Transition between phases with smooth TV game show animations
     */
    transitionTo(toPhase, onComplete) {
      const wait = this.waitScreen;
      const game = this.gameScreen;
      if (!wait || !game) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      const isTargetWait = this.isWaitPhase(toPhase);
      const isCurrentWait = this.isWaitPhase(this.currentPhase);

      // If no change in visual category (both wait or both active), just apply classes
      if (isTargetWait === isCurrentWait) {
        this.applyPhase(toPhase, false);
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      this.isTransitioning = true;
      this.currentPhase = toPhase;

      if (isTargetWait) {
        // Active Game -> Wait Screen
        game.classList.add('transition-out');
        game.classList.remove('transition-in');

        setTimeout(() => {
          game.classList.remove('active', 'transition-out');
          wait.classList.add('active', 'transition-in');

          // Trigger reflow for smooth transition
          void wait.offsetWidth;
          wait.classList.remove('transition-in');
          this.isTransitioning = false;
          if (typeof onComplete === 'function') onComplete();
        }, 320);
      } else {
        // Wait Screen -> Active Game
        wait.classList.add('transition-out');
        wait.classList.remove('transition-in');

        setTimeout(() => {
          wait.classList.remove('active', 'transition-out');
          game.classList.add('active', 'transition-in');

          // Trigger reflow for smooth transition
          void game.offsetWidth;
          game.classList.remove('transition-in');
          this.isTransitioning = false;
          if (typeof onComplete === 'function') onComplete();
        }, 320);
      }
    }

    /**
     * Instantly apply phase without transition (e.g. on initial page load)
     */
    applyPhase(phase, animate = true) {
      if (animate) {
        this.transitionTo(phase);
        return;
      }

      this.currentPhase = phase;
      const isWait = this.isWaitPhase(phase);
      const wait = this.waitScreen;
      const game = this.gameScreen;

      if (wait && game) {
        if (isWait) {
          wait.classList.add('active');
          wait.classList.remove('transition-out', 'transition-in');
          game.classList.remove('active', 'transition-out', 'transition-in');
        } else {
          game.classList.add('active');
          game.classList.remove('transition-out', 'transition-in');
          wait.classList.remove('active', 'transition-out', 'transition-in');
        }
      }
    }
  }

  // Global instance and helper function
  window.GameTransitions = new UniversalTransitionEngine();
  window.transitionGamePhase = function (from, to, onDone) {
    window.GameTransitions.transitionTo(to, onDone);
  };
})();
