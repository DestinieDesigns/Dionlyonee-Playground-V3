/**
 * Word Reveal Mystery - Reveal Engine (Tile Renderer)
 * Renders high-impact 3D flip card tiles clustered by words with responsive wrapping and interaction support.
 */
(function () {
  const RevealEngine = {
    renderTiles(containerEl, text, revealedSet, options = {}) {
      if (!containerEl) return;
      const clean = String(text || '').toUpperCase();
      const isInteractive = Boolean(options.interactive);
      const onTileClick = typeof options.onTileClick === 'function' ? options.onTileClick : null;
      const isSolved = Boolean(options.isSolved);

      // Split into words while preserving spaces & punctuation
      const words = clean.split(' ');
      let globalCharIndex = 0;

      const wordsHtml = words.map((word, wordIdx) => {
        const lettersHtml = word.split('').map((char) => {
          const charIdx = globalCharIndex++;
          const isLetter = /[A-Z0-9]/.test(char);
          const isRevealed = revealedSet ? revealedSet.has(charIdx) : true;
          const isLastRevealed = options.lastRevealedIndex === charIdx;

          if (!isLetter) {
            // Special punctuation tile (e.g. apostrophe, dash, question mark)
            return `
              <div class="word-tile punctuation ${isSolved ? 'solved-glow' : ''}">
                ${char}
              </div>
            `;
          }

          return `
            <div 
              class="word-tile ${isRevealed ? 'revealed' : 'hidden-mystery'} ${isLastRevealed ? 'just-revealed' : ''} ${isSolved ? 'solved-glow' : ''} ${isInteractive && !isRevealed ? 'clickable-tile' : ''}"
              data-char-index="${charIdx}"
              data-char="${char}"
              title="${isInteractive && !isRevealed ? 'Click to reveal this letter' : ''}"
            >
              <div class="tile-inner">
                <div class="tile-front">
                  <span class="mystery-symbol">?</span>
                </div>
                <div class="tile-back">
                  <span class="tile-letter">${char}</span>
                </div>
              </div>
            </div>
          `;
        }).join('');

        // Account for space after word in global index
        globalCharIndex++;

        return `
          <div class="word-group" data-word-index="${wordIdx}">
            ${lettersHtml}
          </div>
        `;
      }).join('');

      containerEl.innerHTML = wordsHtml;

      // Attach tile click listener if interactive
      if (isInteractive && onTileClick) {
        const tiles = containerEl.querySelectorAll('.clickable-tile');
        tiles.forEach(tile => {
          tile.addEventListener('click', (e) => {
            const idx = parseInt(tile.getAttribute('data-char-index'), 10);
            if (!isNaN(idx)) {
              onTileClick(idx);
            }
          });
        });
      }
    }
  };

  window.RevealEngine = RevealEngine;
})();
