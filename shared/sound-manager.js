/**
 * Dionlyonee Playground - Shared SoundManager Service
 * 
 * Provides high-fidelity synthesized Web Audio sound effects, audio file fallbacks,
 * and automatic cross-client broadcasting via FirebaseRoom / RoomSync / WebSocket.
 * 
 * Allows the Host to trigger sound effects that automatically play on all connected
 * Live Stage screens, with deduplication and auto-unlock for browser audio restrictions.
 */
(function () {
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.volume = 0.85;
      this.audioElements = {};
      this.soundListeners = [];
      this.recentSoundMap = new Map(); // key -> timestamp for deduplication
      this.unlocked = false;
      this.channel = null;

      this.initAudioElements();
      this.setupAutoUnlock();
      this.setupBroadcastChannel();
      this.setupSyncSubscription();
    }

    getRoomId() {
      if (window.RoomManager && typeof window.RoomManager.getRoom === 'function') {
        return window.RoomManager.getRoom();
      }
      if (window.FirebaseRoom && window.FirebaseRoom.roomId) {
        return window.FirebaseRoom.roomId;
      }
      if (window.RoomSync && window.RoomSync.roomId) {
        return window.RoomSync.roomId;
      }
      const params = new URLSearchParams(window.location.search);
      return (params.get('room') || 'DION1').toUpperCase();
    }

    initAudioElements() {
      const soundFiles = {
        correct: '/assets/sounds/correct.mp3',
        ding: '/assets/sounds/correct.mp3',
        wrong: '/assets/sounds/wrong.mp3',
        buzzer: '/assets/sounds/wrong.mp3',
        countdown: '/assets/sounds/countdown.mp3',
        spin: '/assets/sounds/spin.mp3',
        wheel: '/assets/sounds/spin.mp3',
        applause: '/assets/sounds/applause.mp3',
        cheer: '/assets/sounds/applause.mp3',
        winner: '/assets/sounds/winner.mp3',
        fanfare: '/assets/sounds/winner.mp3',
      };

      for (const [key, path] of Object.entries(soundFiles)) {
        try {
          const audio = new Audio(path);
          audio.preload = 'none';
          this.audioElements[key] = audio;
        } catch (e) {}
      }
    }

    getAudioContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    setupAutoUnlock() {
      const unlock = () => {
        const ctx = this.getAudioContext();
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().then(() => {
            this.unlocked = true;
            this.removeLiveStageAudioBadge();
          }).catch(() => {});
        } else if (ctx && ctx.state === 'running') {
          this.unlocked = true;
          this.removeLiveStageAudioBadge();
        }
      };

      ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((evt) => {
        window.addEventListener(evt, unlock, { capture: true, passive: true });
      });

      // If on a Live Stage screen, ensure banner or prompt if audio is suspended
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.checkLiveStageAudio());
      } else {
        this.checkLiveStageAudio();
      }
    }

    checkLiveStageAudio() {
      const isLiveStage = window.location.pathname.includes('live') || 
                          window.location.search.includes('role=live') ||
                          document.getElementById('live-question-card') ||
                          document.getElementById('live-stage') ||
                          document.querySelector('.live-header');

      if (isLiveStage) {
        setTimeout(() => {
          const ctx = this.getAudioContext();
          if (ctx && ctx.state === 'suspended' && !this.unlocked) {
            this.showLiveStageAudioBadge();
          }
        }, 1200);
      }
    }

    showLiveStageAudioBadge() {
      if (document.getElementById('live-stage-audio-badge')) return;
      const badge = document.createElement('div');
      badge.id = 'live-stage-audio-badge';
      badge.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: linear-gradient(135deg, #1e293b, #0f172a);
        color: #f8fafc;
        border: 2px solid #38bdf8;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5), 0 0 15px rgba(56,189,248,0.4);
        padding: 12px 20px;
        border-radius: 9999px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.5px;
        cursor: pointer;
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.25s ease;
        animation: audioPulse 2s infinite ease-in-out;
      `;
      badge.innerHTML = `
        <span style="font-size: 18px;">🔊</span>
        <span>Click to Enable Live Audio</span>
      `;

      badge.addEventListener('click', () => {
        const ctx = this.getAudioContext();
        if (ctx) {
          ctx.resume().then(() => {
            this.unlocked = true;
            this.play('reveal');
            this.removeLiveStageAudioBadge();
          });
        }
      });

      document.body.appendChild(badge);
    }

    removeLiveStageAudioBadge() {
      const badge = document.getElementById('live-stage-audio-badge');
      if (badge && badge.parentNode) {
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(10px)';
        setTimeout(() => {
          if (badge.parentNode) badge.parentNode.removeChild(badge);
        }, 300);
      }
    }

    setupBroadcastChannel() {
      const roomId = this.getRoomId();
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          this.channel = new BroadcastChannel(`dion_sound_${roomId}`);
          this.channel.onmessage = (e) => {
            if (e.data && (e.data.type === 'PLAY_SOUND' || e.data.type === 'SOUND')) {
              this.handleRemoteSound(e.data.sound || e.data.name, e.data);
            }
          };
        } catch (e) {}
      }

      window.addEventListener('roomchange', (e) => {
        if (e.detail && e.detail.roomId) {
          if (this.channel) {
            try { this.channel.close(); } catch (err) {}
          }
          try {
            this.channel = new BroadcastChannel(`dion_sound_${e.detail.roomId.toUpperCase()}`);
            this.channel.onmessage = (ev) => {
              if (ev.data && (ev.data.type === 'PLAY_SOUND' || ev.data.type === 'SOUND')) {
                this.handleRemoteSound(ev.data.sound || ev.data.name, ev.data);
              }
            };
          } catch (err) {}
        }
      });
    }

    setupSyncSubscription() {
      const bind = () => {
        if (window.FirebaseRoom && typeof window.FirebaseRoom.onSound === 'function') {
          if (!this._firebaseSubscribed) {
            this._firebaseSubscribed = true;
            window.FirebaseRoom.onSound((sound, data) => {
              this.handleRemoteSound(sound, data);
            });
          }
        }
        if (window.RoomSync && typeof window.RoomSync.onSound === 'function') {
          if (!this._roomSyncSubscribed) {
            this._roomSyncSubscribed = true;
            window.RoomSync.onSound((sound, data) => {
              this.handleRemoteSound(sound, data);
            });
          }
        }
      };

      bind();
      setTimeout(bind, 500);
      setTimeout(bind, 1500);
      window.addEventListener('DOMContentLoaded', bind);
    }

    /**
     * Handles incoming sound events triggered by remote hosts
     */
    handleRemoteSound(sound, data = {}) {
      if (!sound || this.muted) return;

      // Deduplication: prevent echo if received across WebSocket + BroadcastChannel + Polling
      const ts = data.timestamp || Date.now();
      const key = `${sound}_${Math.floor(ts / 350)}`;
      if (this.recentSoundMap.has(key)) return;
      this.recentSoundMap.set(key, ts);

      // Clean old keys
      const now = Date.now();
      for (const [k, t] of this.recentSoundMap.entries()) {
        if (now - t > 3000) this.recentSoundMap.delete(k);
      }

      // Auto resume AudioContext if suspended
      const ctx = this.getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      this.play(sound);
      this.notifyListeners(sound, data, true);

      // Dispatch custom DOM event
      try {
        window.dispatchEvent(new CustomEvent('dion:sound', {
          detail: { sound, remote: true, ...data }
        }));
      } catch (e) {}
    }

    /**
     * Trigger a sound effect.
     * When options.broadcast !== false, automatically broadcasts to all connected Live Stage clients!
     */
    playSound(soundName, options = true) {
      const isBroadcast = typeof options === 'boolean' ? options : (options && options.broadcast !== false);
      const isLocal = typeof options === 'object' && options.local === false ? false : true;
      const meta = (typeof options === 'object' && options.meta) ? options.meta : {};

      if (isLocal) {
        this.play(soundName);
      }

      if (isBroadcast) {
        this.broadcastSound(soundName, meta);
      }
    }

    /**
     * Broadcasts a sound effect to all connected Live Stage clients via Firebase/WebSocket/HTTP
     */
    broadcastSound(soundName, meta = {}) {
      if (!soundName) return;
      const roomId = this.getRoomId();
      const now = Date.now();

      // Deduplicate locally so host doesn't replay when receiving its own broadcast
      const key = `${soundName}_${Math.floor(now / 350)}`;
      this.recentSoundMap.set(key, now);

      const payload = {
        type: 'PLAY_SOUND',
        sound: soundName,
        roomId: roomId,
        source: 'host',
        meta: meta || {},
        timestamp: now
      };

      // 1. BroadcastChannel (fast local tab-to-tab)
      if (this.channel) {
        try { this.channel.postMessage(payload); } catch (e) {}
      }

      // 2. FirebaseRoom (if active)
      if (window.FirebaseRoom && typeof window.FirebaseRoom.broadcastSound === 'function') {
        try { window.FirebaseRoom.broadcastSound(soundName, meta); } catch (e) {}
      }

      // 3. RoomSync (if active)
      if (window.RoomSync && typeof window.RoomSync.broadcastSound === 'function' && window.RoomSync !== window.FirebaseRoom) {
        try { window.RoomSync.broadcastSound(soundName, meta); } catch (e) {}
      }

      // 4. HTTP POST directly to room sound endpoint
      fetch(`/api/rooms/${roomId}/sound`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sound: soundName, meta: meta || {} })
      }).catch(() => {});
    }

    /**
     * Register a sound listener
     */
    onSound(callback) {
      if (typeof callback === 'function') {
        this.soundListeners.push(callback);
      }
      return () => {
        const idx = this.soundListeners.indexOf(callback);
        if (idx !== -1) this.soundListeners.splice(idx, 1);
      };
    }

    notifyListeners(sound, data = {}, isRemote = false) {
      this.soundListeners.forEach(cb => {
        try { cb(sound, data, isRemote); } catch (e) { console.warn(e); }
      });
    }

    /**
     * Plays sound locally using audio asset or Web Audio synthesizer
     */
    play(soundName) {
      if (this.muted) return;
      const sound = (soundName || '').toLowerCase().trim();

      // Try playing preloaded audio element if exists
      const audio = this.audioElements[sound];
      if (audio) {
        audio.currentTime = 0;
        const p = audio.play();
        if (p && p.catch) {
          p.catch(() => this.playSynth(sound));
        }
        return;
      }

      this.playSynth(sound);
    }

    /**
     * Synthesize rich procedural game show audio effects
     */
    playSynth(name) {
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const t = ctx.currentTime;

        switch (name) {
          case 'correct':
          case 'ding': {
            // Cheerful three-tone ascending bell (C5 -> E5 -> C6)
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(523.25, t); // C5
            osc1.frequency.setValueAtTime(659.25, t + 0.1); // E5
            osc1.frequency.setValueAtTime(1046.5, t + 0.2); // C6

            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(1046.5, t + 0.2);

            gain.gain.setValueAtTime(0.01, t);
            gain.gain.linearRampToValueAtTime(0.28 * this.volume, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start(t);
            osc2.start(t);
            osc1.stop(t + 0.9);
            osc2.stop(t + 0.9);
            break;
          }

          case 'wrong':
          case 'buzzer': {
            // Game show harsh low double buzz
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sawtooth';
            osc2.type = 'square';

            osc1.frequency.setValueAtTime(130, t);
            osc1.frequency.linearRampToValueAtTime(110, t + 0.35);

            osc2.frequency.setValueAtTime(138.5, t);
            osc2.frequency.linearRampToValueAtTime(116.5, t + 0.35);

            gain.gain.setValueAtTime(0.3 * this.volume, t);
            gain.gain.setValueAtTime(0.3 * this.volume, t + 0.18);
            gain.gain.setValueAtTime(0.02, t + 0.2);
            gain.gain.setValueAtTime(0.3 * this.volume, t + 0.24);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start(t);
            osc2.start(t);
            osc1.stop(t + 0.6);
            osc2.stop(t + 0.6);
            break;
          }

          case 'reveal':
          case 'click': {
            // Crisp mechanical tile reveal
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, t);
            osc.frequency.exponentialRampToValueAtTime(320, t + 0.08);

            gain.gain.setValueAtTime(0.25 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.1);
            break;
          }

          case 'wheel_tick':
          case 'tick': {
            // Wheel spin mechanical flipper tick
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1100, t);
            osc.frequency.exponentialRampToValueAtTime(350, t + 0.035);

            gain.gain.setValueAtTime(0.22 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.045);
            break;
          }

          case 'wheel':
          case 'spin': {
            // Authentic TV wheel flutter with deceleration
            const clicks = 26;
            let currentDelay = 0;
            let interval = 0.05;

            for (let i = 0; i < clicks; i++) {
              const tickTime = t + currentDelay;
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();

              osc.type = 'triangle';
              osc.frequency.setValueAtTime(1050 - i * 15, tickTime);
              osc.frequency.exponentialRampToValueAtTime(380, tickTime + 0.025);

              const vol = Math.max(0.04, (1 - i / clicks * 0.75) * 0.22 * this.volume);
              gain.gain.setValueAtTime(vol, tickTime);
              gain.gain.exponentialRampToValueAtTime(0.001, tickTime + 0.03);

              osc.connect(gain);
              gain.connect(ctx.destination);

              osc.start(tickTime);
              osc.stop(tickTime + 0.035);

              currentDelay += interval;
              interval *= 1.07; // gradual deceleration
            }
            break;
          }

          case 'bankrupt': {
            // Sad descending trombone slide
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(320, t);
            osc.frequency.linearRampToValueAtTime(90, t + 0.9);

            gain.gain.setValueAtTime(0.28 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.95);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 1.0);
            break;
          }

          case 'cheer':
          case 'applause': {
            // Rich multi-voice celebratory chord
            const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.5];
            freqs.forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();

              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, t + idx * 0.07);

              gain.gain.setValueAtTime(0.01, t + idx * 0.07);
              gain.gain.linearRampToValueAtTime(0.18 * this.volume, t + idx * 0.07 + 0.04);
              gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.7);

              osc.connect(gain);
              gain.connect(ctx.destination);

              osc.start(t + idx * 0.07);
              osc.stop(t + idx * 0.07 + 0.75);
            });
            break;
          }

          case 'winner':
          case 'fanfare':
          case 'victory': {
            // Triumphant 4-note brass fanfare (C5 -> E5 -> G5 -> C6)
            const notes = [
              { f: 523.25, dur: 0.15 },
              { f: 659.25, dur: 0.15 },
              { f: 783.99, dur: 0.20 },
              { f: 1046.5, dur: 0.70 }
            ];

            let noteTime = t;
            notes.forEach(n => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();

              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(n.f, noteTime);

              gain.gain.setValueAtTime(0.01, noteTime);
              gain.gain.linearRampToValueAtTime(0.24 * this.volume, noteTime + 0.03);
              gain.gain.exponentialRampToValueAtTime(0.001, noteTime + n.dur);

              osc.connect(gain);
              gain.connect(ctx.destination);

              osc.start(noteTime);
              osc.stop(noteTime + n.dur + 0.05);

              noteTime += n.dur * 0.9;
            });
            break;
          }

          case 'countdown':
          case 'dailydouble':
          case 'beep': {
            // Urgent game countdown beep
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(659.25, t); // E5

            gain.gain.setValueAtTime(0.22 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.2);
            break;
          }

          case 'timeup':
          case 'timeout': {
            // Double alarm buzzer
            [0, 0.16].forEach(delay => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();

              osc.type = 'square';
              osc.frequency.setValueAtTime(220, t + delay);

              gain.gain.setValueAtTime(0.25 * this.volume, t + delay);
              gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.12);

              osc.connect(gain);
              gain.connect(ctx.destination);

              osc.start(t + delay);
              osc.stop(t + delay + 0.13);
            });
            break;
          }

          case 'horn':
          case 'airhorn': {
            // Stream hype multi-tone air horn
            const freqs = [466.16, 493.88, 523.25, 622.25];
            freqs.forEach(freq => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();

              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(freq, t);

              gain.gain.setValueAtTime(0.12 * this.volume, t);
              gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

              osc.connect(gain);
              gain.connect(ctx.destination);

              osc.start(t);
              osc.stop(t + 0.65);
            });
            break;
          }

          case 'drumroll': {
            // Rapid suspense drum roll
            const count = 18;
            for (let i = 0; i < count; i++) {
              const noteTime = t + i * 0.04;
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();

              osc.type = 'triangle';
              osc.frequency.setValueAtTime(140 + Math.random() * 40, noteTime);

              gain.gain.setValueAtTime(0.15 * (i / count + 0.3) * this.volume, noteTime);
              gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.035);

              osc.connect(gain);
              gain.connect(ctx.destination);

              osc.start(noteTime);
              osc.stop(noteTime + 0.04);
            }
            break;
          }

          case 'solve': {
            // Radiant major triad chord burst
            [523.25, 659.25, 783.99, 1046.5].forEach(freq => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();

              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, t);

              gain.gain.setValueAtTime(0.01, t);
              gain.gain.linearRampToValueAtTime(0.2 * this.volume, t + 0.04);
              gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

              osc.connect(gain);
              gain.connect(ctx.destination);

              osc.start(t);
              osc.stop(t + 0.65);
            });
            break;
          }

          default: {
            // Generic pleasant feedback tone
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, t);
            gain.gain.setValueAtTime(0.2 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.16);
            break;
          }
        }
      } catch (err) {
        console.warn('Sound synthesis error:', err);
      }
    }
  }

  // Global Singleton Instance
  const instance = new SoundManager();
  window.SoundManager = instance;
  window.sounds = instance;
  window.playSound = (name, broadcast) => instance.playSound(name, broadcast);
})();
