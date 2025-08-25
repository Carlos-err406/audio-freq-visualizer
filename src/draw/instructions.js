import { audioProcessor, isInitialized } from "../audio";
import { ctx, size } from "../canvas";

export function drawInstructions() {
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.font = "16px monospace, sans-serif";

  // If a file is currently playing, show its name
  if (audioProcessor.isFileActive) {
    ctx.fillText(
      `Playing: ${audioProcessor.getCurrentFileName()}`,
      size.width / 2,
      20,
    );
    ctx.fillText(
      "Drop another audio file or click to use mic 🎤",
      size.width / 2,
      50,
    );
  } else {
    // Draw text with anti-aliasing
    ctx.fillText(
      "Click or Tap the screen to toggle mic 🎤",
      size.width / 2,
      isInitialized() ? 20 : size.height / 2 - 20,
    );

    // Add instruction for file drop
    if (isInitialized()) {
      ctx.fillText("Drop an audio file to play it", size.width / 2, 50);
    } else {
      ctx.fillText(
        "Drop an audio file to play it",
        size.width / 2,
        size.height / 2 + 20,
      );
    }
  }
}
