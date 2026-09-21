// Dionlyonee Wheel of Fortune Host Console Logic (Vanilla JS)
// BroadcastChannel: dionlyonee-wheel-game (and sync via dionlyonee_wheel_state)

(function () {
  'use strict';

  const urlParams = new URLSearchParams(window.location.search);
  const isSolo = urlParams.get('singleplayer') === 'true' || urlParams.get('solo') === 'true';

  const CHANNEL_NAME = 'dionlyonee-wheel-game';
  const STORAGE_KEY = 'dionlyonee_wheel_state';
  const channel = new BroadcastChannel(CHANNEL_NAME);

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

  let state = {
    category: 'Jamaican / Patwa Phrases',
    answer: 'WAH GWAAN',
    hint: 'Popular Jamaican greeting / What is going on',
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
    currentPlayerIndex: 0,
    solveRewardAmount: 500,
    solveAwardMode: 'guaranteed',
    solveRewardEarned: 500,
    solvedBy: '',
    isCooldown: false,
    showWaitingScreen: false,
    contestants: [
      { name: 'Player 1 (Red)', roundScore: 0, totalScore: 0, color: '#ef4444' },
      { name: 'Player 2 (Yellow)', roundScore: 0, totalScore: 0, color: '#eab308' },
      { name: 'Player 3 (Blue)', roundScore: 0, totalScore: 0, color: '#3b82f6' }
    ]
  };

  let timerInterval = null;

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

  // DOM ELEMENTS
  const statusBadge = document.getElementById('host-status-badge');
  const catDisplay = document.getElementById('host-category-display');
  const roundDisplay = document.getElementById('host-round-display');
  const boardPreview = document.getElementById('wheel-board-host-preview');
  const hintText = document.getElementById('host-hint-text');
  const hintBox = document.getElementById('host-hint-box');

  const timerNumber = document.getElementById('timer-number');
  const timerProgress = document.getElementById('timer-progress-fill');
  const btnTimerStart = document.getElementById('btn-timer-start');
  const btnTimerPause = document.getElementById('btn-timer-pause');
  const btnTimerReset = document.getElementById('btn-timer-reset');

  const selectCat = document.getElementById('select-category');
  const selectPuz = document.getElementById('select-puzzle');
  const btnLoad = document.getElementById('btn-load-puzzle');
  const btnRandom = document.getElementById('btn-random-puzzle');
  const inputAnswer = document.getElementById('input-custom-answer');
  const inputHint = document.getElementById('input-custom-hint');
  const btnApplyCustom = document.getElementById('btn-apply-custom');

  const keyboardGrid = document.getElementById('letter-keyboard');
  const btnCallRandom = document.getElementById('btn-call-random');
  const btnCallVowels = document.getElementById('btn-call-vowels');
  const btnCallConsonants = document.getElementById('btn-call-consonants');

  const btnSpinWheel = document.getElementById('btn-spin-wheel');
  const btnCallAndSpin = document.getElementById('btn-call-and-spin');
  const wheelCanvas = document.getElementById('host-wheel-canvas');
  const wheelResultDisplay = document.getElementById('wheel-result-display');
  const wheelStatusTag = document.getElementById('wheel-status-tag');
  const activeTurnBadge = document.getElementById('active-turn-badge');
  const btnNextPlayer = document.getElementById('btn-next-player');
  const btnBankScores = document.getElementById('btn-bank-scores');

  const btnToggleHint = document.getElementById('btn-toggle-hint');
  const btnRevealAll = document.getElementById('btn-reveal-all');
  const btnNextRound = document.getElementById('btn-next-round');
  const btnResetBoard = document.getElementById('btn-reset-board');

  // Quick Dock Buttons
  const dockBtnSpin = document.getElementById('dock-btn-spin');
  const dockBtnNext = document.getElementById('dock-btn-next');
  const dockBtnWrong = document.getElementById('dock-btn-wrong');
  const dockBtnHint = document.getElementById('dock-btn-hint');
  const dockBtnSolve = document.getElementById('dock-btn-solve');
  const dockBtnPause = document.getElementById('dock-btn-pause');

  // Safety Confirmation Modal
  const safetyModal = document.getElementById('safety-modal-overlay');
  const safetyTitle = document.getElementById('safety-modal-title');
  const safetyDesc = document.getElementById('safety-modal-desc');
  const safetyCancel = document.getElementById('btn-safety-cancel');
  const safetyConfirm = document.getElementById('btn-safety-confirm');
  let onSafetyConfirmCallback = null;

  function promptSafetyConfirmation(title, desc, onConfirm) {
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

  // --- SYNC ENGINE ---

  function broadcast(playSound = null) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      channel.postMessage({
        type: 'UPDATE_STATE',
        state: state
      });
      if (playSound) {
        channel.postMessage({
          type: 'PLAY_SOUND',
          sound: playSound
        });
      }
    } catch (e) {
      console.warn('Wheel broadcast error:', e);
    }
    if (window.RoomSync) {
      window.RoomSync.sendState(state, playSound);
    }
  }

  channel.onmessage = (event) => {
    const data = event.data;
    if (!data) return;
    if (data.type === 'REQUEST_STATE') {
      broadcast();
    }
  };

  // --- RENDER 4-ROW BOARD ---

  function renderHostBoard() {
    if (!boardPreview || !window.WheelEngine) return;

    const rowsData = window.WheelEngine.formatWheelBoard(
      state.answer,
      state.revealed,
      state.answerRevealed || state.phase === 'answered'
    );

    boardPreview.innerHTML = rowsData
      .map((rowTiles) => {
        const tilesHtml = rowTiles
          .map((t) => {
            if (t.type === 'empty') {
              return '<div class="board-tile tile-empty"></div>';
            }
            if (t.isRevealed) {
              return `<div class="board-tile tile-letter revealed">${t.char}</div>`;
            }
            return `<div class="board-tile tile-letter unrevealed"></div>`;
          })
          .join('');
        return `<div class="wheel-row">${tilesHtml}</div>`;
      })
      .join('');
  }

  // --- RENDER KEYBOARD ---

  function renderKeyboard() {
    if (!keyboardGrid) return;
    const answerLetters = new Set((state.answer || '').toUpperCase().replace(/[^A-Z]/g, '').split(''));

    keyboardGrid.innerHTML = ALPHABET.map((char) => {
      const isVowel = VOWELS.has(char);
      const isCalled = (state.calledLetters || []).includes(char);
      const inPuzzle = answerLetters.has(char);

      let classes = `btn-letter ${isVowel ? 'vowel' : ''} ${isCalled ? 'used' : ''}`;
      return `<button class="${classes}" data-letter="${char}" ${isCalled ? 'disabled' : ''}>${char}</button>`;
    }).join('');

    keyboardGrid.querySelectorAll('.btn-letter').forEach((btn) => {
      btn.addEventListener('click', () => {
        const letter = btn.getAttribute('data-letter');
        if (letter) callLetter(letter);
      });
    });
  }

  // --- CALL LETTER ---

  function callLetter(letter) {
    letter = letter.toUpperCase();
    if (!state.calledLetters.includes(letter)) {
      state.calledLetters.push(letter);
    }

    // Stop timer once a letter is picked
    state.running = false;
    clearInterval(timerInterval);

    const answerChars = (state.answer || '').toUpperCase().split('');
    const count = answerChars.filter((c) => c === letter).length;

    if (count > 0) {
      if (!state.revealed.includes(letter)) {
        state.revealed.push(letter);
      }
      answerChars.forEach((c, idx) => {
        if (c === letter && !state.revealed.includes(idx)) {
          state.revealed.push(idx);
        }
      });

      // Award cash based on landed wedge value * count
      const activeIdx = state.activePlayerIndex ?? 0;
      if (state.contestants && state.contestants[activeIdx]) {
        const wedgeVal = state.lastWedge ? (state.lastWedge.value || 500) : 500;
        const totalWon = wedgeVal * count;
        state.contestants[activeIdx].roundScore = (state.contestants[activeIdx].roundScore || 0) + totalWon;
      }

      state.phase = 'active';
      if (window.sounds) window.sounds.play('correct');
      broadcast('correct');
    } else {
      state.phase = 'active';
      if (window.sounds) window.sounds.play('buzzer');
      advanceToNextTurn('wrong_letter');
      return;
    }

    // Check if puzzle fully revealed
    checkPuzzleSolved();
    updateUI();
  }

  function checkPuzzleSolved() {
    const letters = (state.answer || '').toUpperCase().replace(/[^A-Z0-9]/g, '').split('');
    const uniqueLetters = [...new Set(letters)];
    const allRevealed = uniqueLetters.every((l) => state.revealed.includes(l));
    if (allRevealed && uniqueLetters.length > 0) {
      state.answerRevealed = true;
      state.phase = 'answered';
      state.running = false;
      clearInterval(timerInterval);
      if (window.sounds) window.sounds.play('cheer');
      broadcast('cheer');
    }
  }

  // --- WHEEL DRAWING & SPIN ---

  function drawWheel() {
    if (!wheelCanvas || !window.WheelEngine) return;
    window.WheelEngine.drawWheel(wheelCanvas, state.wheelAngle || 0);
  }

  function triggerWheelSpin() {
    if (state.wheelSpinning) return;
    state.wheelSpinning = true;
    state.phase = 'spinning';

    // Stop and reset timer before spinning
    state.running = false;
    clearInterval(timerInterval);
    state.seconds = state.revealTime;

    if (wheelStatusTag) wheelStatusTag.textContent = 'SPINNING THE WHEEL...';
    if (btnSpinWheel) btnSpinWheel.disabled = true;
    if (btnCallAndSpin) btnCallAndSpin.disabled = true;

    if (window.sounds) window.sounds.play('wheel');

    const startAngle = state.wheelAngle || 0;
    const minSpins = 4;
    const extraSpins = Math.random() * 3.5;
    const targetAngle = startAngle + (minSpins + extraSpins) * (Math.PI * 2) + (Math.random() * Math.PI * 2);
    const duration = 3800; // 3.8 seconds smooth spin
    const startTime = performance.now();

    // Broadcast spin event to all devices (Live Stage, Phone, Co-Host)
    if (window.RoomSync) {
      window.RoomSync.sendWheelSpin({
        startAngle,
        targetAngle,
        duration,
        startTime: Date.now()
      });
    }

    try {
      channel.postMessage({
        type: 'WHEEL_SPIN',
        startAngle,
        targetAngle,
        duration,
        startTime: Date.now()
      });
    } catch (e) {}

    broadcast('wheel');

    let lastTickAngle = startAngle;
    const pegArc = (2 * Math.PI) / 24;

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Realistic deceleration curve (ease-out cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3.5);

      state.wheelAngle = startAngle + (targetAngle - startAngle) * easeProgress;
      drawWheel();

      // Sound tick on peg crossing
      if (Math.abs(state.wheelAngle - lastTickAngle) >= pegArc) {
        lastTickAngle = state.wheelAngle;
        if (window.sounds) window.sounds.play('wheel_tick');
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        state.wheelSpinning = false;
        if (btnSpinWheel) btnSpinWheel.disabled = false;
        if (btnCallAndSpin) btnCallAndSpin.disabled = false;

        state.wheelAngle = targetAngle;
        const wedge = window.WheelEngine.getWedgeAtPointer
          ? window.WheelEngine.getWedgeAtPointer(state.wheelAngle)
          : window.WheelEngine.getWedgeAtAngle(state.wheelAngle);

        state.lastWedge = wedge || { label: '$1,000', value: 1000, color: '#10b981', type: 'cash' };
        if (wheelResultDisplay) wheelResultDisplay.textContent = state.lastWedge.label;

        const activeIdx = state.activePlayerIndex ?? 0;
        const activeName = (state.contestants && state.contestants[activeIdx])
          ? state.contestants[activeIdx].name
          : `Player ${activeIdx + 1}`;

        if (state.pendingBonusSpin) {
          state.pendingBonusSpin = false;
          let bonusAmount = (state.solveRewardAmount || 500);
          if (state.lastWedge.type === 'cash' && typeof state.lastWedge.value === 'number') {
            bonusAmount = state.lastWedge.value;
          }
          state.solveRewardEarned = bonusAmount;
          if (state.contestants && state.contestants[activeIdx]) {
            const winner = state.contestants[activeIdx];
            winner.totalScore = (winner.totalScore || 0) + (winner.roundScore || 0) + bonusAmount;
            winner.roundScore = 0;
          }
          state.phase = 'answered';
          if (wheelStatusTag) wheelStatusTag.textContent = `🎉 BONUS SPIN WON $${bonusAmount.toLocaleString()} FOR ${activeName}!`;
          if (window.sounds) window.sounds.play('cheer');
          broadcast('cheer');
          updateUI();
          return;
        }

        if (state.lastWedge.type === 'bankrupt') {
          if (state.contestants && state.contestants[activeIdx]) {
            state.contestants[activeIdx].roundScore = 0;
          }
          state.phase = 'bankrupt';
          if (wheelStatusTag) wheelStatusTag.textContent = `💥 BANKRUPT for ${activeName}!`;
          if (window.sounds) window.sounds.play('bankrupt');
          broadcast('bankrupt');
          updateUI();
          setTimeout(() => {
            advanceToNextTurn('bankrupt');
          }, 900);
          return;
        } else if (state.lastWedge.type === 'lose') {
          state.phase = 'lose';
          if (wheelStatusTag) wheelStatusTag.textContent = `🛑 LOSE A TURN for ${activeName}!`;
          if (window.sounds) window.sounds.play('buzzer');
          broadcast('buzzer');
          updateUI();
          setTimeout(() => {
            advanceToNextTurn('lose_turn');
          }, 900);
          return;
        } else {
          // Cash or Free Play wedge landed -> AUTOMATICALLY START TIMER FOR PLAYER TO PICK LETTER
          state.phase = 'pick_letter';
          if (wheelStatusTag) wheelStatusTag.textContent = `🎯 ${state.lastWedge.label} — ${activeName} PICK A LETTER!`;
          if (window.sounds) window.sounds.play('reveal');
          broadcast('reveal');

          // START THE COUNTDOWN TIMER IMMEDIATELY
          startTimer();
        }

        updateUI();
        broadcast();
      }
    }
    requestAnimationFrame(animate);
  }

  // --- CONTESTANT & TURN CONTROLS ---

  let isChangingTurn = false;

  function advanceToNextTurn(reason = 'manual') {
    if (isChangingTurn) return;
    isChangingTurn = true;

    // 1. Increment completed turns
    state.completedTurns = (state.completedTurns || 0) + 1;

    // 2. Unlock hint after specified turns (default 3) and automatically show on live screen
    const unlockTurns = state.hintUnlockTurns || 3;
    if (state.completedTurns >= unlockTurns) {
      const wasHidden = !state.hintUnlocked || !state.hintVisible;
      state.hintUnlocked = true;
      state.hintVisible = true;
      if (wasHidden) {
        if (window.sounds) window.sounds.play('reveal');
        broadcast('reveal');
      }
    }

    // 3. Move to next player in contestants list
    const count = (state.contestants && state.contestants.length) ? state.contestants.length : 3;
    const currentIdx = state.activePlayerIndex ?? 0;
    const nextIdx = (currentIdx + 1) % count;

    state.activePlayerIndex = nextIdx;
    state.currentPlayerIndex = nextIdx;
    state.phase = 'active';

    // 4. Reset turn timer to default
    state.seconds = state.revealTime || 30;
    state.running = false;
    clearInterval(timerInterval);

    if (window.sounds) window.sounds.play('click');
    updateUI();
    broadcast();

    setTimeout(() => {
      isChangingTurn = false;
    }, 300);
  }

  const CONTESTANT_PALETTE = ['#ef4444', '#eab308', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#f97316', '#06b6d4'];
  let puzzleDeck = null;

  function initPuzzleDeck() {
    if (!puzzleDeck) {
      if (typeof window.WheelPuzzleDeck === 'function') {
        try {
          puzzleDeck = new window.WheelPuzzleDeck();
        } catch (e) {
          puzzleDeck = window.WheelPuzzleDeck;
        }
      } else if (window.WheelPuzzleDeck && typeof window.WheelPuzzleDeck.getRandomPuzzle === 'function') {
        puzzleDeck = window.WheelPuzzleDeck;
      } else if (window.wheelPuzzleDeckInstance) {
        puzzleDeck = window.wheelPuzzleDeckInstance;
      }
    }
    updateDeckStats();
  }

  function updateDeckStats() {
    const deckTag = document.getElementById('deck-stats-tag');
    if (deckTag && puzzleDeck && typeof puzzleDeck.getRemainingCount === 'function') {
      try {
        deckTag.textContent = `DECK: ${puzzleDeck.getRemainingCount()} FRESH PUZZLES`;
      } catch (e) {}
    }
  }

  function addContestant(name) {
    if (!state.contestants) state.contestants = [];
    const idx = state.contestants.length;
    const color = CONTESTANT_PALETTE[idx % CONTESTANT_PALETTE.length];
    const newName = name || `Player ${idx + 1}`;
    state.contestants.push({
      name: newName,
      roundScore: 0,
      totalScore: 0,
      color: color
    });
    if (window.sounds) window.sounds.play('click');
    updateUI();
    broadcast();
  }

  function removeContestant(index) {
    if (!state.contestants || state.contestants.length <= 1) {
      if (window.sounds) window.sounds.play('buzzer');
      return;
    }
    const c = state.contestants[index];
    promptSafetyConfirmation(
      'Remove Contestant',
      `Are you sure you want to remove ${c.name} from the game?`,
      () => {
        state.contestants.splice(index, 1);
        if (state.activePlayerIndex >= state.contestants.length) {
          state.activePlayerIndex = Math.max(0, state.contestants.length - 1);
        }
        state.currentPlayerIndex = state.activePlayerIndex;
        if (window.sounds) window.sounds.play('click');
        updateUI();
        broadcast();
      }
    );
  }

  function previousPlayer() {
    if (!state.contestants || state.contestants.length === 0) return;
    const count = state.contestants.length;
    const prevIdx = (state.activePlayerIndex - 1 + count) % count;
    setActivePlayer(prevIdx);
  }

  function setActivePlayer(index) {
    state.activePlayerIndex = index;
    state.currentPlayerIndex = index;
    if (window.sounds) window.sounds.play('click');
    updateUI();
    broadcast();
  }

  function nextPlayer() {
    advanceToNextTurn('manual');
  }

  function adjustPlayerScore(index, delta) {
    if (state.contestants && state.contestants[index]) {
      state.contestants[index].roundScore = Math.max(0, (state.contestants[index].roundScore || 0) + delta);
      if (window.sounds) window.sounds.play('click');
      updateUI();
      broadcast();
    }
  }

  function bankruptPlayer(index) {
    if (state.contestants && state.contestants[index]) {
      state.contestants[index].roundScore = 0;
      if (window.sounds) window.sounds.play('buzzer');
      updateUI();
      broadcast('buzzer');
    }
  }

  function bankScores() {
    if (state.contestants) {
      state.contestants.forEach((c) => {
        c.totalScore = (c.totalScore || 0) + (c.roundScore || 0);
        c.roundScore = 0;
      });
      if (window.sounds) window.sounds.play('cheer');
      updateUI();
      broadcast('cheer');
    }
  }

  // Master Stage Phase Controls
  function startRoundLive() {
    state.phase = 'active';
    state.isCooldown = false;
    state.showWaitingScreen = false;
    if (window.sounds) window.sounds.play('click');
    updateUI();
    broadcast();
  }

  function enterCooldownLive() {
    state.phase = 'cooldown';
    state.isCooldown = true;
    state.showWaitingScreen = true;
    state.running = false;
    clearInterval(timerInterval);
    if (window.sounds) window.sounds.play('click');
    updateUI();
    broadcast();
  }

  // --- TIMER CONTROLS ---

  function startTimer() {
    if (state.running) return;
    state.running = true;
    state.paused = false;
    if (state.phase !== 'pick_letter' && state.phase !== 'spinning') {
      state.phase = 'active';
    }

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (state.seconds > 0) {
        state.seconds--;
        if (state.seconds <= 5 && state.seconds > 0) {
          if (window.sounds) window.sounds.play('tick');
        }
        if (state.seconds === 0) {
          state.running = false;
          state.phase = 'timeup';
          clearInterval(timerInterval);
          if (window.sounds) window.sounds.play('timeup');

          const activeIdx = state.activePlayerIndex ?? 0;
          const activeName = (state.contestants && state.contestants[activeIdx])
            ? state.contestants[activeIdx].name
            : `Player ${activeIdx + 1}`;
          if (wheelStatusTag) {
            wheelStatusTag.textContent = `⏰ TIME'S UP FOR ${activeName.toUpperCase()}! PASSING TO NEXT PLAYER...`;
          }
          broadcast('timeup');
          updateUI();

          // Automatically pass to next player when time runs out
          setTimeout(() => {
            if (state.phase === 'timeup') {
              advanceToNextTurn('timeup');
            }
          }, 1200);
          return;
        }
        updateUI();
        broadcast();
      }
    }, 1000);

    updateUI();
    broadcast('countdown');
  }

  function pauseTimer() {
    state.running = false;
    state.paused = true;
    state.phase = 'paused';
    clearInterval(timerInterval);
    updateUI();
    broadcast();
  }

  function resetTimer() {
    state.running = false;
    state.paused = false;
    state.phase = 'waiting';
    state.seconds = state.revealTime;
    clearInterval(timerInterval);
    updateUI();
    broadcast();
  }

  function setTimerPreset(seconds) {
    state.revealTime = seconds;
    state.seconds = seconds;
    state.running = false;
    state.paused = false;
    clearInterval(timerInterval);
    if (window.sounds) window.sounds.play('click');
    updateUI();
    broadcast();
  }

  // --- PUZZLE SELECTION ---

  function populateCategories() {
    if (!selectCat) return;
    try {
      initPuzzleDeck();
      let categories = [];
      if (puzzleDeck && typeof puzzleDeck.getCategories === 'function') {
        categories = puzzleDeck.getCategories();
      } else if (window.WHEEL_PUZZLE_CATEGORIES) {
        categories = window.WHEEL_PUZZLE_CATEGORIES;
      } else if (window.WHEEL_PUZZLES_MASTER) {
        categories = [...new Set(window.WHEEL_PUZZLES_MASTER.map(p => p.category))];
      } else if (window.JEOPARDY_CATEGORIES) {
        categories = window.JEOPARDY_CATEGORIES;
      }
      selectCat.innerHTML = `<option value="all">🌟 All Categories</option>` + categories.map(
        (c) => `<option value="${c}" ${c === state.category ? 'selected' : ''}>${c}</option>`
      ).join('');
      populatePuzzlesForCategory();
    } catch (e) {
      console.warn('populateCategories fallback:', e);
    }
  }

  function populatePuzzlesForCategory() {
    if (!selectPuz) return;
    const cat = selectCat ? selectCat.value : 'all';
    const diffElem = document.getElementById('select-difficulty');
    const difficulty = diffElem ? diffElem.value : 'all';

    let puzzles = [];
    if (window.WHEEL_PUZZLES_MASTER) {
      puzzles = window.WHEEL_PUZZLES_MASTER
        .filter(p => (cat === 'all' || p.category === cat) && (difficulty === 'all' || p.difficulty === difficulty))
        .map(p => p.answer);
    } else if (window.JEOPARDY_PUZZLES) {
      if (cat === 'all') {
        Object.values(window.JEOPARDY_PUZZLES).forEach(arr => { puzzles = puzzles.concat(arr); });
      } else {
        puzzles = window.JEOPARDY_PUZZLES[cat] || [];
      }
    }
    if (puzzles.length === 0 && window.WHEEL_PUZZLES_MASTER) {
      puzzles = window.WHEEL_PUZZLES_MASTER.filter(p => (cat === 'all' || p.category === cat)).map(p => p.answer);
    }
    selectPuz.innerHTML = puzzles.map((p, idx) => {
      const label = isSolo ? `Puzzle #${idx + 1} (${p.replace(/[^A-Za-z0-9]/g, '').length} Letters)` : p;
      return `<option value="${p}">${label}</option>`;
    }).join('');
  }

  function resetSoloFeedback() {
    const input = document.getElementById('solo-wheel-guess-input');
    if (input) input.value = '';
    const feedbackEl = document.getElementById('solo-wheel-guess-feedback');
    if (feedbackEl) {
      feedbackEl.style.display = 'none';
      feedbackEl.textContent = '';
    }
  }

  function loadSelectedPuzzle() {
    initPuzzleDeck();
    resetSoloFeedback();
    const cat = selectCat ? selectCat.value : 'Jamaican Phrases';
    const puz = selectPuz ? selectPuz.value : 'WAH GWAAN';
    let hint = '';

    if (window.WHEEL_PUZZLES_MASTER) {
      const match = window.WHEEL_PUZZLES_MASTER.find(p => p.answer === puz);
      if (match) {
        hint = match.hint;
        if (cat === 'all') state.category = match.category;
        else state.category = cat;
      }
    }
    if (!hint && window.JEOPARDY_HINTS && window.JEOPARDY_HINTS[puz]) {
      hint = window.JEOPARDY_HINTS[puz];
    }

    state.answer = puz;
    state.hint = hint;
    state.revealed = [];
    state.calledLetters = [];
    state.answerRevealed = false;
    state.hintVisible = false;
    state.hintUnlocked = false;
    state.completedTurns = 0;
    state.hintUnlockTurns = 3;
    state.seconds = state.revealTime;
    state.running = false;
    state.paused = false;
    state.phase = 'active';
    state.isCooldown = false;

    clearInterval(timerInterval);
    updateUI();
    broadcast('reveal');
  }

  function pickRandomPuzzle() {
    initPuzzleDeck();
    resetSoloFeedback();
    const cat = selectCat ? selectCat.value : 'all';
    const diffElem = document.getElementById('select-difficulty');
    const difficulty = diffElem ? diffElem.value : 'all';

    let picked = null;
    if (puzzleDeck) {
      picked = puzzleDeck.getRandomPuzzle({ category: cat, difficulty: difficulty });
      updateDeckStats();
    }

    if (!picked && window.WHEEL_PUZZLES_MASTER) {
      const pool = window.WHEEL_PUZZLES_MASTER.filter(p => (cat === 'all' || p.category === cat));
      if (pool.length) picked = pool[Math.floor(Math.random() * pool.length)];
    }

    if (!picked && window.JEOPARDY_CATEGORIES && window.JEOPARDY_PUZZLES) {
      const cats = window.JEOPARDY_CATEGORIES;
      const chosenCat = cat === 'all' ? cats[Math.floor(Math.random() * cats.length)] : cat;
      const puzList = window.JEOPARDY_PUZZLES[chosenCat] || [];
      if (puzList.length) {
        const puz = puzList[Math.floor(Math.random() * puzList.length)];
        picked = {
          category: chosenCat,
          answer: puz,
          hint: (window.JEOPARDY_HINTS && window.JEOPARDY_HINTS[puz]) || ''
        };
      }
    }

    if (picked) {
      state.category = picked.category;
      state.answer = picked.answer;
      state.hint = picked.hint || '';
      state.revealed = [];
      state.calledLetters = [];
      state.answerRevealed = false;
      state.hintVisible = false;
      state.hintUnlocked = false;
      state.completedTurns = 0;
      state.hintUnlockTurns = 3;
      state.seconds = state.revealTime;
      state.running = false;
      state.paused = false;
      state.phase = 'active';
      state.isCooldown = false;

      if (selectCat && cat !== 'all') selectCat.value = picked.category;
      populatePuzzlesForCategory();
      if (selectPuz) selectPuz.value = picked.answer;

      clearInterval(timerInterval);
      updateUI();
      broadcast('reveal');
    }
  }

  function applyCustomPuzzle() {
    const rawAnswer = inputAnswer ? inputAnswer.value.trim().toUpperCase() : '';
    if (!rawAnswer) return;
    const customHint = inputHint ? inputHint.value.trim() : '';

    state.category = 'CUSTOM PUZZLE';
    state.answer = rawAnswer;
    state.hint = customHint;
    state.revealed = [];
    state.calledLetters = [];
    state.answerRevealed = false;
    state.hintVisible = false;
    state.hintUnlocked = false;
    state.completedTurns = 0;
    state.hintUnlockTurns = 3;
    state.seconds = state.revealTime;
    state.running = false;
    state.phase = 'waiting';

    clearInterval(timerInterval);
    if (inputAnswer) inputAnswer.value = '';
    if (inputHint) inputHint.value = '';

    updateUI();
    broadcast('reveal');
  }

  // --- REVEAL HELPERS ---

  function revealRandomLetter() {
    const answer = (state.answer || '').toUpperCase();
    const letters = answer.replace(/[^A-Z0-9]/g, '').split('');
    const unrevealed = [...new Set(letters)].filter((l) => !state.revealed.includes(l));
    if (unrevealed.length === 0) return;
    const char = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    callLetter(char);
  }

  function revealAllVowels() {
    'AEIOU'.split('').forEach((v) => callLetter(v));
  }

  function revealAllConsonants() {
    'BCDFGHJKLMNPQRSTVWXYZ'.split('').forEach((c) => callLetter(c));
  }

  function solveFullPuzzle() {
    state.answerRevealed = true;
    state.phase = 'answered';
    state.running = false;
    clearInterval(timerInterval);

    const answer = (state.answer || '').toUpperCase();
    state.revealed = [];
    for (let i = 0; i < answer.length; i++) {
      const c = answer[i];
      if (/[A-Z0-9]/.test(c)) {
        state.revealed.push(i);
        if (!state.revealed.includes(c)) state.revealed.push(c);
      }
    }

    // Solve Reward Award & Banking Logic
    const solveReward = (typeof state.solveRewardAmount === 'number') ? state.solveRewardAmount : 500;
    const activeIdx = state.activePlayerIndex ?? 0;
    const activePlayer = state.contestants && state.contestants[activeIdx];

    if (activePlayer) {
      state.solvedBy = activePlayer.name;
      if (state.solveAwardMode === 'bonus_spin') {
        state.pendingBonusSpin = true;
        state.solveRewardEarned = 'BONUS SPIN';
        if (wheelStatusTag) {
          wheelStatusTag.textContent = `🎰 BONUS SPIN EARNED FOR ${activePlayer.name.toUpperCase()}! SPIN THE WHEEL!`;
        }
      } else {
        state.pendingBonusSpin = false;
        state.solveRewardEarned = solveReward;
        // Winner earns solve reward + round score banked into total
        activePlayer.roundScore = (activePlayer.roundScore || 0) + solveReward;
        activePlayer.totalScore = (activePlayer.totalScore || 0) + activePlayer.roundScore;
        activePlayer.roundScore = 0;
      }
    }

    // Other players' round scores reset for the round, keeping their totals
    if (state.contestants) {
      state.contestants.forEach((c, idx) => {
        if (idx !== activeIdx) {
          c.roundScore = 0;
        }
      });
    }

    if (window.sounds) window.sounds.play('cheer');
    updateUI();
    broadcast('cheer');
  }

  function nextRound() {
    state.round = (state.round || 1) + 1;
    state.phase = 'active';
    state.isCooldown = false;
    pickRandomPuzzle();
  }

  function resetBoard() {
    state.revealed = [];
    state.calledLetters = [];
    state.answerRevealed = false;
    state.hintVisible = false;
    state.hintUnlocked = false;
    state.completedTurns = 0;
    state.phase = 'waiting';
    state.seconds = state.revealTime;
    state.running = false;
    clearInterval(timerInterval);
    updateUI();
    broadcast();
  }

  function toggleHint() {
    if (!state.hintUnlocked) {
      if (window.sounds) window.sounds.play('buzzer');
      return;
    }
    state.hintVisible = !state.hintVisible;
    if (window.sounds) window.sounds.play(state.hintVisible ? 'reveal' : 'click');
    updateUI();
    broadcast();
  }

  // --- UI RENDER ---

  function updateUI() {
    if (statusBadge) {
      statusBadge.textContent = state.phase.toUpperCase();
      statusBadge.className = `badge-status ${state.phase}`;
    }
    if (catDisplay) catDisplay.textContent = state.category.toUpperCase();
    if (roundDisplay) roundDisplay.textContent = `ROUND ${state.round || 1}`;

    // Hint display logic with strict security (Host does not see hint text until unlocked)
    const unlockTurns = state.hintUnlockTurns || 3;
    const remainingTurns = Math.max(1, unlockTurns - (state.completedTurns || 0));

    if (hintText) {
      if (!state.hintUnlocked) {
        hintText.innerHTML = `<span style="color:#f87171; font-weight:800;">🔒 HINT LOCKED</span> — Unlocks after <strong style="color:#facc15;">${remainingTurns}</strong> completed turn${remainingTurns === 1 ? '' : 's'}`;
      } else if (!state.hintVisible) {
        hintText.innerHTML = `<span style="color:#34d399; font-weight:800;">💡 HINT UNLOCKED!</span> Click <em>"Show Clue on Stage"</em> below to reveal notes.`;
      } else {
        hintText.innerHTML = `<span style="color:#facc15; font-weight:800;">💡 CLUE (ON STAGE):</span> ${state.hint || 'No clue provided.'}`;
      }
    }

    if (btnToggleHint) {
      if (!state.hintUnlocked) {
        btnToggleHint.disabled = true;
        btnToggleHint.style.opacity = '0.5';
        btnToggleHint.style.cursor = 'not-allowed';
        btnToggleHint.textContent = `🔒 Hint Locked (${remainingTurns} Left)`;
      } else if (!state.hintVisible) {
        btnToggleHint.disabled = false;
        btnToggleHint.style.opacity = '1';
        btnToggleHint.style.cursor = 'pointer';
        btnToggleHint.textContent = '💡 Show Clue on Stage (Unlocked!)';
      } else {
        btnToggleHint.disabled = false;
        btnToggleHint.style.opacity = '1';
        btnToggleHint.style.cursor = 'pointer';
        btnToggleHint.textContent = '👁️ Hide Clue from Stage';
      }
    }

    // Quick Dock Hint Button
    if (dockBtnHint) {
      if (!state.hintUnlocked) {
        dockBtnHint.classList.remove('unlocked');
        dockBtnHint.disabled = true;
        dockBtnHint.innerHTML = `<span class="dock-icon">🔒</span><span class="dock-label">LOCKED (${remainingTurns})</span>`;
      } else if (!state.hintVisible) {
        dockBtnHint.classList.add('unlocked');
        dockBtnHint.disabled = false;
        dockBtnHint.innerHTML = `<span class="dock-icon">💡</span><span class="dock-label">SHOW HINT</span>`;
      } else {
        dockBtnHint.classList.remove('unlocked');
        dockBtnHint.disabled = false;
        dockBtnHint.innerHTML = `<span class="dock-icon">👁️</span><span class="dock-label">HIDE HINT</span>`;
      }
    }

    if (dockBtnPause) {
      dockBtnPause.innerHTML = state.running
        ? `<span class="dock-icon">⏸</span><span class="dock-label">PAUSE</span>`
        : `<span class="dock-icon">▶</span><span class="dock-label">RESUME</span>`;
    }

    if (timerNumber) timerNumber.textContent = `${state.seconds}s`;
    if (timerProgress) {
      const pct = (state.seconds / state.revealTime) * 100;
      timerProgress.style.width = `${pct}%`;
    }

    if (wheelResultDisplay && state.lastWedge) {
      wheelResultDisplay.textContent = state.lastWedge.label;
    }

    // Active Contestant Turn Badge
    const activeIdx = state.activePlayerIndex ?? 0;
    const activePlayer = (state.contestants && state.contestants[activeIdx])
      ? state.contestants[activeIdx]
      : { name: `Player ${activeIdx + 1}`, roundScore: 0, totalScore: 0 };

    if (activeTurnBadge) {
      activeTurnBadge.textContent = `TURN: ${activePlayer.name.toUpperCase()} ($${(activePlayer.roundScore || 0).toLocaleString()})`;
      activeTurnBadge.className = `badge-status active`;
    }

    const masterPhaseIndicator = document.getElementById('master-phase-indicator');
    if (masterPhaseIndicator) {
      masterPhaseIndicator.textContent = `PHASE: ${state.phase.toUpperCase()}${state.isCooldown ? ' (COOLDOWN)' : ''}`;
      masterPhaseIndicator.style.color = state.isCooldown ? '#facc15' : (state.phase === 'active' ? '#34d399' : '#94a3b8');
    }

    renderContestantsDesk();
    renderHostBoard();
    renderKeyboard();
    drawWheel();
  }

  // --- DYNAMIC CONTESTANTS DESK RENDER ---

  function renderContestantsDesk() {
    const container = document.getElementById('contestants-container');
    if (!container || !state.contestants) return;
    const activeIdx = state.activePlayerIndex ?? 0;

    // Build DOM if contestant count changed or container is empty
    const existingCards = container.querySelectorAll('.contestant-card');
    if (existingCards.length !== state.contestants.length) {
      container.innerHTML = state.contestants.map((c, idx) => {
        const color = c.color || CONTESTANT_PALETTE[idx % CONTESTANT_PALETTE.length];
        return `
          <div id="contestant-card-${idx}" class="contestant-card ${idx === activeIdx ? 'active' : ''}" data-index="${idx}">
            <div class="contestant-header">
              <span class="contestant-color-dot" style="background: ${color};"></span>
              <input id="contestant-name-${idx}" class="contestant-name-input" type="text" value="${c.name || 'Player ' + (idx + 1)}" />
              <button class="btn-select-turn" data-index="${idx}" title="Set Active Turn">🎤 CALL</button>
              ${state.contestants.length > 2 ? `<button class="btn-remove-contestant" data-index="${idx}" title="Remove Contestant" style="background:transparent; border:none; color:#ef4444; cursor:pointer; font-size:14px; padding:0 4px;">✕</button>` : ''}
            </div>
            <div class="contestant-score-row">
              <div class="score-box">
                <span class="score-label">ROUND</span>
                <span id="contestant-round-score-${idx}" class="score-val">$${(c.roundScore || 0).toLocaleString()}</span>
              </div>
              <div class="score-box">
                <span class="score-label">TOTAL</span>
                <span id="contestant-total-score-${idx}" class="score-val">$${(c.totalScore || 0).toLocaleString()}</span>
              </div>
            </div>
            <div class="score-adjust-row">
              <button class="btn-score-adjust" data-index="${idx}" data-delta="500">+$500</button>
              <button class="btn-score-adjust" data-index="${idx}" data-delta="-500">-$500</button>
              <button class="btn-score-adjust" data-index="${idx}" data-action="bankrupt">💥 Bankrupt</button>
            </div>
          </div>
        `;
      }).join('');

      // Wire events for newly created items
      container.querySelectorAll('.btn-select-turn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          if (!isNaN(idx)) setActivePlayer(idx);
        });
      });

      container.querySelectorAll('.btn-remove-contestant').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          if (!isNaN(idx)) removeContestant(idx);
        });
      });

      container.querySelectorAll('.btn-score-adjust').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          const action = btn.getAttribute('data-action');
          const delta = parseInt(btn.getAttribute('data-delta'), 10);
          if (action === 'bankrupt') {
            bankruptPlayer(idx);
          } else if (!isNaN(delta)) {
            adjustPlayerScore(idx, delta);
          }
        });
      });

      state.contestants.forEach((c, idx) => {
        const nameInput = document.getElementById(`contestant-name-${idx}`);
        if (nameInput) {
          nameInput.addEventListener('input', (e) => {
            if (state.contestants && state.contestants[idx]) {
              state.contestants[idx].name = e.target.value;
              broadcast();
            }
          });
        }
      });
    }

    // Update active highlight and scores
    state.contestants.forEach((c, idx) => {
      const card = document.getElementById(`contestant-card-${idx}`);
      const nameInput = document.getElementById(`contestant-name-${idx}`);
      const roundElem = document.getElementById(`contestant-round-score-${idx}`);
      const totalElem = document.getElementById(`contestant-total-score-${idx}`);

      if (card) {
        if (idx === activeIdx) card.classList.add('active');
        else card.classList.remove('active');
      }
      if (nameInput && document.activeElement !== nameInput) {
        nameInput.value = c.name;
      }
      if (roundElem) {
        animateScoreDisplay(roundElem, c.roundScore || 0, { prefix: '$' });
      }
      if (totalElem) {
        animateScoreDisplay(totalElem, c.totalScore || 0, { prefix: '$' });
      }
    });
  }

  // --- PHYSICAL KEYBOARD PRESS ---

  window.addEventListener('keydown', (e) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      return;
    }
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
      callLetter(key);
    }
  });

  // --- INIT ---

  function init() {
    populateCategories();

    if (selectCat) selectCat.addEventListener('change', populatePuzzlesForCategory);
    if (btnLoad) btnLoad.addEventListener('click', loadSelectedPuzzle);
    if (btnRandom) btnRandom.addEventListener('click', pickRandomPuzzle);
    if (btnApplyCustom) btnApplyCustom.addEventListener('click', applyCustomPuzzle);

    if (btnTimerStart) btnTimerStart.addEventListener('click', startTimer);
    if (btnTimerPause) btnTimerPause.addEventListener('click', pauseTimer);
    if (btnTimerReset) btnTimerReset.addEventListener('click', resetTimer);

    if (btnSpinWheel) btnSpinWheel.addEventListener('click', triggerWheelSpin);
    if (btnCallAndSpin) btnCallAndSpin.addEventListener('click', () => {
      triggerWheelSpin();
    });

    if (btnNextPlayer) btnNextPlayer.addEventListener('click', nextPlayer);
    if (btnBankScores) btnBankScores.addEventListener('click', bankScores);

    const btnAddContestant = document.getElementById('btn-add-contestant');
    if (btnAddContestant) btnAddContestant.addEventListener('click', () => addContestant());

    const btnPrevPlayer = document.getElementById('btn-prev-player');
    if (btnPrevPlayer) btnPrevPlayer.addEventListener('click', previousPlayer);

    const inputSolveReward = document.getElementById('input-solve-reward');
    if (inputSolveReward) {
      inputSolveReward.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) {
          state.solveRewardAmount = val;
          broadcast();
        }
      });
    }

    const selectSolveMode = document.getElementById('select-solve-mode');
    if (selectSolveMode) {
      selectSolveMode.addEventListener('change', (e) => {
        state.solveAwardMode = e.target.value;
        broadcast();
      });
    }

    const selectDifficulty = document.getElementById('select-difficulty');
    if (selectDifficulty) {
      selectDifficulty.addEventListener('change', populatePuzzlesForCategory);
    }

    const btnStartRound = document.getElementById('btn-start-round');
    if (btnStartRound) btnStartRound.addEventListener('click', startRoundLive);

    const btnCooldownRound = document.getElementById('btn-cooldown-round');
    if (btnCooldownRound) btnCooldownRound.addEventListener('click', enterCooldownLive);

    document.querySelectorAll('.btn-timer-preset').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secs = parseInt(btn.getAttribute('data-seconds'), 10);
        if (!isNaN(secs)) setTimerPreset(secs);
      });
    });

    if (btnCallRandom) btnCallRandom.addEventListener('click', revealRandomLetter);
    if (btnCallVowels) btnCallVowels.addEventListener('click', revealAllVowels);
    if (btnCallConsonants) btnCallConsonants.addEventListener('click', revealAllConsonants);

    if (btnToggleHint) btnToggleHint.addEventListener('click', toggleHint);
    if (btnRevealAll) {
      btnRevealAll.addEventListener('click', () => {
        promptSafetyConfirmation('Solve Puzzle', 'Reveal entire puzzle solution on live stage?', solveFullPuzzle);
      });
    }
    if (btnNextRound) {
      btnNextRound.addEventListener('click', () => {
        promptSafetyConfirmation('Next Round', `Advance to Round ${(state.round || 1) + 1} and load a new puzzle?`, nextRound);
      });
    }
    if (btnResetBoard) {
      btnResetBoard.addEventListener('click', () => {
        promptSafetyConfirmation('Reset Board', 'Clear all revealed letters and restart the current puzzle?', resetBoard);
      });
    }

    // Quick Dock Listeners
    if (dockBtnSpin) dockBtnSpin.addEventListener('click', triggerWheelSpin);
    if (dockBtnNext) dockBtnNext.addEventListener('click', () => advanceToNextTurn('manual'));
    if (dockBtnWrong) {
      dockBtnWrong.addEventListener('click', () => {
        if (window.sounds) window.sounds.play('buzzer');
        advanceToNextTurn('wrong');
      });
    }
    if (dockBtnHint) dockBtnHint.addEventListener('click', toggleHint);
    if (dockBtnSolve) {
      dockBtnSolve.addEventListener('click', () => {
        promptSafetyConfirmation('Solve Full Puzzle', 'Reveal the entire puzzle solution on stage?', solveFullPuzzle);
      });
    }
    if (dockBtnPause) {
      dockBtnPause.addEventListener('click', () => {
        if (state.running) pauseTimer();
        else startTimer();
      });
    }

    document.querySelectorAll('.btn-sfx').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sound = btn.getAttribute('data-sound');
        if (sound) {
          if (window.SoundManager && typeof window.SoundManager.playSound === 'function') {
            window.SoundManager.playSound(sound, true);
          } else if (window.sounds) {
            window.sounds.play(sound);
          }
          broadcast(sound);
        }
      });
    });

    if (wheelCanvas) {
      wheelCanvas.style.cursor = 'pointer';
      wheelCanvas.title = 'Click to Spin the Wheel!';
      wheelCanvas.addEventListener('click', triggerWheelSpin);
    }

    if (window.RoomSync) {
      window.RoomSync.role = 'host';
      window.RoomSync.gameType = 'wheel';
      window.RoomSync.attachRoomHUD('.host-header');

      window.RoomSync.onBuzzer((data) => {
        if (window.sounds) window.sounds.play('buzzer');
        if (wheelStatusTag) {
          const oldText = wheelStatusTag.textContent;
          wheelStatusTag.textContent = `🚨 ${data.player || 'CO-HOST'} BUZZED IN!`;
          setTimeout(() => {
            if (wheelStatusTag.textContent.includes('BUZZED IN')) {
              wheelStatusTag.textContent = oldText;
            }
          }, 3500);
        }
      });

      window.RoomSync.onAction((action, payload) => {
        if (action === 'SPIN') {
          triggerWheelSpin();
        } else if (action === 'LETTER' && payload && payload.letter) {
          callLetter(payload.letter.toUpperCase());
        } else if (action === 'SOLVE' || action === 'CORRECT') {
          solveFullPuzzle();
        } else if (action === 'WRONG') {
          if (window.sounds) window.sounds.play('buzzer');
          advanceToNextTurn('wrong');
        } else if (action === 'NEXT_PLAYER' || action === 'NEXT_TURN') {
          advanceToNextTurn('manual');
        } else if (action === 'HINT' || action === 'HINT_TRIGGER') {
          toggleHint();
        } else if (action === 'REVEAL_ALL') {
          solveFullPuzzle();
        } else if (action === 'REVEAL_LETTER') {
          revealRandomLetter();
        } else if (action === 'START_ROUND' || action === 'NEXT_ROUND') {
          state.phase = 'active';
          state.isCooldown = false;
          pickRandomPuzzle();
        } else if (action === 'ENTER_COOLDOWN' || action === 'COOLDOWN') {
          state.phase = 'cooldown';
          state.isCooldown = true;
          updateUI();
          broadcast();
        } else if (action === 'PAUSE' || action === 'TOGGLE_TIMER') {
          if (state.running) pauseTimer();
          else startTimer();
        } else if (action === 'START_TIMER') {
          startTimer();
        } else if (action === 'PAUSE_TIMER') {
          pauseTimer();
        } else if (action === 'BANKRUPT') {
          const activeIdx = state.activePlayerIndex ?? 0;
          if (state.contestants && state.contestants[activeIdx]) {
            state.contestants[activeIdx].roundScore = 0;
          }
          if (window.sounds) window.sounds.play('bankrupt');
          broadcast('bankrupt');
          updateUI();
          setTimeout(() => advanceToNextTurn('bankrupt'), 900);
        } else if (action === 'RESET_BOARD') {
          resetBoard();
        }
      });
    }

    // Always reset spinning state so button is NEVER stuck
    state.wheelSpinning = false;
    if (btnSpinWheel) btnSpinWheel.disabled = false;
    if (btnCallAndSpin) btnCallAndSpin.disabled = false;

    // Try load cached state for active room
    try {
      const roomKey = window.RoomSync ? `dion_wheel_state_${window.RoomSync.roomId}` : STORAGE_KEY;
      const cached = sessionStorage.getItem(roomKey) || sessionStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed) {
          state = Object.assign(state, parsed);
          state.wheelSpinning = false;
        }
      }
    } catch (e) {}

    function checkSoloWheelGuess() {
      const input = document.getElementById('solo-wheel-guess-input');
      const feedbackEl = document.getElementById('solo-wheel-guess-feedback');
      if (!input) return;
      const guess = input.value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const target = (state.answer || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!guess) return;

      if (guess === target) {
        if (feedbackEl) {
          feedbackEl.style.display = 'block';
          feedbackEl.style.background = 'rgba(16,185,129,0.2)';
          feedbackEl.style.border = '1px solid #10b981';
          feedbackEl.style.color = '#34d399';
          feedbackEl.textContent = `🎉 SOLVED! "${state.answer}" is correct!`;
        }
        solveFullPuzzle();
      } else {
        if (feedbackEl) {
          feedbackEl.style.display = 'block';
          feedbackEl.style.background = 'rgba(239,68,68,0.2)';
          feedbackEl.style.border = '1px solid #ef4444';
          feedbackEl.style.color = '#f87171';
          feedbackEl.textContent = `❌ "${input.value.trim()}" is not correct. Keep spinning!`;
        }
        if (window.sounds) window.sounds.play('buzzer');
        advanceToNextTurn('wrong');
      }
    }

    if (isSolo) {
      const boardWrapper = document.getElementById('wheel-board-host-preview');
      if (boardWrapper && !document.getElementById('solo-wheel-solve-card')) {
        const solveCard = document.createElement('div');
        solveCard.id = 'solo-wheel-solve-card';
        solveCard.style.cssText = 'margin-top: 14px; padding: 12px 16px; background: rgba(0,0,0,0.4); border: 1px solid rgba(250,204,21,0.4); border-radius: 10px;';
        solveCard.innerHTML = `
          <div style="font-size: 11px; font-weight: 800; color: #facc15; letter-spacing: 1px; margin-bottom: 6px; text-transform: uppercase;">
            🎯 SOLO SOLVE: GUESS THE FULL PHRASE
          </div>
          <div style="display: flex; gap: 8px;">
            <input id="solo-wheel-guess-input" type="text" placeholder="Type your solve guess..." style="flex: 1; background: #0f172a; border: 1px solid #ca8a04; color: #fff; padding: 8px 12px; border-radius: 6px; font-weight: 700; font-size: 14px;" />
            <button id="btn-solo-wheel-guess" class="btn btn-solve" style="padding: 0 16px;">
              SOLVE
            </button>
          </div>
          <div id="solo-wheel-guess-feedback" style="display: none; margin-top: 8px; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 800;"></div>
        `;
        boardWrapper.parentNode.insertBefore(solveCard, boardWrapper.nextSibling);

        const btnGuess = document.getElementById('btn-solo-wheel-guess');
        if (btnGuess) btnGuess.addEventListener('click', checkSoloWheelGuess);
        const inputGuess = document.getElementById('solo-wheel-guess-input');
        if (inputGuess) {
          inputGuess.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') checkSoloWheelGuess();
          });
        }
      }

      // Hide custom puzzle box in solo mode so answers aren't shown
      const customDivider = document.querySelector('.divider');
      if (customDivider) customDivider.style.display = 'none';
      const customInputs = document.querySelectorAll('#input-custom-answer, #input-custom-hint, #btn-apply-custom');
      customInputs.forEach(el => {
        const group = el.closest('.form-group') || el;
        if (group) group.style.display = 'none';
      });

      // Add solo mode badge to header
      const headerTitle = document.querySelector('.header-title');
      if (headerTitle && !document.getElementById('solo-mode-badge')) {
        const badge = document.createElement('span');
        badge.id = 'solo-mode-badge';
        badge.style.cssText = 'font-size: 11px; font-weight: 800; color: #10b981; background: rgba(16,185,129,0.15); border: 1px solid #10b981; padding: 2px 8px; border-radius: 6px; margin-left: 8px; vertical-align: middle;';
        badge.textContent = 'SOLO PLAYER MODE';
        headerTitle.appendChild(badge);
      }

      // If no session state was cached, automatically draw a random puzzle so it's not the predictable default
      try {
        const roomKey = window.RoomSync ? `dion_wheel_state_${window.RoomSync.roomId}` : STORAGE_KEY;
        if (!sessionStorage.getItem(roomKey) && !sessionStorage.getItem(STORAGE_KEY)) {
          pickRandomPuzzle();
        }
      } catch (e) {}
    }

    updateUI();
    broadcast();

    if (window.RoomSync) {
      window.RoomSync.ensureHostPasscodeUnlocked(() => {
        updateUI();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
