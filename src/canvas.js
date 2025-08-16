/** @type {HTMLCanvasElement} */
export const canvas = document.querySelector("canvas");

/** @type {CanvasRenderingContext2D} */
export const ctx = canvas.getContext("2d");

/**
 * Handles canvas resize events and ensures proper sizing
 * Uses window dimensions for better mobile compatibility
 */
function handleCanvasResize() {
  const newHeight = window.innerHeight;
  const newWidth = window.innerWidth;

  // Set canvas dimensions to match window
  canvas.height = newHeight;
  canvas.width = newWidth;

  // Reset canvas with black background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, newWidth, newHeight);
  
  // Set up basic rendering options
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
}

handleCanvasResize();
window.addEventListener("resize", handleCanvasResize);
