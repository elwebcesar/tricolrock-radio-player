/**
 * Initializes the audio context and creates a parser node
 * Should only be called once
 * @param {HTMLMediaElement} audioElement - Audio element to be analyzed
 * @returns {Analyser} Frequency analyzer node
 */

let audioCtx = null;
let analyser = null;
let hasCreated = false;

// Creates the node ONCE and returns the Analyzer
export function initAudio(audioElement) {
  if (hasCreated) return analyser; // If it was already created

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;

  const source = audioCtx.createMediaElementSource(audioElement);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  hasCreated = true;
  return analyser;
}

// Gets the frequency analyzer node - return {Analyser} Frequency analyzer node for other modules to use
export function getAnalyser() {
  return analyser;
}

// Gets the audio context - return {AudioContext} Audio context - in case you need the context later
export function getAudioContext() {
  return audioCtx;
}
