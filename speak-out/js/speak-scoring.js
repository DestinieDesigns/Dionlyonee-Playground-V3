/**
 * DIONLYONEE SPEAK OUT! - Scoring Engine
 */
(function () {
  class SpeakScoring {
    constructor() {
      this.totalScore = 0;
      this.challengesPassed = 0;
      this.challengesFailed = 0;
      this.challengesSkipped = 0;
      this.scoreListeners = [];

      this.pointTable = {
        easy: 50,
        medium: 100,
        hard: 200,
        extreme: 500
      };
    }

    onScoreChange(cb) {
      if (typeof cb === 'function') this.scoreListeners.push(cb);
    }

    notify(delta, reason) {
      this.scoreListeners.forEach(cb => {
        try { cb(this.getState(), delta, reason); } catch (e) {}
      });
    }

    getPointsForDifficulty(difficulty = 'medium') {
      const clean = String(difficulty || 'medium').toLowerCase();
      return this.pointTable[clean] || 100;
    }

    addPass(difficulty = 'medium', extraBonus = 0) {
      const basePoints = this.getPointsForDifficulty(difficulty);
      const totalEarned = basePoints + extraBonus;
      this.totalScore += totalEarned;
      this.challengesPassed++;
      this.notify(totalEarned, `Challenge Passed (${difficulty})`);
      return { totalScore: this.totalScore, pointsEarned: totalEarned, basePoints, extraBonus };
    }

    addFail() {
      this.challengesFailed++;
      this.notify(0, 'Challenge Failed');
      return { totalScore: this.totalScore };
    }

    addSkip() {
      this.challengesSkipped++;
      this.notify(0, 'Challenge Skipped');
      return { totalScore: this.totalScore };
    }

    addManualBonus(amount = 50, reason = 'Co-Host Bonus') {
      const pts = Number(amount) || 50;
      this.totalScore += pts;
      this.notify(pts, reason);
      return { totalScore: this.totalScore, ptsAdded: pts };
    }

    reset() {
      this.totalScore = 0;
      this.challengesPassed = 0;
      this.challengesFailed = 0;
      this.challengesSkipped = 0;
      this.notify(0, 'Reset');
    }

    syncFromState(state) {
      if (!state) return;
      if (typeof state.totalScore === 'number') this.totalScore = state.totalScore;
      if (typeof state.challengesPassed === 'number') this.challengesPassed = state.challengesPassed;
      if (typeof state.challengesFailed === 'number') this.challengesFailed = state.challengesFailed;
      if (typeof state.challengesSkipped === 'number') this.challengesSkipped = state.challengesSkipped;
    }

    getState() {
      return {
        totalScore: this.totalScore,
        challengesPassed: this.challengesPassed,
        challengesFailed: this.challengesFailed,
        challengesSkipped: this.challengesSkipped,
        totalCompleted: this.challengesPassed + this.challengesFailed + this.challengesSkipped
      };
    }
  }

  window.SpeakScoring = SpeakScoring;
})();
