/* ============================================
   Navigation Component
   Generates navigation HTML for all pages
   ============================================ */

/**
 * Renders the navigation bar HTML
 * @param {string} currentPage - The current page ('generator' or 'how-it-works')
 * @returns {string} HTML string for the navigation element
 */
function renderNavigation(currentPage) {
  const isGenerator = currentPage === 'generator';
  const isHowItWorks = currentPage === 'how-it-works';
  
  // Determine active link classes and aria attributes
  const generatorLinkClass = isGenerator ? 'nav__link nav__link--active' : 'nav__link';
  const generatorAria = isGenerator ? ' aria-current="page"' : '';
  const howItWorksLinkClass = isHowItWorks ? 'nav__link nav__link--active' : 'nav__link';
  const howItWorksAria = isHowItWorks ? ' aria-current="page"' : '';
  
  return `
  <nav class="nav" aria-label="Main navigation">
    <a href="/" class="nav__title">TaskGen</a>
    <div class="nav__links">
      <a href="/" class="${generatorLinkClass}"${generatorAria}>Generator</a>
      <a href="/how-it-works" class="${howItWorksLinkClass}"${howItWorksAria}>How it works</a>
    </div>
    <div class="theme-toggle">
      <button id="theme-toggle-btn" class="button button--icon" aria-label="Theme options" aria-haspopup="true" aria-expanded="false" aria-controls="theme-menu">
        <svg class="theme-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M10 2V4M10 16V18M18 10H16M4 10H2M15.6569 4.34315L14.2426 5.75736M5.75736 14.2426L4.34315 15.6569M15.6569 15.6569L14.2426 14.2426M5.75736 5.75736L4.34315 4.34315" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
      <div id="theme-menu" class="theme-menu" role="menu" aria-orientation="vertical" aria-label="Theme selection" hidden>
        <button class="theme-menu__item" role="menuitemradio" aria-checked="false" data-theme-value="system">
          <span>System</span>
          <svg class="theme-check" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" hidden>
            <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="theme-menu__item" role="menuitemradio" aria-checked="false" data-theme-value="light">
          <span>Light</span>
          <svg class="theme-check" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" hidden>
            <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="theme-menu__item" role="menuitemradio" aria-checked="false" data-theme-value="dark">
          <span>Dark</span>
          <svg class="theme-check" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" hidden>
            <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>`;
}
