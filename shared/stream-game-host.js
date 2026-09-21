/**
 * Dionlyonee Playground - Universal Stream Game Host Controller
 * Powers Host panels for Finish The Sentence, What Would You Do, Who Would You Pick,
 * Emoji Guess, Unscramble It, Who Dis, Hangman, Charades, and Would You Rather.
 */
(function () {
  'use strict';

  class StreamGameHost {
    constructor(gameId) {
      this.gameId = gameId;
      this.gameMeta = (window.StreamGamesData && window.StreamGamesData[gameId]) || {
        title: gameId.toUpperCase().replace(/-/g, ' '),
        badge: 'STREAM GAME',
        prompts: []
      };

      this.channel = new BroadcastChannel('dionlyonee-stream-games');
      this.prompts = (this.gameId === 'hangman' && window.HangmanWords && window.HangmanWords.length) 
        ? window.HangmanWords 
        : (this.gameMeta.prompts || []);
      this.currentIndex = 0;
      this.selectedCategory = 'ALL';
      this.showWaitingScreen = false;
      this.timerSeconds = (this.gameId === 'charades' || this.gameId === 'hangman') ? 60 : 30;
      this.remainingSeconds = this.timerSeconds;
      this.timerInterval = null;
      this.isRunning = false;
      this.revealedClues = 1; // for who-dis
      this.revealedAnswer = false;

      // Detect Solo / Single Player mode from URL
      const urlParams = new URLSearchParams(window.location.search);
      this.isSolo = urlParams.get('singleplayer') === 'true' || urlParams.get('solo') === 'true';
      this.soloFeedback = null;

      this.votes = { optionA: 0, optionB: 0 };
      this.showWordCount = false;
      this.showChatClue = false;
      this.charadesReaction = null;
      this.charadesReactionTimer = null;
      this.chatWinner = '';
      this.emojiLetterHintCount = 0;
      this.selectedPick = null;
      this.scenarioVotes = { A: 0, B: 0, C: 0, D: 0 };
      this.showLyricsSongArtist = false;
      this.showLyricsFirstLetter = false;
      this.showLyricsEra = false;
      this.showScoreboard = true;

      // Contestants Scoreboard (persisted in session)
      this.contestants = [
        { id: 1, name: 'Player 1', score: 0 },
        { id: 2, name: 'Player 2', score: 0 },
        { id: 3, name: 'Player 3', score: 0 }
      ];
      try {
        const savedContestants = sessionStorage.getItem('dion_stream_contestants');
        if (savedContestants) {
          const parsed = JSON.parse(savedContestants);
          if (Array.isArray(parsed) && parsed.length) this.contestants = parsed;
        }
      } catch (e) {}

      this.hangmanState = {
        guessedLetters: [],
        strikes: 0,
        maxStrikes: 6,
        status: 'PLAYING',
        showHint: false
      };

      // Enforce Host Passcode Protection (Brown123)
      if (typeof window.HostAuth === 'undefined') {
        const authScript = document.createElement('script');
        authScript.src = '../shared/host-auth.js';
        authScript.onload = () => {
          if (window.HostAuth) window.HostAuth.requireHostAccess(() => this.init());
        };
        document.head.appendChild(authScript);
      } else {
        window.HostAuth.requireHostAccess(() => this.init());
      }
    }

    getCategories() {
      const cats = new Set();
      this.prompts.forEach(p => {
        if (p.category) cats.add(p.category);
      });
      return Array.from(cats);
    }

    getFilteredIndices() {
      if (this.selectedCategory === 'ALL') {
        return this.prompts.map((_, i) => i);
      }
      const indices = [];
      this.prompts.forEach((p, i) => {
        if (p.category === this.selectedCategory) indices.push(i);
      });
      return indices.length ? indices : this.prompts.map((_, i) => i);
    }

    getPromptTitle(p, index) {
      if (!p) return `Question ${index + 1}`;
      if (this.isSolo) {
        if (this.gameId === 'emoji-guess') return p.emojis ? `${p.emojis} (Emoji Puzzle #${index + 1})` : `Emoji Puzzle #${index + 1}`;
        if (this.gameId === 'unscramble-it') return p.scrambled ? `${p.scrambled} (Puzzle #${index + 1})` : `Puzzle #${index + 1}`;
        if (this.gameId === 'who-dis') return `Mystery Target #${index + 1}`;
        if (this.gameId === 'hangman') return `Mystery Word #${index + 1} (${(p.word || '').length} letters)`;
        if (this.gameId === 'charades') return `Acting Challenge #${index + 1}`;
        if (this.gameId === 'guess-the-lyrics') return `Lyric Challenge #${index + 1} (${p.genre || p.category || 'Song'})`;
      }
      if (p.song) return `"${p.song}" - ${p.artist || ''}`;
      if (p.setup) return p.setup;
      if (p.scenario) return p.scenario.length > 55 ? p.scenario.substring(0, 52) + '...' : p.scenario;
      if (p.question) return p.question.length > 55 ? p.question.substring(0, 52) + '...' : p.question;
      if (p.emojis) return `${p.emojis} (${p.answer || ''})`;
      if (p.scrambled) return `${p.scrambled} (${p.answer || ''})`;
      if (p.name) return `Target: ${p.name}`;
      if (p.word) return `Word: ${p.word}`;
      if (p.prompt) return p.prompt.length > 55 ? p.prompt.substring(0, 52) + '...' : p.prompt;
      if (p.optionA && p.optionB) return `${p.optionA} OR ${p.optionB}`;
      return `Prompt #${index + 1}`;
    }

    init() {
      this.renderHeader();
      this.renderControls();
      this.renderPrompt();
      this.broadcastState();
      this.ensureHeartPowerLoaded();

      this.channel.onmessage = (event) => {
        if (event.data && event.data.type === 'REQUEST_STATE' && event.data.gameId === this.gameId) {
          this.broadcastState();
        }
      };

      // Connect RoomSync action listener
      if (window.RoomSync) {
        window.RoomSync.gameType = this.gameId;
        window.RoomSync.role = 'host';
        window.RoomSync.onAction((action, payload) => {
          if (action === 'START_ROUND' || action === 'NEXT_ROUND' || action === 'NEXT_PROMPT') {
            this.next();
          } else if (action === 'PREV_PROMPT') {
            this.prev();
          } else if (action === 'RANDOM') {
            this.random();
          } else if (action === 'CORRECT' || action === 'PASS') {
            this.playSound('correct');
            this.next();
          } else if (action === 'WRONG' || action === 'FAIL') {
            this.playSound('wrong');
          } else if (action === 'START_TIMER') {
            this.startTimer();
          } else if (action === 'PAUSE_TIMER') {
            this.pauseTimer();
          } else if (action === 'RESET_TIMER') {
            this.resetTimer();
          } else if (action === 'HINT') {
            this.toggleAnswer();
          } else if (action === 'ENTER_COOLDOWN' || action === 'COOLDOWN') {
            this.state.isCooldown = true;
            this.broadcastState();
          }
        });
      }

      // Reset on beforeunload
      window.addEventListener('beforeunload', () => {
        try {
          sessionStorage.removeItem(`dion_stream_game_${this.gameId}`);
        } catch (e) {}
      });

      // Quick keyboard guess listener for Hangman host
      window.addEventListener('keydown', (e) => {
        if (this.gameId === 'hangman' && e.key && /^[a-zA-Z]$/.test(e.key)) {
          if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
          this.guessLetter(e.key.toUpperCase());
        }
      });
    }

    renderHeader() {
      const header = document.getElementById('host-header');
      if (!header) return;
      header.innerHTML = `
        <div class="host-logo">${this.isSolo ? '👤' : 'D'}</div>
        <div>
          <div class="host-title">DIONLYONEE PLAYGROUND</div>
          <div class="host-game">${this.gameMeta.title} • ${this.isSolo ? 'SOLO PLAYER MODE' : 'HOST CONTROLLER'}</div>
        </div>
        <div style="margin-left: auto; display: flex; gap: 8px; align-items: center;">
          ${this.isSolo ? `
            <span style="background: rgba(16,185,129,0.2); border: 1px solid #10b981; color: #34d399; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 800; display: inline-flex; align-items: center; gap: 4px;">
              👤 SOLO PLAY ACTIVE (ANSWERS HIDDEN)
            </span>
          ` : `
            <button type="button" class="time-button" onclick="window.RoomUI ? window.RoomUI.showRoomCreatedModal('${this.gameId}') : (window.location.href='/remote.html?game=${this.gameId}')" style="background: linear-gradient(135deg, #d97706, #b45309); border-color: #facc15; color: #ffffff; font-weight: 800;">
              📱 PHONE CONTROLLER
            </button>
            <button type="button" class="time-button" onclick="window.gameHost.openLiveWindow()" style="background: rgba(212,175,55,0.2); border-color: #d4af37;">
              📺 OPEN LIVE STAGE ↗
            </button>
          `}
        </div>
      `;
    }

    renderControls() {
      const controls = document.getElementById('host-timer-controls');
      if (!controls) return;

      const categories = this.getCategories();
      const filteredIndices = this.getFilteredIndices();

      const catOptions = [
        `<option value="ALL" ${this.selectedCategory === 'ALL' ? 'selected' : ''}>🌟 ALL CATEGORIES (${this.prompts.length})</option>`,
        ...categories.map(c => {
          const count = this.prompts.filter(p => p.category === c).length;
          return `<option value="${c}" ${this.selectedCategory === c ? 'selected' : ''}>📁 ${c} (${count})</option>`;
        })
      ].join('');

      const questionOptions = filteredIndices.map(idx => {
        const p = this.prompts[idx];
        const title = this.getPromptTitle(p, idx);
        return `<option value="${idx}" ${this.currentIndex === idx ? 'selected' : ''}>#${idx + 1} - ${title}</option>`;
      }).join('');

      controls.innerHTML = `
        <!-- Category & Question Selector -->
        <div class="host-category-bar">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="host-label" style="margin-bottom: 0;">📁 CATEGORY & QUESTION PICKER</div>
            <div style="font-size: 11px; font-weight: 800; color: #d4af37;">
              ${filteredIndices.length} AVAILABLE QUESTIONS
            </div>
          </div>

          <div class="host-category-row">
            <select id="host-category-select" class="host-select-field" onchange="window.gameHost.onCategoryChange(this.value)">
              ${catOptions}
            </select>

            <select id="host-question-select" class="host-select-field" style="flex: 2;" onchange="window.gameHost.onQuestionSelect(this.value)">
              ${questionOptions}
            </select>

            <button type="button" class="host-action-btn" onclick="window.gameHost.pickRandomInCategory()">
              🎲 RANDOM
            </button>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
            <button type="button" id="btn-toggle-waiting" class="host-action-btn host-toggle-waiting-btn ${this.showWaitingScreen ? 'is-waiting' : ''}" onclick="window.gameHost.toggleWaitingScreen()">
              ${this.showWaitingScreen ? '📺 SHOWING WAITING SCREEN (CLICK TO GO LIVE)' : '📺 PAST WAITING SCREEN (STAGE LIVE)'}
            </button>
            <div style="font-size: 12px; color: ${this.showWaitingScreen ? '#f59e0b' : '#34d399'}; font-weight: 800;">
              ${this.showWaitingScreen ? '⏳ AUDIENCE SCREEN: STANDBY LOBBY' : '🔴 AUDIENCE SCREEN: LIVE QUESTION'}
            </div>
          </div>
        </div>

        <div class="host-setting">
          <div class="host-label">TIMER DURATION</div>
          <div>
            ${(this.gameId === 'charades' || this.gameId === 'hangman') ? `
              <button type="button" class="time-button ${this.timerSeconds === 30 ? 'active' : ''}" onclick="window.gameHost.setDuration(30)">30s</button>
              <button type="button" class="time-button ${this.timerSeconds === 45 ? 'active' : ''}" onclick="window.gameHost.setDuration(45)">45s</button>
              <button type="button" class="time-button ${this.timerSeconds === 60 ? 'active' : ''}" onclick="window.gameHost.setDuration(60)">60s</button>
              <button type="button" class="time-button ${this.timerSeconds === 90 ? 'active' : ''}" onclick="window.gameHost.setDuration(90)">90s</button>
              <button type="button" class="time-button ${this.timerSeconds === 120 ? 'active' : ''}" onclick="window.gameHost.setDuration(120)">120s</button>
            ` : `
              <button type="button" class="time-button ${this.timerSeconds === 15 ? 'active' : ''}" onclick="window.gameHost.setDuration(15)">15s</button>
              <button type="button" class="time-button ${this.timerSeconds === 30 ? 'active' : ''}" onclick="window.gameHost.setDuration(30)">30s</button>
              <button type="button" class="time-button ${this.timerSeconds === 45 ? 'active' : ''}" onclick="window.gameHost.setDuration(45)">45s</button>
              <button type="button" class="time-button ${this.timerSeconds === 60 ? 'active' : ''}" onclick="window.gameHost.setDuration(60)">60s</button>
            `}
          </div>
        </div>
        <div class="host-setting">
          <div class="host-label">SOUND BOARD</div>
          <div>
            <button type="button" class="cooldown-button" onclick="window.gameHost.playSound('correct')">🔔 DING</button>
            <button type="button" class="cooldown-button" onclick="window.gameHost.playSound('buzz')">❌ BUZZ</button>
            <button type="button" class="cooldown-button" onclick="window.gameHost.playSound('solve')">🎉 SOLVE</button>
          </div>
        </div>
        ${this.renderScoreDockHtml()}
      `;

      this.ensureHeartPowerLoaded();
    }

    ensureHeartPowerLoaded() {
      if (!document.querySelector('link[href*="heart-power.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/shared/heart-power.css';
        document.head.appendChild(link);
      }
      if (!window.HeartPowerSystem) {
        const script = document.createElement('script');
        script.src = '/shared/heart-power-system.js';
        script.onload = () => {
          if (window.HeartPowerSystem) window.HeartPowerSystem.attachHostBar('#host-timer-controls');
        };
        document.head.appendChild(script);
      } else {
        setTimeout(() => {
          window.HeartPowerSystem.attachHostBar('#host-timer-controls');
        }, 10);
      }
    }

    renderScoreDockHtml() {
      return `
        <div class="host-category-bar" style="border-color: rgba(212,175,55,0.4); background: rgba(14,28,30,0.92); margin-top: 15px; border-radius: 12px; padding: 12px 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
            <div class="host-label" style="margin-bottom: 0; color: #f7e07d; font-size: 11px; letter-spacing: 2px;">
              👥 CONTESTANT PODIUMS & LIVE SCORES
            </div>
            <div style="display: flex; gap: 6px;">
              <button type="button" class="time-button" style="font-size: 11px; padding: 4px 10px;" onclick="window.gameHost.toggleScoreboard()">
                ${this.showScoreboard ? '📺 SCOREBOARD: VISIBLE' : '📺 SCOREBOARD: HIDDEN'}
              </button>
              <button type="button" class="time-button" style="font-size: 11px; padding: 4px 10px; background: rgba(239,68,68,0.15); border-color: #ef4444; color: #fca5a5;" onclick="window.gameHost.resetScores()">
                🔄 RESET
              </button>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
            ${this.contestants.map(c => `
              <div style="background: rgba(0,0,0,0.45); border: 1.5px solid rgba(212,175,55,0.3); border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <input type="text" value="${c.name}" style="background: transparent; border: none; border-bottom: 1px dashed rgba(212,175,55,0.5); color: #fff; font-weight: 800; font-size: 13px; width: 110px; padding: 2px 4px;" onchange="window.gameHost.updateContestantName(${c.id}, this.value)" title="Click to rename player" />
                  <span style="font-size: 20px; font-weight: 900; color: #d4af37;">${c.score} <small style="font-size: 10px; color: #94a3b8;">PTS</small></span>
                </div>
                <div style="display: flex; gap: 4px; flex-wrap: wrap; align-items: center;">
                  <button type="button" class="time-button" style="padding: 4px 7px; font-size: 11px; font-weight: 900; background: rgba(16,185,129,0.2); border-color: #10b981; color: #6ee7b7;" onclick="window.gameHost.addContestantScore(${c.id}, 100)">+100</button>
                  <button type="button" class="time-button" style="padding: 4px 7px; font-size: 11px; font-weight: 900; background: rgba(16,185,129,0.3); border-color: #10b981; color: #34d399;" onclick="window.gameHost.addContestantScore(${c.id}, 500)">+500</button>
                  <button type="button" class="time-button" style="padding: 4px 7px; font-size: 11px; font-weight: 900; background: rgba(56,189,248,0.2); border-color: #38bdf8; color: #7dd3fc;" onclick="window.gameHost.addContestantScore(${c.id}, 1)">+1 Pt</button>
                  <button type="button" class="time-button" style="padding: 4px 7px; font-size: 11px; font-weight: 900; background: rgba(239,68,68,0.2); border-color: #ef4444; color: #fca5a5;" onclick="window.gameHost.addContestantScore(${c.id}, -100)">-100</button>
                  <button type="button" class="time-button" style="padding: 4px 8px; font-size: 10px; font-weight: 900; background: linear-gradient(135deg, #d4af37, #b89628); color: #000; margin-left: auto;" onclick="window.gameHost.awardAndNext(${c.id}, 100)" title="Award +100 and advance to next question">🏆 WIN & NEXT</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    updateContestantName(id, newName) {
      const c = this.contestants.find(item => item.id === id);
      if (c && newName.trim()) {
        c.name = newName.trim();
        this.saveContestants();
        this.broadcastState();
      }
    }

    addContestantScore(id, amount) {
      const c = this.contestants.find(item => item.id === id);
      if (c) {
        c.score = Math.max(0, c.score + amount);
        this.saveContestants();
        this.renderControls();
        if (amount > 0) this.playSound('correct');
        this.broadcastState();
      }
    }

    awardAndNext(id, amount = 100) {
      this.addContestantScore(id, amount);
      this.playSound('solve');
      setTimeout(() => {
        this.nextPrompt();
      }, 700);
    }

    resetScores() {
      this.contestants.forEach(c => c.score = 0);
      this.saveContestants();
      this.renderControls();
      this.broadcastState();
    }

    toggleScoreboard() {
      this.showScoreboard = !this.showScoreboard;
      this.renderControls();
      this.broadcastState();
    }

    saveContestants() {
      try {
        sessionStorage.setItem('dion_stream_contestants', JSON.stringify(this.contestants));
      } catch (e) {}
    }

    onCategoryChange(cat) {
      this.selectedCategory = cat;
      const filtered = this.getFilteredIndices();
      this.soloFeedback = null;
      if (!filtered.includes(this.currentIndex)) {
        this.currentIndex = filtered[0] || 0;
        this.remainingSeconds = this.timerSeconds;
        this.revealedClues = 1;
        this.revealedAnswer = false;
        this.votes = { optionA: 0, optionB: 0 };
        this.showWordCount = false;
        this.showChatClue = false;
        this.charadesReaction = null;
        if (this.charadesReactionTimer) clearTimeout(this.charadesReactionTimer);
        this.showLyricsSongArtist = false;
        this.showLyricsFirstLetter = false;
        this.showLyricsEra = false;
      }
      if (this.gameId === 'hangman') {
        this.hangmanState = {
          guessedLetters: [],
          strikes: 0,
          maxStrikes: 6,
          status: 'PLAYING',
          showHint: false
        };
      }
      this.renderControls();
      this.renderPrompt();
      this.broadcastState();
    }

    onQuestionSelect(indexStr) {
      const idx = parseInt(indexStr, 10);
      if (isNaN(idx) || idx < 0 || idx >= this.prompts.length) return;
      this.currentIndex = idx;
      this.soloFeedback = null;
      this.showWaitingScreen = false;
      this.remainingSeconds = this.timerSeconds;
      this.revealedClues = 1;
      this.revealedAnswer = false;
      this.votes = { optionA: 0, optionB: 0 };
      this.showWordCount = false;
      this.showChatClue = false;
      this.charadesReaction = null;
      if (this.charadesReactionTimer) clearTimeout(this.charadesReactionTimer);
      this.showLyricsSongArtist = false;
      this.showLyricsFirstLetter = false;
      this.showLyricsEra = false;
      if (this.gameId === 'hangman') {
        this.hangmanState = {
          guessedLetters: [],
          strikes: 0,
          maxStrikes: 6,
          status: 'PLAYING',
          showHint: false
        };
      }
      if (this.isRunning) {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        const btn = document.getElementById('btn-start-timer');
        if (btn) btn.textContent = '▶ START TIMER';
      }
      this.renderControls();
      this.renderPrompt();
      this.broadcastState();
      this.playSound('correct');
    }

    pickRandomInCategory() {
      const indices = this.getFilteredIndices();
      if (!indices.length) return;
      const otherIndices = indices.filter(i => i !== this.currentIndex);
      const chosen = otherIndices.length
        ? otherIndices[Math.floor(Math.random() * otherIndices.length)]
        : indices[0];
      this.onQuestionSelect(chosen);
    }

    toggleWaitingScreen() {
      this.showWaitingScreen = !this.showWaitingScreen;
      this.renderControls();
      this.broadcastState();
    }

    renderPrompt() {
      const container = document.getElementById('prompt-container');
      if (!container || !this.prompts.length) return;

      const p = this.prompts[this.currentIndex] || {};
      let html = '';

      if (this.gameId === 'finish-the-sentence') {
        html = `
          <div class="host-status" style="flex-direction: column; align-items: stretch; gap: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div class="host-label">CATEGORY: ${p.category || 'GENERAL'} (${this.currentIndex + 1}/${this.prompts.length})</div>
                <div class="host-category" style="font-size: 26px; color: #f7e07d; margin-top: 4px;">"${p.setup}"</div>
              </div>
              <div style="text-align: right;">
                <div class="host-label">TIMER</div>
                <div class="host-timer" id="timer-display">${this.remainingSeconds}s</div>
              </div>
            </div>
            
            <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px; padding: 14px 18px;">
              <div style="font-size: 11px; font-weight: 800; color: #38bdf8; letter-spacing: 2px; margin-bottom: 8px;">
                🏆 SPOTLIGHT WINNING CHAT PUNCHLINE:
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <input type="text" id="input-chat-winner" placeholder="Enter winning chat punchline or username..." value="${this.chatWinner || ''}" style="flex: 1; min-width: 200px; background: rgba(255,255,255,0.08); border: 1px solid rgba(212,175,55,0.4); border-radius: 8px; color: #fff; padding: 8px 12px; font-weight: 700; font-size: 14px;" />
                <button type="button" class="time-button" onclick="window.gameHost.setChatWinner(document.getElementById('input-chat-winner').value)" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-weight: 900; padding: 8px 16px;">🏆 CROWN WINNER</button>
                <button type="button" class="time-button" onclick="window.gameHost.clearChatWinner()" style="background: rgba(255,255,255,0.08); font-size: 11px;">✕ Clear</button>
              </div>
            </div>
          </div>
        `;
      } else if (this.gameId === 'what-would-you-do') {
        const votes = this.scenarioVotes || { A: 0, B: 0, C: 0, D: 0 };
        const total = (votes.A + votes.B + votes.C + votes.D) || 1;
        const opts = (p.options || []).map((opt, i) => {
          const key = String.fromCharCode(65 + i);
          const count = votes[key] || 0;
          const pct = Math.round((count / total) * 100);
          return `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,55,0.25); border-radius: 10px; padding: 10px 14px; margin: 6px 0; gap: 10px; flex-wrap: wrap;">
              <div>
                <b style="color: #d4af37; margin-right: 8px; font-size: 16px;">${key}:</b> <span style="color: #fff; font-weight: 700;">${opt}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 12px; color: #38bdf8; font-weight: 800;">${count} votes (${pct}%)</span>
                <button type="button" class="time-button" style="padding: 3px 8px; font-size: 11px;" onclick="window.gameHost.voteScenario('${key}', 1)">+1</button>
                <button type="button" class="time-button" style="padding: 3px 8px; font-size: 11px;" onclick="window.gameHost.voteScenario('${key}', 5)">+5</button>
              </div>
            </div>
          `;
        }).join('');

        html = `
          <div class="host-status" style="flex-direction: column; align-items: flex-start; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div class="host-label">SCENARIO (${this.currentIndex + 1}/${this.prompts.length})</div>
              <div class="host-timer" id="timer-display">${this.remainingSeconds}s</div>
            </div>
            <div class="host-category" style="font-size: 22px; line-height: 1.4; color: #f7e07d;">"${p.scenario}"</div>
            <div style="width: 100%; margin-top: 6px;">${opts}</div>
            <button type="button" class="time-button" style="font-size: 11px; padding: 4px 10px;" onclick="window.gameHost.resetScenarioVotes()">🔄 RESET SCENARIO VOTES</button>
          </div>
        `;
      } else if (this.gameId === 'who-would-you-pick') {
        const choices = (p.choices || []).map((c) => {
          const isSelected = this.selectedPick === c;
          return `
            <button type="button" class="time-button" onclick="window.gameHost.selectPickChoice('${c.replace(/'/g, "\\'")}')" style="background: ${isSelected ? 'linear-gradient(135deg, #d4af37, #f7e07d)' : 'rgba(212,175,55,0.15)'}; border: 2px solid #d4af37; color: ${isSelected ? '#000' : '#fff'}; font-size: 15px; font-weight: 900; padding: 10px 18px; border-radius: 20px; margin: 4px; box-shadow: ${isSelected ? '0 0 20px rgba(212,175,55,0.6)' : 'none'}; cursor: pointer;">
              ${isSelected ? '👑 ' : ''}${c}
            </button>
          `;
        }).join('');

        html = `
          <div class="host-status" style="flex-direction: column; align-items: flex-start; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div class="host-label">DRAFT DILEMMA (${this.currentIndex + 1}/${this.prompts.length})</div>
              <div class="host-timer" id="timer-display">${this.remainingSeconds}s</div>
            </div>
            <div class="host-category" style="font-size: 24px; color: #f7e07d;">${p.question}</div>
            <div style="font-size: 11px; font-weight: 800; color: #94a3b8; margin-top: 4px;">CLICK A CHOICE TO CROWN THE WINNING PICK ON AUDIENCE STAGE:</div>
            <div style="margin-top: 8px; display: flex; flex-wrap: wrap;">${choices}</div>
          </div>
        `;
      } else if (this.gameId === 'emoji-guess') {
        const rawAns = (p.answer || '').toUpperCase();
        const hintCount = this.emojiLetterHintCount || 0;
        const isSolvedOrRevealed = this.revealedAnswer;
        const letterBoxes = rawAns.split('').map((ch, idx) => {
          if (ch === ' ') return '<span style="display:inline-block; width:12px;"></span>';
          const isFirstLetterOfWord = idx === 0 || rawAns[idx - 1] === ' ';
          const showThisLetter = isSolvedOrRevealed || (hintCount >= 1 && isFirstLetterOfWord) || (hintCount >= 2 && (idx % 2 === 0));
          return `<span style="display:inline-flex; width:28px; height:34px; border-bottom:3px solid ${showThisLetter ? '#10b981' : '#d4af37'}; align-items:center; justify-content:center; font-weight:900; font-size:18px; color:${showThisLetter ? '#fff' : 'rgba(255,255,255,0.2)'}; background:rgba(0,0,0,0.35); border-radius:6px; margin:0 2px;">${showThisLetter ? ch : '_'}</span>`;
        }).join('');

        const answerSection = this.isSolo ? `
          <div style="background: rgba(0,0,0,0.35); border: 1px solid ${isSolvedOrRevealed ? 'rgba(16,185,129,0.5)' : 'rgba(212,175,55,0.3)'}; border-radius: 12px; padding: 16px 18px;">
            <div style="font-size: 11px; font-weight: 800; color: ${isSolvedOrRevealed ? '#10b981' : '#38bdf8'}; letter-spacing: 2px;">
              ${isSolvedOrRevealed ? '🎉 ANSWER REVEALED:' : '🔒 GUESS THE EMOJIS (SOLO MODE):'}
            </div>
            ${isSolvedOrRevealed ? `
              <div style="font-size: 26px; font-weight: 900; color: #10b981; margin-top: 4px;">${p.answer}</div>
            ` : `
              <div style="margin-top: 10px; display: flex; gap: 8px;">
                <input id="solo-guess-input" type="text" placeholder="Type your guess here..." style="flex: 1; background: rgba(0,0,0,0.6); border: 1px solid rgba(212,175,55,0.4); color: #fff; padding: 10px 14px; border-radius: 8px; font-weight: 700; font-size: 15px;" onkeydown="if(event.key==='Enter') window.gameHost.checkSoloGuess()" />
                <button type="button" class="time-button" onclick="window.gameHost.checkSoloGuess()" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-weight: 900; border: none; padding: 0 16px;">
                  🎯 SUBMIT
                </button>
              </div>
            `}
            ${this.soloFeedback ? `
              <div style="margin-top: 10px; padding: 8px 12px; border-radius: 8px; font-weight: 800; font-size: 13px; background: ${this.soloFeedback.success ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color: ${this.soloFeedback.success ? '#34d399' : '#f87171'}; border: 1px solid ${this.soloFeedback.success ? '#10b981' : '#ef4444'};">
                ${this.soloFeedback.message}
              </div>
            ` : ''}
            <div style="margin-top: 12px; display: flex; flex-wrap: wrap; align-items: center;">${letterBoxes}</div>
            <div style="font-size: 13px; color: #facc15; font-weight: 700; margin-top: 10px;">💡 CLUE: ${p.hint || 'Decode the emojis!'}</div>
          </div>
        ` : `
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px; padding: 14px 18px;">
            <div style="font-size: 11px; font-weight: 800; color: #f59e0b; letter-spacing: 2px;">SECRET ANSWER (HOST ONLY):</div>
            <div style="font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 4px;">${p.answer}</div>
            <div style="margin-top: 10px; display: flex; flex-wrap: wrap; align-items: center;">${letterBoxes}</div>
            <div style="font-size: 13px; color: #38bdf8; font-weight: 700; margin-top: 8px;">💡 CLUE: ${p.hint || ''}</div>
          </div>
        `;

        html = `
          <div class="host-status" style="flex-direction: column; align-items: stretch; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div class="host-label">EMOJIS (${this.currentIndex + 1}/${this.prompts.length})</div>
                <div style="font-size: 52px; margin: 6px 0;">${p.emojis}</div>
              </div>
              <div style="text-align: right;">
                <div class="host-label">TIMER</div>
                <div class="host-timer" id="timer-display">${this.remainingSeconds}s</div>
              </div>
            </div>
            ${answerSection}
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="time-button" onclick="window.gameHost.revealEmojiLetter()" style="background: rgba(56,189,248,0.2); border-color: #38bdf8; color: #7dd3fc; font-weight: 800;">
                💡 REVEAL 1ST LETTER (${hintCount >= 1 ? 'ACTIVE' : 'OFF'})
              </button>
              <button type="button" class="time-button" onclick="window.gameHost.toggleAnswerReveal()" style="background: ${this.revealedAnswer ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #d4af37, #b89628)'}; color: #000; font-weight: 900;">
                ${this.revealedAnswer ? '🎉 ANSWER REVEALED (HIDE)' : (this.isSolo ? '👁️ GIVE UP & REVEAL ANSWER' : '🏆 REVEAL FULL ANSWER')}
              </button>
            </div>
          </div>
        `;
      } else if (this.gameId === 'unscramble-it') {
        const rawAns = (p.answer || '').toUpperCase();
        const firstLetter = rawAns[0] || '';
        const isSolvedOrRevealed = this.revealedAnswer;

        const answerSection = this.isSolo ? `
          <div style="background: rgba(0,0,0,0.35); border: 1px solid ${isSolvedOrRevealed ? 'rgba(16,185,129,0.5)' : 'rgba(56,189,248,0.3)'}; border-radius: 12px; padding: 16px 18px;">
            <div style="font-size: 11px; font-weight: 800; color: ${isSolvedOrRevealed ? '#10b981' : '#38bdf8'}; letter-spacing: 2px;">
              ${isSolvedOrRevealed ? '🎉 UNSCRAMBLED WORD REVEALED:' : '🔒 UNSCRAMBLE THE WORD (SOLO MODE):'}
            </div>
            ${isSolvedOrRevealed ? `
              <div style="font-size: 28px; font-weight: 900; color: #10b981; margin-top: 4px;">${p.answer}</div>
            ` : `
              <div style="margin-top: 10px; display: flex; gap: 8px;">
                <input id="solo-guess-input" type="text" placeholder="Type unscrambled word..." style="flex: 1; background: rgba(0,0,0,0.6); border: 1px solid rgba(56,189,248,0.4); color: #fff; padding: 10px 14px; border-radius: 8px; font-weight: 700; font-size: 15px;" onkeydown="if(event.key==='Enter') window.gameHost.checkSoloGuess()" />
                <button type="button" class="time-button" onclick="window.gameHost.checkSoloGuess()" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-weight: 900; border: none; padding: 0 16px;">
                  🎯 CHECK
                </button>
              </div>
            `}
            ${this.soloFeedback ? `
              <div style="margin-top: 10px; padding: 8px 12px; border-radius: 8px; font-weight: 800; font-size: 13px; background: ${this.soloFeedback.success ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color: ${this.soloFeedback.success ? '#34d399' : '#f87171'}; border: 1px solid ${this.soloFeedback.success ? '#10b981' : '#ef4444'};">
                ${this.soloFeedback.message}
              </div>
            ` : ''}
            <div style="font-size: 13px; color: #facc15; font-weight: 700; margin-top: 10px;">💡 CLUE: ${p.hint || 'Unscramble the letters!'}</div>
          </div>
        ` : `
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(56,189,248,0.3); border-radius: 12px; padding: 14px 18px;">
            <div style="font-size: 11px; font-weight: 800; color: #10b981; letter-spacing: 2px;">UNSCRAMBLED SOLUTION:</div>
            <div style="font-size: 26px; font-weight: 900; color: #ffffff; margin-top: 4px;">${p.answer}</div>
            <div style="font-size: 13px; color: #d4af37; font-weight: 700; margin-top: 8px;">💡 CLUE: ${p.hint || ''}</div>
          </div>
        `;

        html = `
          <div class="host-status" style="flex-direction: column; align-items: stretch; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div class="host-label">SCRAMBLED LETTERS (${this.currentIndex + 1}/${this.prompts.length})</div>
                <div style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #38bdf8; margin: 6px 0;">${p.scrambled}</div>
              </div>
              <div style="text-align: right;">
                <div class="host-label">TIMER</div>
                <div class="host-timer" id="timer-display">${this.remainingSeconds}s</div>
              </div>
            </div>
            ${answerSection}
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="time-button" onclick="window.gameHost.revealEmojiLetter()" style="background: rgba(56,189,248,0.2); border-color: #38bdf8; color: #7dd3fc; font-weight: 800;">
                💡 REVEAL 1ST LETTER [${firstLetter}]
              </button>
              <button type="button" class="time-button" onclick="window.gameHost.toggleAnswerReveal()" style="background: ${this.revealedAnswer ? '#10b981' : '#d4af37'}; color: #000; font-weight: 900;">
                ${this.revealedAnswer ? '🎉 REVEALED (HIDE)' : (this.isSolo ? '👁️ GIVE UP & REVEAL' : '🏆 REVEAL UNSCRAMBLE')}
              </button>
            </div>
          </div>
        `;
      } else if (this.gameId === 'who-dis') {
        const isSolvedOrRevealed = this.revealedAnswer;
        html = `
          <div class="host-status" style="flex-direction: column; align-items: flex-start; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div class="host-label">MYSTERY TARGET (${this.currentIndex + 1}/${this.prompts.length})</div>
              <div class="host-timer" id="timer-display">${this.remainingSeconds}s</div>
            </div>
            ${this.isSolo ? `
              <div style="width: 100%; background: rgba(0,0,0,0.35); border: 1px solid ${isSolvedOrRevealed ? 'rgba(16,185,129,0.5)' : 'rgba(212,175,55,0.3)'}; border-radius: 12px; padding: 14px 18px;">
                <div style="font-size: 11px; font-weight: 800; color: ${isSolvedOrRevealed ? '#10b981' : '#d4af37'}; letter-spacing: 2px;">
                  ${isSolvedOrRevealed ? '🎉 IDENTITY REVEALED:' : '🕵️ MYSTERY IDENTITY (GUESS USING CLUES):'}
                </div>
                ${isSolvedOrRevealed ? `
                  <div style="font-size: 26px; font-weight: 900; color: #facc15; margin-top: 4px;">${p.name}</div>
                ` : `
                  <div style="margin-top: 10px; display: flex; gap: 8px;">
                    <input id="solo-guess-input" type="text" placeholder="Who is this? Type name..." style="flex: 1; background: rgba(0,0,0,0.6); border: 1px solid rgba(212,175,55,0.4); color: #fff; padding: 10px 14px; border-radius: 8px; font-weight: 700; font-size: 15px;" onkeydown="if(event.key==='Enter') window.gameHost.checkSoloGuess()" />
                    <button type="button" class="time-button" onclick="window.gameHost.checkSoloGuess()" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-weight: 900; border: none; padding: 0 16px;">
                      🎯 CHECK
                    </button>
                  </div>
                `}
                ${this.soloFeedback ? `
                  <div style="margin-top: 10px; padding: 8px 12px; border-radius: 8px; font-weight: 800; font-size: 13px; background: ${this.soloFeedback.success ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color: ${this.soloFeedback.success ? '#34d399' : '#f87171'}; border: 1px solid ${this.soloFeedback.success ? '#10b981' : '#ef4444'};">
                    ${this.soloFeedback.message}
                  </div>
                ` : ''}
              </div>
            ` : `
              <div class="host-answer" style="color: #d4af37; font-size: 24px; font-weight: 900;">TARGET: ${p.name}</div>
            `}
            <div style="width: 100%;">
              <div style="padding: 10px 14px; background: ${this.revealedClues >= 1 ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)'}; margin: 4px 0; border-radius: 8px; border-left: 3px solid ${this.revealedClues >= 1 ? '#d4af37' : 'transparent'};"><b>CLUE 1 ($300):</b> ${p.clue1}</div>
              <div style="padding: 10px 14px; background: ${this.revealedClues >= 2 ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)'}; margin: 4px 0; border-radius: 8px; border-left: 3px solid ${this.revealedClues >= 2 ? '#d4af37' : 'transparent'};"><b>CLUE 2 ($200):</b> ${p.clue2}</div>
              <div style="padding: 10px 14px; background: ${this.revealedClues >= 3 ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)'}; margin: 4px 0; border-radius: 8px; border-left: 3px solid ${this.revealedClues >= 3 ? '#d4af37' : 'transparent'};"><b>CLUE 3 ($100):</b> ${p.clue3}</div>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="time-button" onclick="window.gameHost.setRevealedClues(1)">Show Clue 1</button>
              <button type="button" class="time-button" onclick="window.gameHost.setRevealedClues(2)">Show Clue 2</button>
              <button type="button" class="time-button" onclick="window.gameHost.setRevealedClues(3)">Show Clue 3</button>
              <button type="button" class="time-button" style="background:#d4af37; color:#000; font-weight:900;" onclick="window.gameHost.toggleAnswerReveal()">
                ${this.revealedAnswer ? 'Hide Identity' : (this.isSolo ? '👁️ Give Up & Reveal' : 'Reveal Identity')}
              </button>
            </div>
          </div>
        `;
      } else if (this.gameId === 'charades') {
        const actingTipsHtml = (p.actingTips || [
          "Establish the main object or motion with clear physical body language",
          "React with exaggerated facial expressions to show success or struggle",
          "Give chat warm/cold signals with your hand gestures to guide their guesses!"
        ]).map((step, idx) => `
          <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 10px; padding: 12px 16px; margin: 6px 0; display: flex; align-items: flex-start; gap: 12px; text-align: left;">
            <div style="background: #d4af37; color: #000; font-weight: 900; font-size: 13px; width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              ${idx + 1}
            </div>
            <div style="font-size: 15px; color: #f1f5f9; line-height: 1.4; font-weight: 600;">
              ${step}
            </div>
          </div>
        `).join('');

        html = `
          <div class="host-charades-panel" style="background: rgba(14, 28, 30, 0.95); border: 2px solid rgba(212, 175, 55, 0.4); border-radius: 16px; padding: 22px; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.6);">
            
            <!-- Top Bar: Category, Difficulty, Word count & Timer -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 14px; margin-bottom: 16px;">
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <span style="background: rgba(212, 175, 55, 0.2); border: 1px solid #d4af37; color: #f7e07d; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 900; letter-spacing: 1px;">
                  📁 ${p.category || 'CHARADES'} (${this.currentIndex + 1}/${this.prompts.length})
                </span>
                <span style="background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #6ee7b7; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 900;">
                  🟢 ${p.difficulty || 'SUPER EASY'}
                </span>
                <span style="background: rgba(56, 189, 248, 0.2); border: 1px solid #38bdf8; color: #7dd3fc; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 900;">
                  📝 ${p.words || (p.prompt ? p.prompt.split(' ').length : 3)} WORDS
                </span>
                <button type="button" class="time-button" onclick="window.gameHost.easySwapPrompt()" style="background: rgba(245, 158, 11, 0.25); border-color: #f59e0b; color: #fbbf24; font-size: 12px; font-weight: 900; padding: 4px 12px; border-radius: 20px;" title="Skip to another prompt instantly">
                  ⚡ 🎲 SWAP PROMPT
                </button>
              </div>

              <!-- Timer Display & +15s quick add -->
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="text-align: right;">
                  <div style="font-size: 10px; font-weight: 800; color: #94a3b8; letter-spacing: 1px;">ROUND CLOCK</div>
                  <div class="host-timer" id="timer-display" style="font-size: 28px; line-height: 1; font-weight: 900; color: #d4af37;">${this.remainingSeconds}s</div>
                </div>
                <button type="button" class="time-button" onclick="window.gameHost.addExtraTime(15)" style="padding: 6px 12px; font-size: 12px; font-weight: 900; background: rgba(56,189,248,0.2); border-color: #38bdf8; color: #7dd3fc;" title="Add 15 extra seconds without restarting">
                  +15s TIME
                </button>
              </div>
            </div>

            <!-- Main Prompt Display -->
            <div style="text-align: center; margin: 10px 0 20px;">
              <div style="font-size: 11px; font-weight: 900; letter-spacing: 3px; color: #f59e0b; margin-bottom: 6px;">
                🎭 YOUR SECRET ACTING PROMPT (AUDIENCE CANNOT SEE THIS)
              </div>
              <div style="font-size: 28px; font-weight: 900; color: #ffffff; text-shadow: 0 0 20px rgba(212,175,55,0.4); line-height: 1.35; max-width: 800px; margin: 0 auto;">
                "${p.prompt}"
              </div>
              ${p.hostSecret ? `
                <div style="margin-top: 12px; display: inline-flex; align-items: center; gap: 8px; background: rgba(212,175,55,0.12); border: 1px solid rgba(212,175,55,0.3); border-radius: 20px; padding: 6px 18px; color: #f7e07d; font-size: 13px; font-weight: 700;">
                  💡 <b>Host Quick Cue:</b> ${p.hostSecret}
                </div>
              ` : ''}
            </div>

            <!-- Acting Guide: Step-by-Step Gestures -->
            <div style="background: rgba(0,0,0,0.35); border-radius: 12px; padding: 16px 18px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.06);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="font-size: 12px; font-weight: 900; letter-spacing: 2px; color: #d4af37;">
                  🎬 HOW TO ACT THIS OUT (3 EASY PERFORMANCE STEPS)
                </div>
                <div style="font-size: 11px; color: #94a3b8; font-weight: 700;">
                  No talking • Big physical gestures!
                </div>
              </div>
              <div>
                ${actingTipsHtml}
              </div>
            </div>

            <!-- Audience Stage Controls: Clues & Reveal -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 18px; margin-bottom: 16px;">
              <div style="font-size: 12px; font-weight: 900; letter-spacing: 2px; color: #38bdf8; margin-bottom: 10px;">
                📺 AUDIENCE BROADCAST CONTROLS (SEND CLUES TO LIVE SCREEN)
              </div>
              <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                <button type="button" class="host-action-btn" onclick="window.gameHost.toggleWordCount()" style="background: ${this.showWordCount ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.05)'}; border-color: ${this.showWordCount ? '#38bdf8' : 'rgba(255,255,255,0.2)'}; color: ${this.showWordCount ? '#38bdf8' : '#fff'}; font-size: 12px;">
                  ${this.showWordCount ? '✅ WORD COUNT VISIBLE ON SCREEN' : '📝 SHOW WORD COUNT TO CHAT'}
                </button>
                <button type="button" class="host-action-btn" onclick="window.gameHost.toggleChatClue()" style="background: ${this.showChatClue ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.05)'}; border-color: ${this.showChatClue ? '#f59e0b' : 'rgba(255,255,255,0.2)'}; color: ${this.showChatClue ? '#f59e0b' : '#fff'}; font-size: 12px;">
                  ${this.showChatClue ? `✅ TOPIC CLUE VISIBLE (${p.chatClue || p.category})` : '💡 SHOW TOPIC HINT TO CHAT'}
                </button>
                <button type="button" class="host-action-btn" onclick="window.gameHost.revealCharadesAnswer()" style="margin-left: auto; background: ${this.revealedAnswer ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #d4af37, #b89628)'}; color: #020303; font-weight: 900; font-size: 13px; box-shadow: 0 4px 15px rgba(212,175,55,0.4);">
                  ${this.revealedAnswer ? '🎉 ANSWER REVEALED (CLICK TO HIDE)' : '🏆 CHAT GUESSED IT! REVEAL ANSWER 🎉'}
                </button>
              </div>
            </div>

            <!-- Live Feedback Reaction Teleprompter -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 18px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
                <div style="font-size: 12px; font-weight: 900; letter-spacing: 2px; color: #f43f5e;">
                  🤫 SILENT LIVE FEEDBACK (FLASH ANIMATED CUES ON AUDIENCE SCREEN)
                </div>
                ${this.charadesReaction ? `
                  <div style="font-size: 12px; font-weight: 900; color: #f7e07d;">
                    ACTIVE LIVE CUE: <span style="color: #38bdf8;">${this.charadesReaction}</span>
                  </div>
                ` : ''}
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                <button type="button" class="time-button" onclick="window.gameHost.sendCharadesReaction('WARMER')" style="background: rgba(245, 158, 11, 0.25); border-color: #f59e0b; color: #fbbf24; font-weight: 900;">
                  🔥 WARMER!
                </button>
                <button type="button" class="time-button" onclick="window.gameHost.sendCharadesReaction('ALMOST')" style="background: rgba(16, 185, 129, 0.25); border-color: #10b981; color: #6ee7b7; font-weight: 900;">
                  ⚡ SO CLOSE!
                </button>
                <button type="button" class="time-button" onclick="window.gameHost.sendCharadesReaction('COLD')" style="background: rgba(56, 189, 248, 0.25); border-color: #38bdf8; color: #7dd3fc; font-weight: 900;">
                  🥶 COLD / TRY AGAIN
                </button>
                <button type="button" class="time-button" onclick="window.gameHost.sendCharadesReaction('THUMBSUP')" style="background: rgba(212, 175, 55, 0.25); border-color: #d4af37; color: #f7e07d; font-weight: 900;">
                  👍 GOOD GUESS!
                </button>
                ${this.charadesReaction ? `
                  <button type="button" class="time-button" onclick="window.gameHost.clearCharadesReaction()" style="background: rgba(255,255,255,0.08); color: #94a3b8; font-size: 11px;">
                    ✕ Clear Cue
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Handy Standard Gestures Cheat Sheet -->
            <div style="margin-top: 14px; padding: 10px 14px; background: rgba(0,0,0,0.25); border-radius: 8px; font-size: 12px; color: #94a3b8; display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;">
              <span>☝️ <b>1 Finger:</b> Word 1</span>
              <span>✌️ <b>2 Fingers:</b> Word 2</span>
              <span>👂 <b>Tug Ear:</b> Sounds like</span>
              <span>🤏 <b>Pinch:</b> Small word</span>
              <span>🙅 <b>Cross Arms:</b> Nope / Cold</span>
              <span>🙆 <b>Arms Raised:</b> Yes / Warmer!</span>
            </div>

          </div>
        `;
      } else if (this.gameId === 'hangman') {
        const rawWord = (p.word || 'HANGMAN').toUpperCase();
        const category = p.category || 'GENERAL';
        const hint = p.hint || '';
        const difficulty = p.difficulty || 'MEDIUM';
        const strikes = this.hangmanState ? this.hangmanState.strikes : 0;
        const maxStrikes = 6;
        const status = this.hangmanState ? this.hangmanState.status : 'PLAYING';
        const guessedLetters = this.hangmanState ? this.hangmanState.guessedLetters : [];

        // Build word blanks preview for host
        const words = rawWord.split(' ');
        const blanksHtml = words.map(w => {
          const charBoxes = w.split('').map(ch => {
            if (/[A-Z]/.test(ch)) {
              const isGuessed = guessedLetters.includes(ch) || this.revealedAnswer;
              return `<span style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 42px; border-bottom: 3px solid ${isGuessed ? '#10b981' : '#d4af37'}; font-size: 26px; font-weight: 900; color: ${isGuessed ? '#ffffff' : 'rgba(255,255,255,0.2)'}; background: rgba(0,0,0,0.3); border-radius: 6px 6px 0 0; margin: 0 3px;">${isGuessed ? ch : '_'}</span>`;
            } else {
              return `<span style="font-size: 26px; font-weight: 900; color: #d4af37; margin: 0 3px;">${ch}</span>`;
            }
          }).join('');
          return `<div style="display: inline-flex; margin: 4px 10px;">${charBoxes}</div>`;
        }).join('');

        // Build strike meter indicators
        const strikeIndicators = [];
        const strikeLabels = ['Head', 'Body', 'L-Arm', 'R-Arm', 'L-Leg', 'R-Leg'];
        for (let i = 1; i <= maxStrikes; i++) {
          const isStruck = i <= strikes;
          strikeIndicators.push(`
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: ${isStruck ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : 'rgba(255,255,255,0.06)'}; border: 1.5px solid ${isStruck ? '#f87171' : 'rgba(255,255,255,0.2)'}; color: ${isStruck ? '#fff' : '#64748b'}; font-size: 13px; font-weight: 900; box-shadow: ${isStruck ? '0 0 10px rgba(239,68,68,0.5)' : 'none'};">
                ${isStruck ? '✕' : i}
              </span>
              <span style="font-size: 9px; font-weight: 800; color: ${isStruck ? '#fca5a5' : '#64748b'}; text-transform: uppercase;">${strikeLabels[i-1]}</span>
            </div>
          `);
        }

        // Build letter board (A-Z) in 3 rows: A-I (9), J-R (9), S-Z (8)
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const rows = [
          alphabet.slice(0, 9),
          alphabet.slice(9, 18),
          alphabet.slice(18, 26)
        ];

        const keyboardHtml = rows.map(row => {
          const keys = row.map(letter => {
            const isGuessed = guessedLetters.includes(letter);
            const isInWord = rawWord.includes(letter);
            if (isGuessed) {
              if (isInWord) {
                return `
                  <button type="button" disabled style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; border: 1.5px solid #34d399; font-weight: 900; font-size: 16px; border-radius: 8px; width: 42px; height: 44px; cursor: default; box-shadow: 0 0 10px rgba(16,185,129,0.35); display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1;">
                    <span>${letter}</span>
                    <span style="font-size: 8px; margin-top: 2px;">✓</span>
                  </button>
                `;
              } else {
                return `
                  <button type="button" disabled style="background: linear-gradient(135deg, #ef4444, #b91c1c); color: #ffffff; border: 1.5px solid #f87171; font-weight: 900; font-size: 16px; border-radius: 8px; width: 42px; height: 44px; cursor: default; box-shadow: 0 0 10px rgba(239,68,68,0.35); display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1;">
                    <span style="text-decoration: line-through;">${letter}</span>
                    <span style="font-size: 8px; margin-top: 2px;">✕</span>
                  </button>
                `;
              }
            } else {
              return `
                <button type="button" onclick="window.gameHost.guessLetter('${letter}')" style="background: rgba(255,255,255,0.08); color: #ffffff; border: 1.5px solid rgba(212,175,55,0.45); font-weight: 900; font-size: 16px; border-radius: 8px; width: 42px; height: 44px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.background='rgba(212,175,55,0.28)'; this.style.borderColor='#d4af37';" onmouseout="this.style.background='rgba(255,255,255,0.08)'; this.style.borderColor='rgba(212,175,55,0.45)';">
                  ${letter}
                </button>
              `;
            }
          }).join('');
          return `<div style="display: flex; gap: 6px; justify-content: center; margin: 4px 0;">${keys}</div>`;
        }).join('');

        // SVG Visual Stage
        const visualSvg = window.renderHangmanStageSvg ? window.renderHangmanStageSvg(strikes, status, 280, 220) : '';

        html = `
          <div class="host-status" style="flex-direction: column; align-items: stretch; gap: 16px; background: rgba(14, 28, 30, 0.8); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 16px; padding: 22px;">
            
            <!-- Top Header & Metadata -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <span style="font-size: 12px; font-weight: 900; letter-spacing: 2px; color: #d4af37; background: rgba(212,175,55,0.15); border: 1px solid #d4af37; padding: 5px 14px; border-radius: 20px;">
                  📁 ${category}
                </span>
                <span style="font-size: 11px; font-weight: 800; color: ${difficulty === 'EASY' ? '#34d399' : (difficulty === 'HARD' ? '#f87171' : '#fbbf24')}; background: rgba(255,255,255,0.06); padding: 5px 12px; border-radius: 12px;">
                  ${difficulty} • ${rawWord.replace(/[^A-Z]/g, '').length} LETTERS
                </span>
                <span style="font-size: 11px; color: #94a3b8; font-weight: 700;">
                  Prompt ${this.currentIndex + 1} of ${this.prompts.length}
                </span>
              </div>

              <!-- Round Clock & +15s time add -->
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="text-align: right;">
                  <div style="font-size: 10px; font-weight: 800; color: #94a3b8; letter-spacing: 1px;">ROUND CLOCK</div>
                  <div class="host-timer" id="timer-display" style="font-size: 28px; line-height: 1; font-weight: 900; color: #d4af37;">${this.remainingSeconds}s</div>
                </div>
                <button type="button" class="time-button" onclick="window.gameHost.addExtraTime(15)" style="padding: 6px 12px; font-size: 12px; font-weight: 900; background: rgba(56,189,248,0.2); border-color: #38bdf8; color: #7dd3fc;" title="Add 15 extra seconds without resetting">
                  +15s TIME
                </button>
              </div>
            </div>

            <!-- Secret Answer Card for Host / Solo Blanks Card -->
            ${this.isSolo ? `
              <div style="display: flex; flex-direction: column; align-items: center; text-align: center; background: rgba(0,0,0,0.35); border: 1px solid ${status === 'WON' ? 'rgba(16,185,129,0.6)' : (status === 'LOST' || this.revealedAnswer ? 'rgba(239,68,68,0.6)' : 'rgba(212,175,55,0.3)')}; border-radius: 14px; padding: 16px 20px;">
                <div style="font-size: 11px; font-weight: 900; letter-spacing: 3px; color: ${status === 'WON' ? '#10b981' : (status === 'LOST' || this.revealedAnswer ? '#ef4444' : '#34d399')}; margin-bottom: 6px;">
                  ${status === 'WON' ? '🏆 YOU WON! WORD SOLVED!' : (status === 'LOST' ? '💀 GAME OVER! THE WORD WAS:' : (this.revealedAnswer ? '👁️ WORD REVEALED:' : '👤 SOLO HANGMAN • GUESS LETTERS BELOW TO SOLVE'))}
                </div>
                ${(status === 'WON' || status === 'LOST' || this.revealedAnswer) ? `
                  <div style="font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: 2px; text-shadow: 0 0 20px rgba(212,175,55,0.5);">
                    "${rawWord}"
                  </div>
                ` : ''}
                ${hint ? `
                  <div style="margin-top: 8px; font-size: 14px; font-weight: 700; color: #f7e07d;">
                    💡 <b>Clue / Hint:</b> ${hint}
                  </div>
                ` : ''}
                <div style="margin-top: 16px; display: flex; flex-wrap: wrap; justify-content: center; gap: 6px;">
                  ${blanksHtml}
                </div>
                ${(status === 'PLAYING' && !this.revealedAnswer) ? `
                  <button type="button" class="time-button" onclick="window.gameHost.toggleAnswerReveal()" style="margin-top: 12px; font-size: 11px; padding: 6px 12px; background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.2); color: #94a3b8;">
                    👁️ Give Up & Reveal Word
                  </button>
                ` : ''}
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; align-items: center; text-align: center; background: rgba(0,0,0,0.35); border: 1px solid rgba(212,175,55,0.3); border-radius: 14px; padding: 16px 20px;">
                <div style="font-size: 11px; font-weight: 900; letter-spacing: 3px; color: #f59e0b; margin-bottom: 6px;">
                  🔒 SECRET WORD (HOST ONLY • CHAT SEES BLANKS)
                </div>
                <div style="font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: 2px; text-shadow: 0 0 20px rgba(212,175,55,0.5);">
                  "${rawWord}"
                </div>
                ${hint ? `
                  <div style="margin-top: 8px; font-size: 14px; font-weight: 700; color: #f7e07d;">
                    💡 <b>Clue / Hint:</b> ${hint}
                  </div>
                ` : ''}
                
                <!-- Word Blanks Preview -->
                <div style="margin-top: 16px; display: flex; flex-wrap: wrap; justify-content: center; gap: 6px;">
                  ${blanksHtml}
                </div>
              </div>
            `}

            <!-- Visual Stage Preview & Strike Meter -->
            <div style="display: grid; grid-template-columns: 280px 1fr; gap: 20px; align-items: center; background: rgba(0,0,0,0.28); border-radius: 14px; padding: 14px 18px;">
              <div>
                ${visualSvg}
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 900; letter-spacing: 2px; color: ${strikes >= 5 ? '#ef4444' : '#d4af37'};">
                    ⚡ HANGMAN STRIKES (${strikes} / ${maxStrikes})
                  </div>
                  <div style="font-size: 12px; font-weight: 800; color: ${status === 'WON' ? '#10b981' : (status === 'LOST' ? '#ef4444' : '#94a3b8')};">
                    ${status === 'WON' ? '🏆 CHAT SOLVED!' : (status === 'LOST' ? '💀 HANGMAN COMPLETED (OUT OF STRIKES)' : '🎮 IN PLAY')}
                  </div>
                </div>
                <div style="display: flex; justify-content: space-around; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 8px;">
                  ${strikeIndicators.join('')}
                </div>
                <div style="margin-top: 12px; font-size: 12px; color: #94a3b8; text-align: center;">
                  Tip: You can also tap letter keys <b>A-Z</b> directly on your physical keyboard to register guesses instantly!
                </div>
              </div>
            </div>

            <!-- Letter Grid Area (Click to Reveal / Strike) -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(212,175,55,0.25); border-radius: 14px; padding: 16px 18px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <div style="font-size: 12px; font-weight: 900; letter-spacing: 2px; color: #f7e07d;">
                  🔤 INTERACTIVE LETTER BOARD (CLICK TO GUESS FOR CHAT)
                </div>
                <div style="display: flex; gap: 14px; font-size: 11px; font-weight: 800;">
                  <span style="color: #34d399;">● Green: In Word</span>
                  <span style="color: #f87171;">● Red: Miss (Strike)</span>
                </div>
              </div>
              <div style="user-select: none;">
                ${keyboardHtml}
              </div>
            </div>

            <!-- Quick Action Control Bar -->
            <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px;">
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="host-action-btn" onclick="window.gameHost.swapHangmanWord()" style="background: rgba(212,175,55,0.15); border-color: #d4af37; color: #f7e07d; font-size: 12px;">
                  🎲 SWAP WORD
                </button>
                <button type="button" class="host-action-btn" onclick="window.gameHost.toggleHangmanHint()" style="background: ${this.hangmanState.showHint ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.05)'}; border-color: ${this.hangmanState.showHint ? '#f59e0b' : 'rgba(255,255,255,0.2)'}; color: ${this.hangmanState.showHint ? '#f59e0b' : '#fff'}; font-size: 12px;">
                  ${this.hangmanState.showHint ? '✅ HINT VISIBLE ON LIVE SCREEN' : '💡 SHOW HINT TO CHAT'}
                </button>
                <button type="button" class="host-action-btn" onclick="window.gameHost.resetHangmanRound()" style="background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.4); color: #fca5a5; font-size: 12px;">
                  ↩️ RESET ROUND
                </button>
              </div>
              <button type="button" class="host-action-btn" onclick="window.gameHost.solveHangman()" style="background: linear-gradient(135deg, #10b981, #059669); color: #020303; font-weight: 900; font-size: 13px; box-shadow: 0 4px 15px rgba(16,185,129,0.35);">
                🏆 CHAT SOLVED / REVEAL ALL
              </button>
            </div>

          </div>
        `;
      } else if (this.gameId === 'would-you-rather') {
        const total = (this.votes.optionA || 0) + (this.votes.optionB || 0);
        const pctA = total > 0 ? Math.round((this.votes.optionA / total) * 100) : 50;
        const pctB = total > 0 ? 100 - pctA : 50;
        html = `
          <div class="host-status" style="flex-direction: column; align-items: flex-start; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div class="host-label">WOULD YOU RATHER (${this.currentIndex + 1}/${this.prompts.length})</div>
              <div class="host-timer" id="timer-display">${this.remainingSeconds}s</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; margin: 8px 0;">
              <div style="background: rgba(56,189,248,0.12); border: 2px solid #38bdf8; padding: 16px; border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div style="font-size: 11px; font-weight: 900; color: #38bdf8;">OPTION A</div>
                  <div style="font-size: 20px; font-weight: 900; color: #38bdf8;">${pctA}%</div>
                </div>
                <div style="font-size: 18px; font-weight: 800; margin: 8px 0; color: #fff;">${p.optionA}</div>
                <div style="display: flex; gap: 6px; margin-top: 10px;">
                  <button type="button" class="time-button" onclick="window.gameHost.addVote('A', 1)">+1 (${this.votes.optionA})</button>
                  <button type="button" class="time-button" onclick="window.gameHost.addVote('A', 5)">+5 Votes</button>
                </div>
              </div>
              <div style="background: rgba(244,63,94,0.12); border: 2px solid #f43f5e; padding: 16px; border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div style="font-size: 11px; font-weight: 900; color: #f43f5e;">OPTION B</div>
                  <div style="font-size: 20px; font-weight: 900; color: #f43f5e;">${pctB}%</div>
                </div>
                <div style="font-size: 18px; font-weight: 800; margin: 8px 0; color: #fff;">${p.optionB}</div>
                <div style="display: flex; gap: 6px; margin-top: 10px;">
                  <button type="button" class="time-button" onclick="window.gameHost.addVote('B', 1)">+1 (${this.votes.optionB})</button>
                  <button type="button" class="time-button" onclick="window.gameHost.addVote('B', 5)">+5 Votes</button>
                </div>
              </div>
            </div>
            <button type="button" class="time-button" style="font-size: 11px; padding: 4px 10px;" onclick="window.gameHost.resetVotes()">🔄 RESET VOTES</button>
          </div>
        `;
      } else if (this.gameId === 'guess-the-lyrics') {
        const rawAns = (p.missingLyrics || '').toUpperCase();
        const isSolvedOrRevealed = this.revealedAnswer;

        // Formatted missing lyric blanks
        let blanksDisplay = '';
        if (isSolvedOrRevealed) {
          blanksDisplay = `
            <div style="margin-top: 15px; padding: 16px 20px; background: linear-gradient(135deg, rgba(16,185,129,0.25), rgba(212,175,55,0.2)); border: 2.5px solid #10b981; border-radius: 14px; color: #ffffff; font-size: 26px; font-weight: 900; letter-spacing: 2px; text-shadow: 0 0 25px rgba(16,185,129,0.8); text-align: center;">
              🎶 "${p.missingLyrics}" 🎶
            </div>
          `;
        } else if (this.showLyricsFirstLetter) {
          const letterHints = rawAns.split(' ').map(w => {
            if (!w) return '';
            const first = w[0];
            const rest = '_'.repeat(Math.max(1, w.length - 1));
            return `<span style="display:inline-block; margin:0 5px; font-family:monospace; letter-spacing:2px; font-size:22px; color:#38bdf8; font-weight:900;">${first}${rest}</span>`;
          }).join(' ');
          blanksDisplay = `
            <div style="margin-top: 15px; padding: 14px 18px; background: rgba(0,0,0,0.5); border: 2px dashed #38bdf8; border-radius: 12px; text-align: center;">
              <div style="font-size: 11px; font-weight: 800; color: #38bdf8; letter-spacing: 2px; margin-bottom: 8px;">🔤 1ST LETTER HINTS:</div>
              <div>${letterHints}</div>
            </div>
          `;
        } else {
          blanksDisplay = `
            <div style="margin-top: 15px; padding: 16px 20px; background: rgba(0,0,0,0.4); border: 2px dashed rgba(212,175,55,0.5); border-radius: 12px; color: #f7e07d; font-size: 20px; font-weight: 800; letter-spacing: 3px; text-align: center;">
              [ 🎵 ___________________________________ ? ]
            </div>
          `;
        }

        const songMetaDisplay = (this.showLyricsSongArtist || isSolvedOrRevealed) ? `
          <div style="margin-top: 12px; padding: 12px 18px; background: rgba(212,175,55,0.15); border: 1.5px solid #d4af37; border-radius: 10px; font-size: 16px; font-weight: 900; color: #f7e07d; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span>🎵 "${p.song}" — <span style="color:#ffffff;">${p.artist}</span></span>
            <span style="font-size: 12px; color: #94a3b8; background: rgba(0,0,0,0.4); padding: 3px 8px; border-radius: 6px;">${p.year || ''}</span>
          </div>
        ` : (this.showLyricsEra ? `
          <div style="margin-top: 12px; padding: 10px 16px; background: rgba(56,189,248,0.15); border: 1.5px solid #38bdf8; border-radius: 10px; font-size: 13px; font-weight: 800; color: #38bdf8;">
            📅 ERA / GENRE: ${p.year || ''} • ${p.genre || p.category}
          </div>
        ` : '');

        const answerSection = this.isSolo ? `
          <div style="background: rgba(0,0,0,0.35); border: 1px solid ${isSolvedOrRevealed ? 'rgba(16,185,129,0.5)' : 'rgba(212,175,55,0.3)'}; border-radius: 12px; padding: 16px 18px;">
            <div style="font-size: 11px; font-weight: 800; color: ${isSolvedOrRevealed ? '#10b981' : '#38bdf8'}; letter-spacing: 2px;">
              ${isSolvedOrRevealed ? '🎉 LYRICS SOLVED / REVEALED:' : '🎤 FINISH THE LYRIC (SOLO GUESS):'}
            </div>
            ${isSolvedOrRevealed ? `
              <div style="font-size: 24px; font-weight: 900; color: #10b981; margin-top: 4px;">"${p.missingLyrics}"</div>
              <div style="font-size: 15px; font-weight: 800; color: #f7e07d; margin-top: 4px;">From "${p.song}" by ${p.artist} (${p.year || ''})</div>
            ` : `
              <div style="margin-top: 10px; display: flex; gap: 8px;">
                <input id="solo-guess-input" type="text" placeholder="Type the missing lyric line here..." style="flex: 1; background: rgba(0,0,0,0.6); border: 1px solid rgba(212,175,55,0.4); color: #fff; padding: 10px 14px; border-radius: 8px; font-weight: 700; font-size: 15px;" onkeydown="if(event.key==='Enter') window.gameHost.checkSoloGuess()" />
                <button type="button" class="time-button" onclick="window.gameHost.checkSoloGuess()" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-weight: 900; border: none; padding: 0 16px;">
                  🎤 SUBMIT
                </button>
              </div>
            `}
            ${this.soloFeedback ? `
              <div style="margin-top: 10px; padding: 10px 14px; border-radius: 8px; font-weight: 800; font-size: 13px; background: ${this.soloFeedback.success ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color: ${this.soloFeedback.success ? '#34d399' : '#f87171'}; border: 1px solid ${this.soloFeedback.success ? '#10b981' : '#ef4444'};">
                ${this.soloFeedback.message}
              </div>
            ` : ''}
            ${songMetaDisplay}
            <div style="font-size: 13px; color: #facc15; font-weight: 700; margin-top: 10px;">💡 CLUE: ${p.hint || ''}</div>
          </div>
        ` : `
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px; padding: 16px 18px;">
            <div style="font-size: 11px; font-weight: 800; color: #f59e0b; letter-spacing: 2px;">SECRET ANSWER & TRACK INFO (HOST ONLY):</div>
            <div style="font-size: 22px; font-weight: 900; color: #ffffff; margin-top: 4px;">
              🎵 "${p.song}" — <span style="color: #38bdf8;">${p.artist}</span> <span style="font-size: 14px; color: #94a3b8;">(${p.year || ''})</span>
            </div>
            <div style="margin-top: 10px; font-size: 18px; font-weight: 900; color: #10b981; background: rgba(16,185,129,0.15); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(16,185,129,0.3);">
              🔑 MISSING LYRIC: "${p.missingLyrics}"
            </div>
            <div style="font-size: 13px; color: #facc15; font-weight: 700; margin-top: 10px;">💡 HOST / TRIVIA TIP: ${p.hint || ''}</div>
          </div>
        `;

        html = `
          <div class="host-status" style="flex-direction: column; align-items: stretch; gap: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">🎤</span>
                <div>
                  <div class="host-label">${p.category || 'R&B TO GOSPEL'} (${this.currentIndex + 1}/${this.prompts.length})</div>
                  <div style="font-size: 13px; font-weight: 800; color: #38bdf8;">${p.genre || 'Soul'} • <span style="color: #a7f3d0;">${p.difficulty || 'MEDIUM'}</span></div>
                </div>
              </div>
              <div style="text-align: right;">
                <div class="host-label">TIMER</div>
                <div class="host-timer" id="timer-display">${this.remainingSeconds}s</div>
              </div>
            </div>

            <!-- Verse Lyric Snippet Card -->
            <div style="background: rgba(14,28,30,0.85); border: 2px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 22px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);">
              <div style="font-size: 11px; font-weight: 900; letter-spacing: 3px; color: #d4af37; margin-bottom: 8px;">SING THE NEXT LINE:</div>
              <div style="font-size: 24px; font-weight: 900; line-height: 1.4; color: #ffffff; font-style: italic;">
                "${p.lyricsSnippet}"
              </div>
              ${blanksDisplay}
            </div>

            ${answerSection}

            <!-- Host Action Controls -->
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="time-button" onclick="window.gameHost.toggleLyricsSongArtist()" style="background: ${this.showLyricsSongArtist ? 'rgba(16,185,129,0.3)' : 'rgba(56,189,248,0.2)'}; border-color: ${this.showLyricsSongArtist ? '#10b981' : '#38bdf8'}; color: ${this.showLyricsSongArtist ? '#6ee7b7' : '#7dd3fc'}; font-weight: 800;">
                🎵 ${this.showLyricsSongArtist ? 'HIDE ARTIST & SONG' : 'REVEAL ARTIST & SONG'}
              </button>
              <button type="button" class="time-button" onclick="window.gameHost.toggleLyricsFirstLetter()" style="background: ${this.showLyricsFirstLetter ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}; border-color: ${this.showLyricsFirstLetter ? '#d4af37' : 'rgba(255,255,255,0.2)'}; color: ${this.showLyricsFirstLetter ? '#f7e07d' : '#fff'}; font-weight: 800;">
                🔤 1ST LETTER HINTS (${this.showLyricsFirstLetter ? 'ON' : 'OFF'})
              </button>
              <button type="button" class="time-button" onclick="window.gameHost.toggleLyricsEra()" style="background: ${this.showLyricsEra ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.08)'}; border-color: ${this.showLyricsEra ? '#38bdf8' : 'rgba(255,255,255,0.2)'}; color: ${this.showLyricsEra ? '#7dd3fc' : '#94a3b8'}; font-weight: 800;">
                📅 ERA & GENRE (${this.showLyricsEra ? 'ON' : 'OFF'})
              </button>
              <button type="button" class="time-button" onclick="window.gameHost.toggleAnswerReveal()" style="background: ${this.revealedAnswer ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #d4af37, #b89628)'}; color: #000; font-weight: 900;">
                ${this.revealedAnswer ? '🎉 ANSWER REVEALED (HIDE)' : (this.isSolo ? '👁️ GIVE UP & REVEAL ANSWER' : '🏆 REVEAL MISSING LYRIC')}
              </button>
              <button type="button" class="time-button" onclick="window.gameHost.addExtraTime(15)" style="background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); color: #fff;">
                ⏱️ +15S
              </button>
              <button type="button" class="time-button" onclick="window.gameHost.easySwapPrompt()" style="background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); color: #fff;">
                🎲 SWAP SONG
              </button>
            </div>
          </div>
        `;
      } else {
        // Generic fallback
        html = `
          <div class="host-status">
            <div>
              <div class="host-label">PROMPT (${this.currentIndex + 1}/${this.prompts.length})</div>
              <div class="host-category">${p.word || p.prompt || p.setup || 'Game Prompt'}</div>
            </div>
            <div style="text-align: right;">
              <div class="host-label">TIMER</div>
              <div class="host-timer" id="timer-display">${this.remainingSeconds}</div>
            </div>
          </div>
        `;
      }

      container.innerHTML = html;
    }

    setDuration(seconds) {
      this.timerSeconds = seconds;
      this.remainingSeconds = seconds;
      this.renderControls();
      const timerEl = document.getElementById('timer-display');
      if (timerEl) timerEl.textContent = this.remainingSeconds;
      this.broadcastState();
    }

    startTimer() {
      if (this.isRunning) {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        const btn = document.getElementById('btn-start-timer');
        if (btn) btn.textContent = '▶ START TIMER';
        this.broadcastState();
        return;
      }

      this.isRunning = true;
      const btn = document.getElementById('btn-start-timer');
      if (btn) btn.textContent = '⏸ PAUSE TIMER';

      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.remainingSeconds > 0) {
          this.remainingSeconds--;
          const timerEl = document.getElementById('timer-display');
          if (timerEl) timerEl.textContent = this.remainingSeconds;

          if (this.remainingSeconds <= 3 && this.remainingSeconds > 0) {
            this.playSound('tick');
          }
          this.broadcastState();
        } else {
          clearInterval(this.timerInterval);
          this.isRunning = false;
          if (btn) btn.textContent = '▶ START TIMER';
          this.playSound('buzz');
          this.broadcastState();
        }
      }, 1000);

      this.broadcastState();
    }

    nextPrompt() {
      this.currentIndex = (this.currentIndex + 1) % this.prompts.length;
      this.remainingSeconds = this.timerSeconds;
      this.revealedClues = 1;
      this.revealedAnswer = false;
      this.soloFeedback = null;
      this.votes = { optionA: 0, optionB: 0 };
      this.scenarioVotes = { A: 0, B: 0, C: 0, D: 0 };
      this.chatWinner = '';
      this.emojiLetterHintCount = 0;
      this.selectedPick = null;
      this.showLyricsSongArtist = false;
      this.showLyricsFirstLetter = false;
      this.showLyricsEra = false;
      this.showWordCount = false;
      this.showChatClue = false;
      this.charadesReaction = null;
      if (this.charadesReactionTimer) clearTimeout(this.charadesReactionTimer);
      if (this.gameId === 'hangman') {
        this.hangmanState = {
          guessedLetters: [],
          strikes: 0,
          maxStrikes: 6,
          status: 'PLAYING',
          showHint: false
        };
      }
      if (this.isRunning) {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        const btn = document.getElementById('btn-start-timer');
        if (btn) btn.textContent = '▶ START TIMER';
      }
      this.renderControls();
      this.renderPrompt();
      this.broadcastState();
    }

    prevPrompt() {
      this.currentIndex = (this.currentIndex - 1 + this.prompts.length) % this.prompts.length;
      this.remainingSeconds = this.timerSeconds;
      this.revealedClues = 1;
      this.revealedAnswer = false;
      this.soloFeedback = null;
      this.votes = { optionA: 0, optionB: 0 };
      this.scenarioVotes = { A: 0, B: 0, C: 0, D: 0 };
      this.chatWinner = '';
      this.emojiLetterHintCount = 0;
      this.selectedPick = null;
      this.showLyricsSongArtist = false;
      this.showLyricsFirstLetter = false;
      this.showLyricsEra = false;
      this.showWordCount = false;
      this.showChatClue = false;
      this.charadesReaction = null;
      if (this.charadesReactionTimer) clearTimeout(this.charadesReactionTimer);
      if (this.gameId === 'hangman') {
        this.hangmanState = {
          guessedLetters: [],
          strikes: 0,
          maxStrikes: 6,
          status: 'PLAYING',
          showHint: false
        };
      }
      this.renderControls();
      this.renderPrompt();
      this.broadcastState();
    }

    checkSoloGuess() {
      const input = document.getElementById('solo-guess-input');
      if (!input) return;
      const guess = input.value.trim().toLowerCase();
      if (!guess) return;

      const p = this.prompts[this.currentIndex];
      if (!p) return;

      let target = '';
      if (this.gameId === 'emoji-guess') target = (p.answer || '').toLowerCase();
      else if (this.gameId === 'unscramble-it') target = (p.answer || '').toLowerCase();
      else if (this.gameId === 'who-dis') target = (p.name || '').toLowerCase();
      else if (this.gameId === 'guess-the-lyrics') {
        const cleanGuess = guess.replace(/[^a-z0-9]/g, '');
        const cleanTarget = (p.missingLyrics || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const acceptable = (p.acceptableAnswers || []).map(a => a.toLowerCase().replace(/[^a-z0-9]/g, ''));

        const isMatch = (cleanGuess && cleanTarget && (
          cleanGuess === cleanTarget ||
          acceptable.includes(cleanGuess) ||
          (cleanGuess.length >= 6 && cleanTarget.includes(cleanGuess)) ||
          (cleanTarget.length >= 6 && cleanGuess.includes(cleanTarget))
        ));

        if (isMatch) {
          this.revealedAnswer = true;
          this.showLyricsSongArtist = true;
          this.soloFeedback = { success: true, message: `🎉 SANG IT PERFECTLY! "${p.missingLyrics}" from "${p.song}" by ${p.artist}!` };
          this.playSound('solve');
        } else {
          this.soloFeedback = { success: false, message: `❌ Not quite! You guessed "${input.value.trim()}". Check the rhythm and try again!` };
          this.playSound('wrong');
        }
        this.renderPrompt();
        this.broadcastState();
        return;
      }

      const cleanGuess = guess.replace(/[^a-z0-9]/g, '');
      const cleanTarget = target.replace(/[^a-z0-9]/g, '');

      if (cleanGuess && cleanTarget && cleanGuess === cleanTarget) {
        this.revealedAnswer = true;
        this.soloFeedback = { success: true, message: `🎉 CORRECT! The answer is "${p.answer || p.name}"!` };
        this.playSound('solve');
      } else {
        this.soloFeedback = { success: false, message: `❌ Not quite! You guessed "${input.value.trim()}". Try again!` };
        this.playSound('wrong');
      }
      this.renderPrompt();
      this.broadcastState();
    }

    easySwapPrompt() {
      this.soloFeedback = null;
      this.pickRandomInCategory();
    }

    addExtraTime(sec = 15) {
      this.remainingSeconds += sec;
      const timerEl = document.getElementById('timer-display');
      if (timerEl) timerEl.textContent = this.remainingSeconds + (this.gameId === 'charades' ? 's' : '');
      this.playSound('tick');
      this.broadcastState();
    }

    toggleWordCount() {
      this.showWordCount = !this.showWordCount;
      this.renderPrompt();
      if (this.showWordCount) this.playSound('correct');
      this.broadcastState();
    }

    toggleChatClue() {
      this.showChatClue = !this.showChatClue;
      this.renderPrompt();
      if (this.showChatClue) this.playSound('correct');
      this.broadcastState();
    }

    sendCharadesReaction(type) {
      const labels = {
        WARMER: "🔥 GETTING WARMER!",
        ALMOST: "⚡ SO CLOSE! ALMOST GOT IT!",
        COLD: "🥶 COLD / TRY AGAIN",
        THUMBSUP: "👍 GREAT GUESS!"
      };
      this.charadesReaction = labels[type] || type;
      if (type === 'WARMER' || type === 'ALMOST' || type === 'THUMBSUP') {
        this.playSound('correct');
      } else {
        this.playSound('buzz');
      }
      this.renderPrompt();
      this.broadcastState();

      if (this.charadesReactionTimer) clearTimeout(this.charadesReactionTimer);
      this.charadesReactionTimer = setTimeout(() => {
        this.charadesReaction = null;
        this.renderPrompt();
        this.broadcastState();
      }, 5000);
    }

    clearCharadesReaction() {
      if (this.charadesReactionTimer) clearTimeout(this.charadesReactionTimer);
      this.charadesReaction = null;
      this.renderPrompt();
      this.broadcastState();
    }

    revealCharadesAnswer() {
      this.revealedAnswer = !this.revealedAnswer;
      this.renderPrompt();
      if (this.revealedAnswer) {
        this.playSound('solve');
      }
      this.broadcastState();
    }

    setRevealedClues(num) {
      this.revealedClues = num;
      this.renderPrompt();
      this.playSound('correct');
      this.broadcastState();
    }

    toggleAnswerReveal() {
      this.revealedAnswer = !this.revealedAnswer;
      this.renderPrompt();
      if (this.revealedAnswer) this.playSound('solve');
      this.broadcastState();
    }

    addVote(option, count = 1) {
      if (option === 'A') this.votes.optionA += count;
      if (option === 'B') this.votes.optionB += count;
      this.playSound('tick');
      this.renderPrompt();
      this.broadcastState();
    }

    resetVotes() {
      this.votes = { optionA: 0, optionB: 0 };
      this.renderPrompt();
      this.broadcastState();
    }

    setChatWinner(name) {
      if (!name) return;
      this.chatWinner = name;
      this.playSound('solve');
      this.renderPrompt();
      this.broadcastState();
    }

    clearChatWinner() {
      this.chatWinner = '';
      this.renderPrompt();
      this.broadcastState();
    }

    revealEmojiLetter() {
      this.emojiLetterHintCount = (this.emojiLetterHintCount || 0) + 1;
      this.playSound('correct');
      this.renderPrompt();
      this.broadcastState();
    }

    resetEmojiHint() {
      this.emojiLetterHintCount = 0;
      this.renderPrompt();
      this.broadcastState();
    }

    selectPickChoice(choice) {
      this.selectedPick = (this.selectedPick === choice ? null : choice);
      if (this.selectedPick) this.playSound('solve');
      this.renderPrompt();
      this.broadcastState();
    }

    voteScenario(key, count = 1) {
      if (!this.scenarioVotes) this.scenarioVotes = { A: 0, B: 0, C: 0, D: 0 };
      this.scenarioVotes[key] = (this.scenarioVotes[key] || 0) + count;
      this.playSound('tick');
      this.renderPrompt();
      this.broadcastState();
    }

    resetScenarioVotes() {
      this.scenarioVotes = { A: 0, B: 0, C: 0, D: 0 };
      this.renderPrompt();
      this.broadcastState();
    }

    toggleLyricsSongArtist() {
      this.showLyricsSongArtist = !this.showLyricsSongArtist;
      this.renderPrompt();
      this.playSound('correct');
      this.broadcastState();
    }

    toggleLyricsFirstLetter() {
      this.showLyricsFirstLetter = !this.showLyricsFirstLetter;
      this.renderPrompt();
      this.playSound('tick');
      this.broadcastState();
    }

    toggleLyricsEra() {
      this.showLyricsEra = !this.showLyricsEra;
      this.renderPrompt();
      this.playSound('tick');
      this.broadcastState();
    }

    guessLetter(letter) {
      if (this.gameId !== 'hangman') return;
      letter = String(letter).toUpperCase();
      if (!letter || !/^[A-Z]$/.test(letter)) return;

      if (!this.hangmanState) {
        this.hangmanState = {
          guessedLetters: [],
          strikes: 0,
          maxStrikes: 6,
          status: 'PLAYING',
          showHint: false
        };
      }

      // If already solved or lost, ignore further guesses
      if (this.hangmanState.status !== 'PLAYING') return;

      // If already guessed, return
      if (this.hangmanState.guessedLetters.includes(letter)) return;

      this.hangmanState.guessedLetters.push(letter);

      const p = this.prompts[this.currentIndex] || {};
      const targetWord = (p.word || '').toUpperCase();

      if (targetWord.includes(letter)) {
        // Correct letter!
        this.playSound('correct');

        // Check if all alphabetical characters in word are guessed!
        const lettersInWord = targetWord.split('').filter(ch => /[A-Z]/.test(ch));
        const allGuessed = lettersInWord.every(ch => this.hangmanState.guessedLetters.includes(ch));
        if (allGuessed) {
          this.hangmanState.status = 'WON';
          this.revealedAnswer = true;
          this.playSound('solve');
          if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            const btn = document.getElementById('btn-start-timer');
            if (btn) btn.textContent = '▶ START TIMER';
          }
        }
      } else {
        // Wrong letter -> Strike!
        this.hangmanState.strikes = Math.min(6, this.hangmanState.strikes + 1);
        this.playSound('buzz');

        if (this.hangmanState.strikes >= 6) {
          this.hangmanState.status = 'LOST';
          this.revealedAnswer = true;
          if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            const btn = document.getElementById('btn-start-timer');
            if (btn) btn.textContent = '▶ START TIMER';
          }
        }
      }

      this.renderPrompt();
      this.broadcastState();
    }

    resetHangmanRound() {
      if (this.gameId !== 'hangman') return;
      this.hangmanState = {
        guessedLetters: [],
        strikes: 0,
        maxStrikes: 6,
        status: 'PLAYING',
        showHint: false
      };
      this.revealedAnswer = false;
      this.remainingSeconds = this.timerSeconds;
      this.renderPrompt();
      this.broadcastState();
      this.playSound('tick');
    }

    solveHangman() {
      if (this.gameId !== 'hangman') return;
      if (!this.hangmanState) {
        this.hangmanState = { guessedLetters: [], strikes: 0, maxStrikes: 6, status: 'PLAYING', showHint: false };
      }
      this.hangmanState.status = 'WON';
      this.revealedAnswer = true;
      const p = this.prompts[this.currentIndex] || {};
      const targetWord = (p.word || '').toUpperCase();
      const allChars = targetWord.split('').filter(ch => /[A-Z]/.test(ch));
      allChars.forEach(ch => {
        if (!this.hangmanState.guessedLetters.includes(ch)) {
          this.hangmanState.guessedLetters.push(ch);
        }
      });
      if (this.isRunning) {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        const btn = document.getElementById('btn-start-timer');
        if (btn) btn.textContent = '▶ START TIMER';
      }
      this.renderPrompt();
      this.broadcastState();
      this.playSound('solve');
    }

    toggleHangmanHint() {
      if (this.gameId !== 'hangman') return;
      if (!this.hangmanState) {
        this.hangmanState = { guessedLetters: [], strikes: 0, maxStrikes: 6, status: 'PLAYING', showHint: false };
      }
      this.hangmanState.showHint = !this.hangmanState.showHint;
      this.renderPrompt();
      this.broadcastState();
      if (this.hangmanState.showHint) {
        this.playSound('correct');
      }
    }

    swapHangmanWord() {
      this.pickRandomInCategory();
    }

    playSound(sound) {
      if (window.Sounds && typeof window.Sounds[sound] === 'function') {
        window.Sounds[sound]();
      }
      this.channel.postMessage({
        type: 'PLAY_SOUND',
        gameId: this.gameId,
        sound: sound
      });
    }

    openLiveWindow() {
      window.open('live.html', '_blank');
    }

    broadcastState() {
      const currentPrompt = this.prompts[this.currentIndex] || {};
      const state = {
        gameId: this.gameId,
        currentIndex: this.currentIndex,
        selectedCategory: this.selectedCategory,
        category: currentPrompt.category || this.selectedCategory || this.gameMeta.badge || 'STREAM GAME',
        prompt: currentPrompt,
        showWaitingScreen: this.showWaitingScreen,
        remainingSeconds: this.remainingSeconds,
        isRunning: this.isRunning,
        revealedClues: this.revealedClues,
        revealedAnswer: this.revealedAnswer,
        votes: this.votes,
        scenarioVotes: this.scenarioVotes || { A: 0, B: 0, C: 0, D: 0 },
        chatWinner: this.chatWinner,
        emojiLetterHintCount: this.emojiLetterHintCount || 0,
        selectedPick: this.selectedPick,
        showLyricsSongArtist: this.showLyricsSongArtist,
        showLyricsFirstLetter: this.showLyricsFirstLetter,
        showLyricsEra: this.showLyricsEra,
        contestants: this.contestants,
        showScoreboard: this.showScoreboard,
        showWordCount: this.showWordCount,
        showChatClue: this.showChatClue,
        charadesReaction: this.charadesReaction,
        hangmanState: this.hangmanState ? {
          guessedLetters: [...this.hangmanState.guessedLetters],
          strikes: this.hangmanState.strikes,
          maxStrikes: 6,
          status: this.hangmanState.status,
          showHint: this.hangmanState.showHint
        } : null,
        timestamp: Date.now()
      };

      try {
        sessionStorage.setItem(`dion_stream_game_${this.gameId}`, JSON.stringify(state));
      } catch (e) {}

      this.channel.postMessage({
        type: 'UPDATE_STATE',
        state: state
      });
    }
  }

  window.StreamGameHost = StreamGameHost;
})();
