import { ctx, height, width } from "../canvas";

/**
 * Draws debug information about frequency data on the canvas
 * @param {import("../audio/audio-processor").AudioProcessor} audioProcessor - The audio processor instance
 */
export function drawFrequencyDebug(audioProcessor) {
  if (!audioProcessor || !audioProcessor.analyser || !audioProcessor.context) {
    return;
  }

  // Get the updated frequency data
  const dataArray = audioProcessor.getAudioData();
  if (!dataArray) {
    return;
  }

  const sampleRate = audioProcessor.context.sampleRate;
  const binCount = audioProcessor.analyser.frequencyBinCount;
  const nyquist = sampleRate / 2;

  // Calculate the frequency range for each band
  const bandRanges = {
    high: [
      Math.round((600 / binCount) * nyquist),
      Math.round((1023 / binCount) * nyquist),
    ],
    midHigh: [
      Math.round((300 / binCount) * nyquist),
      Math.round((599 / binCount) * nyquist),
    ],
    mid: [
      Math.round((100 / binCount) * nyquist),
      Math.round((299 / binCount) * nyquist),
    ],
    midLow: [
      Math.round((20 / binCount) * nyquist),
      Math.round((99 / binCount) * nyquist),
    ],
    low: [
      Math.round((0 / binCount) * nyquist),
      Math.round((19 / binCount) * nyquist),
    ],
  };

  // Calculate the maximum value in each frequency band
  const highMax = Math.max(...Array.from(dataArray.slice(600, 1024)));
  const midHighMax = Math.max(...Array.from(dataArray.slice(300, 600)));
  const midMax = Math.max(...Array.from(dataArray.slice(100, 300)));
  const midLowMax = Math.max(...Array.from(dataArray.slice(20, 100)));
  const lowMax = Math.max(...Array.from(dataArray.slice(0, 20)));

  // Set up text rendering
  ctx.font = "14px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.textAlign = "left";

  // Draw frequency range information
  const startY = height - 190;
  const lineHeight = 20;

  ctx.fillText(`Frequency Ranges:`, 20, startY);
  ctx.fillText(
    `High: ${bandRanges.high[0]}Hz - ${bandRanges.high[1]}Hz`,
    20,
    startY + lineHeight,
  );
  ctx.fillText(
    `Mid-high: ${bandRanges.midHigh[0]}Hz - ${bandRanges.midHigh[1]}Hz`,
    20,
    startY + lineHeight * 2,
  );
  ctx.fillText(
    `Mid: ${bandRanges.mid[0]}Hz - ${bandRanges.mid[1]}Hz`,
    20,
    startY + lineHeight * 3,
  );
  ctx.fillText(
    `Mid-low: ${bandRanges.midLow[0]}Hz - ${bandRanges.midLow[1]}Hz`,
    20,
    startY + lineHeight * 4,
  );
  ctx.fillText(
    `Low: ${bandRanges.low[0]}Hz - ${bandRanges.low[1]}Hz`,
    20,
    startY + lineHeight * 5,
  );

  // Draw current maximum values
  const valuesStartX = width / 2;
  ctx.fillText(`Current Maximum Values:`, valuesStartX, startY);
  ctx.fillText(`High: ${highMax}`, valuesStartX, startY + lineHeight);
  ctx.fillText(
    `Mid-high: ${midHighMax}`,
    valuesStartX,
    startY + lineHeight * 2,
  );
  ctx.fillText(`Mid: ${midMax}`, valuesStartX, startY + lineHeight * 3);
  ctx.fillText(`Mid-low: ${midLowMax}`, valuesStartX, startY + lineHeight * 4);
  ctx.fillText(`Low: ${lowMax}`, valuesStartX, startY + lineHeight * 5);

  // Draw a mini frequency spectrum visualization
  drawMiniSpectrum(dataArray, binCount);
}

/**
 * Draws a mini frequency spectrum visualization
 * @param {Uint8Array} dataArray - The frequency data array
 * @param {number} binCount - The number of frequency bins
 */
function drawMiniSpectrum(dataArray, binCount) {
  const spectrumHeight = 60;
  const spectrumTop = height - spectrumHeight - 10;
  const barWidth = width / binCount;

  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, spectrumTop, width, spectrumHeight);

  // Draw frequency spectrum
  for (let i = 0; i < binCount; i++) {
    const value = dataArray[i];
    const percent = value / 255;
    const barHeight = spectrumHeight * percent;

    // Color gradient based on frequency
    const hue = (i / binCount) * 360;
    ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.8)`;

    ctx.fillRect(
      i * barWidth,
      spectrumTop + spectrumHeight - barHeight,
      barWidth,
      barHeight,
    );
  }

  // Draw band dividers
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 1;

  // High band start (600)
  drawBandDivider(600, binCount, spectrumTop, spectrumHeight, "H");

  // Mid-high band start (300)
  drawBandDivider(300, binCount, spectrumTop, spectrumHeight, "MH");

  // Mid band start (100)
  drawBandDivider(100, binCount, spectrumTop, spectrumHeight, "M");

  // Mid-low band start (20)
  drawBandDivider(20, binCount, spectrumTop, spectrumHeight, "ML");

  // Low band start (0)
  drawBandDivider(0, binCount, spectrumTop, spectrumHeight, "L");
}

/**
 * Draws a divider line for a frequency band
 * @param {number} binIndex - The bin index where the band starts
 * @param {number} binCount - The total number of bins
 * @param {number} top - The top position of the spectrum visualization
 * @param {number} height - The height of the spectrum visualization
 * @param {string} label - The label for the band
 */
function drawBandDivider(binIndex, binCount, top, height, label) {
  const x = 20 + (binIndex / binCount) * width;

  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x, top + height);
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.fillText(label, x, top);
}

// State to control whether frequency debug is shown
export let showFrequencyDebug = false;
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "d") {
    showFrequencyDebug = !showFrequencyDebug;
  }
});
