/**
 * Dionlyonee Playground - Contestant Manager
 * Handles contestant roster, active turn, avatars, round scores, and bank totals.
 */
(function () {
  const DEFAULT_CONTESTANTS = [
    { id: 'c1', name: 'DION', color: '#d4af37', avatar: '👑', roundScore: 0, bank: 0 },
    { id: 'c2', name: 'VIP GUEST', color: '#a855f7', avatar: '🌟', roundScore: 0, bank: 0 },
    { id: 'c3', name: 'CHALLENGER', color: '#10b981', avatar: '⚡', roundScore: 0, bank: 0 }
  ];

  class ContestantManager {
    constructor() {
      this.contestants = JSON.parse(JSON.stringify(DEFAULT_CONTESTANTS));
      this.activeIdx = 0;
    }

    getContestants() {
      return this.contestants;
    }

    getActive() {
      return this.contestants[this.activeIdx] || this.contestants[0];
    }

    setActive(index) {
      if (index >= 0 && index < this.contestants.length) {
        this.activeIdx = index;
      }
    }

    nextTurn() {
      this.activeIdx = (this.activeIdx + 1) % this.contestants.length;
      return this.getActive();
    }

    addRoundScore(amount, index = this.activeIdx) {
      if (this.contestants[index]) {
        this.contestants[index].roundScore = Math.max(0, (this.contestants[index].roundScore || 0) + amount);
      }
    }

    bankrupt(index = this.activeIdx) {
      if (this.contestants[index]) {
        this.contestants[index].roundScore = 0;
      }
    }

    bankRoundScores() {
      this.contestants.forEach(c => {
        c.bank = (c.bank || 0) + (c.roundScore || 0);
        c.roundScore = 0;
      });
    }

    resetAll() {
      this.contestants.forEach(c => {
        c.roundScore = 0;
        c.bank = 0;
      });
      this.activeIdx = 0;
    }

    setContestants(list) {
      if (Array.isArray(list) && list.length > 0) {
        this.contestants = list;
      }
    }
  }

  window.ContestantManager = new ContestantManager();
})();
