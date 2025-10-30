/**
 * Manages the theme settings for the radio station.
 * Gestiona la configuración de apariencia según la estación.
 * @module theme
 */

/**
 * Sets the station theme based on the provided station object.
 * @param {object} station - The station object containing color settings. / El objeto de la estación con configuraciones de color.
 */
export const setStationTheme = (station, defaultColor) => {
// export const setStationTheme = station => {
  if (!station.color) return;

  let primaryColor;
  // const defaultColor = '#1E448E';

  if (typeof station.color === 'string') {
    primaryColor = station.color;
  } else if (Array.isArray(station.color) && station.color.length >= 2) {
    primaryColor = station.color[1];
  } else {
    primaryColor = defaultColor;
  }

  if (station.color_light) {
    document.documentElement.style.setProperty('--color-primary-text', 'var(--color-back3)');
  } else {
    document.documentElement.style.setProperty('--color-primary-text', '#ffffff');
  }

  if (typeof primaryColor === 'string' && /^#[0-9A-Fa-f]{6}$/.test(primaryColor)) {
    document.documentElement.style.setProperty('--color-primary', primaryColor);
  } else {
    console.warn(`⚠️ Invalid color: ${primaryColor}, using default color.`);
  }
};
