/**
 * Word Reveal Mystery - Hint Engine
 * Displays tiered clue cards with visual indicators for Tier 1 (Free Theme), Tier 2 (Specific Riddle), and Tier 3 (Dead Giveaway).
 */
(function () {
  const HintEngine = {
    renderHint(containerEl, puzzle, activeTier = 1) {
      if (!containerEl) return;
      if (!puzzle) {
        containerEl.innerHTML = '';
        return;
      }

      const tier1 = puzzle.hintTier1 || puzzle.hint || 'Mystery theme';
      const tier2 = puzzle.hintTier2 || 'Specific clue available';
      const tier3 = puzzle.hintTier3 || 'Dead giveaway clue available';

      containerEl.innerHTML = `
        <div class="hint-tiers-container">
          <div class="hint-tier-card ${activeTier >= 1 ? 'unlocked active' : 'locked'}">
            <div class="hint-tier-header">
              <span class="hint-tier-badge">💡 CLUE 1 (THEME)</span>
              <span class="hint-tier-status">${activeTier >= 1 ? 'UNLOCKED' : 'LOCKED'}</span>
            </div>
            <div class="hint-tier-body">
              ${activeTier >= 1 ? tier1 : 'Unlock to reveal theme'}
            </div>
          </div>

          <div class="hint-tier-card ${activeTier >= 2 ? 'unlocked active' : 'locked'}">
            <div class="hint-tier-header">
              <span class="hint-tier-badge">🔍 CLUE 2 (DETAILS)</span>
              <span class="hint-tier-status">${activeTier >= 2 ? 'UNLOCKED' : 'LOCKED (-100 PTS)'}</span>
            </div>
            <div class="hint-tier-body">
              ${activeTier >= 2 ? tier2 : 'Press Unlock Clue 2 for specific details (-100 pts)'}
            </div>
          </div>

          <div class="hint-tier-card ${activeTier >= 3 ? 'unlocked active' : 'locked'}">
            <div class="hint-tier-header">
              <span class="hint-tier-badge">🚨 CLUE 3 (DEAD GIVEAWAY)</span>
              <span class="hint-tier-status">${activeTier >= 3 ? 'UNLOCKED' : 'LOCKED (-200 PTS)'}</span>
            </div>
            <div class="hint-tier-body">
              ${activeTier >= 3 ? tier3 : 'Press Unlock Clue 3 for dead giveaway clue (-200 pts)'}
            </div>
          </div>
        </div>
      `;
    }
  };

  window.HintEngine = HintEngine;
})();
