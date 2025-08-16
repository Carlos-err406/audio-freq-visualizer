import { analyser, dataArray } from "./audio.js";
import { canvas, ctx } from "./canvas.js";

// Set up canvas rendering options for smoother lines
function setupCanvasRendering() {
  // Enable image smoothing for anti-aliased lines
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Set line join and cap for smoother lines
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
}

// Call this function once at startup
setupCanvasRendering();

/** @type {number} */
const defaultHeight = 20; // Increased default height for better visibility

/**
 * Frequency bands configuration
 * Each band represents a range of frequencies in the audio spectrum
 * @typedef {Object} FrequencyBand
 * @property {string} name - Name of the frequency band
 * @property {string} color - Main color for the band visualization
 * @property {string} glowColor - Glow effect color
 * @property {number[]} range - Array with start and end indices in the frequency data array
 */

/** @type {FrequencyBand[]} */
const BANDS = [
  {
    name: "high",
    color: "#00FFFF",
    glowColor: "rgba(0, 255, 255, 0.9)",
    range: [23, 31],
  },
  {
    name: "mid-high",
    color: "#00BFFF",
    glowColor: "rgba(0, 191, 255, 0.9)",
    range: [16, 22],
  },
  {
    name: "mid",
    color: "#FF1493",
    glowColor: "rgba(255, 20, 147, 0.9)",
    range: [9, 15],
  },
  {
    name: "mid-low",
    color: "#FF00FF",
    glowColor: "rgba(255, 0, 255, 0.9)",
    range: [4, 8],
  },
  {
    name: "low",
    color: "#8A2BE2",
    glowColor: "rgba(137, 43, 226, 0.9)",
    range: [0, 3],
  },
];

// Animation time for wave movement
let time = 0;

/**
 * Main drawing function that renders the audio visualization
 * This is called repeatedly by requestAnimationFrame
 */
export function draw() {
  // Update animation time for wave movement
  time += 0.009;

  // Clear and prepare the canvas
  clearCanvas();

  // Show instructions
  drawInstructions();

  // Draw audio visualization
  drawVisualization();

  // Schedule the next frame
  requestAnimationFrame(draw);
}

/**
 * Clears the canvas and fills with background color
 */
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000000"; // Pure black background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws the audio visualization based on current state
 */
function drawVisualization() {
  if (analyser) {
    // Get frequency data from audio analyzer
    analyser.getByteFrequencyData(dataArray);
    drawFrequencyBands();
  } else {
    // Draw default waves when no audio is playing
    drawDefaultBands();
  }
}

function drawInstructions() {
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText(
    "F: File Audio | V: Microphone | ESC: Stop Mic",
    canvas.width / 2,
    60,
  );
}

/**
 * Draws all frequency bands based on audio data
 * Each band is visualized as a sine wave with amplitude based on its frequency range
 */
function drawFrequencyBands() {
  // Check if dataArray is initialized and has data
  if (!dataArray || dataArray.length === 0) {
    // Draw default waves if no audio data is available
    drawDefaultBands();
    return;
  }

  // Draw each frequency band
  BANDS.forEach((band, index) => {
    // Get the frequency data for this band
    const bandData = getBandData(band, index);

    // Draw the line for this band
    drawLine(
      band.color,
      band.glowColor,
      index,
      bandData.frequency,
      bandData.amplitude,
      time,
    );
  });
}

/**
 * Draws default frequency bands when no audio data is available
 */
function drawDefaultBands() {
  BANDS.forEach((band, index) => {
    const defaultFrequency = 2 + index * 0.5;
    const defaultAmplitude = 20 + index * 5;
    drawLine(
      band.color,
      band.glowColor,
      index,
      defaultFrequency,
      defaultAmplitude,
      time,
    );
  });
}

/**
 * Calculates the frequency data for a specific band
 * @param {Object} band - The frequency band object
 * @param {number} index - The index of the band
 * @returns {Object} - Object containing frequency and amplitude data
 */
