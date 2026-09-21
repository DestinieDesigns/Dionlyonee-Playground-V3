/**
 * Jeopardy Waiting Controller
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
      if (state && state.gameType === 'jeopardy' && state.selectedClue) {
        window.location.href = `/jeopardy/live/?room=${window.RoomManager.getRoom()}`;
      }
    });
  }
})();
