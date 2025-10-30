/**
 * Radio Player
 * Tricolrock
 * Versión 2.2
 * 
 * Features:
 * - Multiple stations
 * - Control player
 * - Current track information - Title, Artist, Cover art and Spotify link
 * - Audio visualizer
 * - Options for sharing the current topic
 * - View history, previous tracks, and links to Spotify
 * - Buttons for changing seasons
 * 
 * @author Cesar Fernandez
 * @version 1.2
 * @since 2025
*/

// DOM ELEMENTS
import { domElements } from './utils/dom.elements.js';

// UTILITY
import { replaceText, getCssVariable } from './helpers/index.js';

// PLAYER
import { initPlayer, updatePlayerUI } from './components/player/index.js';

// UPDATE UI
import { initNowPlaying, stopNowPlaying } from './components/player/now-playing.js';

// SHARE
import { setupShareLinks } from './components/share/index.js';

// SERVICES
import { getAnalyser } from './services/audio-service.js';

// AUDIO VISUALIZER
import { startVisualizer } from './components/visualizer/index.js';


// HISTORY
import { initHistory, stopHistory } from './components/history/index.js';

// STATIONS-LIST
import { createStationsList } from './components/stations-list/index.js';

// ----------------------------------------------------------------------------

// GENERAL CONFIG
import { 
  DEFAULT_STATION, 
  DEFAULT_USE_BUTTONS,
  COLOR_CONSTANTS,

  MAX_ITEMS_HISTORY,
  RELOAD_INTERVAL_HISTORY,
  RELOAD_INTERVAL_UPDATE_NOW,
  INITIAL_TITLE,
  DINAMIC_TITLE_GENERATE,
  MESSAGE_TO_SHARE
} from './config/app-config.js';

const { 
  BASE_COLOR_DARK, 
  DEFAULT_COLOURS, 
  defaultColor 
} = COLOR_CONSTANTS;

// ----------------------------------------------------------------------------

const USE_BUTTONS = window.USE_BUTTONS ?? DEFAULT_USE_BUTTONS;
let main_station = localStorage.getItem('main_station') || window.main_station || DEFAULT_STATION;
console.log(window.USE_BUTTONS, ' use // ', USE_BUTTONS)
console.log(window.main_station, ' // ', main_station)
let STATIONS = {};

// ----------------------------------------------------------------------------

async function loadStations() {
  try {
    const res = await fetch('js/stations.json');

    if (!res.ok) throw new Error('No se pudo leer stations.json');

    const data = await res.json();
    STATIONS = data.reduce((acc, st) => {
      acc[st.id] = st;
      return acc;
    }, {});
    // console.log('✅ Estaciones externas cargadas:', STATIONS);

    importPlayer(STATIONS[main_station]);
    setupStationsList();
  } catch (err) {
    console.error('❌ Error cargando stations.json:', err);
  }
}

function importPlayer(station) {
  // 1. Set loading state in UI
  updatePlayerUI({
    title: station.name,
    artist: 'Cargando',
    // art: station.logo,
    art: `${window.location.href}/images/tricolrock.webp`,
    dinamicTitleGenerate: `Cargando... ${station.name}`
  });

  // 2. Stop previous now-playing instance
  stopNowPlaying();
  stopHistory(station.name);
  
  // 3. start player - principal
  initPlayer(station, (playerReady, receivedTitle) => {
  // initPlayer(station, (playerReady) => {
  // initNowPlaying(station, (nowPlayingReady) => {
    // console.log('🎵 CALLBACK PLAYER - Ready:', playerReady, 'Station:', station.name);
    
    if (playerReady) {
      // console.log('🎵 ready Player');

      // 4. start component NowPlaying
      initNowPlaying(station, DINAMIC_TITLE_GENERATE, RELOAD_INTERVAL_UPDATE_NOW);

      // 5. star component history
      initHistory(station.history, MAX_ITEMS_HISTORY, RELOAD_INTERVAL_HISTORY);

      // 6. start component share
      const shareContainer = domElements.shareContainer;
      document.addEventListener('nowplaying:update', (e) => {
        if (shareContainer) {
          const { title, artist } = e.detail;
          let messageShare = replaceText(MESSAGE_TO_SHARE, '----', station.name);
          messageShare = replaceText(messageShare, 'TRACK', title);
          messageShare = replaceText(messageShare, 'ARTIST', artist);
          setupShareLinks({ shareContainer, messageShare });
        }
      }, { once: true }); // Use once to prevent multiple listeners
    }
  // });
  }, INITIAL_TITLE, defaultColor);

  // 7. start component visualizer
  const analyser = getAnalyser(); // AnalyserNode
  const canvasVisualizer = domElements.canvasVisualizer;
  if (canvasVisualizer && analyser) {
    canvasVisualizer.style.display = 'block';
    startVisualizer(canvasVisualizer, analyser, station.color, DEFAULT_COLOURS);
  }
}

// 8. start component stations list
// Function to handle station change (for buttons)
function handleStationChange(stationId) {
  if (stationId !== main_station && STATIONS[stationId]) {
    main_station = stationId;
    importPlayer(STATIONS[main_station]);
    setupStationsList();
  }
}

// Setup stations list (links or buttons)
function setupStationsList() {(STATIONS, main_station, handleStationChange);
  createStationsList(STATIONS, main_station, USE_BUTTONS, BASE_COLOR_DARK, handleStationChange);
}

// Starts when the DOM is ready
window.addEventListener('DOMContentLoaded', loadStations);
