// Dionlyonee Jeopardy Live Stage Engine (Pure Vanilla JS)
// BroadcastChannel: dionlyonee-jeopardy-game

(function () {
  'use strict';

  const CHANNEL_NAME = 'dionlyonee-jeopardy-game';
  const STORAGE_KEY = 'dionlyonee_jeopardy_state';
  const channel = new BroadcastChannel(CHANNEL_NAME);

  let state = {
    category: 'Jamaican / Patwa Phrases',
    answer: 'WAH GWAAN',
    hint: '',
    currentValue: 400,
    revealed: [],
    calledLetters: [],
    seconds: 30,
    revealTime: 30,
    running: false,
    paused: false,
    phase: 'waiting',
    round: 1,
    hintVisible: false,
    answerRevealed: false,
    contestants: [
      { id: 1, name: 'Player 1', score: 0 },
      { id: 2, name: 'Player 2', score: 0 },
      { id: 3, name: 'Player 3', score: 0 }
    ]
  };

  const liveValue = document.getElementById('live-value-text');
  const liveStatus = document.getElementById('live-status-tag');
  const liveTimer = document.getElementById('live-timer-text');
  const liveCategory = document.getElementById('live-category-title');
  const liveBoard = document.getElementById('live-board-matrix');
  const liveHintCard = document.getElementById('live-hint-card');
  const liveHintText = document.getElementById('live-hint-text');
  const liveSolvedBanner = document.getElementById('live-solved-banner');
  const liveProgress = document.getElementById('live-progress-fill');

  const animateScoreDisplay = window.animateScoreDisplay || function (elem, targetVal, options = {}) {
    if (!elem) return;
    const prefix = options.prefix !== undefined ? options.prefix : '$';
    const suffix = options.suffix !== undefined ? options.suffix : '';
    const duration = typeof options.duration === 'number' ? options.duration : 450;

    let prevVal = 0;
    if (typeof elem._currentScoreVal === 'number') {
      prevVal = elem._currentScoreVal;
    } else {
      const rawText = elem.textContent || '';
      const match = rawText.match(/-?\d[\d,]*/);
      if (match) {
        prevVal = parseInt(match[0].replace(/,/g, ''), 10) || 0;
      }
    }

    const targetNum = typeof targetVal === 'number'
      ? targetVal
      : parseInt(String(targetVal).replace(/[^0-9-]/g, ''), 10) || 0;

    if (!elem.classList.contains('score-transition-active')) {
      elem.classList.add('score-transition-active');
    }

    if (prevVal === targetNum) {
      elem.textContent = `${prefix}${targetNum.toLocaleString()}${suffix}`;
      elem._currentScoreVal = targetNum;
      return;
    }

    elem._currentScoreVal = targetNum;

    if (elem._scoreAnimRaf) cancelAnimationFrame(elem._scoreAnimRaf);
    if (elem._scoreClassTimeout) clearTimeout(elem._scoreClassTimeout);

    const isUp = targetNum > prevVal;
    const isBankrupt = targetNum === 0 && prevVal > 0;
    const bumpClass = isBankrupt ? 'score-bump-bankrupt' : (isUp ? 'score-bump-up' : 'score-bump-down');

    elem.classList.remove('score-bump-up', 'score-bump-down', 'score-bump-bankrupt');
    void elem.offsetWidth;
    elem.classList.add(bumpClass);

    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(prevVal + (targetNum - prevVal) * ease);

      elem.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) {
        elem._scoreAnimRaf = requestAnimationFrame(step);
      } else {
        elem.textContent = `${prefix}${targetNum.toLocaleString()}${suffix}`;
        elem._scoreAnimRaf = null;
        elem._scoreClassTimeout = setTimeout(() => {
          elem.classList.remove('score-bump-up', 'score-bump-down', 'score-bump-bankrupt');
          elem._scoreClassTimeout = null;
        }, 150);
      }
    }

    elem._scoreAnimRaf = requestAnimationFrame(step);
  };

  function renderStage() {
    if (liveValue) {
      liveValue.textContent = typeof state.currentValue === 'number' ? `$${state.currentValue}` : state.currentValue;
    }

    if (liveStatus) {
      liveStatus.textContent = (state.phase || 'WAITING').toUpperCase();
      liveStatus.className = `hud-status-tag ${state.phase}`;
    }

    if (liveTimer) liveTimer.textContent = `${state.seconds || 0}s`;

    if (liveCategory) {
      liveCategory.textContent = (state.category || 'JEOPARDY').toUpperCase();
    }

    // Clue Card
    if (liveHintCard) {
      if (state.hintVisible && state.hint) {
        liveHintCard.classList.remove('hidden');
        if (liveHintText) liveHintText.textContent = state.hint;
      } else {
        liveHintCard.classList.add('hidden');
      }
    }

    // Solved Banner
    if (liveSolvedBanner) {
      if (state.answerRevealed || state.phase === 'answered') {
        liveSolvedBanner.classList.remove('hidden');
      } else {
        liveSolvedBanner.classList.add('hidden');
      }
    }

    // Timer Progress
    if (liveProgress) {
      const pct = ((state.seconds || 0) / (state.revealTime || 30)) * 100;
      liveProgress.style.width = `${pct}%`;
    }

    // Contestant Podiums
    [1, 2, 3].forEach((idx) => {
      const nameElem = document.getElementById(`live-p${idx}-name`);
      const scoreElem = document.getElementById(`live-p${idx}-score`);
      if (nameElem && state.contestants && state.contestants[idx - 1]) {
        nameElem.textContent = state.contestants[idx - 1].name;
      }
      if (scoreElem && state.contestants && state.contestants[idx - 1]) {
        animateScoreDisplay(scoreElem, state.contestants[idx - 1].score || 0, { prefix: '$' });
      }
    });

    // Render 4-Row Board
    if (liveBoard && window.WheelEngine) {
      const isRevealedAll = state.answerRevealed || state.phase === 'answered';
      const rowsData = window.WheelEngine.formatWheelBoard(
        state.answer,
        state.revealed || [],
        isRevealedAll
      );

      liveBoard.innerHTML = rowsData
        .map((rowTiles) => {
          const rowHtml = rowTiles
            .map((t) => {
              if (t.type === 'empty') {
                return '<div class="matrix-tile tile-empty"></div>';
              }
              if (t.isRevealed) {
                return `<div class="matrix-tile tile-letter revealed">${t.char}</div>`;
              }
              return '<div class="matrix-tile tile-letter unrevealed"></div>';
            })
            .join('');
          return `<div class="matrix-row">${rowHtml}</div>`;
        })
        .join('');
    }
  }

  // --- SYNC LISTENERS ---

  channel.onmessage = function (e) {
    const data = e.data;
    if (!data) return;

    if (data.type === 'UPDATE_STATE' && data.state) {
      state = data.state;
      renderStage();
    } else if (data.type === 'PLAY_SOUND' && data.sound) {
      if (window.sounds) window.sounds.play(data.sound);
    }
  };

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed) {
          state = parsed;
          renderStage();
        }
      } catch (err) {}
    }
  });

  function syncFromStorage() {
    try {
      const cached = sessionStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed) {
          state = parsed;
          renderStage();
        }
      }
    } catch (e) {}
  }

  function init() {
    if (window.RoomSync) {
      window.RoomSync.role = 'live';
      window.RoomSync.gameType = 'jeopardy';
      window.RoomSync.attachRoomHUD('.live-header');
      window.RoomSync.onStateChange((newState, sound) => {
        if (newState) {
          state = newState;
          renderStage();
        }
        if (sound && window.sounds) window.sounds.play(sound);
      });

      if (typeof window.RoomSync.onSound === 'function') {
        window.RoomSync.onSound((sound) => {
          if (sound && window.sounds) window.sounds.play(sound);
        });
      }
    }

    syncFromStorage();
    renderStage();

    try {
      channel.postMessage({ type: 'REQUEST_STATE' });
    } catch (e) {}

    setInterval(syncFromStorage, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
