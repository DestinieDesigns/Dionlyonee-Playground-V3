/**
 * Word Reveal Co-Host Controller
 */
(function () {
  const roomEl = document.getElementById('cohost-room');
  const catEl = document.getElementById('cohost-category');
  const hintEl = document.getElementById('cohost-hint');
  const buzzBtn = document.getElementById('btn-buzz');
  const guessForm = document.getElementById('cohost-guess-form');
  const guessInput = document.getElementById('cohost-guess-input');
  const feedbackEl = document.getElementById('cohost-feedback');

  const channel = new BroadcastChannel('dionlyonee-word-reveal-channel');
  const channelAlt = new BroadcastChannel('dionlyonee-word-reveal');

  if (roomEl && window.RoomManager) {
    roomEl.textContent = window.RoomManager.getRoom();
  }

  if (buzzBtn) {
    buzzBtn.addEventListener('click', () => {
      if (window.SoundManager) window.SoundManager.playSound('buzzer');
      if (window.FirebaseRoom) window.FirebaseRoom.sendBuzzer('Co-Host Phone');
      buzzBtn.style.transform = 'scale(0.92)';
      setTimeout(() => { buzzBtn.style.transform = 'scale(1)'; }, 150);
    });
  }

  if (guessForm && guessInput) {
    guessForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = guessInput.value.trim();
      if (!val) return;

      const payload = {
        type: 'CHAT_GUESS',
        chatter: 'Co-Host Mobile',
        guess: val,
        timestamp: Date.now()
      };

      try { channel.postMessage(payload); } catch (err) {}
      try { channelAlt.postMessage(payload); } catch (err) {}
      try { window.postMessage(payload, '*'); } catch (err) {}

      guessInput.value = '';
      if (feedbackEl) {
        feedbackEl.style.display = 'block';
        feedbackEl.textContent = `Sent guess: "${val}"`;
        setTimeout(() => { feedbackEl.style.display = 'none'; }, 2500);
      }
    });
  }

  function applyState(state) {
    if (!state || !state.puzzle) return;
    if (catEl) catEl.textContent = `Category: ${state.puzzle.category || 'General'}`;
    if (hintEl) {
      const tier = state.puzzle.activeHintTier || 1;
      const clue = tier === 1
        ? (state.puzzle.hintTier1 || state.puzzle.hint || '')
        : (tier === 2 ? state.puzzle.hintTier2 : state.puzzle.hintTier3);
      hintEl.textContent = `Clue (Tier ${tier}): ${clue || 'A mystery phrase awaits'}`;
    }
  }

  channel.onmessage = (e) => {
    if (e.data && e.data.type === 'STATE_UPDATE') applyState(e.data);
  };
  channelAlt.onmessage = (e) => {
    if (e.data && e.data.type === 'STATE_UPDATE') applyState(e.data);
  };

  if (window.FirebaseRoom) {
    window.FirebaseRoom.onState((state) => {
      applyState(state);
    });
  }
})();
