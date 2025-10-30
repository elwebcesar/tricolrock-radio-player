/**
 * Classes and animations CSS
 * @module css-classes
*/

// Animation classes
export const ANIMATION_SLIDE_OUT = 'animation-slide-out';
export const ANIMATION_SLIDE_IN = 'animation-slide-in';
export const ANIMATION_FADE_OUT = 'animation-fade-out';
export const ANIMATION_FADE_IN = 'animation-fade-in';

// CSS class for the "ON AIR" indicator
export const CSS_CLASS_ON_AIR_INDICATOR = 'header__status-indicator__on-air';

// CSS class List history
export const CSS_CLASS_HISTORY_SONG = 'radio__history__song';
export const CSS_CLASS_HISTORY_SONG_LINK = `${CSS_CLASS_HISTORY_SONG}-link`;

// CSS class list Statios
const prefixStations = 'stations__';
export const CSS_CLASS_STATIONS_LIST_LOADED =  `${prefixStations}list-items--loaded`;
export const CSS_CLASS_STATIONS_LIST_STATION =  `${prefixStations}station`;

// a.className = 'stations__station-link';
// a.classList.add('stations__station-link--active');
// span.className = 'stations__station-name';
// img.className = 'stations__station-image';
