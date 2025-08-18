import { AudioProcessor } from "./audio-processor";

export const audioProcessor = new AudioProcessor();

document.addEventListener("click", () => {
  if (!audioProcessor.isInitialized) {
    audioProcessor.initOnInteraction();
  }
  audioProcessor
    .toggleMicrophone()
    .catch((err) => console.error("Error toggling microphone:", err));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && audioProcessor.isMicActive) {
    audioProcessor
      .toggleMicrophone()
      .catch((err) => console.error("Error toggling microphone:", err));
  }
});

// Export public API
export const isInitialized = () => !!audioProcessor.analyser;
