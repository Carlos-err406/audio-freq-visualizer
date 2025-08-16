/** @type {HTMLCanvasElement} */
export const canvas = document.querySelector("canvas");

/** @type {CanvasRenderingContext2D} */
export const ctx = canvas.getContext("2d");

/**
 * Handles canvas resize events
 */
function handleCanvasResize() {
  const newHeight = window.innerHeight;
  const newWidth = window.innerWidth;

  canvas.height = newHeight;
  canvas.width = newWidth;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, newWidth, newHeight);
}

handleCanvasResize();
window.addEventListener("resize", handleCanvasResize);
