/**
 * Dionlyonee Sound Engine & SoundManager
 * Vanilla Web Audio API Soundboard + FirebaseRoom / RoomSync Network Sound Broadcaster
 */
(function () {
  class DionlyoneeSoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.volume = 0.85;
      this.audioElements = {};
      this.soundListeners = [];
      this.recentSoundMap = new Map();
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
      if (window.RoomSync && window.RoomSync.roomId) {
        return window.RoomSync.roomId;
      }
      if (window.FirebaseRoom && window.FirebaseRoom.roomId) {
        return window.FirebaseRoom.roomId;
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

    init() {
      this.getAudioContext();
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

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.checkLiveStageAudio());
      } else {
        this.checkLiveStageAudio();
      }
    }

    checkLiveStageAudio() {
      const isLiveStage = window.location.pathname.includes('live') || 
                          window.location.search.includes('role=live') ||
                          document.getElementById('live-stage') ||
                          document.getElementById('wheel-canvas');

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
        if (window.RoomSync && typeof window.RoomSync.onSound === 'function') {
          if (!this._roomSyncSubscribed) {
            this._roomSyncSubscribed = true;
            window.RoomSync.onSound((sound, data) => {
              this.handleRemoteSound(sound, data);
            });
          }
        }
        if (window.FirebaseRoom && typeof window.FirebaseRoom.onSound === 'function') {
          if (!this._firebaseSubscribed) {
            this._firebaseSubscribed = true;
            window.FirebaseRoom.onSound((sound, data) => {
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

    handleRemoteSound(sound, data = {}) {
      if (!sound || this.muted) return;

      const ts = data.timestamp || Date.now();
      const key = `${sound}_${Math.floor(ts / 350)}`;
      if (this.recentSoundMap.has(key)) return;
      this.recentSoundMap.set(key, ts);

      const now = Date.now();
      for (const [k, t] of this.recentSoundMap.entries()) {
        if (now - t > 3000) this.recentSoundMap.delete(k);
      }

      const ctx = this.getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      this.play(sound);
      this.notifyListeners(sound, data, true);

      try {
        window.dispatchEvent(new CustomEvent('dion:sound', {
          detail: { sound, remote: true, ...data }
        }));
      } catch (e) {}
    }

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

    broadcastSound(soundName, meta = {}) {
      if (!soundName) return;
      const roomId = this.getRoomId();
      const now = Date.now();

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

      if (this.channel) {
        try { this.channel.postMessage(payload); } catch (e) {}
      }

      if (window.RoomSync && typeof window.RoomSync.broadcastSound === 'function') {
        try { window.RoomSync.broadcastSound(soundName, meta); } catch (e) {}
      }

      if (window.FirebaseRoom && typeof window.FirebaseRoom.broadcastSound === 'function' && window.FirebaseRoom !== window.RoomSync) {
        try { window.FirebaseRoom.broadcastSound(soundName, meta); } catch (e) {}
      }

      fetch(`/api/rooms/${roomId}/sound`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sound: soundName, meta: meta || {} })
      }).catch(() => {});
    }

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

    play(soundName) {
      if (this.muted) return;
      const sound = (soundName || '').toLowerCase().trim();

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

    playSynth(soundName) {
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const t = ctx.currentTime;

        switch (soundName) {
          case 'correct':
          case 'ding': {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(523.25, t);
            osc1.frequency.setValueAtTime(659.25, t + 0.1);
            osc1.frequency.setValueAtTime(1046.5, t + 0.2);

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
              interval *= 1.07;
            }
            break;
          }

          case 'bankrupt': {
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
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(659.25, t);

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
        console.warn('Audio playback error:', err);
      }
    }
  }

  // Global instances
  const soundEngine = new DionlyoneeSoundEngine();
  window.sounds = soundEngine;
  window.SoundManager = soundEngine;
  window.playSound = (name, broadcast) => soundEngine.playSound(name, broadcast);

  // Self-contained lightweight Canvas Confetti helper
  function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#d4af37', '#ffffff', '#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'];
    const particles = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 16,
        vy: Math.random() * -14 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        alpha: 1,
      });
    }

    let animationFrame;
    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravity
        p.vx *= 0.99;
        p.rotation += p.vRot;
        p.alpha -= 0.008;

        if (p.alpha > 0 && p.y < canvas.height + 50) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(update);
      } else {
        cancelAnimationFrame(animationFrame);
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    }

    update();
  }
  window.triggerConfetti = triggerConfetti;
})();
