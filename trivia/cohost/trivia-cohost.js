/**
 * Trivia Co-Host Mobile Buzzer Controller
 */
(function () {
  const roomEl = document.getElementById('cohost-room');
  const previewEl = document.getElementById('cohost-q-preview');
  const buzzBtn = document.getElementById('btn-buzz');

  if (roomEl && window.RoomManager) {
    roomEl.textContent = window.RoomManager.getRoom();
  }

  if (buzzBtn && window.FirebaseRoom) {
    buzzBtn.addEventListener('click', () => {
      if (window.sounds) window.sounds.play('buzzer');
      window.FirebaseRoom.sendBuzzer('Co-Host Phone');
      buzzBtn.style.transform = 'scale(0.92)';
      setTimeout(() => { buzzBtn.style.transform = 'scale(1)'; }, 150);
    });
  }

  if (window.FirebaseRoom && previewEl) {
    window.FirebaseRoom.onState((state) => {
      if (state.question) {
        previewEl.innerHTML = `<strong>${state.question.category}:</strong> ${state.question.question}`;
      }
    });
  }
})();
