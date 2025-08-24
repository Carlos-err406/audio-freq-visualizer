const BACKGROUND = "#000000";
// DPI scaling factor - increase for higher resolution
export const DPI_SCALE = 2;

export const size = {
  /** the window.innerWidth */
  get width() {
    return window.innerWidth;
  },
  /** the window.innerHeight */
  get height() {
    return window.innerHeight;
  },
  /** the window.innerWidth * DPI_SCALE */
  get dpi_width() {
    return this.width * DPI_SCALE;
  },
  /** the window.innerHeight * DPI_SCALE */
  get dpi_height() {
    return this.height * DPI_SCALE;
  },
};

/** @type {HTMLCanvasElement} */
export const canvas = document.querySelector("canvas");

/** @type {CanvasRenderingContext2D} */
export const ctx = canvas.getContext("2d");

/**
 * Handles canvas resize events and ensures proper sizing
 * Uses window dimensions for better mobile compatibility
 */
function handleCanvasResize() {
  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset

  canvas.width = size.dpi_width;
  canvas.height = size.dpi_height;
  canvas.style.width = `${size.width}px`;
  canvas.style.height = `${size.height}px`;

  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, size.dpi_width, size.dpi_height); // cover full area

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.scale(DPI_SCALE, DPI_SCALE); // reapply scaling
}

/**
 * Clears the canvas and fills with background color
 */
export function clearCanvas() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, size.dpi_width, size.dpi_height);
  ctx.setTransform(DPI_SCALE, 0, 0, DPI_SCALE, 0, 0);
}

handleCanvasResize();
window.addEventListener("resize", handleCanvasResize);
