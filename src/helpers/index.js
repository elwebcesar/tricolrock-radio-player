/**
 * Replaces all occurrences of a specified text with a new text in a given string.
 *
 * @param {string} str - The original string.
 * @param {string} oldText - The text to be replaced.
 * @param {string} newText - The text to replace with.
 * @returns {string} The modified string with all occurrences of oldText replaced by newText.
*/

export function replaceText(str, oldText, newText) {
  return str.replace(new RegExp(oldText, 'g'), newText);
}

/**
 * Retrieves the value of a CSS custom property defined in `:root`.
 *
 * @param {string} variableName - The name of the CSS variable (e.g., '--my-variable').
 * @returns {string} The value of the CSS variable, with leading and trailing whitespace removed.
 *                   Returns an empty string if the variable does not exist or has no value.
*/
export function getCssVariable(variableName) {
    const rootStyles = getComputedStyle(document.documentElement);
    return rootStyles.getPropertyValue(variableName).trim();
}

/**
 * Convert hexadecimal - #FF0000, #F00 to RGB - rgb(255, 0, 0)
 *
 * @param {string} hex - Hexadecimal color - including #
 * @returns {string|null}
*/
export function hexToRgb(hex) {
  // Clear intial '#'
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b; // Expand the short format (#RGB to #RRGGBB)
  });

  // Apply regular expression for the RRGGBB format
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  // Convert hexadecimal values ​​to base 10 (decimal)
  return result ? 
    `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` 
    : null;
}
