/**
 * Word Reveal Mystery - Live Stage Controller
 * Displays synchronized 3D tiles, progressive clue cards, intermission timers,
 * viewer chat guessing input, and winner celebrations.
 */
(function () {
  const channel = new BroadcastChannel('dionlyonee-word-reveal-channel');
  const channelAlt = new BroadcastChannel('dionlyonee-word-reveal');

  let currentPuzzle = null;
  let revealedIndices = new Set();
  let lastRevealedIndex = -1;
  let isSolved = false;
  let winnerTimer = null;

  /* =====================================================
     AUDIO SYNTHESIS (FALLBACK & SOUND EFFECTS)
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
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
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
     INITIALIZATION & AUDIENCE INTERACTION
  ===================================================== */
  function init() {
    if (window.RoomUI) {
      window.RoomUI.attachHUD('.main-header', 'word-reveal');
    }

    setupEventListeners();
    listenForStateUpdates();

    // Check cached state
    try {
      const cached = sessionStorage.getItem('dionlyonee_word_live_state');
      if (cached) {
        applyState(JSON.parse(cached));
      }
    } catch (e) {}

    // Request fresh state from host
    requestStateSync();
  }

  function requestStateSync() {
    const req = { type: 'REQUEST_STATE' };
    try { channel.postMessage(req); } catch (e) {}
    try { channelAlt.postMessage(req); } catch (e) {}
    try { window.postMessage(req, '*'); } catch (e) {}
  }

  function listenForStateUpdates() {
    channel.onmessage = (e) => handleIncomingState(e.data);
    channelAlt.onmessage = (e) => handleIncomingState(e.data);

    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'STATE_UPDATE') {
        handleIncomingState(e.data);
      }
    });

    window.addEventListener('storage', (e) => {
      if (e.key === 'dionlyonee_word_pulse') {
        try {
          const cached = sessionStorage.getItem('dionlyonee_word_live_state');
          if (cached) applyState(JSON.parse(cached));
        } catch (err) {}
      }
    });

    if (window.FirebaseRoom && typeof window.FirebaseRoom.onStateUpdate === 'function') {
      window.FirebaseRoom.onStateUpdate((state) => {
        if (state && state.puzzle) {
          applyState(state);
        }
      });
    }
  }

  function handleIncomingState(data) {
    if (!data || data.type !== 'STATE_UPDATE') return;
    applyState(data);

    if (data.event === 'solve_complete') {
      showWinnerCelebration(data.winner || 'Mystery Solved!', data.puzzle ? data.puzzle.text : '');
    } else if (data.event === 'letter_reveal' || data.event === 'letter_click') {
      playSound('tile');
    }
  }

  function applyState(data) {
    if (!data || !data.puzzle) return;

    currentPuzzle = data.puzzle;
    revealedIndices = new Set(data.revealedIndices || []);
    lastRevealedIndex = data.lastRevealedIndex !== undefined ? data.lastRevealedIndex : -1;
    isSolved = Boolean(data.isSolved);

    // Update Category & Points Badges
    const catBadge = document.getElementById('live-cat-badge');
    if (catBadge) {
      catBadge.textContent = currentPuzzle.category || 'WORD REVEAL MYSTERY';
    }

    const ptsBadge = document.getElementById('live-points-badge');
    if (ptsBadge) {
      ptsBadge.textContent = `+${currentPuzzle.points || 600} PTS`;
    }

    // Render 3D Letter Cards
    const grid = document.getElementById('live-tiles-grid');
    if (grid && window.RevealEngine) {
      window.RevealEngine.renderTiles(
        grid,
        currentPuzzle.text,
        revealedIndices,
        {
          interactive: false,
          isSolved: isSolved,
          lastRevealedIndex: lastRevealedIndex
        }
      );
    }

    // Render Progressive Clues
    const hintContainer = document.getElementById('live-hint-container');
    if (hintContainer && window.HintEngine) {
      window.HintEngine.renderHint(
        hintContainer,
        currentPuzzle,
        currentPuzzle.activeHintTier || 1
      );
    }

    // Intermission Banner
    const intermissionBanner = document.getElementById('live-intermission-banner');
    const intermissionSeconds = document.getElementById('live-intermission-seconds');
    if (intermissionBanner) {
      if (data.isIntermission) {
        intermissionBanner.style.display = 'inline-flex';
        if (intermissionSeconds) {
          intermissionSeconds.textContent = `${data.intermissionSeconds || 5}s`;
        }
      } else {
        intermissionBanner.style.display = 'none';
      }
    }

    // Contestant Scores
    renderLiveContestants(data.contestants || []);
  }

  function renderLiveContestants(contestants) {
    const row = document.getElementById('live-contestants-row');
    if (!row) return;

    if (!contestants || contestants.length === 0) {
      row.innerHTML = `
        <div style="color: #64748b; font-size: 13px;">
          Solo Audience Mode Active
        </div>
      `;
      return;
    }

    row.innerHTML = contestants.map(c => `
      <div style="
        background: rgba(10,24,28,0.7); border: 1.5px solid rgba(255,255,255,0.1);
        border-radius: 14px; padding: 12px 20px; min-width: 140px; display: flex;
        flex-direction: column; align-items: center; gap: 4px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.4);
      ">
        <span style="font-size: 26px;">${c.avatar || '👤'}</span>
        <strong style="color: #fff; font-size: 13px;">${c.name}</strong>
        <span style="color: #34d399; font-weight: 900; font-family: 'Cinzel', serif; font-size: 16px;">
          ${(c.roundScore || 0).toLocaleString()} PTS
        </span>
      </div>
    `).join('');
  }

  /* =====================================================
     WINNER CELEBRATION MODAL
  ===================================================== */
  function showWinnerCelebration(winnerName, answerText) {
    playSound('solve');
    fireConfetti();

    const overlay = document.getElementById('live-winner-overlay');
    const answerDisplay = document.getElementById('winner-answer-display');
    const creditLine = document.getElementById('winner-credit-line');

    if (answerDisplay) answerDisplay.textContent = answerText || '';
    if (creditLine) creditLine.textContent = `SOLVED BY ${winnerName.toUpperCase()}!`;

    if (overlay) {
      overlay.classList.add('show');
      if (winnerTimer) clearTimeout(winnerTimer);
      winnerTimer = setTimeout(() => {
        overlay.classList.remove('show');
      }, 4500);
    }
  }

  function fireConfetti() {
    const holder = document.getElementById('live-confetti');
    if (!holder) return;

    holder.innerHTML = '';
    const colors = ['#d4af37', '#10b981', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'];

    for (let i = 0; i < 45; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 0.3}s`;
      piece.style.animationDuration = `${2.2 + Math.random() * 1.5}s`;
      holder.appendChild(piece);
    }

    setTimeout(() => {
      holder.innerHTML = '';
    }, 4000);
  }

  /* =====================================================
     AUDIENCE VIEWER GUESS SUBMISSION
  ===================================================== */
  function setupEventListeners() {
    const form = document.getElementById('live-chat-guess-form');
    const nameInput = document.getElementById('live-chat-name');
    const textInput = document.getElementById('live-chat-text');
    const feedback = document.getElementById('live-chat-feedback');

    // Restore saved username
    try {
      const savedName = localStorage.getItem('dionlyonee_viewer_name');
      if (savedName && nameInput) nameInput.value = savedName;
    } catch (e) {}

    if (form && nameInput && textInput) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        getAudioCtx();

        const chatter = nameInput.value.trim();
        const guess = textInput.value.trim();
        if (!chatter || !guess) return;

        // Save username for convenience
        try { localStorage.setItem('dionlyonee_viewer_name', chatter); } catch (err) {}

        const payload = {
          type: 'CHAT_GUESS',
          chatter: chatter,
          guess: guess,
          timestamp: Date.now()
        };

        // Broadcast to host
        try { channel.postMessage(payload); } catch (err) {}
        try { channelAlt.postMessage(payload); } catch (err) {}
        try { window.postMessage(payload, '*'); } catch (err) {}

        textInput.value = '';

        if (feedback) {
          feedback.style.display = 'block';
          feedback.textContent = `✓ Guess "${guess}" submitted to host!`;
          setTimeout(() => {
            feedback.style.display = 'none';
          }, 2500);
        }
      });
    }
  }

  window.addEventListener('DOMContentLoaded', init);
})();
