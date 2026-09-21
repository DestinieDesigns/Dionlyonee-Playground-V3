/**
 * Jeopardy Board Renderer
 */
(function () {
  const JeopardyBoard = {
    renderBoard(containerEl, data, onClueClick, isHost = false) {
      if (!containerEl || !Array.isArray(data)) return;

      let html = '<div class="jeopardy-grid">';

      // Headers
      data.forEach(col => {
        html += `
          <div class="jeopardy-header-cell">
            ${col.category}
          </div>
        `;
      });

      // 5 Rows of Clues ($200 - $1000)
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < data.length; c++) {
          const clue = (data[c].clues && data[c].clues[r]) || { value: (r + 1) * 200 };
          const isCleared = window.JeopardyEngine ? window.JeopardyEngine.isCleared(c, r) : false;

          html += `
            <div class="jeopardy-clue-cell ${isCleared ? 'cleared' : ''}" data-col="${c}" data-row="${r}">
              ${isCleared ? '' : `$${clue.value}`}
            </div>
          `;
        }
      }

      html += '</div>';
      containerEl.innerHTML = html;

      if (onClueClick) {
        containerEl.querySelectorAll('.jeopardy-clue-cell:not(.cleared)').forEach(cell => {
          cell.addEventListener('click', () => {
            const col = parseInt(cell.getAttribute('data-col'));
            const row = parseInt(cell.getAttribute('data-row'));
            const clueObj = data[col].clues[row];
            onClueClick(col, row, clueObj);
          });
        });
      }
    }
  };

  window.JeopardyBoard = JeopardyBoard;
})();
