import { audioProcessor } from "../audio";
import { ctx } from "../canvas";
import { Time } from "../utils/time";

const time = new Time(0.01);

// Position constants for all indicators
const INDICATOR_X = 20;
const INDICATOR_Y = 15;

/**
 * Main indicator function that selects the appropriate indicator based on audio state
 */
export function drawIndicator() {
  // Select the appropriate indicator based on audio state
  if (audioProcessor.isMicActive) {
    drawRecordingIndicator();
  } else if (audioProcessor.isFileActive) {
    drawPlayingFileIndicator();
  } else {
    drawIdleIndicator();
  }

  // Update the animation time
  time.forward();
}

/**
 * Draws a pulsing red circle to indicate microphone recording
 */
function drawRecordingIndicator() {
  time.resume();

  // Draw a pulsing red circle to indicate recording
  const radius = 5 + Math.sin(time.value * 5); // Pulsing effect using sine wave

  // Set up the circle style
  ctx.beginPath();
  ctx.arc(INDICATOR_X, INDICATOR_Y, radius, 0, 360);
  ctx.fillStyle = "rgba(255, 0, 0, 1)";
  ctx.fill();

  // Reset shadow for next drawing
  ctx.shadowBlur = 0;
}

/**
 * Draws a green triangle to indicate audio file playback
 */
function drawPlayingFileIndicator() {
  time.resume();

  // Draw a triangle (play symbol) when audio file is playing
  const size = 14; // Size for better visibility

  // Draw a triangle pointing right
  ctx.beginPath();
  ctx.moveTo(INDICATOR_X - size / 2, INDICATOR_Y - size / 2); // Top left
  ctx.lineTo(INDICATOR_X - size / 2, INDICATOR_Y + size / 2); // Bottom left
  ctx.lineTo(INDICATOR_X + size / 2, INDICATOR_Y); // Right point (center)
  ctx.closePath();

  // Fill with a bright green color
  ctx.fillStyle = "#00FF00"; // Bright green
  ctx.fill();

  // Add a glow effect
  ctx.shadowBlur = 5;
  ctx.shadowColor = "#00FF00";
}

/**
 * Draws a gray square to indicate idle state (no audio)
 */
function drawIdleIndicator() {
  time.pause();

  // Draw a square when no audio is active
  const size = 10; // Fixed size for the square

  // Set up the square style
  ctx.beginPath();
  ctx.rect(INDICATOR_X - size / 2, INDICATOR_Y - size / 2, size, size);
  ctx.fillStyle = "rgba(128, 128, 128, 0.8)"; // Gray color for inactive state
  ctx.fill();
}
