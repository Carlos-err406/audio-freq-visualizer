import { analyser, dataArray } from "./audio.js";
import { canvas, ctx } from "./canvas.js";

/** @type {number} */
const defaultHeight = 1;

/**
 * Main drawing function that renders the audio visualization
 */
export function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Show instructions
  drawInstructions();
  drawLine("green");
  requestAnimationFrame(draw);
}

function drawInstructions() {
  ctx.textAlign = "center";
  ctx.fillText(
    "F: File Audio | V: Microphone | ESC: Stop Mic",
    canvas.width / 2,
    60,
  );
}

/**
 * @param {string} color
 */
function drawLine(color) {
  // Draw visualization if audio is active
  ctx.fillStyle = color;

  if (analyser) {
    analyser.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const height = defaultHeight + (avg / 255) * 100;
    ctx.fillRect(0, canvas.height / 2 - height / 2, canvas.width, height);
  } else {
    ctx.fillRect(0, canvas.height / 2, canvas.width, defaultHeight);
  }
}

// Request next frame
