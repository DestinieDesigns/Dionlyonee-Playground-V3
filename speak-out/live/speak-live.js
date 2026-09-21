/**
 * DIONLYONEE SPEAK OUT! - Live Stage Spectator / OBS Overlay Controller
 */
(function () {
  let engine = null;
  let toastTimer = null;

  document.addEventListener('DOMContentLoaded', () => {
    engine = new window.SpeakEngine({ role: 'live' });

    initUI();
  });

  function initUI() {
    const roomCode = engine.roomCode || 'DIONLIVE';
    const roomVal = document.getElementById('liveRoomVal');
    if (roomVal) roomVal.textContent = roomCode;

    const waitRoomEl = document.getElementById('waitingRoomCode');
    if (waitRoomEl) waitRoomEl.textContent = roomCode;

    // Set up QR Code for Mobile Host Remote Control
    const hostUrl = `${window.location.origin}/speak-out/host/index.html?room=${encodeURIComponent(roomCode)}`;
    const qrImg = document.getElementById('waitingQrImg');
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(hostUrl)}`;
    }

    // Copy Host URL Button
    const btnCopy = document.getElementById('btnCopyHostUrl');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(hostUrl).then(() => {
          btnCopy.textContent = '✅ COPIED TO CLIPBOARD!';
          btnCopy.style.background = '#10b981';
          btnCopy.style.color = '#ffffff';
          setTimeout(() => {
            btnCopy.textContent = '📋 COPY HOST LINK';
            btnCopy.style.background = '';
            btnCopy.style.color = '';
          }, 2000);
        });
      });
    }

    // Top Header Connect Phone Button
    document.getElementById('btnLiveConnectDevice')?.addEventListener('click', () => {
      showDeviceConnectModal(roomCode, hostUrl);
    });

    engine.onStateUpdate(renderLiveState);
    engine.timer.onTick(updateLiveTimer);
  }

  function renderLiveState(state) {
    if (!state) return;

    // Score
    const scoreVal = document.getElementById('liveScoreVal');
    if (scoreVal && state.score) scoreVal.textContent = state.score.totalScore.toLocaleString();

    // Streak
    const streakVal = document.getElementById('liveStreakVal');
    const streakBox = document.getElementById('liveStreakBox');
    if (streakVal && state.streak) {
      streakVal.textContent = `${state.streak.currentStreak} 🔥`;
      if (state.streak.currentStreak >= 3) {
        streakBox?.classList.add('animate-streak');
      } else {
        streakBox?.classList.remove('animate-streak');
      }
    }

    // Stage Toggle: Waiting Screen vs Active Arena
    const waitingStage = document.getElementById('liveWaitingStage');
    const arenaStage = document.getElementById('liveArena');

    const isWaiting = (!state.status || state.status === 'waiting' || !state.currentChallenge);

    if (isWaiting) {
      if (waitingStage) waitingStage.style.display = 'flex';
      if (arenaStage) arenaStage.style.display = 'none';

      const badge = document.getElementById('waitingStatusBadge');
      if (badge && state.lastAction && state.lastAction.text) {
        badge.textContent = state.lastAction.text.toUpperCase();
      }
    } else {
      if (waitingStage) waitingStage.style.display = 'none';
      if (arenaStage) arenaStage.style.display = 'flex';

      // Action Toast
      if (state.lastAction) {
        showToast(state.lastAction);
      }

      // Challenge
      renderLiveChallenge(state.currentChallenge, state.showAnswer, state.showHint);
    }
  }

  function showDeviceConnectModal(roomCode, hostUrl) {
    let modal = document.getElementById('speak-device-modal');
    if (modal) modal.remove();

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(hostUrl)}`;
    const cohostUrl = `${window.location.origin}/speak-out/cohost/index.html?room=${encodeURIComponent(roomCode)}`;

    modal = document.createElement('div');
    modal.id = 'speak-device-modal';
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
        <button id="btn-close-device-modal" style="
          position: absolute; top: 16px; right: 16px;
          background: rgba(255,255,255,0.08); border: none; border-radius: 50%;
          width: 34px; height: 34px; color: #94a3b8; font-size: 16px; cursor: pointer;
        ">✕</button>

        <div style="font-size: 38px; margin-bottom: 8px;">📱</div>
        <h2 style="font-family: var(--font-display, sans-serif); font-size: 1.5rem; font-weight: 900; color: #f59e0b; margin-bottom: 6px;">
          CONTROL FROM YOUR PHONE
        </h2>
        <p style="color: #94a3b8; font-size: 0.85rem; line-height: 1.5; margin-bottom: 18px;">
          Scan with your phone or iPad camera to launch rounds, control timers, and view prompts wirelessly while keeping this screen on your stream!
        </p>

        <div style="
          display: inline-block; padding: 10px; background: #ffffff;
          border-radius: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.6); margin-bottom: 18px;
        ">
          <img src="${qrUrl}" alt="Host QR" style="width: 200px; height: 200px; display: block;" />
        </div>

        <div style="
          background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px; font-size: 0.8rem; color: #cbd5e1; word-break: break-all; text-align: left;
        ">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 8px;">
            ${hostUrl}
          </span>
          <button id="modal-copy-host" style="
            background: #f59e0b; color: #000; font-weight: 800; padding: 6px 12px;
            border: none; border-radius: 6px; font-size: 0.75rem; white-space: nowrap; cursor: pointer;
          ">COPY</button>
        </div>

        <div style="display: flex; gap: 8px; justify-content: center; margin-top: 10px;">
          <a href="${hostUrl}" target="_blank" style="color: #f59e0b; font-size: 0.8rem; font-weight: 700; text-decoration: none;">Open Host Tab ↗</a>
          <span style="color: rgba(255,255,255,0.2);">•</span>
          <a href="${cohostUrl}" target="_blank" style="color: #a855f7; font-size: 0.8rem; font-weight: 700; text-decoration: none;">Open Co-Host Tab ↗</a>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-close-device-modal')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    document.getElementById('modal-copy-host')?.addEventListener('click', () => {
      navigator.clipboard.writeText(hostUrl).then(() => {
        const b = document.getElementById('modal-copy-host');
        if (b) {
          b.textContent = 'COPIED!';
          setTimeout(() => { if (b) b.textContent = 'COPY'; }, 2000);
        }
      });
    });
  }

  function renderLiveChallenge(challenge, showAnswer, showHint) {
    if (!challenge) return;

    const bannerIcon = document.getElementById('liveModeIcon');
    const bannerName = document.getElementById('liveModeName');
    const instruction = document.getElementById('liveInstruction');
    const headline = document.getElementById('liveHeadline');
    const forbiddenGrid = document.getElementById('liveForbiddenGrid');
    const answerReveal = document.getElementById('liveAnswerReveal');

    const mode = window.SpeakOutData.getMode(challenge.modeId);

    if (bannerIcon) bannerIcon.textContent = mode.icon;
    if (bannerName) bannerName.textContent = mode.name;

    if (forbiddenGrid) forbiddenGrid.style.display = 'none';
    if (answerReveal) answerReveal.style.display = 'none';

    switch (challenge.modeId) {
      case 'tongue-twister':
        instruction.textContent = challenge.instruction || 'REPEAT 3 TIMES CLEARLY WITHOUT STOPPING';
        headline.textContent = `"${challenge.text}"`;
        break;

      case 'rapid-fire':
        instruction.textContent = challenge.instruction || `NAME ${challenge.targetCount || 5} ITEMS FAST!`;
        headline.textContent = challenge.prompt;
        break;

      case 'forbidden-words':
        instruction.textContent = 'HOST MUST DESCRIBE - DO NOT SAY FORBIDDEN WORDS!';
        headline.textContent = challenge.target;

        if (forbiddenGrid && Array.isArray(challenge.forbidden)) {
          forbiddenGrid.style.display = 'grid';
          forbiddenGrid.innerHTML = challenge.forbidden
            .map(w => `<div class="live-forbidden-pill">🚫 ${w}</div>`)
            .join('');
        }
        break;

      case 'voice-challenge':
        instruction.textContent = `IMPERSONATE: ${challenge.character}`;
        headline.textContent = `"${challenge.phrase}"`;
        break;

      case 'keep-talking':
        instruction.textContent = `TALK CONTINUOUSLY FOR ${challenge.duration || 30} SECONDS!`;
        headline.textContent = challenge.topic;
        break;

      case 'finish-the-phrase':
        instruction.textContent = 'FINISH THE PHRASE!';
        headline.textContent = challenge.setup;

        if (answerReveal) {
          if (showAnswer) {
            answerReveal.style.display = 'block';
            answerReveal.innerHTML = `✅ ${challenge.answer}`;
          } else if (showHint && challenge.hint) {
            answerReveal.style.display = 'block';
            answerReveal.innerHTML = `💡 HINT: ${challenge.hint}`;
            answerReveal.style.borderColor = '#f59e0b';
            answerReveal.style.color = '#fbbf24';
          }
        }
        break;

      default:
        instruction.textContent = 'DIONLYONEE SPEAK OUT!';
        headline.textContent = challenge.text || 'Ready for Next Challenge';
        break;
    }
  }

  function updateLiveTimer(rem, formatted, percent, running) {
    const numEl = document.getElementById('liveTimerNum');
    const floatEl = document.getElementById('liveTimerFloat');

    if (numEl) numEl.textContent = formatted;

    if (floatEl) {
      if (rem <= 5 && rem > 0) {
        floatEl.classList.add('animate-timer-critical');
      } else {
        floatEl.classList.remove('animate-timer-critical');
      }
    }
  }

  function showToast(action) {
    const toast = document.getElementById('liveBannerToast');
    const text = document.getElementById('liveToastText');
    const icon = document.getElementById('liveToastIcon');
    if (!toast || !text || !action || !action.text) return;

    if (action.type === 'pass') {
      icon.textContent = '✅';
      toast.style.borderColor = '#10b981';
    } else if (action.type === 'fail') {
      icon.textContent = '❌';
      toast.style.borderColor = '#ef4444';
    } else if (action.type === 'bonus') {
      icon.textContent = '⭐';
      toast.style.borderColor = '#f59e0b';
    } else {
      icon.textContent = '📢';
      toast.style.borderColor = '#38bdf8';
    }

    text.textContent = action.text;
    toast.style.display = 'flex';

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.display = 'none';
    }, 3500);
  }
})();
