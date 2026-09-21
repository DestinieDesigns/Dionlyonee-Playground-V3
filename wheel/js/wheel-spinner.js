/**
 * Wheel Spinner Controller
 */
(function () {
  class WheelSpinner {
    constructor(canvasEl) {
      this.canvas = canvasEl;
      this.currentAngle = 0;
      this.isSpinning = false;
    }

    setCanvas(canvasEl) {
      this.canvas = canvasEl;
    }

    spin(startAngle, targetAngle, duration, onTick, onComplete) {
      this.isSpinning = true;
      const startTime = performance.now();
      const pegArc = (2 * Math.PI) / 24;
      let lastTickAngle = startAngle;

      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - progress, 3.5);
        this.currentAngle = startAngle + (targetAngle - startAngle) * ease;

        if (this.canvas && window.WheelEngine) {
          window.WheelEngine.drawWheel(this.canvas, this.currentAngle);
        }

        if (Math.abs(this.currentAngle - lastTickAngle) >= pegArc) {
          lastTickAngle = this.currentAngle;
          if (onTick) onTick(this.currentAngle);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.isSpinning = false;
          this.currentAngle = targetAngle;
          if (onComplete) onComplete(targetAngle);
        }
      };

      requestAnimationFrame(animate);
    }
  }

  window.WheelSpinner = WheelSpinner;
})();
