/**
 * Dionlyonee Playground - Game Launcher
 * Renders launcher dialogs and manages screen transitions.
 */
(function () {
  const GameLauncher = {
    openLauncher(gameId) {
      const game = (window.GamesData || []).find(g => g.id === gameId);
      if (!game) return;

      const roomId = window.RoomManager ? window.RoomManager.getRoom() : 'DION1';

      let modal = document.getElementById('game-launcher-modal');
      if (modal) modal.remove();

      modal = document.createElement('div');
      modal.id = 'game-launcher-modal';
      modal.className = 'game-modal-backdrop';
      modal.innerHTML = `
        <div class="game-modal">
          <button id="btn-close-launcher" style="
            position: absolute; top: 16px; right: 16px;
            background: rgba(255,255,255,0.06); border-radius: 50%;
            width: 32px; height: 32px; color: #94a3b8; font-size: 16px; cursor: pointer;
          ">✕</button>

          <div class="game-modal-header">
            <div class="game-modal-icon">${game.icon}</div>
            <div>
              <h2 style="font-family: 'Cinzel', serif; font-size: 22px; color: #fff;">${game.title}</h2>
              <p style="color: #d4af37; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                ${game.genre}
              </p>
            </div>
          </div>

          <p style="color: #94a3b8; font-size: 13.5px; line-height: 1.6;">${game.desc}</p>

          <div style="margin-top: 18px; padding: 10px 14px; background: rgba(0,0,0,0.3); border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #94a3b8;">
            Broadcasting on Room: <b style="color: #f7e07d;">${roomId}</b>
          </div>

          <div class="game-modal-views">
            <a href="${game.links.host}?room=${roomId}" class="game-view-btn" style="border-color: rgba(212,175,55,0.4); background: rgba(212,175,55,0.08);">
              <strong>👑 HOST CONSOLE</strong>
              <span>Host controls, puzzle reveals & scores</span>
            </a>
            <a href="${game.links.live}?room=${roomId}" target="_blank" class="game-view-btn">
              <strong>📺 LIVE STAGE (STREAM)</strong>
              <span>Fullscreen audience broadcast view for OBS / Big Screen</span>
            </a>
            <a href="${game.links.cohost}?room=${roomId}" target="_blank" class="game-view-btn">
              <strong>📱 CO-HOST / PHONE</strong>
              <span>Mobile buzzer, remote wheel spin & answer reveals</span>
            </a>
            <a href="${game.links.waiting}?room=${roomId}" target="_blank" class="game-view-btn">
              <strong>⏳ WAITING LOBBY</strong>
              <span>Intermission standby screen for live stream countdown</span>
            </a>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      document.getElementById('btn-close-launcher').addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });
    }
  };

  window.GameLauncher = GameLauncher;
})();