function getBandData(band, index) {
  const [start, end] = band.range;

  // Ensure indices are within bounds
  const safeStart = Math.min(start, dataArray.length - 1);
  const safeEnd = Math.min(end, dataArray.length - 1);

  // Calculate average frequency value for this band
  let sum = 0;
  for (let i = safeStart; i <= safeEnd; i++) {
    sum += dataArray[i];
  }
  const avgFrequency = sum / (safeEnd - safeStart + 1);

  // Calculate amplitude based on average frequency
  const amplitude = defaultHeight + (avgFrequency / 255) * 100;

  // Calculate frequency (number of waves) based on the band
  // Higher frequency bands get more waves
  const frequency = 2 + (band.range[0] / dataArray.length) * 10;

  // Add a small random factor to make it more dynamic
  const randomFactor = Math.sin(time * (index + 1)) * 5;

  return {
    frequency,
    amplitude: amplitude + randomFactor,
  };
}

/**
 * Draws a single frequency band as a sine wave
 * @param {string} color - Color of the line
 * @param {string} glowColor - Color for the glow effect
 * @param {number} index - Band index for vertical positioning
 * @param {number} frequency - Number of waves to draw
 * @param {number} amplitude - Height of the waves
 * @param {number} time - Current animation time
 */
function drawLine(color, glowColor, index, frequency, amplitude, time) {
  // Set up drawing context with enhanced visual effects
  setupLineStyle(color, glowColor);

  // Draw the sine wave
  drawSineWave(index, frequency, amplitude, time);

  // Reset shadow for next drawing
  ctx.shadowBlur = 0;
}

/**
 * Sets up the line style with glow effect
 * @param {string} color - Main color of the line
 * @param {string} glowColor - Color for the glow effect
 */
function setupLineStyle(color, glowColor) {
  ctx.shadowBlur = 15;
  ctx.shadowColor = glowColor;
  ctx.strokeStyle = color;
  ctx.lineWidth = 6; // Thicker lines for smoother appearance
}

/**
 * Draws a sine wave with an envelope function
 * @param {number} index - Band index for phase calculation
 * @param {number} frequency - Number of waves to draw
 * @param {number} amplitude - Height of the waves
 * @param {number} time - Current animation time
 */
function drawSineWave(index, frequency, amplitude, time) {
  ctx.beginPath();

  // Common vertical center for all lines
  const verticalCenter = canvas.height / 2;

  // Start at the left edge - all lines start at the same point
  ctx.moveTo(0, verticalCenter);

  // Draw the sine wave points
  for (let x = 0; x < canvas.width; x++) {
    // Calculate the y position for this point
    const y = calculateWavePoint(
      x,
      verticalCenter,
      index,
      frequency,
      amplitude,
      time,
    );
    ctx.lineTo(x, y);
  }

  // Stroke with glow effect
  ctx.stroke();
}

/**
 * Calculates a single point on the sine wave
 * @param {number} x - X coordinate
 * @param {number} verticalCenter - Vertical center position
 * @param {number} index - Band index for phase calculation
 * @param {number} frequency - Number of waves
 * @param {number} amplitude - Height of the waves
 * @param {number} time - Current animation time
 * @returns {number} - Y coordinate
 */
function calculateWavePoint(
  x,
  verticalCenter,
  index,
  frequency,
  amplitude,
  time,
) {
  // Calculate position relative to center (0 to 1, where 0.5 is center)
  const relativePos = x / canvas.width;

  // Create an envelope that peaks in the center and is flat at the edges
  // Using a modified bell curve (Gaussian function)
  const envelope = Math.exp(-Math.pow((relativePos - 0.5) * 5, 2));

  // Calculate phase shift based on time and band index
  const phase = time + (index * Math.PI) / 5;

  // Calculate the sine wave with the envelope
  return (
    verticalCenter +
    Math.sin((x * (Math.PI * 2 * frequency)) / canvas.width + phase) *
      amplitude *
      envelope
  );
}
