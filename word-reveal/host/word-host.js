/**
 * Word Reveal Mystery - Master Host Controller
 * Full orchestration of puzzle mysteries, 3D flip tiles, progressive hint tiers,
 * stream autopilot, live chat guessing, and synchronized spectator displays.
 */
(function () {
  let allPuzzles = [];
  let filteredPuzzles = [];
  let currentPuzzleIndex = 0;
  let currentPuzzle = null;
  let isSolutionBlurred = false;

  // Autopilot
  let isAutopilot = false;
  let autopilotPace = 5;
  let isIntermission = false;

  // Chat Leaderboard & Bot Sim
  let chatLeaderboard = {};
  let isChatSimActive = false;
  let chatSimTimer = null;

  // Broadcast Channels
  const channel = new BroadcastChannel('dionlyonee-word-reveal-channel');
  const channelAlt = new BroadcastChannel('dionlyonee-word-reveal');

  // Simulated Chatters pool
  const SIM_CHATTERS = [
    'RiddimKing99', 'IslandBreeze', 'DancehallDiva', 'KingstonVibes',
    'SelectorMax', 'TriniSocaFan', 'YardieGamer', 'BigUpDion',
    'FirePassa', 'JamRockQueen', 'ReggaeRoots87', 'WaveRunner'
  ];

  /* =====================================================
     AUDIO SYNTHESIS (FALLBACK & SOUND MANAGER)
  ===================================================== */
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      if (AudioClass) audioCtx = new AudioClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSynthSound(type) {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'tile') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'vowels') {
        [523.25, 659.25, 783.99].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + (i * 0.06);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.15, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.22);
        });
      } else if (type === 'clue') {
        [440, 554.37, 659.25].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + (i * 0.08);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.35);
        });
      } else if (type === 'solve') {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + (i * 0.09);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.5);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {}
  }

  function playSound(name) {
    if (window.SoundManager && typeof window.SoundManager.playSound === 'function') {
      window.SoundManager.playSound(name, true);
    } else {
      playSynthSound(name);
    }
  }

  /* =====================================================
     INITIALIZATION & DATA LOADING
  ===================================================== */
  function init() {
    loadLeaderboard();

    if (window.HostAuth) {
      window.HostAuth.requireHostAccess(() => {
        setupHost();
      });
    } else {
      setupHost();
    }
  }

  function setupHost() {
    if (window.RoomUI) {
      window.RoomUI.attachHUD('.main-header', 'word-reveal');
    }

    const phrases = window.PhrasesData || [];
    const words = window.WordsData || [];
    allPuzzles = [...phrases, ...words];
    filteredPuzzles = [...allPuzzles];

    populateCategories();
    setupEventListeners();
    renderContestants();
    renderLeaderboard();

    loadPuzzle(0);

    // Listen for spectator requests
    channel.onmessage = handleChannelMessage;
    channelAlt.onmessage = handleChannelMessage;
    window.addEventListener('message', (e) => {
      if (e.data && (e.data.type === 'CHAT_GUESS' || e.data.type === 'REQUEST_STATE')) {
        handleChannelMessage(e);
      }
    });
  }

  function populateCategories() {
    const sel = document.getElementById('category-select');
    if (!sel) return;

    const cats = window.WordCategories || [];
    sel.innerHTML = cats.map(c => `
      <option value="${c.id}">${c.name}</option>
    `).join('');

    sel.addEventListener('change', () => {
      const catId = sel.value;
      if (catId === 'RANDOM') {
        filteredPuzzles = [...allPuzzles];
      } else {
        filteredPuzzles = allPuzzles.filter(p => p.category === catId);
        if (filteredPuzzles.length === 0) filteredPuzzles = [...allPuzzles];
      }
      currentPuzzleIndex = 0;
      loadPuzzle(0);
    });
  }

  function loadLeaderboard() {
    try {
      const stored = localStorage.getItem('dionlyonee_word_leaderboard');
      if (stored) chatLeaderboard = JSON.parse(stored);
    } catch (e) {
      chatLeaderboard = {};
    }
  }

  function saveLeaderboard() {
    try {
      localStorage.setItem('dionlyonee_word_leaderboard', JSON.stringify(chatLeaderboard));
    } catch (e) {}
    renderLeaderboard();
  }

  function renderLeaderboard() {
    const list = document.getElementById('host-leaderboard-list');
    if (!list) return;

    const entries = Object.entries(chatLeaderboard)
      .map(([name, data]) => ({ name, score: data.score || 0, wins: data.wins || 0 }))
      .sort((a, b) => b.score - a.score);

    if (entries.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; color: #64748b; padding: 14px 0; font-size: 12px;">
          No chat winner logged yet this stream.
        </div>
      `;
      return;
    }

    list.innerHTML = entries.slice(0, 8).map((item, idx) => `
      <div class="leader-row">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="leader-rank">#${idx + 1}</span>
          <span style="font-weight: 800; color: #38bdf8;">@${item.name}</span>
          <span style="font-size: 10px; color: #94a3b8;">(${item.wins} wins)</span>
        </div>
        <strong style="color: #fbbf24;">${item.score.toLocaleString()} PTS</strong>
      </div>
    `).join('');
  }

  /* =====================================================
     PUZZLE CONTROLLER
  ===================================================== */
  function loadPuzzle(idx) {
    if (filteredPuzzles.length === 0) {
      filteredPuzzles = [...allPuzzles];
    }

    currentPuzzleIndex = (idx + filteredPuzzles.length) % filteredPuzzles.length;
    currentPuzzle = filteredPuzzles[currentPuzzleIndex];
    if (!currentPuzzle) return;

    isIntermission = false;

    if (window.WordEngine) {
      window.WordEngine.setPuzzle(currentPuzzle);
    }

    updateMysteryHeader();
    renderTiles();
    renderHints();
    syncState('new_round');

    const feedback = document.getElementById('host-guess-feedback');
    if (feedback) feedback.style.display = 'none';

    const guessInput = document.getElementById('host-guess-input');
    if (guessInput) guessInput.value = '';
  }

  function updateMysteryHeader() {
    if (!currentPuzzle) return;

    const text = currentPuzzle.phrase || currentPuzzle.word || '';
    const answerEl = document.getElementById('mystery-answer-text');
    if (answerEl) {
      answerEl.textContent = text;
      answerEl.className = `mystery-solution-text ${isSolutionBlurred ? 'blurred' : ''}`;
    }

    const catBadge = document.getElementById('mystery-category-badge');
    if (catBadge) {
      catBadge.textContent = currentPuzzle.categoryLabel || currentPuzzle.category || 'MYSTERY';
    }

    const diffBadge = document.getElementById('mystery-difficulty-badge');
    if (diffBadge) {
      diffBadge.textContent = currentPuzzle.difficulty || 'MEDIUM';
    }

    const words = text.split(' ').filter(Boolean).length;
    const totalLetters = window.WordEngine ? window.WordEngine.getTotalLetterCount() : text.length;
    const revealed = window.WordEngine ? window.WordEngine.getRevealedCount() : 0;
    const hidden = Math.max(0, totalLetters - revealed);
    const pts = window.WordEngine ? window.WordEngine.calculatePoints(currentPuzzle.points || 600) : (currentPuzzle.points || 600);

    const statWords = document.getElementById('stat-words');
    const statLetters = document.getElementById('stat-letters');
    const statHidden = document.getElementById('stat-hidden');
    const statPoints = document.getElementById('stat-points');

    if (statWords) statWords.textContent = words;
    if (statLetters) statLetters.textContent = totalLetters;
    if (statHidden) statHidden.textContent = hidden;
    if (statPoints) statPoints.textContent = `+${pts} PTS`;

    const percentageEl = document.getElementById('reveal-percentage');
    if (percentageEl) {
      const pct = totalLetters > 0 ? Math.round((revealed / totalLetters) * 100) : 0;
      percentageEl.textContent = `${pct}% UNCOVERED`;
    }
  }

  function renderTiles() {
    const grid = document.getElementById('host-tiles-grid');
    if (!grid || !window.RevealEngine || !window.WordEngine || !currentPuzzle) return;

    const text = currentPuzzle.phrase || currentPuzzle.word || '';
    const isSolved = window.WordEngine.isFullyRevealed();

    window.RevealEngine.renderTiles(
      grid,
      text,
      window.WordEngine.revealedIndices,
      {
        interactive: true,
        isSolved: isSolved,
        lastRevealedIndex: window.WordEngine.lastRevealedIndex,
        onTileClick: (charIdx) => {
          handleTileDirectClick(charIdx);
        }
      }
    );

    updateMysteryHeader();
  }

  function handleTileDirectClick(charIdx) {
    if (!window.WordEngine || window.WordEngine.isFullyRevealed()) return;

    const wasRevealed = window.WordEngine.revealIndex(charIdx);
    if (wasRevealed) {
      playSound('tile');
      renderTiles();

      if (window.WordEngine.isFullyRevealed()) {
        handleSolveSuccess('Host Click');
      } else {
        syncState('letter_click');
      }
    }
  }

  function renderHints() {
    const container = document.getElementById('host-hints-container');
    if (container && window.HintEngine && currentPuzzle) {
      const tier = window.WordEngine ? window.WordEngine.currentHintTier : 1;
      window.HintEngine.renderHint(container, currentPuzzle, tier);
    }
  }

  /* =====================================================
     REVEAL ACTIONS
  ===================================================== */
  function revealRandomLetter() {
    if (!window.WordEngine || window.WordEngine.isFullyRevealed()) return;

    const idx = window.WordEngine.revealNextLetter();
    if (idx !== -1) {
      playSound('tile');
      renderTiles();

      if (window.WordEngine.isFullyRevealed()) {
        handleSolveSuccess('Random Reveal');
      } else {
        syncState('letter_reveal');
      }
    }
  }

  function revealVowels() {
    if (!window.WordEngine || window.WordEngine.isFullyRevealed()) return;

    const vowels = window.WordEngine.revealVowels();
    if (vowels.length > 0) {
      playSound('vowels');
      renderTiles();

      if (window.WordEngine.isFullyRevealed()) {
        handleSolveSuccess('Vowels Reveal');
      } else {
        syncState('vowels_reveal');
      }
    }
  }

  function revealFirstAndLast() {
    if (!window.WordEngine || window.WordEngine.isFullyRevealed()) return;

    const letters = window.WordEngine.revealFirstAndLast();
    if (letters.length > 0) {
      playSound('clue');
      renderTiles();

      if (window.WordEngine.isFullyRevealed()) {
        handleSolveSuccess('First/Last Reveal');
      } else {
        syncState('fl_reveal');
      }
    }
  }

  function revealFullPhrase() {
    if (!window.WordEngine) return;
    window.WordEngine.revealAll();
    handleSolveSuccess('Full Reveal');
  }

  function unlockNextClue() {
    if (!window.WordEngine || !currentPuzzle) return;
    const tier = window.WordEngine.unlockNextHint();
    playSound('clue');
    renderHints();
    updateMysteryHeader();
    syncState('hint_unlock');
  }

  /* =====================================================
     SOLVE CELEBRATION & INTERMISSION
  ===================================================== */
  function handleSolveSuccess(winnerName = 'Mystery Solved!') {
    playSound('solve');
    fireConfetti();
    renderTiles();

    const points = window.WordEngine
      ? window.WordEngine.calculatePoints(currentPuzzle.points || 600)
      : 500;

    syncState('solve_complete', {
      winner: winnerName,
      points: points
    });

    // If stream autopilot is running, start intermission to next puzzle
    if (isAutopilot) {
      startIntermissionCountdown(5);
    }
  }

  function startIntermissionCountdown(delay = 5) {
    isIntermission = true;
    if (window.WordTimer) {
      window.WordTimer.startIntermission(
        delay,
        (seconds) => {
          syncState('intermission', { intermissionSeconds: seconds });
        },
        () => {
          isIntermission = false;
          currentPuzzleIndex++;
          loadPuzzle(currentPuzzleIndex);
        }
      );
    }
  }

  function fireConfetti() {
    const holder = document.getElementById('confetti-holder');
    if (!holder) return;

    holder.innerHTML = '';
    const colors = ['#d4af37', '#10b981', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'];

    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 0.4}s`;
      piece.style.animationDuration = `${2 + Math.random() * 1.5}s`;
      holder.appendChild(piece);
    }

    setTimeout(() => {
      holder.innerHTML = '';
    }, 3500);
  }

  /* =====================================================
     GUESS CHECKING (HOST OR DIRECT PLAY)
  ===================================================== */
  function handleHostGuess(guessStr) {
    if (!guessStr || !window.WordEngine) return;

    const result = window.WordEngine.checkGuess(guessStr);
    const feedback = document.getElementById('host-guess-feedback');

    if (result.isCorrect) {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.backgroundColor = 'rgba(16,185,129,0.2)';
        feedback.style.border = '1.5px solid #10b981';
        feedback.style.color = '#34d399';
        feedback.textContent = `🎉 CORRECT! "${currentPuzzle.phrase || currentPuzzle.word}" is solved!`;
      }

      if (window.ContestantManager) {
        const points = window.WordEngine.calculatePoints(currentPuzzle.points || 600);
        window.ContestantManager.addRoundScore(points);
        renderContestants();
      }

      window.WordEngine.revealAll();
      handleSolveSuccess('Host / Solo Player');
    } else if (result.isClose) {
      playSound('wrong');
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.backgroundColor = 'rgba(245,158,11,0.2)';
        feedback.style.border = '1.5px solid #f59e0b';
        feedback.style.color = '#fbbf24';
        feedback.textContent = `🔥 SO CLOSE! Only 1 or 2 letters off! Keep guessing!`;
      }
    } else {
      playSound('wrong');
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.backgroundColor = 'rgba(239,68,68,0.2)';
        feedback.style.border = '1.5px solid #ef4444';
        feedback.style.color = '#fca5a5';
        feedback.textContent = `❌ Not quite! That's not the mystery phrase.`;
      }
    }
  }

  /* =====================================================
     STREAM CHAT PROCESSING & SIMULATION
  ===================================================== */
  function handleChannelMessage(event) {
    const data = event.data;
    if (!data) return;

    if (data.type === 'REQUEST_STATE') {
      syncState('state_sync');
      return;
    }

    if (data.type === 'CHAT_GUESS') {
      processChatGuess(data.chatter || 'Viewer', data.guess || '');
    }
  }

  function processChatGuess(chatter, guess) {
    if (!guess || !currentPuzzle || window.WordEngine.isFullyRevealed()) return;

    const chatterClean = String(chatter).replace(/^@/, '').trim();
    const result = window.WordEngine.checkGuess(guess);

    logChatGuess(chatterClean, guess, result.isCorrect);

    if (result.isCorrect) {
      const points = window.WordEngine.calculatePoints(currentPuzzle.points || 600);

      // Credit in chat leaderboard
      if (!chatLeaderboard[chatterClean]) {
        chatLeaderboard[chatterClean] = { score: 0, wins: 0 };
      }
      chatLeaderboard[chatterClean].score += points;
      chatLeaderboard[chatterClean].wins += 1;
      saveLeaderboard();

      window.WordEngine.revealAll();
      handleSolveSuccess(`@${chatterClean}`);
    }
  }

  function logChatGuess(chatter, guess, isWinner = false) {
    const feed = document.getElementById('host-chat-feed');
    if (!feed) return;

    const item = document.createElement('div');
    item.className = `chat-log-item ${isWinner ? 'winner-log' : ''}`;
    item.innerHTML = `
      <div>
        <span class="chat-author">@${chatter}:</span>
        <span class="chat-guess-text">"${guess}"</span>
      </div>
      <span style="font-size: 10px; font-weight: 800; color: ${isWinner ? '#fbbf24' : '#94a3b8'};">
        ${isWinner ? '🏆 SOLVED!' : 'GUESS'}
      </span>
    `;

    feed.prepend(item);

    // Keep feed trimmed
    while (feed.children.length > 25) {
      feed.removeChild(feed.lastChild);
    }
  }

  function runChatSimStep() {
    if (!isChatSimActive || !currentPuzzle || window.WordEngine.isFullyRevealed()) return;

    const randomChatter = SIM_CHATTERS[Math.floor(Math.random() * SIM_CHATTERS.length)];
    const text = currentPuzzle.phrase || currentPuzzle.word || '';

    // 10% chance to simulate a correct guess, 90% creative close guesses
    const willSolve = Math.random() < 0.12;

    if (willSolve) {
      processChatGuess(randomChatter, text);
    } else {
      const words = text.split(' ');
      const scrambled = words.length > 1
        ? words[0] + ' ' + words[words.length - 1]
        : text.substring(0, Math.max(3, text.length - 2)) + '??';
      processChatGuess(randomChatter, scrambled);
    }
  }

  /* =====================================================
     AUTOPILOT STREAM PILOT
  ===================================================== */
  function toggleAutopilot(enable) {
    isAutopilot = enable !== undefined ? enable : !isAutopilot;

    const statusEl = document.getElementById('autopilot-status');
    const badgeEl = document.getElementById('autopilot-badge');
    const btnEl = document.getElementById('btn-toggle-autopilot');
    const progressEl = document.getElementById('autopilot-progress-container');

    if (isAutopilot) {
      if (statusEl) statusEl.textContent = 'ON';
      if (badgeEl) badgeEl.classList.add('active');
      if (btnEl) {
        btnEl.textContent = '⏸ PAUSE AUTOPILOT';
        btnEl.className = 'action-btn btn-amber';
      }
      if (progressEl) progressEl.style.display = 'block';

      if (window.WordTimer) {
        window.WordTimer.startAutopilot(
          autopilotPace,
          (remaining, total) => {
            const countEl = document.getElementById('auto-seconds-count');
            const barEl = document.getElementById('auto-progress-bar');
            if (countEl) countEl.textContent = `${remaining}s`;
            if (barEl) {
              const pct = (remaining / total) * 100;
              barEl.style.width = `${pct}%`;
            }
          },
          () => {
            if (!window.WordEngine.isFullyRevealed() && !isIntermission) {
              revealRandomLetter();
            }
          }
        );
      }
    } else {
      if (statusEl) statusEl.textContent = 'OFF';
      if (badgeEl) badgeEl.classList.remove('active');
      if (btnEl) {
        btnEl.textContent = '▶ START AUTOPILOT';
        btnEl.className = 'action-btn btn-emerald';
      }
      if (progressEl) progressEl.style.display = 'none';

      if (window.WordTimer) {
        window.WordTimer.stopAutopilot();
      }
    }

    syncState('autopilot_toggle', { isAutopilot });
  }

  /* =====================================================
     CONTESTANTS CONTROLLER
  ===================================================== */
  function renderContestants() {
    const list = document.getElementById('host-contestants-list');
    if (!list || !window.ContestantManager) return;

    const contestants = window.ContestantManager.getContestants();
    const active = window.ContestantManager.getActive();

    list.innerHTML = contestants.map((c, idx) => `
      <div 
        class="contestant-card ${c.id === active.id ? 'active-turn' : ''}"
        onclick="window.WordHostSetActiveContestant(${idx})"
        style="cursor: pointer;"
      >
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">${c.avatar || '👤'}</span>
          <div>
            <div style="font-weight: 800; color: #fff; font-size: 13px;">${c.name}</div>
            <div style="font-size: 10.5px; color: #94a3b8;">${c.id === active.id ? '👑 ACTIVE TURN' : 'Click to select'}</div>
          </div>
        </div>
        <strong style="color: #34d399; font-size: 15px; font-family: 'Cinzel', serif;">
          ${(c.roundScore || 0).toLocaleString()} PTS
        </strong>
      </div>
    `).join('');
  }

  window.WordHostSetActiveContestant = function (idx) {
    if (window.ContestantManager) {
      window.ContestantManager.setActive(idx);
      renderContestants();
      syncState('contestant_turn');
    }
  };

  /* =====================================================
     STATE SYNCHRONIZATION
  ===================================================== */
  function syncState(eventType = 'update', extra = {}) {
    if (!currentPuzzle || !window.WordEngine) return;

    const text = currentPuzzle.phrase || currentPuzzle.word || '';
    const isSolved = window.WordEngine.isFullyRevealed();

    const payload = {
      type: 'STATE_UPDATE',
      event: eventType,
      gameType: 'word-reveal',
      puzzle: {
        text: text,
        category: currentPuzzle.categoryLabel || currentPuzzle.category || 'WORD REVEAL',
        difficulty: currentPuzzle.difficulty || 'MEDIUM',
        points: currentPuzzle.points || 600,
        hintTier1: currentPuzzle.hintTier1 || currentPuzzle.hint || '',
        hintTier2: currentPuzzle.hintTier2 || '',
        hintTier3: currentPuzzle.hintTier3 || '',
        activeHintTier: window.WordEngine.currentHintTier
      },
      revealedIndices: Array.from(window.WordEngine.revealedIndices),
      lastRevealedIndex: window.WordEngine.lastRevealedIndex,
      isSolved: isSolved,
      isAutopilot: isAutopilot,
      isIntermission: isIntermission,
      contestants: window.ContestantManager ? window.ContestantManager.getContestants() : [],
      chatLeaderboard: chatLeaderboard,
      timestamp: Date.now(),
      ...extra
    };

    // Broadcast across channels
    try { channel.postMessage(payload); } catch (e) {}
    try { channelAlt.postMessage(payload); } catch (e) {}
    try { window.postMessage(payload, '*'); } catch (e) {}

    // Storage pulse
    try {
      sessionStorage.setItem('dionlyonee_word_live_state', JSON.stringify(payload));
      localStorage.setItem('dionlyonee_word_pulse', String(Date.now()));
    } catch (e) {}

    // Firebase Room broadcast
    if (window.FirebaseRoom && typeof window.FirebaseRoom.broadcastState === 'function') {
      try {
        window.FirebaseRoom.broadcastState(payload, eventType);
      } catch (e) {}
    }
  }

  /* =====================================================
     EVENT LISTENERS ATTACHMENT
  ===================================================== */
  function setupEventListeners() {
    // Reveal buttons
    const btnRevealOne = document.getElementById('btn-reveal-one');
    if (btnRevealOne) btnRevealOne.addEventListener('click', () => revealRandomLetter());

    const btnRevealVowels = document.getElementById('btn-reveal-vowels');
    if (btnRevealVowels) btnRevealVowels.addEventListener('click', () => revealVowels());

    const btnRevealFL = document.getElementById('btn-reveal-first-last');
    if (btnRevealFL) btnRevealFL.addEventListener('click', () => revealFirstAndLast());

    const btnRevealAll = document.getElementById('btn-reveal-all');
    if (btnRevealAll) btnRevealAll.addEventListener('click', () => revealFullPhrase());

    const btnUnlockHint = document.getElementById('btn-unlock-hint');
    if (btnUnlockHint) btnUnlockHint.addEventListener('click', () => unlockNextClue());

    const btnNext = document.getElementById('btn-next-phrase');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        currentPuzzleIndex++;
        loadPuzzle(currentPuzzleIndex);
      });
    }

    const btnRandom = document.getElementById('btn-random-puzzle');
    if (btnRandom) {
      btnRandom.addEventListener('click', () => {
        const sel = document.getElementById('category-select');
        if (sel) sel.value = 'RANDOM';
        filteredPuzzles = [...allPuzzles];
        const randomIdx = Math.floor(Math.random() * filteredPuzzles.length);
        loadPuzzle(randomIdx);
      });
    }

    // Toggle blur
    const btnBlur = document.getElementById('btn-toggle-blur');
    if (btnBlur) {
      btnBlur.addEventListener('click', () => {
        isSolutionBlurred = !isSolutionBlurred;
        const answerEl = document.getElementById('mystery-answer-text');
        if (answerEl) {
          answerEl.className = `mystery-solution-text ${isSolutionBlurred ? 'blurred' : ''}`;
        }
      });
    }

    // Autopilot controls
    const btnAuto = document.getElementById('btn-toggle-autopilot');
    if (btnAuto) {
      btnAuto.addEventListener('click', () => {
        getAudioCtx();
        toggleAutopilot();
      });
    }

    const paceSelect = document.getElementById('autopilot-pace-select');
    if (paceSelect) {
      paceSelect.addEventListener('change', () => {
        autopilotPace = parseInt(paceSelect.value, 10) || 5;
        if (isAutopilot) {
          toggleAutopilot(false);
          toggleAutopilot(true);
        }
      });
    }

    // Host Guess Form
    const guessForm = document.getElementById('form-host-guess');
    const guessInput = document.getElementById('host-guess-input');
    if (guessForm && guessInput) {
      guessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = guessInput.value.trim();
        if (val) {
          handleHostGuess(val);
          guessInput.value = '';
        }
      });
    }

    // Quick Chatter Winner Award
    const btnQuickAward = document.getElementById('btn-quick-award-chatter');
    const quickInput = document.getElementById('quick-chatter-input');
    if (btnQuickAward && quickInput) {
      const doAward = () => {
        const chatter = quickInput.value.trim();
        if (chatter && currentPuzzle) {
          processChatGuess(chatter, currentPuzzle.phrase || currentPuzzle.word);
          quickInput.value = '';
        }
      };
      btnQuickAward.addEventListener('click', doAward);
      quickInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          doAward();
        }
      });
    }

    // Chat Sim Toggle
    const simToggle = document.getElementById('toggle-chat-sim');
    if (simToggle) {
      simToggle.addEventListener('change', () => {
        isChatSimActive = simToggle.checked;
        if (chatSimTimer) clearInterval(chatSimTimer);
        if (isChatSimActive) {
          chatSimTimer = setInterval(runChatSimStep, 3500);
        }
      });
    }

    // Reset Leaderboard
    const btnResetLead = document.getElementById('btn-reset-leaderboard');
    if (btnResetLead) {
      btnResetLead.addEventListener('click', () => {
        if (confirm('Reset stream chat leaderboard points?')) {
          chatLeaderboard = {};
          saveLeaderboard();
        }
      });
    }

    // Contestant Scores & Turns
    const btnNextTurn = document.getElementById('btn-next-turn');
    if (btnNextTurn) {
      btnNextTurn.addEventListener('click', () => {
        if (window.ContestantManager) {
          window.ContestantManager.nextTurn();
          renderContestants();
          syncState('turn_change');
        }
      });
    }

    const btnAward = document.getElementById('btn-award-contestant');
    if (btnAward) {
      btnAward.addEventListener('click', () => {
        if (window.ContestantManager) {
          window.ContestantManager.addRoundScore(500);
          renderContestants();
          syncState('score_update');
        }
      });
    }

    const btnPenalize = document.getElementById('btn-penalize-contestant');
    if (btnPenalize) {
      btnPenalize.addEventListener('click', () => {
        if (window.ContestantManager) {
          window.ContestantManager.addRoundScore(-100);
          renderContestants();
          syncState('score_update');
        }
      });
    }
  }

  window.addEventListener('DOMContentLoaded', init);
})();
