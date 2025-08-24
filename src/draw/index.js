import { audioProcessor } from "../audio";
import { clearCanvas, ctx, size } from "../canvas";
import { Time } from "../utils/time";
import { BANDS, getBandData } from "./bands";
import { drawFrequencyDebug, showFrequencyDebug } from "./frequency-debug";
import { drawInstructions } from "./instructions";
import { drawRecordingIndicator } from "./recording-indicator";
const drawTime = new Time(0.01);

/**
 * Main drawing function that renders the audio visualization
 * This is called repeatedly by requestAnimationFrame
 */
export function draw() {
  // Update animation time for wave movement
  drawTime.forward();

  // Clear and prepare the canvas
  clearCanvas();

  drawInstructions();
  drawRecordingIndicator();
  drawVisualization();

  // Draw frequency debug information if audio is active and debug is enabled
  if (audioProcessor && showFrequencyDebug) {
    drawFrequencyDebug(audioProcessor);
  }

  // Schedule the next frame
  requestAnimationFrame(draw);
}

/**
 * Draws the audio visualization based on current state
 */
function drawVisualization() {
  const analyser = audioProcessor.analyser;
  const audioData = audioProcessor.getAudioData(); // Call getAudioData() to update the dataArray with current frequency data

  if (analyser && audioData) {
    drawFrequencyBands(audioData);
  }
}

/**
 * Draws all frequency bands based on audio data
 * Each band is visualized as a sine wave with amplitude based on its frequency range
 * @param {Uint8Array} audioData - The audio frequency data
 */
function drawFrequencyBands(audioData) {
  // Check if audioData is initialized and has data
  if (!audioData || audioData.length === 0) {
    // Draw default waves if no audio data is available
    drawDefaultBands();
    return;
  }

  // Draw each frequency band
  BANDS.forEach((band, index) => {
    // Get the frequency data for this band
    const { amplitude, frequency } = getBandData(
      band,
      index,
      audioData,
      drawTime,
    );

    // Draw the line for this band
    drawBand(band.color, band.glowColor, index, frequency, amplitude);
  });
}

/**
 * Draws default frequency bands when no audio data is available
 */
function drawDefaultBands() {
  BANDS.forEach((band, index) => {
    const defaultFrequency = 2 + index * 0.5;
    const defaultAmplitude = 20 + index * 5;
    drawBand(
      band.color,
      band.glowColor,
      index,
      defaultFrequency,
      defaultAmplitude,
    );
  });
}

/**
 * Draws a single frequency band as a sine wave
 * @param {string} color - Color of the line
 * @param {string} glowColor - Color for the glow effect
 * @param {number} index - Band index for vertical positioning
 * @param {number} frequency - Number of waves to draw
 * @param {number} amplitude - Height of the waves
 */
function drawBand(color, glowColor, index, frequency, amplitude) {
  // Set up drawing context with enhanced visual effects
  setupLineStyle(color, glowColor);

  // Draw the sine wave
  drawSineWave(index, frequency, amplitude);

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
 */
function drawSineWave(index, frequency, amplitude) {
  ctx.beginPath();

  // Common vertical center for all lines
  const verticalCenter = size.height / 2;

  // Start at the left edge - all lines start at the same point
  ctx.moveTo(0, verticalCenter);

  // Draw the sine wave points
  for (let x = 0; x < size.width; x++) {
    // Calculate the y position for this point
    const y = calculateWavePoint(
      x,
      verticalCenter,
      index,
      frequency,
      amplitude,
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
 * @returns {number} - Y coordinate
 */
function calculateWavePoint(x, verticalCenter, index, frequency, amplitude) {
  // Calculate position relative to center (0 to 1, where 0.5 is center)
  const relativePos = x / size.width;

  // Create an envelope that peaks in the center and is flat at the edges
  // Using a modified bell curve (Gaussian function)
  const envelope = Math.exp(-Math.pow((relativePos - 0.5) * 5, 2));

  // Calculate phase shift based on time and band index
  const phase = drawTime.value + (index * Math.PI) / 5;

  // Calculate the sine wave with the envelope
  return (
    verticalCenter +
    Math.sin((x * (Math.PI * 2 * frequency)) / size.width + phase) *
      amplitude *
      envelope
  );
}
