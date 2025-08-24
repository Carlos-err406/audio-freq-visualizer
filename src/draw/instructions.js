import { isInitialized } from "../audio";
import { ctx, size } from "../canvas";

export function drawInstructions() {
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.font = "16px monospace, sans-serif";
  // Draw text with anti-aliasing
  ctx.fillText(
    "Click or Tap the screen to toggle mic 🎤",
    size.width / 2,
    isInitialized() ? 20 : size.height / 2,
  );
}
