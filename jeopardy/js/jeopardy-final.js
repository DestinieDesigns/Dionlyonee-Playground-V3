/**
 * Final Jeopardy Handler
 */
(function () {
  const JeopardyFinal = {
    clue: {
      category: 'HISTORIC EXPEDITIONS',
      clue: 'In 1911, this Norwegian explorer led the first expedition to successfully reach the South Pole.',
      answer: 'Who is Roald Amundsen?'
    },

    getFinalClue() {
      return this.clue;
    }
  };

  window.JeopardyFinal = JeopardyFinal;
})();
