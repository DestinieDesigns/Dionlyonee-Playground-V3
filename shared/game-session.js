/**
 * Dionlyonee Playground - Game Session
 * Manages active session metadata, round state, and persistence.
 */
(function () {
  class GameSession {
    constructor() {
      this.currentGame = 'wheel';
      this.round = 1;
      this.phase = 'idle'; // 'idle' | 'spinning' | 'letter' | 'buzz' | 'answer' | 'reveal'
      this.activePlayerIndex = 0;
      this.state = {};
    }

    startRound(roundNumber = 1) {
      this.round = roundNumber;
      this.phase = 'ready';
      this.save();
    }

    setPhase(phase) {
      this.phase = phase;
      this.save();
    }

    nextPlayer(totalPlayers = 3) {
      this.activePlayerIndex = (this.activePlayerIndex + 1) % totalPlayers;
      this.save();
      return this.activePlayerIndex;
    }

    save() {
      const roomId = window.RoomManager ? window.RoomManager.getRoom() : 'DION1';
      const storageKey = `dionlyonee_session_${roomId}`;
      try {
        sessionStorage.setItem(storageKey, JSON.stringify({
          currentGame: this.currentGame,
          round: this.round,
          phase: this.phase,
          activePlayerIndex: this.activePlayerIndex,
          timestamp: Date.now()
        }));
      } catch (e) {}
    }

    load() {
      const roomId = window.RoomManager ? window.RoomManager.getRoom() : 'DION1';
      const storageKey = `dionlyonee_session_${roomId}`;
      try {
        const cached = sessionStorage.getItem(storageKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          Object.assign(this, parsed);
        }
      } catch (e) {}
      return this;
    }
  }

  window.GameSession = new GameSession();
})();
