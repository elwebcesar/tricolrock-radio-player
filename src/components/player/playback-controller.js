/**
 * Controls playback operations for the player.
 * Controla las operaciones de reproducción del reproductor.
 * @module playback-controller
*/
import { initAudio, getAudioContext } from '../../services/audio-service.js';
import { getCurrentPlayingTitle } from './player-state.js';
import { domElements } from '../../utils/dom.elements.js';

// Variables for single state reference
let isListenersSetup = false;
let playerStateReference = null;
let uiReference = null;
let audioReference = null;

// Global state Playback
export const playbackState = {
  isReady: false,
  isProcessing: false
};


/**
 * Initializes playback for the given stream.
 * Inicializa la reproducción para el stream dado.
 * @param {HTMLMediaElement} audio - The audio element. / El elemento de audio.
 * @param {object} ui - UI manipulation methods. / Métodos de manipulación de la interfaz.
 * @param {object} playerState - Player state management. / Gestión del estado del reproductor.
 * @param {string} stream - Audio stream URL. / URL del stream de audio.
 * @param {function} onReady - Callback when the player is ready.
*/
export function initializePlayback(audio, ui, playerState, stream, onReady) {
  // 1. Save global reference
  audioReference = audio;
  playerStateReference = playerState;
  uiReference = ui;
  
  // 2. Reset state for new stream
  playbackState.isReady = false;
  playbackState.isProcessing = false;

  // 3. Config new stream
  audioReference.src = stream;
  audioReference.volume = domElements.volumeSlider.value / 100;
  uiReference.setVolumeLabel(domElements.volumeSlider.value);

  initAudio(audioReference);

  // 4. Config listeners only once
  if (!isListenersSetup) {
      setupPlaybackListeners(audioReference, uiReference, playerStateReference);
      isListenersSetup = true;
  }
  
  attemptAutoplay(audioReference, uiReference, playerStateReference, onReady, playbackState);
}


/**
 * Configure interaction and status listeners (ONLY ONCE).
 * Use global references - ui
*/
export function setupPlaybackListeners(audio, ui, playerState) {
    // Listeners audio element (playing/pause)
    audio.addEventListener('playing', () => updatePlayerState(audio, ui, true));
    audio.addEventListener('pause', () => updatePlayerState(audio, ui, false));

    // Listeners only once asign
    domElements.volumeSlider.addEventListener('input', () => onVolumeChange(audio, ui));
    domElements.playButton.addEventListener('click', () => togglePlay(audio, ui, playerState, playbackState));
}


/**
 * Updates the player state and emits events.
 * Actualiza el estado del reproductor y emite eventos.
*/
function updatePlayerState(audio, ui, isPlaying) {
  const wasPlaying = !audio.paused;
  if (wasPlaying !== isPlaying) {
    const event = new CustomEvent('player:statechange', {
      detail: { 
        isPlaying,
        timestamp: new Date().toISOString(),
        station: audio.src
      }
    });
    document.dispatchEvent(event);
  }
  ui.setPlayIcon(isPlaying);
  ui.setOnAir(isPlaying);
}

/**
 * Handles volume changes.
 * Maneja los cambios de volumen.
*/
function onVolumeChange(audio, ui) {
  audio.volume = domElements.volumeSlider.value / 100;
  ui.setVolumeLabel(domElements.volumeSlider.value);
}

/**
 * Toggles play/pause state.
*/
const togglePlay = async (audio, ui, playerState, state) => {
  if (!state.isReady || state.isProcessing) {
    return;
  }

  state.isProcessing = true;
  domElements.playButton.disabled = true;
  ui.setLoadingIcon();

  try {
    const ctx = getAudioContext();
    if (ctx?.state === 'suspended') await ctx.resume();

    if (audio.paused) {
      await audio.play();
      ui.setDocumentTitle(playerState.hasSongInfo() ? getCurrentPlayingTitle() : 'Reproduciendo...');
    } else {
      audio.pause();
      ui.setDocumentTitle(playerState.getInitialTitle());
    }
  } catch (error) {
    console.error('❌ Error in togglePlay:', error);
  } finally {
    state.isProcessing = false;

    domElements.playButton.disabled = false;
  }
};

/**
 * Attempts to start autoplay.
 * Intenta iniciar la reproducción automática.
*/
async function attemptAutoplay(audio, ui, playerState, onReady, state) {
  ui.setLoadingIcon();

  domElements.playButton.disabled = true;

  try {
    await audio.play();
    state.isReady = true;
    updatePlayerState(audio, ui, true);
    ui.setDocumentTitle(playerState.hasSongInfo() ? getCurrentPlayingTitle() : 'Reproduciendo...');
    domElements.playButton.disabled = false;
    onReady?.(true);
  } catch (error) {
    state.isReady = true;
    ui.setPlayIcon(false);
    domElements.playButton.disabled = false;
    onReady?.(true);
    document.addEventListener('click', () => retryOnInteraction(audio, ui, playerState, state), { once: true });
  }
}

/**
 * Retries playback on user interaction.
 * Reintenta la reproducción tras interacción del usuario.
*/
const retryOnInteraction = async (audio, ui, playerState, state) => {
  ui.setLoadingIcon();
  domElements.playButton.disabled = true;

  try {
    const ctx = getAudioContext();
    if (ctx?.state === 'suspended') await ctx.resume();

    await audio.play();
    ui.setDocumentTitle(playerState.hasSongInfo() ? getCurrentPlayingTitle() : 'Reproduciendo...');
  } catch (error) {
    console.error('❌ Error in playback:', error);
  } finally {
    domElements.playButton.disabled = false;
  }
};
