/**
 * Wheel Puzzle Engine
 * Formats phrases into official 4-row 52-tile TV layout (12, 14, 14, 12).
 */
(function () {
  const ROW_CAPACITIES = [12, 14, 14, 12];

  const PuzzleEngine = {
    layoutPhrase(phrase) {
      if (!phrase) return [[], [], [], []];
      const clean = phrase.toUpperCase().trim();
      const words = clean.split(/\s+/);
      const rows = [[], [], [], []];
      let currentRowIdx = 0;
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const capacity = ROW_CAPACITIES[currentRowIdx];
        const testLine = currentLine ? `${currentLine} ${word}` : word;

        if (testLine.length <= capacity) {
          currentLine = testLine;
        } else {
          rows[currentRowIdx] = currentLine;
          currentRowIdx++;
          if (currentRowIdx > 3) break;
          currentLine = word;
        }
      }
      if (currentRowIdx <= 3) {
        rows[currentRowIdx] = currentLine;
      }

      // Pad and center each row into tile objects
      return rows.map((line, rIdx) => {
        const capacity = ROW_CAPACITIES[rIdx];
        const text = line || '';
        const leftPadding = Math.floor((capacity - text.length) / 2);
        const tiles = [];

        for (let c = 0; c < capacity; c++) {
          const charIndex = c - leftPadding;
          if (charIndex >= 0 && charIndex < text.length) {
            const char = text[charIndex];
            if (char === ' ') {
              tiles.push({ char: ' ', isLetter: false, revealed: false, empty: true });
            } else if (/[A-Z]/.test(char)) {
              tiles.push({ char, isLetter: true, revealed: false, empty: false });
            } else {
              tiles.push({ char, isLetter: false, revealed: true, empty: false }); // punctuation
            }
          } else {
            tiles.push({ char: '', isLetter: false, revealed: false, empty: true });
          }
        }
        return tiles;
      });
    }
  };

  window.PuzzleEngine = PuzzleEngine;
})();
