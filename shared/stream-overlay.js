/**
 * Dionlyonee Game Show Playground - Stream Overlay Adapter
 * Adds dedicated support for TikTok Live (9:16 Vertical / Mobile OBS),
 * Twitch / OBS Studio (16:9 Landscape), and Transparent Browser Source Overlays.
 */
(function () {
  'use strict';

  class StreamOverlayAdapter {
    constructor() {
      this.params = new URLSearchParams(window.location.search);
      this.platform = (this.params.get('platform') || this.params.get('stream') || this.params.get('mode') || '').toLowerCase();
      this.isTransparent = this.params.get('transparent') === '1' || this.params.get('transparent') === 'true';
      this.isClean = this.params.get('clean') === '1' || this.params.get('clean') === 'true' || this.params.get('obs') === '1';

      this.init();
    }

    init() {
      this.injectStyles();
      this.applyConfig();

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.mountUI());
      } else {
        this.mountUI();
      }

      // Global keyboard shortcut 'H' to toggle streamer HUD
      window.addEventListener('keydown', (e) => {
        if ((e.key === 'h' || e.key === 'H') && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
          this.toggleHUD();
        }
      });
    }

    injectStyles() {
      if (!document.querySelector('link[href*="stream-overlay.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/shared/stream-overlay.css';
        document.head.appendChild(link);
      }
    }

    applyConfig() {
      const body = document.body;
      if (!body) return;

      // Platform class
      if (this.platform === 'tiktok') {
        body.classList.add('platform-tiktok');
        body.classList.remove('platform-twitch');
      } else if (this.platform === 'twitch') {
        body.classList.add('platform-twitch');
        body.classList.remove('platform-tiktok');
      }

      // Transparency class
      if (this.isTransparent) {
        body.classList.add('stream-transparent');
      } else {
        body.classList.remove('stream-transparent');
      }
    }

    mountUI() {
      this.applyConfig();

      // Mount Tickers if not present
      this.ensureTickers();

      // Only mount HUD if not in clean OBS mode (unless user requested HUD or pressed H)
      if (!this.isClean) {
        this.createHUD();
      }
    }

    ensureTickers() {
      const header = document.querySelector('.live-header') || document.querySelector('header');
      if (!header || document.getElementById('dionStreamEngagement')) return;

      const ticker = document.createElement('div');
      ticker.id = 'dionStreamEngagement';

      ticker.innerHTML = `
        <div class="tiktok-engagement-bar">
          <span>🎵 TIKTOK LIVE</span>
          <span>•</span>
          <span>💖 Tap Screen for Likes</span>
          <span>•</span>
          <span>💬 Comment to Guess</span>
          <span>•</span>
          <span>🎁 Send Gifts for SFX!</span>
        </div>
        <div class="twitch-engagement-bar">
          <span>🟣 TWITCH LIVE</span>
          <span>•</span>
          <span>📺 OBS Browser Source</span>
          <span>•</span>
          <span>💬 Chat !guess or vote in live stream chat!</span>
        </div>
      `;

      header.insertAdjacentElement('afterend', ticker);
    }

    createHUD() {
      if (document.getElementById('streamOverlayHUD')) return;

      const hud = document.createElement('div');
      hud.id = 'streamOverlayHUD';
      hud.className = 'stream-hud-pill';

      const isTikTok = this.platform === 'tiktok';
      const isTwitch = this.platform === 'twitch';

      hud.innerHTML = `
        <button type="button" class="stream-hud-btn ${isTikTok ? 'tiktok-active' : ''}" id="btnHudTiktok" title="Switch to TikTok Live (9:16 Vertical Safe Zones)">
          🎵 TikTok Live
        </button>
        <button type="button" class="stream-hud-btn ${isTwitch ? 'twitch-active' : ''}" id="btnHudTwitch" title="Switch to Twitch / OBS (16:9 Landscape Widescreen)">
          🟣 Twitch / OBS
        </button>
        <button type="button" class="stream-hud-btn ${this.isTransparent ? 'active' : ''}" id="btnHudTrans" title="Toggle Transparent Background for Camera Overlays">
          ${this.isTransparent ? '🔳 Transparent: ON' : '⬛ Background: Solid'}
        </button>
        <button type="button" class="stream-hud-btn" id="btnHudCopy" title="Copy Browser Source URL for TikTok Live Studio or OBS">
          📋 Copy URL
        </button>
        <button type="button" class="stream-hud-btn" id="btnHudMin" style="padding: 4px 6px; font-size: 9px;" title="Hide Toolbar (Press 'H' to reopen)">
          ✕
        </button>
      `;

      document.body.appendChild(hud);

      // Event listeners
      document.getElementById('btnHudTiktok').addEventListener('click', () => this.switchPlatform('tiktok'));
      document.getElementById('btnHudTwitch').addEventListener('click', () => this.switchPlatform('twitch'));
      document.getElementById('btnHudTrans').addEventListener('click', () => this.toggleTransparency());
      document.getElementById('btnHudCopy').addEventListener('click', () => this.copyStreamURL());
      document.getElementById('btnHudMin').addEventListener('click', () => this.toggleHUD());
    }

    switchPlatform(target) {
      const url = new URL(window.location.href);
      if (this.platform === target) {
        url.searchParams.delete('platform');
        url.searchParams.delete('stream');
        this.platform = '';
      } else {
        url.searchParams.set('platform', target);
        this.platform = target;
      }
      window.location.href = url.toString();
    }

    toggleTransparency() {
      const url = new URL(window.location.href);
      if (this.isTransparent) {
        url.searchParams.delete('transparent');
        this.isTransparent = false;
      } else {
        url.searchParams.set('transparent', 'true');
        this.isTransparent = true;
      }
      window.location.href = url.toString();
    }

    toggleHUD() {
      const hud = document.getElementById('streamOverlayHUD');
      if (hud) {
        hud.classList.toggle('hidden-hud');
      } else {
        this.createHUD();
      }
    }

    copyStreamURL() {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('clean', '1'); // Default to clean OBS overlay
      const text = currentUrl.toString();

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('📋 Copied Stream Browser Source URL!');
        }).catch(() => {
          prompt('Copy Browser Source URL for TikTok / OBS:', text);
        });
      } else {
        prompt('Copy Browser Source URL for TikTok / OBS:', text);
      }
    }

    showToast(message) {
      let toast = document.getElementById('streamToastNotice');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'streamToastNotice';
        toast.className = 'stream-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }

  // Auto-instantiate
  window.StreamOverlayAdapter = new StreamOverlayAdapter();
})();
