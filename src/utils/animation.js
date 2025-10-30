/**
 * Manages text animation for UI elements.
 * Gestiona la animación de texto para elementos de la interfaz.
 * @module animation
 */

/**
 * Animates text change for a given element.
 * @param {HTMLElement} element - The element to animate.
 * @param {string} newText - The new text to display.
 * @param {string} exitAnimation - The CSS class for the exit animation.
 * @param {string} enterAnimation - The CSS class for the enter animation.
 * 
 * Anima el cambio de texto para un elemento dado.
 * @param {HTMLElement} element - El elemento a animar.
 * @param {string} newText - El nuevo texto a mostrar.
 * @param {string} exitAnimation - La clase CSS para la animación de salida.
 * @param {string} enterAnimation - La clase CSS para la animación de entrada.
 */
export const animateTextChange = (element, newText, exitAnimation, enterAnimation) => {
  if (!element) {
    console.warn('⚠️ Element not found for animation');
    return;
  }

  if (element.textContent !== newText) {
    element.classList.add(exitAnimation);

    element.addEventListener('animationend', () => {
      element.textContent = newText;
      element.classList.remove(exitAnimation);
      element.classList.add(enterAnimation);

      element.addEventListener('animationend', () => {
        element.classList.remove(enterAnimation);
        // console.log('🎬 Animation completed');
      }, { once: true });
    }, { once: true });
  }
};
