/**
 * Wheel Waiting Screen Logic
 */
(function () {
  const roomEl = document.getElementById('waiting-room-code');
  const podiumsEl = document.getElementById('waiting-podiums');

  if (roomEl && window.RoomManager) {
    roomEl.textContent = window.RoomManager.getRoom();
  }

  if (podiumsEl && window.GameLobby) {
    window.GameLobby.renderLobbyPodiums(podiumsEl);
  }

  if (window.FirebaseRoom) {
    window.FirebaseRoom.onState((state) => {
      if (state && state.phase && state.phase !== 'waiting') {
        // Auto-redirect to live stage if host starts round
        window.location.href = `/wheel/live/?room=${window.RoomManager.getRoom()}`;
      }
    });
  }
})();
