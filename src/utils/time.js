export class Time {
  /**
   * @param {number} step - positive values for incrementing, negative for decrementing
   * @param {boolean} [paused=false]
   */
  constructor(step = 1, paused = false) {
    this.value = 0;
    this.step = step;
    this.initialStep = step;
    this.paused = paused;
  }

  reset() {
    this.value = 0;
    this.step = this.initialStep;
  }
  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }
  forward() {
    if (this.paused) return;
    this.value += this.step;
  }
  backward() {
    if (this.paused) return;
    this.value -= this.step;
  }
}
