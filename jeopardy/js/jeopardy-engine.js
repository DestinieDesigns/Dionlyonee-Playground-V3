/**
 * Jeopardy Engine Core
 */
(function () {
  class JeopardyEngine {
    constructor() {
      this.selectedClue = null;
      this.clearedClues = new Set();
      this.dailyDoubleCoords = { col: 2, row: 3 };
    }

    selectClue(categoryIdx, clueIdx, clueObj) {
      this.selectedClue = { categoryIdx, clueIdx, ...clueObj };
      this.clearedClues.add(`${categoryIdx}-${clueIdx}`);
      return this.selectedClue;
    }

    isCleared(categoryIdx, clueIdx) {
      return this.clearedClues.has(`${categoryIdx}-${clueIdx}`);
    }

    isDailyDouble(categoryIdx, clueIdx) {
      return categoryIdx === this.dailyDoubleCoords.col && clueIdx === this.dailyDoubleCoords.row;
    }

    reset() {
      this.selectedClue = null;
      this.clearedClues.clear();
    }
  }

  window.JeopardyEngine = new JeopardyEngine();
})();
