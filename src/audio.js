/** @type {AudioContext} */
let audioContext;

/** @type {AnalyserNode} */
export let analyser;

/** @type {AudioNode} */
let sourceNode;

/** @type {Uint8Array|undefined} */
export let dataArray;

/** @type {MediaStream} */
let mediaStream;

/** @type {MediaElementAudioSourceNode} */
let fileSourceNode;

/** @type {'file'|'mic'} */
let currentMode = "file";

/** @type {HTMLAudioElement} */
export const audio = document.querySelector("audio");

function initAudioContext() {
  if (!audioContext || audioContext.state === "closed") {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

async function setupFileAudio() {
  const audioCtx = initAudioContext();

  // Create analyser if needed
  if (!analyser) {
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  }

  // Create file source node if needed
  if (!fileSourceNode) {
    fileSourceNode = audioCtx.createMediaElementSource(audio);
  }

  // Connect nodes
  sourceNode = fileSourceNode;
  sourceNode.connect(analyser);
  analyser.connect(audioCtx.destination);

  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }
}

async function setupMicAudio() {
  const audioCtx = initAudioContext();

  // Create analyser if needed
  if (!analyser) {
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  }

  mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  sourceNode = audioCtx.createMediaStreamSource(mediaStream);
  sourceNode.connect(analyser);
  analyser.connect(audioCtx.destination);

  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }
}

function cleanupAudio() {
  if (sourceNode) {
    sourceNode.disconnect();
  }
  if (analyser) {
    analyser.disconnect();
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
  // Don't close audioContext - we'll reuse it
}

async function switchAudioMode(mode) {
  cleanupAudio();
  currentMode = mode;

  try {
    if (mode === "file") {
      await setupFileAudio();
      audio.paused ? audio.play() : audio.pause();
    } else if (mode === "mic") {
      await setupMicAudio();
    }
  } catch (err) {
    console.error("Audio setup error:", err);
  }
}

let isInitialized = false;

function initOnInteraction() {
  if (!isInitialized) {
    switchAudioMode("file");
    isInitialized = true;
  }
}

// Initialize on first interaction
document.addEventListener("click", initOnInteraction);
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "f") {
    initOnInteraction();
    switchAudioMode("file");
  } else if (e.key.toLowerCase() === "v") {
    initOnInteraction();
    switchAudioMode("mic");
  } else if (e.key === "Escape" && currentMode === "mic") {
    switchAudioMode("file");
  }
});
