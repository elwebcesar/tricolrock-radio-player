/**
 * Manages the state of the player, including title and playback status.
 * Gestiona el estado del reproductor, incluyendo título y estado de reproducción.
 * @module player-state
*/

let initialTitle;
let currentPlayingTitle = 'Reproduciendo...';
let hasSongInfo = false;

/**
 * Creates a player state with the initial title.
 * Crea un estado del reproductor con el título inicial.
 * @param {string} title - Initial title of the document. / Título inicial del documento.
 * @returns {object} Player state object with methods to access state. / Objeto de estado del reproductor con métodos para acceder al estado.
*/
export function createPlayerState(title) {
  initialTitle = title || document.title;
  return {
    getInitialTitle: () => initialTitle,
    hasSongInfo: () => hasSongInfo
  };
}

/**
 * Sets the current playing title.
 * Establece el título de reproducción actual.
 * @param {string} title - Title to set. / Título a establecer.
*/
export function setCurrentPlayingTitle(title) {
  currentPlayingTitle = title;
  hasSongInfo = true;
}

/**
 * Gets the current playing title.
 * Obtiene el título de reproducción actual.
 * @returns {string} The current playing title. / título de reproducción actual.
*/
export const getCurrentPlayingTitle = () => currentPlayingTitle;
