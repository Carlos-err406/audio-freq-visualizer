import { isInitialized } from "../audio";
import { ctx, height, width } from "../canvas";

export function drawInstructions() {
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.font = "16px monospace, sans-serif";
  // Draw text with anti-aliasing
  ctx.fillText(
    "Click or Tap the screen to toggle mic 🎤",
    width / 2,
    isInitialized() ? 20 : height / 2,
  );
}
