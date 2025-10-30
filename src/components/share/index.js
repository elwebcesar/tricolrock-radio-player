/**
 * Share options
 * @module share
*/

let shareOpen = false;

function toggleShareOptions(optionsElement, force) {
  let shareOpen = typeof force === 'boolean' ? force : !optionsElement.classList.contains('show-share-options');
  optionsElement.classList.toggle('show-share-options', shareOpen);
  shareButton.setAttribute('aria-expanded', shareOpen);
}

/**
 * Sets up the share links.
 * @param {Object} options - Configuration options.
 * @param {HTMLElement} options.shareContainer - Container for the share elements.
 * @param {string} options.messageShare - Text the link to share.
*/
export function setupShareLinks({ shareContainer, messageShare }) {
  const shareButton = shareContainer.querySelector('button');
  const shareOptions  = shareContainer.querySelector('ul');
  const shareTwitter = shareContainer.querySelector('[data-network="twitter"]');
  const shareThreads = shareContainer.querySelector('[data-network="threads"]');
  const shareFacebook = shareContainer.querySelector('[data-network="facebook"]');

  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(
    messageShare
  );

  shareButton?.addEventListener('click', () => toggleShareOptions(shareOptions));

  shareTwitter.href = `https://twitter.com/intent/tweet?text=${text}`;
  shareThreads.href = `https://www.threads.net/intent/post?text=${text}`;
  // shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
  shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}&display=popup`;
}
