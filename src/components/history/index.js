/**
 * Manages the display and updating of the song history list.
 * Gestiona la visualización y actualización de la lista de historial de canciones.
 * @module history-component
*/

import { fetchWithAuth } from '../../services/api.js';
import { domElements } from '../../utils/dom.elements.js';
import {
  CSS_CLASS_HISTORY_SONG,
  CSS_CLASS_HISTORY_SONG_LINK
} from '../../utils/cssClasses.js';

const API_KEY = '4d397dbac5066e4d:3088f0271d6961cbdd3e83d9ec21a19b';
const list = domElements.historyList; // DOM Element
if (!list) console.warn('⚠️ historyList not found in DOM');

let updateInterval = null;
let isInitialized = false;

// Filter from the data
function shouldFilter(item, exclusionTerm) {
  const title = item.song?.title || '';
  const artist = item.song?.artist || '';
  const term = exclusionTerm;

  const containsExclusionTerm = title.toLowerCase().includes(term) ||
                                 artist.toLowerCase().includes(term);

  return !containsExclusionTerm;
}

// Create <li> element
function createHistoryItem(item) {
  const title  = item.song?.title  || 'Desconocido';
  const artist = item.song?.artist || 'Desconocido';
  const key    = `${title} | ${artist}`;
  const songLink = `https://open.spotify.com/search/${encodeURIComponent(title + ' ' + artist)}`;

  const li = document.createElement('li');
  li.dataset.key = key;
  li.setAttribute('role', 'listitem');

  const article = document.createElement('article');
  article.className = CSS_CLASS_HISTORY_SONG;
  article.setAttribute('itemscope', '');
  article.setAttribute('itemtype', 'https://schema.org/MusicRecording');

  const link = document.createElement('a');
  link.href = songLink;
  link.setAttribute('aria-label', `Escuchar ${title} de ${artist} en Spotify (abre en nueva ventana)`);
  link.setAttribute('rel', 'noopener noreferrer');
  link.setAttribute('target', '_blank');
  link.className = CSS_CLASS_HISTORY_SONG_LINK;
  link.setAttribute('itemprop', 'url');

  const h4 = document.createElement('h4');
  h4.setAttribute('itemprop', 'name');
  h4.textContent = title;

  const p = document.createElement('p');
  p.setAttribute('itemprop', 'byArtist');
  p.textContent = artist;

  link.appendChild(h4);
  link.appendChild(p);
  article.appendChild(link);
  li.appendChild(article);

  return li;
}

async function loadHistory(historyUrl, MAX_ITEMS_HISTORY) {
  if (!list) return;

  const isFirstLoad = !list.hasAttribute('data-history-loaded');
  let loader = isFirstLoad ? list.firstElementChild : null;

  try {
    let data = await fetchWithAuth(historyUrl, API_KEY);
    data = data.filter(item => shouldFilter(item, "tricolrock"));

    if (!Array.isArray(data) || data.length === 0) return;

    if (isFirstLoad) {
      // First load: add up to MAX_ITEMS_HISTORY items
      list.innerHTML = ''; 
      for (let i = 0; i < MAX_ITEMS_HISTORY && i < data.length; i++) {
        list.appendChild(createHistoryItem(data[i]));
      }
      list.setAttribute('data-history-loaded', 'true');
    } else {
      // Subsequent loads: add only the most recent item if it is not duplicated
      const newest = data[0];
      const title = newest.song?.title || 'Desconocido';
      const artist = newest.song?.artist || 'Desconocido';
      const key = `${title} | ${artist}`;

      // Avoid duplicates
      if (list.firstElementChild?.dataset.key === key) return;

      const li = createHistoryItem(newest);
      list.prepend(li);

      // Maintain limit
      while (list.children.length > MAX_ITEMS_HISTORY) {
        list.lastElementChild?.remove();
      }
    }
  } catch (err) {
    console.error('❌ Error en loadHistory:', err);
  } finally {
    loader?.remove();
  }
}

/**
 * Initializes the history component, loads the first set of data, and sets up the update interval.
 * @param {string} historyUrl - The URL for the history endpoint.
 * @param {number} MAX_ITEMS_HISTORY - The maximum number of items to maintain in the list.
 * @param {number} RELOAD_INTERVAL_HISTORY - The time in milliseconds between history updates.
 * @export
 */
export function initHistory(historyUrl, MAX_ITEMS_HISTORY, RELOAD_INTERVAL_HISTORY) {
  if (isInitialized) {
    // console.warn('⚠️ History ya está inicializado');
    return;
  }
  isInitialized = true;

  // console.log('📜 Inicializando History component...');

  // First load
  loadHistory(historyUrl, MAX_ITEMS_HISTORY);

  updateInterval = setInterval(() => {
    loadHistory(historyUrl, MAX_ITEMS_HISTORY);
  }, RELOAD_INTERVAL_HISTORY);
}

/**
 * Stops the history component, clears the update interval, and resets the DOM.
 * @export
*/
export function stopHistory(stationName) {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }

  isInitialized = false;
  if (list) {
    list.innerHTML = ''; // Clear the history list
    // list.innerHTML = '<li><span><iconify-icon class="radio__history-list-loader" icon="codex:loader"></iconify-icon></li>';
    list.innerHTML = `<li><span><iconify-icon class="radio__history-list-loader" icon="codex:loader"></iconify-icon> ${stationName}</span></li>`;
    list.removeAttribute('data-history-loaded'); // Reset loaded state
  }
  // console.log('⏹️ stop History');
}
