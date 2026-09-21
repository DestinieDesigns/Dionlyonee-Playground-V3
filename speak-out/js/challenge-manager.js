/**
 * DIONLYONEE SPEAK OUT! - Challenge Manager
 * Guarantees zero repeats during the active room session.
 */
(function () {
  class ChallengeManager {
    constructor() {
      this.usedIds = new Set();
      this.currentChallenge = null;
      this.currentMode = 'tongue-twister';
      this.selectedDifficulty = 'all'; // 'all' | 'easy' | 'medium' | 'hard' | 'extreme'
    }

    setUsedIds(idsArray) {
      if (Array.isArray(idsArray)) {
        this.usedIds = new Set(idsArray);
      }
    }

    markAsUsed(challengeId) {
      if (!challengeId) return;
      this.usedIds.add(challengeId);
      if (window.UsedContentManager && typeof window.UsedContentManager.markUsed === 'function') {
        window.UsedContentManager.markUsed('speak-out', challengeId);
      }
    }

    isUsed(challengeId) {
      return this.usedIds.has(challengeId);
    }

    clearUsed() {
      this.usedIds.clear();
      if (window.UsedContentManager && typeof window.UsedContentManager.clearCategory === 'function') {
        window.UsedContentManager.clearCategory('speak-out');
      }
    }

    getPoolForMode(modeKey) {
      const mode = window.SpeakOutData ? window.SpeakOutData.getMode(modeKey) : null;
      return mode ? mode.getItems() : [];
    }

    getNextChallenge(modeKey, difficultyFilter = 'all') {
      let resolvedMode = modeKey;
      if (resolvedMode === 'random') {
        resolvedMode = window.SpeakRandomizer ? window.SpeakRandomizer.getRandomMode() : 'tongue-twister';
      }

      this.currentMode = resolvedMode;
      const pool = this.getPoolForMode(resolvedMode);

      if (!pool || pool.length === 0) {
        return null;
      }

      // Filter by difficulty if requested
      let filtered = pool;
      if (difficultyFilter && difficultyFilter !== 'all') {
        const matches = pool.filter(item => String(item.difficulty || '').toLowerCase() === difficultyFilter.toLowerCase());
        if (matches.length > 0) {
          filtered = matches;
        }
      }

      // Filter out used IDs
      let unused = filtered.filter(item => !this.usedIds.has(item.id));

      // If pool exhausted, reset this pool
      if (unused.length === 0) {
        // Remove this mode's items from usedIds to reshuffle
        const modeItemIds = new Set(pool.map(p => p.id));
        this.usedIds = new Set([...this.usedIds].filter(id => !modeItemIds.has(id)));
        unused = filtered;
      }

      // Pick random unused
      const idx = Math.floor(Math.random() * unused.length);
      const chosen = unused[idx];

      if (chosen) {
        this.markAsUsed(chosen.id);
        this.currentChallenge = {
          ...chosen,
          modeId: resolvedMode,
          modeName: window.SpeakOutData.getMode(resolvedMode).name,
          modeIcon: window.SpeakOutData.getMode(resolvedMode).icon,
          modeAccent: window.SpeakOutData.getMode(resolvedMode).accent
        };
      }

      return this.currentChallenge;
    }

    getCurrent() {
      return this.currentChallenge;
    }

    getStats() {
      return {
        usedCount: this.usedIds.size,
        totalAvailable: window.SpeakOutData ? window.SpeakOutData.getTotalChallengeCount() : 0,
        usedIds: Array.from(this.usedIds)
      };
    }
  }

  window.ChallengeManager = ChallengeManager;
})();
