/* Presentation only. Game data, storage keys, networking, and scoring remain owned by the existing games. */
(() => {
  'use strict';
  const line = 'fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"';
  const art = {
    wheel: '<circle cx="50" cy="50" r="37"/><circle cx="50" cy="50" r="8"/><path d="M50 13v29m0 16v29M13 50h29m16 0h29M24 24l20 20m12 12 20 20M24 76l20-20m12-12 20-20M44 9h12l-6 13Z"/>',
    jeopardy: '<rect x="11" y="17" width="78" height="64" rx="7"/><path d="M37 17v64m26-64v64M11 39h78M11 60h78"/><path d="M23 26h3m22 0h3m22 0h3M23 48h3m22 0h3m22 0h3M23 69h3m22 0h3m22 0h3"/>',
    trivia: '<path d="M38 77h24m-24 8h24M34 58C8 37 25 12 50 13c25-1 42 24 16 45l-4 11H38Z"/><path d="M43 35c0-11 21-11 15 0-2 4-8 4-8 11m0 8v1"/>',
    'word-reveal': '<rect x="9" y="30" width="25" height="39" rx="4"/><rect x="38" y="25" width="25" height="39" rx="4"/><rect x="67" y="30" width="25" height="39" rx="4"/><path d="m15 59 7-20 7 20m-12-6h10m22-17v17m0 5v1m26-19 10 20m0-20L75 60"/>',
    'speak-out': '<rect x="35" y="12" width="30" height="48" rx="15"/><path d="M23 43v5a27 27 0 0 0 54 0v-5M50 75v14m-15 0h30M42 25h16m-16 10h16"/>',
    charades: '<path d="M15 23q16 10 32 0v27c0 22-25 26-32 3ZM53 37q16 10 32 0v27c0 22-25 26-32 3Z"/><path d="M23 38h3m10 0h3m-15 13q7 10 15 0m22 2h3m10 0h3m-15 16q7-10 15 0"/>',
    'guess-lyrics': '<path d="M36 72V25l43-9v48M36 36l43-9"/><ellipse cx="25" cy="74" rx="11" ry="8"/><ellipse cx="68" cy="66" rx="11" ry="8"/>',
    hangman: '<path d="M13 87h44M26 87V15h43v12"/><circle cx="69" cy="38" r="11"/><path d="M69 49v22m0-14L55 65m14-8 14 8M69 71 58 85m11-14 11 14"/>',
    'most-likely': '<path d="M13 20h60v40H39L23 75V60H13Z"/><path d="M80 35h8v42H67L54 88V77H44"/><circle cx="33" cy="40" r="3"/><circle cx="44" cy="40" r="3"/><circle cx="55" cy="40" r="3"/>',
    'hot-take': '<path d="M56 12c5 26-12 22-5 39 10-4 13-10 14-17 20 22 20 51-11 55C19 91 16 63 29 45c2 13 8 14 9 14-10-22 14-31 18-47Z"/>',
    'would-you-rather': '<path d="M50 86V54M50 54 25 31m25 23 25-23M25 31v18m0-18h18m32 0v18m0-18H57"/><circle cx="50" cy="18" r="6"/>',
    'finish-the-sentence': '<path d="M17 19h65v62H17Z M28 32h42M28 44h32M28 56h15m6 0h22M28 68h9m7 0h27"/>',
    'what-would-you-do': '<path d="M50 13 88 78H12Z"/><path d="M50 35v20m0 9v2M29 87h43"/>',
    'who-would-you-pick': '<circle cx="29" cy="30" r="12"/><circle cx="72" cy="30" r="12"/><path d="M9 72v-8a20 20 0 0 1 40 0v8m3 0v-8a20 20 0 0 1 40 0v8M43 83l7 7 13-15"/>',
    'emoji-guess': '<circle cx="50" cy="50" r="35"/><path d="M31 38v5m38-5v5M32 60q18 24 36 0"/><path d="m77 13 4 8 9 2-9 3-4 8-3-8-9-3 9-2Z"/>',
    'unscramble-it': '<rect x="12" y="20" width="32" height="37" rx="5"/><rect x="57" y="43" width="32" height="37" rx="5"/><path d="m20 47 8-18 8 18m-13-5h10m34 10h10l-10 18h10M53 24h28m-9-8 9 8-9 8M19 76h28m-9-8 9 8-9 8"/>',
    'who-dis': '<circle cx="48" cy="32" r="17"/><path d="M15 86V73c0-27 66-27 66 0v13M43 29c0-10 17-7 10 0-3 2-5 3-5 7m0 5v1"/>',
    default: '<rect x="23" y="18" width="57" height="65" rx="8" transform="rotate(12 50 50)"/><rect x="15" y="15" width="57" height="65" rx="8" fill="#ede4d2"/><path d="m43 29 6 14 14 6-14 6-6 14-6-14-14-6 14-6Z"/>'
  };
  function decorate(root) {
    root.querySelectorAll('.card-icon[data-destinie-game]:not([data-illustrated])').forEach(el => {
      el.dataset.illustrated = 'true';
      el.innerHTML = `<svg viewBox="0 0 100 100" ${line} aria-hidden="true">${art[el.dataset.destinieGame] || art.default}</svg>`;
    });
    root.querySelectorAll('.brand-title,.brand-sub,.brand-badge,.brand-tag,.brand-name,.host-message,.brand-subtitle,.live-brand-name,.live-brand-game,.live-waiting-title,.live-message,.live-footer,.dion-gate-title,.live-waiting-badge,.host-brand-name,.host-brand-tag').forEach(el => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (/dionlyonee/i.test(node.data)) node.data = node.data.replace(/dionlyonee/gi, 'Destinie');
      }
    });
  }
  function init() {
    decorate(document);
    document.querySelectorAll('.brand-logo,.brand-icon,.live-logo').forEach(el => {
      // Replace ornamental emoji badges, never emoji puzzle content.
      if (!el.querySelector('*') && el.textContent.trim().length <= 4) {
        el.innerHTML = `<svg viewBox="0 0 100 100" ${line} width="32" height="32" aria-hidden="true">${art.wheel}</svg>`;
      }
    });
    const dialogSpecs = [
      ['gameLauncherModal', 'modalTitle', () => window.closeModal?.()],
      ['roomSwitcherModal', 'roomDialogTitle', () => window.closeRoomModal?.()]
    ];
    dialogSpecs.forEach(([id, title, close]) => {
      const modal = document.getElementById(id);
      if (!modal) return;
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-labelledby', title);
      let previousFocus;
      document.addEventListener('focusin', event => { if (!modal.contains(event.target)) previousFocus = event.target; });
      const focusable = () => [...modal.querySelectorAll('a[href],button,input,select,textarea,[tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
      const sync = () => {
        const open = modal.classList.contains('active');
        modal.setAttribute('aria-hidden', String(!open));
        if (open) {
          if (!modal.contains(document.activeElement)) previousFocus = document.activeElement;
          modal.setAttribute('aria-modal', 'true');
          focusable()[0]?.focus();
        } else {
          modal.removeAttribute('aria-modal');
          previousFocus?.focus();
        }
      };
      new MutationObserver(sync).observe(modal, { attributes: true, attributeFilter: ['class'] });
      modal.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); close(); }
        if (event.key !== 'Tab') return;
        const items = focusable();
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      });
      sync();
    });
    // Games render presentation dynamically; observe additions without touching state or user input.
    const observer = new MutationObserver(records => {
      if (records.some(record => record.addedNodes.length)) decorate(document);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll('img.wait-hero-img').forEach(img => {
      img.src = new URL('../assets/images/destinie-games-room.svg', document.querySelector('script[src$="destinie-ui.js"]').src).href;
      img.alt = 'Destinie illustrated games room';
      img.removeAttribute('onerror');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
