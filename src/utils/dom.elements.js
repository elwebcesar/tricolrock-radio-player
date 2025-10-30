/**
 * DOM element references 
 * @module dom-elements
 * 
 * Retrieves an element by its ID.
 * @param {string} id - ID of the element.
 * @returns {HTMLElement|null} DOM element or null if not found.
*/

const el = id => document.getElementById(id);

/**
 * DOM elements
 * @type {object}
*/
export const domElements = {
  // player elements
  audio: el('audio'),
  playButton: el('playButton'),
  volumeSlider: el('volumeSlider'),
  volumeLabel: el('volumeLabel'),
  currentCoverArt: el('currentCoverArt'),
  currentSong: el('currentSong'),
  currentArtist: el('currentArtist'),
  radioHeading: el('radio-heading'),
  onAirIndicator: el('on-air-indicator'),
  currentStationImage: el('currentStationImage'),
  currentStationPlaying: el('currentStationPlaying'),

  // history elements
  historyList: el('historyList'),

  // Share container element
  shareContainer: el('header__share'),

  // Visualizer element
  canvasVisualizer: el('visualizer')
};
