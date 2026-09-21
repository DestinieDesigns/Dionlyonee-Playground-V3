/**
 * Dionlyonee Hangman Show - Categories
 * Curated themed categories for stream broadcasts
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HangmanCategories = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  return [
    {
      id: 'caribbean',
      name: 'CARIBBEAN CULTURE & REGGAE',
      icon: '🌴',
      color: '#10b981',
      description: 'Island vibes, Jamaican classics, reggae legends, and tropical culture'
    },
    {
      id: 'food',
      name: 'FOOD & ISLAND FLAVORS',
      icon: '🍗',
      color: '#f59e0b',
      description: 'Mouth-watering dishes, bakery treats, comfort meals, and street food'
    },
    {
      id: 'movies',
      name: 'BLOCKBUSTER MOVIES & TV',
      icon: '🎬',
      color: '#ec4899',
      description: 'Cinema classics, streaming hits, iconic franchises, and unforgettable characters'
    },
    {
      id: 'gaming',
      name: 'GAMING & STREAM LIFE',
      icon: '🎮',
      color: '#8b5cf6',
      description: 'Video games, esports, streaming culture, streamers, and gamer lore'
    },
    {
      id: 'music',
      name: 'HIP HOP, R&B & AFROBEATS',
      icon: '🎵',
      color: '#3b82f6',
      description: 'Chart-topping artists, music legends, anthems, and musical icons'
    },
    {
      id: 'animals',
      name: 'ANIMALS & WILDLIFE',
      icon: '🦁',
      color: '#14b8a6',
      description: 'Majestic predators, domestic companions, exotic birds, and sea creatures'
    },
    {
      id: 'sports',
      name: 'SPORTS & CHAMPIONS',
      icon: '🏆',
      color: '#ef4444',
      description: 'Athletic feats, world records, basketball, soccer, track, and championships'
    },
    {
      id: 'nostalgia',
      name: '90s & 2000s NOSTALGIA',
      icon: '📼',
      color: '#a855f7',
      description: 'Retro tech, arcade classics, toys, fashion, and childhood memories'
    },
    {
      id: 'landmarks',
      name: 'FAMOUS WORLD LANDMARKS',
      icon: '🏛️',
      color: '#06b6d4',
      description: 'Wonders of the world, natural monuments, historic cities, and global wonders'
    },
    {
      id: 'anime',
      name: 'ANIME & POP CULTURE',
      icon: '⚡',
      color: '#eab308',
      description: 'Shonen favorites, classic manga series, heroes, villains, and superpowers'
    },
    {
      id: 'science',
      name: 'EVERYDAY & SCIENCE',
      icon: '🚀',
      color: '#6366f1',
      description: 'Space mysteries, atmospheric phenomena, physics, and everyday gadgets'
    },
    {
      id: 'dionlyonee',
      name: 'DIONLYONEE SPECIALS',
      icon: '👑',
      color: '#d4af37',
      description: 'Stream memes, show catchphrases, playground hits, and host insider lore'
    }
  ];
});
