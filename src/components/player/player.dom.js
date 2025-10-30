/**
 * Manages DOM interactions for the radio player UI.
 * Gestiona las interacciones con el DOM para la interfaz del reproductor de radio.
 * @module player-dom
*/

import { domElements } from '../../utils/dom.elements.js';
import { ICONS } from '../../utils/icons.js';
import { animateTextChange } from '../../utils/animation.js';
import {
  CSS_CLASS_ON_AIR_INDICATOR,
  ANIMATION_SLIDE_OUT,
  ANIMATION_SLIDE_IN,
  ANIMATION_FADE_OUT,
  ANIMATION_FADE_IN,
} from '../../utils/cssClasses.js';

// CSS class for the "ON AIR" indicator
const cssClassOnAirUndicator = CSS_CLASS_ON_AIR_INDICATOR;

// Animation classes
const animationSlideOut = ANIMATION_SLIDE_OUT;
const animationSlideIn = ANIMATION_SLIDE_IN;
const animationFadeOut = ANIMATION_FADE_OUT;
const animationFadeIn = ANIMATION_FADE_IN;

export const audio = domElements.audio;
export const playBtn = domElements.playButton;
export const volSlider = domElements.volumeSlider;
export const volLabel = domElements.volumeLabel;
export const coverArt = domElements.currentCoverArt;
export const songName = domElements.currentSong;
export const artistName = domElements.currentArtist;
export const stationLbl = domElements.radioHeading;
export const onAirInd = domElements.onAirIndicator;
export const stationImg = domElements.currentStationImage;
export const stationTxt = domElements.currentStationPlaying;

// Get the inner elements
const songNameSpan = domElements.currentSong?.querySelector('span');
const artistNameSpan = domElements.currentArtist?.querySelector('span');
const coverArtImg = domElements.currentCoverArt?.querySelector('img');

export const ui = {
  /**
   * Sets the station label text.
   * Establece el texto de la etiqueta de la estación.
   * @param {string} text - The text to set.
  */
  setStationLabel: text => {
    if (stationLbl) {
      stationLbl.textContent = text;
    } else {
      console.warn('⚠️ stationLbl not found');
    }
  },

  /**
   * Sets the play/pause icon.
   * Establece el ícono de reproducción/pausa.
   * @param {boolean} isPlaying - Whether the player is playing.
  */
  setPlayIcon: isPlaying => {
    if (playBtn) {
      playBtn.innerHTML = isPlaying ? ICONS.pause : ICONS.play;
    } else {
      console.warn('⚠️ playBtn not found');
    }
  },

  /**
   * Sets the loading icon.
   * Establece el ícono de carga.
  */
  setLoadingIcon: () => {
    if (playBtn) {
      playBtn.innerHTML = ICONS.loader;
    } else {
      console.warn('⚠️ playBtn not found');
    }
  },

  /**
   * Sets the volume label.
   * Establece la etiqueta de volumen.
   * @param {number} value - Volume value (0-100).
  */
  setVolumeLabel: value => {
    if (!volLabel) {
      console.warn('⚠️ volLabel not found');
      return;
    }
    volLabel.innerHTML = '';
    const hidden = document.createElement('span');
    hidden.className = 'visually-hidden';
    hidden.textContent = 'Volumen en';
    volLabel.appendChild(hidden);
    volLabel.appendChild(document.createTextNode(value + '%'));
  },

  /**
   * Sets the cover art image and link.
   * @param {string} src - Image source URL.
   * @param {string} alt - Image alt text.
   * @param {string} songLink - Song link URL.
   * @param {string} aria - Aria label for accessibility.
  */
  setCoverArt: (src, alt, songLink, aria) => {
    if (!coverArtImg || !coverArt) {
      console.warn('⚠️ coverArt or coverArtImg not found');
      return;
    }
    const validSongLink = songLink && typeof songLink === 'string' ? songLink : '#';
    const validAria = aria && typeof aria === 'string' ? aria : `Portada: ${alt}`;

    coverArtImg.src = src;
    coverArtImg.alt = alt;
    coverArt.href = validSongLink;
    coverArt.setAttribute('aria-label', validAria);
  },

  /**
   * Sets the song title with animation.
   * @param {string} title - Song title.
  */
  setSongTitle: title => {
    animateTextChange(songNameSpan, title, animationSlideOut, animationFadeIn);
  },

  /**
   * Sets the artist name with animation.
   * @param {string} artist - Artist name.
  */
  setArtistName: artist => {
    animateTextChange(artistNameSpan, artist, animationFadeOut, animationSlideIn);
  },

  /**
   * Toggles the on-air indicator.
   * Alterna el indicador de emisión.
   * @param {boolean} active - Whether the on-air indicator is active. / Si el indicador de emisión está activo.
  */
  setOnAir: active => {
    if (onAirInd) {
      onAirInd.classList.toggle(cssClassOnAirUndicator, active);
    } else {
      console.warn('⚠️ onAirInd not found');
    }
  },

  /**
   * Sets the station image.
   * @param {string} src - Image source URL.
   * @param {string} alt - Image alt text.
  */
  setStationImage: (src, alt) => {
    if (!stationImg) {
      console.warn('⚠️ stationImg not found');
      return;
    }
    stationImg.src = src;
    stationImg.alt = alt;
  },

  /**
   * Sets the station text.
   * @param {string} text - Text to set.
  */
  setStationText: text => {
    if (stationTxt) {
      stationTxt.textContent = text;
    } else {
      console.warn('⚠️ stationTxt not found');
    }
  },

  /**
   * Sets the document title.
   * @param {string} title - Title to set.
  */
  setDocumentTitle: title => {
    if (typeof title === 'string' && title) {
      document.title = title;
    } else {
      console.warn('⚠️ Invalid title, not updated');
    }
  },

  /**
   * Resets the UI to its initial state.
  */
  resetUI: () => {
    if (stationLbl) stationLbl.textContent = '';
    if (songNameSpan) songNameSpan.textContent = '';
    if (artistNameSpan) artistNameSpan.textContent = '';
    if (coverArtImg) {
      coverArtImg.src = '';
      coverArtImg.alt = '';
    }
    if (coverArt) {
      coverArt.href = '#';
      coverArt.setAttribute('aria-label', '');
    }
    if (stationImg) {
      stationImg.src = '';
      stationImg.alt = '';
    }
    if (stationTxt) stationTxt.textContent = '';
    if (onAirInd) onAirInd.classList.remove(cssClassOnAirUndicator);
    if (volLabel) volLabel.innerHTML = '';
    console.log('🧹 UI reset');
  }
};
