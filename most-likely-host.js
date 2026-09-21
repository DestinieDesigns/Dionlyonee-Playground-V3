// Dionlyonee Most Likely To - Host Flashcard Remote Logic (Pure Vanilla JS)
// BroadcastChannel: dionlyonee-most-likely-game

(function () {
  'use strict';

  const CHANNEL_NAME = 'dionlyonee-most-likely-game';
  const STORAGE_KEY = 'dionlyonee_most_likely_state';
  const channel = new BroadcastChannel(CHANNEL_NAME);

  let activeCategory = 'ALL';
  let activeDeck = [];
  let currentIndex = 0;
  let customCards = [];

  const state = {
    card: null,
    category: 'ALL',
    cardIndex: 1,
    totalCards: 1,
    customCards: [],
    lastUpdate: Date.now()
  };

  // DOM Elements
  const categorySelect = document.getElementById('ml-category-select');
  const categoryChipsContainer = document.getElementById('ml-category-chips');
  const cardPrompt = document.getElementById('ml-prompt-text');
  const categoryBadge = document.getElementById('ml-category-badge');
  const cardIdBadge = document.getElementById('ml-card-id-badge');
  const cardCounterBadge = document.getElementById('ml-card-counter-badge');
  const deckCountBadge = document.getElementById('ml-deck-count-badge');
  const cardsListContainer = document.getElementById('ml-cards-list');

  // Action Buttons & Inputs
  const btnNext = document.getElementById('btn-ml-next');
  const btnPrev = document.getElementById('btn-ml-prev');
  const btnRandom = document.getElementById('btn-ml-random');
  const btnShuffle = document.getElementById('btn-ml-shuffle');
  const btnCopyLive = document.getElementById('btn-ml-copy-live');
  const btnAddCustom = document.getElementById('btn-add-custom-card');
  const inputCustom = document.getElementById('input-custom-card');

  function getCombinedCards() {
    const defaultCards = window.MOST_LIKELY_CARDS || [];
    return [...defaultCards, ...customCards];
  }

  function filterDeck(category) {
    const all = getCombinedCards();
    if (!category || category === 'ALL') {
      return [...all];
    }
    return all.filter((c) => c.category === category);
  }

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function setupDeck(category, shuffle = false) {
    activeCategory = category || 'ALL';
    let deck = filterDeck(activeCategory);
    if (deck.length === 0) deck = filterDeck('ALL');

    if (shuffle) {
      deck = shuffleArray(deck);
    }

    activeDeck = deck;
    currentIndex = 0;
    showCardAtIndex(0, false);
  }

  function showCardAtIndex(index, playChime = true) {
    if (activeDeck.length === 0) {
      setupDeck('ALL');
    }

    if (index < 0) index = activeDeck.length - 1;
    if (index >= activeDeck.length) index = 0;

    currentIndex = index;
    const currentCard = activeDeck[currentIndex];

    state.card = currentCard;
    state.category = activeCategory;
    state.cardIndex = currentIndex + 1;
    state.totalCards = activeDeck.length;
    state.customCards = customCards;

    if (playChime && window.sounds) {
      window.sounds.play('reveal');
    }

    broadcastState('card_flip');
  }

  function nextCard() {
    showCardAtIndex(currentIndex + 1, true);
  }

  function prevCard() {
    showCardAtIndex(currentIndex - 1, true);
  }

  function randomCard() {
    if (activeDeck.length <= 1) return;
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * activeDeck.length);
    } while (nextIdx === currentIndex && activeDeck.length > 1);

    showCardAtIndex(nextIdx, true);
  }

  function shuffleCurrentDeck() {
    activeDeck = shuffleArray(activeDeck);
    showCardAtIndex(0, true);
  }

  function addCustomCard() {
    const text = inputCustom?.value.trim();
    if (!text) return;

    const newCard = {
      id: `custom-${Date.now()}`,
      category: 'CUSTOM',
      text: text
    };

    customCards.unshift(newCard);
    activeDeck.unshift(newCard);
    currentIndex = 0;

    if (inputCustom) inputCustom.value = '';

    showCardAtIndex(0, true);
    renderCategoryChips();
  }

  function copyLiveStageLink() {
    const room = (window.RoomSync && window.RoomSync.roomId) || 'DION1';
    const url = new URL('most-likely-live.html', window.location.href);
    url.searchParams.set('room', room);

    navigator.clipboard.writeText(url.toString()).then(() => {
      alert(`✅ Live Stage Link Copied!\n\nRoom: ${room}\nURL: ${url.toString()}\n\nPaste into OBS Browser Source or open in full-screen on stream.`);
    }).catch(() => {
      prompt('Copy Live Stage URL:', url.toString());
    });
  }

  // --- BROADCAST & STORAGE SYNC ---

  function broadcastState(soundEvent = null) {
    state.lastUpdate = Date.now();

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('SessionStorage error:', e);
    }

    try {
      channel.postMessage({
        type: 'UPDATE_STATE',
        state: state,
        sound: soundEvent,
        timestamp: state.lastUpdate
      });
    } catch (e) {
      console.warn('Channel broadcast error:', e);
    }

    if (window.RoomSync) {
      window.RoomSync.sendState(state, soundEvent);
    }

    renderHostUI();
  }

  channel.onmessage = function (e) {
    const data = e.data;
    if (!data) return;
    if (data.type === 'REQUEST_STATE') {
      broadcastState();
    }
  };

  // --- RENDER HOST UI ---

  function renderHostUI() {
    const card = state.card;

    if (card) {
      if (cardPrompt) cardPrompt.textContent = card.text;
      if (categoryBadge) categoryBadge.textContent = `${card.category} EDITION`;
      if (cardIdBadge) cardIdBadge.textContent = `#${currentIndex + 1}`;
      if (cardCounterBadge) cardCounterBadge.textContent = `CARD ${currentIndex + 1} OF ${activeDeck.length}`;
    }

    if (deckCountBadge) {
      deckCountBadge.textContent = `${activeDeck.length} Cards in Deck`;
    }

    // Update active category select and chips
    if (categorySelect && categorySelect.value !== activeCategory) {
      categorySelect.value = activeCategory;
    }

    if (categoryChipsContainer) {
      categoryChipsContainer.querySelectorAll('.category-chip').forEach((chip) => {
        const cat = chip.getAttribute('data-cat');
        if (cat === activeCategory) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    }

    // Render Cards Scroll List
    if (cardsListContainer) {
      cardsListContainer.innerHTML = activeDeck
        .map((c, i) => {
          const isActive = i === currentIndex;
          return `
          <button class="card-list-item ${isActive ? 'active' : ''}" data-index="${i}">
            <span style="font-weight: 700; color: ${isActive ? '#d8b4fe' : '#94a3b8'};">#${i + 1}</span>
            <span style="flex: 1; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c.text}</span>
            <span style="font-size: 10px; opacity: 0.7;">${c.category}</span>
          </button>
        `;
        })
        .join('');

      cardsListContainer.querySelectorAll('.card-list-item').forEach((item) => {
        item.addEventListener('click', () => {
          const idx = parseInt(item.getAttribute('data-index'), 10);
          showCardAtIndex(idx, true);
        });
      });
    }
  }

  function renderCategoryChips() {
    if (!categoryChipsContainer) return;
    const cats = window.MOST_LIKELY_CATEGORIES || [];

    categoryChipsContainer.innerHTML = cats
      .map((c) => `
        <button class="category-chip ${c.key === activeCategory ? 'active' : ''}" data-cat="${c.key}">
          <span>${c.icon}</span>
          <span>${c.label.split(' ')[0]}</span>
        </button>
      `)
      .join('');

    categoryChipsContainer.querySelectorAll('.category-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const cat = chip.getAttribute('data-cat');
        setupDeck(cat, true);
      });
    });
  }

  function init() {
    // 1. Populate category select
    if (categorySelect) {
      const cats = window.MOST_LIKELY_CATEGORIES || [];
      categorySelect.innerHTML = cats
        .map((c) => `<option value="${c.key}">${c.icon} ${c.label}</option>`)
        .join('');

      categorySelect.addEventListener('change', (e) => {
        setupDeck(e.target.value, true);
      });
    }

    renderCategoryChips();

    // 2. Attach button handlers
    btnNext?.addEventListener('click', nextCard);
    btnPrev?.addEventListener('click', prevCard);
    btnRandom?.addEventListener('click', randomCard);
    btnShuffle?.addEventListener('click', shuffleCurrentDeck);
    btnCopyLive?.addEventListener('click', copyLiveStageLink);
    btnAddCustom?.addEventListener('click', addCustomCard);

    inputCustom?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addCustomCard();
    });

    // Keyboard navigation for host: Space or Right Arrow for next card, Left Arrow for prev
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        nextCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevCard();
      }
    });

    // 3. Setup initial deck
    setupDeck('ALL', true);

    // 4. Connect RoomSync for multi-device cross-network support
    if (window.RoomSync) {
      window.RoomSync.role = 'host';
      window.RoomSync.gameType = 'most-likely';
      window.RoomSync.attachRoomHUD('.main-header, .ml-header');
      window.RoomSync.ensureHostPasscodeUnlocked(() => {
        renderHostUI();
        broadcastState();
      });
    } else {
      renderHostUI();
      broadcastState();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
