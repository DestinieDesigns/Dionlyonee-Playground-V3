/**
 * Dionlyonee Playground - Room UI & HUD
 * Provides sticky Room HUD, Phone Controller QR code modal, and Co-host links across all screens.
 */
(function () {
  const RoomUI = {
    attachHUD(containerSelector = '.main-header', defaultGame = 'wheel') {
      const parent = document.querySelector(containerSelector);
      if (!parent) return;

      const existing = document.getElementById('dion-room-hud');
      if (existing) existing.remove();

      const roomId = window.RoomManager ? window.RoomManager.getRoom() : 'DION1';

      const hud = document.createElement('div');
      hud.id = 'dion-room-hud';
      hud.style.cssText = `
        display: flex; align-items: center; gap: 8px;
        font-family: 'Montserrat', sans-serif;
      `;
      hud.innerHTML = `
        <div style="
          display: flex; align-items: center; gap: 8px;
          background: rgba(14, 18, 27, 0.85); border: 1px solid rgba(212, 175, 55, 0.4);
          padding: 6px 12px; border-radius: 9999px; font-size: 12.5px;
        ">
          <span style="color: #94a3b8; font-weight: 700; font-size: 11px; letter-spacing: 1px;">ROOM:</span>
          <span id="hud-room-code" style="color: #f7e07d; font-weight: 900; letter-spacing: 1.5px; font-family: 'Cinzel', serif;">
            ${roomId}
          </span>
          <button id="btn-switch-room" title="Change Room Code" style="
            background: rgba(255,255,255,0.08); border-radius: 4px; padding: 2px 6px;
            color: #d4af37; font-size: 11px; font-weight: 700; cursor: pointer; border: 1px solid rgba(212,175,55,0.3);
          ">EDIT</button>
        </div>

        <button id="btn-open-qr" style="
          display: flex; align-items: center; gap: 6px;
          background: linear-gradient(135deg, #d97706, #b45309);
          border: 1px solid #facc15;
          padding: 6px 14px; border-radius: 9999px;
          color: #ffffff; font-size: 12px; font-weight: 800; cursor: pointer;
          box-shadow: 0 0 12px rgba(234, 179, 8, 0.35);
        ">
          📱 PHONE CONTROLLER
        </button>

        <a id="btn-cohost-hud" href="${window.RoomManager ? window.RoomManager.getCohostJoinUrl(defaultGame) : '/cohost-join.html?room=' + roomId}" target="_blank" style="
          display: flex; align-items: center; gap: 5px;
          background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 6px 12px; border-radius: 9999px;
          color: #cbd5e1; font-size: 11.5px; font-weight: 700; text-decoration: none;
        ">
          🎙️ Co-Host Desk
        </a>
      `;

      parent.appendChild(hud);

      // Event handlers
      document.getElementById('btn-switch-room')?.addEventListener('click', () => {
        const input = prompt('Enter new Room Code (e.g. DION1, STREAM99):', roomId);
        if (input && input.trim()) {
          const clean = input.trim().toUpperCase();
          if (window.RoomManager) window.RoomManager.setRoom(clean);
          document.getElementById('hud-room-code').textContent = clean;
          RoomUI.showRoomCreatedModal(defaultGame, clean);
        }
      });

      document.getElementById('btn-open-qr')?.addEventListener('click', () => {
        RoomUI.showRoomCreatedModal(defaultGame);
      });

      window.addEventListener('roomchange', (e) => {
        const el = document.getElementById('hud-room-code');
        if (el && e.detail && e.detail.roomId) {
          el.textContent = e.detail.roomId;
        }
      });
    },

    getGameName(game = 'wheel') {
      const titles = {
        'wheel': 'WHEEL OF FORTUNE',
        'trivia': 'STREAM TRIVIA',
        'jeopardy': 'JEOPARDY TRIVIA',
        'word-reveal': 'WORD REVEAL',
        'speak-out': 'DIONLYONEE SPEAK OUT',
        'charades': 'STREAM CHARADES',
        'hangman': 'SLIME HANGMAN',
        'most-likely': 'MOST LIKELY TO',
        'what-would-you-do': 'WHAT WOULD YOU DO',
        'hot-take': 'HOT TAKE HEAVYWEIGHT',
        'emoji-guess': 'EMOJI GUESS',
        'unscramble-it': 'UNSCRAMBLE IT',
        'who-dis': 'WHO DIS',
        'who-would-you-pick': 'WHO WOULD YOU PICK'
      };
      return titles[game] || game.toUpperCase();
    },

    showRoomCreatedModal(game = 'wheel', customRoom = null) {
      const roomId = customRoom || (window.RoomManager ? window.RoomManager.getRoom() : 'DION1');
      const gameTitle = this.getGameName(game);
      
      const controllerUrl = window.RoomManager && typeof window.RoomManager.getControllerUrl === 'function'
        ? window.RoomManager.getControllerUrl(game)
        : `${window.location.origin}/remote.html?room=${encodeURIComponent(roomId)}&game=${encodeURIComponent(game)}`;

      const cohostUrl = window.RoomManager && typeof window.RoomManager.getCohostJoinUrl === 'function'
        ? window.RoomManager.getCohostJoinUrl(game)
        : `${window.location.origin}/cohost-join.html?room=${encodeURIComponent(roomId)}`;

      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=1&data=${encodeURIComponent(controllerUrl)}`;

      let modal = document.getElementById('dion-room-created-modal');
      if (modal) modal.remove();

      modal = document.createElement('div');
      modal.id = 'dion-room-created-modal';
      modal.style.cssText = `
        position: fixed; inset: 0; z-index: 999999;
        background: rgba(3, 7, 18, 0.92); backdrop-filter: blur(14px);
        display: flex; align-items: center; justify-content: center;
        padding: 16px; font-family: 'Montserrat', sans-serif;
      `;

      modal.innerHTML = `
        <div style="
          background: #0f172a; border: 2px solid #facc15;
          border-radius: 24px; max-width: 480px; width: 100%; padding: 28px 24px;
          box-shadow: 0 0 50px rgba(250, 204, 21, 0.35); text-align: center;
          position: relative; color: #ffffff; max-height: 92vh; overflow-y: auto;
        ">
          <button id="btn-close-created-modal" style="
            position: absolute; top: 16px; right: 16px;
            background: rgba(255,255,255,0.1); border: none; border-radius: 50%;
            width: 34px; height: 34px; color: #ffffff; font-size: 16px; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
          ">✕</button>

          <!-- HEADER -->
          <div style="font-size: 32px; margin-bottom: 4px;">🎉</div>
          <h2 style="font-family: 'Cinzel', serif; font-size: 24px; font-weight: 900; color: #facc15; letter-spacing: 1.5px; margin: 0 0 4px 0;">
            ROOM CREATED
          </h2>
          <div style="font-size: 11px; font-weight: 800; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase;">
            GAME SHOW PRODUCTION
          </div>

          <!-- GAME & ROOM CODE PILL -->
          <div style="background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; padding: 14px; margin: 16px 0 14px 0;">
            <div style="font-size: 10px; font-weight: 800; color: #94a3b8; letter-spacing: 1.5px; text-transform: uppercase;">
              GAME:
            </div>
            <div style="font-size: 15px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px; margin: 2px 0 10px 0;">
              ${gameTitle}
            </div>

            <div style="font-size: 10px; font-weight: 800; color: #facc15; letter-spacing: 1.5px; text-transform: uppercase;">
              ROOM CODE:
            </div>
            <div style="font-family: 'Space Grotesk', monospace; font-size: 36px; font-weight: 900; color: #facc15; letter-spacing: 3px; text-shadow: 0 0 16px rgba(250, 204, 21, 0.6); margin: 2px 0;">
              ${roomId}
            </div>
          </div>

          <!-- PHONE CONTROLLER SECTION -->
          <div style="background: rgba(250, 204, 21, 0.08); border: 1.5px dashed rgba(250, 204, 21, 0.4); border-radius: 18px; padding: 16px 12px; margin-bottom: 16px;">
            <div style="font-size: 13px; font-weight: 900; color: #ffffff; letter-spacing: 1px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span>📱</span> USE YOUR PHONE AS A CONTROLLER
            </div>

            <!-- QR CODE CANVAS / IMAGE -->
            <div style="
              display: inline-block; padding: 12px; background: #ffffff;
              border-radius: 14px; box-shadow: 0 6px 24px rgba(0,0,0,0.6); margin-bottom: 10px;
            ">
              <canvas id="controllerQrCanvas" width="200" height="200" style="display: none; width: 200px; height: 200px; border-radius: 6px;"></canvas>
              <img id="controllerQrImg" src="${qrApiUrl}" alt="Host Phone Controller QR Code" style="width: 200px; height: 200px; display: block; border-radius: 6px;" />
            </div>

            <div style="font-size: 11px; font-weight: 800; color: #facc15; letter-spacing: 1px; text-transform: uppercase;">
              SCAN THIS QR CODE WITH YOUR PHONE
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 3px;">
              Direct connection • No password needed • Works on iOS & Android
            </div>
          </div>

          <!-- DIRECT ACTIONS -->
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <button id="btn-copy-remote-link" style="
              flex: 1; background: linear-gradient(135deg, #facc15, #ca8a04); color: #000;
              font-weight: 900; border: none; border-radius: 10px; padding: 12px; font-size: 12px;
              cursor: pointer; box-shadow: 0 4px 14px rgba(250, 204, 21, 0.3);
            ">
              📋 COPY CONTROLLER LINK
            </button>
            <a href="${controllerUrl}" target="_blank" style="
              background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);
              color: #ffffff; text-decoration: none; font-weight: 800; border-radius: 10px;
              padding: 12px 14px; font-size: 12px; display: flex; align-items: center; justify-content: center;
            ">
              OPEN ↗
            </a>
          </div>

          <!-- COHOST LINK FOR STREAM PARTNER -->
          <div style="font-size: 11.5px; color: #94a3b8; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <span>Cohost joining? Give them code <b style="color: #facc15;">${roomId}</b> or </span>
            <a href="${cohostUrl}" target="_blank" style="color: #38bdf8; font-weight: 800; text-decoration: underline;">Open Co-Host Desk ↗</a>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Try local pure JS QR canvas render first for instant offline speed
      try {
        const canvas = document.getElementById('controllerQrCanvas');
        const img = document.getElementById('controllerQrImg');
        if (typeof QRCode !== 'undefined' && QRCode.toCanvas && canvas) {
          QRCode.toCanvas(canvas, controllerUrl, {
            width: 200,
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' }
          }, (err) => {
            if (!err) {
              canvas.style.display = 'block';
              if (img) img.style.display = 'none';
            }
          });
        }
      } catch (e) {}

      document.getElementById('btn-close-created-modal')?.addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });

      document.getElementById('btn-copy-remote-link')?.addEventListener('click', () => {
        const btn = document.getElementById('btn-copy-remote-link');
        navigator.clipboard.writeText(controllerUrl).then(() => {
          if (btn) btn.textContent = '✅ COPIED TO CLIPBOARD!';
          setTimeout(() => {
            if (btn) btn.textContent = '📋 COPY CONTROLLER LINK';
          }, 2000);
        }).catch(() => {
          prompt('Copy Controller URL for your phone:', controllerUrl);
        });
      });
    },

    showQRModal(game = 'wheel') {
      this.showRoomCreatedModal(game);
    }
  };

  window.RoomUI = RoomUI;
})();
