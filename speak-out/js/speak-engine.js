/**
 * DIONLYONEE SPEAK OUT! - Master Core Engine
 * Coordinates Room Networking, Timer, Streak, Scoring & Real-time State.
 */
(function () {
  class SpeakEngine {
    constructor(options = {}) {
      this.role = options.role || 'host'; // 'host' | 'cohost' | 'live' | 'waiting'
      this.timer = new window.SpeakTimer();
      this.streak = new window.StreakManager();
      this.scoring = new window.SpeakScoring();
      this.challenges = new window.ChallengeManager();

      this.activeMode = 'tongue-twister';
      this.selectedDifficulty = 'all';
      this.showAnswer = false;
      this.showHint = false;
      this.status = 'waiting'; // 'waiting' | 'playing' | 'revealed'
      this.lastAction = { type: 'standby', text: 'Standby - Waiting for Host to start', timestamp: Date.now() };
      this.roomCode = null;

      this.stateListeners = [];
      this.initNetworking();
      this.bindTimerListeners();
    }

    onStateUpdate(cb) {
      if (typeof cb === 'function') this.stateListeners.push(cb);
    }

    notifyLocalListeners() {
      const state = this.getFullState();
      this.stateListeners.forEach(cb => {
        try { cb(state); } catch (e) {}
      });
    }

    bindTimerListeners() {
      // Auto-broadcast timer state change when timer runs out on host
      this.timer.onTick((rem, formatted, percent, running) => {
        if (this.role === 'host' && rem <= 0 && this.status === 'playing') {
          // Timer finished
          this.status = 'revealed';
          this.lastAction = { type: 'timeup', text: "⏰ TIME'S UP!", timestamp: Date.now() };
          this.broadcast();
        }
      });
    }

    initNetworking() {
      // Resolve room code from URL or room-manager
      const urlParams = new URLSearchParams(window.location.search);
      const urlRoom = urlParams.get('room');
      if (urlRoom && urlRoom.trim()) {
        this.roomCode = urlRoom.trim().toUpperCase();
        if (window.RoomManager && typeof window.RoomManager.setRoom === 'function') {
          window.RoomManager.setRoom(this.roomCode);
        }
      } else if (window.RoomManager && typeof window.RoomManager.getRoom === 'function') {
        this.roomCode = window.RoomManager.getRoom();
      } else {
        this.roomCode = 'DIONLIVE';
      }

      // Hook FirebaseRoom
      if (window.FirebaseRoom) {
        window.FirebaseRoom.init(this.roomCode, 'speak-out');

        window.FirebaseRoom.onState((state) => {
          this.applyRemoteState(state);
        });

        window.FirebaseRoom.onSound((soundName) => {
          this.playLocalSound(soundName);
        });
      }

      // Initial HTTP pull from server
      this.fetchInitialServerState();
    }

    async fetchInitialServerState() {
      try {
        const res = await fetch(`/api/rooms/${this.roomCode}`);
        if (!res.ok) return;
        const json = await res.json();
        if (json && json.room && json.room.state && json.room.state.gameId === 'speak-out') {
          this.applyRemoteState(json.room.state);
        } else if (this.role === 'host') {
          // Host initializes waiting state in room
          this.broadcast();
        }
      } catch (e) {}
    }

    playLocalSound(soundName) {
      if (window.SoundManager && typeof window.SoundManager.playSound === 'function') {
        window.SoundManager.playSound(soundName);
      } else {
        // Fallback Web Audio synth chime if sound asset missing
        this.playFallbackBeep(soundName);
      }
    }

    playFallbackBeep(type) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'buzzer' || type === 'fail') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(140, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.4);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        } else if (type === 'correct' || type === 'pass') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } else if (type === 'tick') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
          osc.start();
          osc.stop(ctx.currentTime + 0.08);
        } else if (type === 'timeup') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
          osc.start();
          osc.stop(ctx.currentTime + 0.6);
        }
      } catch (e) {}
    }

    getFullState() {
      return {
        gameId: 'speak-out',
        activeMode: this.activeMode,
        selectedDifficulty: this.selectedDifficulty,
        currentChallenge: this.challenges.getCurrent(),
        timer: this.timer.getState(),
        score: this.scoring.getState(),
        streak: this.streak.getState(),
        showAnswer: this.showAnswer,
        showHint: this.showHint,
        status: this.status,
        lastAction: this.lastAction,
        usedCount: this.challenges.usedIds.size,
        usedIds: Array.from(this.challenges.usedIds),
        timestamp: Date.now()
      };
    }

    broadcast() {
      const state = this.getFullState();
      this.notifyLocalListeners();
      if (window.FirebaseRoom && typeof window.FirebaseRoom.broadcastState === 'function') {
        window.FirebaseRoom.broadcastState(state);
      }
    }

    applyRemoteState(state) {
      if (!state || state.gameId !== 'speak-out') return;

      if (state.activeMode) this.activeMode = state.activeMode;
      if (state.selectedDifficulty) this.selectedDifficulty = state.selectedDifficulty;
      if (state.showAnswer !== undefined) this.showAnswer = Boolean(state.showAnswer);
      if (state.showHint !== undefined) this.showHint = Boolean(state.showHint);
      if (state.status) this.status = state.status;
      if (state.lastAction) this.lastAction = state.lastAction;

      if (state.usedIds) {
        this.challenges.setUsedIds(state.usedIds);
      }
      if (state.currentChallenge) {
        this.challenges.currentChallenge = state.currentChallenge;
      }

      if (state.timer) {
        this.timer.syncFromState(state.timer);
      }
      if (state.score) {
        this.scoring.syncFromState(state.score);
      }
      if (state.streak) {
        this.streak.syncFromState(state.streak);
      }

      this.notifyLocalListeners();
    }

    // Host & Co-host Actions
    startGame() {
      this.status = 'playing';
      const challenge = this.challenges.getNextChallenge(this.activeMode, this.selectedDifficulty);
      const modeConfig = window.SpeakOutData ? window.SpeakOutData.getMode(challenge ? challenge.modeId : this.activeMode) : null;
      const duration = (challenge && challenge.duration) ? challenge.duration : (modeConfig ? modeConfig.defaultTimer : 20);
      this.timer.reset(duration);
      this.timer.start();
      this.showAnswer = false;
      this.showHint = false;
      this.lastAction = { type: 'startgame', text: '🚀 GAME LAUNCHED!', timestamp: Date.now() };
      this.playLocalSound('cheer');
      if (window.FirebaseRoom) {
        window.FirebaseRoom.broadcastSound('cheer');
      }
      this.broadcast();
      return challenge;
    }

    setWaiting(reason = 'Intermission') {
      this.status = 'waiting';
      this.timer.pause();
      this.showAnswer = false;
      this.showHint = false;
      this.lastAction = { type: 'waiting', text: `⏸️ ${reason} - Waiting for Host`, timestamp: Date.now() };
      this.broadcast();
    }

    setMode(modeKey) {
      this.activeMode = modeKey;
      const modeConfig = window.SpeakOutData ? window.SpeakOutData.getMode(modeKey) : null;
      const defaultSecs = modeConfig ? modeConfig.defaultTimer : 20;
      this.timer.reset(defaultSecs);
      this.showAnswer = false;
      this.showHint = false;
      if (this.status !== 'waiting') {
        this.nextChallenge(false);
      } else {
        this.lastAction = { type: 'mode', text: `Mode: ${modeConfig ? modeConfig.name : modeKey}`, timestamp: Date.now() };
        this.broadcast();
      }
    }

    setDifficulty(diff) {
      this.selectedDifficulty = diff;
      this.broadcast();
    }

    nextChallenge(autoStart = false) {
      this.showAnswer = false;
      this.showHint = false;
      const challenge = this.challenges.getNextChallenge(this.activeMode, this.selectedDifficulty);

      const modeConfig = window.SpeakOutData ? window.SpeakOutData.getMode(challenge ? challenge.modeId : this.activeMode) : null;
      const duration = (challenge && challenge.duration) ? challenge.duration : (modeConfig ? modeConfig.defaultTimer : 20);

      this.timer.reset(duration);

      if (autoStart) {
        this.timer.start();
        this.status = 'playing';
      } else {
        this.status = 'playing'; // If explicitly calling nextChallenge during a game, it is ready to play
      }

      this.lastAction = { type: 'next', text: '🎯 NEXT CHALLENGE READY!', timestamp: Date.now() };
      this.broadcast();
      return challenge;
    }

    startTimer() {
      this.timer.start();
      this.status = 'playing';
      this.lastAction = { type: 'start', text: '⏱️ TIMER STARTED!', timestamp: Date.now() };
      this.broadcast();
    }

    pauseTimer() {
      this.timer.pause();
      this.lastAction = { type: 'pause', text: '⏸️ PAUSED', timestamp: Date.now() };
      this.broadcast();
    }

    resumeTimer() {
      this.timer.resume();
      this.status = 'playing';
      this.lastAction = { type: 'resume', text: '▶️ RESUMED', timestamp: Date.now() };
      this.broadcast();
    }

    resetTimer() {
      const modeConfig = window.SpeakOutData ? window.SpeakOutData.getMode(this.activeMode) : null;
      const defaultSecs = modeConfig ? modeConfig.defaultTimer : 20;
      this.timer.reset(defaultSecs);
      this.status = 'idle';
      this.lastAction = { type: 'reset', text: '🔄 TIMER RESET', timestamp: Date.now() };
      this.broadcast();
    }

    addTime(seconds = 5) {
      this.timer.addSeconds(seconds);
      this.lastAction = { type: 'addtime', text: `⏳ +${seconds} SECONDS ADDED!`, timestamp: Date.now() };
      this.broadcast();
    }

    markPass() {
      const current = this.challenges.getCurrent();
      const diff = current ? (current.difficulty || 'medium') : 'medium';

      const streakResult = this.streak.recordSuccess();
      const scoringResult = this.scoring.addPass(diff, streakResult.milestoneBonus);

      this.timer.pause();
      this.status = 'revealed';
      this.showAnswer = true;

      this.playLocalSound('correct');
      if (window.FirebaseRoom) {
        window.FirebaseRoom.broadcastSound('correct');
      }

      const msg = streakResult.milestoneLabel 
        ? streakResult.milestoneLabel 
        : `✅ PASSED! +${scoringResult.pointsEarned} PTS (Streak: ${streakResult.currentStreak})`;

      this.lastAction = {
        type: 'pass',
        text: msg,
        points: scoringResult.pointsEarned,
        streak: streakResult.currentStreak,
        timestamp: Date.now()
      };

      this.broadcast();
    }

    markFail() {
      this.streak.recordFailure();
      this.scoring.addFail();

      this.timer.pause();
      this.status = 'revealed';
      this.showAnswer = true;

      this.playLocalSound('buzzer');
      if (window.FirebaseRoom) {
        window.FirebaseRoom.broadcastSound('buzzer');
      }

      this.lastAction = {
        type: 'fail',
        text: '❌ CHALLENGE FAILED! Streak Broken!',
        timestamp: Date.now()
      };

      this.broadcast();
    }

    markSkip() {
      this.scoring.addSkip();
      this.lastAction = {
        type: 'skip',
        text: '⏭️ CHALLENGE SKIPPED',
        timestamp: Date.now()
      };
      this.nextChallenge(false);
    }

    toggleAnswer() {
      this.showAnswer = !this.showAnswer;
      this.broadcast();
    }

    toggleHint() {
      this.showHint = !this.showHint;
      this.broadcast();
    }

    awardManualBonus(amount = 50) {
      this.scoring.addManualBonus(amount, `Co-Host Bonus +${amount}`);
      this.playLocalSound('bonus');
      if (window.FirebaseRoom) {
        window.FirebaseRoom.broadcastSound('bonus');
      }
      this.lastAction = {
        type: 'bonus',
        text: `⭐ BONUS +${amount} POINTS AWARDED!`,
        timestamp: Date.now()
      };
      this.broadcast();
    }

    resetGame() {
      this.scoring.reset();
      this.streak.reset();
      this.challenges.clearUsed();
      this.challenges.currentChallenge = null;
      this.resetTimer();
      this.showAnswer = false;
      this.showHint = false;
      this.status = 'waiting';
      this.lastAction = { type: 'gamereset', text: '🔄 STANDBY - WAITING FOR HOST', timestamp: Date.now() };
      this.broadcast();
    }
  }

  window.SpeakEngine = SpeakEngine;
})();
