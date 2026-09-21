/**
 * Dionlyonee Playground - Score Manager
 * Handles score adjustments, formatting, and high stakes bonuses.
 */
(function () {
  const ScoreManager = {
    formatCurrency(amount) {
      return '$' + Number(amount || 0).toLocaleString();
    },

    formatPoints(points) {
      return Number(points || 0).toLocaleString() + ' PTS';
    },

    awardCash(contestant, amount) {
      if (!contestant) return;
      contestant.roundScore = (contestant.roundScore || 0) + Number(amount);
    },

    deductCash(contestant, amount) {
      if (!contestant) return;
      contestant.roundScore = Math.max(0, (contestant.roundScore || 0) - Number(amount));
    },

    animateScore(elem, targetVal, options = {}) {
      if (!elem) return;
      const prefix = options.prefix !== undefined ? options.prefix : '$';
      const suffix = options.suffix !== undefined ? options.suffix : '';
      const duration = typeof options.duration === 'number' ? options.duration : 450;

      // Extract starting numeric value
      let prevVal = 0;
      if (typeof elem._currentScoreVal === 'number') {
        prevVal = elem._currentScoreVal;
      } else {
        const rawText = elem.textContent || '';
        const match = rawText.match(/-?\d[\d,]*/);
        if (match) {
          prevVal = parseInt(match[0].replace(/,/g, ''), 10) || 0;
        }
      }

      const targetNum = typeof targetVal === 'number'
        ? targetVal
        : parseInt(String(targetVal).replace(/[^0-9-]/g, ''), 10) || 0;

      // Ensure transition styling class is present
      if (!elem.classList.contains('score-transition-active')) {
        elem.classList.add('score-transition-active');
      }

      if (prevVal === targetNum) {
        elem.textContent = `${prefix}${targetNum.toLocaleString()}${suffix}`;
        elem._currentScoreVal = targetNum;
        return;
      }

      elem._currentScoreVal = targetNum;

      // Cancel previous frame animation if any
      if (elem._scoreAnimRaf) {
        cancelAnimationFrame(elem._scoreAnimRaf);
        elem._scoreAnimRaf = null;
      }
      if (elem._scoreClassTimeout) {
        clearTimeout(elem._scoreClassTimeout);
        elem._scoreClassTimeout = null;
      }

      // Determine CSS transition class
      const isUp = targetNum > prevVal;
      const isBankrupt = targetNum === 0 && prevVal > 0;
      const bumpClass = isBankrupt ? 'score-bump-bankrupt' : (isUp ? 'score-bump-up' : 'score-bump-down');

      elem.classList.remove('score-bump-up', 'score-bump-down', 'score-bump-bankrupt');
      void elem.offsetWidth; // force reflow for smooth CSS transition
      elem.classList.add(bumpClass);

      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Smooth deceleration easeOutCubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(prevVal + (targetNum - prevVal) * ease);

        elem.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

        if (progress < 1) {
          elem._scoreAnimRaf = requestAnimationFrame(step);
        } else {
          elem.textContent = `${prefix}${targetNum.toLocaleString()}${suffix}`;
          elem._scoreAnimRaf = null;
          elem._scoreClassTimeout = setTimeout(() => {
            elem.classList.remove('score-bump-up', 'score-bump-down', 'score-bump-bankrupt');
            elem._scoreClassTimeout = null;
          }, 150);
        }
      }

      elem._scoreAnimRaf = requestAnimationFrame(step);
    }
  };

  window.ScoreManager = ScoreManager;
  window.animateScoreDisplay = ScoreManager.animateScore;
})();
