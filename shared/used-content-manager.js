/**
 * Dionlyonee Playground - Used Content Manager
 * Ensures no repeat puzzles, trivia questions, or clues during a stream.
 */
(function () {
  class UsedContentManager {
    constructor() {
      this.usedIds = new Set();
      this.load();
    }

    markUsed(id) {
      if (!id) return;
      this.usedIds.add(String(id));
      this.save();
    }

    isUsed(id) {
      if (!id) return false;
      return this.usedIds.has(String(id));
    }

    filterUnused(items, idKey = 'id') {
      if (!Array.isArray(items)) return [];
      const unused = items.filter(item => !this.isUsed(item[idKey]));
      return unused.length > 0 ? unused : items; // Reset pool if exhausted
    }

    reset() {
      this.usedIds.clear();
      this.save();
    }

    save() {
      try {
        const roomId = window.RoomManager ? window.RoomManager.getRoom() : 'DION1';
        sessionStorage.setItem(`dionlyonee_used_${roomId}`, JSON.stringify([...this.usedIds]));
      } catch (e) {}
    }

    load() {
      try {
        const roomId = window.RoomManager ? window.RoomManager.getRoom() : 'DION1';
        const cached = sessionStorage.getItem(`dionlyonee_used_${roomId}`);
        if (cached) {
          const list = JSON.parse(cached);
          if (Array.isArray(list)) {
            this.usedIds = new Set(list);
          }
        }
      } catch (e) {}
    }
  }

  window.UsedContentManager = new UsedContentManager();
})();
