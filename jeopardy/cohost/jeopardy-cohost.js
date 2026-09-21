// Dionlyonee Jeopardy Co-Host Console Logic (Vanilla JS)
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

  const cohostValue = document.getElementById('cohost-value');
  const cohostTimer = document.getElementById('cohost-timer');
  const cohostStatus = document.getElementById('cohost-status');
  const cohostCategory = document.getElementById('cohost-category');
  const cohostAnswer = document.getElementById('cohost-answer');
  const cohostHint = document.getElementById('cohost-hint');
  const cohostTiles = document.getElementById('cohost-tiles');
  const cohostScoresRow = document.getElementById('cohost-scores-row');
  const btnBuzz = document.getElementById('btn-cohost-buzz');

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

  function renderCoHostUI() {
    if (cohostValue) {
      cohostValue.textContent = typeof state.currentValue === 'number' ? `$${state.currentValue}` : state.currentValue;
    }
    if (cohostTimer) cohostTimer.textContent = `${state.seconds || 0}s`;

    if (cohostStatus) {
      cohostStatus.textContent = (state.phase || 'WAITING').toUpperCase();
      cohostStatus.className = `status-tag ${state.phase}`;
    }

    if (cohostCategory) {
      cohostCategory.textContent = state.category || 'JEOPARDY';
    }

    if (cohostAnswer) {
      cohostAnswer.textContent = state.answer ? state.answer.toUpperCase() : 'NO PUZZLE LOADED';
    }

    if (cohostHint) {
      if (state.hint) {
        cohostHint.innerHTML = `💡 <strong>CLUE / QUESTION:</strong> ${state.hint}`;
      } else {
        cohostHint.textContent = '🔒 No clue provided for this item.';
      }
    }

    // Render Contestant Scores
    if (cohostScoresRow && state.contestants) {
      state.contestants.forEach((p, idx) => {
        let card = document.getElementById(`cohost-score-card-${idx}`);
        if (!card) {
          card = document.createElement('div');
          card.id = `cohost-score-card-${idx}`;
          card.className = 'cohost-score-card';
          card.innerHTML = `<div class="cohost-score-name">${p.name}</div><div class="cohost-score-val" id="cohost-score-val-${idx}">$${p.score}</div>`;
          cohostScoresRow.appendChild(card);
        } else {
          const nameEl = card.querySelector('.cohost-score-name');
          const valEl = document.getElementById(`cohost-score-val-${idx}`);
          if (nameEl) nameEl.textContent = p.name;
          if (valEl) animateScoreDisplay(valEl, p.score || 0, { prefix: '$' });
        }
      });
    }

    // Render Board Matrix with dimmed unrevealed letters
    if (cohostTiles && window.WheelEngine) {
      const rowsData = window.WheelEngine.formatWheelBoard(
        state.answer,
        state.revealed || [],
        state.answerRevealed || state.phase === 'answered'
      );

      cohostTiles.innerHTML = rowsData
        .map((rowTiles) => {
          const rowHtml = rowTiles
            .map((t) => {
              if (t.type === 'empty') {
                return '<div class="cohost-tile tile-empty" style="background:#061148; border:1px solid #02092a; width:26px; height:32px; border-radius:3px;"></div>';
              }
              if (t.isRevealed) {
                return `<div class="cohost-tile tile-letter revealed" style="background:#ffffff; color:#000; font-weight:900; width:26px; height:32px; display:flex; align-items:center; justify-content:center; border:1px solid #eab308; border-radius:3px; font-size:16px;">${t.char}</div>`;
              }
              // Unrevealed to audience but visible as dimmed letter to Co-Host
              return `<div class="cohost-tile tile-letter unrevealed" style="background:#0f172a; color:#64748b; font-weight:900; width:26px; height:32px; display:flex; align-items:center; justify-content:center; border:1px dashed #334155; border-radius:3px; font-size:16px;">${t.char}</div>`;
            })
            .join('');
          return `<div style="display:flex; justify-content:center; gap:3px; margin-bottom:3px;">${rowHtml}</div>`;
        })
        .join('');
    }
  }

  function triggerCoHostBuzz() {
    if (window.sounds) window.sounds.play('buzzer');

    try {
      channel.postMessage({
        type: 'COHOST_BUZZ',
        sender: 'Co-Host Desk',
        timestamp: Date.now()
      });
      channel.postMessage({
        type: 'PLAY_SOUND',
        sound: 'buzzer'
      });
    } catch (e) {
      console.warn('Co-host buzz error:', e);
    }

    if (btnBuzz) {
      btnBuzz.style.transform = 'scale(0.95)';
      btnBuzz.style.background = '#dc2626';
      setTimeout(() => {
        btnBuzz.style.transform = 'none';
        btnBuzz.style.background = '';
      }, 300);
    }
  }

  channel.onmessage = function (e) {
    const data = e.data;
    if (!data) return;

    if (data.type === 'UPDATE_STATE' && data.state) {
      state = data.state;
      renderCoHostUI();
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
          renderCoHostUI();
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
          renderCoHostUI();
        }
      }
    } catch (e) {}
  }

  function init() {
    if (window.RoomSync) {
      window.RoomSync.role = 'cohost';
      window.RoomSync.gameType = 'jeopardy';
      window.RoomSync.attachRoomHUD('.cohost-header');
      window.RoomSync.onStateChange((newState, sound) => {
        if (newState) {
          state = newState;
          renderCoHostUI();
        }
        if (sound && window.sounds) window.sounds.play(sound);
      });
    }

    if (btnBuzz) btnBuzz.addEventListener('click', triggerCoHostBuzz);

    syncFromStorage();
    renderCoHostUI();

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
