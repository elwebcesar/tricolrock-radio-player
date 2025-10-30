/**
 * Manages DOM interactions for the now-playing component UI.
 * Gestiona las interacciones con el DOM para la interfaz del componente now-playing.
 * @module now-playing
*/

import { updatePlayerUI } from '../player/index.js';
import { fetchWithAuth } from '../../services/api.js';
import { replaceText } from '../../helpers/index.js';

// Local status of NowPlaying
let currentSongData = { title: '', artist: '' };
let updateInterval = null;
let isInitialized = false;

// Start NowPlaying
export function initNowPlaying(station, DINAMIC_TITLE_GENERATE, RELOAD_INTERVAL_UPDATE_NOW) {
  if (isInitialized) {
    // console.warn('⚠️ NowPlaying ya está inicializado');
    return;
  }

  // console.log('🎵 Inicializando NowPlaying component...');
  isInitialized = true;

  const modifiedDynamicTitle = replaceText(DINAMIC_TITLE_GENERATE, '----', station.name);

  // First load
  updateNowPlaying(station.api, modifiedDynamicTitle);

  // Update interval
  updateInterval = setInterval(() => {
    updateNowPlaying(station.api, modifiedDynamicTitle);
  }, RELOAD_INTERVAL_UPDATE_NOW);
  // ESPERA PARA RECARGAR CANCION
}

// Update actual song
export async function updateNowPlaying(apiUrl, modifiedDynamicTitle) {
  try {
    const data = await fetchWithAuth(apiUrl);
    
    if (!data?.now_playing?.song) {
      console.warn('⚠️ Estructura de datos inválida');
      return;
    }

    const song = data.now_playing.song;
    const newTitle = song.title || 'Desconocido';
    const newArtist = song.artist || 'Desconocido';
    const art = song.art;

    // Detect changes
    const normalizedTitle = newTitle.trim().toLowerCase();
    const normalizedArtist = newArtist.trim().toLowerCase();
    const currentNormalizedTitle = (currentSongData.title || '').trim().toLowerCase();
    const currentNormalizedArtist = (currentSongData.artist || '').trim().toLowerCase();

    const hasChanged = currentNormalizedTitle !== normalizedTitle || 
                      currentNormalizedArtist !== normalizedArtist;

    const isFirstLoad = currentSongData.title === '' && currentSongData.artist === '';

    if (isFirstLoad || hasChanged) {
      // console.log('🎵 ' + (isFirstLoad ? 'PRIMERA CARGA' : 'CAMBIO DETECTADO'));
      
      currentSongData = {
        title: newTitle,
        artist: newArtist
      };

      // Update component player
      updatePlayerUI({
        title: newTitle,
        artist: newArtist,
        art: art,
        dinamicTitleGenerate: modifiedDynamicTitle
      });

      // Trigger event with Title Meta
      dispatchNowPlayingEvent(newTitle, newArtist, art);
    }

  } catch (error) {
    console.error('❌ Error en updateNowPlaying:', error);
  }
}

function dispatchNowPlayingEvent(title, artist, art) {
  const event = new CustomEvent('nowplaying:update', {
    detail: {
      title,
      artist,
      art,
      timestamp: new Date().toISOString()
    }
  });
  document.dispatchEvent(event);
  // console.log('📢 NowPlaying update event:', title);
}

export function getCurrentSong() {
  return { ...currentSongData };
}

export function stopNowPlaying() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
  isInitialized = false;
  currentSongData = { title: '', artist: '' };
  // console.log('⏹️ NowPlaying detenido');
}
