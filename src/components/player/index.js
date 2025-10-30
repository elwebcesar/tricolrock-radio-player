/**
 * Initializes and controls the radio player.
 * Inicializa y controla el reproductor.
 * @module player
*/

import { initAudio } from '../../services/audio-service.js';
import { ui, audio } from './player.dom.js';
import { setStationTheme } from '../../utils/theme.js';
import { createPlayerState, setCurrentPlayingTitle, getCurrentPlayingTitle } from './player-state.js';
import { initializePlayback } from './playback-controller.js';
import { replaceText } from '../../helpers/index.js';

/**
 * Initializes the player with a radio station.
 * @param {object} station - Radio station object containing stream, name, and logo. / Objeto de la estación de radio con stream, nombre y logo.
 * @param {function} onReady - Callback when the player is ready. / Callback cuando el reproductor está listo.
 * @param {boolean} onReady.playerReady - Indicates whether the player is ready to play audio. / Indica si el reproductor está listo para reproducir audio.
 * @param {string} [INITIAL_TITLE] - Initial title of the document. / Título inicial del documento.
 * @param {string} [defaultColor] - Initial color for the interface. / Color inicial para la interfaz.
*/
export function initPlayer(station, onReady, INITIAL_TITLE, defaultColor) {
  if (!station?.stream || !station?.name || !station?.logo) {
    console.error('❌ Error: Invalid or incomplete station object');
    return;
  }

  const playerState = createPlayerState(INITIAL_TITLE);

  ui.setStationLabel(`${station.name} - Emisora en vivo`);
  ui.setStationImage(station.logo, `Reproduciendo: ${station.name}`);
  ui.setStationText(`Reproduciendo: ${station.name}`);

  setStationTheme(station, defaultColor);

  // Llamada a initializePlayback, que ahora maneja su propia lógica de listeners únicos
  initializePlayback(audio, ui, playerState, station.stream, onReady);
}

/**
 * Updates the now playing information in the UI.
 * Actualiza la información de reproducción actual en la interfaz.
 * @param {object} params - Song information. / Información de la canción.
 * @param {string} params.title - Song title. / Título de la canción.
 * @param {string} params.artist - Artist name.
 * @param {string} params.art - Cover art URL. / URL de la portada.
*/
export const updatePlayerUI = ({ title, artist, art, dinamicTitleGenerate }) => {
  const searchQuery = encodeURIComponent(`${title} ${artist}`);
  // Asumiendo que esta es la URL correcta para la búsqueda de Spotify
  const songLink = `https://open.spotify.com/search/$${searchQuery}`;

  ui.setSongTitle(title);
  ui.setArtistName(artist);
  ui.setCoverArt(art, `Portada: ${title} - ${artist}`, songLink, `Ver ${title} - ${artist} en Spotify (abre en nueva pestaña)`);

  document.body.style.setProperty('--bg-image', `url('${art}')`);

  setCurrentPlayingTitle( replaceText(dinamicTitleGenerate, '////', `${artist} - \"${title}\"`) );
  if (!audio.paused) {
    ui.setDocumentTitle(getCurrentPlayingTitle());
  }
};
