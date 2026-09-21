// Dionlyonee Jeopardy Host Console Logic (Vanilla JS)
// BroadcastChannel: dionlyonee-jeopardy-game

(function () {
  'use strict';

  const CHANNEL_NAME = 'dionlyonee-jeopardy-game';
  const STORAGE_KEY = 'dionlyonee_jeopardy_state';
  const channel = new BroadcastChannel(CHANNEL_NAME);

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

  let state = {
    category: 'Jamaican / Patwa Phrases',
    answer: 'WAH GWAAN',
    hint: 'What is a popular Jamaican greeting meaning what is going on?',
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
  const valueDisplay = document.getElementById('host-value-display');
  const boardPreview = document.getElementById('jeopardy-board-host-preview');
  const hintText = document.getElementById('host-hint-text');

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

  const btnToggleHint = document.getElementById('btn-toggle-hint');
  const btnRevealAll = document.getElementById('btn-reveal-all');
  const btnNextRound = document.getElementById('btn-next-round');
  const btnResetBoard = document.getElementById('btn-reset-board');

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
      console.warn('Jeopardy broadcast error:', e);
    }
    if (window.RoomSync) {
      window.RoomSync.broadcastState(state, playSound);
    }
  }

  // --- RENDER BOARD ---

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

    const answerChars = (state.answer || '').toUpperCase().split('');
    const count = answerChars.filter((c) => c === letter).length;

    if (count > 0) {
      answerChars.forEach((c, idx) => {
        if (c === letter && !state.revealed.includes(idx)) {
          state.revealed.push(idx);
        }
      });
      if (window.sounds) window.sounds.play('correct');
      broadcast('correct');
    } else {
      if (window.sounds) window.sounds.play('buzzer');
      broadcast('buzzer');
    }

    checkPuzzleSolved();
    updateUI();
  }

  function checkPuzzleSolved() {
    const lettersTotal = (state.answer || '').replace(/[^A-Za-z0-9]/g, '').length;
    if (state.revealed.length >= lettersTotal && lettersTotal > 0) {
      state.answerRevealed = true;
      state.phase = 'answered';
      state.running = false;
      clearInterval(timerInterval);
      if (window.sounds) window.sounds.play('cheer');
      broadcast('cheer');
    }
  }

  // --- CONTESTANT SCORE CONTROLS ---

  function setupScoreControls() {
    [1, 2, 3].forEach((idx) => {
      const nameInput = document.getElementById(`p${idx}-name`);
      if (nameInput) {
        nameInput.value = state.contestants[idx - 1]?.name || `Player ${idx}`;
        nameInput.addEventListener('change', (e) => {
          if (state.contestants[idx - 1]) {
            state.contestants[idx - 1].name = e.target.value;
            broadcast();
          }
        });
      }
    });

    document.querySelectorAll('.btn-score').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pIdx = parseInt(btn.getAttribute('data-player'), 10) - 1;
        const action = btn.getAttribute('data-action');
        const currentVal = typeof state.currentValue === 'number' ? state.currentValue : 400;

        if (state.contestants[pIdx]) {
          if (action === 'add') {
            state.contestants[pIdx].score += currentVal;
            if (window.sounds) window.sounds.play('correct');
            broadcast('correct');
          } else {
            state.contestants[pIdx].score -= currentVal;
            if (window.sounds) window.sounds.play('buzzer');
            broadcast('buzzer');
          }
          updateUI();
        }
      });
    });

    // Value buttons
    document.querySelectorAll('.btn-value').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-value').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const rawVal = btn.getAttribute('data-value');
        if (rawVal === 'DAILY DOUBLE') {
          state.currentValue = 'DAILY DOUBLE';
          if (window.sounds) window.sounds.play('countdown');
          broadcast('countdown');
        } else {
          state.currentValue = parseInt(rawVal, 10) || 400;
          if (window.sounds) window.sounds.play('click');
        }
        updateUI();
        broadcast();
      });
    });
  }

  // --- TIMER CONTROLS ---

  function startTimer() {
    if (state.running) return;
    state.running = true;
    state.paused = false;
    state.phase = 'active';

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
          broadcast('timeup');
        }
        updateUI();
        broadcast();
      }
    }, 1000);

    updateUI();
    broadcast('tick');
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

  // --- PUZZLE SELECTION ---

  function populateCategories() {
    if (!selectCat || !window.JEOPARDY_CATEGORIES) return;
    selectCat.innerHTML = window.JEOPARDY_CATEGORIES.map(
      (c) => `<option value="${c}" ${c === state.category ? 'selected' : ''}>${c}</option>`
    ).join('');
    populatePuzzlesForCategory();
  }

  function populatePuzzlesForCategory() {
    if (!selectPuz || !window.JEOPARDY_PUZZLES) return;
    const cat = selectCat ? selectCat.value : state.category;
    const puzzles = window.JEOPARDY_PUZZLES[cat] || [];
    selectPuz.innerHTML = puzzles.map((p) => `<option value="${p}">${p}</option>`).join('');
  }

  function loadSelectedPuzzle() {
    const cat = selectCat ? selectCat.value : 'Jamaican Phrases';
    const puz = selectPuz ? selectPuz.value : 'WAH GWAAN';
    const hint = (window.JEOPARDY_HINTS && window.JEOPARDY_HINTS[puz]) || '';

    state.category = cat;
    state.answer = puz;
    state.hint = hint;
    state.revealed = [];
    state.calledLetters = [];
    state.answerRevealed = false;
    state.hintVisible = false;
    state.seconds = state.revealTime;
    state.running = false;
    state.paused = false;
    state.phase = 'waiting';

    clearInterval(timerInterval);
    updateUI();
    broadcast('reveal');
  }

  function pickRandomPuzzle() {
    if (!window.JEOPARDY_CATEGORIES || !window.JEOPARDY_PUZZLES) return;
    const catIndex = Math.floor(Math.random() * window.JEOPARDY_CATEGORIES.length);
    const cat = window.JEOPARDY_CATEGORIES[catIndex];
    const puzzles = window.JEOPARDY_PUZZLES[cat] || [];
    if (!puzzles.length) return;
    const puz = puzzles[Math.floor(Math.random() * puzzles.length)];
    const hint = (window.JEOPARDY_HINTS && window.JEOPARDY_HINTS[puz]) || '';

    state.category = cat;
    state.answer = puz;
    state.hint = hint;
    state.revealed = [];
    state.calledLetters = [];
    state.answerRevealed = false;
    state.hintVisible = false;
    state.seconds = state.revealTime;
    state.running = false;
    state.paused = false;
    state.phase = 'waiting';

    if (selectCat) selectCat.value = cat;
    populatePuzzlesForCategory();
    if (selectPuz) selectPuz.value = puz;

    clearInterval(timerInterval);
    updateUI();
    broadcast('reveal');
  }

  function applyCustomPuzzle() {
    const rawAnswer = inputAnswer ? inputAnswer.value.trim().toUpperCase() : '';
    if (!rawAnswer) return;
    const customHint = inputHint ? inputHint.value.trim() : '';

    state.category = 'CUSTOM CLUE';
    state.answer = rawAnswer;
    state.hint = customHint;
    state.revealed = [];
    state.calledLetters = [];
    state.answerRevealed = false;
    state.hintVisible = false;
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
    const unrevealedIdxs = [];
    for (let i = 0; i < answer.length; i++) {
      if (/[A-Z0-9]/.test(answer[i]) && !state.revealed.includes(i)) {
        unrevealedIdxs.push(i);
      }
    }
    if (unrevealedIdxs.length === 0) return;
    const randIdx = unrevealedIdxs[Math.floor(Math.random() * unrevealedIdxs.length)];
    const char = answer[randIdx];
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
      if (/[A-Z0-9]/.test(answer[i])) state.revealed.push(i);
    }

    if (window.sounds) window.sounds.play('cheer');
    updateUI();
    broadcast('cheer');
  }

  function nextRound() {
    state.round = (state.round || 1) + 1;
    pickRandomPuzzle();
  }

  function resetBoard() {
    state.revealed = [];
    state.calledLetters = [];
    state.answerRevealed = false;
    state.hintVisible = false;
    state.phase = 'waiting';
    state.seconds = state.revealTime;
    state.running = false;
    clearInterval(timerInterval);
    updateUI();
    broadcast();
  }

  function toggleHint() {
    state.hintVisible = !state.hintVisible;
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
    if (valueDisplay) {
      valueDisplay.textContent = typeof state.currentValue === 'number' ? `$${state.currentValue}` : state.currentValue;
    }

    if (hintText) {
      hintText.textContent = state.hint
        ? `CLUE (${state.hintVisible ? 'ON STAGE' : 'HIDDEN FROM AUDIENCE'}): ${state.hint}`
        : `ANSWER: ${state.answer}`;
    }

    if (timerNumber) timerNumber.textContent = `${state.seconds}s`;
    if (timerProgress) {
      const pct = (state.seconds / state.revealTime) * 100;
      timerProgress.style.width = `${pct}%`;
    }

    // Contestant scores
    [1, 2, 3].forEach((idx) => {
      const scoreElem = document.getElementById(`p${idx}-score`);
      if (scoreElem && state.contestants[idx - 1]) {
        animateScoreDisplay(scoreElem, state.contestants[idx - 1].score || 0, { prefix: '$' });
      }
    });

    renderHostBoard();
    renderKeyboard();
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
    setupScoreControls();

    if (selectCat) selectCat.addEventListener('change', populatePuzzlesForCategory);
    if (btnLoad) btnLoad.addEventListener('click', loadSelectedPuzzle);
    if (btnRandom) btnRandom.addEventListener('click', pickRandomPuzzle);
    if (btnApplyCustom) btnApplyCustom.addEventListener('click', applyCustomPuzzle);

    if (btnTimerStart) btnTimerStart.addEventListener('click', startTimer);
    if (btnTimerPause) btnTimerPause.addEventListener('click', pauseTimer);
    if (btnTimerReset) btnTimerReset.addEventListener('click', resetTimer);

    if (btnCallRandom) btnCallRandom.addEventListener('click', revealRandomLetter);
    if (btnCallVowels) btnCallVowels.addEventListener('click', revealAllVowels);
    if (btnCallConsonants) btnCallConsonants.addEventListener('click', revealAllConsonants);

    if (btnToggleHint) btnToggleHint.addEventListener('click', toggleHint);
    if (btnRevealAll) btnRevealAll.addEventListener('click', solveFullPuzzle);
    if (btnNextRound) btnNextRound.addEventListener('click', nextRound);
    if (btnResetBoard) btnResetBoard.addEventListener('click', resetBoard);

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

    if (window.RoomSync) {
      window.RoomSync.role = 'host';
      window.RoomSync.gameType = 'jeopardy';
      window.RoomSync.attachRoomHUD('.host-header');
    }

    // Try load cached state
    try {
      const cached = sessionStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed) state = Object.assign(state, parsed);
      }
    } catch (e) {}

    updateUI();
    broadcast();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
