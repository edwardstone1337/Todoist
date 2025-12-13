/* ============================================
   Click Tracking Utility
   ============================================ */

/**
 * Tracks button click events to Google Analytics
 * @param {string} eventName - Name of the event (default: 'button_click')
 * @param {Object} parameters - Event parameters to send to GA
 */
function trackButtonClick(eventName = 'button_click', parameters = {}) {
  // Only track if gtag is available (GA is loaded)
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters);
  }
}
