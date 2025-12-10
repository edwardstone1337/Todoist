/* ============================================
   How It Works Page - Interactive Features
   ============================================ */

// ============================================
// Table of Contents Smooth Scrolling
// ============================================

/**
 * Initialize smooth scrolling for TOC links
 */
function initTOCSmoothScroll() {
  const tocLinks = document.querySelectorAll('.toc-link');
  
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Calculate offset for sticky nav
          const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without triggering scroll
          history.pushState(null, '', href);
        }
      }
    });
  });
}

// ============================================
// Accordion Functionality
// ============================================

/**
 * Initialize accordion functionality
 */
function initAccordions() {
  const accordionTriggers = document.querySelectorAll('.accordion__trigger');
  
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const contentId = trigger.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      
      if (!content) return;
      
      // Toggle state
      const newState = !isExpanded;
      trigger.setAttribute('aria-expanded', String(newState));
      
      if (newState) {
        // Expand
        content.removeAttribute('hidden');
        // Force reflow to trigger transition
        requestAnimationFrame(() => {
          content.classList.add('accordion__content--expanded');
        });
      } else {
        // Collapse
        content.classList.remove('accordion__content--expanded');
        // Wait for transition before hiding
        setTimeout(() => {
          if (trigger.getAttribute('aria-expanded') === 'false') {
            content.setAttribute('hidden', '');
          }
        }, 300);
      }
    });
    
    // Keyboard support
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });
}

// ============================================
// Use Case Button Handlers
// ============================================

// Use case URLs and task titles
const useCaseData = {
  0: {
    url: 'https://todoist.com/add?',
    taskTitle: 'Blank Quick Add'
  },
  1: {
    url: 'https://todoist.com/add?content=Empty%20dishwasher&date=in%202%20hours&priority=3',
    taskTitle: 'Empty dishwasher'
  },
  2: {
    url: 'https://todoist.com/add?content=Move%20laundry%20to%20dryer&date=in%2045%20minutes&priority=2',
    taskTitle: 'Move laundry to dryer'
  },
  3: {
    url: 'https://todoist.com/add?content=Check%20leftovers&date=in%203%20days&priority=3',
    taskTitle: 'Check leftovers'
  },
  4: {
    url: 'https://todoist.com/add?content=Water%20plants&date=in%203%20days&priority=3',
    taskTitle: 'Water plants'
  },
  5: {
    url: 'https://todoist.com/add?content=Come%20back%20for%20tea&date=in%204%20minutes&priority=2',
    taskTitle: 'Come back for tea'
  },
  6: {
    url: 'https://todoist.com/add?content=Buy%20NFC%20tags&priority=3',
    taskTitle: 'Buy NFC tags'
  }
};

// Legacy support - keep useCaseUrls for existing code
const useCaseUrls = {
  0: useCaseData[0].url,
  1: useCaseData[1].url,
  2: useCaseData[2].url,
  3: useCaseData[3].url,
  4: useCaseData[4].url,
  5: useCaseData[5].url,
  6: useCaseData[6].url
};

/**
 * Copy URL to clipboard
 * @param {string} url - URL to copy
 */
async function copyUseCaseUrl(url) {
  try {
    await navigator.clipboard.writeText(url);
    showCopySuccess();
  } catch (err) {
    // Fallback for older browsers
    fallbackCopyToClipboard(url);
  }
}

/**
 * Fallback copy method for older browsers
 * @param {string} text - Text to copy
 */
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showCopySuccess();
  } catch (err) {
    console.error('Failed to copy text:', err);
  } finally {
    document.body.removeChild(textArea);
  }
}

/**
 * Shows snackbar after copying
 */
function showCopySuccess() {
  const snackbar = document.getElementById('snackbar');
  if (!snackbar) return;
  
  snackbar.hidden = false;
  
  // Hide snackbar after 6 seconds
  setTimeout(() => {
    snackbar.hidden = true;
  }, 6000);
}

/**
 * Sanitizes task name for use in filename
 * @param {string} taskName - Task name to sanitize
 * @returns {string} Sanitized task name
 */
function sanitizeTaskNameForFilename(taskName) {
  if (!taskName || !taskName.trim()) {
    return '';
  }
  
  // Remove invalid filesystem characters: / \ : * ? " < > |
  let sanitized = taskName.trim()
    .replace(/[/\\:*?"<>|]/g, '')
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
  
  // Limit length to 100 characters
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
    // Remove trailing hyphen if truncation created one
    sanitized = sanitized.replace(/-+$/, '');
  }
  
  return sanitized;
}

/**
 * Generates and downloads QR code
 * @param {string} url - URL to generate QR code for
 * @param {number} useCaseNumber - Use case number for filename
 */
async function generateAndDownloadQR(url, useCaseNumber) {
  const qrSize = 300;
  const encodedUrl = encodeURIComponent(url);
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedUrl}&size=${qrSize}x${qrSize}&format=png`;
  
  // Get task title for filename
  const useCase = useCaseData[useCaseNumber];
  const taskTitle = useCase ? useCase.taskTitle : '';
  const sanitizedTaskName = sanitizeTaskNameForFilename(taskTitle);
  const filename = sanitizedTaskName 
    ? `todoist-${sanitizedTaskName}-qr.png`
    : `todoist-use-case-${useCaseNumber}-qr.png`;
  
  try {
    // Fetch the QR code image
    const response = await fetch(qrApiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch QR code image');
    }
    
    // Convert to blob
    const blob = await response.blob();
    
    // Create object URL
    const objectUrl = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = objectUrl;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up object URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 100);
    
  } catch (error) {
    console.error('Error downloading QR code:', error);
    // Fallback: try to download using the image src directly
    const link = document.createElement('a');
    link.download = filename;
    link.href = qrApiUrl;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Initialize use case button handlers
 */
function initUseCaseButtons() {
  const useCaseButtons = document.querySelectorAll('.use-case__button');
  
  useCaseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const useCaseNumber = parseInt(button.getAttribute('data-use-case'));
      const action = button.getAttribute('data-action');
      const url = useCaseUrls[useCaseNumber];
      
      if (!url) return;
      
      switch (action) {
        case 'add-task':
          // Open URL in new tab
          window.open(url, '_blank');
          break;
          
        case 'copy-link':
          // Copy URL to clipboard
          copyUseCaseUrl(url);
          break;
          
        case 'download-qr':
          // Generate and download QR code
          generateAndDownloadQR(url, useCaseNumber);
          break;
      }
    });
  });
}

// ============================================
// Anchor Link Smooth Scrolling
// ============================================

/**
 * Initialize smooth scrolling for anchor links (handles nav offset)
 * Excludes TOC links which have their own handler
 */
function initAnchorLinkSmoothScroll() {
  // Handle anchor links that aren't TOC links
  document.querySelectorAll('a[href^="#"]:not(.toc-link)').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          // Calculate offset for sticky nav
          const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without triggering scroll
          history.pushState(null, '', href);
        }
      }
    });
  });
}

// ============================================
// Initialize All Features
// ============================================

/**
 * Initialize all interactive features when DOM is ready
 */
function initHowItWorksPage() {
  // Only run on how-it-works page
  if (!document.querySelector('.toc-nav')) {
    return;
  }
  
  initTOCSmoothScroll();
  initAnchorLinkSmoothScroll();
  initAccordions();
  initUseCaseButtons();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHowItWorksPage);
} else {
  initHowItWorksPage();
}
