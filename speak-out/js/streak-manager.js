/**
 * DIONLYONEE SPEAK OUT! - Streak Manager
 * Manages consecutive correct challenge streaks and milestone bonuses.
 */
(function () {
  class StreakManager {
    constructor() {
      this.currentStreak = 0;
      this.bestStreak = 0;
      this.streakListeners = [];
    }

    onStreakChange(cb) {
      if (typeof cb === 'function') this.streakListeners.push(cb);
    }

    notify(eventData) {
      this.streakListeners.forEach(cb => {
        try { cb(this.getState(), eventData); } catch (e) {}
      });
    }

    recordSuccess() {
      this.currentStreak++;
      if (this.currentStreak > this.bestStreak) {
        this.bestStreak = this.currentStreak;
      }

      let milestoneBonus = 0;
      let milestoneLabel = null;

      if (this.currentStreak === 3) {
        milestoneBonus = 50;
        milestoneLabel = '🔥 3X STREAK ON FIRE! (+50 BONUS)';
      } else if (this.currentStreak === 5) {
        milestoneBonus = 100;
        milestoneLabel = '⚡ 5X UNSTOPPABLE STREAK! (+100 BONUS)';
      } else if (this.currentStreak === 10) {
        milestoneBonus = 250;
        milestoneLabel = '👑 10X LEGENDARY STREAK! (+250 BONUS)';
      } else if (this.currentStreak > 10 && this.currentStreak % 5 === 0) {
        milestoneBonus = 200;
        milestoneLabel = `🌟 ${this.currentStreak}X GODLIKE STREAK! (+200 BONUS)`;
      }

      this.notify({ type: 'success', milestoneBonus, milestoneLabel });
      return { currentStreak: this.currentStreak, bestStreak: this.bestStreak, milestoneBonus, milestoneLabel };
    }

    recordFailure() {
      const wasStreak = this.currentStreak;
      this.currentStreak = 0;
      this.notify({ type: 'break', previousStreak: wasStreak });
      return { currentStreak: 0, bestStreak: this.bestStreak, brokenFrom: wasStreak };
    }

    reset() {
      this.currentStreak = 0;
      this.bestStreak = 0;
      this.notify({ type: 'reset' });
    }

    syncFromState(state) {
      if (!state) return;
      if (typeof state.currentStreak === 'number') this.currentStreak = state.currentStreak;
      if (typeof state.bestStreak === 'number') this.bestStreak = state.bestStreak;
    }

    getState() {
      return {
        currentStreak: this.currentStreak,
        bestStreak: this.bestStreak,
        isHot: this.currentStreak >= 3,
        isLegendary: this.currentStreak >= 5
      };
    }
  }

  window.StreakManager = StreakManager;
})();
