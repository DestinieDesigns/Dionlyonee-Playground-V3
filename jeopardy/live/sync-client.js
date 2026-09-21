// Dionlyonee Stream Playground - Pure Vanilla JS Multi-Device Sync Client
(function (global) {
  'use strict';

  const HOST_PASSCODE_FALLBACK = 'Brown123';

  class RoomSyncClient {
    constructor() {
      this.gameType = 'wheel';
      this.role = 'guest'; // 'host' | 'live' | 'cohost'
      this.roomId = this.initRoomId();
      this.ws = null;
      this.listeners = [];
      this.spinListeners = [];
      this.buzzerListeners = [];
      this.soundListeners = [];
      this.actionListeners = [];
      this.lastTimestamp = 0;
      this.lastSpinTimestamp = 0;
      this.lastBuzzerTimestamp = 0;
      this.lastSoundTimestamp = 0;
      this.lastActionTimestamp = 0;
      this.pollInterval = null;
      this.heartbeatInterval = null;
      this.broadcastChannel = null;
      this.connectedClientsCount = 1;
      this.isOnline = false;

      this.initBroadcastChannel();
      this.initWebSocket();
      this.startHttpPolling();
      this.startHeartbeat();
    }

    generateRoomCode() {
      const prefixes = ['WHEEL', 'SPIN', 'DION', 'PLAY', 'GOLD', 'STAR', 'LUCKY', 'VIBE'];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const num = Math.floor(10 + Math.random() * 90); // 2-digit number for easy typing
      return `${prefix}${num}`;
    }

    initRoomId() {
      const urlParams = new URLSearchParams(window.location.search);
      const urlRoom = urlParams.get('room');
      const isReload = (function () {
        try {
          const navEntries = performance.getEntriesByType('navigation');
          if (navEntries.length > 0) {
            return navEntries[0].type === 'reload';
          }
          return performance.navigation && performance.navigation.type === 1;
        } catch (e) {
          return false;
        }
      })();

      const isHostPage = window.location.pathname.includes('host') || window.location.pathname === '/' || window.location.pathname.includes('index');

      // Requirement: On host reload or fresh launch, change the room code so every session has a fresh code!
      if (isReload && isHostPage) {
        const freshCode = this.generateRoomCode();
        this.updateUrlRoom(freshCode);
        sessionStorage.setItem('dion_current_room', freshCode);
        return freshCode;
      }

      // If room is specified in URL query (e.g. from phone QR / link / join), use it!
      if (urlRoom && urlRoom.trim()) {
        const clean = urlRoom.trim().toUpperCase();
        sessionStorage.setItem('dion_current_room', clean);
        return clean;
      }

      // Otherwise generate a fresh room code
      const freshCode = this.generateRoomCode();
      this.updateUrlRoom(freshCode);
      sessionStorage.setItem('dion_current_room', freshCode);
      return freshCode;
    }

    updateUrlRoom(code) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('room', code);
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
    }

    initBroadcastChannel() {
      if (this.broadcastChannel) {
        try {
          this.broadcastChannel.close();
        } catch (e) {}
      }

      try {
        if ('BroadcastChannel' in window) {
          this.broadcastChannel = new BroadcastChannel(`dion_room_${this.roomId}`);
          this.broadcastChannel.onmessage = (e) => {
            const data = e.data;
            if (!data) return;
            if (data.type === 'ROOM_STATE') {
              this.notify(data.state, data.sound, data.timestamp);
            } else if (data.type === 'PLAY_SOUND' || data.type === 'SOUND') {
              this.notifySound(data.sound || data.name, data);
            } else if (data.type === 'WHEEL_SPIN') {
              this.notifyWheelSpin(data);
            } else if (data.type === 'COHOST_BUZZ') {
              this.notifyBuzzer(data);
            } else if (data.type === 'HOST_ACTION') {
              this.notifyAction(data.action, data.payload, data.timestamp);
            }
          };
        }
      } catch (err) {
        console.warn('BroadcastChannel error:', err);
      }
    }

    setRoom(newRoomId) {
      if (!newRoomId) return;
      const clean = newRoomId.trim().toUpperCase();
      this.roomId = clean;
      sessionStorage.setItem('dion_current_room', clean);
      this.updateUrlRoom(clean);

      this.initBroadcastChannel();

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'JOIN_ROOM',
          roomId: this.roomId,
          role: this.role,
          gameType: this.gameType
        }));
      }

      this.fetchLatestState();
      this.updateRoomDisplays();
      try {
        window.dispatchEvent(new CustomEvent('roomchange', { detail: { roomId: clean } }));
      } catch (e) {}
    }

    generateNewRoom() {
      const fresh = this.generateRoomCode();
      this.setRoom(fresh);
      return fresh;
    }

    initWebSocket() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        if (this.ws) {
          try { this.ws.close(); } catch (e) {}
        }

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.isOnline = true;
          this.updateConnectionStatusUI();
          this.ws.send(JSON.stringify({
            type: 'JOIN_ROOM',
            roomId: this.roomId,
            role: this.role,
            gameType: this.gameType
          }));
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'ROOM_STATE' && (data.roomId === this.roomId || !data.roomId)) {
              this.notify(data.state, data.sound, data.timestamp);
            } else if ((data.type === 'PLAY_SOUND' || data.type === 'SOUND') && (data.roomId === this.roomId || !data.roomId)) {
              this.notifySound(data.sound || data.name, data);
            } else if (data.type === 'WHEEL_SPIN' && (data.roomId === this.roomId || !data.roomId)) {
              this.notifyWheelSpin(data);
            } else if (data.type === 'COHOST_BUZZ' && (data.roomId === this.roomId || !data.roomId)) {
              this.notifyBuzzer(data);
            } else if (data.type === 'HOST_ACTION' && (data.roomId === this.roomId || !data.roomId)) {
              this.notifyAction(data.action, data.payload, data.timestamp);
            } else if (data.type === 'PONG') {
              this.isOnline = true;
              this.updateConnectionStatusUI();
            }
          } catch (e) {
            console.warn('[Sync] WS message error:', e);
          }
        };

        this.ws.onerror = () => {
          this.isOnline = false;
          this.updateConnectionStatusUI();
        };

        this.ws.onclose = () => {
          this.isOnline = false;
          this.updateConnectionStatusUI();
          setTimeout(() => {
            this.initWebSocket();
          }, 3000);
        };
      } catch (err) {
        console.warn('[Sync] WS init error:', err);
      }
    }

    startHeartbeat() {
      if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'PING' }));
        }
      }, 10000);
    }

    startHttpPolling() {
      if (this.pollInterval) clearInterval(this.pollInterval);
      this.pollInterval = setInterval(() => {
        this.fetchLatestState();
      }, 1000);
      this.fetchLatestState();
    }

    async fetchLatestState() {
      try {
        const res = await fetch(`/api/rooms/${this.roomId}?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.room) {
            this.isOnline = true;
            if (typeof data.connectedCount === 'number') {
              this.connectedClientsCount = Math.max(1, data.connectedCount);
            }
            this.updateConnectionStatusUI();

            const r = data.room;

            // 1. Sync State
            if (r.state && (!this.lastTimestamp || r.lastUpdate > this.lastTimestamp)) {
              this.notify(r.state, null, r.lastUpdate);
            }

            // 2. Sync Wheel Spin (for phones/devices that missed WebSocket)
            if (r.lastSpin && r.lastSpin.timestamp && r.lastSpin.timestamp > this.lastSpinTimestamp) {
              this.lastSpinTimestamp = r.lastSpin.timestamp;
              // Only fire if the spin happened recently (< 6 seconds ago)
              if (Date.now() - r.lastSpin.timestamp < 6000) {
                this.notifyWheelSpin(r.lastSpin);
              }
            }

            // 3. Sync Buzzer
            if (r.lastBuzzer && r.lastBuzzer.timestamp && r.lastBuzzer.timestamp > this.lastBuzzerTimestamp) {
              this.lastBuzzerTimestamp = r.lastBuzzer.timestamp;
              this.notifyBuzzer(r.lastBuzzer);
            }

            // 4. Sync Sound
            if (r.lastSound && r.lastSound.timestamp && r.lastSound.timestamp > this.lastSoundTimestamp) {
              this.lastSoundTimestamp = r.lastSound.timestamp;
              this.notifySound(r.lastSound.sound, r.lastSound);
            }

            // 5. Sync Host Action (Phone controller triggers)
            if (r.lastAction && r.lastAction.timestamp && r.lastAction.timestamp > this.lastActionTimestamp) {
              this.lastActionTimestamp = r.lastAction.timestamp;
              if (Date.now() - r.lastAction.timestamp < 10000) {
                this.notifyAction(r.lastAction.action, r.lastAction.payload, r.lastAction.timestamp);
              }
            }
          }
        }
      } catch (e) {
        // Fallback silently during brief network blips
      }
    }

    sendState(state, sound) {
      const now = Date.now();
      this.lastTimestamp = now;

      // 1. WebSocket Broadcast
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'UPDATE_STATE',
          roomId: this.roomId,
          gameType: this.gameType,
          state: state,
          sound: sound || null,
          timestamp: now
        }));
      }

      // 2. BroadcastChannel (same browser tabs)
      if (this.broadcastChannel) {
        try {
          this.broadcastChannel.postMessage({
            type: 'ROOM_STATE',
            roomId: this.roomId,
            gameType: this.gameType,
            state: state,
            sound: sound || null,
            timestamp: now
          });
        } catch (e) {}
      }

      // 3. HTTP Server Persistence
      fetch(`/api/rooms/${this.roomId}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: state,
          gameType: this.gameType,
          sound: sound || null
        })
      }).catch((e) => console.warn('[Sync] HTTP update error:', e));

      // 4. Session storage backup scoped to this room
      try {
        sessionStorage.setItem(`dion_state_${this.roomId}`, JSON.stringify(state));
      } catch (e) {}
    }

    broadcastState(state, sound) {
      this.sendState(state, sound);
    }

    sendWheelSpin(spinData) {
      const now = Date.now();
      this.lastSpinTimestamp = now;
      const payload = {
        type: 'WHEEL_SPIN',
        roomId: this.roomId,
        timestamp: now,
        ...spinData
      };

      // 1. WebSocket
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(payload));
      }

      // 2. BroadcastChannel
      if (this.broadcastChannel) {
        try {
          this.broadcastChannel.postMessage(payload);
        } catch (e) {}
      }

      // 3. HTTP Server endpoint (guarantees mobile phone receives it even on unstable WebSocket)
      fetch(`/api/rooms/${this.roomId}/spin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch((e) => console.warn('[Sync] HTTP spin error:', e));
    }

    sendBuzzer(extraData = {}) {
      const now = Date.now();
      this.lastBuzzerTimestamp = now;
      const payload = {
        type: 'COHOST_BUZZ',
        roomId: this.roomId,
        timestamp: now,
        ...extraData
      };

      // 1. WebSocket
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(payload));
      }

      // 2. BroadcastChannel
      if (this.broadcastChannel) {
        try {
          this.broadcastChannel.postMessage(payload);
        } catch (e) {}
      }

      // 3. HTTP Server endpoint
      fetch(`/api/rooms/${this.roomId}/buzz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch((e) => console.warn('[Sync] HTTP buzz error:', e));
    }

    onStateChange(fn) {
      this.listeners.push(fn);
    }

    onWheelSpin(fn) {
      this.spinListeners.push(fn);
    }

    onBuzzer(fn) {
      this.buzzerListeners.push(fn);
    }

    onSound(fn) {
      if (typeof fn === 'function') {
        this.soundListeners.push(fn);
      }
      return () => {
        const idx = this.soundListeners.indexOf(fn);
        if (idx !== -1) this.soundListeners.splice(idx, 1);
      };
    }

    broadcastSound(sound, meta = {}) {
      if (!sound) return;
      const now = Date.now();
      this.lastSoundTimestamp = now;

      const payload = {
        type: 'PLAY_SOUND',
        roomId: this.roomId,
        gameType: this.gameType,
        sound,
        meta: meta || {},
        timestamp: now
      };

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try { this.ws.send(JSON.stringify(payload)); } catch (e) {}
      }

      if (this.broadcastChannel) {
        try { this.broadcastChannel.postMessage(payload); } catch (e) {}
      }

      fetch(`/api/rooms/${this.roomId}/sound`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sound, meta })
      }).catch((e) => console.warn('[Sync] HTTP sound broadcast error:', e));
    }

    sendSound(sound, meta = {}) {
      this.broadcastSound(sound, meta);
    }

    notify(state, sound, timestamp) {
      if (timestamp && timestamp < this.lastTimestamp) return;
      if (timestamp) this.lastTimestamp = timestamp;

      this.listeners.forEach((fn) => {
        try {
          fn(state, sound);
        } catch (e) {
          console.error('[Sync] listener error:', e);
        }
      });

      if (sound) {
        this.notifySound(sound, { state, timestamp });
      }
    }

    notifySound(sound, data) {
      if (!sound) return;
      this.soundListeners.forEach((fn) => {
        try {
          fn(sound, data);
        } catch (e) {
          console.error('[Sync] sound listener error:', e);
        }
      });
    }

    notifyWheelSpin(data) {
      this.spinListeners.forEach((fn) => {
        try {
          fn(data);
        } catch (e) {
          console.error('[Sync] spin listener error:', e);
        }
      });
    }

    notifyBuzzer(data) {
      this.buzzerListeners.forEach((fn) => {
        try {
          fn(data);
        } catch (e) {
          console.error('[Sync] buzzer listener error:', e);
        }
      });
    }

    onAction(fn) {
      if (typeof fn === 'function') {
        this.actionListeners.push(fn);
      }
      return () => {
        const idx = this.actionListeners.indexOf(fn);
        if (idx !== -1) this.actionListeners.splice(idx, 1);
      };
    }

    notifyAction(action, payload, timestamp) {
      this.actionListeners.forEach((fn) => {
        try {
          fn(action, payload, timestamp);
        } catch (e) {
          console.error('[Sync] action listener error:', e);
        }
      });
    }

    sendAction(action, payload = {}) {
      if (!action) return;
      const now = Date.now();
      this.lastActionTimestamp = now;

      const packet = {
        type: 'HOST_ACTION',
        roomId: this.roomId,
        gameType: this.gameType,
        action,
        payload,
        timestamp: now
      };

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try { this.ws.send(JSON.stringify(packet)); } catch (e) {}
      }

      if (this.broadcastChannel) {
        try { this.broadcastChannel.postMessage(packet); } catch (e) {}
      }

      fetch(`/api/rooms/${this.roomId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      }).catch((e) => console.warn('[Sync] HTTP action error:', e));
    }

    // --- HOST SECURITY ---

    isHostUnlocked() {
      try {
        const isSolo = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('singleplayer') === 'true';
        if (isSolo) return true;
      } catch (e) {}
      if (typeof window !== 'undefined' && window.HostAuth) {
        return window.HostAuth.isUnlocked();
      }
      try {
        return sessionStorage.getItem('dion_host_authorized_v2') === 'Brown123' ||
               localStorage.getItem('dion_host_authorized_v2') === 'Brown123';
      } catch (e) {
        return false;
      }
    }

    async verifyHostPasscode(passcode) {
      if (!passcode) return false;
      const clean = passcode.trim();
      if (clean === 'Brown123') {
        try {
          sessionStorage.setItem('dion_host_authorized_v2', 'Brown123');
          localStorage.setItem('dion_host_authorized_v2', 'Brown123');
        } catch (e) {}
        if (typeof window !== 'undefined' && window.HostAuth) {
          window.HostAuth.unlock(clean, true);
        }
        return true;
      }
      return false;
    }

    lockHost() {
      if (typeof window !== 'undefined' && window.HostAuth) {
        window.HostAuth.lock();
      } else {
        try {
          sessionStorage.removeItem('dion_host_authorized_v2');
          localStorage.removeItem('dion_host_authorized_v2');
        } catch (e) {}
      }
    }

    // --- UI HELPER: ROOM HUD & PHONE CONNECT MODAL ---

    attachRoomHUD(containerSelector) {
      const container = document.querySelector(containerSelector || '.main-header, .host-header, .live-header, .cohost-header');
      if (!container) return;

      const existingHud = document.getElementById('dion-room-hud');
      if (existingHud) existingHud.remove();

      const hud = document.createElement('div');
      hud.id = 'dion-room-hud';
      hud.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(250, 204, 21, 0.4);
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 800;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        margin: 4px 8px;
        z-index: 999;
      `;

      hud.innerHTML = `
        <span style="display: flex; align-items: center; gap: 4px;">
          <span id="dion-status-dot" style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e; display: inline-block; box-shadow: 0 0 8px #22c55e;"></span>
          <span style="color: #facc15; font-weight: 900; letter-spacing: 0.5px;">ROOM:</span>
        </span>
        <span id="dion-room-code-display" style="font-family: 'Space Grotesk', monospace; color: #ffffff; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; background: rgba(0,0,0,0.5); padding: 2px 8px; border-radius: 6px; border: 1px solid rgba(250, 204, 21, 0.3);">${this.roomId}</span>
        <button id="dion-btn-new-room" title="Generate New Room Code for this session" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #facc15; cursor: pointer; font-size: 10px; padding: 3px 7px; border-radius: 5px; font-weight: 800;">🎲 New</button>
        <button id="dion-btn-change-room" title="Enter / Switch Room Code" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #cbd5e1; cursor: pointer; font-size: 10px; padding: 3px 7px; border-radius: 5px; font-weight: 800;">✏️ Join</button>
        <button id="dion-btn-phone-connect" title="Connect Phone / QR Scan" style="background: linear-gradient(135deg, #059669, #047857); border: 1px solid #10b981; color: #ffffff; cursor: pointer; font-size: 10px; padding: 4px 10px; border-radius: 5px; font-weight: 900; letter-spacing: 0.5px; box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);">📱 Phone Sync</button>
      `;

      container.appendChild(hud);

      document.getElementById('dion-btn-new-room')?.addEventListener('click', () => {
        const fresh = this.generateNewRoom();
        alert(`🎉 New Room Created: ${fresh}!\n\nAll screens and phones entering "${fresh}" are now connected!`);
      });

      document.getElementById('dion-btn-change-room')?.addEventListener('click', () => {
        const custom = prompt('Enter Room Code to join (e.g. WHEEL28, SPIN83):', this.roomId);
        if (custom && custom.trim()) {
          this.setRoom(custom.trim());
        }
      });

      document.getElementById('dion-btn-phone-connect')?.addEventListener('click', () => {
        this.showPhoneConnectModal();
      });
    }

    updateRoomDisplays() {
      const display = document.getElementById('dion-room-code-display');
      if (display) display.textContent = this.roomId;

      const hubInput = document.getElementById('hub-room-input');
      if (hubInput) hubInput.value = this.roomId;

      const hubBadge = document.getElementById('hub-room-badge');
      if (hubBadge) hubBadge.textContent = `ROOM: ${this.roomId}`;
    }

    updateConnectionStatusUI() {
      const dot = document.getElementById('dion-status-dot');
      if (dot) {
        if (!navigator.onLine) {
          dot.style.background = '#ef4444';
          dot.style.boxShadow = '0 0 8px #ef4444';
          dot.title = '🔴 OFFLINE - Network Disconnected';
        } else if (this.isOnline) {
          dot.style.background = '#22c55e';
          dot.style.boxShadow = '0 0 8px #22c55e';
          dot.title = '🟢 ONLINE - Realtime Firebase / Live Sync Connected';
        } else {
          dot.style.background = '#eab308';
          dot.style.boxShadow = '0 0 8px #eab308';
          dot.title = '🟡 STANDBY - Local BroadcastChannel / Polling Active';
        }
      }
    }

    showPhoneConnectModal() {
      const existing = document.getElementById('phone-connect-modal');
      if (existing) existing.remove();

      const origin = window.location.origin;
      const liveUrl = `${origin}/wheel-live.html?room=${this.roomId}`;
      const hostUrl = `${origin}/wheel-host.html?room=${this.roomId}`;
      const cohostUrl = `${origin}/wheel-cohost.html?room=${this.roomId}`;
      const currentUrl = `${origin}${window.location.pathname}?room=${this.roomId}`;
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`;

      const modal = document.createElement('div');
      modal.id = 'phone-connect-modal';
      modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(3, 7, 18, 0.94);
        backdrop-filter: blur(14px);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      `;

      modal.innerHTML = `
        <div style="
          background: #0b1322;
          border: 2px solid #eab308;
          border-radius: 20px;
          padding: 26px;
          max-width: 480px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 0 50px rgba(234, 179, 8, 0.35);
          color: #ffffff;
          font-family: 'Montserrat', sans-serif;
          max-height: 90vh;
          overflow-y: auto;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 32px;">📱</span>
              <div>
                <h2 style="font-size: 19px; font-weight: 900; color: #facc15; margin: 0; letter-spacing: 0.5px;">CONNECT ON YOUR PHONE</h2>
                <div style="font-size: 11px; color: #94a3b8;">Real-time sync between your phone and laptop</div>
              </div>
            </div>
            <button id="btn-close-phone-modal" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
          </div>

          <!-- BIG ROOM CODE DISPLAY -->
          <div style="background: rgba(234, 179, 8, 0.12); border: 2px dashed #eab308; border-radius: 14px; padding: 14px; text-align: center;">
            <div style="font-size: 11px; font-weight: 800; color: #facc15; letter-spacing: 1.5px; text-transform: uppercase;">YOUR ACTIVE ROOM CODE</div>
            <div style="font-family: 'Space Grotesk', monospace; font-size: 38px; font-weight: 900; color: #ffffff; letter-spacing: 3px; margin: 4px 0; text-shadow: 0 0 15px rgba(250, 204, 21, 0.6);">
              ${this.roomId}
            </div>
            <div style="font-size: 12px; color: #cbd5e1;">Scan the QR code below or type this room code on your phone:</div>
          </div>

          <!-- QR CODE BOX -->
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 14px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="background: #ffffff; padding: 8px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
              <img src="${qrApiUrl}" alt="Scan QR Code to join Room ${this.roomId}" width="160" height="160" style="display: block; border-radius: 4px;" />
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;">📷 Aim your phone camera to connect instantly</div>
          </div>

          <!-- DIRECT LINKS -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Direct Phone Screens:</div>
            
            <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" style="
              display: flex; justify-content: space-between; align-items: center;
              background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.12);
              padding: 9px 12px; border-radius: 8px; text-decoration: none; color: #ffffff; font-size: 12px; font-weight: 700;
            ">
              <span>📺 Live Audience Stage (for TV / Phone)</span>
              <span style="color: #facc15; font-size: 11px;">Open ↗</span>
            </a>

            <a href="${cohostUrl}" target="_blank" rel="noopener noreferrer" style="
              display: flex; justify-content: space-between; align-items: center;
              background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.12);
              padding: 9px 12px; border-radius: 8px; text-decoration: none; color: #ffffff; font-size: 12px; font-weight: 700;
            ">
              <span>🎤 Phone Co-Host & Buzzer Desk</span>
              <span style="color: #facc15; font-size: 11px;">Open ↗</span>
            </a>

            <a href="${hostUrl}" target="_blank" rel="noopener noreferrer" style="
              display: flex; justify-content: space-between; align-items: center;
              background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.12);
              padding: 9px 12px; border-radius: 8px; text-decoration: none; color: #ffffff; font-size: 12px; font-weight: 700;
            ">
              <span>🔒 Host Controls (Locked)</span>
              <span style="color: #facc15; font-size: 11px;">Open ↗</span>
            </a>
          </div>

          <div style="display: flex; gap: 8px;">
            <button id="btn-copy-phone-url" style="
              flex: 1; padding: 11px; background: linear-gradient(135deg, #facc15, #ca8a04);
              color: #000000; font-weight: 900; border: none; border-radius: 8px; font-size: 12px; cursor: pointer;
            ">
              📋 Copy Phone Room Link
            </button>
            <button id="btn-reroll-room-modal" style="
              padding: 11px 14px; background: rgba(255, 255, 255, 0.1);
              color: #facc15; font-weight: 800; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; font-size: 12px; cursor: pointer;
            ">
              🎲 New Code
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      document.getElementById('btn-close-phone-modal')?.addEventListener('click', () => modal.remove());
      
      document.getElementById('btn-copy-phone-url')?.addEventListener('click', () => {
        navigator.clipboard.writeText(currentUrl).then(() => {
          alert(`✅ Phone Room Link Copied!\n\n${currentUrl}\n\nSend this link to your phone to join Room ${this.roomId} instantly!`);
        }).catch(() => {
          prompt('Copy this room link for your phone:', currentUrl);
        });
      });

      document.getElementById('btn-reroll-room-modal')?.addEventListener('click', () => {
        this.generateNewRoom();
        modal.remove();
        this.showPhoneConnectModal();
      });
    }

    ensureHostPasscodeUnlocked(onUnlocked) {
      if (typeof window !== 'undefined' && window.HostAuth) {
        window.HostAuth.requireHostAccess(onUnlocked);
        return;
      }
      if (this.isHostUnlocked()) {
        if (onUnlocked) onUnlocked();
        return;
      }

      const existingModal = document.getElementById('host-passcode-modal');
      if (existingModal) existingModal.remove();

      const modal = document.createElement('div');
      modal.id = 'host-passcode-modal';
      modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(7, 9, 14, 0.96);
        backdrop-filter: blur(16px);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      `;

      modal.innerHTML = `
        <div style="
          background: #0e121b;
          border: 1px solid rgba(212, 175, 55, 0.5);
          border-radius: 20px;
          padding: 32px;
          max-width: 420px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          box-shadow: 0 0 40px rgba(212, 175, 55, 0.25);
          text-align: center;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
        ">
          <div style="
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: linear-gradient(135deg, #d4af37, #8c7322);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: #07090e;
            box-shadow: 0 0 25px rgba(212, 175, 55, 0.4);
          ">🔒</div>

          <div>
            <h2 style="font-family: 'Cinzel', serif; font-size: 22px; font-weight: 900; color: #fff; margin-bottom: 6px;">
              HOST CONTROL DESK
            </h2>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
              Enter the Host Passcode to unlock stream controls for Room <strong style="color: #f7e07d;">${this.roomId}</strong>.
            </p>
          </div>

          <form id="host-passcode-form" style="width: 100%; display: flex; flex-direction: column; gap: 12px;">
            <input 
              type="password" 
              id="host-passcode-input" 
              placeholder="Enter Host Passcode..." 
              required
              autocomplete="current-password"
              style="
                width: 100%;
                padding: 12px 16px;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: #fff;
                font-size: 16px;
                text-align: center;
                letter-spacing: 2px;
                outline: none;
                font-weight: 700;
              "
            />
            <div id="host-passcode-error" style="display: none; color: #ef4444; font-size: 13px; font-weight: 700;">
              ❌ Incorrect passcode. Please try again.
            </div>

            <button 
              type="submit" 
              id="host-passcode-submit"
              style="
                width: 100%;
                padding: 13px;
                background: linear-gradient(135deg, #d4af37, #8c7322);
                border: none;
                border-radius: 10px;
                color: #07090e;
                font-family: 'Cinzel', serif;
                font-size: 14px;
                font-weight: 900;
                letter-spacing: 1px;
                cursor: pointer;
                box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
              "
            >
              UNLOCK HOST CONTROLS
            </button>
          </form>

          <a href="index.html" style="font-size: 12px; color: #94a3b8; text-decoration: underline;">
            Back to Playground Hub
          </a>
        </div>
      `;

      document.body.appendChild(modal);

      const input = document.getElementById('host-passcode-input');
      const form = document.getElementById('host-passcode-form');
      const errorMsg = document.getElementById('host-passcode-error');

      if (input) input.focus();

      form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = input.value;
        const valid = await this.verifyHostPasscode(code);

        if (valid) {
          if (window.sounds) window.sounds.play('correct');
          modal.remove();
          if (onUnlocked) onUnlocked();
        } else {
          if (window.sounds) window.sounds.play('wrong');
          if (errorMsg) errorMsg.style.display = 'block';
          input.value = '';
          input.focus();
        }
      });
    }
  }

  global.RoomSync = new RoomSyncClient();

})(window);
