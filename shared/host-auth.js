/**
 * Dionlyonee Playground - Host Security Gate & Authentication
 * Locks all Host controls behind the official passcode: Brown123
 */
(function () {
  'use strict';

  const PASSCODE = 'Brown123';
  const STORAGE_KEY = 'dion_host_authorized_v2';
  const callbacks = [];

  const HostAuth = {
    PASSCODE,

    isUnlocked() {
      try {
        const sessionVal = sessionStorage.getItem(STORAGE_KEY);
        const localVal = localStorage.getItem(STORAGE_KEY);
        return sessionVal === PASSCODE || localVal === PASSCODE;
      } catch (e) {
        return false;
      }
    },

    verify(input) {
      if (!input) return false;
      return input.trim() === PASSCODE;
    },

    unlock(input, remember = true) {
      if (this.verify(input)) {
        try {
          sessionStorage.setItem(STORAGE_KEY, PASSCODE);
          if (remember) {
            localStorage.setItem(STORAGE_KEY, PASSCODE);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (e) {}

        this.removeLockGate();
        this.addLockIndicator();

        // Trigger callbacks
        while (callbacks.length > 0) {
          const cb = callbacks.shift();
          try { cb(); } catch (err) { console.error(err); }
        }

        window.dispatchEvent(new CustomEvent('dion-host-unlocked', { detail: { time: Date.now() } }));
        return true;
      }
      return false;
    },

    lock() {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}

      const indicator = document.getElementById('dion-host-lock-indicator');
      if (indicator) indicator.remove();

      this.mountLockGate();
      window.dispatchEvent(new CustomEvent('dion-host-locked', { detail: { time: Date.now() } }));
    },

    requireHostAccess(onUnlocked) {
      const isSolo = new URLSearchParams(window.location.search).get('singleplayer') === 'true';
      if (isSolo || this.isUnlocked()) {
        if (typeof onUnlocked === 'function') onUnlocked();
      } else {
        if (typeof onUnlocked === 'function') callbacks.push(onUnlocked);
        this.mountLockGate();
      }
    },

    mountLockGate() {
      if (document.getElementById('dion-host-security-gate')) {
        return;
      }

      // Ensure style is injected
      this.injectStyles();

      const gate = document.createElement('div');
      gate.id = 'dion-host-security-gate';
      gate.className = 'dion-host-gate-overlay';
      gate.innerHTML = `
        <div class="dion-host-gate-box">
          <div class="dion-gate-badge">
            <span class="dion-gate-dot"></span>
            <span>RESTRICTED ACCESS</span>
          </div>

          <div class="dion-gate-icon">👑</div>
          <h2 class="dion-gate-title">DIONLYONEE HOST CONSOLE</h2>
          <p class="dion-gate-desc">
            This screen contains active host teleprompter data, secret answers, and live stream control triggers. Enter the host passcode to unlock.
          </p>

          <form id="dion-gate-form" class="dion-gate-form" onsubmit="return false;">
            <div class="dion-gate-input-wrapper">
              <input 
                type="password" 
                id="dion-gate-passcode" 
                class="dion-gate-input" 
                placeholder="Enter Host Passcode" 
                autocomplete="off" 
                autofocus
                required
              />
              <button type="button" id="dion-gate-toggle-eye" class="dion-gate-eye-btn" title="Show/Hide Passcode">👁️</button>
            </div>

            <div id="dion-gate-error" class="dion-gate-error" style="display: none;">
              ⚠️ Incorrect passcode. Access denied.
            </div>

            <button type="submit" id="dion-gate-submit-btn" class="dion-gate-btn-unlock">
              🔓 UNLOCK HOST CONSOLE
            </button>

            <div class="dion-gate-options">
              <label class="dion-gate-remember">
                <input type="checkbox" id="dion-gate-remember-cb" checked />
                <span>Remember on this device</span>
              </label>
            </div>
          </form>

          <div class="dion-gate-footer">
            <a href="${this.getHubUrl()}" class="dion-gate-back-link">← Return to Playground Hub</a>
          </div>
        </div>
      `;

      document.body.appendChild(gate);

      // Prevent interactions behind gate
      document.body.classList.add('dion-host-locked-body');

      // Bind gate events
      const form = document.getElementById('dion-gate-form');
      const input = document.getElementById('dion-gate-passcode');
      const errorMsg = document.getElementById('dion-gate-error');
      const toggleEye = document.getElementById('dion-gate-toggle-eye');
      const rememberCb = document.getElementById('dion-gate-remember-cb');

      toggleEye?.addEventListener('click', () => {
        if (input.type === 'password') {
          input.type = 'text';
          toggleEye.textContent = '🙈';
        } else {
          input.type = 'password';
          toggleEye.textContent = '👁️';
        }
      });

      const handleAttempt = () => {
        const val = input.value;
        const remember = rememberCb ? rememberCb.checked : true;
        if (this.unlock(val, remember)) {
          // Success
          errorMsg.style.display = 'none';
        } else {
          // Failure
          errorMsg.style.display = 'block';
          input.classList.add('dion-gate-input-shake');
          setTimeout(() => input.classList.remove('dion-gate-input-shake'), 500);
          input.focus();
          input.select();
        }
      };

      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAttempt();
      });

      // Auto-focus passcode input
      setTimeout(() => input?.focus(), 100);
    },

    removeLockGate() {
      const gate = document.getElementById('dion-host-security-gate');
      if (gate) {
        gate.classList.add('dion-gate-fadeout');
        setTimeout(() => gate.remove(), 250);
      }
      document.body.classList.remove('dion-host-locked-body');
    },

    addLockIndicator() {
      if (document.getElementById('dion-host-lock-indicator')) return;

      const indicator = document.createElement('div');
      indicator.id = 'dion-host-lock-indicator';
      indicator.className = 'dion-host-floating-lock';
      indicator.innerHTML = `
        <button type="button" class="btn-dion-quick-lock" title="Lock Host Console">
          🔒 <span>LOCK HOST</span>
        </button>
      `;

      document.body.appendChild(indicator);

      indicator.querySelector('button')?.addEventListener('click', () => {
        if (confirm('Lock the host console now? Host passcode will be required to re-enter.')) {
          this.lock();
        }
      });
    },

    getHubUrl() {
      // Find relative path to index.html
      const path = window.location.pathname;
      if (path.includes('/wheel/host/') || path.includes('/jeopardy/host/') || path.includes('/speak-out/host/') || path.includes('/trivia/host/') || path.includes('/word-reveal/host/')) {
        return '../../index.html';
      }
      if (path.includes('/host.html') || path.includes('/index.html')) {
        return '../index.html';
      }
      return '/index.html';
    },

    injectStyles() {
      if (document.getElementById('dion-host-auth-styles')) return;

      const style = document.createElement('style');
      style.id = 'dion-host-auth-styles';
      style.textContent = `
        .dion-host-locked-body {
          overflow: hidden !important;
        }

        .dion-host-gate-overlay {
          position: fixed !important;
          inset: 0 !important;
          z-index: 99999999 !important;
          background: rgba(7, 9, 14, 0.96) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 20px !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
          animation: dionGateFadeIn 0.25s ease-out !important;
        }

        .dion-gate-fadeout {
          opacity: 0 !important;
          transition: opacity 0.25s ease-out !important;
          pointer-events: none !important;
        }

        @keyframes dionGateFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        .dion-host-gate-box {
          background: #111420 !important;
          border: 1px solid rgba(212, 175, 55, 0.5) !important;
          border-radius: 24px !important;
          max-width: 460px !important;
          width: 100% !important;
          padding: 32px 28px !important;
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.2) !important;
          text-align: center !important;
          color: #ffffff !important;
          box-sizing: border-box !important;
        }

        .dion-gate-badge {
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          background: rgba(245, 158, 11, 0.15) !important;
          border: 1px solid rgba(245, 158, 11, 0.4) !important;
          color: #fbbf24 !important;
          padding: 4px 12px !important;
          border-radius: 999px !important;
          font-size: 0.75rem !important;
          font-weight: 800 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          margin-bottom: 16px !important;
        }

        .dion-gate-dot {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background: #f59e0b !important;
          box-shadow: 0 0 8px #f59e0b !important;
        }

        .dion-gate-icon {
          font-size: 3rem !important;
          line-height: 1 !important;
          margin-bottom: 8px !important;
        }

        .dion-gate-title {
          font-family: 'Montserrat', -apple-system, sans-serif !important;
          font-size: 1.5rem !important;
          font-weight: 900 !important;
          color: #f59e0b !important;
          margin: 0 0 8px 0 !important;
          letter-spacing: 0.03em !important;
        }

        .dion-gate-desc {
          color: #94a3b8 !important;
          font-size: 0.85rem !important;
          line-height: 1.5 !important;
          margin: 0 0 22px 0 !important;
        }

        .dion-gate-input-wrapper {
          position: relative !important;
          margin-bottom: 12px !important;
          display: flex !important;
          align-items: center !important;
        }

        .dion-gate-input {
          width: 100% !important;
          background: #090c14 !important;
          border: 2px solid rgba(212, 175, 55, 0.4) !important;
          border-radius: 12px !important;
          padding: 12px 44px 12px 16px !important;
          font-size: 1rem !important;
          color: #ffffff !important;
          font-weight: 600 !important;
          letter-spacing: 0.05em !important;
          outline: none !important;
          box-sizing: border-box !important;
          transition: border-color 0.2s, box-shadow 0.2s !important;
        }

        .dion-gate-input:focus {
          border-color: #f59e0b !important;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.3) !important;
        }

        .dion-gate-input-shake {
          animation: dionShake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both !important;
          border-color: #ef4444 !important;
        }

        @keyframes dionShake {
          10%, 90% { transform: translateX(-3px); }
          20%, 80% { transform: translateX(5px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
        }

        .dion-gate-eye-btn {
          position: absolute !important;
          right: 12px !important;
          background: none !important;
          border: none !important;
          cursor: pointer !important;
          font-size: 1.1rem !important;
          color: #94a3b8 !important;
          padding: 4px !important;
        }

        .dion-gate-error {
          background: rgba(239, 68, 68, 0.15) !important;
          border: 1px solid rgba(239, 68, 68, 0.4) !important;
          color: #f87171 !important;
          padding: 8px 12px !important;
          border-radius: 8px !important;
          font-size: 0.8rem !important;
          font-weight: 700 !important;
          margin-bottom: 12px !important;
        }

        .dion-gate-btn-unlock {
          width: 100% !important;
          background: linear-gradient(135deg, #f59e0b, #d97706) !important;
          color: #000000 !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 13px !important;
          font-size: 0.95rem !important;
          font-weight: 900 !important;
          letter-spacing: 0.05em !important;
          cursor: pointer !important;
          transition: transform 0.15s, box-shadow 0.15s !important;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3) !important;
        }

        .dion-gate-btn-unlock:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.45) !important;
        }

        .dion-gate-options {
          display: flex !important;
          justify-content: center !important;
          margin-top: 12px !important;
        }

        .dion-gate-remember {
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          color: #94a3b8 !important;
          font-size: 0.75rem !important;
          cursor: pointer !important;
          user-select: none !important;
        }

        .dion-gate-footer {
          margin-top: 20px !important;
          padding-top: 16px !important;
          border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        .dion-gate-back-link {
          color: #64748b !important;
          font-size: 0.8rem !important;
          text-decoration: none !important;
          font-weight: 700 !important;
          transition: color 0.15s !important;
        }

        .dion-gate-back-link:hover {
          color: #f59e0b !important;
        }

        .dion-host-floating-lock {
          position: fixed !important;
          bottom: 16px !important;
          right: 16px !important;
          z-index: 99999 !important;
        }

        .btn-dion-quick-lock {
          background: rgba(17, 20, 32, 0.85) !important;
          border: 1px solid rgba(245, 158, 11, 0.4) !important;
          color: #cbd5e1 !important;
          padding: 6px 12px !important;
          border-radius: 999px !important;
          font-size: 0.75rem !important;
          font-weight: 800 !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          gap: 5px !important;
          backdrop-filter: blur(10px) !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
          transition: all 0.2s !important;
        }

        .btn-dion-quick-lock:hover {
          background: rgba(239, 68, 68, 0.2) !important;
          border-color: #ef4444 !important;
          color: #ffffff !important;
        }
      `;
      document.head.appendChild(style);
    },

    autoInit() {
      // Determine if current page is a Host page
      const path = window.location.pathname.toLowerCase();
      const isHostPage = path.includes('host') || window.IS_HOST_PAGE === true;

      if (isHostPage) {
        if (!this.isUnlocked()) {
          this.mountLockGate();
        } else {
          this.addLockIndicator();
        }
      }
    }
  };

  // Run autoInit as soon as DOM is interactive/loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HostAuth.autoInit());
  } else {
    HostAuth.autoInit();
  }

  window.HostAuth = HostAuth;
})();
