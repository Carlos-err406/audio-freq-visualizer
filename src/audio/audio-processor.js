/**
 * Handles audio processing and microphone input
 */
export class AudioProcessor {
  constructor() {
    /** @type {AudioContext|null} */
    this.context = null;

    /** @type {AnalyserNode|null} */
    this.analyser = null;

    /** @type {AudioNode|null} */
    this.sourceNode = null;

    /** @type {Uint8Array|null} */
    this.dataArray = null;

    /** @type {MediaStream|null} */
    this.mediaStream = null;

    /** @type {boolean} */
    this.isMicActive = false;

    /** @type {boolean} */
    this.isInitialized = false;
  }

  /**
   * Initialize the audio context if it doesn't exist or is closed
   * @returns {AudioContext} The audio context
   */
  initAudioContext() {
    if (!this.context || this.context.state === "closed") {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.context;
  }

  /**
   * Set up microphone audio input and connect to analyzer
   * @returns {Promise<void>}
   */
  async setupMicAudio() {
    const audioCtx = this.initAudioContext();

    // Create analyser if needed
    if (!this.analyser) {
      this.analyser = audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      this.sourceNode = audioCtx.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyser);

      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }
    } catch (err) {
      console.error("Microphone setup error:", err);
      throw err;
    }
  }

  /**
   * Clean up audio resources
   */
  cleanupAudio() {
    if (this.sourceNode) {
      this.sourceNode.disconnect();
    }

    if (this.analyser) {
      this.analyser.disconnect();
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    // Don't close audioContext - we'll reuse it
  }

  /**
   * Toggle microphone on/off
   * @returns {Promise<boolean>} Promise resolving to the new microphone state
   */
  async toggleMicrophone() {
    if (this.isMicActive) {
      this.cleanupAudio();
      this.isMicActive = false;
    } else {
      try {
        await this.setupMicAudio();
        this.isMicActive = true;
      } catch (err) {
        console.error("Microphone toggle error:", err);
        throw err;
      }
    }

    return this.isMicActive;
  }

  /**
   * Initialize audio on user interaction
   */
  initOnInteraction() {
    if (!this.isInitialized) {
      this.isInitialized = true;
    }
  }

  /**
   * Get the current audio data array
   * @returns {Uint8Array|null} The current audio frequency data array
   */
  getAudioData() {
    if (this.analyser && this.dataArray) {
      this.analyser.getByteFrequencyData(this.dataArray);
      return this.dataArray;
    }
    return null;
  }
}
