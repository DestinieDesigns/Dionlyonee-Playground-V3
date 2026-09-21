// Dionlyonee Wheel of Fortune Co-Host Assistant Logic (Vanilla JS)
// BroadcastChannel: dionlyonee-wheel-game & Firebase RoomSync

(function () {
  'use strict';

  const CHANNEL_NAME = 'dionlyonee-wheel-game';
  const STORAGE_KEY = 'dionlyonee_wheel_state';
  const channel = new BroadcastChannel(CHANNEL_NAME);

  let state = {
    category: 'Jamaican / Patwa Phrases',
    answer: 'WAH GWAAN',
    hint: '',
    revealed: [],
    calledLetters: [],
    seconds: 30,
    revealTime: 30,
    running: false,
    paused: false,
    phase: 'waiting',
    round: 1,
    hintVisible: false,
    hintUnlocked: false,
    completedTurns: 0,
    hintUnlockTurns: 3,
    answerRevealed: false,
    wheelAngle: 0,
    wheelSpinning: false,
    lastWedge: { label: '$1,000', value: 1000, color: '#10b981', type: 'cash' },
    activePlayerIndex: 0,
    contestants: [
      { name: 'Player 1 (Red)', color: '#ef4444', roundScore: 0, totalScore: 0 },
      { name: 'Player 2 (Yellow)', color: '#eab308', roundScore: 0, totalScore: 0 },
      { name: 'Player 3 (Blue)', color: '#3b82f6', roundScore: 0, totalScore: 0 }
    ]
  };

  let lastHeartbeatTime = Date.now();
  let connCheckInterval = null;

  // DOM Elements
  const cohostConnStatus = document.getElementById('cohost-conn-status');
  const cohostRound = document.getElementById('cohost-round');
  const cohostTimer = document.getElementById('cohost-timer');
  const cohostStatus = document.getElementById('cohost-status');

  const cohostActivePlayer = document.getElementById('cohost-active-player');
  const cohostActiveScore = document.getElementById('cohost-active-score');
  const cohostLastWedge = document.getElementById('cohost-last-wedge');
  const cohostWedgeSubtext = document.getElementById('cohost-wedge-subtext');

  const cohostCategory = document.getElementById('cohost-category');
  const cohostAnswer = document.getElementById('cohost-answer');
  const cohostLetterCount = document.getElementById('cohost-letter-count');

  const cohostHintBox = document.getElementById('cohost-hint-box');
  const cohostHintBadge = document.getElementById('cohost-hint-badge');
  const cohostHintText = document.getElementById('cohost-hint-text');
  const btnToggleStageHint = document.getElementById('btn-cohost-toggle-stage-hint');

  const cohostTiles = document.getElementById('cohost-tiles');
  const cohostCalledLetters = document.getElementById('cohost-called-letters');

  // Quick Dock Buttons
  const btnDockCorrect = document.getElementById('btn-dock-correct');
  const btnDockWrong = document.getElementById('btn-dock-wrong');
  const btnDockNext = document.getElementById('btn-dock-next');
  const btnDockHint = document.getElementById('btn-dock-hint');
  const btnDockPause = document.getElementById('btn-dock-pause');
  const btnDockSpin = document.getElementById('btn-dock-spin');
  const btnDockBuzz = document.getElementById('btn-dock-buzz');

  // Emergency & Safety Modal
  const btnEmergencyBankrupt = document.getElementById('btn-emergency-bankrupt');
  const btnEmergencyReset = document.getElementById('btn-emergency-reset');
  const safetyModal = document.getElementById('safety-modal-overlay');
  const safetyTitle = document.getElementById('safety-modal-title');
  const safetyDesc = document.getElementById('safety-modal-desc');
  const safetyCancel = document.getElementById('btn-safety-cancel');
  const safetyConfirm = document.getElementById('btn-safety-confirm');
  let onSafetyConfirmCallback = null;

  // --- CONNECTION HEALTH MONITOR (🟢/🟡/🔴) ---
  function updateConnectionStatus() {
    if (!cohostConnStatus) return;
    const now = Date.now();
    const diff = (now - lastHeartbeatTime) / 1000;

    if (!navigator.onLine || diff > 45) {
      cohostConnStatus.className = 'conn-pill offline';
      cohostConnStatus.querySelector('.conn-text').textContent = 'OFFLINE';
    } else if (diff > 14) {
      cohostConnStatus.className = 'conn-pill standby';
      cohostConnStatus.querySelector('.conn-text').textContent = 'STANDBY';
    } else {
      cohostConnStatus.className = 'conn-pill online';
      cohostConnStatus.querySelector('.conn-text').textContent = 'LIVE';
    }
  }

  function recordHeartbeat() {
    lastHeartbeatTime = Date.now();
    updateConnectionStatus();
  }

  let lastActionTime = 0;
  let isActionLocked = false;

  // --- ACTION SENDER ---
  function sendAction(action, payload = {}) {
    const now = Date.now();
    // Debounce fast double-taps to prevent duplicate skips or state collisions
    if (isActionLocked || (now - lastActionTime < 450 && (action === 'WRONG' || action === 'NEXT_TURN' || action === 'SPIN' || action === 'SOLVE' || action === 'HINT'))) {
      return;
    }
    isActionLocked = true;
    lastActionTime = now;
    setTimeout(() => {
      isActionLocked = false;
    }, 400);

    recordHeartbeat();
    if (window.sounds) window.sounds.play('click');

    // Send via Firebase RoomSync
    if (window.RoomSync && typeof window.RoomSync.sendAction === 'function') {
      window.RoomSync.sendAction(action, payload);
    }

    // Send via BroadcastChannel
    try {
      channel.postMessage({
        type: 'ACTION',
        action: action,
        payload: payload,
        timestamp: Date.now()
      });
    } catch (e) {
      console.warn('Broadcast error:', e);
    }
  }

  // --- SAFETY CONFIRMATION MODAL ---
  function promptSafetyModal(title, desc, onConfirm) {
    if (!safetyModal) {
      if (confirm(`${title}\n\n${desc}`)) onConfirm();
      return;
    }
    if (safetyTitle) safetyTitle.textContent = title;
    if (safetyDesc) safetyDesc.textContent = desc;
    onSafetyConfirmCallback = onConfirm;
    safetyModal.classList.remove('hidden');
  }

  if (safetyCancel) {
    safetyCancel.addEventListener('click', () => {
      if (safetyModal) safetyModal.classList.add('hidden');
      onSafetyConfirmCallback = null;
    });
  }

  if (safetyConfirm) {
    safetyConfirm.addEventListener('click', () => {
      if (safetyModal) safetyModal.classList.add('hidden');
      if (typeof onSafetyConfirmCallback === 'function') {
        onSafetyConfirmCallback();
      }
      onSafetyConfirmCallback = null;
    });
  }

  // --- UI RENDER ENGINE ---
  function renderCoHostUI() {
    recordHeartbeat();

    // Round & Timer
    if (cohostRound) cohostRound.textContent = `ROUND ${state.round || 1}`;
    if (cohostTimer) cohostTimer.textContent = `${state.seconds ?? 30}s`;

    if (cohostStatus) {
      cohostStatus.textContent = (state.phase || 'WAITING').toUpperCase();
      cohostStatus.className = `status-tag ${state.phase || 'waiting'}`;
    }

    // Active Contestant
    const activeIdx = state.activePlayerIndex ?? 0;
    const activeContestant = (state.contestants && state.contestants[activeIdx])
      ? state.contestants[activeIdx]
      : { name: `Player ${activeIdx + 1}`, roundScore: 0, totalScore: 0 };

    if (cohostActivePlayer) {
      cohostActivePlayer.textContent = activeContestant.name.toUpperCase();
      if (activeContestant.color) {
        cohostActivePlayer.style.color = activeContestant.color;
      }
    }
    if (cohostActiveScore) {
      cohostActiveScore.textContent = `Round Bank: $${(activeContestant.roundScore || 0).toLocaleString()}`;
    }

    // Landed Wedge
    if (cohostLastWedge && state.lastWedge) {
      cohostLastWedge.textContent = state.lastWedge.label || '$1,000';
      if (cohostWedgeSubtext) {
        if (state.lastWedge.type === 'bankrupt') {
          cohostWedgeSubtext.textContent = 'Bankrupt Penalty';
          cohostLastWedge.style.color = '#ef4444';
        } else if (state.lastWedge.type === 'lose') {
          cohostWedgeSubtext.textContent = 'Lose Turn Penalty';
          cohostLastWedge.style.color = '#f59e0b';
        } else {
          cohostWedgeSubtext.textContent = 'Cash Wedge';
          cohostLastWedge.style.color = '#38bdf8';
        }
      }
    }

    // Category & Answer
    if (cohostCategory) {
      cohostCategory.textContent = state.category || 'WHEEL OF FORTUNE';
    }
    const cleanAnswer = (state.answer || '').toUpperCase();
    if (cohostAnswer) {
      cohostAnswer.textContent = cleanAnswer || 'NO PUZZLE LOADED';
    }
    if (cohostLetterCount) {
      const lettersOnly = cleanAnswer.replace(/[^A-Z0-9]/g, '');
      cohostLetterCount.textContent = lettersOnly.length;
    }

    // Hint Status Logic
    const unlockTurns = state.hintUnlockTurns || 3;
    const remainingTurns = Math.max(0, unlockTurns - (state.completedTurns || 0));
    const isUnlocked = state.hintUnlocked || remainingTurns === 0;

    if (cohostHintBox) {
      if (!isUnlocked) {
        cohostHintBox.className = 'hint-card locked';
        if (cohostHintBadge) {
          cohostHintBadge.className = 'hint-badge locked';
          cohostHintBadge.textContent = `🔒 HINT LOCKED (${state.completedTurns || 0}/${unlockTurns} TURNS COMPLETED)`;
        }
        if (cohostHintText) {
          cohostHintText.innerHTML = `Secret clue is concealed. Unlocks after <strong>${remainingTurns}</strong> more completed turn${remainingTurns === 1 ? '' : 's'}.`;
        }
        if (btnToggleStageHint) {
          btnToggleStageHint.classList.add('hidden');
        }
      } else {
        cohostHintBox.className = 'hint-card unlocked';
        if (cohostHintBadge) {
          cohostHintBadge.className = 'hint-badge unlocked';
          cohostHintBadge.textContent = state.hintVisible
            ? '👁️ CLUE VISIBLE ON LIVE STAGE'
            : '💡 CLUE UNLOCKED (CO-HOST VISIBLE ONLY)';
        }
        if (cohostHintText) {
          cohostHintText.innerHTML = `💡 <strong>CLUE:</strong> ${state.hint || 'No clue text provided.'}`;
        }
        if (btnToggleStageHint) {
          btnToggleStageHint.classList.remove('hidden');
          btnToggleStageHint.textContent = state.hintVisible
            ? '👁️ HIDE CLUE FROM STAGE'
            : '📢 REVEAL CLUE ON LIVE STAGE';
          if (state.hintVisible) {
            btnToggleStageHint.classList.add('active');
          } else {
            btnToggleStageHint.classList.remove('active');
          }
        }
      }
    }

    // Quick Dock Hint Button Status
    if (btnDockHint) {
      if (!isUnlocked) {
        btnDockHint.classList.remove('unlocked');
        btnDockHint.disabled = true;
        btnDockHint.innerHTML = `<span class="dock-icon">🔒</span><span class="dock-label">LOCKED (${remainingTurns})</span>`;
      } else if (!state.hintVisible) {
        btnDockHint.classList.add('unlocked');
        btnDockHint.disabled = false;
        btnDockHint.innerHTML = `<span class="dock-icon">💡</span><span class="dock-label">SHOW HINT</span>`;
      } else {
        btnDockHint.classList.remove('unlocked');
        btnDockHint.disabled = false;
        btnDockHint.innerHTML = `<span class="dock-icon">👁️</span><span class="dock-label">HIDE HINT</span>`;
      }
    }

    // Quick Dock Pause Button
    if (btnDockPause) {
      btnDockPause.innerHTML = state.running
        ? `<span class="dock-icon">⏸</span><span class="dock-label">PAUSE</span>`
        : `<span class="dock-icon">▶</span><span class="dock-label">RESUME</span>`;
    }

    // Render 4-Row Board Matrix (Cached to prevent excessive DOM reflow)
    if (cohostTiles && window.WheelEngine) {
      const isRevealedAll = state.answerRevealed || state.phase === 'answered';
      const revealedKey = (state.revealed || []).slice().sort().join(',');
      const boardKey = `${state.answer}__${revealedKey}__${isRevealedAll}`;

      if (cohostTiles._lastBoardKey !== boardKey) {
        cohostTiles._lastBoardKey = boardKey;
        const rowsData = window.WheelEngine.formatWheelBoard(
          state.answer,
          state.revealed || [],
          isRevealedAll
        );

        cohostTiles.innerHTML = rowsData
          .map((rowTiles) => {
            const rowHtml = rowTiles
              .map((t) => {
                if (t.type === 'empty') {
                  return '<div class="cohost-tile tile-empty"></div>';
                }
                if (t.isRevealed) {
                  return `<div class="cohost-tile tile-revealed">${t.char}</div>`;
                }
                return `<div class="cohost-tile tile-unrevealed">${t.char}</div>`;
              })
              .join('');
            return `<div class="cohost-row">${rowHtml}</div>`;
          })
          .join('');
      }
    }

    // Render Called Letters Tracker
    if (cohostCalledLetters) {
      const called = state.calledLetters || [];
      if (called.length === 0) {
        cohostCalledLetters.innerHTML = '<span class="called-letter-tag empty">No letters called yet</span>';
      } else {
        const answerUpper = (state.answer || '').toUpperCase();
        cohostCalledLetters.innerHTML = called
          .map((char) => {
            const isHit = answerUpper.includes(char);
            return `<span class="called-letter-tag ${isHit ? 'hit' : 'miss'}">${char}</span>`;
          })
          .join('');
      }
    }
  }

  // --- BUZZER & SPIN COHOST ACTIONS ---
  function triggerCoHostBuzz() {
    if (window.sounds) window.sounds.play('buzzer');

    if (window.RoomSync && typeof window.RoomSync.sendBuzzer === 'function') {
      window.RoomSync.sendBuzzer('Co-Host Phone');
    }

    try {
      channel.postMessage({
        type: 'COHOST_BUZZ',
        sender: 'Co-Host Phone',
        timestamp: Date.now()
      });
      channel.postMessage({
        type: 'PLAY_SOUND',
        sound: 'buzzer'
      });
    } catch (e) {}

    if (btnDockBuzz) {
      btnDockBuzz.style.transform = 'scale(0.9)';
      setTimeout(() => {
        btnDockBuzz.style.transform = '';
      }, 200);
    }
  }

  function triggerCoHostSpin() {
    if (window.sounds) window.sounds.play('wheel');
    sendAction('SPIN');

    if (btnDockSpin) {
      btnDockSpin.disabled = true;
      btnDockSpin.style.opacity = '0.5';
      setTimeout(() => {
        btnDockSpin.disabled = false;
        btnDockSpin.style.opacity = '1';
      }, 3500);
    }
  }

  // --- MESSAGE LISTENERS ---
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

  function syncFromStorage() {
    try {
      const roomKey = window.RoomSync ? `dion_wheel_state_${window.RoomSync.roomId}` : STORAGE_KEY;
      const cached = sessionStorage.getItem(roomKey) || sessionStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed) {
          state = parsed;
          renderCoHostUI();
        }
      }
    } catch (e) {}
  }

  // --- INITIALIZATION ---
  function init() {
    // 1. RoomSync setup
    if (window.RoomSync) {
      window.RoomSync.role = 'cohost';
      window.RoomSync.gameType = 'wheel';
      window.RoomSync.attachRoomHUD('.cohost-header');

      window.RoomSync.onStateChange((newState, sound) => {
        if (newState) {
          state = newState;
          renderCoHostUI();
        }
        if (sound && window.sounds) window.sounds.play(sound);
      });
    }

    // 2. Attach Quick Dock Handlers
    if (btnDockCorrect) {
      btnDockCorrect.addEventListener('click', () => {
        promptSafetyModal(
          'Mark Correct / Solve',
          'Are you sure you want to mark the puzzle as SOLVED on the live stage?',
          () => sendAction('SOLVE')
        );
      });
    }

    if (btnDockWrong) {
      btnDockWrong.addEventListener('click', () => {
        if (window.sounds) window.sounds.play('buzzer');
        sendAction('WRONG');
      });
    }

    if (btnDockNext) {
      btnDockNext.addEventListener('click', () => {
        sendAction('NEXT_TURN');
      });
    }

    if (btnDockHint) {
      btnDockHint.addEventListener('click', () => {
        const unlockTurns = state.hintUnlockTurns || 3;
        const remainingTurns = Math.max(0, unlockTurns - (state.completedTurns || 0));
        if (!state.hintUnlocked && remainingTurns > 0) {
          if (window.sounds) window.sounds.play('buzzer');
          alert(`🔒 Hint Locked! Need ${remainingTurns} more completed contestant turn${remainingTurns === 1 ? '' : 's'}.`);
          return;
        }
        sendAction('HINT');
      });
    }

    if (btnDockPause) {
      btnDockPause.addEventListener('click', () => {
        sendAction('PAUSE');
      });
    }

    if (btnDockSpin) {
      btnDockSpin.addEventListener('click', triggerCoHostSpin);
    }

    if (btnDockBuzz) {
      btnDockBuzz.addEventListener('click', triggerCoHostBuzz);
    }

    // 3. Stage Hint Toggle Button
    if (btnToggleStageHint) {
      btnToggleStageHint.addEventListener('click', () => {
        sendAction('HINT');
      });
    }

    // 4. Emergency Controls (with Safety Modal)
    if (btnEmergencyBankrupt) {
      btnEmergencyBankrupt.addEventListener('click', () => {
        const activeName = (state.contestants && state.contestants[state.activePlayerIndex])
          ? state.contestants[state.activePlayerIndex].name
          : `Player ${(state.activePlayerIndex ?? 0) + 1}`;
        promptSafetyModal(
          'Force Bankrupt',
          `Are you sure you want to force BANKRUPT on ${activeName}? Round bank will be cleared to $0.`,
          () => sendAction('BANKRUPT')
        );
      });
    }

    if (btnEmergencyReset) {
      btnEmergencyReset.addEventListener('click', () => {
        promptSafetyModal(
          'Reset Current Board',
          'Are you sure you want to reset all revealed letters and restart the current puzzle?',
          () => sendAction('RESET_BOARD')
        );
      });
    }

    // 5. Connection heartbeat ticker (every 3 seconds)
    connCheckInterval = setInterval(updateConnectionStatus, 3000);
    window.addEventListener('online', recordHeartbeat);
    window.addEventListener('offline', updateConnectionStatus);

    // Initial sync
    syncFromStorage();
    renderCoHostUI();

    try {
      channel.postMessage({ type: 'REQUEST_STATE' });
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
