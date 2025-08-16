/** @type {number} */
const defaultHeight = 10;

/**
 * Main drawing function that renders the audio visualization
 */
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "green";
  // Show instructions
  ctx.textAlign = "center";
  ctx.fillText(
    "F: File Audio | V: Microphone | ESC: Stop Mic",
    canvas.width / 2,
    60,
  );

  // Draw visualization if audio is active
  if (analyser) {
    analyser.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const height = defaultHeight + (avg / 255) * 50;
    ctx.fillRect(0, canvas.height / 2, canvas.width, height);
  } else {
    ctx.fillRect(0, canvas.height / 2, canvas.width, defaultHeight);
  }

  // Request next frame
  requestAnimationFrame(draw);
}

draw();
