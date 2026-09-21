/**
 * Wheel Contestant View & Turn Controller
 */
(function () {
  const WheelContestants = {
    renderPodiums(containerEl, contestants, activeIdx) {
      if (!containerEl || !Array.isArray(contestants)) return;

      containerEl.innerHTML = contestants.map((c, idx) => {
        const isActive = idx === activeIdx;
        return `
          <div class="contestant-card ${isActive ? 'active-turn' : ''}" style="
            background: #111624; border: 2px solid ${isActive ? (c.color || '#d4af37') : 'rgba(255,255,255,0.1)'};
            border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;
            box-shadow: ${isActive ? '0 0 20px rgba(212,175,55,0.3)' : 'none'};
          ">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 20px;">${c.avatar || '👤'}</span>
              <div>
                <div style="font-weight: 800; color: #fff; font-size: 14px;">${c.name}</div>
                <div style="font-size: 11px; color: ${isActive ? '#f7e07d' : '#94a3b8'};">
                  ${isActive ? '▶ ACTIVE TURN' : 'WAITING'}
                </div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-family: 'Cinzel', serif; font-size: 18px; font-weight: 900; color: #10b981;">
                $${(c.roundScore || 0).toLocaleString()}
              </div>
              <div style="font-size: 11px; color: #64748b;">
                BANK: $${(c.bank || 0).toLocaleString()}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  };

  window.WheelContestants = WheelContestants;
})();
