/**
 * Dionlyonee Hangman Show - Stream Autopilot & Chat Interaction Engine
 * Enables hands-free stream automation with automated timers, progressive hints,
 * round transitions, chat command parsing, and realistic live chat simulation.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HangmanStream = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  class HangmanStream {
    constructor(engine, audio) {
      this.engine = engine;
      this.audio = audio;

      // Autopilot Settings
      this.isAutopilot = false;
      this.roundDuration = 45; // seconds
      this.remainingSeconds = 45;
      this.intermissionDuration = 5; // seconds
      this.intermissionRemaining = 5;
      this.isIntermission = false;
      this.timerInterval = null;
      this.intermissionInterval = null;

      // Auto-hint timing thresholds
      this.autoHint1Triggered = false;
      this.autoHint2Triggered = false;

      // Chat Simulation
      this.chatIntensity = 'chill'; // 'off' | 'chill' | 'active' | 'hype'
      this.chatInterval = null;
      this.chatFeed = [];
      this.chatLeaderboard = {};
      this.loadLeaderboard();

      // Callbacks
      this.onStateChange = null;
      this.onChatEvent = null;
      this.onRoundAutoAdvance = null;

      // Simulated Chat Persona Roster
      this.chatPersonas = [
        { name: 'YardieGamer', color: '#10b981', skill: 'high' },
        { name: 'IslandQueen99', color: '#ec4899', skill: 'high' },
        { name: 'KingstonBeats', color: '#f59e0b', skill: 'medium' },
        { name: 'DionFanatic', color: '#d4af37', skill: 'medium' },
        { name: 'ReggaeVibes', color: '#38bdf8', skill: 'high' },
        { name: 'NeonPulse', color: '#a855f7', skill: 'medium' },
        { name: 'TrackStar_Bolt', color: '#ef4444', skill: 'high' },
        { name: 'CocoBreadLover', color: '#fbbf24', skill: 'low' },
        { name: 'RiddimMaster', color: '#14b8a6', skill: 'medium' },
        { name: 'ChatSniper', color: '#6366f1', skill: 'high' },
        { name: 'BobsledChamp', color: '#34d399', skill: 'low' },
        { name: 'TwitchMod_Jay', color: '#93c5fd', skill: 'high' }
      ];
    }

    // ==========================================
    // AUTOPILOT TIMER CONTROLS
    // ==========================================
    startRoundTimer(duration = 45) {
      this.stopRoundTimer();
      this.stopIntermission();
      this.isIntermission = false;
      this.roundDuration = duration;
      this.remainingSeconds = duration;
      this.autoHint1Triggered = false;
      this.autoHint2Triggered = false;

      this.timerInterval = setInterval(() => {
        if (this.engine.status !== 'PLAYING') {
          this.stopRoundTimer();
          return;
        }

        this.remainingSeconds--;

        // Audio ticks
        if (this.remainingSeconds <= 5 && this.remainingSeconds > 0) {
          if (this.audio) this.audio.playHurry();
        } else if (this.remainingSeconds > 5) {
          if (this.audio) this.audio.playTick();
        }

        // Auto progressive hints when enabled
        if (this.isAutopilot) {
          // Half time: trigger Hint 1
          if (this.remainingSeconds <= Math.floor(this.roundDuration * 0.5) && !this.autoHint1Triggered) {
            this.autoHint1Triggered = true;
            this.engine.advanceHintTier();
            if (this.audio) this.audio.playClueDrop();
            this.addSystemChatMessage(`💡 AUTOPILOT CLUE: ${this.engine.hint1 || 'Category match'}`);
          }
          // Quarter time: trigger Hint 2 or free letter
          if (this.remainingSeconds <= Math.floor(this.roundDuration * 0.25) && !this.autoHint2Triggered) {
            this.autoHint2Triggered = true;
            if (this.engine.hint2) {
              this.engine.advanceHintTier();
              if (this.audio) this.audio.playClueDrop();
              this.addSystemChatMessage(`💡 BONUS CLUE: ${this.engine.hint2}`);
            } else {
              const freeChar = this.engine.revealFreeLetter();
              if (freeChar) {
                if (this.audio) this.audio.playLetterHit();
                this.addSystemChatMessage(`🎁 FREE LETTER REVEALED: "${freeChar}"!`);
              }
            }
          }
        }

        if (this.remainingSeconds <= 0) {
          this.stopRoundTimer();
          this.handleTimeout();
        }

        this.notifyState();
      }, 1000);

      this.notifyState();
    }

    stopRoundTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    handleTimeout() {
      if (this.engine.status === 'PLAYING') {
        this.engine.status = 'LOST';
        this.engine.finishTime = Date.now();
        if (this.audio) this.audio.playSlimeSplash();
        this.addSystemChatMessage(`⏰ TIME EXPIRED! The secret word was: "${this.engine.rawWord}"`);
        this.notifyState();

        if (this.isAutopilot) {
          this.startIntermission();
        }
      }
    }

    startIntermission(duration = 5) {
      this.stopRoundTimer();
      this.stopIntermission();
      this.isIntermission = true;
      this.intermissionDuration = duration;
      this.intermissionRemaining = duration;

      this.intermissionInterval = setInterval(() => {
        this.intermissionRemaining--;
        this.notifyState();

        if (this.intermissionRemaining <= 0) {
          this.stopIntermission();
          if (typeof this.onRoundAutoAdvance === 'function') {
            this.onRoundAutoAdvance();
          }
        }
      }, 1000);

      this.notifyState();
    }

    stopIntermission() {
      if (this.intermissionInterval) {
        clearInterval(this.intermissionInterval);
        this.intermissionInterval = null;
      }
      this.isIntermission = false;
    }

    setAutopilot(enabled) {
      this.isAutopilot = !!enabled;
      if (this.isAutopilot) {
        this.setChatIntensity(this.chatIntensity === 'off' ? 'chill' : this.chatIntensity);
      }
      this.notifyState();
    }

    // ==========================================
    // CHAT COMMANDS & LEADERBOARD
    // ==========================================
    processChatMessage(username, message) {
      if (!message || typeof message !== 'string') return null;
      const raw = message.trim();
      if (!raw) return null;

      const user = username ? username.replace(/^@/, '').trim() : 'Viewer';

      // 1. Check for single letter guess: "E" or "a"
      if (/^[A-Za-z]$/.test(raw)) {
        return this.handleLetterGuess(user, raw.toUpperCase());
      }

      // 2. Check for !guess <letter> or !letter <letter>
      const letterCmd = raw.match(/^!(?:guess|letter)\s+([A-Za-z])$/i);
      if (letterCmd) {
        return this.handleLetterGuess(user, letterCmd[1].toUpperCase());
      }

      // 3. Check for !solve <phrase> or whole phrase
      const solveCmd = raw.match(/^!solve\s+(.+)$/i);
      if (solveCmd) {
        return this.handleSolveGuess(user, solveCmd[1].trim());
      }

      // If user typed multi-word guess matching length, attempt solve
      if (raw.length >= 4 && this.engine.status === 'PLAYING') {
        const cleanRaw = raw.toUpperCase().replace(/[^A-Z]/g, '');
        if (cleanRaw === this.engine.cleanWord) {
          return this.handleSolveGuess(user, raw);
        }
      }

      // Regular chat comment
      const chatItem = {
        id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        user,
        message: raw,
        type: 'comment',
        timestamp: Date.now()
      };
      this.addChatToFeed(chatItem);
      return chatItem;
    }

    handleLetterGuess(user, letter) {
      if (this.engine.status !== 'PLAYING') return null;

      const result = this.engine.guessLetter(letter, user);

      let chatType = 'guess';
      let formattedMsg = `Guessed letter "${letter}"`;

      if (result.alreadyGuessed) {
        formattedMsg = `Letter "${letter}" was already called!`;
        chatType = 'miss';
      } else if (result.isCorrect) {
        if (this.audio) this.audio.playLetterHit();
        formattedMsg = `🎯 HIT! Letter "${letter}" appears ${result.occurrences} time${result.occurrences > 1 ? 's' : ''}! (+${result.occurrences * 100} pts)`;
        chatType = 'hit';
        this.awardPoints(user, result.occurrences * 100);

        if (result.status === 'WON') {
          if (this.audio) this.audio.playWordSolve();
          formattedMsg = `🏆 WORD SOLVED by @${user}! (+${this.engine.roundPoints} pts)`;
          chatType = 'win';
          this.awardPoints(user, this.engine.roundPoints, true);
          if (this.isAutopilot) {
            this.startIntermission();
          }
        }
      } else {
        if (this.audio) this.audio.playLetterMiss();
        formattedMsg = `💀 STRIKE ${result.strikes}/${result.maxStrikes}! "${letter}" is not in the word!`;
        chatType = 'miss';

        if (result.status === 'LOST') {
          if (this.audio) this.audio.playSlimeSplash();
          formattedMsg = `☠️ 6 STRIKES REACHED! Slime dunk triggered! Word: "${this.engine.rawWord}"`;
          chatType = 'loss';
          if (this.isAutopilot) {
            this.startIntermission();
          }
        }
      }

      const chatItem = {
        id: 'guess-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        user,
        message: formattedMsg,
        type: chatType,
        letter,
        timestamp: Date.now()
      };

      this.addChatToFeed(chatItem);
      this.notifyState();
      return chatItem;
    }

    handleSolveGuess(user, phrase) {
      if (this.engine.status !== 'PLAYING') return null;

      const result = this.engine.solveWord(phrase, user);

      let chatType = 'solve';
      let formattedMsg = `Tried solving: "${phrase}"`;

      if (result.isCorrect) {
        if (this.audio) this.audio.playWordSolve();
        formattedMsg = `🎉 INSTANT SOLVE! @${user} nailed "${this.engine.rawWord}"! (+${result.points} pts)`;
        chatType = 'win';
        this.awardPoints(user, result.points, true);
        if (this.isAutopilot) {
          this.startIntermission();
        }
      } else {
        if (this.audio) this.audio.playLetterMiss();
        formattedMsg = `❌ WRONG SOLVE! Strike ${result.strikes}/${this.engine.maxStrikes}!`;
        chatType = 'miss';
        if (result.status === 'LOST') {
          if (this.audio) this.audio.playSlimeSplash();
          if (this.isAutopilot) {
            this.startIntermission();
          }
        }
      }

      const chatItem = {
        id: 'solve-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        user,
        message: formattedMsg,
        type: chatType,
        timestamp: Date.now()
      };

      this.addChatToFeed(chatItem);
      this.notifyState();
      return chatItem;
    }

    awardPoints(user, points = 100, isWin = false) {
      if (!this.chatLeaderboard[user]) {
        this.chatLeaderboard[user] = { score: 0, wins: 0, correct: 0 };
      }
      this.chatLeaderboard[user].score += points;
      this.chatLeaderboard[user].correct += 1;
      if (isWin) {
        this.chatLeaderboard[user].wins += 1;
      }
      this.saveLeaderboard();
    }

    addSystemChatMessage(msg) {
      const item = {
        id: 'sys-' + Date.now(),
        user: 'DION BOT',
        message: msg,
        type: 'system',
        timestamp: Date.now()
      };
      this.addChatToFeed(item);
    }

    addChatToFeed(item) {
      this.chatFeed.unshift(item);
      if (this.chatFeed.length > 50) this.chatFeed.pop();
      if (typeof this.onChatEvent === 'function') {
        this.onChatEvent(item, this.chatFeed);
      }
    }

    // ==========================================
    // SIMULATED CHAT GENERATOR
    // ==========================================
    setChatIntensity(intensity = 'chill') {
      this.chatIntensity = intensity;
      if (this.chatInterval) {
        clearInterval(this.chatInterval);
        this.chatInterval = null;
      }

      if (intensity === 'off') return;

      const delays = {
        chill: 5000,
        active: 2800,
        hype: 1400
      };

      const intervalMs = delays[intensity] || 4000;

      this.chatInterval = setInterval(() => {
        this.runSimulatedChatTick();
      }, intervalMs);
    }

    runSimulatedChatTick() {
      if (this.engine.status !== 'PLAYING') return;

      const persona = this.chatPersonas[Math.floor(Math.random() * this.chatPersonas.length)];
      const target = this.engine.cleanWord;
      const guessed = this.engine.guessedLetters;
      const unguessedInWord = target.split('').filter(ch => !guessed.includes(ch));
      const alphabet = 'ETAOINSHRDLUCMFWYPVBGKQJXZ'.split('');
      const unguessedAlphabet = alphabet.filter(ch => !guessed.includes(ch));

      // Probability of smart vs random guess
      let pickLetter = '';
      const isSmart = (persona.skill === 'high' && Math.random() < 0.75) || (persona.skill === 'medium' && Math.random() < 0.5);

      if (isSmart && unguessedInWord.length > 0) {
        // High likelihood of hitting a letter in word
        pickLetter = unguessedInWord[Math.floor(Math.random() * unguessedInWord.length)];
      } else if (unguessedAlphabet.length > 0) {
        // Pick from common English letters
        pickLetter = unguessedAlphabet[Math.floor(Math.random() * Math.min(8, unguessedAlphabet.length))];
      }

      if (!pickLetter) return;

      // Occasionally try to solve word directly if almost completed
      if (unguessedInWord.length <= 3 && Math.random() < 0.35 && persona.skill === 'high') {
        this.processChatMessage(persona.name, `!solve ${this.engine.rawWord}`);
      } else {
        // Standard letter guess
        const formats = [`${pickLetter}`, `!guess ${pickLetter}`, `Is there an ${pickLetter}?`];
        const text = formats[Math.floor(Math.random() * formats.length)];
        this.processChatMessage(persona.name, text);
      }
    }

    loadLeaderboard() {
      try {
        const stored = localStorage.getItem('dionlyonee_hangman_leaderboard');
        if (stored) this.chatLeaderboard = JSON.parse(stored);
      } catch (e) {
        this.chatLeaderboard = {};
      }
    }

    saveLeaderboard() {
      try {
        localStorage.setItem('dionlyonee_hangman_leaderboard', JSON.stringify(this.chatLeaderboard));
      } catch (e) {}
    }

    resetLeaderboard() {
      this.chatLeaderboard = {};
      this.saveLeaderboard();
      this.notifyState();
    }

    notifyState() {
      if (typeof this.onStateChange === 'function') {
        this.onStateChange(this.getStreamState());
      }
    }

    getStreamState() {
      return {
        isAutopilot: this.isAutopilot,
        roundDuration: this.roundDuration,
        remainingSeconds: this.remainingSeconds,
        isIntermission: this.isIntermission,
        intermissionRemaining: this.intermissionRemaining,
        chatIntensity: this.chatIntensity,
        leaderboard: this.chatLeaderboard,
        chatFeed: this.chatFeed.slice(0, 20)
      };
    }

    destroy() {
      this.stopRoundTimer();
      this.stopIntermission();
      if (this.chatInterval) clearInterval(this.chatInterval);
    }
  }

  return HangmanStream;
});
