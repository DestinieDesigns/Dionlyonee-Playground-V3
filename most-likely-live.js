// Dionlyonee Most Likely To - Live Audience Flashcard Stage (Pure Vanilla JS)
// BroadcastChannel: dionlyonee-most-likely-game

(function () {
  'use strict';

  const CHANNEL_NAME = 'dionlyonee-most-likely-game';
  const STORAGE_KEY = 'dionlyonee_most_likely_state';
  const channel = new BroadcastChannel(CHANNEL_NAME);

  let state = {
    card: null,
    category: 'ALL',
    cardIndex: 1,
    totalCards: 1,
    customCards: [],
    lastUpdate: 0
  };

  let currentCardId = null;

  const waitingSection = document.getElementById('ml-waiting-section');
  const cardSection = document.getElementById('ml-card-section');
  const flashcardElem = document.getElementById('ml-flashcard');
  const deckBadge = document.getElementById('ml-live-deck-badge');
  const promptText = document.getElementById('ml-live-prompt');
  const numberBadge = document.getElementById('ml-live-number-badge');
  const counterBadge = document.getElementById('ml-live-card-counter');

  function renderFlashcardStage() {
    const card = state.card;

    if (!card) {
      if (waitingSection) waitingSection.style.display = 'flex';
      if (cardSection) cardSection.style.display = 'none';
      return;
    }

    if (waitingSection) waitingSection.style.display = 'none';
    if (cardSection) cardSection.style.display = 'flex';

    if (deckBadge) {
      deckBadge.textContent = `${card.category} EDITION`;
    }

    if (numberBadge) {
      numberBadge.textContent = `#${state.cardIndex || 1}`;
    }

    if (counterBadge) {
      counterBadge.textContent = `CARD ${state.cardIndex || 1} / ${state.totalCards || 60}`;
    }

    if (promptText) {
      promptText.textContent = card.text;
    }

    // Trigger card flip animation when card changes
    if (card.id !== currentCardId && flashcardElem) {
      currentCardId = card.id;
      flashcardElem.classList.remove('flip-anim');
      void flashcardElem.offsetWidth; // Trigger reflow
      flashcardElem.classList.add('flip-anim');
    }
  }

  // --- BROADCAST & STORAGE SYNC ---

  channel.onmessage = function (e) {
    const data = e.data;
    if (!data) return;

    if (data.type === 'UPDATE_STATE' && data.state) {
      state = data.state;
      renderFlashcardStage();
    } else if (data.type === 'PLAY_SOUND' && data.sound) {
      if (window.sounds) window.sounds.play(data.sound);
    }
  };

  // Cross-tab storage listener
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed) {
          state = parsed;
          renderFlashcardStage();
        }
      } catch (err) {
        console.warn('ML Live storage sync error:', err);
      }
    }
  });

  // Visibility change re-sync
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      syncFromLocalStorage();
      channel.postMessage({ type: 'REQUEST_STATE' });
    }
  });

  function syncFromLocalStorage() {
    try {
      const cached = sessionStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && (!state.lastUpdate || parsed.lastUpdate >= state.lastUpdate)) {
          state = parsed;
          renderFlashcardStage();
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function init() {
    if (window.RoomSync) {
      window.RoomSync.role = 'live';
      window.RoomSync.gameType = 'most-likely';
      window.RoomSync.attachRoomHUD('.main-header, .live-header');
      window.RoomSync.onStateChange((newState, sound) => {
        if (newState) {
          state = newState;
          renderFlashcardStage();
        }
        if (sound && window.sounds) {
          window.sounds.play(sound === 'card_flip' ? 'reveal' : sound);
        }
      });
    }

    syncFromLocalStorage();

    // Default sample card if no state received yet
    if (!state.card && window.MOST_LIKELY_CARDS && window.MOST_LIKELY_CARDS.length > 0) {
      state.card = window.MOST_LIKELY_CARDS[0];
      state.cardIndex = 1;
      state.totalCards = window.MOST_LIKELY_CARDS.length;
    }

    renderFlashcardStage();

    try {
      channel.postMessage({ type: 'REQUEST_STATE' });
    } catch (e) {
      console.warn('Channel error:', e);
    }

    // Polling fallback
    setInterval(syncFromLocalStorage, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
