/**
 * Radio Stations List Component - links or buttons
 * @module stations-list
*/

const stationSelector = document.getElementById('stationSelector');
if (!stationSelector) console.warn('⚠️ stationSelector not found');

// import { hexToRgb } from '../../helpers/index.js';
import {
  CSS_CLASS_STATIONS_LIST_LOADED,
  CSS_CLASS_STATIONS_LIST_STATION
} from '../../utils/cssClasses.js';

/**
 * Creates the list of radio station buttons
 * @param {Object} stations - Object containing the radio stations.
 * @param {string} activeStationId - ID of the active station.
 * @param {boolean} USE_BUTTONS - Flag to determine whether to use buttons or link.
 * @param {Function} onStationChange - Callback function to handle station change.
*/
export function createStationsList(stations, activeStationId, USE_BUTTONS, BASE_COLOR_DARK, onStationChange) {
  stationSelector.innerHTML = '';
  stationSelector.classList.add(CSS_CLASS_STATIONS_LIST_LOADED);

  if (!stations || !Object.keys(stations).length) {
    console.error('❌ stations vacío o no existe');
    return;
  }

  Object.keys(stations).forEach(stationId => {
    const station = stations[stationId];
    if (station.active !== true) return;

    const isActive = stationId === activeStationId;

    // li
    const li = document.createElement('li');
    li.setAttribute('itemprop', 'itemListElement');
    li.setAttribute('itemscope', '');
    li.setAttribute('itemtype', 'https://schema.org/RadioStation');

    // element to create in list
    let containerElementInteraction;

    if (USE_BUTTONS) {
      // button
      containerElementInteraction = document.createElement('button');
      // containerElementInteraction.addEventListener('click', () => onStationChange(stationId));
      containerElementInteraction.addEventListener('click', () => {
        onStationChange(stationId);
        localStorage.setItem('main_station', stationId); // Save in Local Storage
      });           
    } else {
      // a
      containerElementInteraction = document.createElement('a');
      containerElementInteraction.href = `/${stationId}`;
    }

    containerElementInteraction.className = `${CSS_CLASS_STATIONS_LIST_STATION}-link`;
    if (isActive) {
      containerElementInteraction.classList.add(`${CSS_CLASS_STATIONS_LIST_STATION}-link--active`);
      containerElementInteraction.setAttribute('aria-current', 'page');
    }   
    containerElementInteraction.setAttribute('aria-label', `Escuchar ${station.name}`);

    // span
    const span = document.createElement('span');
    span.className = `${CSS_CLASS_STATIONS_LIST_STATION}-glow`;
    span.setAttribute('itemprop', 'name');
    // span.innerHTML = `<strong>${station.name}</strong>`;

    // img
    const img = document.createElement('img');
    img.src = station.logo;
    img.alt = `Logo de ${station.name}`;
    img.className = `${CSS_CLASS_STATIONS_LIST_STATION}-image`;
    img.setAttribute('itemprop', 'image');

    // containerElementInteraction.innerHTML = `<strong>${station.name}</strong>`;
    const strong = document.createElement('strong');
    strong.className = `${CSS_CLASS_STATIONS_LIST_STATION}-name`;
    // strong.textContent = station.name;
    const nameParts = station.name.split(' ');
    const word1 = nameParts[0] || '';
    const word2 = nameParts.length > 1 ? nameParts[1] : '';
    strong.textContent = word1;

    if (word2 && word2.length > 0) {
      const spanElement = document.createElement('span');
      spanElement.textContent = word2; 
      strong.appendChild(spanElement);
    }

    // strong.style.backgroundColor = `rgba(${hexToRgb(station.color)},.4)`;
    // const colorBack = (Array.isArray(station.color) && station.color.length >= 2) ? station.color[1] : station.color;
    // strong.style.backgroundColor = colorBack;

    if ( (Array.isArray(station.color) && station.color.length >= 2) ) {
      strong.style.backgroundImage = `linear-gradient(130deg, ${station.color[0]} 30%, ${station.color[1]} 65%, ${station.color[2]} 100%)`;
      strong.style.color = `rgb(${BASE_COLOR_DARK})`;
    } else {
      strong.style.backgroundColor = station.color;
      strong.style.color = station.color_light ? `rgb(${BASE_COLOR_DARK})` : '';
    }

    containerElementInteraction.appendChild(strong);
    containerElementInteraction.appendChild(span);
    containerElementInteraction.appendChild(img);
    li.appendChild(containerElementInteraction);
    stationSelector.appendChild(li);

    !USE_BUTTONS ? localStorage.removeItem('main_station') : null; // Clear Local Storage
  });

  // console.log('✅ Stations-buttons-list create:', Object.keys(stations).filter(id => stations[id].active).length);
}
