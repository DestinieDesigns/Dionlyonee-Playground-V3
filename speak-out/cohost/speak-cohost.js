/**
 * DIONLYONEE SPEAK OUT! - Co-Host Judge View Controller
 */
(function () {
  let engine = null;
  let rapidFireCheckedCount = 0;

  document.addEventListener('DOMContentLoaded', () => {
    engine = new window.SpeakEngine({ role: 'cohost' });

    initUI();
    bindEvents();
  });

  function initUI() {
    const roomVal = document.getElementById('coRoomVal');
    if (roomVal) roomVal.textContent = engine.roomCode || 'DIONLIVE';

    const liveLink = document.getElementById('coLiveLink');
    if (liveLink) liveLink.href = `../live/index.html?room=${engine.roomCode}`;

    engine.onStateUpdate(renderState);
    engine.timer.onTick(updateTimerUI);
  }

  function bindEvents() {
    // Judging actions
    document.getElementById('coBtnPass')?.addEventListener('click', () => engine.markPass());
    document.getElementById('coBtnFail')?.addEventListener('click', () => engine.markFail());
    document.getElementById('coBtnNext')?.addEventListener('click', () => engine.nextChallenge(false));

    // Live Stage broadcasts
    document.getElementById('coBtnBroadcastHint')?.addEventListener('click', () => engine.toggleHint());
    document.getElementById('coBtnBroadcastAnswer')?.addEventListener('click', () => engine.toggleAnswer());
    document.getElementById('coBtnBuzzer')?.addEventListener('click', () => {
      engine.playLocalSound('buzzer');
      if (window.FirebaseRoom) window.FirebaseRoom.broadcastSound('buzzer');
    });

    // Timer controls
    document.getElementById('coBtnTimerToggle')?.addEventListener('click', () => {
      if (engine.timer.running) {
        engine.pauseTimer();
      } else {
        engine.startTimer();
      }
    });
    document.getElementById('coBtnTimerReset')?.addEventListener('click', () => engine.resetTimer());
    document.getElementById('coBtnTimerPlus5')?.addEventListener('click', () => engine.addTime(5));

    // Bonuses
    document.getElementById('coBonus25')?.addEventListener('click', () => engine.awardManualBonus(25));
    document.getElementById('coBonus50')?.addEventListener('click', () => engine.awardManualBonus(50));
    document.getElementById('coBonus100')?.addEventListener('click', () => engine.awardManualBonus(100));
  }

  function renderState(state) {
    if (!state) return;

    // Stats
    const scoreVal = document.getElementById('coScoreVal');
    if (scoreVal) scoreVal.textContent = state.score.totalScore.toLocaleString();

    const streakVal = document.getElementById('coStreakVal');
    if (streakVal) {
      streakVal.textContent = state.streak.currentStreak;
      const pill = document.getElementById('coStreakPill');
      if (state.streak.currentStreak >= 3) {
        pill?.classList.add('animate-streak');
      } else {
        pill?.classList.remove('animate-streak');
      }
    }

    // Timer button state
    const timerBtn = document.getElementById('coBtnTimerToggle');
    if (timerBtn) {
      timerBtn.textContent = state.timer.running ? '⏸️ PAUSE' : '▶️ START';
    }

    // Status action
    const statusText = document.getElementById('coStatusText');
    if (statusText && state.lastAction) {
      statusText.textContent = state.lastAction.text || 'Connected as Official Adjudicator';
    }

    // Challenge & Adjudication criteria
    renderJudgeChallenge(state.currentChallenge, state.showAnswer, state.showHint);
  }

  function renderJudgeChallenge(challenge, showAnswer, showHint) {
    const coModeIcon = document.getElementById('coModeIcon');
    const coModeName = document.getElementById('coModeName');
    const coDiffBadge = document.getElementById('coDiffBadge');
    const coPromptInstruction = document.getElementById('coPromptInstruction');
    const coPromptMainText = document.getElementById('coPromptMainText');
    const coForbiddenGrid = document.getElementById('coForbiddenGrid');
    const coRapidCounterContainer = document.getElementById('coRapidCounterContainer');
    const coSecretText = document.getElementById('coSecretText');

    if (!challenge) {
      if (coPromptInstruction) coPromptInstruction.textContent = 'STANDBY • INTERMISSION';
      if (coPromptMainText) coPromptMainText.textContent = 'Waiting for Host to launch round...';
      if (coForbiddenGrid) coForbiddenGrid.style.display = 'none';
      if (coRapidCounterContainer) coRapidCounterContainer.style.display = 'none';
      if (coSecretText) coSecretText.textContent = 'No active challenge yet. Host controls round launch.';
      return;
    }

    const mode = window.SpeakOutData.getMode(challenge.modeId);

    if (coModeIcon) coModeIcon.textContent = mode.icon;
    if (coModeName) coModeName.textContent = mode.name;

    const diff = (challenge.difficulty || 'medium').toLowerCase();
    if (coDiffBadge) {
      coDiffBadge.className = `badge-difficulty-${diff}`;
      const pts = mode.scoring[diff] || 100;
      coDiffBadge.textContent = `${diff.toUpperCase()} (+${pts} PTS)`;
    }

    if (coForbiddenGrid) coForbiddenGrid.style.display = 'none';
    if (coRapidCounterContainer) coRapidCounterContainer.style.display = 'none';

    switch (challenge.modeId) {
      case 'tongue-twister':
        coPromptInstruction.textContent = 'TONGUE TWISTER PRONUNCIATION CRITERIA';
        coPromptMainText.textContent = `"${challenge.text}"`;
        coSecretText.innerHTML = `
          <strong>Judging Rules:</strong> Must be spoken with zero pauses, stuttering, or mispronunciations.
          <br><span style="color: #c084fc;">Target:</span> Repeat cleanly 3 times fast!
        `;
        break;

      case 'rapid-fire':
        coPromptInstruction.textContent = `RAPID FIRE: HOST MUST NAME ${challenge.targetCount || 5} ITEMS`;
        coPromptMainText.textContent = challenge.prompt;

        if (coRapidCounterContainer) {
          coRapidCounterContainer.style.display = 'block';
          renderRapidCounters(challenge.targetCount || 5);
        }

        coSecretText.innerHTML = `
          <strong>Judging Rules:</strong> Click the number boxes as the host names each valid item.
          <br><span style="color: #c084fc;">Tip:</span> No repeats, no hesitations over 2 seconds!
        `;
        break;

      case 'forbidden-words':
        coPromptInstruction.textContent = 'FORBIDDEN WORDS ADJUDICATION';
        coPromptMainText.textContent = `SECRET WORD: ${challenge.target}`;

        if (coForbiddenGrid && Array.isArray(challenge.forbidden)) {
          coForbiddenGrid.style.display = 'grid';
          coForbiddenGrid.innerHTML = challenge.forbidden
            .map(w => `<div class="forbidden-word-chip">🚫 ${w}</div>`)
            .join('');
        }

        coSecretText.innerHTML = `
          <strong>Judging Rules:</strong> If the host says ANY of the 4 forbidden words or forms of the word, HIT THE BUZZER immediately!
          <br><span style="color: #34d399;">Acceptable Clue:</span> ${challenge.hint || 'Descriptive clues only'}
        `;
        break;

      case 'voice-challenge':
        coPromptInstruction.textContent = `VOICE CRITERIA: ${challenge.character}`;
        coPromptMainText.textContent = `"${challenge.phrase}"`;
        coSecretText.innerHTML = `
          <strong>Judging Rules:</strong> Must maintain character voice throughout. No laughing, breaking character, or dropping accent.
          <br><span style="color: #c084fc;">Acting Instruction:</span> ${challenge.instruction}
        `;
        break;

      case 'keep-talking':
        coPromptInstruction.textContent = `CONTINUOUS TALKING: ${challenge.duration || 30} SECONDS`;
        coPromptMainText.textContent = challenge.topic;
        coSecretText.innerHTML = `
          <strong>Judging Rules:</strong> Must talk continuously with NO pauses over 2 seconds, no filler spam ('um', 'uh'), no dead air!
          <br><span style="color: #34d399;">Ideas to whisper in chat:</span> ${challenge.hint || 'Keep them going!'}
        `;
        break;

      case 'finish-the-phrase':
        coPromptInstruction.textContent = 'FINISH THE PHRASE ANSWER KEY';
        coPromptMainText.textContent = challenge.setup;
        coSecretText.innerHTML = `
          <strong>OFFICIAL ANSWER:</strong> <span style="color: #34d399; font-size: 1.5rem; text-decoration: underline;">${challenge.answer}</span>
          <br><span style="color: #c084fc;">Live Hint:</span> ${challenge.hint || 'None'}
          <br><span style="color: #94a3b8; font-size: 0.85rem;">Status: ${showAnswer ? '✅ Revealed on Live Stage' : '🔒 Hidden on Live Stage'}</span>
        `;
        break;

      default:
        coPromptInstruction.textContent = 'SPEAK OUT CHALLENGE';
        coPromptMainText.textContent = challenge.text || 'Ready';
        coSecretText.textContent = 'Ensure host follows proper stream challenge etiquette.';
        break;
    }
  }

  function renderRapidCounters(targetCount) {
    const grid = document.getElementById('coCounterGrid');
    if (!grid) return;

    grid.innerHTML = '';
    rapidFireCheckedCount = 0;

    for (let i = 1; i <= targetCount; i++) {
      const chip = document.createElement('div');
      chip.className = 'counter-chip';
      chip.textContent = i;
      chip.dataset.index = i;

      chip.addEventListener('click', () => {
        chip.classList.toggle('checked');
        const checked = grid.querySelectorAll('.counter-chip.checked').length;
        rapidFireCheckedCount = checked;

        if (checked >= targetCount) {
          engine.playLocalSound('correct');
        }
      });

      grid.appendChild(chip);
    }
  }

  function updateTimerUI(rem, formatted, percent, running) {
    const numEl = document.getElementById('coTimerNumber');
    const ringEl = document.getElementById('coTimerRing');

    if (numEl) numEl.textContent = formatted;

    if (ringEl) {
      if (rem <= 5 && rem > 0) {
        ringEl.classList.add('animate-timer-critical');
      } else {
        ringEl.classList.remove('animate-timer-critical');
      }
    }
  }
})();
