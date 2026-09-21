/**
 * Dionlyonee Hangman Show - Live Stream Display Engine
 * Connects to broadcast channels and WebSocket to render real-time visuals,
 * 3D letter blanks, progressive clues, strike counters, and celebration overlays.
 */
(function () {
  let engineState = null;
  let streamState = null;
  let visualTheme = 'slime';
  let audio = window.HangmanAudio || null;
  let muted = false;

  const channel = new BroadcastChannel('dionlyonee-hangman-channel');
  const channelAlt = new BroadcastChannel('dionlyonee-stream-hangman');
  let wsClient = null;
  const roomId = 'DION1';

  function init() {
    setupBroadcast();
    setupWebSocket();
    setupInteractiveGuessInput();

    // Request initial state from host
    channel.postMessage({ type: 'REQUEST_STATE' });
    channelAlt.postMessage({ type: 'REQUEST_STATE' });

    // Initial fallback render if waiting for host
    setTimeout(() => {
      if (!engineState) {
        showWaitingState();
      }
    }, 1200);
  }

  function setupBroadcast() {
    const onMsg = (e) => {
      const data = e.data;
      if (!data) return;

      if (data.type === 'HANGMAN_STATE_SYNC') {
        if (data.visualTheme) visualTheme = data.visualTheme;
        if (data.engineState) engineState = data.engineState;
        if (data.streamState) streamState = data.streamState;
        renderAll();
      } else if (data.type === 'STATE_UPDATE' || data.type === 'PROMPT_UPDATE') {
        // Fallback backward compatibility with generic StreamGameLive
        if (data.prompt) {
          syncFromGenericPrompt(data);
        }
      }
    };

    channel.onmessage = onMsg;
    channelAlt.onmessage = onMsg;
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
          if (msg.type === 'STATE_SYNC' && msg.state) {
            const data = msg.state;
            if (data.visualTheme) visualTheme = data.visualTheme;
            if (data.engineState) engineState = data.engineState;
            if (data.streamState) streamState = data.streamState;
            renderAll();
          }
        } catch (e) {}
      };
    } catch (e) {}
  }

  function syncFromGenericPrompt(data) {
    // Adapter if generic host is running
    const prompt = data.prompt;
    if (!prompt) return;

    if (!engineState) {
      engineState = {
        word: prompt.word || prompt.prompt || '',
        category: prompt.category || 'GENERAL',
        difficulty: prompt.difficulty || 'EASY',
        hint1: prompt.hint || '',
        hint2: '',
        hint3: '',
        funFact: '',
        guessedLetters: data.guessedLetters || [],
        correctLetters: [],
        wrongLetters: [],
        strikes: data.strikes || 0,
        maxStrikes: 6,
        status: data.status || 'PLAYING',
        hintTier: 1,
        blanks: []
      };
    } else {
      engineState.guessedLetters = data.guessedLetters || engineState.guessedLetters;
      engineState.strikes = data.strikes !== undefined ? data.strikes : engineState.strikes;
      engineState.status = data.status || engineState.status;
    }
    renderAll();
  }

  function showWaitingState() {
    const catEl = document.getElementById('live-category-banner');
    if (catEl) catEl.textContent = 'CONNECTING TO DIONLYONEE BROADCAST...';
  }

  function renderAll() {
    if (!engineState) return;

    renderCategoryAndMeta();
    renderTimer();
    renderVisualStage();
    renderWordBlanks();
    renderClueBanner();
    renderStrikeMeter();
    renderAlphabetBar();
    renderChatFeed();
    renderOverlay();
  }

  function renderCategoryAndMeta() {
    const catBadge = document.getElementById('live-category-banner');
    if (catBadge) {
      catBadge.textContent = `${engineState.category.toUpperCase()} • ${engineState.difficulty || 'EASY'}`;
    }

    const lengthBadge = document.getElementById('live-word-length');
    if (lengthBadge) {
      const len = engineState.cleanWord ? engineState.cleanWord.length : 0;
      const left = engineState.remainingCount !== undefined ? engineState.remainingCount : len;
      lengthBadge.textContent = `${len} LETTERS • ${left} REMAINING`;
    }
  }

  function renderTimer() {
    const timerEl = document.getElementById('live-timer-clock');
    if (!timerEl) return;

    if (streamState && streamState.isIntermission) {
      timerEl.textContent = `${streamState.intermissionRemaining}s`;
      timerEl.style.color = '#38bdf8';
      const label = document.getElementById('live-timer-label');
      if (label) label.textContent = 'NEXT ROUND IN';
    } else if (streamState) {
      timerEl.textContent = `${streamState.remainingSeconds}s`;
      timerEl.style.color = streamState.remainingSeconds <= 10 ? '#ef4444' : '#d4af37';
      const label = document.getElementById('live-timer-label');
      if (label) label.textContent = 'ROUND TIMER';
    }
  }

  function renderVisualStage() {
    const container = document.getElementById('live-visual-stage');
    if (!container) return;

    if (window.HangmanVisual) {
      container.innerHTML = window.HangmanVisual.render(
        visualTheme,
        engineState.strikes,
        engineState.status,
        380,
        300
      );
    }
  }

  function renderWordBlanks() {
    const container = document.getElementById('live-word-blanks');
    if (!container) return;

    // Use blanks from engineState or calculate
    let blanks = engineState.blanks;
    if (!blanks || blanks.length === 0) {
      // Calculate
      const raw = engineState.word || '';
      const guessed = engineState.guessedLetters || [];
      const isEnded = engineState.status === 'WON' || engineState.status === 'LOST';
      blanks = raw.split(' ').map(w => {
        return w.split('').map(ch => {
          const isLetter = /[A-Z]/i.test(ch);
          const upper = ch.toUpperCase();
          const isRevealed = !isLetter || guessed.includes(upper) || isEnded;
          return {
            char: upper,
            isLetter,
            isRevealed,
            isMissed: isLetter && !guessed.includes(upper) && engineState.status === 'LOST'
          };
        });
      });
    }

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

  function renderClueBanner() {
    const banner = document.getElementById('live-clue-banner');
    if (!banner) return;

    const tier = engineState.hintTier || 0;
    if (tier === 0 && !engineState.hint1) {
      banner.style.display = 'none';
      return;
    }

    banner.style.display = 'block';
    let clue = engineState.hint1;
    if (tier === 2) clue = engineState.hint2 || engineState.hint1;
    if (tier === 3) clue = engineState.hint3 || engineState.hint2;

    banner.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
        <span style="font-size: 16px;">💡</span>
        <span style="font-weight: 800; color: #fde047;">CLUE:</span>
        <span style="color: #ffffff; font-weight: 700;">${clue || 'Category Match'}</span>
      </div>
    `;
  }

  function renderStrikeMeter() {
    const container = document.getElementById('live-strike-meter');
    if (!container) return;

    const strikes = engineState.strikes || 0;
    const maxStrikes = engineState.maxStrikes || 6;
    const labels = ['Head', 'Body', 'L-Arm', 'R-Arm', 'L-Leg', 'R-Leg'];

    let html = '';
    for (let i = 1; i <= maxStrikes; i++) {
      const active = i <= strikes;
      html += `
        <div class="strike-node">
          <div class="strike-circle ${active ? 'active' : ''}">
            ${active ? '✕' : i}
          </div>
          <span class="strike-label ${active ? 'active' : ''}">${labels[i - 1] || 'Strike'}</span>
        </div>
      `;
    }
    container.innerHTML = html;
  }

  function renderAlphabetBar() {
    const container = document.getElementById('live-alphabet-bar');
    if (!container) return;

    const guessed = engineState.guessedLetters || [];
    const cleanWord = engineState.cleanWord || (engineState.word || '').toUpperCase().replace(/[^A-Z]/g, '');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    container.innerHTML = alphabet.map(ch => {
      const isGuessed = guessed.includes(ch);
      const inWord = cleanWord.includes(ch);
      let cls = '';
      if (isGuessed) {
        cls = inWord ? 'hit' : 'miss';
      }
      return `<div class="key-btn ${cls}" style="width: 34px; height: 38px; font-size: 14px; cursor: default;">${ch}</div>`;
    }).join('');
  }

  function renderChatFeed() {
    const container = document.getElementById('live-chat-ticker');
    if (!container || !streamState) return;

    const feed = streamState.chatFeed || [];
    if (feed.length === 0) {
      container.innerHTML = `<div style="color: #64748b; font-size: 12px; text-align: center; padding: 4px;">Type letters in chat or use !guess &lt;letter&gt;</div>`;
      return;
    }

    container.innerHTML = feed.slice(0, 5).map(item => `
      <div class="chat-bubble ${item.type || ''}" style="padding: 4px 8px; font-size: 11px;">
        <div>
          <span class="chat-user">@${item.user}:</span>
          <span class="chat-msg">${item.message}</span>
        </div>
      </div>
    `).join('');
  }

  function renderOverlay() {
    const winOverlay = document.getElementById('live-win-overlay');
    const lossOverlay = document.getElementById('live-loss-overlay');

    if (engineState.status === 'WON') {
      if (winOverlay) {
        winOverlay.style.display = 'flex';
        const wordEl = document.getElementById('win-solved-word');
        if (wordEl) wordEl.textContent = `"${engineState.word}"`;
        const solverEl = document.getElementById('win-solver-name');
        if (solverEl) {
          solverEl.textContent = engineState.solver ? `SOLVED BY @${engineState.solver}!` : 'AUDIENCE VICTORY!';
        }
      }
      if (lossOverlay) lossOverlay.style.display = 'none';
    } else if (engineState.status === 'LOST') {
      if (lossOverlay) {
        lossOverlay.style.display = 'flex';
        const wordEl = document.getElementById('loss-revealed-word');
        if (wordEl) wordEl.textContent = `"${engineState.word}"`;
      }
      if (winOverlay) winOverlay.style.display = 'none';
    } else {
      if (winOverlay) winOverlay.style.display = 'none';
      if (lossOverlay) lossOverlay.style.display = 'none';
    }
  }

  function setupInteractiveGuessInput() {
    const input = document.getElementById('live-viewer-input');
    const btn = document.getElementById('btn-live-send-guess');
    if (!input || !btn) return;

    const send = () => {
      const val = input.value.trim();
      if (!val) return;

      const guessObj = {
        type: 'VIEWER_GUESS',
        user: 'Spectator_' + Math.floor(Math.random() * 900 + 100),
        message: val
      };

      try {
        channel.postMessage(guessObj);
        channelAlt.postMessage(guessObj);
      } catch (e) {}

      if (wsClient && wsClient.readyState === WebSocket.OPEN) {
        wsClient.send(JSON.stringify({
          type: 'CHAT_GUESS',
          roomId,
          user: guessObj.user,
          message: val
        }));
      }

      input.value = '';
    };

    btn.addEventListener('click', send);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') send();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
