/**
 * Handles audio processing, microphone input, and audio file playback
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

    /** @type {boolean} */
    this.isFileActive = false;

    /** @type {AudioBufferSourceNode|null} */
    this.audioFileSource = null;

    /** @type {string|null} */
    this.currentFileName = null;
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
      this.analyser.fftSize = 2048; // Significantly increased for much higher frequency resolution
      this.analyser.smoothingTimeConstant = 0.3; // Lower value (default is 0.8) for more responsive visualization
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
      this.sourceNode = null;
    }

    if (this.audioFileSource) {
      this.audioFileSource.disconnect();
      this.audioFileSource = null;
    }

    if (this.analyser && this.analyser.numberOfInputs > 0) {
      this.analyser.disconnect();
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    this.isFileActive = false;
    this.currentFileName = null;

    // Don't close audioContext - we'll reuse it
  }

  /**
   * Toggle microphone on/off
   * @returns {Promise<boolean>} Promise resolving to the new microphone state
   */
  async toggleMicrophone() {
    // If an audio file is currently playing, stop it
    if (this.isFileActive) {
      this.cleanupAudio();
    }

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

  /**
   * Process an audio file and use it as the audio source
   * @param {File} file - The audio file to process
   * @returns {Promise<void>}
   */
  async processAudioFile(file) {
    try {
      // Initialize audio context if needed
      const audioCtx = this.initAudioContext();

      // If microphone is active, turn it off
      if (this.isMicActive) {
        this.cleanupAudio();
        this.isMicActive = false;
      }

      // Clean up any previous audio file
      if (this.isFileActive) {
        this.cleanupAudio();
      }

      // Create analyser if needed
      if (!this.analyser) {
        this.analyser = audioCtx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.3;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      }

      // Read the file
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      // Create a source node from the audio buffer
      this.audioFileSource = audioCtx.createBufferSource();
      this.audioFileSource.buffer = audioBuffer;

      // Connect the source to the analyser
      this.audioFileSource.connect(this.analyser);

      // Set up event for when the audio finishes playing
      this.audioFileSource.onended = () => {
        console.log("Audio file playback ended");
        this.cleanupAudio();
      };

      // Start playback
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      this.audioFileSource.start(0);
      this.isFileActive = true;
      this.currentFileName = file.name;

      console.log(`Playing audio file: ${file.name}`);
    } catch (err) {
      console.error("Error processing audio file:", err);
      this.cleanupAudio();
      throw err;
    }
  }

  /**
   * Check if audio is currently active (either mic or file)
   * @returns {boolean} True if audio is active
   */
  isAudioActive() {
    return this.isMicActive || this.isFileActive;
  }

  /**
   * Get the name of the currently playing audio file
   * @returns {string|null} The file name or null if no file is playing
   */
  getCurrentFileName() {
    return this.currentFileName;
  }
}
