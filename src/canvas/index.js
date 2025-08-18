const BACKGROUND = "#000000";
// DPI scaling factor - increase for higher resolution
export const DPI_SCALE = 5;
export let width = window.innerWidth;
export let height = window.innerHeight;

/** @type {HTMLCanvasElement} */
export const canvas = document.querySelector("canvas");

/** @type {CanvasRenderingContext2D} */
export const ctx = canvas.getContext("2d");

/**
 * Handles canvas resize events and ensures proper sizing
 * Uses window dimensions for better mobile compatibility
 */
function handleCanvasResize() {
  height = window.innerHeight;
  width = window.innerWidth;

  // Set canvas dimensions to match window

  canvas.height = height * DPI_SCALE;
  canvas.width = width * DPI_SCALE;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // Reset canvas with black background
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, width, height);

  // Set up basic rendering options
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Reset transformation matrix before applying scale to prevent cumulative scaling
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Scale all drawing operations to match the DPI scaling
  ctx.scale(DPI_SCALE, DPI_SCALE);
}

/**
 * Clears the canvas and fills with background color
 */
export function clearCanvas() {
  // Save the current transformation
  ctx.save();

  // Reset the transformation to clear the entire canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = BACKGROUND; // Pure black background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Restore the scaling transformation
  ctx.restore();
}

handleCanvasResize();
window.addEventListener("resize", handleCanvasResize);
