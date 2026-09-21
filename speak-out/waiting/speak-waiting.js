/**
 * DIONLYONEE SPEAK OUT! - Waiting / Intermission Controller
 */
(function () {
  let engine = null;

  document.addEventListener('DOMContentLoaded', () => {
    engine = new window.SpeakEngine({ role: 'waiting' });

    const roomCode = engine.roomCode || 'DIONLIVE';
    const waitRoom = document.getElementById('waitRoomCode');
    if (waitRoom) waitRoom.textContent = roomCode;

    const hostLink = document.getElementById('waitHostLink');
    if (hostLink) hostLink.href = `../host/index.html?room=${roomCode}`;

    const cohostLink = document.getElementById('waitCohostLink');
    if (cohostLink) cohostLink.href = `../cohost/index.html?room=${roomCode}`;

    const liveLink = document.getElementById('waitLiveLink');
    if (liveLink) liveLink.href = `../live/index.html?room=${roomCode}`;

    engine.onStateUpdate((state) => {
      const statusText = document.getElementById('waitingStatusText');
      if (statusText && state.currentChallenge) {
        const mode = window.SpeakOutData ? window.SpeakOutData.getMode(state.currentChallenge.modeId) : null;
        statusText.textContent = `🎯 Active Challenge: ${mode ? mode.name : 'Speak Out'} in progress!`;
      }
    });
  });
})();
