/**
 * Dionlyonee Playground — Live Audience Interactions & Gift Power System
 *
 * Implements Host-Controlled Audience Interactions:
 * 1. "Heart Me" sequence (9-Panel Storyboard)
 * 2. "Rose Gift" sequence (12-Panel Storyboard + Multi-Rose Tiers)
 * 3. Global Host 6-Button Matrix: ❤️ HEART, 🌹 ROSE, 👍 LIKE, 🎁 GIFT, ⭐ FOLLOW, 💬 CHAT
 * 4. Rose Queue & Accumulation System
 * 5. Phone Remote Synchronization
 */
(function () {
  'use strict';

  class HeartPowerSystem {
    constructor() {
      this.channelName = 'dionlyonee-live-interactions';
      this.streamChannelName = 'dionlyonee-stream-games';
      this.channel = null;
      this.streamChannel = null;

      // Heart state
      this.isHeartCooldown = false;
      this.heartCooldownTimer = null;
      this.heartQueue = [];

      // Rose state
      this.isRoseCooldown = false;
      this.roseCooldownTimer = null;
      this.roseQueue = []; // [{ viewer, count, time }]
      this.totalRoses = 0;

      // Live overlay elements
      this.overlayElement = null;
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      this.animFrameId = null;
      this.audioCtx = null;
      this.isLiveOverlayRunning = false;

      this.initChannels();
      this.initStorageListener();
      this.initRoomSyncListener();
    }

    /* ------------------------------------------------------------------------
       COMMUNICATION LAYER (BroadcastChannel + PostMessage + RoomSync + Storage)
       ------------------------------------------------------------------------ */
    initChannels() {
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          this.channel = new BroadcastChannel(this.channelName);
          this.channel.onmessage = (e) => this.handleMessage(e.data);
        } catch (err) {
          console.warn('HeartPower: BroadcastChannel unavailable', err);
        }

        try {
          this.streamChannel = new BroadcastChannel(this.streamChannelName);
          this.streamChannel.onmessage = (e) => this.handleMessage(e.data);
        } catch (err) {}

        try {
          const urlParams = new URLSearchParams(window.location.search);
          const curRoom = (urlParams.get('room') || sessionStorage.getItem('dion_current_room') || 'DION1').toUpperCase();
          this.roomChannel = new BroadcastChannel(`dion_room_${curRoom}`);
          this.roomChannel.onmessage = (e) => this.handleMessage(e.data);
        } catch (err) {}
      }

      window.addEventListener('message', (e) => {
        if (e.data && (e.data.source === 'dionlyonee-heart-power' || e.data.type === 'HOST_ACTION' || e.data.type === 'PLAY_SOUND')) {
          this.handleMessage(e.data);
        }
      });
    }

    initStorageListener() {
      window.addEventListener('storage', (e) => {
        if (e.key === 'dion_live_interaction_signal' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.handleMessage(data);
          } catch (err) {}
        }
      });
    }

    initRoomSyncListener() {
      // Periodic check in case RoomSync initializes slightly after
      const hookSync = () => {
        if (window.RoomSync && typeof window.RoomSync.onAction === 'function') {
          window.RoomSync.onAction((action, payload) => {
            this.handleMessage({ action, ...payload });
          });
          return true;
        }
        return false;
      };

      if (!hookSync()) {
        const interval = setInterval(() => {
          if (hookSync()) clearInterval(interval);
        }, 500);
        setTimeout(() => clearInterval(interval), 10000);
      }
    }

    broadcast(action, payload = {}) {
      const message = {
        source: 'dionlyonee-heart-power',
        type: 'HOST_ACTION',
        action,
        timestamp: Date.now(),
        ...payload
      };

      if (this.channel) {
        try { this.channel.postMessage(message); } catch (e) {}
      }
      if (this.streamChannel) {
        try { this.streamChannel.postMessage(message); } catch (e) {}
      }
      if (this.roomChannel) {
        try { this.roomChannel.postMessage(message); } catch (e) {}
      }

      // RoomSync multi-device bridge
      if (window.RoomSync && typeof window.RoomSync.sendAction === 'function') {
        try {
          window.RoomSync.sendAction(action, payload);
        } catch (e) {}
      }

      // Window hierarchy
      try {
        window.postMessage(message, '*');
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(message, '*');
        }
      } catch (e) {}

      // LocalStorage fallback
      try {
        localStorage.setItem('dion_live_interaction_signal', JSON.stringify(message));
      } catch (e) {}
    }

    handleMessage(data) {
      if (!data) return;
      const action = data.action || data.type;
      if (!action) return;

      // Soundboard sound broadcast
      if (action === 'PLAY_SOUND' && data.sound) {
        this.playSoundEffect(data.sound);
        return;
      }

      // Heart Actions
      if (action === 'VIEWER_SENT_HEART_ME') {
        this.onViewerSentHeartMe(data.viewerName || 'Audience Member');
      } else if (action === 'HEART_ME_TRIGGER' || action === 'TRIGGER_HEART_POWER') {
        this.triggerLiveAnimation(data);
      }
      // Rose Actions
      else if (action === 'VIEWER_SENT_ROSE') {
        this.onViewerSentRose(data.viewerName || 'Audience Member', Number(data.count) || 1);
      } else if (action === 'ROSE_BLOOM_TRIGGER' || action === 'TRIGGER_ROSE') {
        this.triggerRoseAnimation(data);
      }
      // Secondary Interactions
      else if (action === 'INTERACTION_LIKE') {
        this.triggerSecondaryLive('like');
      } else if (action === 'INTERACTION_GIFT') {
        this.triggerSecondaryLive('gift');
      } else if (action === 'INTERACTION_FOLLOW') {
        this.triggerSecondaryLive('follow');
      } else if (action === 'INTERACTION_CHAT') {
        this.triggerSecondaryLive('chat');
      }
    }

    /* ------------------------------------------------------------------------
       AUDIO SYNTHESIS ENGINE (Synthesized Real-Time Audio, Zero External MP3s)
       ------------------------------------------------------------------------ */
    getAudioContext() {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    }

    // --- Heart Audio ---
    playHeartbeat(frequency = 70, volume = 0.5) {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.2);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(volume, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.28);
    }

    playSignalZap() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.15);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    }

    playExplosionSfx() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.8);
      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.95);

      const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(f, t + i * 0.04);
        g.gain.setValueAtTime(0.01, t + i * 0.04);
        g.gain.linearRampToValueAtTime(0.18, t + i * 0.04 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 1.2);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t + i * 0.04);
        o.stop(t + i * 0.04 + 1.3);
      });
    }

    playEnergyDiveSfx() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1100, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.5);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.65);
    }

    playSparkleChime() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const freqs = [1046.5, 1318.5, 1567.98, 2093.0];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, t + i * 0.06);
        g.gain.setValueAtTime(0.12, t + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.4);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t + i * 0.06);
        o.stop(t + i * 0.06 + 0.45);
      });
    }

    // --- Rose Audio (Ethereal, Botanical, Organic) ---
    playRoseSeed() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      // Soft crystal ting
      const ting = ctx.createOscillator();
      const tingGain = ctx.createGain();
      ting.type = 'sine';
      ting.frequency.setValueAtTime(1760, t); // A6
      ting.frequency.exponentialRampToValueAtTime(880, t + 0.28);
      tingGain.gain.setValueAtTime(0.01, t);
      tingGain.gain.linearRampToValueAtTime(0.24, t + 0.01);
      tingGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      ting.connect(tingGain);
      tingGain.connect(ctx.destination);
      ting.start(t);
      ting.stop(t + 0.38);

      // Magical chime
      [1318.5, 1760, 2093, 2637].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(f, t + 0.06 + i * 0.04);
        g.gain.setValueAtTime(0.01, t + 0.06 + i * 0.04);
        g.gain.linearRampToValueAtTime(0.12, t + 0.07 + i * 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5 + i * 0.04);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t + 0.06 + i * 0.04);
        o.stop(t + 0.55 + i * 0.04);
      });
    }

    playRoseSprout() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      // Pop -> stretch -> bounce
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, t);
      osc.frequency.exponentialRampToValueAtTime(680, t + 0.18);
      osc.frequency.exponentialRampToValueAtTime(500, t + 0.32);
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.26, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.38);
    }

    playRoseBloom() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      // E major lyrical bloom chord (E4, G#4, B4, E5, G#5, B5)
      const notes = [329.63, 415.30, 493.88, 659.25, 830.61, 987.77];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.05);
        osc.frequency.linearRampToValueAtTime(freq * 1.015, t + idx * 0.05 + 0.3);

        gain.gain.setValueAtTime(0.01, t + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.2, t + idx * 0.05 + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.05 + 1.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.05);
        osc.stop(t + idx * 0.05 + 1.35);
      });
    }

    playRosePetals() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      // Wind-breeze shimmer harmonics
      const freqs = [880, 1046.5, 1318.5, 1567.98, 1760, 2093];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(f, t + i * 0.07);
        g.gain.setValueAtTime(0.01, t + i * 0.07);
        g.gain.linearRampToValueAtTime(0.12, t + i * 0.07 + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.7);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t + i * 0.07);
        o.stop(t + i * 0.07 + 0.75);
      });
    }

    playRoseEnergy() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(180, t);
      sub.frequency.exponentialRampToValueAtTime(70, t + 0.45);
      subGain.gain.setValueAtTime(0.26, t);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(t);
      sub.stop(t + 0.55);
    }

    playRoseFinal() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1567.98, t); // G6
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.95);
    }

    /* ------------------------------------------------------------------------
       GIFT SOUNDBOARD SYNTHESIZERS & BROADCAST CONTROLLERS
       ------------------------------------------------------------------------ */
    playSoundEffect(soundName) {
      if (!soundName) return;
      const key = String(soundName).toLowerCase();
      if (key.includes('horn') || key.includes('airhorn')) {
        this.playAirHorn();
      } else if (key.includes('cheer') || key.includes('applause')) {
        this.playApplause();
      } else if (key.includes('drum')) {
        this.playDrumRoll();
      } else if (key.includes('boom') || key.includes('impact')) {
        this.playDramaticBoom();
      } else if (key.includes('ding') || key.includes('correct') || key.includes('bell') || key.includes('reveal')) {
        this.playCorrectBell();
      } else if (key.includes('wrong') || key.includes('buzz')) {
        this.playBuzzer();
      } else if (key.includes('gift') || key.includes('fanfare')) {
        this.playGiftFanfare();
      } else if (key.includes('like') || key.includes('pop')) {
        this.playLikePop();
      } else if (key.includes('follow') || key.includes('salute') || key.includes('star')) {
        this.playFollowSalute();
      } else if (key.includes('rose') || key.includes('bloom')) {
        this.playRoseBloom();
      } else if (key.includes('heart')) {
        this.playExplosionSfx();
      }

      if (window.sounds && typeof window.sounds.play === 'function') {
        try { window.sounds.play(soundName); } catch (e) {}
      }
    }

    showBroadcastToast(title) {
      let toast = document.getElementById('soundboard-broadcast-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'soundboard-broadcast-toast';
        toast.className = 'soundboard-toast';
        document.body.appendChild(toast);
      }
      toast.innerHTML = `<span>📡</span><span>BROADCASTED TO LIVE STAGE: <strong>${title}</strong></span>`;
      toast.classList.add('active');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.classList.remove('active');
      }, 2400);
    }

    broadcastGiftSound(soundName, animationAction, payload = {}, label = '') {
      this.playSoundEffect(soundName);

      if (animationAction === 'ROSE_BLOOM_TRIGGER') {
        const count = payload.count || 1;
        const viewer = payload.viewerName || '@PlaygroundFan';
        this.onHostPressRose(count, viewer);
      } else if (animationAction === 'HEART_ME_TRIGGER') {
        this.onHostPressHeart();
      } else if (animationAction) {
        this.broadcast(animationAction, payload);
      } else {
        this.broadcast('PLAY_SOUND', { sound: soundName, ...payload });
      }

      if (window.sounds && typeof window.sounds.broadcast === 'function') {
        try { window.sounds.broadcast(soundName); } catch (e) {}
      }

      this.showBroadcastToast(label || soundName);
    }

    playAirHorn() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const blasts = [
        { start: 0, dur: 0.15 },
        { start: 0.19, dur: 0.15 },
        { start: 0.38, dur: 0.42 }
      ];
      blasts.forEach(({ start, dur }) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(466.16, t + start);
        osc2.frequency.setValueAtTime(349.23, t + start);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, t + start);

        gain.gain.setValueAtTime(0.01, t + start);
        gain.gain.linearRampToValueAtTime(0.24, t + start + 0.02);
        gain.gain.setValueAtTime(0.24, t + start + dur - 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + start + dur);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(t + start);
        osc2.start(t + start);
        osc1.stop(t + start + dur + 0.02);
        osc2.stop(t + start + dur + 0.02);
      });
    }

    playApplause() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const bufferSize = ctx.sampleRate * 2.0;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, ctx.currentTime);
      filter.Q.setValueAtTime(1.1, ctx.currentTime);
      const gain = ctx.createGain();
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.26, t + 0.25);
      gain.gain.setValueAtTime(0.24, t + 1.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.95);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(t);
      noise.stop(t + 2.0);
    }

    playDrumRoll() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const taps = 22;
      for (let i = 0; i < taps; i++) {
        const tapTime = t + (i / taps) * 1.0;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(170 + (i * 5), tapTime);
        const tapVol = 0.05 + (i / taps) * 0.18;
        g.gain.setValueAtTime(tapVol, tapTime);
        g.gain.exponentialRampToValueAtTime(0.0001, tapTime + 0.055);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(tapTime);
        osc.stop(tapTime + 0.06);
      }
      setTimeout(() => {
        this.playExplosionSfx();
      }, 1000);
    }

    playDramaticBoom() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.85);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.0);
    }

    playCorrectBell() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      [1046.5, 1318.51, 1567.98].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);
        gain.gain.setValueAtTime(0.01, t + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.22, t + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.08 + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.95);
      });
    }

    playBuzzer() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      [130, 134].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.48);
      });
    }

    playGiftFanfare() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + i * 0.08);
        gain.gain.setValueAtTime(0.01, t + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, t + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.08 + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + i * 0.08);
        osc.stop(t + i * 0.08 + 0.75);
      });
    }

    playLikePop() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(1250, t + 0.12);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    }

    playFollowSalute() {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      [880, 1108.73, 1318.51, 1760].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.06);
        gain.gain.setValueAtTime(0.01, t + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.18, t + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.06 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.06);
        osc.stop(t + idx * 0.06 + 0.65);
      });
    }

    /* ------------------------------------------------------------------------
       HOST CONTROL PANEL — Global Live Audience Controls (6-Button Grid)
       ------------------------------------------------------------------------ */
    attachHostBar(targetContainer) {
      let container = targetContainer;
      if (typeof container === 'string') {
        container = document.getElementById(container) || document.querySelector(container);
      }
      if (!container) {
        container = document.getElementById('host-timer-controls') || 
                    document.querySelector('.host-settings') || 
                    document.querySelector('.host-main') || 
                    document.body;
      }

      if (!container || document.getElementById('dion-host-interaction-bar')) return;

      const bar = document.createElement('section');
      bar.id = 'dion-host-interaction-bar';
      bar.className = 'host-live-interaction-bar';
      bar.innerHTML = `
        <div class="interaction-bar-header">
          <div class="interaction-bar-title">
            <span>🎮</span>
            <span>LIVE AUDIENCE INTERACTIONS</span>
            <span style="font-size: 10px; color: #34d399; background: rgba(16,185,129,0.2); padding: 2px 8px; border-radius: 999px; border: 1px solid #10b981;">HOST DECIDES TIMING</span>
          </div>
          <div class="interaction-bar-actions">
            <button type="button" class="btn-simulate-incoming" id="btn-sim-rose" title="Simulate a viewer sending a Rose">
              <span>+</span>
              <span>SIMULATE 🌹</span>
            </button>
            <button type="button" class="btn-simulate-incoming" id="btn-sim-heart" title="Simulate a viewer sending Heart Me">
              <span>+</span>
              <span>SIMULATE ❤️</span>
            </button>
            <button type="button" class="btn-storyboard-toggle" id="btn-open-storyboard" title="Open Gift Soundboard with live audio & animation broadcast to stage">
              <span>🎁</span>
              <span>GIFT SOUNDBOARD</span>
            </button>
          </div>
        </div>

        <!-- Heart Me Reminder Queue -->
        <div id="heart-me-reminder-container" style="display: none;"></div>

        <!-- Rose Queue & Activity Container -->
        <div id="rose-queue-container" style="display: none;"></div>

        <!-- 6-BUTTON LIVE INTERACTIONS MATRIX (Matching Host Controller Specification) -->
        <div class="live-interactions-box">
          <div class="live-matrix-grid">
            <!-- 1. ❤️ HEART ME -->
            <button type="button" id="btn-trigger-heart-power" class="btn-host-heart-trigger" title="Host triggers the dramatic Heart Power animation on the LIVE display">
              <span class="btn-heart-icon">❤️</span>
              <span id="btn-heart-label">HEART ME</span>
              <span id="btn-heart-sub" style="font-size: 10px; opacity: 0.85; font-weight: 700;">(SEND HEART)</span>
            </button>

            <!-- 2. 🌹 ROSE GIFT (with dynamic Rose count / queue) -->
            <button type="button" id="btn-trigger-rose-bloom" class="btn-host-rose-trigger" title="Host triggers the organic Rose Bloom garden animation on LIVE display">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 22px;">🌹</span>
                <span id="rose-counter-pill" class="rose-count-badge">× 1</span>
              </div>
              <span id="btn-rose-label" style="font-size: 14px; font-weight: 900;">ROSE</span>
              <span id="btn-rose-sub" style="font-size: 10px; color: #a7f3d0; font-weight: 700;">TRIGGER BLOOM</span>
            </button>

            <!-- 3. 👍 LIKE -->
            <button type="button" class="btn-host-secondary-trigger" id="btn-trigger-like" title="Trigger floating like bursts on LIVE stage">
              <span style="font-size: 20px;">👍</span>
              <div>
                <div style="font-weight: 900;">LIKE</div>
                <div style="font-size: 9px; opacity: 0.8;">BURST</div>
              </div>
            </button>

            <!-- 4. 🎁 GIFT -->
            <button type="button" class="btn-host-secondary-trigger" id="btn-trigger-gift" title="Trigger celebratory gift shower on LIVE stage">
              <span style="font-size: 20px;">🎁</span>
              <div>
                <div style="font-weight: 900;">GIFT</div>
                <div style="font-size: 9px; opacity: 0.8;">SHOWER</div>
              </div>
            </button>

            <!-- 5. ⭐ FOLLOW -->
            <button type="button" class="btn-host-secondary-trigger" id="btn-trigger-follow" title="Trigger golden star follow salute on LIVE stage">
              <span style="font-size: 20px;">⭐</span>
              <div>
                <div style="font-weight: 900;">FOLLOW</div>
                <div style="font-size: 9px; opacity: 0.8;">SALUTE</div>
              </div>
            </button>

            <!-- 6. 💬 CHAT -->
            <button type="button" class="btn-host-secondary-trigger" id="btn-trigger-chat" title="Trigger chat shoutout wave on LIVE stage">
              <span style="font-size: 20px;">💬</span>
              <div>
                <div style="font-weight: 900;">CHAT</div>
                <div style="font-size: 9px; opacity: 0.8;">SHOUTOUT</div>
              </div>
            </button>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 11px; color: #94a3b8;">
          <div id="host-live-status-text" style="color: #34d399; font-weight: 800;">● READY TO FIRE</div>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn-qr-pill" id="btn-sim-5roses" style="padding: 2px 8px; font-size: 10px;">+5 🌹 Roses</button>
            <button type="button" class="btn-qr-pill" id="btn-sim-10roses" style="padding: 2px 8px; font-size: 10px;">+10 🌹 Roses</button>
          </div>
        </div>
      `;

      if (container.firstChild) {
        container.insertBefore(bar, container.firstChild);
      } else {
        container.appendChild(bar);
      }

      this.bindHostEvents();
      this.injectStoryboardModal();
    }

    bindHostEvents() {
      const heartBtn = document.getElementById('btn-trigger-heart-power');
      const roseBtn = document.getElementById('btn-trigger-rose-bloom');
      const simHeartBtn = document.getElementById('btn-sim-heart');
      const simRoseBtn = document.getElementById('btn-sim-rose');
      const sim5RosesBtn = document.getElementById('btn-sim-5roses');
      const sim10RosesBtn = document.getElementById('btn-sim-10roses');
      const storyboardBtn = document.getElementById('btn-open-storyboard');
      const likeBtn = document.getElementById('btn-trigger-like');
      const giftBtn = document.getElementById('btn-trigger-gift');
      const followBtn = document.getElementById('btn-trigger-follow');
      const chatBtn = document.getElementById('btn-trigger-chat');

      if (heartBtn) heartBtn.addEventListener('click', () => this.onHostPressHeart());
      if (roseBtn) roseBtn.addEventListener('click', () => this.onHostPressRose());

      const sampleViewers = ['@IslandVibes876', '@TriniGamer', '@Shenseea_Fan', '@Kareem_King', '@ReggaeLover', '@DionFam_London'];

      if (simHeartBtn) {
        simHeartBtn.addEventListener('click', () => {
          const user = sampleViewers[Math.floor(Math.random() * sampleViewers.length)];
          this.onViewerSentHeartMe(user);
        });
      }

      if (simRoseBtn) {
        simRoseBtn.addEventListener('click', () => {
          const user = sampleViewers[Math.floor(Math.random() * sampleViewers.length)];
          this.onViewerSentRose(user, 1);
        });
      }

      if (sim5RosesBtn) {
        sim5RosesBtn.addEventListener('click', () => {
          const user = sampleViewers[Math.floor(Math.random() * sampleViewers.length)];
          this.onViewerSentRose(user, 5);
        });
      }

      if (sim10RosesBtn) {
        sim10RosesBtn.addEventListener('click', () => {
          const user = sampleViewers[Math.floor(Math.random() * sampleViewers.length)];
          this.onViewerSentRose(user, 10);
        });
      }

      if (storyboardBtn) {
        storyboardBtn.addEventListener('click', () => this.openStoryboardModal());
      }

      if (likeBtn) {
        likeBtn.addEventListener('click', () => {
          this.broadcast('INTERACTION_LIKE');
          this.playSignalZap();
        });
      }

      if (giftBtn) {
        giftBtn.addEventListener('click', () => {
          this.broadcast('INTERACTION_GIFT');
          this.playExplosionSfx();
        });
      }

      if (followBtn) {
        followBtn.addEventListener('click', () => {
          this.broadcast('INTERACTION_FOLLOW');
          this.playSparkleChime();
        });
      }

      if (chatBtn) {
        chatBtn.addEventListener('click', () => {
          this.broadcast('INTERACTION_CHAT');
          this.playRoseSeed();
        });
      }
    }

    /* ------------------------------------------------------------------------
       HEART ME LOGIC (Host Reminder & Trigger)
       ------------------------------------------------------------------------ */
    onViewerSentHeartMe(viewerName) {
      this.heartQueue.unshift({
        viewer: viewerName,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
      if (this.heartQueue.length > 5) this.heartQueue.pop();

      // Audio notification for Host only
      this.playHeartbeat(90, 0.35);

      const reminderBox = document.getElementById('heart-me-reminder-container');
      const hostBar = document.getElementById('dion-host-interaction-bar');
      if (hostBar) hostBar.classList.add('has-incoming');

      if (reminderBox) {
        reminderBox.style.display = 'block';
        reminderBox.innerHTML = `
          <div class="heart-me-reminder-queue">
            <div class="reminder-text">
              <span class="heart-icon-pulse">❤️</span>
              <span><strong>HEART ME RECEIVED</strong> from <span style="color: #f7e07d;">${viewerName}</span></span>
              <span style="font-size: 10px; color: #cbd5e1; opacity: 0.8;">(Host Reminder — Press SEND HEART to trigger)</span>
            </div>
            <div class="reminder-actions">
              <button type="button" class="btn-reminder-trigger" id="btn-quick-trigger-heart">
                FIRE HEART NOW ▶
              </button>
              <button type="button" class="btn-reminder-dismiss" id="btn-dismiss-heart" title="Dismiss">✕</button>
            </div>
          </div>
        `;

        const quickBtn = document.getElementById('btn-quick-trigger-heart');
        const dismissBtn = document.getElementById('btn-dismiss-heart');
        if (quickBtn) quickBtn.onclick = () => this.onHostPressHeart();
        if (dismissBtn) {
          dismissBtn.onclick = () => {
            reminderBox.style.display = 'none';
            if (hostBar) hostBar.classList.remove('has-incoming');
          };
        }
      }
    }

    onHostPressHeart() {
      if (this.isHeartCooldown) return;

      const btn = document.getElementById('btn-trigger-heart-power');
      const label = document.getElementById('btn-heart-label');
      const sub = document.getElementById('btn-heart-sub');
      const statusText = document.getElementById('host-live-status-text');

      if (btn) {
        btn.classList.add('is-pressed');
        setTimeout(() => {
          btn.classList.remove('is-pressed');
          btn.classList.add('is-activated');
          if (label) label.textContent = '❤️ SENT!';
          if (sub) sub.textContent = 'DISPATCHED';
        }, 120);
      }

      this.playSignalZap();

      // Emit flying mini-heart energy signal particle
      if (btn) {
        const particle = document.createElement('div');
        particle.className = 'controller-signal-particle';
        particle.textContent = '❤️';
        const rect = btn.getBoundingClientRect();
        particle.style.left = `${rect.left + rect.width / 2}px`;
        particle.style.top = `${rect.top}px`;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 750);
      }

      const currentViewer = this.heartQueue.length ? this.heartQueue[0].viewer : 'Chat';
      this.broadcast('HEART_ME_TRIGGER', {
        viewerName: currentViewer,
        origin: 'host-controller'
      });

      const reminderBox = document.getElementById('heart-me-reminder-container');
      const hostBar = document.getElementById('dion-host-interaction-bar');
      if (reminderBox) reminderBox.style.display = 'none';
      if (hostBar) hostBar.classList.remove('has-incoming');
      this.heartQueue = [];

      // Cooldown
      this.isHeartCooldown = true;
      let remaining = 2.5;

      if (btn) {
        setTimeout(() => {
          btn.classList.remove('is-activated');
          btn.classList.add('is-cooldown');
          btn.disabled = true;
          if (label) label.textContent = 'COOLDOWN';
          if (sub) sub.textContent = `(${remaining.toFixed(1)}s)`;
          if (statusText) {
            statusText.textContent = '⏳ COOLING DOWN...';
            statusText.style.color = '#f59e0b';
          }
        }, 450);
      }

      clearInterval(this.heartCooldownTimer);
      this.heartCooldownTimer = setInterval(() => {
        remaining -= 0.5;
        if (sub) sub.textContent = `(${Math.max(0, remaining).toFixed(1)}s)`;
        if (remaining <= 0) {
          clearInterval(this.heartCooldownTimer);
          this.isHeartCooldown = false;
          if (btn) {
            btn.classList.remove('is-cooldown');
            btn.disabled = false;
            if (label) label.textContent = 'HEART ME';
            if (sub) sub.textContent = '(SEND HEART)';
          }
          if (statusText) {
            statusText.textContent = '● READY TO FIRE';
            statusText.style.color = '#34d399';
          }
        }
      }, 500);
    }

    /* ------------------------------------------------------------------------
       ROSE GIFT LOGIC (Queue & Multi-Rose Accumulation)
       ------------------------------------------------------------------------ */
    onViewerSentRose(viewerName, count = 1) {
      const parsedCount = Math.max(1, parseInt(count, 10) || 1);
      this.roseQueue.push({
        viewer: viewerName,
        count: parsedCount,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
      this.totalRoses += parsedCount;

      // Host audio notification (crystal ting)
      this.playRoseSeed();

      this.updateRoseQueueUI();
    }

    updateRoseQueueUI() {
      const counterPill = document.getElementById('rose-counter-pill');
      const btnRoseSub = document.getElementById('btn-rose-sub');
      const queueContainer = document.getElementById('rose-queue-container');

      if (counterPill) {
        counterPill.textContent = `× ${this.totalRoses || 1}`;
      }

      if (btnRoseSub) {
        btnRoseSub.textContent = this.totalRoses > 1 ? `BLOOM × ${this.totalRoses}` : 'TRIGGER BLOOM';
      }

      if (queueContainer) {
        if (this.roseQueue.length === 0) {
          queueContainer.style.display = 'none';
        } else {
          queueContainer.style.display = 'block';

          const itemsHtml = this.roseQueue.slice(-4).map(item => `
            <span class="rose-queue-item">🌹 ${item.viewer} <strong>×${item.count}</strong></span>
          `).join('');

          queueContainer.innerHTML = `
            <div class="rose-queue-card">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; color: #fecdd3; font-weight: 800;">TIKTOK ACTIVITY:</span>
                <div class="rose-queue-list">
                  ${itemsHtml}
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; color: #6ee7b7; font-weight: 900;">TOTAL: ×${this.totalRoses}</span>
                <button type="button" class="btn-queue-bloom" id="btn-quick-bloom-queue">
                  🌹 BLOOM NOW
                </button>
              </div>
            </div>
          `;

          const quickBloom = document.getElementById('btn-quick-bloom-queue');
          if (quickBloom) quickBloom.onclick = () => this.onHostPressRose();
        }
      }
    }

    onHostPressRose(forcedCount, forcedGifter) {
      if (this.isRoseCooldown) return;

      const btn = document.getElementById('btn-trigger-rose-bloom');
      const label = document.getElementById('btn-rose-label');
      const sub = document.getElementById('btn-rose-sub');
      const counterPill = document.getElementById('rose-counter-pill');
      const statusText = document.getElementById('host-live-status-text');

      const countToFire = forcedCount || this.totalRoses || 1;
      const primaryGifter = forcedGifter || (this.roseQueue.length ? this.roseQueue[this.roseQueue.length - 1].viewer : 'Audience Member');

      if (btn) {
        btn.classList.add('is-pressed');
        setTimeout(() => {
          btn.classList.remove('is-pressed');
          btn.classList.add('is-activated');
          if (label) label.textContent = '🌹 SENT!';
          if (sub) sub.textContent = 'BLOOMING...';
        }, 120);
      }

      this.playRoseSeed();

      // Emit flying rose petal particle from controller button
      if (btn) {
        const particle = document.createElement('div');
        particle.className = 'controller-signal-particle';
        particle.textContent = '🌹';
        const rect = btn.getBoundingClientRect();
        particle.style.left = `${rect.left + rect.width / 2}px`;
        particle.style.top = `${rect.top}px`;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 750);
      }

      // Broadcast trigger to LIVE stage
      this.broadcast('ROSE_BLOOM_TRIGGER', {
        count: countToFire,
        primaryGifter: primaryGifter,
        gifters: this.roseQueue.slice(),
        origin: 'host-controller'
      });

      // Clear queue
      this.roseQueue = [];
      this.totalRoses = 0;
      this.updateRoseQueueUI();

      // Cooldown (2.5s)
      this.isRoseCooldown = true;
      let remaining = 2.5;

      if (btn) {
        setTimeout(() => {
          btn.classList.remove('is-activated');
          btn.classList.add('is-cooldown');
          btn.disabled = true;
          if (label) label.textContent = 'COOLDOWN';
          if (sub) sub.textContent = `(${remaining.toFixed(1)}s)`;
          if (statusText) {
            statusText.textContent = '⏳ COOLING DOWN...';
            statusText.style.color = '#f59e0b';
          }
        }, 450);
      }

      clearInterval(this.roseCooldownTimer);
      this.roseCooldownTimer = setInterval(() => {
        remaining -= 0.5;
        if (sub) sub.textContent = `(${Math.max(0, remaining).toFixed(1)}s)`;
        if (remaining <= 0) {
          clearInterval(this.roseCooldownTimer);
          this.isRoseCooldown = false;
          if (btn) {
            btn.classList.remove('is-cooldown');
            btn.disabled = false;
            if (label) label.textContent = 'ROSE';
            if (sub) sub.textContent = 'TRIGGER BLOOM';
            if (counterPill) counterPill.textContent = '× 1';
          }
          if (statusText) {
            statusText.textContent = '● READY TO FIRE';
            statusText.style.color = '#34d399';
          }
        }
      }, 500);
    }

    /* ------------------------------------------------------------------------
       LIVE STAGE — 9-PANEL HEART ANIMATION
       ------------------------------------------------------------------------ */
    attachLiveOverlay() {
      if (document.getElementById('dion-heart-power-live-overlay')) return;

      const overlay = document.createElement('div');
      overlay.id = 'dion-heart-power-live-overlay';
      overlay.className = 'heart-power-live-overlay';
      overlay.innerHTML = `
        <div class="heart-power-dimmer"></div>
        <canvas class="heart-power-canvas" id="heart-power-canvas"></canvas>
        <div class="heart-power-stage-content" id="hp-stage-content"></div>
        <div class="hp-tiny-final-heart" id="hp-final-heart">💗</div>
      `;

      document.body.appendChild(overlay);
      this.overlayElement = overlay;
      this.canvas = document.getElementById('heart-power-canvas');
      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
      }
    }

    resizeCanvas() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    triggerLiveAnimation(payload = {}) {
      if (this.isLiveOverlayRunning) return;
      this.isLiveOverlayRunning = true;

      this.attachLiveOverlay();
      const overlay = this.overlayElement;
      const content = document.getElementById('hp-stage-content');
      const finalHeart = document.getElementById('hp-final-heart');

      if (!overlay || !content) {
        this.isLiveOverlayRunning = false;
        return;
      }

      overlay.classList.add('active');
      content.innerHTML = '';
      if (finalHeart) finalHeart.className = 'hp-tiny-final-heart';

      // PANEL 5: Heart Pulses (0.15s, 0.65s)
      content.innerHTML = `
        <div class="hp-heartbeat-ring" id="hp-ring-1"></div>
        <div class="hp-heartbeat-ring" id="hp-ring-2"></div>
        <div class="hp-small-beating-heart" id="hp-small-heart">❤️</div>
      `;

      const smallHeart = document.getElementById('hp-small-heart');
      const ring1 = document.getElementById('hp-ring-1');
      const ring2 = document.getElementById('hp-ring-2');

      setTimeout(() => {
        if (smallHeart) smallHeart.className = 'hp-small-beating-heart beat-1';
        if (ring1) ring1.classList.add('expand');
        this.playHeartbeat(75, 0.6);
      }, 150);

      setTimeout(() => {
        if (smallHeart) smallHeart.className = 'hp-small-beating-heart beat-2';
        if (ring2) ring2.classList.add('expand');
        this.playHeartbeat(85, 0.85);
      }, 650);

      // PANEL 6 & 7: Giant Heart Explosion & "HEART POWER!" (1.1s)
      setTimeout(() => {
        this.playExplosionSfx();
        this.spawnParticleExplosion();

        content.innerHTML = `
          <div class="hp-hero-heart-wrapper">
            <div class="hp-radiant-corona"></div>
            <div class="hp-giant-pulsing-heart">❤️</div>
          </div>
          <div class="hp-text-banner">
            <div class="hp-title-row" id="hp-title-letters"></div>
            <div class="hp-badge-pill">
              <span>★</span>
              <span>AUDIENCE LOVE ACTIVATED • DIONLYONEE PLAYGROUND</span>
              <span>★</span>
            </div>
          </div>
        `;

        const titleContainer = document.getElementById('hp-title-letters');
        if (titleContainer) {
          const phrase = 'HEART POWER!';
          titleContainer.innerHTML = '';
          phrase.split('').forEach((char, idx) => {
            const span = document.createElement('span');
            span.className = 'hp-letter';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${idx * 0.045}s`;
            if (char === '!') span.style.color = '#f7e07d';
            titleContainer.appendChild(span);
          });
        }
      }, 1100);

      // PANEL 8: Energy Dives into Game (2.8s)
      setTimeout(() => {
        this.playEnergyDiveSfx();
        const orb = document.createElement('div');
        orb.className = 'hp-energy-orb dive-animation';
        content.appendChild(orb);

        const heroHeart = content.querySelector('.hp-hero-heart-wrapper');
        const textBanner = content.querySelector('.hp-text-banner');
        if (heroHeart) heroHeart.style.opacity = '0';
        if (textBanner) textBanner.style.opacity = '0';

        setTimeout(() => {
          this.playHeartbeat(50, 0.9);
          const gameTargets = document.querySelectorAll(
            '.live-screen, .live-main, #live-content, .wheel-wrapper, .jeopardy-board, .hangman-board, #hangman-stage, .prompt-card'
          );
          gameTargets.forEach(el => {
            el.classList.add('game-energy-energized');
            setTimeout(() => el.classList.remove('game-energy-energized'), 1500);
          });
        }, 450);
      }, 2800);

      // PANEL 9: Final Tiny Heart Dissolves (3.8s)
      setTimeout(() => {
        this.playSparkleChime();
        if (finalHeart) finalHeart.className = 'hp-tiny-final-heart float-up';
      }, 3750);

      // Finish
      setTimeout(() => {
        overlay.classList.remove('active');
        this.clearParticles();
        this.isLiveOverlayRunning = false;
        content.innerHTML = '';
      }, 4800);
    }

    /* ------------------------------------------------------------------------
       LIVE STAGE — 12-PANEL ORGANIC ROSE BLOOM ANIMATION SYSTEM
       ------------------------------------------------------------------------ */
    attachRoseOverlay() {
      if (document.getElementById('dion-rose-live-overlay')) return;

      const overlay = document.createElement('div');
      overlay.id = 'dion-rose-live-overlay';
      overlay.className = 'rose-live-overlay';
      overlay.innerHTML = `
        <div class="rose-ambient-dimmer"></div>
        <canvas class="rose-particles-canvas" id="rose-particles-canvas"></canvas>
        <div class="rose-stage-arena" id="rose-stage-arena"></div>
        <div class="game-bloom-frame" id="game-bloom-frame">
          <div class="game-bloom-decorations">
            <span class="bloom-corner tl">🌿🌹</span>
            <span class="bloom-corner tr">🌹🌿</span>
            <span class="bloom-corner bl">🌿🌹</span>
            <span class="bloom-corner br">🌹🌿</span>
          </div>
        </div>
        <div class="rose-final-petal-float" id="rose-final-petal">🌸</div>
      `;

      document.body.appendChild(overlay);
    }

    triggerRoseAnimation(payload = {}) {
      if (this.isLiveOverlayRunning) return;
      this.isLiveOverlayRunning = true;

      this.attachRoseOverlay();

      const overlay = document.getElementById('dion-rose-live-overlay');
      const arena = document.getElementById('rose-stage-arena');
      const bloomFrame = document.getElementById('game-bloom-frame');
      const finalPetal = document.getElementById('rose-final-petal');
      const canvas = document.getElementById('rose-particles-canvas');

      if (!overlay || !arena) {
        this.isLiveOverlayRunning = false;
        return;
      }

      const roseCount = Math.max(1, parseInt(payload.count, 10) || 1);
      const gifter = payload.primaryGifter || (payload.viewerName || '@AudienceMember');

      overlay.classList.add('active');
      arena.innerHTML = '';
      if (finalPetal) finalPetal.className = 'rose-final-petal-float';
      if (bloomFrame) bloomFrame.classList.remove('active');

      // ==========================================================
      // PANEL 3: A SEED OF LIGHT APPEARS (0.0–0.45s)
      // ==========================================================
      this.playRoseSeed();
      const seed = document.createElement('div');
      seed.className = 'rose-seed-of-light';
      arena.appendChild(seed);

      // ==========================================================
      // PANEL 4: THE SEED IS PLANTED (0.45–0.75s)
      // ==========================================================
      setTimeout(() => {
        const ripple = document.createElement('div');
        ripple.className = 'rose-ground-ripple';
        arena.appendChild(ripple);
      }, 450);

      // ==========================================================
      // PANEL 5: THE STEM GROWS (POP → STRETCH → BOUNCE) (0.75–1.2s)
      // ==========================================================
      setTimeout(() => {
        this.playRoseSprout();

        // Multi-rose tier rendering
        if (roseCount === 1) {
          arena.innerHTML = `
            <div class="rose-plant-wrapper" id="rose-plant-single">
              <div class="rose-stem-body">
                <div class="rose-leaf left"></div>
                <div class="rose-leaf right"></div>
                <div class="rose-flower-head" id="rose-head-1">
                  <div class="rose-bud">🌹</div>
                </div>
              </div>
            </div>
          `;
        } else if (roseCount <= 5) {
          // Tier 2: 2–5 Roses (Rose Garden)
          arena.innerHTML = `
            <div class="multi-rose-cluster">
              <div class="rose-plant-wrapper" style="transform: scale(0.85) rotate(-6deg);">
                <div class="rose-stem-body" style="height: 160px;">
                  <div class="rose-leaf left"></div>
                  <div class="rose-flower-head" id="rose-head-1"><div class="rose-bud">🌹</div></div>
                </div>
              </div>
              <div class="rose-plant-wrapper" style="transform: scale(1.1);">
                <div class="rose-stem-body" style="height: 210px;">
                  <div class="rose-leaf left"></div>
                  <div class="rose-leaf right"></div>
                  <div class="rose-flower-head" id="rose-head-2"><div class="rose-bud">🌹</div></div>
                </div>
              </div>
              <div class="rose-plant-wrapper" style="transform: scale(0.9) rotate(8deg);">
                <div class="rose-stem-body" style="height: 175px;">
                  <div class="rose-leaf right"></div>
                  <div class="rose-flower-head" id="rose-head-3"><div class="rose-bud">🌹</div></div>
                </div>
              </div>
            </div>
          `;
        } else {
          // Tier 3, 4, 5: Garden Bloom / Rose Storm / Playground Garden
          arena.innerHTML = `
            <div class="multi-rose-cluster">
              ${[1,2,3,4,5].map((idx) => `
                <div class="rose-plant-wrapper" style="transform: scale(${0.8 + (idx % 3) * 0.15}) rotate(${(idx - 3) * 5}deg);">
                  <div class="rose-stem-body" style="height: ${150 + (idx % 3) * 30}px;">
                    <div class="rose-leaf ${idx % 2 === 0 ? 'left' : 'right'}"></div>
                    <div class="rose-flower-head" id="rose-head-${idx}"><div class="rose-bud">🌹</div></div>
                  </div>
                </div>
              `).join('')}
            </div>
          `;
        }
      }, 750);

      // ==========================================================
      // PANEL 6 & 7: ROSE BLOOM! (1.4–1.9s)
      // ==========================================================
      setTimeout(() => {
        this.playRoseBloom();

        const heads = arena.querySelectorAll('.rose-flower-head');
        heads.forEach((head, i) => {
          setTimeout(() => {
            head.innerHTML = `
              <div class="rose-blossom-bloomed">
                <div class="petal-layer petal-1"></div>
                <div class="petal-layer petal-2"></div>
                <div class="petal-layer petal-3"></div>
                <div class="petal-layer petal-4"></div>
                <div class="petal-layer petal-center"></div>
              </div>
            `;
          }, i * 90);
        });
      }, 1400);

      // ==========================================================
      // PANEL 8: PETALS FLY ACROSS THE SCREEN (1.9–2.5s)
      // ==========================================================
      setTimeout(() => {
        this.playRosePetals();
        this.spawnWindPetals(canvas, roseCount);
      }, 1900);

      // ==========================================================
      // PANEL 9: "ROSE BLOOM!" & GIFTER RECOGNITION (2.4–3.0s)
      // ==========================================================
      setTimeout(() => {
        let headlineText = 'ROSE BLOOM!';
        if (roseCount >= 36) headlineText = 'THE PLAYGROUND GARDEN!';
        else if (roseCount >= 16) headlineText = 'ROSE STORM!';
        else if (roseCount >= 6) headlineText = 'GARDEN BLOOM!';
        else if (roseCount >= 2) headlineText = 'ROSE GARDEN!';

        const banner = document.createElement('div');
        banner.className = 'rose-banner-overlay';
        banner.innerHTML = `
          <div class="rose-headline-text">
            <span>🌹</span>
            <span>${headlineText}</span>
            <span>🌹</span>
          </div>
          <div class="rose-gifter-pill">
            <span>🌱</span>
            <span>Planted by <strong>${gifter}</strong> ${roseCount > 1 ? `(×${roseCount} Roses)` : ''}</span>
            <span>•</span>
            <span style="color: #fde047;">THANK YOU!</span>
          </div>
        `;
        arena.appendChild(banner);
      }, 2400);

      // ==========================================================
      // PANEL 10: ENERGY SPARK TRAVELS TO GAME (3.0–3.4s)
      // ==========================================================
      setTimeout(() => {
        this.playRoseEnergy();

        const spark = document.createElement('div');
        spark.className = 'rose-energy-spark';
        const flowerHead = arena.querySelector('.rose-flower-head');
        if (flowerHead) flowerHead.appendChild(spark);
      }, 3000);

      // ==========================================================
      // PANEL 11: GAME BLOOM (3.4–3.7s)
      // ==========================================================
      setTimeout(() => {
        if (bloomFrame) bloomFrame.classList.add('active');

        // Light up live stage elements gently
        const gameTargets = document.querySelectorAll(
          '.live-screen, .live-main, #live-content, .wheel-wrapper, .jeopardy-board, .hangman-board, #hangman-stage, .prompt-card'
        );
        gameTargets.forEach(el => {
          el.classList.add('game-energy-energized');
          setTimeout(() => el.classList.remove('game-energy-energized'), 1500);
        });

        setTimeout(() => {
          if (bloomFrame) bloomFrame.classList.remove('active');
        }, 400);
      }, 3400);

      // ==========================================================
      // PANEL 12: FINAL PETAL FLOATS UP & DISSOLVES (3.7–4.3s)
      // ==========================================================
      setTimeout(() => {
        this.playRoseFinal();
        if (finalPetal) finalPetal.className = 'rose-final-petal-float fly';
      }, 3700);

      // Return smoothly to game
      setTimeout(() => {
        overlay.classList.remove('active');
        this.clearParticles();
        this.isLiveOverlayRunning = false;
        arena.innerHTML = '';
      }, 4800);
    }

    spawnWindPetals(canvasEl, roseCount) {
      if (!canvasEl) return;
      const ctx = canvasEl.getContext('2d');
      if (!ctx) return;

      canvasEl.width = window.innerWidth;
      canvasEl.height = window.innerHeight;
      this.clearParticles();

      const numPetals = Math.min(120, 30 + roseCount * 4);
      const symbols = ['🌸', '🌺', '🌹', '✨', '🍃', '🌱'];

      for (let i = 0; i < numPetals; i++) {
        const startX = Math.random() * canvasEl.width * 0.8 + canvasEl.width * 0.1;
        const startY = canvasEl.height * 0.85 + (Math.random() - 0.5) * 60;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
        const speed = Math.random() * 7 + 4;

        this.particles.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
          vy: Math.sin(angle) * speed - 2,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          size: Math.random() * 20 + 14,
          alpha: 1,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.08,
          gravity: -0.02, // Gentle updraft
          drag: 0.985,
          windOffset: Math.random() * 10
        });
      }

      this.renderWindPetals(canvasEl, ctx);
    }

    renderWindPetals(canvasEl, ctx) {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      let alive = false;
      const t = Date.now() * 0.003;

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.vx += Math.sin(t + p.windOffset) * 0.15; // Curved wind path
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.rot += p.vRot;
        p.alpha -= 0.008;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.font = `${p.size}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.symbol, 0, 0);
          ctx.restore();
        }
      }

      if (alive) {
        this.animFrameId = requestAnimationFrame(() => this.renderWindPetals(canvasEl, ctx));
      } else {
        this.clearParticles();
      }
    }

    spawnParticleExplosion() {
      if (!this.canvas || !this.ctx) return;
      this.clearParticles();

      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;
      const symbols = ['❤️', '💗', '💖', '⭐', '✨', '🎮', '🕹️', '👑', '💎', '💛'];

      for (let i = 0; i < 75; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        this.particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          size: Math.random() * 22 + 16,
          alpha: 1,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.15,
          gravity: 0.18,
          drag: 0.96
        });
      }

      this.renderParticles();
    }

    renderParticles() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      let alive = false;
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.rot += p.vRot;
        p.alpha -= 0.012;

        if (p.alpha > 0) {
          alive = true;
          this.ctx.save();
          this.ctx.globalAlpha = Math.max(0, p.alpha);
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.rot);
          this.ctx.font = `${p.size}px serif`;
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(p.symbol, 0, 0);
          this.ctx.restore();
        }
      }

      if (alive) {
        this.animFrameId = requestAnimationFrame(() => this.renderParticles());
      } else {
        this.clearParticles();
      }
    }

    clearParticles() {
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      this.particles = [];
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }

    triggerSecondaryLive(type) {
      if (!this.canvas || !this.ctx) this.attachLiveOverlay();
      if (!this.canvas) return;

      const symbols = type === 'gift' ? ['🎁', '💎', '🎉', '🏆'] :
                      type === 'follow' ? ['⭐', '🌟', '✨', '👑'] :
                      type === 'chat' ? ['💬', '📢', '🔥', '✨'] :
                      ['👍', '❤️', '🔥', '👏'];

      const cx = Math.random() * (this.canvas.width * 0.6) + this.canvas.width * 0.2;
      const cy = this.canvas.height * 0.85;

      for (let i = 0; i < 28; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
        const speed = Math.random() * 10 + 5;
        this.particles.push({
          x: cx + (Math.random() - 0.5) * 50,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          size: Math.random() * 24 + 18,
          alpha: 1,
          rot: 0,
          vRot: (Math.random() - 0.5) * 0.1,
          gravity: 0.12,
          drag: 0.98
        });
      }

      if (this.overlayElement) this.overlayElement.classList.add('active');
      this.renderParticles();

      setTimeout(() => {
        if (this.overlayElement && !this.isLiveOverlayRunning) {
          this.overlayElement.classList.remove('active');
        }
      }, 2500);
    }

    /* ------------------------------------------------------------------------
       GIFT SOUNDBOARD & STORYBOARD MODAL — Walkthrough & Live Broadcast Studio
       ------------------------------------------------------------------------ */
    injectStoryboardModal() {
      if (document.getElementById('dion-storyboard-modal')) return;

      const modal = document.createElement('div');
      modal.id = 'dion-storyboard-modal';
      modal.className = 'storyboard-modal-overlay';
      modal.innerHTML = `
        <div class="storyboard-modal-box" style="max-width: 1040px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid rgba(212, 175, 55, 0.3); padding-bottom: 14px; flex-wrap: wrap; gap: 8px;">
            <div>
              <h2 style="font-family: var(--font-display, 'Cinzel', serif); font-size: 20px; font-weight: 900; color: #f7e07d; letter-spacing: 2px; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
                <span>🎁</span>
                <span>GIFT SOUNDBOARD &amp; LIVE BROADCASTER</span>
              </h2>
              <p style="font-size: 12px; color: #94a3b8;">
                Host-controlled live stage audio &amp; visual animation studio. Trigger gift fanfares, rose blooms, and crowd effects directly to the LIVE audience!
              </p>
            </div>
            <button type="button" class="storyboard-close-btn" id="btn-close-storyboard" style="position: static;">✕</button>
          </div>

          <!-- TABS -->
          <div class="storyboard-tabs">
            <button type="button" class="storyboard-tab-btn active" id="tab-btn-soundboard">🎁 GIFT SOUNDBOARD</button>
            <button type="button" class="storyboard-tab-btn" id="tab-btn-rose">🌹 ROSE STORYBOARD (12 PANELS)</button>
            <button type="button" class="storyboard-tab-btn" id="tab-btn-heart">❤️ HEART ME STORYBOARD (9 PANELS)</button>
          </div>

          <!-- TAB CONTENT 1: GIFT SOUNDBOARD -->
          <div id="tab-content-soundboard" class="storyboard-tab-content gift-soundboard-container" style="display: block;">
            <div class="gift-soundboard-banner">
              <div class="gift-soundboard-banner-text">
                <span class="gift-soundboard-banner-title">📡 LIVE BROADCAST CONSOLE</span>
                <span class="gift-soundboard-banner-sub">Tap any sound or gift below. Audio synthesizes instantly and broadcasts synchronized stage visuals directly to the Live Stage!</span>
              </div>
              <span style="font-size: 10px; color: #10b981; font-weight: 900; letter-spacing: 1px; background: rgba(16, 185, 129, 0.2); padding: 4px 10px; border-radius: 999px; border: 1px solid #10b981;">● STAGE READY</span>
            </div>

            <div class="gift-soundboard-grid">
              <!-- Item: Rose 1x -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">🌹</span>
                  <span class="soundboard-item-tag tag-rose">TIER 1</span>
                </div>
                <div class="soundboard-item-title">Rose Bloom (x1)</div>
                <div class="soundboard-item-desc">Organic harp bloom chord &amp; single radiant flower sprouting with drifting petals.</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-rose-1">
                  <span>📡 BROADCAST 1 ROSE</span>
                </button>
              </div>

              <!-- Item: Rose 5x -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">🌹🌹</span>
                  <span class="soundboard-item-tag tag-rose">TIER 2</span>
                </div>
                <div class="soundboard-item-title">5x Rose Garden</div>
                <div class="soundboard-item-desc">Botanical garden chime &amp; 5 vibrant roses blooming in a lush garden row.</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-rose-5" style="background: linear-gradient(135deg, #059669, #be123c);">
                  <span>📡 BROADCAST 5 ROSES</span>
                </button>
              </div>

              <!-- Item: Rose 10x -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">🌹✨</span>
                  <span class="soundboard-item-tag tag-rose">TIER 3</span>
                </div>
                <div class="soundboard-item-title">10x Rose Storm</div>
                <div class="soundboard-item-desc">Grand floral fanfare &amp; 10 blooming roses with cross-screen golden petal storm.</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-rose-10">
                  <span>📡 BROADCAST 10 ROSES</span>
                </button>
              </div>

              <!-- Item: Rose 50x -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">🌹👑</span>
                  <span class="soundboard-item-tag tag-rose">ROYAL TIER</span>
                </div>
                <div class="soundboard-item-title">50x Wonderland</div>
                <div class="soundboard-item-desc">Playground garden symphony &amp; 50 cascading roses covering stage with beauty!</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-rose-50" style="background: linear-gradient(135deg, #d97706, #be123c);">
                  <span>📡 BROADCAST 50 ROSES</span>
                </button>
              </div>

              <!-- Item: Heart Me -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">❤️</span>
                  <span class="soundboard-item-tag tag-heart">HEART ME</span>
                </div>
                <div class="soundboard-item-title">Heart Me (Blast)</div>
                <div class="soundboard-item-desc">Deep heartbeat, plasma energy dive &amp; 9-panel live stage heart power surge.</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-heart" style="background: linear-gradient(135deg, #db2777, #be185d);">
                  <span>📡 BROADCAST HEART ME</span>
                </button>
              </div>

              <!-- Item: Gift Shower -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">🎁</span>
                  <span class="soundboard-item-tag tag-gift">GIFT</span>
                </div>
                <div class="soundboard-item-title">Gift Shower</div>
                <div class="soundboard-item-desc">Joyful brass celebration fanfare &amp; cascading golden gift boxes with confetti.</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-gift">
                  <span>📡 BROADCAST GIFT</span>
                </button>
              </div>

              <!-- Item: Like Burst -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">👍</span>
                  <span class="soundboard-item-tag tag-heart">LIKES</span>
                </div>
                <div class="soundboard-item-title">Like Shower</div>
                <div class="soundboard-item-desc">Playful bubble pops &amp; rising stream of thumb-up likes and hearts.</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-like">
                  <span>📡 BROADCAST LIKES</span>
                </button>
              </div>

              <!-- Item: Follow Salute -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">⭐</span>
                  <span class="soundboard-item-tag tag-gift">FOLLOW</span>
                </div>
                <div class="soundboard-item-title">Follow Salute</div>
                <div class="soundboard-item-desc">Victory fanfare chime &amp; royal golden starburst celebration across the stage.</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-follow">
                  <span>📡 BROADCAST FOLLOW</span>
                </button>
              </div>

              <!-- Item: Chat Shoutout -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">💬</span>
                  <span class="soundboard-item-tag tag-gift">CHAT</span>
                </div>
                <div class="soundboard-item-title">Chat Shoutout</div>
                <div class="soundboard-item-desc">Sparkle wind chime &amp; floating rhythmic speech ripples celebrating chat.</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-chat">
                  <span>📡 BROADCAST CHAT</span>
                </button>
              </div>

              <!-- Item: DJ Air Horn -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">🎺</span>
                  <span class="soundboard-item-tag tag-sfx">STREAM SFX</span>
                </div>
                <div class="soundboard-item-title">Live DJ Air Horn</div>
                <div class="soundboard-item-desc">Classic 3-burst soundclash hype air horn blast with energy.</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-airhorn" style="background: linear-gradient(135deg, #0284c7, #0369a1);">
                  <span>📡 BROADCAST AIR HORN</span>
                </button>
              </div>

              <!-- Item: Applause -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">👏</span>
                  <span class="soundboard-item-tag tag-sfx">STREAM SFX</span>
                </div>
                <div class="soundboard-item-title">Crowd Applause</div>
                <div class="soundboard-item-desc">Roaring stadium cheer &amp; lively clapping celebration for big moments.</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-applause" style="background: linear-gradient(135deg, #059669, #047857);">
                  <span>📡 BROADCAST APPLAUSE</span>
                </button>
              </div>

              <!-- Item: Drum Roll -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">🥁</span>
                  <span class="soundboard-item-tag tag-sfx">SUSPENSE</span>
                </div>
                <div class="soundboard-item-title">Drum Roll &amp; Crash</div>
                <div class="soundboard-item-desc">Accelerating suspense snare roll building into an energetic cymbal crash!</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-drumroll" style="background: linear-gradient(135deg, #4f46e5, #4338ca);">
                  <span>📡 BROADCAST DRUM ROLL</span>
                </button>
              </div>

              <!-- Item: Sub-Bass Boom -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">💥</span>
                  <span class="soundboard-item-tag tag-sfx">IMPACT</span>
                </div>
                <div class="soundboard-item-title">Sub-Bass Boom</div>
                <div class="soundboard-item-desc">Deep dramatic pitch dive impact that shakes the live stage with suspense.</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-boom" style="background: linear-gradient(135deg, #9333ea, #7e22ce);">
                  <span>📡 BROADCAST BOOM</span>
                </button>
              </div>

              <!-- Item: Correct Ding -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">🔔</span>
                  <span class="soundboard-item-tag tag-sfx">ACCENT</span>
                </div>
                <div class="soundboard-item-title">Ding / Correct Bell</div>
                <div class="soundboard-item-desc">Harmonic double bell chime indicating correct answers and achievements.</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-ding" style="background: linear-gradient(135deg, #10b981, #059669);">
                  <span>📡 BROADCAST BELL</span>
                </button>
              </div>

              <!-- Item: Buzzer -->
              <div class="soundboard-item-card">
                <div class="soundboard-item-header">
                  <span class="soundboard-item-icon">❌</span>
                  <span class="soundboard-item-tag tag-sfx">BUZZER</span>
                </div>
                <div class="soundboard-item-title">Host Buzzer</div>
                <div class="soundboard-item-desc">Classic gameshow harsh buzzer for incorrect answers and bankrupts.</div>
                <button type="button" class="btn-soundboard-broadcast" id="btn-sb-buzzer" style="background: linear-gradient(135deg, #dc2626, #b91c1c);">
                  <span>📡 BROADCAST BUZZER</span>
                </button>
              </div>
            </div>
          </div>

          <!-- TAB CONTENT 2: ROSE BLOOM -->
          <div id="tab-content-rose" class="storyboard-tab-content" style="display: none;">
            <div class="storyboard-header" style="margin-bottom: 16px;">
              <h2 class="storyboard-title" style="color: #fb7185;">🌹 “ROSE GIFT” HOST-CONTROLLED STORYBOARD</h2>
              <p class="storyboard-subtitle">
                A Rose feels like the viewer is <strong>planting something beautiful in the Playground</strong>. Multiple roses grow the garden!
              </p>
            </div>

            <!-- Tier Testing Action Bar -->
            <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
              <button type="button" class="btn-host-rose-trigger" id="btn-test-rose-1" style="padding: 8px 16px; min-height: 48px; font-size: 12px;">
                <span>🌹 TEST 1 ROSE (SINGLE BLOOM)</span>
              </button>
              <button type="button" class="btn-host-rose-trigger" id="btn-test-rose-5" style="padding: 8px 16px; min-height: 48px; font-size: 12px; background: linear-gradient(135deg, #059669, #be123c);">
                <span>🌹🌹 TEST 5 ROSES (GARDEN)</span>
              </button>
              <button type="button" class="btn-host-rose-trigger" id="btn-test-rose-10" style="padding: 8px 16px; min-height: 48px; font-size: 12px;">
                <span>🌹 x10 GARDEN BLOOM</span>
              </button>
              <button type="button" class="btn-host-rose-trigger" id="btn-test-rose-25" style="padding: 8px 16px; min-height: 48px; font-size: 12px;">
                <span>🌹 x25 ROSE STORM</span>
              </button>
              <button type="button" class="btn-host-rose-trigger" id="btn-test-rose-50" style="padding: 8px 16px; min-height: 48px; font-size: 12px; background: linear-gradient(135deg, #f59e0b, #be123c);">
                <span>🌹 x50+ PLAYGROUND GARDEN</span>
              </button>
            </div>

            <!-- 12-Panel Grid for Rose -->
            <div class="storyboard-grid">
              <!-- Panel 1 -->
              <div class="storyboard-card">
                <div class="storyboard-card-header">
                  <span class="storyboard-badge badge-host">HOST NOTIFICATION</span>
                  <span style="font-size: 11px; font-weight: 800; color: #94a3b8;">PANEL 1</span>
                </div>
                <div class="storyboard-card-title">Rose Received (0.0–0.25s)</div>
                <div class="storyboard-visual-box" style="border-color: #fb7185;">
                  <div style="font-weight: 800; color: #fff;">🌹 ROSE RECEIVED</div>
                  <div style="font-size: 11px; color: #6ee7b7;">@username sent a Rose</div>
                </div>
                <div class="storyboard-desc">
                  Small host-side notification appears. LIVE screen does nothing yet—no automatic interruption!
                </div>
              </div>

              <!-- Panel 2 -->
              <div class="storyboard-card">
                <div class="storyboard-card-header">
                  <span class="storyboard-badge badge-host">HOST PRESSES</span>
                  <span style="font-size: 11px; font-weight: 800; color: #94a3b8;">PANEL 2</span>
                </div>
                <div class="storyboard-card-title">Host Presses [ 🌹 ROSE ] (0.25–0.5s)</div>
                <div class="storyboard-visual-box">
                  <div>[ 🌹 ROSE ] ➜ <strong>🌹 SENT!</strong></div>
                  <div style="font-size: 11px; color: #a7f3d0; margin-top: 4px;">Button physical press + glow</div>
                </div>
                <div class="storyboard-desc">
                  The host presses the button at the perfect dramatic moment. Tactile audio & physical depression confirm dispatch.
                </div>
              </div>

              <!-- Panel 3 -->
              <div class="storyboard-card">
                <div class="storyboard-card-header">
                  <span class="storyboard-badge badge-live">LIVE STAGE</span>
                  <span style="font-size: 11px; font-weight: 800; color: #94a3b8;">PANEL 3</span>
                </div>
                <div class="storyboard-card-title">A Seed of Light Appears (0.5–0.9s)</div>
                <div class="storyboard-visual-box">
                  <div style="font-size: 20px;">✦ • ✨</div>
                  <div style="font-size: 11px; color: #fde047;">*ting* + soft magical chime</div>
                </div>
                <div class="storyboard-desc">
                  Instead of flashing a rose, a tiny glowing seed of light descends gracefully toward the bottom ground.
                </div>
              </div>

              <!-- Panel 4 -->
              <div class="storyboard-card">
                <div class="storyboard-card-header">
                  <span class="storyboard-badge badge-live">GROUND TOUCH</span>
                  <span style="font-size: 11px; font-weight: 800; color: #94a3b8;">PANEL 4</span>
                </div>
                <div class="storyboard-card-title">The Seed is Planted (0.9–1.2s)</div>
                <div class="storyboard-visual-box">
                  <div>(   🌱   )</div>
                  <div style="font-size: 11px; color: #34d399;">Circular emerald ripple spreads</div>
                </div>
                <div class="storyboard-desc">
                  Seed touches ground. A circular ripple spreads outward and a bright green sprout emerges quickly.
                </div>
              </div>

              <!-- Panel 5 -->
              <div class="storyboard-card">
                <div class="storyboard-card-header">
                  <span class="storyboard-badge badge-live">GROWTH</span>
                  <span style="font-size: 11px; font-weight: 800; color: #94a3b8;">PANEL 5</span>
                </div>
                <div class="storyboard-card-title">The Stem Grows (1.2–1.5s)</div>
                <div class="storyboard-visual-box">
                  <div>🌿 ┃ 🌿</div>
                  <div style="font-size: 11px; color: #10b981;">pop ➜ stretch ➜ bounce</div>
                </div>
                <div class="storyboard-desc">
                  Satisfying game animation! Stem shoots upward, two leaves unfurl, and it sways gently reacting to audience.
                </div>
              </div>

              <!-- Panel 6 -->
              <div class="storyboard-card">
                <div class="storyboard-card-header">
                  <span class="storyboard-badge badge-live">ANTICIPATION</span>
                  <span style="font-size: 11px; font-weight: 800; color: #94a3b8;">PANEL 6</span>
                </div>
                <div class="storyboard-card-title">Rose Bud Appears (1.5–1.8s)</div>
                <div class="storyboard-visual-box">
                  <div style="font-size: 24px;">🌹</div>
                  <div style="font-size: 11px; color: #fb7185;">Wiggle + 0.1s dramatic pause</div>
                </div>
                <div class="storyboard-desc">
                  Closed rosebud wiggles at top of stem. The entire screen pauses for ~0.1s anticipation before the bloom.
                </div>
              </div>

              <!-- Panel 7 -->
              <div class="storyboard-card">
                <div class="storyboard-card-header">
                  <span class="storyboard-badge badge-live">SPECTACLE</span>
                  <span style="font-size: 11px; font-weight: 800; color: #94a3b8;">PANEL 7</span>
                </div>
                <div class="storyboard-card-title">Rose Bloom! (1.8–2.15s)</div>
                <div class="storyboard-visual-box">
                  <div style="font-size: 20px;">🌸 🌹 🌸</div>
                  <div style="font-size: 11px; color: #f43f5e;">Petals 1, 2, 3, 4 unfold + *boing*</div>
                </div>
                <div class="storyboard-desc">
                  Petals unfold in lyrical sequence. The flower gives a joyful bounce and settles into a radiant bloom.
                </div>
              </div>

              <!-- Panel 8 -->
              <div class="storyboard-card">
                <div class="storyboard-card-header">
                  <span class="storyboard-badge badge-live">ELEGANCE</span>
                  <span style="font-size: 11px; font-weight: 800; color: #94a3b8;">PANEL 8</span>
                </div>
                <div class="storyboard-card-title">Petals Fly Across Screen (2.15–2.6s)</div>
                <div class="storyboard-visual-box">
                  <div>🌸 ⮵ 🌸 ⤹ 🌸 ⮴</div>
                  <div style="font-size: 11px; color: #fbcfe8;">Curved wind paths & soft breeze</div>
                </div>
                <div class="storyboard-desc">
                  Silky petals float outward, curling, spinning, and drifting along curved wind currents across gameplay.
                </div>
              </div>

              <!-- Panel 9 -->
              <div class="storyboard-card">
                <div class="storyboard-card-header">
                  <span class="storyboard-badge badge-system">TRIBUTE</span>
                  <span style="font-size: 11px; font-weight: 800; color: #94a3b8;">PANEL 9</span>
                </div>
                <div class="storyboard-card-title">“ROSE BLOOM!” Tribute (2.6–3.0s)</div>
                <div class="storyboard-visual-box">
                  <div style="font-weight: 900; color: #fff;">🌹 ROSE BLOOM! 🌹</div>
                  <div style="font-size: 11px; color: #fde047;">@username THANK YOU!</div>
                </div>
                <div class="storyboard-desc">
                  Clean tribute celebrates the gifter who planted love in the Playground without obscuring game state.
                </div>
              </div>

              <!-- Panel 10 -->
              <div class="storyboard-card">
                <div class="storyboard-card-header">
                  <span class="storyboard-badge badge-live">RE-INTEGRATION</span>
                  <span style="font-size: 11px; font-weight: 800; color: #94a3b8;">PANEL 10</span>
                </div>
                <div class="storyboard-card-title">Energy Returns to Game (3.0–3.4s)</div>
                <div class="storyboard-visual-box">
                  <div>🌹 ── ✨ ── ✦ ──▶ GAME</div>
                  <div style="font-size: 11px; color: #34d399;">Spark travels down stem to UI</div>
                </div>
                <div class="storyboard-desc">
                  The flower glows. A golden spark travels down the stem and arcs into the game stage interface.
                </div>
              </div>

              <!-- Panel 11 -->
              <div class="storyboard-card">
                <div class="storyboard-card-header">
                  <span class="storyboard-badge badge-live">GAME BLOOM</span>
                  <span style="font-size: 11px; font-weight: 800; color: #94a3b8;">PANEL 11</span>
                </div>
                <div class="storyboard-card-title">Game Bloom! (3.4–3.7s)</div>
                <div class="storyboard-visual-box">
                  <div>🌿 🌹 ✨ 🌸 🌿</div>
                  <div style="font-size: 11px; color: #a7f3d0;">Soft border vines & tiny roses</div>
                </div>
                <div class="storyboard-desc">
                  Soft boom. A gentle wave spreads across screen borders with momentary vines and sparkles for 0.3s.
                </div>
              </div>

              <!-- Panel 12 -->
              <div class="storyboard-card">
                <div class="storyboard-card-header">
                  <span class="storyboard-badge badge-live">CONTINUATION</span>
                  <span style="font-size: 11px; font-weight: 800; color: #94a3b8;">PANEL 12</span>
                </div>
                <div class="storyboard-card-title">Final Petal (3.7–4.0s)</div>
                <div class="storyboard-visual-box">
                  <div style="font-size: 22px;">🌸 ⮵ ✨</div>
                  <div style="font-size: 11px; color: #94a3b8;">Floats up ➜ Dissolves ➜ Game on!</div>
                </div>
                <div class="storyboard-desc">
                  Everything fades except one little petal floating upward with an ethereal chime. Seamless return to round.
                </div>
              </div>
            </div>
          </div>

          <!-- TAB CONTENT: HEART ME -->
          <div id="tab-content-heart" class="storyboard-tab-content" style="display: none;">
            <div class="storyboard-header" style="margin-bottom: 16px;">
              <h2 class="storyboard-title">“HEART ME” HOST-CONTROLLED STORYBOARD</h2>
              <p class="storyboard-subtitle">
                High-energy support! Host presses <strong>❤️ SEND HEART</strong> at the exact comedic or celebratory moment.
              </p>
            </div>

            <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 20px;">
              <button type="button" class="btn-host-heart-trigger" id="btn-modal-test-heart" style="padding: 10px 24px;">
                <span>🚀</span>
                <span>TEST HEART ME LIVE SEQUENCE NOW</span>
              </button>
            </div>

            <div class="storyboard-grid">
              <div class="storyboard-card">
                <div class="storyboard-card-header"><span class="storyboard-badge badge-host">HOST VIEW</span><span>PANEL 1</span></div>
                <div class="storyboard-card-title">Normal Host Controller Screen</div>
                <div class="storyboard-visual-box"><div>[ START ] [ NEXT ] [ PAUSE ]</div><div style="color: #f472b6; font-weight: 800; margin-top: 6px;">❤️ SEND HEART</div></div>
                <div class="storyboard-desc">Game running normally with global interaction matrix ready.</div>
              </div>
              <div class="storyboard-card">
                <div class="storyboard-card-header"><span class="storyboard-badge badge-system">STREAM EVENT</span><span>PANEL 2</span></div>
                <div class="storyboard-card-title">Viewer Sends “Heart Me”</div>
                <div class="storyboard-visual-box" style="border-color: #f472b6;"><div style="color: #fff; font-weight: 800;">❤️ HEART ME RECEIVED</div><div style="font-size: 11px; color: #f7e07d;">from @AudienceMember</div></div>
                <div class="storyboard-desc">Host sees gentle reminder badge; LIVE screen does nothing yet.</div>
              </div>
              <div class="storyboard-card">
                <div class="storyboard-card-header"><span class="storyboard-badge badge-host">HOST ACTION</span><span>PANEL 3</span></div>
                <div class="storyboard-card-title">Host Presses Heart Button</div>
                <div class="storyboard-visual-box"><div>Normal ➜ Pressed ➜ <strong style="color: #f472b6;">Activated!</strong></div></div>
                <div class="storyboard-desc">Tactile click + glowing aura dispatch command.</div>
              </div>
              <div class="storyboard-card">
                <div class="storyboard-card-header"><span class="storyboard-badge badge-host">DISPATCH</span><span>PANEL 4</span></div>
                <div class="storyboard-card-title">Controller Sends Energy Signal</div>
                <div class="storyboard-visual-box"><div>🎮 ─── ❤️ ✨ ───▶ 📺 LIVE</div><div style="font-size: 11px; color: #34d399; margin-top: 4px;">❤️ SENT! + Cooldown 2.5s</div></div>
                <div class="storyboard-desc">Heart particle zips off remote; button enters safety cooldown.</div>
              </div>
              <div class="storyboard-card">
                <div class="storyboard-card-header"><span class="storyboard-badge badge-live">LIVE STAGE</span><span>PANEL 5</span></div>
                <div class="storyboard-card-title">LIVE Screen Receives Signal</div>
                <div class="storyboard-visual-box"><div style="font-size: 26px;">❤️</div><div style="font-size: 11px; color: #f472b6;">*thump-thump* (Pulses 1x, then 2x)</div></div>
                <div class="storyboard-desc">Acoustic double pulse with radiant golden shockwave.</div>
              </div>
              <div class="storyboard-card">
                <div class="storyboard-card-header"><span class="storyboard-badge badge-live">SPECTACLE</span><span>PANEL 6</span></div>
                <div class="storyboard-card-title">Giant Heart Explosion</div>
                <div class="storyboard-visual-box"><div>💥 💗 🎮 ✨ 👑 💎 🕹️ 💥</div><div style="font-size: 11px; color: #f7e07d; margin-top: 4px;">75+ Radiant Particles</div></div>
                <div class="storyboard-desc">Detonates with gold stars, controllers, and love emojis.</div>
              </div>
              <div class="storyboard-card">
                <div class="storyboard-card-header"><span class="storyboard-badge badge-live">HERO MOMENT</span><span>PANEL 7</span></div>
                <div class="storyboard-card-title">“HEART POWER!” Headline</div>
                <div class="storyboard-visual-box"><div style="font-size: 16px; font-weight: 900; color: #ffffff;">❤️ HEART POWER! ❤️</div></div>
                <div class="storyboard-desc">Bouncing high-contrast 3D headline acknowledges chat.</div>
              </div>
              <div class="storyboard-card">
                <div class="storyboard-card-header"><span class="storyboard-badge badge-live">RE-INTEGRATION</span><span>PANEL 8</span></div>
                <div class="storyboard-card-title">Energy Returns to Game</div>
                <div class="storyboard-visual-box"><div>⚡ ⚪ ───▶ 🎲 GAME STAGE</div></div>
                <div class="storyboard-desc">Plasma orb dives into game cards surging with gold light.</div>
              </div>
              <div class="storyboard-card">
                <div class="storyboard-card-header"><span class="storyboard-badge badge-live">CONTINUATION</span><span>PANEL 9</span></div>
                <div class="storyboard-card-title">Tiny Heart Floats Away</div>
                <div class="storyboard-visual-box"><div style="font-size: 20px;">💗 ⮵ ✨</div></div>
                <div class="storyboard-desc">Gentle sparkle dissolve; game continues without interruption.</div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const closeBtn = document.getElementById('btn-close-storyboard');
      if (closeBtn) closeBtn.onclick = () => this.closeStoryboardModal();

      // Tab switcher
      const tabSoundboard = document.getElementById('tab-btn-soundboard');
      const tabRose = document.getElementById('tab-btn-rose');
      const tabHeart = document.getElementById('tab-btn-heart');
      const contentSoundboard = document.getElementById('tab-content-soundboard');
      const contentRose = document.getElementById('tab-content-rose');
      const contentHeart = document.getElementById('tab-content-heart');

      const selectTab = (tabName) => {
        if (tabSoundboard) tabSoundboard.classList.remove('active');
        if (tabRose) tabRose.classList.remove('active');
        if (tabHeart) tabHeart.classList.remove('active');

        if (contentSoundboard) contentSoundboard.style.display = 'none';
        if (contentRose) contentRose.style.display = 'none';
        if (contentHeart) contentHeart.style.display = 'none';

        if (tabName === 'heart') {
          if (tabHeart) tabHeart.classList.add('active');
          if (contentHeart) contentHeart.style.display = 'block';
        } else if (tabName === 'rose') {
          if (tabRose) tabRose.classList.add('active');
          if (contentRose) contentRose.style.display = 'block';
        } else {
          if (tabSoundboard) tabSoundboard.classList.add('active');
          if (contentSoundboard) contentSoundboard.style.display = 'block';
        }
      };

      if (tabSoundboard) tabSoundboard.onclick = () => selectTab('soundboard');
      if (tabRose) tabRose.onclick = () => selectTab('rose');
      if (tabHeart) tabHeart.onclick = () => selectTab('heart');

      // GIFT SOUNDBOARD BUTTON HANDLERS
      const sbMap = [
        { id: 'btn-sb-rose-1', sfx: 'rose', anim: 'ROSE_BLOOM_TRIGGER', payload: { count: 1, viewerName: '@AudienceRose' }, label: 'Rose Bloom (x1)' },
        { id: 'btn-sb-rose-5', sfx: 'rose', anim: 'ROSE_BLOOM_TRIGGER', payload: { count: 5, viewerName: '@GardenLover' }, label: '5x Rose Garden' },
        { id: 'btn-sb-rose-10', sfx: 'rose', anim: 'ROSE_BLOOM_TRIGGER', payload: { count: 10, viewerName: '@PlaygroundSupporter' }, label: '10x Rose Storm' },
        { id: 'btn-sb-rose-50', sfx: 'rose', anim: 'ROSE_BLOOM_TRIGGER', payload: { count: 50, viewerName: '@RoyalGifter' }, label: '50x Wonderland' },
        { id: 'btn-sb-heart', sfx: 'heart', anim: 'HEART_ME_TRIGGER', payload: { viewerName: '@HeartSupporter' }, label: 'Heart Me Blast' },
        { id: 'btn-sb-gift', sfx: 'gift', anim: 'INTERACTION_GIFT', payload: { giftName: 'Gift Shower', count: 1 }, label: 'Gift Shower' },
        { id: 'btn-sb-like', sfx: 'like', anim: 'INTERACTION_LIKE', payload: { count: 50 }, label: 'Like Shower' },
        { id: 'btn-sb-follow', sfx: 'follow', anim: 'INTERACTION_FOLLOW', payload: { followerName: 'New VIP Follower' }, label: 'Follow Salute' },
        { id: 'btn-sb-chat', sfx: 'ding', anim: 'INTERACTION_CHAT', payload: { comment: 'Let\'s go Dion Playground!' }, label: 'Chat Wave' },
        { id: 'btn-sb-airhorn', sfx: 'airhorn', anim: null, payload: {}, label: 'DJ Air Horn' },
        { id: 'btn-sb-applause', sfx: 'applause', anim: null, payload: {}, label: 'Crowd Applause' },
        { id: 'btn-sb-drumroll', sfx: 'drumroll', anim: null, payload: {}, label: 'Drum Roll & Crash' },
        { id: 'btn-sb-boom', sfx: 'boom', anim: null, payload: {}, label: 'Sub-Bass Boom' },
        { id: 'btn-sb-ding', sfx: 'ding', anim: null, payload: {}, label: 'Ding / Correct Bell' },
        { id: 'btn-sb-buzzer', sfx: 'buzzer', anim: null, payload: {}, label: 'Host Buzzer' }
      ];

      sbMap.forEach(item => {
        const btn = document.getElementById(item.id);
        if (btn) {
          btn.onclick = () => {
            this.broadcastGiftSound(item.sfx, item.anim, item.payload, item.label);
          };
        }
      });

      // Test actions in modal (Rose storyboard tab)
      const testRose1 = document.getElementById('btn-test-rose-1');
      const testRose5 = document.getElementById('btn-test-rose-5');
      const testRose10 = document.getElementById('btn-test-rose-10');
      const testRose25 = document.getElementById('btn-test-rose-25');
      const testRose50 = document.getElementById('btn-test-rose-50');
      const testHeart = document.getElementById('btn-modal-test-heart');

      if (testRose1) testRose1.onclick = () => { this.closeStoryboardModal(); this.onHostPressRose(1, '@Player1'); };
      if (testRose5) testRose5.onclick = () => { this.closeStoryboardModal(); this.onHostPressRose(5, '@GardenLover'); };
      if (testRose10) testRose10.onclick = () => { this.closeStoryboardModal(); this.onHostPressRose(10, '@IslandStreamer'); };
      if (testRose25) testRose25.onclick = () => { this.closeStoryboardModal(); this.onHostPressRose(25, '@DionSuperFan'); };
      if (testRose50) testRose50.onclick = () => { this.closeStoryboardModal(); this.onHostPressRose(50, '@PlaygroundKing'); };
      if (testHeart) testHeart.onclick = () => { this.closeStoryboardModal(); this.onHostPressHeart(); };
    }

    openStoryboardModal(tab = 'soundboard') {
      const modal = document.getElementById('dion-storyboard-modal');
      if (modal) {
        modal.classList.add('active');
        const tabBtn = document.getElementById(`tab-btn-${tab}`);
        if (tabBtn) {
          tabBtn.click();
        } else {
          const defaultTab = document.getElementById('tab-btn-soundboard') || document.getElementById('tab-btn-rose');
          if (defaultTab) defaultTab.click();
        }
      }
    }

    closeStoryboardModal() {
      const modal = document.getElementById('dion-storyboard-modal');
      if (modal) modal.classList.remove('active');
    }
  }

  // Export singleton
  window.HeartPowerSystem = new HeartPowerSystem();

  // Auto-attach when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const isLive = window.location.pathname.includes('live') || 
                   document.querySelector('.live-screen') || 
                   document.querySelector('.live-page');

    const isHost = window.location.pathname.includes('host') || 
                   document.querySelector('.host-screen') || 
                   document.querySelector('.host-main');

    if (isLive || window.location.pathname.includes('dual-view')) {
      window.HeartPowerSystem.attachLiveOverlay();
      window.HeartPowerSystem.attachRoseOverlay();
    }

    if (isHost) {
      window.HeartPowerSystem.attachHostBar();
    }
  });
})();
