/**
 * Dionlyonee Hangman Show - Master Host Controller
 * Full host command center for words, visual stages, keyboard guessing,
 * stream autopilot, simulated & real live chat, and broadcast state sync.
 */
(function () {
  let engine;
  let audio;
  let stream;
  let allWords = [];
  let filteredWords = [];
  let currentWordIndex = 0;
  let selectedCategory = 'ALL';
  let visualTheme = 'slime';
  let hideHostSecret = false;

  // Broadcast Channels
  const channel = new BroadcastChannel('dionlyonee-hangman-channel');
  const channelAlt = new BroadcastChannel('dionlyonee-stream-hangman');

  // WebSocket support
  let wsClient = null;
  const roomId = 'DION1';

  function init() {
    // 1. Data load
    if (window.HangmanWords && Array.isArray(window.HangmanWords)) {
      allWords = [...window.HangmanWords];
    } else if (window.StreamGamesData && window.StreamGamesData.games && window.StreamGamesData.games.hangman) {
      allWords = [...window.StreamGamesData.games.hangman.prompts];
    }
    filteredWords = [...allWords];

    // 2. Engines
    audio = window.HangmanAudio || null;
    engine = new window.HangmanEngine({ theme: visualTheme });
    stream = new window.HangmanStream(engine, audio);

    // 3. Setup WebSocket connection
    setupWebSocket();

    // 4. Setup BroadcastChannel listener
    setupBroadcast();

    // 5. Connect stream engine callbacks
    stream.onStateChange = function () {
      renderTimerAndStatus();
      broadcastState();
    };

    stream.onChatEvent = function (chatItem, feed) {
      renderChatFeed(feed);
      renderLeaderboard(stream.chatLeaderboard);
      broadcastState({ lastChatMessage: chatItem });
    };

    stream.onRoundAutoAdvance = function () {
      nextWord();
    };

    // 6. UI Event Listeners
    setupControls();

    // 7. Setup physical keyboard listener (A-Z keys trigger guesses)
    setupKeyboardListeners();

    // 8. Render Categories & first word
    renderCategories();
    loadWordByIndex(0);
  }

  function setupWebSocket() {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}?roomId=${roomId}`;
      wsClient = new WebSocket(wsUrl);
      wsClient.onopen = () => {
        wsClient.send(JSON.stringify({ type: 'JOIN_ROOM', roomId }));
      };
      wsClient.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'CHAT_GUESS') {
            stream.processChatMessage(msg.user || 'Viewer', msg.message || '');
          }
        } catch (e) {}
      };
    } catch (e) {}
  }

  function setupBroadcast() {
    const handleMessage = (e) => {
      const data = e.data;
      if (!data) return;

      if (data.type === 'REQUEST_STATE') {
        broadcastState();
      } else if (data.type === 'CHAT_GUESS' || data.type === 'VIEWER_GUESS') {
        stream.processChatMessage(data.user || 'Viewer', data.message || data.guess || '');
      } else if (data.type === 'HOST_ACTION') {
        if (data.action === 'GUESS_LETTER') {
          handleGuess(data.letter, data.user || 'Cohost');
        } else if (data.action === 'SOLVE') {
          stream.handleSolveGuess(data.user || 'Cohost', data.phrase);
        } else if (data.action === 'ADVANCE_HINT') {
          advanceHint();
        }
      }
    };

    channel.onmessage = handleMessage;
    channelAlt.onmessage = handleMessage;
  }

  function setupControls() {
    // Prev / Next Word
    const btnPrev = document.getElementById('btn-prev-word');
    if (btnPrev) btnPrev.addEventListener('click', prevWord);

    const btnNext = document.getElementById('btn-next-word');
    if (btnNext) btnNext.addEventListener('click', nextWord);

    const btnRandom = document.getElementById('btn-random-word');
    if (btnRandom) btnRandom.addEventListener('click', randomWord);

    // Timer Controls
    const btnStartTimer = document.getElementById('btn-start-timer');
    if (btnStartTimer) {
      btnStartTimer.addEventListener('click', () => {
        if (stream.timerInterval) {
          stream.stopRoundTimer();
          btnStartTimer.textContent = '▶ START TIMER';
        } else {
          stream.startRoundTimer(stream.roundDuration);
          btnStartTimer.textContent = '⏸ PAUSE TIMER';
        }
        renderTimerAndStatus();
        broadcastState();
      });
    }

    const btnResetTimer = document.getElementById('btn-reset-timer');
    if (btnResetTimer) {
      btnResetTimer.addEventListener('click', () => {
        stream.remainingSeconds = stream.roundDuration;
        renderTimerAndStatus();
        broadcastState();
      });
    }

    const durationSelect = document.getElementById('select-round-duration');
    if (durationSelect) {
      durationSelect.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10) || 45;
        stream.roundDuration = val;
        stream.remainingSeconds = val;
        renderTimerAndStatus();
        broadcastState();
      });
    }

    // Autopilot Switch
    const toggleAuto = document.getElementById('toggle-autopilot');
    if (toggleAuto) {
      toggleAuto.addEventListener('change', (e) => {
        stream.setAutopilot(e.target.checked);
        const banner = document.getElementById('autopilot-indicator');
        if (banner) banner.style.display = e.target.checked ? 'inline-flex' : 'none';
        if (e.target.checked && !stream.timerInterval) {
          stream.startRoundTimer(stream.roundDuration);
          if (btnStartTimer) btnStartTimer.textContent = '⏸ PAUSE TIMER';
        }
        broadcastState();
      });
    }

    // Chat Intensity
    const chatSelect = document.getElementById('select-chat-intensity');
    if (chatSelect) {
      chatSelect.addEventListener('change', (e) => {
        stream.setChatIntensity(e.target.value);
      });
    }

    // Visual Theme Selector
    const themeSelect = document.getElementById('select-visual-theme');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        visualTheme = e.target.value;
        engine.theme = visualTheme;
        renderVisualStage();
        broadcastState();
      });
    }

    // Secret Word Toggle
    const btnToggleSecret = document.getElementById('btn-toggle-secret');
    if (btnToggleSecret) {
      btnToggleSecret.addEventListener('click', () => {
        hideHostSecret = !hideHostSecret;
        renderSecretWord();
      });
    }

    // Clue Drop
    const btnDropClue = document.getElementById('btn-drop-clue');
    if (btnDropClue) {
      btnDropClue.addEventListener('click', advanceHint);
    }

    // Free Vowels
    const btnVowels = document.getElementById('btn-reveal-vowels');
    if (btnVowels) {
      btnVowels.addEventListener('click', () => {
        const revealed = engine.revealVowels();
        if (revealed.length > 0) {
          if (audio) audio.playLetterHit();
          stream.addSystemChatMessage(`🎁 HOST REVEALED VOWELS: ${revealed.join(', ')}`);
        }
        renderBoard();
        broadcastState();
      });
    }

    // Free Letter
    const btnFreeLetter = document.getElementById('btn-free-letter');
    if (btnFreeLetter) {
      btnFreeLetter.addEventListener('click', () => {
        const char = engine.revealFreeLetter();
        if (char) {
          if (audio) audio.playLetterHit();
          stream.addSystemChatMessage(`🎁 HOST GRANTED FREE LETTER: "${char}"`);
        }
        renderBoard();
        broadcastState();
      });
    }

    // Full Solve / Win
    const btnSolve = document.getElementById('btn-solve-word');
    if (btnSolve) {
      btnSolve.addEventListener('click', () => {
        engine.status = 'WON';
        engine.finishTime = Date.now();
        engine.roundPoints = engine.calculateSolvePoints(true);
        if (audio) audio.playWordSolve();
        stream.addSystemChatMessage(`🏆 HOST REVEALED COMPLETE WORD: "${engine.rawWord}"`);
        renderBoard();
        broadcastState();
        if (stream.isAutopilot) stream.startIntermission();
      });
    }

    // Reset Round
    const btnResetRound = document.getElementById('btn-reset-round');
    if (btnResetRound) {
      btnResetRound.addEventListener('click', () => {
        loadWordByIndex(currentWordIndex);
        stream.addSystemChatMessage(`🔄 ROUND RESET BY HOST`);
      });
    }

    // Quick Chatter Award
    const btnAwardChat = document.getElementById('btn-award-chatter');
    const inputChatUser = document.getElementById('input-chatter-user');
    if (btnAwardChat && inputChatUser) {
      const award = () => {
        const user = inputChatUser.value.trim();
        if (user && engine.status === 'PLAYING') {
          stream.handleSolveGuess(user, engine.rawWord);
          inputChatUser.value = '';
        }
      };
      btnAwardChat.addEventListener('click', award);
      inputChatUser.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') award();
      });
    }

    // Reset Leaderboard
    const btnResetLead = document.getElementById('btn-reset-leaderboard');
    if (btnResetLead) {
      btnResetLead.addEventListener('click', () => {
        if (confirm('Reset stream chat leaderboard scores?')) {
          stream.resetLeaderboard();
          renderLeaderboard(stream.chatLeaderboard);
        }
      });
    }

    // Custom Word Modal
    setupCustomWordModal();
  }

  function setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      // Don't intercept if typing in an input field
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        handleGuess(key, 'Host');
      }
    });
  }

  function setupCustomWordModal() {
    const modal = document.getElementById('modal-custom-word');
    const btnOpen = document.getElementById('btn-open-custom-modal');
    const btnClose = document.getElementById('btn-close-custom-modal');
    const btnSubmit = document.getElementById('btn-submit-custom-word');

    if (btnOpen && modal) {
      btnOpen.addEventListener('click', () => { modal.style.display = 'flex'; });
    }
    if (btnClose && modal) {
      btnClose.addEventListener('click', () => { modal.style.display = 'none'; });
    }
    if (btnSubmit && modal) {
      btnSubmit.addEventListener('click', () => {
        const wordInput = document.getElementById('custom-word-input');
        const catInput = document.getElementById('custom-category-input');
        const hintInput = document.getElementById('custom-hint-input');

        const raw = wordInput ? wordInput.value.trim() : '';
        if (!raw) return;

        const customObj = {
          word: raw.toUpperCase(),
          category: (catInput && catInput.value.trim()) || 'CUSTOM PUZZLE',
          difficulty: 'MEDIUM',
          hint1: (hintInput && hintInput.value.trim()) || 'Custom host prompt',
          hint2: '',
          hint3: '',
          funFact: 'Created on the fly by the Stream Host!'
        };

        allWords.unshift(customObj);
        filteredWords = [...allWords];
        selectedCategory = 'ALL';
        renderCategories();
        loadWordByIndex(0);

        if (wordInput) wordInput.value = '';
        if (hintInput) hintInput.value = '';
        modal.style.display = 'none';
      });
    }
  }

  function renderCategories() {
    const container = document.getElementById('category-filter-bar');
    if (!container) return;

    let cats = [{ id: 'ALL', name: 'ALL CATEGORIES', icon: '🌟' }];
    if (window.HangmanCategories) {
      cats = cats.concat(window.HangmanCategories);
    } else {
      const distinct = Array.from(new Set(allWords.map(w => w.category))).filter(Boolean);
      distinct.forEach(c => cats.push({ id: c, name: c, icon: '📁' }));
    }

    container.innerHTML = cats.map(c => `
      <button type="button" class="cat-pill ${selectedCategory === c.name || selectedCategory === c.id ? 'active' : ''}" onclick="window.hostController.setCategory('${c.name || c.id}')">
        <span>${c.icon || '📁'}</span>
        <span>${c.name}</span>
      </button>
    `).join('');
  }

  function setCategory(cat) {
    selectedCategory = cat;
    if (cat === 'ALL' || cat === 'ALL CATEGORIES') {
      filteredWords = [...allWords];
    } else {
      filteredWords = allWords.filter(w => w.category === cat || w.category.toUpperCase().includes(cat.toUpperCase()));
      if (filteredWords.length === 0) filteredWords = [...allWords];
    }
    renderCategories();
    loadWordByIndex(0);
  }

  function loadWordByIndex(idx) {
    if (filteredWords.length === 0) return;
    currentWordIndex = (idx + filteredWords.length) % filteredWords.length;
    const wordObj = filteredWords[currentWordIndex];

    engine.setWord(wordObj);
    stream.remainingSeconds = stream.roundDuration;

    if (stream.isAutopilot) {
      stream.startRoundTimer(stream.roundDuration);
      const btn = document.getElementById('btn-start-timer');
      if (btn) btn.textContent = '⏸ PAUSE TIMER';
    } else {
      stream.stopRoundTimer();
      const btn = document.getElementById('btn-start-timer');
      if (btn) btn.textContent = '▶ START TIMER';
    }

    renderBoard();
    broadcastState();
  }

  function prevWord() {
    loadWordByIndex(currentWordIndex - 1);
  }

  function nextWord() {
    loadWordByIndex(currentWordIndex + 1);
  }

  function randomWord() {
    if (filteredWords.length <= 1) return;
    let nextIdx = currentWordIndex;
    while (nextIdx === currentWordIndex) {
      nextIdx = Math.floor(Math.random() * filteredWords.length);
    }
    loadWordByIndex(nextIdx);
  }

  function handleGuess(letter, guesser = 'Host') {
    if (engine.status !== 'PLAYING') return;
    stream.handleLetterGuess(guesser, letter);
    renderBoard();
    broadcastState();
  }

  function advanceHint() {
    const tier = engine.advanceHintTier();
    let clueText = engine.hint1;
    if (tier === 2) clueText = engine.hint2 || engine.hint1;
    if (tier === 3) clueText = engine.hint3 || engine.hint2;
    if (audio) audio.playClueDrop();
    stream.addSystemChatMessage(`💡 CLUE REVEALED (Tier ${tier}): "${clueText}"`);
    renderBoard();
    broadcastState();
  }

  function renderBoard() {
    renderSecretWord();
    renderWordBlanks();
    renderVisualStage();
    renderKeyboard();
    renderStrikeMeter();
    renderCluesBanner();
    renderTimerAndStatus();
    renderChatFeed(stream.chatFeed);
    renderLeaderboard(stream.chatLeaderboard);
  }

  function renderSecretWord() {
    const el = document.getElementById('host-secret-word');
    if (!el) return;
    if (hideHostSecret) {
      el.innerHTML = `<span style="letter-spacing: 6px; color: #64748b;">••••••••••••</span>`;
    } else {
      el.textContent = `"${engine.rawWord}"`;
    }

    const catBadge = document.getElementById('host-word-category');
    if (catBadge) {
      catBadge.textContent = `${engine.category} • ${engine.difficulty} • ${engine.cleanWord.length} LETTERS`;
    }

    const countEl = document.getElementById('host-prompt-counter');
    if (countEl) {
      countEl.textContent = `Word ${currentWordIndex + 1} of ${filteredWords.length}`;
    }
  }

  function renderWordBlanks() {
    const container = document.getElementById('host-word-blanks');
    if (!container) return;

    const blanks = engine.getWordBlanks();
    container.innerHTML = blanks.map(wordArr => {
      const slots = wordArr.map(slot => {
        if (!slot.isLetter) {
          return `<div class="letter-slot punctuation">${slot.char}</div>`;
        }
        const cls = slot.isRevealed ? (slot.isMissed ? 'missed' : 'revealed') : '';
        return `
          <div class="letter-slot ${cls}">
            ${slot.isRevealed ? slot.char : ''}
          </div>
        `;
      }).join('');
      return `<div class="word-group">${slots}</div>`;
    }).join('');
  }

  function renderVisualStage() {
    const container = document.getElementById('host-visual-container');
    if (!container) return;

    if (window.HangmanVisual) {
      container.innerHTML = window.HangmanVisual.render(visualTheme, engine.strikes, engine.status, 300, 240);
    }
  }

  function renderKeyboard() {
    const container = document.getElementById('host-keyboard');
    if (!container) return;

    const rows = [
      'QWERTYUIOP'.split(''),
      'ASDFGHJKL'.split(''),
      'ZXCVBNM'.split('')
    ];

    container.innerHTML = rows.map(row => {
      const keysHtml = row.map(ch => {
        const isGuessed = engine.guessedLetters.includes(ch);
        const inWord = engine.cleanWord.includes(ch);

        let cls = '';
        if (isGuessed) {
          cls = inWord ? 'hit' : 'miss';
        }

        return `
          <button type="button" class="key-btn ${cls}" onclick="window.hostController.handleGuess('${ch}')" ${isGuessed ? 'disabled' : ''}>
            ${ch}
          </button>
        `;
      }).join('');
      return `<div class="keyboard-row">${keysHtml}</div>`;
    }).join('');
  }

  function renderStrikeMeter() {
    const container = document.getElementById('host-strike-meter');
    if (!container) return;

    const bodyParts = ['Head', 'Body', 'L-Arm', 'R-Arm', 'L-Leg', 'R-Leg'];
    let html = '';
    for (let i = 1; i <= engine.maxStrikes; i++) {
      const active = i <= engine.strikes;
      html += `
        <div class="strike-node">
          <div class="strike-circle ${active ? 'active' : ''}">
            ${active ? '✕' : i}
          </div>
          <span class="strike-label ${active ? 'active' : ''}">${bodyParts[i - 1] || 'Strike'}</span>
        </div>
      `;
    }
    container.innerHTML = html;

    const countText = document.getElementById('host-strikes-count-text');
    if (countText) {
      countText.textContent = `${engine.strikes} / ${engine.maxStrikes} Strikes (${engine.maxStrikes - engine.strikes} remaining)`;
      countText.style.color = engine.strikes >= 5 ? '#ef4444' : (engine.strikes >= 3 ? '#f59e0b' : '#d4af37');
    }
  }

  function renderCluesBanner() {
    const el = document.getElementById('host-clue-display');
    if (!el) return;

    if (engine.hintTier === 0) {
      el.innerHTML = `<span style="color: #94a3b8; font-style: italic;">No clues active yet. (Click "Drop Clue" or enable Autopilot)</span>`;
    } else {
      let text = engine.hint1;
      if (engine.hintTier === 2) text = engine.hint2 || engine.hint1;
      if (engine.hintTier === 3) text = engine.hint3 || engine.hint2;
      el.innerHTML = `<b>Tier ${engine.hintTier} Clue:</b> ${text}`;
    }
  }

  function renderTimerAndStatus() {
    const timerDisplay = document.getElementById('host-timer-display');
    if (timerDisplay) {
      if (stream.isIntermission) {
        timerDisplay.textContent = `NEXT: ${stream.intermissionRemaining}s`;
        timerDisplay.style.color = '#38bdf8';
      } else {
        timerDisplay.textContent = `${stream.remainingSeconds}s`;
        timerDisplay.style.color = stream.remainingSeconds <= 10 ? '#ef4444' : '#d4af37';
      }
    }

    const statusBanner = document.getElementById('host-round-status-banner');
    if (statusBanner) {
      if (engine.status === 'WON') {
        statusBanner.textContent = `🏆 WORD SOLVED! (+${engine.roundPoints} pts)`;
        statusBanner.style.background = 'rgba(16, 185, 129, 0.25)';
        statusBanner.style.color = '#34d399';
      } else if (engine.status === 'LOST') {
        statusBanner.textContent = `💀 6 STRIKES REACHED! SLIME DUNK TRIGGERED!`;
        statusBanner.style.background = 'rgba(239, 68, 68, 0.25)';
        statusBanner.style.color = '#f87171';
      } else {
        statusBanner.textContent = stream.timerInterval ? `🎮 ROUND IN PROGRESS` : `⏸ TIMER PAUSED`;
        statusBanner.style.background = 'rgba(212, 175, 55, 0.15)';
        statusBanner.style.color = '#f7e07d';
      }
    }
  }

  function renderChatFeed(feed) {
    const container = document.getElementById('host-chat-stream-feed');
    if (!container) return;

    if (!feed || feed.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: #64748b; padding: 12px;">Chat is quiet. Select "Active" intensity or type a guess below.</div>`;
      return;
    }

    container.innerHTML = feed.map(item => `
      <div class="chat-bubble ${item.type || ''}">
        <div>
          <span class="chat-user">@${item.user}:</span>
          <span class="chat-msg">${item.message}</span>
        </div>
        <span style="font-size: 10px; color: #64748b;">${new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      </div>
    `).join('');
  }

  function renderLeaderboard(leaderboard) {
    const list = document.getElementById('host-leaderboard-list');
    if (!list) return;

    const entries = Object.entries(leaderboard || {})
      .map(([name, data]) => ({ name, score: data.score || 0, wins: data.wins || 0, correct: data.correct || 0 }))
      .sort((a, b) => b.score - a.score);

    if (entries.length === 0) {
      list.innerHTML = `<div style="color: #64748b; text-align: center; padding: 12px; font-size: 12px;">No chat scores recorded yet this stream.</div>`;
      return;
    }

    list.innerHTML = entries.slice(0, 10).map((p, idx) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: rgba(255,255,255,0.03); border-radius: 6px; margin-bottom: 4px; font-size: 12px;">
        <div>
          <span style="font-weight: 900; color: ${idx === 0 ? '#fbbf24' : '#94a3b8'}; margin-right: 6px;">#${idx + 1}</span>
          <span style="font-weight: 800; color: #ffffff;">@${p.name}</span>
          ${p.wins > 0 ? `<span style="font-size: 10px; color: #34d399; margin-left: 4px;">(${p.wins} wins)</span>` : ''}
        </div>
        <span style="font-weight: 900; color: #d4af37;">${p.score.toLocaleString()} PTS</span>
      </div>
    `).join('');
  }

  function broadcastState(extra = {}) {
    const state = {
      type: 'HANGMAN_STATE_SYNC',
      engineState: engine ? engine.getState() : null,
      streamState: stream ? stream.getStreamState() : null,
      currentWordIndex,
      totalWords: filteredWords.length,
      visualTheme,
      timestamp: Date.now(),
      ...extra
    };

    try {
      channel.postMessage(state);
      channelAlt.postMessage(state);
    } catch (e) {}

    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
      try {
        wsClient.send(JSON.stringify({
          type: 'STATE_SYNC',
          roomId,
          state
        }));
      } catch (e) {}
    }
  }

  // Expose to window for inline button clicks
  window.hostController = {
    handleGuess,
    setCategory,
    prevWord,
    nextWord,
    randomWord,
    advanceHint
  };

  document.addEventListener('DOMContentLoaded', init);
})();
