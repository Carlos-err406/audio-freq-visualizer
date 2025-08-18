export class InputHandler {
  /**
   * @param {import("./audio-processor").AudioProcessor} audioProcessor - The audio processor instance
   */
  constructor(audioProcessor) {
    this.audioProcessor = audioProcessor;
    this.pressStartTime = 0;
    this.isLongPress = false;
  }

  /**
   * Set up event listeners for user interaction
   */
  setupEventListeners() {
    document.addEventListener("mousedown", () => this.handlePressStart());
    document.addEventListener("touchstart", () => this.handlePressStart());
    document.addEventListener("mouseup", () => this.handlePressEnd());
    document.addEventListener("touchend", () => this.handlePressEnd());
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  /**
   * Handle start of press (mouse down or touch start)
   */
  handlePressStart() {
    this.pressStartTime = Date.now();
    this.isLongPress = false;
  }

  /**
   * Handle end of press (mouse up or touch end)
   */
  handlePressEnd() {
    const pressDuration = Date.now() - this.pressStartTime;
    this.isLongPress = pressDuration > 1000;

    // Initialize if needed
    if (!this.audioProcessor.isInitialized) {
      this.audioProcessor.initOnInteraction();
    }

    // Toggle microphone
    this.audioProcessor
      .toggleMicrophone()
      .catch((err) => console.error("Error toggling microphone:", err));
  }

  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyDown(e) {
    if (e.key === "Escape" && this.audioProcessor.isMicActive) {
      this.audioProcessor
        .toggleMicrophone()
        .catch((err) => console.error("Error toggling microphone:", err));
    }
  }
}
