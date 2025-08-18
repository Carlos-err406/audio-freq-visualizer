const BACKGROUND = "#000000";
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
  canvas.height = height;
  canvas.width = width;

  // Reset canvas with black background
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, width, height);

  // Set up basic rendering options
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
}

/**
 * Clears the canvas and fills with background color
 */
export function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = BACKGROUND; // Pure black background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

handleCanvasResize();
window.addEventListener("resize", handleCanvasResize);
