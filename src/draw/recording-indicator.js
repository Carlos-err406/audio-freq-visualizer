import { isMicrophoneActive } from "../audio";
import { ctx } from "../canvas";
import { Time } from "../utils/time";

const time = new Time(0.01);

export function drawRecordingIndicator() {
  const x = 20;
  const y = 15;

  if (isMicrophoneActive()) {
    time.resume();
    // Draw a pulsing red circle to indicate recording
    const radius = 5 + Math.sin(time.value * 5); // Pulsing effect using sine wave

    // Set up the circle style
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 360);
    ctx.fillStyle = "rgba(255, 0, 0, 1)";
    ctx.fill();

    // Reset shadow for next drawing
    ctx.shadowBlur = 0;
  } else {
    time.pause();
    // Draw a square when mic is not active
    const size = 10; // Fixed size for the square

    // Set up the square style
    ctx.beginPath();
    ctx.rect(x - size / 2, y - size / 2, size, size); // Center the square at the same position as the circle
    ctx.fillStyle = "rgba(128, 128, 128, 0.8)"; // Gray color for inactive state
    ctx.fill();
  }

  time.forward();
}
