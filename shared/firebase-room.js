/**
 * Dionlyonee Playground - Firebase / Real-Time Room Sync
 * Coordinates state and realtime events across Host, Co-Host, Live Stage, and Phone screens.
 */
(function () {
  class FirebaseRoom {
    constructor() {
      this.roomId = window.RoomManager ? window.RoomManager.getRoom() : 'DION1';
      this.gameType = 'wheel';
      this.role = 'guest';
      this.ws = null;
      this.channel = null;
      this.stateCallbacks = [];
      this.buzzerCallbacks = [];
      this.spinCallbacks = [];
      this.soundCallbacks = [];
      this.actionCallbacks = [];
      this.pollTimer = null;
      this.lastSyncTimestamp = 0;
      this.lastSoundTimestamp = 0;
      this.lastActionTimestamp = 0;

      this.initBroadcastChannel();
      this.initWebSocket();
      this.startHttpPolling();

      window.addEventListener('roomchange', (e) => {
        if (e.detail && e.detail.roomId) {
          this.switchRoom(e.detail.roomId);
        }
      });
    }

    initBroadcastChannel() {
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          this.channel = new BroadcastChannel(`dionlyonee_room_${this.roomId}`);
          this.channel.onmessage = (e) => {
            this.handleIncoming(e.data);
          };
        } catch (e) {}
      }
    }

    initWebSocket() {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
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
            this.handleIncoming(data);
          } catch (e) {}
        };

        this.ws.onclose = () => {
          setTimeout(() => this.initWebSocket(), 3000);
        };
      } catch (e) {}
    }

    startHttpPolling() {
      if (this.pollTimer) clearInterval(this.pollTimer);
      this.pollTimer = setInterval(() => {
        this.fetchHttpState();
      }, 1500);
    }

    async fetchHttpState() {
      try {
        const res = await fetch(`/api/rooms/${this.roomId}`);
        if (!res.ok) return;
        const json = await res.json();
        if (json && json.room) {
          if (json.room.state && json.room.lastUpdate > this.lastSyncTimestamp) {
            this.lastSyncTimestamp = json.room.lastUpdate;
            this.triggerStateCallbacks(json.room.state);
          }
          if (json.room.lastSound && json.room.lastSound.timestamp > this.lastSoundTimestamp) {
            this.lastSoundTimestamp = json.room.lastSound.timestamp;
            this.triggerSoundCallbacks(json.room.lastSound.sound, json.room.lastSound);
          }
          if (json.room.lastAction && json.room.lastAction.timestamp > this.lastActionTimestamp) {
            this.lastActionTimestamp = json.room.lastAction.timestamp;
            this.triggerActionCallbacks(json.room.lastAction);
          }
        }
      } catch (e) {}
    }

    init(roomId, gameType = 'wheel') {
      if (gameType) this.gameType = gameType;
      if (roomId && roomId.toUpperCase() !== this.roomId) {
        this.switchRoom(roomId);
      } else {
        this.fetchHttpState();
      }
    }

    onStateChange(callback) {
      return this.onState(callback);
    }

    switchRoom(newRoomId) {
      this.roomId = newRoomId.toUpperCase();
      this.lastSyncTimestamp = 0;
      this.lastSoundTimestamp = 0;
      if (this.channel) {
        try { this.channel.close(); } catch (e) {}
      }
      this.initBroadcastChannel();
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'JOIN_ROOM',
          roomId: this.roomId,
          role: this.role,
          gameType: this.gameType
        }));
      }
      this.fetchHttpState();
    }

    handleIncoming(data) {
      if (!data) return;
      if (data.type === 'SYNC_STATE' || data.type === 'ROOM_STATE') {
        if (data.state) {
          this.triggerStateCallbacks(data.state);
        }
        if (data.sound) {
          this.triggerSoundCallbacks(data.sound, data);
        }
      } else if (data.type === 'PLAY_SOUND' || data.type === 'SOUND') {
        const sound = data.sound || data.name;
        if (sound) {
          this.triggerSoundCallbacks(sound, data);
        }
      } else if (data.type === 'COHOST_BUZZ' || data.type === 'BUZZER') {
        this.buzzerCallbacks.forEach(cb => cb(data));
      } else if (data.type === 'WHEEL_SPIN') {
        this.spinCallbacks.forEach(cb => cb(data));
      } else if (data.type === 'HOST_ACTION' || data.type === 'ACTION') {
        this.triggerActionCallbacks(data);
      }
    }

    broadcastState(state, sound = null) {
      this.lastSyncTimestamp = Date.now();
      const payload = {
        type: 'SYNC_STATE',
        roomId: this.roomId,
        gameType: this.gameType,
        state,
        sound,
        timestamp: Date.now()
      };

      if (this.channel) {
        try { this.channel.postMessage(payload); } catch (e) {}
      }
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try { this.ws.send(JSON.stringify(payload)); } catch (e) {}
      }

      fetch(`/api/rooms/${this.roomId}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameType: this.gameType, state, sound })
      }).catch(() => {});
    }

    sendBuzzer(playerName) {
      const payload = {
        type: 'COHOST_BUZZ',
        roomId: this.roomId,
        player: playerName || 'Player Phone',
        timestamp: Date.now()
      };

      if (this.channel) {
        try { this.channel.postMessage(payload); } catch (e) {}
      }
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try { this.ws.send(JSON.stringify(payload)); } catch (e) {}
      }

      fetch(`/api/rooms/${this.roomId}/buzz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: playerName })
      }).catch(() => {});
    }

    sendWheelSpin(spinData) {
      const payload = {
        type: 'WHEEL_SPIN',
        roomId: this.roomId,
        ...spinData,
        timestamp: Date.now()
      };

      if (this.channel) {
        try { this.channel.postMessage(payload); } catch (e) {}
      }
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try { this.ws.send(JSON.stringify(payload)); } catch (e) {}
      }

      fetch(`/api/rooms/${this.roomId}/spin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spinData)
      }).catch(() => {});
    }

    broadcastSound(soundName, meta = {}) {
      if (!soundName) return;
      this.lastSoundTimestamp = Date.now();
      const payload = {
        type: 'PLAY_SOUND',
        roomId: this.roomId,
        gameType: this.gameType,
        sound: soundName,
        meta: meta || {},
        timestamp: Date.now()
      };

      if (this.channel) {
        try { this.channel.postMessage(payload); } catch (e) {}
      }
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try { this.ws.send(JSON.stringify(payload)); } catch (e) {}
      }

      fetch(`/api/rooms/${this.roomId}/sound`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sound: soundName, meta })
      }).catch(() => {});
    }

    onSound(callback) {
      if (typeof callback === 'function') {
        this.soundCallbacks.push(callback);
      }
      return () => {
        const idx = this.soundCallbacks.indexOf(callback);
        if (idx !== -1) this.soundCallbacks.splice(idx, 1);
      };
    }

    triggerSoundCallbacks(sound, data = {}) {
      if (!sound) return;
      this.soundCallbacks.forEach(cb => {
        try { cb(sound, data); } catch (e) { console.warn(e); }
      });
    }

    onState(callback) {
      this.stateCallbacks.push(callback);
    }

    onBuzzer(callback) {
      this.buzzerCallbacks.push(callback);
    }

    onSpin(callback) {
      this.spinCallbacks.push(callback);
    }

    onAction(callback) {
      if (typeof callback === 'function') {
        this.actionCallbacks.push(callback);
      }
      return () => {
        const idx = this.actionCallbacks.indexOf(callback);
        if (idx !== -1) this.actionCallbacks.splice(idx, 1);
      };
    }

    sendAction(action, payload = {}) {
      const actionData = {
        type: 'HOST_ACTION',
        action,
        payload,
        timestamp: Date.now()
      };

      if (this.channel) {
        try { this.channel.postMessage(actionData); } catch (e) {}
      }
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try { this.ws.send(JSON.stringify(actionData)); } catch (e) {}
      }

      fetch(`/api/rooms/${this.roomId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionData)
      }).catch(() => {});
    }

    triggerActionCallbacks(data) {
      if (!data) return;
      this.actionCallbacks.forEach(cb => {
        try { cb(data); } catch (e) { console.warn(e); }
      });
    }

    triggerStateCallbacks(state) {
      this.stateCallbacks.forEach(cb => {
        try { cb(state); } catch (e) {}
      });
    }
  }

  window.FirebaseRoom = new FirebaseRoom();
  window.RoomSync = window.FirebaseRoom; // Compatibility alias
})();
