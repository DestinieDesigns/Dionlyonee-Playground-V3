/**
 * Trivia UI Renderer
 */
(function () {
  const diffColors = {
    easy: { bg: 'rgba(16, 185, 129, 0.18)', border: '#10b981', text: '#34d399' },
    medium: { bg: 'rgba(234, 179, 8, 0.18)', border: '#eab308', text: '#fde047' },
    hard: { bg: 'rgba(249, 115, 22, 0.18)', border: '#f97316', text: '#fb923c' },
    expert: { bg: 'rgba(168, 85, 247, 0.18)', border: '#a855f7', text: '#c084fc' },
    extreme: { bg: 'rgba(239, 68, 68, 0.22)', border: '#ef4444', text: '#f87171' }
  };

  const TriviaUI = {
    renderQuestionCard(containerEl, q, isHost = false) {
      if (!containerEl || !q) return;

      const diff = (q.difficulty || q.tier || 'medium').toLowerCase();
      const style = diffColors[diff] || diffColors.medium;
      const subcat = q.subcategory && q.subcategory !== q.category ? ` • ${q.subcategory}` : '';

      containerEl.innerHTML = `
        <div style="
          background: #111624; border: 1px solid rgba(168, 85, 247, 0.4);
          border-radius: 18px; padding: 28px; box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);
          text-align: center; position: relative;
        ">
          <!-- Meta Tags Header -->
          <div style="display: flex; justify-content: center; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
            <span style="font-size: 11px; font-weight: 800; color: #c084fc; letter-spacing: 2px; text-transform: uppercase;">
              ${q.category || 'TRIVIA'}${subcat}
            </span>
            <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; background: ${style.bg}; border: 1px solid ${style.border}; color: ${style.text};">
              ${diff.toUpperCase()}
            </span>
            <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 900; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #f7e07d;">
              ${q.points || 200} PTS
            </span>
          </div>

          <!-- Question Text -->
          <h2 style="font-family: 'Cinzel', serif; font-size: 24px; color: #ffffff; margin-bottom: 24px; line-height: 1.4;">
            ${q.question}
          </h2>

          <!-- Options Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;" id="trivia-options-grid">
            ${(q.options || []).map((opt, i) => `
              <button class="trivia-opt-btn" data-opt="${opt}" style="
                padding: 14px 18px; border-radius: 10px; background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.12); color: #fff; font-size: 15px; font-weight: 700;
                text-align: left; cursor: pointer; transition: all 0.2s;
              ">
                <span style="color: #c084fc; margin-right: 8px;">${String.fromCharCode(65 + i)}.</span>
                ${opt}
                ${isHost && opt === q.answer ? ' <span style="color: #10b981; float: right; font-weight: 900;">✓ (CORRECT)</span>' : ''}
              </button>
            `).join('')}
          </div>

          <!-- Host-Only Hint Box -->
          ${isHost && q.hint ? `
            <div style="
              margin-top: 20px; padding: 12px 16px; border-radius: 10px;
              background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.4);
              text-align: left; display: flex; align-items: flex-start; gap: 10px;
            ">
              <span style="font-size: 18px; line-height: 1;">💡</span>
              <div style="font-size: 13px; line-height: 1.4;">
                <strong style="color: #fbbf24; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; display: block; margin-bottom: 2px;">
                  Host Hint (Only visible on your screen)
                </strong>
                <span style="color: #fef08a;">
                  ${q.hint.replace(/^Host Hint:\s*/i, '')}
                </span>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }
  };

  window.TriviaUI = TriviaUI;
})();
