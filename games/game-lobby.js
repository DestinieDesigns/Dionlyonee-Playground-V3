/**
 * Dionlyonee Playground - Game Lobby Controller
 * Handles contestant lobby presence and readiness.
 */
(function () {
  class GameLobby {
    constructor() {
      this.players = [];
    }

    renderLobbyPodiums(containerEl) {
      if (!containerEl) return;
      const contestants = window.ContestantManager ? window.ContestantManager.getContestants() : [];

      containerEl.innerHTML = contestants.map((c, i) => `
        <div style="
          background: #111624; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; padding: 18px 16px; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
        ">
          <div style="
            width: 48px; height: 48px; border-radius: 12px;
            background: rgba(255,255,255,0.05); border: 2px solid ${c.color || '#d4af37'};
            display: flex; align-items: center; justify-content: center; font-size: 24px;
          ">
            ${c.avatar || '👤'}
          </div>
          <div style="font-family: 'Cinzel', serif; font-size: 15px; font-weight: 800; color: #fff;">
            ${c.name}
          </div>
          <div style="color: #10b981; font-size: 11px; font-weight: 700; letter-spacing: 1px;">
            READY ON STREAM
          </div>
        </div>
      `).join('');
    }
  }

  window.GameLobby = new GameLobby();
})();
