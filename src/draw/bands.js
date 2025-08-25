/** @type {number} */
const clusterThickness = 70;

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
export const BANDS = [
  {
    name: "high",
    color: "rgba(0, 255, 255, 0.7)",
    glowColor: "rgba(0, 255, 255, 0.9)",
    range: [600, 1023],
  },
  {
    name: "mid-high",
    color: "rgba(0, 191, 255, 0.7)",
    glowColor: "rgba(0, 191, 255, 0.9)",
    range: [300, 599],
  },
  {
    name: "mid",
    color: "rgba(255, 20, 145, 0.7)",
    glowColor: "rgba(255, 20, 147, 0.9)",
    range: [100, 299],
  },
  {
    name: "mid-low",
    color: "rgba(255, 0, 255, 0.7)",
    glowColor: "rgba(255, 0, 255, 0.9)",
    range: [20, 99],
  },
  {
    name: "low",
    color: "rgba(137, 43, 226, 0.7)",
    glowColor: "rgba(137, 43, 226, 0.9)",
    range: [0, 19],
  },
];

/**
 * @typedef {Object} BandData
 * @property {number} frequency
 * @property {number} amplitude
 */

/**
 * Calculates the frequency data for a specific band
 * @param {FrequencyBand} band - The frequency band object
 * @param {number} index - The index of the band
 * @param {Uint8Array<ArrayBufferLike>} dataArray
 * @param {import("../utils/time").Time} drawTime
 * @returns {BandData} - Object containing frequency and amplitude data
 *
 */
export function getBandData(band, index, dataArray, drawTime) {
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
  const amplitude = clusterThickness + (avgFrequency / 255) * 100;

  // Calculate frequency (number of waves) based on the band
  // Higher frequency bands get more waves
  const frequency = 2 + (band.range[0] / dataArray.length) * 10;

  // Add a small random factor to make it more dynamic
  const randomFactor = Math.sin(drawTime.value * (index + 1)) * 5;

  return {
    frequency,
    amplitude: amplitude + randomFactor,
  };
}
