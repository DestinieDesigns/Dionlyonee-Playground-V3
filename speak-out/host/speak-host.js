/**
 * DIONLYONEE SPEAK OUT! - Host Console View Controller
 */
(function () {
  let engine = null;

  document.addEventListener('DOMContentLoaded', () => {
    engine = new window.SpeakEngine({ role: 'host' });

    initUI();
    renderModes();
    bindEvents();
  });

  function initUI() {
    const roomVal = document.getElementById('roomCodeVal');
    if (roomVal) roomVal.textContent = engine.roomCode || 'DIONLIVE';

    engine.onStateUpdate(renderState);
    engine.timer.onTick(updateTimerUI);
  }

  function renderModes() {
    const container = document.getElementById('modeList');
    if (!container || !window.SpeakOutData) return;

    container.innerHTML = '';

    // Add 6 standard modes
    Object.values(window.SpeakOutData.modes).forEach(mode => {
      const btn = document.createElement('button');
      btn.className = `mode-btn ${engine.activeMode === mode.id ? 'active' : ''}`;
      btn.dataset.mode = mode.id;
      btn.innerHTML = `
        <span class="icon">${mode.icon}</span>
        <div style="display: flex; flex-direction: column;">
          <span>${mode.name}</span>
          <span style="font-size: 0.65rem; color: var(--text-muted); font-weight: 500;">${mode.badge}</span>
        </div>
      `;
      btn.addEventListener('click', () => {
        engine.setMode(mode.id);
      });
      container.appendChild(btn);
    });

    // Add Random Everything Mode
    const randBtn = document.createElement('button');
    randBtn.className = `mode-btn ${engine.activeMode === 'random' ? 'active' : ''}`;
    randBtn.dataset.mode = 'random';
    randBtn.innerHTML = `
      <span class="icon">🎲</span>
      <div style="display: flex; flex-direction: column;">
        <span>RANDOM MODE</span>
        <span style="font-size: 0.65rem; color: #f59e0b; font-weight: 700;">SHUFFLE ALL MODES</span>
      </div>
    `;
    randBtn.addEventListener('click', () => {
      engine.setMode('random');
    });
    container.appendChild(randBtn);
  }

  function bindEvents() {
    // Stage Actions
    document.getElementById('btnHostStartRound')?.addEventListener('click', () => {
      engine.startGame();
    });

    document.getElementById('btnHostStandby')?.addEventListener('click', () => {
      engine.setWaiting('Intermission');
    });

    document.getElementById('btnPass')?.addEventListener('click', () => engine.markPass());
    document.getElementById('btnFail')?.addEventListener('click', () => engine.markFail());
    document.getElementById('btnSkip')?.addEventListener('click', () => engine.markSkip());
    document.getElementById('btnNext')?.addEventListener('click', () => engine.nextChallenge(true));

    // Phone / Separate Device QR Modal
    document.getElementById('btnHostConnectPhone')?.addEventListener('click', () => {
      showHostConnectModal();
    });
    document.getElementById('btnHostQrStandby')?.addEventListener('click', () => {
      showHostConnectModal();
    });

    // Timer Controls
    document.getElementById('btnTimerToggle')?.addEventListener('click', () => {
      if (engine.timer.running) {
        engine.pauseTimer();
      } else {
        engine.startTimer();
      }
    });

    document.getElementById('btnTimerReset')?.addEventListener('click', () => engine.resetTimer());
    document.getElementById('btnTimerPlus5')?.addEventListener('click', () => engine.addTime(5));

    // Sounds
    document.querySelectorAll('.btn-sound').forEach(btn => {
      btn.addEventListener('click', () => {
        const sound = btn.dataset.sound;
        if (sound) {
          engine.playLocalSound(sound);
          if (window.FirebaseRoom) window.FirebaseRoom.broadcastSound(sound);
        }
      });
    });

    // Bonuses
    document.getElementById('btnBonus25')?.addEventListener('click', () => engine.awardManualBonus(25));
    document.getElementById('btnBonus50')?.addEventListener('click', () => engine.awardManualBonus(50));
    document.getElementById('btnBonus100')?.addEventListener('click', () => engine.awardManualBonus(100));

    // Difficulties
    document.querySelectorAll('#diffButtons button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#diffButtons button').forEach(b => b.style.background = 'rgba(255,255,255,0.06)');
        btn.style.background = 'rgba(245,158,11,0.2)';
        engine.setDifficulty(btn.dataset.diff);
      });
    });

    // Reset Game
    document.getElementById('btnResetGame')?.addEventListener('click', () => {
      if (confirm('Start a fresh game? This resets score, streak, and challenge history.')) {
        engine.resetGame();
      }
    });

    // Links to other views
    document.getElementById('btnOpenLive')?.addEventListener('click', () => {
      window.open(`../live/index.html?room=${engine.roomCode}`, '_blank');
    });

    document.getElementById('btnOpenCohost')?.addEventListener('click', () => {
      window.open(`../cohost/index.html?room=${engine.roomCode}`, '_blank');
    });
  }

  function renderState(state) {
    if (!state) return;

    // Update Stats
    const scoreVal = document.getElementById('scoreVal');
    if (scoreVal && state.score) scoreVal.textContent = state.score.totalScore.toLocaleString();

    const streakVal = document.getElementById('streakVal');
    if (streakVal && state.streak) {
      streakVal.textContent = state.streak.currentStreak;
      const streakPill = document.getElementById('streakPill');
      if (state.streak.currentStreak >= 3) {
        streakPill?.classList.add('animate-streak');
      } else {
        streakPill?.classList.remove('animate-streak');
      }
    }

    const passedVal = document.getElementById('passedVal');
    if (passedVal && state.score) passedVal.textContent = state.score.challengesPassed;

    const usedStats = document.getElementById('usedStatsText');
    if (usedStats) usedStats.textContent = `Challenges Used: ${state.usedCount || 0}`;

    // Update Mode highlights
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === state.activeMode);
    });

    // Toggle Standby View vs Active Teleprompter
    const standbyView = document.getElementById('hostStandbyView');
    const activeView = document.getElementById('hostActivePromptView');

    const isWaiting = (!state.status || state.status === 'waiting' || !state.currentChallenge);

    if (isWaiting) {
      if (standbyView) standbyView.style.display = 'flex';
      if (activeView) activeView.style.display = 'none';

      const modeObj = window.SpeakOutData ? window.SpeakOutData.getMode(state.activeMode || engine.activeMode) : null;
      const modeNameEl = document.getElementById('standbyModeName');
      if (modeNameEl) {
        modeNameEl.textContent = modeObj ? `${modeObj.icon} ${modeObj.name}` : 'Tongue Twister';
      }

      const diffNameEl = document.getElementById('standbyDiffName');
      if (diffNameEl) {
        diffNameEl.textContent = (state.selectedDifficulty || 'ALL').toUpperCase();
      }
    } else {
      if (standbyView) standbyView.style.display = 'none';
      if (activeView) activeView.style.display = 'flex';

      // Update Challenge Card
      renderChallenge(state.currentChallenge, state.showAnswer, state.showHint);
    }

    // Update Status Action Text
    const actionText = document.getElementById('statusActionText');
    if (actionText && state.lastAction) {
      actionText.textContent = state.lastAction.text || 'Ready for Live Broadcast';
    }

    // Toggle button label
    const timerToggleBtn = document.getElementById('btnTimerToggle');
    if (timerToggleBtn) {
      timerToggleBtn.textContent = (state.timer && state.timer.running) ? '⏸️ PAUSE' : '▶️ START';
    }
  }

  function showHostConnectModal() {
    let modal = document.getElementById('host-device-modal');
    if (modal) modal.remove();

    const roomCode = engine.roomCode || 'DIONLIVE';
    const hostUrl = `${window.location.origin}/speak-out/host/index.html?room=${encodeURIComponent(roomCode)}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(hostUrl)}`;

    modal = document.createElement('div');
    modal.id = 'host-device-modal';
    modal.style.cssText = `
      position: fixed; inset: 0; z-index: 999999;
      background: rgba(7, 9, 14, 0.92); backdrop-filter: blur(16px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px; font-family: var(--font-body, system-ui, sans-serif);
    `;
    modal.innerHTML = `
      <div style="
        background: #131622; border: 1px solid rgba(212, 175, 55, 0.5);
        border-radius: 24px; max-width: 480px; width: 100%; padding: 28px 24px;
        box-shadow: 0 0 45px rgba(245, 158, 11, 0.3); text-align: center;
        position: relative; color: #ffffff;
      ">
        <button id="btn-close-host-modal" style="
          position: absolute; top: 16px; right: 16px;
          background: rgba(255,255,255,0.08); border: none; border-radius: 50%;
          width: 34px; height: 34px; color: #94a3b8; font-size: 16px; cursor: pointer;
        ">✕</button>

        <div style="font-size: 38px; margin-bottom: 8px;">📱</div>
        <h2 style="font-family: var(--font-display, sans-serif); font-size: 1.5rem; font-weight: 900; color: #f59e0b; margin-bottom: 6px;">
          USE SEPARATE DEVICE (PHONE / TABLET)
        </h2>
        <p style="color: #94a3b8; font-size: 0.85rem; line-height: 1.5; margin-bottom: 18px;">
          Scan with your phone to hold the controller in your hand while streaming! Any action taken on your phone instantly syncs to the Live Screen and Co-Host.
        </p>

        <div style="
          display: inline-block; padding: 10px; background: #ffffff;
          border-radius: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.6); margin-bottom: 18px;
        ">
          <img src="${qrUrl}" alt="Host Phone QR" style="width: 200px; height: 200px; display: block;" />
        </div>

        <div style="
          background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px; font-size: 0.8rem; color: #cbd5e1; word-break: break-all; text-align: left;
        ">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 8px;">
            ${hostUrl}
          </span>
          <button id="modal-copy-host-btn" style="
            background: #f59e0b; color: #000; font-weight: 800; padding: 6px 12px;
            border: none; border-radius: 6px; font-size: 0.75rem; white-space: nowrap; cursor: pointer;
          ">COPY</button>
        </div>

        <p style="font-size: 0.75rem; color: #64748b; margin: 0;">
          Room: <strong style="color: #38bdf8;">${roomCode}</strong> • Connected wirelessly via Realtime Sync
        </p>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-close-host-modal')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    document.getElementById('modal-copy-host-btn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(hostUrl).then(() => {
        const b = document.getElementById('modal-copy-host-btn');
        if (b) {
          b.textContent = 'COPIED!';
          setTimeout(() => { if (b) b.textContent = 'COPY'; }, 2000);
        }
      });
    });
  }

  function renderChallenge(challenge, showAnswer, showHint) {
    if (!challenge) return;

    const cardModeIcon = document.getElementById('cardModeIcon');
    const cardModeName = document.getElementById('cardModeName');
    const cardDiffBadge = document.getElementById('cardDiffBadge');
    const promptInstruction = document.getElementById('promptInstruction');
    const promptMainText = document.getElementById('promptMainText');
    const forbiddenGrid = document.getElementById('forbiddenGrid');
    const answerBanner = document.getElementById('answerBanner');

    const mode = window.SpeakOutData.getMode(challenge.modeId || engine.activeMode);

    if (cardModeIcon) cardModeIcon.textContent = mode.icon;
    if (cardModeName) cardModeName.textContent = mode.name;

    const diff = (challenge.difficulty || 'medium').toLowerCase();
    if (cardDiffBadge) {
      cardDiffBadge.className = `badge-difficulty-${diff}`;
      const pts = window.SpeakOutData.getMode(challenge.modeId).scoring[diff] || 100;
      cardDiffBadge.textContent = `${diff.toUpperCase()} (+${pts} PTS)`;
    }

    if (forbiddenGrid) forbiddenGrid.style.display = 'none';
    if (answerBanner) answerBanner.style.display = 'none';

    // Tailor rendering based on mode
    switch (challenge.modeId) {
      case 'tongue-twister':
        promptInstruction.textContent = challenge.instruction || 'REPEAT 3 TIMES CLEARLY WITHOUT STOPPING';
        promptMainText.textContent = `"${challenge.text}"`;
        break;

      case 'rapid-fire':
        promptInstruction.textContent = challenge.instruction || `NAME ${challenge.targetCount || 5} ITEMS BEFORE TIME RUNS OUT!`;
        promptMainText.textContent = challenge.prompt;
        break;

      case 'forbidden-words':
        promptInstruction.textContent = 'DESCRIBE THE SECRET WORD - DO NOT SAY FORBIDDEN WORDS!';
        promptMainText.textContent = challenge.target;

        if (forbiddenGrid && Array.isArray(challenge.forbidden)) {
          forbiddenGrid.style.display = 'grid';
          forbiddenGrid.innerHTML = challenge.forbidden
            .map(w => `<div class="forbidden-word-chip">🚫 ${w}</div>`)
            .join('');
        }
        break;

      case 'voice-challenge':
        promptInstruction.textContent = `CHARACTER: ${challenge.character}`;
        promptMainText.textContent = `"${challenge.phrase}"`;
        if (answerBanner) {
          answerBanner.style.display = 'block';
          answerBanner.textContent = `🎭 ACTING TIP: ${challenge.instruction}`;
        }
        break;

      case 'keep-talking':
        promptInstruction.textContent = `TALK CONTINUOUSLY FOR ${challenge.duration || 30} SECONDS - NO SILENCE!`;
        promptMainText.textContent = challenge.topic;
        if (answerBanner && challenge.hint) {
          answerBanner.style.display = 'block';
          answerBanner.textContent = `💡 IDEAS: ${challenge.hint}`;
        }
        break;

      case 'finish-the-phrase':
        promptInstruction.textContent = 'FINISH THE PHRASE BEFORE THE BUZZER!';
        promptMainText.textContent = challenge.setup;

        if (answerBanner) {
          answerBanner.style.display = 'block';
          if (showAnswer) {
            answerBanner.innerHTML = `✅ COMPLETE: <strong>${challenge.answer}</strong>`;
            answerBanner.style.color = '#34d399';
          } else {
            answerBanner.innerHTML = `💡 HINT: ${challenge.hint || 'Available to Co-Host'}`;
            answerBanner.style.color = '#94a3b8';
          }
        }
        break;

      default:
        promptInstruction.textContent = 'SPEAK OUT CHALLENGE';
        promptMainText.textContent = challenge.text || challenge.prompt || challenge.topic || 'Ready';
        break;
    }
  }

  function updateTimerUI(rem, formatted, percent, running) {
    const numEl = document.getElementById('timerNumber');
    const ringEl = document.getElementById('timerRing');

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
