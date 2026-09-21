/**
 * Jeopardy Scoring Controller
 */
(function () {
  const JeopardyScoring = {
    awardCorrect(contestant, clueValue) {
      if (!contestant) return;
      contestant.roundScore = (contestant.roundScore || 0) + Number(clueValue);
    },

    deductWrong(contestant, clueValue) {
      if (!contestant) return;
      contestant.roundScore = (contestant.roundScore || 0) - Number(clueValue);
    }
  };

  window.JeopardyScoring = JeopardyScoring;
})();
