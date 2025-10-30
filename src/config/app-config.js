/**
 * @file app-config.js
 * Application configuration module for Radio Player (Tricolrock v2.2).
 * Centralizes all constants, texts, intervals, and color utilities.
*/

import { getCssVariable } from '../helpers/index.js';

// ----------------------------------------------------------------------------

// Default radio station ID to load on startup
export const DEFAULT_STATION = 'radio-tricolrock';

// Stations are displayed as buttons (true) or links (false)
export const DEFAULT_USE_BUTTONS = true;

// ----------------------------------------------------------------------------

// Maximum number of tracks to display in the history list
export const MAX_ITEMS_HISTORY = 6;


// ----------------------------------------------------------------------------
// Time interval (ms) to update

// track history
export const RELOAD_INTERVAL_HISTORY = (2 * 60 * 1000) + (40 * 1000); // 2:40 min

// "Now Playing" information.
export const RELOAD_INTERVAL_UPDATE_NOW = 40000; // 40 seconds


// -----------------------------------------------------------------------------
// Dynamic content

// Original page title before dynamic updates
export const INITIAL_TITLE = document.title;

// Template for dynamic page title
export const DINAMIC_TITLE_GENERATE ='🤘 //// en ---- 🇨🇴 🎶';

// Share message template
export const MESSAGE_TO_SHARE = 'Estoy escuchando a ARTIST - "TRACK", en ----';


// -----------------------------------------------------------------------------
// Colors

/**
 * @function getColors
 * @description Returns an object with all theme colors from CSS variables.
 * @returns {Object} Color palette with named properties.
 */
const getColors = () => {
  const BASE_COLOR_DARK = getCssVariable('--base-color-dark');
  const COLOR_YELLOW = getCssVariable('--color-col-yellow');
  const COLOR_BLUE = getCssVariable('--color-col-blue');
  const COLOR_RED = getCssVariable('--color-col-red');

  return {
    BASE_COLOR_DARK,
    /**
     * @memberof getColors
     * @description Array of accent colors for visualizer.
     * @returns {string[]}
     */
    DEFAULT_COLOURS: [COLOR_YELLOW, COLOR_BLUE, COLOR_RED],
    /**
     * @memberof getColors
     * @description Default accent color (blue).
     * @returns {string}
     */
    defaultColor: COLOR_BLUE
  };
};

export const COLOR_CONSTANTS = getColors();

// const { 
//   BASE_COLOR_DARK, 
//   DEFAULT_COLOURS, 
//   defaultColor 
// } = getColors();

// export { 
//   BASE_COLOR_DARK, 
//   DEFAULT_COLOURS, 
//   defaultColor 
// };

/*
export const APP_CONFIG = {
  MAIN_STATION,
  USE_BUTTONS,
  MAX_ITEMS_HISTORY,
  RELOAD_INTERVAL_HISTORY,
  RELOAD_INTERVAL_UPDATE_NOW,
  INITIAL_TITLE,
  DINAMIC_TITLE_GENERATE,
  MESSAGE_TO_SHARE,
  getColors,
  getCssVariable
};
*/
