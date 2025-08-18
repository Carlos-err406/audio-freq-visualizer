import { AudioProcessor } from "./audio-processor";
import { InputHandler } from "./input-handler";

const audioProcessor = new AudioProcessor();
const inputHandler = new InputHandler(audioProcessor);
inputHandler.setupEventListeners();

// Export public API
export const toggleMicrophone = () => audioProcessor.toggleMicrophone();
export const getAudioData = () => audioProcessor.getAudioData();
export const isMicrophoneActive = () => audioProcessor.isMicActive;
export const getAnalyser = () => audioProcessor.analyser;
export const isInitialized = () => !!audioProcessor.analyser;
