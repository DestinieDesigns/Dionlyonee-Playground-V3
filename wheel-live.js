// Dionlyonee Wheel of Fortune Live Stage Engine (Pure Vanilla JS)
// BroadcastChannel: dionlyonee-wheel-game
// Supports Universal Game Transitions, Dynamic Contestants, and Big Wheel Mode

(function () {
  'use strict';

  const CHANNEL_NAME = 'dionlyonee-wheel-game';
  const STORAGE_KEY = 'dionlyonee_wheel_state';
  const channel = new BroadcastChannel(CHANNEL_NAME);

  let state = {
    category: 'Jamaican Phrases',
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
    answerRevealed: false,
    wheelAngle: 0,
    wheelSpinning: false,
    solveRewardAmount: 500,
    solveRewardEarned: 500,
    solvedBy: '',
    contestants: [
      { name: 'Player 1 (Red)', color: '#ef4444', roundScore: 0, totalScore: 0 },
      { name: 'Player 2 (Yellow)', color: '#eab308', roundScore: 0, totalScore: 0 },
      { name: 'Player 3 (Blue)', color: '#3b82f6', roundScore: 0, totalScore: 0 }
    ]
  };

  const liveRound = document.getElementById('live-round-text');
  const liveStatus = document.getElementById('live-status-tag');
  const liveTimer = document.getElementById('live-timer-text');
  const liveCategory = document.getElementById('live-category-title');
  const liveBoard = document.getElementById('live-board-matrix');
  const liveHintCard = document.getElementById('live-hint-card');
  const liveHintText = document.getElementById('live-hint-text');
  const liveSolvedBanner = document.getElementById('live-solved-banner');
  const liveSolvedReward = document.getElementById('live-solved-reward');
  const liveProgress = document.getElementById('live-progress-fill');
  const liveContestantsBar = document.getElementById('live-contestants-bar');

  const liveActionBanner = document.getElementById('live-action-banner');
  const liveActionText = document.getElementById('live-action-text');
  const liveActionTimer = document.getElementById('live-action-timer');

  // Big Wheel Elements
  const liveBigWheelOverlay = document.getElementById('live-big-wheel-overlay');
  const liveBigWheelCanvas = document.getElementById('live-big-wheel-canvas');
  const bigWheelActionTitle = document.getElementById('big-wheel-action-title');
  const bigWheelWedgeCallout = document.getElementById('big-wheel-wedge-callout');

  // Wait screen elements
  const waitRoomTag = document.getElementById('waiting-room-tag');
  const waitingTitle = document.getElementById('waiting-title');
  const waitingSubtitle = document.getElementById('waiting-subtitle');

  let isSpinningLive = false;
  let lastPhaseCategory = null; // 'waiting' or 'active'

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

  /**
   * Render dynamic contestant podiums supporting unlimited players
   */
  function renderContestants() {
    if (!liveContestantsBar || !state.contestants) return;
    const contestants = state.contestants;
    const activeIdx = state.activePlayerIndex ?? 0;

    // Adjust grid columns if needed
    const count = contestants.length;
    if (count <= 3) {
      liveContestantsBar.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
    } else if (count === 4) {
      liveContestantsBar.style.gridTemplateColumns = `repeat(4, 1fr)`;
    } else {
      liveContestantsBar.style.gridTemplateColumns = `repeat(auto-fit, minmax(200px, 1fr))`;
    }

    // Check if structure matches
    const existingCards = liveContestantsBar.querySelectorAll('.stage-player-card');
    if (existingCards.length !== count) {
      liveContestantsBar.innerHTML = contestants
        .map((c, idx) => {
          const color = c.color || '#facc15';
          return `
            <div id="live-player-card-${idx}" class="stage-player-card ${idx === activeIdx ? 'active' : ''}">
              <div class="stage-player-header">
                <span class="stage-player-dot" style="background: ${color}; box-shadow: 0 0 8px ${color};"></span>
                <span id="live-player-name-${idx}" class="stage-player-name">${c.name || 'Player ' + (idx + 1)}</span>
              </div>
              <div class="stage-player-score-box">
                <span id="live-player-round-${idx}" class="stage-player-round">$0</span>
                <span id="live-player-total-${idx}" class="stage-player-total">Total: $0</span>
              </div>
              <div id="live-player-turn-tag-${idx}" class="stage-turn-tag ${idx === activeIdx ? 'active' : ''}">
                ${idx === activeIdx ? 'ACTIVE TURN' : 'WAITING'}
              </div>
            </div>
          `;
        })
        .join('');
    }

    // Update values
    contestants.forEach((c, idx) => {
      const card = document.getElementById(`live-player-card-${idx}`);
      const nameElem = document.getElementById(`live-player-name-${idx}`);
      const roundElem = document.getElementById(`live-player-round-${idx}`);
      const totalElem = document.getElementById(`live-player-total-${idx}`);
      const tagElem = document.getElementById(`live-player-turn-tag-${idx}`);

      if (card) {
        if (idx === activeIdx) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      }
      if (nameElem && nameElem.textContent !== c.name) {
        nameElem.textContent = c.name;
      }
      if (roundElem) {
        animateScoreDisplay(roundElem, c.roundScore || 0, { prefix: '$' });
      }
      if (totalElem) {
        animateScoreDisplay(totalElem, c.totalScore || 0, { prefix: 'Total: $' });
      }
      if (tagElem) {
        if (idx === activeIdx) {
          tagElem.textContent = 'ACTIVE TURN';
          tagElem.className = 'stage-turn-tag active';
        } else {
          tagElem.textContent = 'WAITING';
          tagElem.className = 'stage-turn-tag';
        }
      }
    });
  }

  function renderStage() {
    if (liveRound) liveRound.textContent = state.round || 1;

    if (liveStatus) {
      liveStatus.textContent = (state.phase || 'WAITING').toUpperCase();
      liveStatus.className = `hud-status-tag ${state.phase}`;
    }

    if (liveTimer) liveTimer.textContent = `${state.seconds || 0}s`;

    if (liveCategory) {
      liveCategory.textContent = (state.category || 'WHEEL OF FORTUNE').toUpperCase();
    }

    // Determine if in waiting or cooldown phase
    const isWaitingOrCooldown = state.phase === 'waiting' || 
                                state.phase === 'cooldown' || 
                                Boolean(state.isCooldown) || 
                                Boolean(state.showWaitingScreen);

    if (waitRoomTag && window.RoomSync) {
      waitRoomTag.textContent = `ROOM: ${window.RoomSync.roomId || 'DION1'}`;
    }

    // Use Universal Transition Engine to smoothly transition between Wait and Gameplay
    const currentVisualCategory = isWaitingOrCooldown ? 'waiting' : 'active';
    if (window.GameTransitions) {
      if (lastPhaseCategory === null) {
        window.GameTransitions.applyPhase(currentVisualCategory, false);
      } else if (lastPhaseCategory !== currentVisualCategory) {
        window.GameTransitions.transitionTo(currentVisualCategory);
      }
      lastPhaseCategory = currentVisualCategory;
    }

    if (isWaitingOrCooldown) {
      if (state.phase === 'cooldown' || state.isCooldown) {
        if (waitingTitle) waitingTitle.textContent = 'ROUND FINISHED • GET READY!';
        if (waitingSubtitle) waitingSubtitle.textContent = 'The Host is celebrating the winner and preparing the next puzzle.';
      } else {
        if (waitingTitle) waitingTitle.textContent = 'WAITING FOR HOST TO START';
        if (waitingSubtitle) waitingSubtitle.textContent = 'The Host is preparing the game board and contestants. Round 1 starts soon!';
      }
      return; // Do not render or leak active board while in wait screen
    }

    // --- ACTIVE GAMEPLAY RENDERING ---
    renderContestants();

    const activeIdx = state.activePlayerIndex ?? 0;
    const activeContestant = (state.contestants && state.contestants[activeIdx])
      ? state.contestants[activeIdx]
      : { name: `Player ${activeIdx + 1}` };

    // Action banner
    if (liveActionBanner) {
      if (state.phase === 'active' || state.phase === 'pick_letter' || state.phase === 'timeup') {
        liveActionBanner.classList.remove('hidden');
        if (liveActionText) {
          if (state.phase === 'timeup') {
            liveActionText.textContent = `⏰ TIME'S UP FOR ${activeContestant.name.toUpperCase()}! PASSING TO NEXT PLAYER...`;
          } else if (state.phase === 'pick_letter') {
            const wedgeLabel = state.lastWedge && state.lastWedge.label ? ` (${state.lastWedge.label})` : '';
            liveActionText.textContent = `🎯 ${activeContestant.name.toUpperCase()} — PICK A LETTER${wedgeLabel}!`;
          } else {
            liveActionText.textContent = `${activeContestant.name.toUpperCase()}'S TURN — SPIN THE WHEEL OR SOLVE!`;
          }
        }
        if (liveActionTimer) {
          liveActionTimer.textContent = `${state.seconds || 0}s`;
          if (state.seconds <= 5 && state.seconds > 0) {
            liveActionTimer.style.color = '#ef4444';
          } else {
            liveActionTimer.style.color = 'var(--gold-bright)';
          }
        }
      } else {
        liveActionBanner.classList.add('hidden');
      }
    }

    // Secret Clue / Hint - Automatically shows on the live screen after 3 turns
    if (liveHintCard && liveHintText) {
      const isAutoUnlocked = ((state.completedTurns || 0) >= (state.hintUnlockTurns || 3));
      const shouldShowHint = Boolean((state.hintVisible || isAutoUnlocked) && state.hint);
      if (shouldShowHint) {
        liveHintCard.classList.remove('hidden');
        liveHintText.textContent = state.hint;
      } else {
        liveHintCard.classList.add('hidden');
      }
    }

    // Solved celebration banner
    if (liveSolvedBanner) {
      const isSolved = state.answerRevealed || state.phase === 'answered';
      if (isSolved) {
        liveSolvedBanner.classList.remove('hidden');
        if (liveSolvedReward) {
          const rewardAmount = state.solveRewardEarned || state.solveRewardAmount || 500;
          const solver = state.solvedBy ? ` • ${state.solvedBy}` : '';
          const rewardStr = (typeof rewardAmount === 'number') ? `+$${rewardAmount.toLocaleString()}` : `${rewardAmount}`;
          liveSolvedReward.textContent = `💰 ${rewardStr} SOLVE REWARD${solver}`;
        }
      } else {
        liveSolvedBanner.classList.add('hidden');
      }
    }

    // Timer Progress
    if (liveProgress) {
      const pct = ((state.seconds || 0) / (state.revealTime || 30)) * 100;
      liveProgress.style.width = `${pct}%`;
    }

    // Render 4-Row Board (Cached to avoid expensive layout recalculations)
    if (liveBoard && window.WheelEngine) {
      const isRevealedAll = state.answerRevealed || state.phase === 'answered';
      const revealedKey = (state.revealed || []).slice().sort().join(',');
      const boardKey = `${state.answer}__${revealedKey}__${isRevealedAll}`;

      if (liveBoard._lastBoardKey !== boardKey) {
        liveBoard._lastBoardKey = boardKey;
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
  }

  // --- 🎡 BIG WHEEL SPIN EXPERIENCE ---

  function runLiveWheelSpin(data) {
    if (!liveBigWheelCanvas || !window.WheelEngine) return;
    isSpinningLive = true;

    // Show big wheel overlay
    if (liveBigWheelOverlay) {
      liveBigWheelOverlay.classList.remove('hidden');
    }

    const activeIdx = state.activePlayerIndex ?? 0;
    const activeContestant = (state.contestants && state.contestants[activeIdx])
      ? state.contestants[activeIdx]
      : { name: 'Contestant' };

    if (bigWheelActionTitle) {
      bigWheelActionTitle.textContent = `${activeContestant.name.toUpperCase()} IS SPINNING THE WHEEL!`;
    }

    if (bigWheelWedgeCallout) {
      bigWheelWedgeCallout.className = 'big-wheel-wedge-callout';
      bigWheelWedgeCallout.textContent = 'SPINNING...';
    }

    const startAngle = typeof data.startAngle === 'number' ? data.startAngle : (state.wheelAngle || 0);
    const targetAngle = typeof data.targetAngle === 'number'
      ? data.targetAngle
      : startAngle + (4 + Math.random() * 3) * Math.PI * 2;
    const duration = data.duration || 4200;
    const startTime = performance.now();

    if (window.sounds) window.sounds.play('wheel');

    let lastTickAngle = startAngle;
    const pegArc = (2 * Math.PI) / 24;

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeProgress = 1 - Math.pow(1 - progress, 3.5);

      const currentAngle = startAngle + (targetAngle - startAngle) * easeProgress;
      window.WheelEngine.drawWheel(liveBigWheelCanvas, currentAngle);

      // Sound tick on peg crossing
      if (Math.abs(currentAngle - lastTickAngle) >= pegArc) {
        lastTickAngle = currentAngle;
        if (window.sounds) window.sounds.play('wheel_tick');
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isSpinningLive = false;
        state.wheelAngle = targetAngle;
        const wedge = window.WheelEngine.getWedgeAtPointer
          ? window.WheelEngine.getWedgeAtPointer(targetAngle)
          : window.WheelEngine.getWedgeAtAngle(targetAngle);
        state.lastWedge = wedge || { label: '$1,000', value: 1000, color: '#10b981', type: 'cash' };

        // Celebration display on big wheel callout
        if (bigWheelWedgeCallout) {
          if (state.lastWedge.type === 'bankrupt') {
            bigWheelWedgeCallout.textContent = '💥 BANKRUPT!';
            bigWheelWedgeCallout.classList.add('bankrupt');
            if (window.sounds) window.sounds.play('bankrupt');
          } else if (state.lastWedge.type === 'lose_turn') {
            bigWheelWedgeCallout.textContent = '🛑 LOSE A TURN!';
            bigWheelWedgeCallout.classList.add('bankrupt');
            if (window.sounds) window.sounds.play('buzzer');
          } else {
            bigWheelWedgeCallout.textContent = `LANDED: ${state.lastWedge.label}!`;
            bigWheelWedgeCallout.classList.add('landed');
            if (window.sounds) window.sounds.play('bell');
          }
        }

        // Keep Big Wheel visible for 2 seconds so viewers can celebrate, then smoothly return to puzzle board
        setTimeout(() => {
          if (liveBigWheelOverlay) {
            liveBigWheelOverlay.classList.add('hidden');
          }
          renderStage();
        }, 2200);
      }
    }
    requestAnimationFrame(animate);
  }

  // --- SYNC LISTENERS ---

  channel.onmessage = function (e) {
    const data = e.data;
    if (!data) return;

    if (data.type === 'UPDATE_STATE' && data.state) {
      state = data.state;
      renderStage();
    } else if (data.type === 'WHEEL_SPIN') {
      runLiveWheelSpin(data);
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
          renderStage();
        }
      }
    } catch (e) {}
  }

  function init() {
    if (window.GameTransitions) {
      window.GameTransitions.initStage({
        stage: document.getElementById('live-stage'),
        waitScreen: document.getElementById('wait-screen'),
        gameScreen: document.getElementById('game-screen')
      });
    }

    if (window.RoomSync) {
      window.RoomSync.role = 'live';
      window.RoomSync.gameType = 'wheel';
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

      window.RoomSync.onWheelSpin((spinData) => {
        runLiveWheelSpin(spinData);
      });
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
