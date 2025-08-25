import { AudioProcessor } from "./audio-processor";
import { canvas } from "../canvas";

export const audioProcessor = new AudioProcessor();

// Initialize audio processor on first interaction
document.addEventListener("click", () => {
  if (!audioProcessor.isInitialized) {
    audioProcessor.initOnInteraction();
  }
  audioProcessor
    .toggleMicrophone()
    .catch((err) => console.error("Error toggling microphone:", err));
});

// Toggle microphone off with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && audioProcessor.isMicActive) {
    audioProcessor
      .toggleMicrophone()
      .catch((err) => console.error("Error toggling microphone:", err));
  }
});

// Set up file drag and drop functionality
const setupFileDragAndDrop = () => {
  const dragOverlay = document.getElementById("drag-overlay");

  // Prevent default behavior to allow drop
  canvas.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    canvas.classList.add("drag-over");
    dragOverlay.classList.add("active");
  });

  // Remove drag-over styling when leaving
  canvas.addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.stopPropagation();
    canvas.classList.remove("drag-over");
    dragOverlay.classList.remove("active");
  });

  // Handle the dropped file
  canvas.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    canvas.classList.remove("drag-over");
    dragOverlay.classList.remove("active");

    // Initialize audio on first interaction if needed
    if (!audioProcessor.isInitialized) {
      audioProcessor.initOnInteraction();
    }

    // Get the dropped file
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];

      // Check if it's an audio file
      if (file.type.startsWith("audio/")) {
        // Process the audio file
        audioProcessor
          .processAudioFile(file)
          .catch((err) => console.error("Error processing audio file:", err));
      } else {
        console.error("Not an audio file:", file.type);
        alert("Please drop an audio file (MP3, WAV, etc.)");
      }
    }
  });
};

// Set up drag and drop when the DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupFileDragAndDrop);
} else {
  setupFileDragAndDrop();
}

// Export public API
export const isInitialized = () => !!audioProcessor.analyser;
