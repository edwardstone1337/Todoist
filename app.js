/* ============================================
   Todoist TapLinks - Application Logic
   ============================================ */

// ============================================
// State Management
// ============================================

const state = {
  taskName: '',
  dueDate: '',
  priority: '4',
  project: '',
  generatedUrl: '',
  qrGenerated: false,
  qrImageUrl: ''
};

// ============================================
// DOM Elements
// ============================================

const elements = {
  form: document.getElementById('task-form'),
  taskNameInput: document.getElementById('task-name'),
  dueDateInput: document.getElementById('due-date'),
  priorityDropdown: document.getElementById('priority-dropdown'),
  priorityTrigger: document.getElementById('priority-trigger'),
  priorityMenu: document.querySelector('.priority-dropdown__menu'),
  priorityOptions: null, // Will be set after DOM loads
  projectInput: document.getElementById('project'),
  generateBtn: document.getElementById('generate-btn'),
  outputSection: document.getElementById('output-section'),
  generatedUrlInput: document.getElementById('generated-url'),
  copyUrlBtn: document.getElementById('copy-url-btn'),
  downloadQrBtn: document.getElementById('download-qr-btn'),
  qrContainer: document.getElementById('qr-container'),
  qrImage: document.getElementById('qr-image'),
  qrLoading: document.getElementById('qr-loading'),
  qrError: document.getElementById('qr-error'),
  snackbar: document.getElementById('snackbar'),
  taskNameError: document.getElementById('task-name-error'),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  themeMenu: document.getElementById('theme-menu'),
  themeMenuItems: document.querySelectorAll('.theme-menu__item'),
  bmcButtonContainer: document.getElementById('bmc-button-container'),
  coffeeButtonContainer: document.getElementById('coffee-button-container'),
  coffeeBtn: document.getElementById('coffee-btn')
};

// ============================================
// URL Generation
// ============================================

/**
 * Builds a Todoist "Add Task" URL from form inputs
 * @param {Object} params - Form parameters
 * @param {string} params.taskName - Task name (required)
 * @param {string} params.dueDate - Due date (optional)
 * @param {string} params.priority - Priority value 1-4 (always included, defaults to 4)
 * @param {string} params.project - Project name (optional)
 * @returns {string} Complete Todoist URL
 */
function buildTodoistUrl({ taskName, dueDate, priority, project }) {
  // Base URL
  let url = 'https://todoist.com/add?';
  
  // Build content parameter
  let content = taskName.trim();
  
  // If project is provided, append it using Quick Add syntax
  if (project && project.trim()) {
    content += ' #' + project.trim();
  }
  
  // Encode and add content parameter
  url += 'content=' + encodeURIComponent(content);
  
  // Add due date if provided
  if (dueDate && dueDate.trim()) {
    url += '&date=' + encodeURIComponent(dueDate.trim());
  }
  
  // Always add priority (defaults to 4 if not set)
  url += '&priority=' + (priority || '4');
  
  return url;
}

/**
 * Builds a Todoist "Add Task" URL for the coffee task
 * @returns {string} Complete Todoist URL for coffee task
 */
function buildCoffeeTaskUrl() {
  const taskContent = 'Buy Edward a coffee ☕ https://buymeacoffee.com/edward';
  return 'https://todoist.com/add?content=' + encodeURIComponent(taskContent);
}

// ============================================
// Form Validation
// ============================================

/**
 * Validates the task name field
 * @param {string} taskName - Task name to validate
 * @returns {boolean} True if valid
 */
function validateTaskName(taskName) {
  return taskName.trim().length > 0;
}

/**
 * Updates the generate button state based on validation
 */
function updateGenerateButtonState() {
  if (!elements.generateBtn) return;
  const isValid = validateTaskName(state.taskName);
  elements.generateBtn.disabled = !isValid;
}

/**
 * Shows error message for task name field
 * @param {string} message - Error message to display
 */
function showTaskNameError(message) {
  if (!elements.taskNameError || !elements.taskNameInput) return;
  elements.taskNameError.textContent = message;
  elements.taskNameInput.setAttribute('aria-invalid', 'true');
}

/**
 * Clears error message for task name field
 */
function clearTaskNameError() {
  if (!elements.taskNameError || !elements.taskNameInput) return;
  elements.taskNameError.textContent = '';
  elements.taskNameInput.removeAttribute('aria-invalid');
}

// ============================================
// Form Event Handlers
// ============================================

/**
 * Handles task name input changes
 */
function handleTaskNameChange() {
  if (!elements.taskNameInput) return;
  state.taskName = elements.taskNameInput.value;
  updateGenerateButtonState();
  saveFormData();
  
  if (validateTaskName(state.taskName)) {
    clearTaskNameError();
  }
}

/**
 * Handles form submission
 * @param {Event} e - Form submit event
 */
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Update state from form inputs
  state.taskName = elements.taskNameInput.value.trim();
  state.dueDate = elements.dueDateInput.value.trim();
  // Priority is already maintained in state and updated via dropdown handlers
  state.project = elements.projectInput.value.trim();
  
  // Validate task name
  if (!validateTaskName(state.taskName)) {
    showTaskNameError('Please give your task a name.');
    elements.taskNameInput.focus();
    return;
  }
  
  // Clear any previous errors
  clearTaskNameError();
  
  // Generate URL
  state.generatedUrl = buildTodoistUrl(state);
  
  // Update UI
  elements.generatedUrlInput.value = state.generatedUrl;
  elements.outputSection.hidden = false;
  
  // Show coffee buttons after successful generation
  elements.bmcButtonContainer.hidden = false;
  elements.coffeeButtonContainer.hidden = false;
  
  // Reset copy button state if it was in "Copied" state
  if (elements.copyUrlBtn.textContent === 'Copied') {
    elements.copyUrlBtn.textContent = 'Copy URL';
    elements.copyUrlBtn.setAttribute('aria-label', 'Copy URL');
  }
  
  // Generate QR code automatically
  generateQRCode();
  
  // Scroll to output section
  elements.outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Announce generation success to screen readers via aria-live region
  elements.outputSection.setAttribute('aria-label', 'Todoist link generated successfully');
}

// ============================================
// Form Data Persistence
// ============================================

const FORM_STORAGE_KEY = 'taskgen-form-data';

/**
 * Saves form data to localStorage
 */
function saveFormData() {
  if (!elements.form) return;
  
  const formData = {
    taskName: elements.taskNameInput?.value || '',
    dueDate: elements.dueDateInput?.value || '',
    priority: state.priority || '4',
    project: elements.projectInput?.value || ''
  };
  
  try {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
  } catch (err) {
    console.error('Failed to save form data:', err);
  }
}

/**
 * Restores form data from localStorage
 */
function restoreFormData() {
  if (!elements.form) return;
  
  try {
    const savedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (!savedData) return;
    
    const formData = JSON.parse(savedData);
    
    // Restore task name
    if (elements.taskNameInput && formData.taskName) {
      elements.taskNameInput.value = formData.taskName;
      state.taskName = formData.taskName;
    }
    
    // Restore due date
    if (elements.dueDateInput && formData.dueDate) {
      elements.dueDateInput.value = formData.dueDate;
      state.dueDate = formData.dueDate;
    }
    
    // Restore priority
    if (formData.priority) {
      state.priority = formData.priority;
      if (elements.priorityDropdown) {
        updatePriorityDisplay(formData.priority);
      }
    }
    
    // Restore project
    if (elements.projectInput && formData.project) {
      elements.projectInput.value = formData.project;
      state.project = formData.project;
    }
    
    // Update generate button state
    updateGenerateButtonState();
  } catch (err) {
    console.error('Failed to restore form data:', err);
  }
}

// ============================================
// Copy URL Functionality
// ============================================

/**
 * Copies the generated URL to clipboard
 */
async function copyUrlToClipboard() {
  try {
    await navigator.clipboard.writeText(state.generatedUrl);
    showCopySuccess();
  } catch (err) {
    // Fallback for older browsers
    fallbackCopyToClipboard(state.generatedUrl);
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
 * Shows snackbar and updates button label after copying
 */
function showCopySuccess() {
  // Update button label to "Copied"
  const originalText = elements.copyUrlBtn.textContent;
  const originalAriaLabel = elements.copyUrlBtn.getAttribute('aria-label');
  elements.copyUrlBtn.textContent = 'Copied';
  elements.copyUrlBtn.setAttribute('aria-label', 'URL copied to clipboard');
  
  // Show snackbar
  elements.snackbar.hidden = false;
  
  // Hide snackbar and restore button after 6 seconds
  setTimeout(() => {
    elements.snackbar.hidden = true;
    elements.copyUrlBtn.textContent = originalText;
    elements.copyUrlBtn.setAttribute('aria-label', originalAriaLabel || 'Copy URL');
  }, 6000);
}

// ============================================
// QR Code Generation
// ============================================

/**
 * Generates QR code from the generated URL using goQR API
 */
async function generateQRCode() {
  if (!state.generatedUrl) {
    return;
  }
  
  // Clear any previous errors
  clearQRError();
  
  // Show QR container with loading state
  elements.qrContainer.hidden = false;
  elements.qrContainer.setAttribute('aria-busy', 'true');
  elements.qrLoading.hidden = false;
  elements.qrImage.hidden = true;
  
  try {
    // Build goQR API URL
    // API format: https://api.qrserver.com/v1/create-qr-code/?data=URL&size=SIZExSIZE
    const qrSize = 300;
    const encodedUrl = encodeURIComponent(state.generatedUrl);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedUrl}&size=${qrSize}x${qrSize}&format=png`;
    
    // Wait for image to load
    await new Promise((resolve, reject) => {
      // Remove previous event listeners by cloning the image
      const newImage = elements.qrImage.cloneNode(false);
      elements.qrImage.parentNode.replaceChild(newImage, elements.qrImage);
      elements.qrImage = newImage;
      
      let timeoutId;
      
      elements.qrImage.onload = () => {
        clearTimeout(timeoutId);
        // Hide loading, show QR image
        elements.qrLoading.hidden = true;
        elements.qrImage.hidden = false;
        elements.qrContainer.setAttribute('aria-busy', 'false');
        // Show QR container
        state.qrGenerated = true;
        state.qrImageUrl = qrApiUrl;
        // Clear any error messages
        clearQRError();
        resolve();
      };
      
      elements.qrImage.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error('Failed to load QR code image'));
      };
      
      // Set src after setting up event listeners
      elements.qrImage.src = qrApiUrl;
      
      // Timeout after 10 seconds
      timeoutId = setTimeout(() => {
        reject(new Error('QR code generation timed out'));
      }, 10000);
    });
    
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Hide loading state
    elements.qrLoading.hidden = true;
    elements.qrContainer.setAttribute('aria-busy', 'false');
    // Show error
    showQRError('Couldn\'t generate the QR code. Give it another try.');
    elements.qrContainer.hidden = true;
    // Ensure error is visible even if container is hidden
    elements.qrError.style.display = 'block';
  }
}

/**
 * Shows error message for QR code generation
 * @param {string} message - Error message to display
 */
function showQRError(message) {
  elements.qrError.textContent = message;
}

/**
 * Clears error message for QR code generation
 */
function clearQRError() {
  elements.qrError.textContent = '';
  elements.qrError.style.display = '';
}

/**
 * Sanitizes a task name for use in a filename
 * @param {string} taskName - Task name to sanitize
 * @returns {string} Sanitized task name, or empty string if invalid
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
 * Downloads QR code as PNG
 */
async function downloadQRCode() {
  if (!state.qrGenerated || !elements.qrImage || !elements.qrImage.src) {
    return;
  }
  
  // Generate filename with task name
  const sanitizedTaskName = sanitizeTaskNameForFilename(state.taskName);
  const filename = sanitizedTaskName 
    ? `todoist-${sanitizedTaskName}-qr.png`
    : 'todoist-task-qr.png';
  
  try {
    // Fetch the QR code image
    const response = await fetch(elements.qrImage.src);
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
    link.href = elements.qrImage.src;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// ============================================
// Theme Management
// ============================================

const THEME_STORAGE_KEY = 'todoist-taplinks-theme';
const THEME_SYSTEM = 'system';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

/**
 * Gets the system theme preference
 * @returns {string} 'light' or 'dark'
 */
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT;
}

/**
 * Gets the stored theme preference or defaults to system
 * @returns {string} Theme preference
 */
function getStoredTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || THEME_SYSTEM;
}

/**
 * Applies the theme to the document
 * @param {string} theme - Theme to apply ('system', 'light', or 'dark')
 */
function applyTheme(theme) {
  let actualTheme = theme;
  
  if (theme === THEME_SYSTEM) {
    actualTheme = getSystemTheme();
  }
  
  document.documentElement.setAttribute('data-theme', actualTheme);
  document.body.setAttribute('data-theme', actualTheme);
}

/**
 * Updates the theme menu checkmarks and ARIA attributes
 * @param {string} theme - Currently selected theme
 */
function updateThemeMenu(theme) {
  if (!elements.themeMenuItems || elements.themeMenuItems.length === 0) return;
  elements.themeMenuItems.forEach(item => {
    const value = item.getAttribute('data-theme-value');
    const check = item.querySelector('.theme-check');
    const isSelected = value === theme;
    
    // Update aria-checked
    item.setAttribute('aria-checked', String(isSelected));
    
    // Update visual checkmark
    if (isSelected) {
      check?.removeAttribute('hidden');
    } else {
      check?.setAttribute('hidden', '');
    }
  });
}

/**
 * Sets the theme preference
 * @param {string} theme - Theme preference ('system', 'light', or 'dark')
 */
function setTheme(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
  updateThemeMenu(theme);
  closeThemeMenu();
}

/**
 * Initializes the theme system
 */
function initializeTheme() {
  const storedTheme = getStoredTheme();
  applyTheme(storedTheme);
  updateThemeMenu(storedTheme);
  
  // Listen for system theme changes if using system preference
  if (storedTheme === THEME_SYSTEM) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (getStoredTheme() === THEME_SYSTEM) {
        applyTheme(THEME_SYSTEM);
      }
    });
  }
}

/**
 * Gets the currently focused menu item index
 * @returns {number} Index of focused item, or -1 if none
 */
function getFocusedMenuItemIndex() {
  return Array.from(elements.themeMenuItems).findIndex(item => 
    item === document.activeElement
  );
}

/**
 * Focuses a menu item by index
 * @param {number} index - Index of menu item to focus
 */
function focusMenuItem(index) {
  if (index >= 0 && index < elements.themeMenuItems.length) {
    elements.themeMenuItems[index].focus();
  }
}

/**
 * Handles keyboard navigation in theme menu
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleThemeMenuKeyDown(e) {
  if (elements.themeMenu.hidden) {
    return;
  }
  
  const currentIndex = getFocusedMenuItemIndex();
  let newIndex = currentIndex;
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      newIndex = currentIndex < elements.themeMenuItems.length - 1 
        ? currentIndex + 1 
        : 0;
      focusMenuItem(newIndex);
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      newIndex = currentIndex > 0 
        ? currentIndex - 1 
        : elements.themeMenuItems.length - 1;
      focusMenuItem(newIndex);
      break;
      
    case 'Home':
      e.preventDefault();
      focusMenuItem(0);
      break;
      
    case 'End':
      e.preventDefault();
      focusMenuItem(elements.themeMenuItems.length - 1);
      break;
      
    case 'Enter':
    case ' ':
      e.preventDefault();
      if (currentIndex >= 0) {
        elements.themeMenuItems[currentIndex].click();
      }
      break;
      
    case 'Escape':
      e.preventDefault();
      closeThemeMenu();
      break;
      
    case 'Tab':
      // Allow Tab to close menu and continue normal tab order
      closeThemeMenu();
      break;
  }
}

/**
 * Handles focus trap for theme menu
 * @param {FocusEvent} e - Focus event
 */
function handleThemeMenuFocusTrap(e) {
  if (elements.themeMenu.hidden) {
    return;
  }
  
  // focusin fires when focus enters an element
  // If focus is entering the menu, that's fine - do nothing
  // If focus is entering something outside the menu, check if it's a form field
  if (!elements.themeMenu.contains(e.target) && 
      e.target !== elements.themeToggleBtn) {
    // Check if the target is a form field
    const isFormField = e.target.tagName === 'INPUT' ||
                        e.target.tagName === 'TEXTAREA' ||
                        e.target.tagName === 'SELECT' ||
                        e.target.closest('form');
    
    if (isFormField) {
      // Allow focus to move to form fields - close menu without stealing focus
      closeThemeMenu(true);
      return;
    }
    
    // For other elements, trap focus back to menu (keyboard navigation)
    if (!elements.themeMenu.contains(document.activeElement)) {
      focusMenuItem(0);
    }
  }
}

/**
 * Toggles the theme menu visibility
 */
function toggleThemeMenu() {
  if (!elements.themeMenu || !elements.themeToggleBtn) return;
  const isHidden = elements.themeMenu.hidden;
  elements.themeMenu.hidden = !isHidden;
  elements.themeToggleBtn.setAttribute('aria-expanded', String(!isHidden));
  
  // Focus first menu item when opening
  if (!isHidden) {
    setTimeout(() => {
      focusMenuItem(0);
    }, 0);
  }
}

/**
 * Closes the theme menu and returns focus to toggle button
 * @param {boolean} skipFocus - If true, don't focus the toggle button (e.g., when focus is moving to a form field)
 */
function closeThemeMenu(skipFocus = false) {
  if (!elements.themeMenu || !elements.themeToggleBtn) return;
  elements.themeMenu.hidden = true;
  elements.themeToggleBtn.setAttribute('aria-expanded', 'false');
  if (!skipFocus) {
    elements.themeToggleBtn.focus();
  }
}

/**
 * Handles clicks outside the theme menu to close it
 */
function handleThemeMenuClickOutside(event) {
  if (!elements.themeMenu || !elements.themeToggleBtn) return;
  // Only process if menu is actually open
  if (elements.themeMenu.hidden) {
    return;
  }
  
  // Don't close if clicking on toggle button or menu itself
  if (elements.themeToggleBtn.contains(event.target) || 
      elements.themeMenu.contains(event.target)) {
    return;
  }
  
  // Check if clicking on a form field - if so, close menu without stealing focus
  const isFormField = event.target.tagName === 'INPUT' ||
                      event.target.tagName === 'TEXTAREA' ||
                      event.target.tagName === 'SELECT' ||
                      event.target.closest('form');
  
  closeThemeMenu(isFormField);
}

// ============================================
// Priority Dropdown Management
// ============================================

/**
 * Generates SVG markup for a priority flag icon
 * @param {string} priority - Priority value ('1', '2', '3', or '4')
 * @returns {string} SVG markup string
 */
function getPriorityFlagSvg(priority) {
  const flagPath = 'M4.223 4.584A.5.5 0 0 0 4 5v14.5a.5.5 0 0 0 1 0v-5.723C5.886 13.262 7.05 13 8.5 13c.97 0 1.704.178 3.342.724 1.737.58 2.545.776 3.658.776 1.759 0 3.187-.357 4.277-1.084A.5.5 0 0 0 20 13V4.5a.5.5 0 0 0-.777-.416C18.313 4.69 17.075 5 15.5 5c-.97 0-1.704-.178-3.342-.724C10.421 3.696 9.613 3.5 8.5 3.5c-1.758 0-3.187.357-4.277 1.084';
  
  const p4Path = 'M 4 5 a 0.5 0.5 0 0 1 0.223 -0.416 C 5.313 3.857 6.742 3.5 8.5 3.5 c 1.113 0 1.92 0.196 3.658 0.776 C 13.796 4.822 14.53 5 15.5 5 c 1.575 0 2.813 -0.31 3.723 -0.916 A 0.5 0.5 0 0 1 20 4.5 V 13 a 0.5 0.5 0 0 1 -0.223 0.416 c -1.09 0.727 -2.518 1.084 -4.277 1.084 c -1.113 0 -1.92 -0.197 -3.658 -0.776 C 10.204 13.178 9.47 13 8.5 13 c -1.45 0 -2.614 0.262 -3.5 0.777 V 19.5 a 0.5 0.5 0 0 1 -1 0 V 5 m 4.5 7 q -2.051 -0.002 -3.5 0.654 V 5.277 c 0.886 -0.515 2.05 -0.777 3.5 -0.777 c 0.97 0 1.704 0.178 3.342 0.724 c 1.737 0.58 2.545 0.776 3.658 0.776 q 2.052 0.002 3.5 -0.654 v 7.377 c -0.886 0.515 -2.05 0.777 -3.5 0.777 c -0.97 0 -1.704 -0.178 -3.342 -0.724 C 10.421 12.196 9.613 12 8.5 12';
  
  if (priority === '4') {
    return `<svg class="priority-flag" width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="none"
        fill-rule="evenodd"
        d="${p4Path}"
        clip-rule="evenodd"
        stroke="#666"
        stroke-width="1"
      />
    </svg>`;
  }
  
  const colors = {
    '1': '#d1453b',
    '2': '#eb8909',
    '3': '#246fe0'
  };
  
  return `<svg class="priority-flag" width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      fill="${colors[priority]}"
      fill-rule="evenodd"
      d="${flagPath}"
      clip-rule="evenodd"
    />
  </svg>`;
}

/**
 * Gets the formatted label for a priority value
 * @param {string} priority - Priority value ('1', '2', '3', or '4')
 * @returns {string} Formatted priority label with suffix if applicable
 */
function getPriorityLabel(priority) {
  const labels = {
    '1': 'Priority 1 (Highest)',
    '2': 'Priority 2',
    '3': 'Priority 3',
    '4': 'Priority 4 (Default)'
  };
  return labels[priority] || `Priority ${priority}`;
}

/**
 * Updates the displayed priority in the dropdown trigger
 * @param {string} priority - Priority value ('1', '2', '3', or '4')
 */
function updatePriorityDisplay(priority) {
  const trigger = elements.priorityTrigger;
  if (!trigger) return;
  
  const content = trigger.querySelector('.priority-dropdown__content');
  if (!content) return;
  
  const flagSvg = content.querySelector('.priority-flag');
  const textSpan = content.querySelector('.priority-text');
  
  // Update flag icon by replacing the entire SVG
  if (flagSvg) {
    // Create a temporary container to parse the new SVG
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = getPriorityFlagSvg(priority);
    const newSvg = tempDiv.firstElementChild;
    
    // Replace the old SVG with the new one
    flagSvg.parentNode.replaceChild(newSvg, flagSvg);
  }
  
  // Update text with formatted label (includes suffix for P1 and P4)
  if (textSpan) {
    textSpan.textContent = getPriorityLabel(priority);
  }
  
  // Update state
  state.priority = priority;
  
  // Rebuild menu to show all priorities with checkmark on selected
  rebuildPriorityMenu();
}

/**
 * Gets the checkmark SVG icon for selected menu items
 * @returns {string} SVG markup string for checkmark
 */
function getCheckmarkSvg() {
  return `<svg class="priority-checkmark" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

/**
 * Rebuilds the priority dropdown menu, showing all priorities with a checkmark on the selected one
 */
function rebuildPriorityMenu() {
  const menu = elements.priorityMenu;
  if (!menu) return;
  
  const currentPriority = state.priority;
  
  // Clear existing options
  menu.innerHTML = '';
  
  // Create options for all priorities
  const priorities = ['1', '2', '3', '4'];
  priorities.forEach(priority => {
    const option = document.createElement('button');
    option.className = 'priority-dropdown__option';
    if (priority === currentPriority) {
      option.classList.add('priority-dropdown__option--selected');
    }
    option.setAttribute('role', 'menuitem');
    option.setAttribute('data-priority', priority);
    option.type = 'button';
    
    // Build option content: flag + label + checkmark (if selected)
    let optionContent = `${getPriorityFlagSvg(priority)}<span>${getPriorityLabel(priority)}</span>`;
    if (priority === currentPriority) {
      optionContent += getCheckmarkSvg();
    }
    option.innerHTML = optionContent;
    
    menu.appendChild(option);
  });
  
  // Update options reference
  elements.priorityOptions = menu.querySelectorAll('.priority-dropdown__option');
  
  // Re-attach event listeners
  elements.priorityOptions.forEach(option => {
    option.addEventListener('click', handlePrioritySelection);
  });
}

/**
 * Toggles the priority dropdown open/closed state
 */
function togglePriorityDropdown() {
  const isHidden = elements.priorityMenu.hidden;
  elements.priorityMenu.hidden = !isHidden;
  elements.priorityTrigger.setAttribute('aria-expanded', String(!isHidden));
  
  // Focus first option when opening
  if (!isHidden && elements.priorityOptions && elements.priorityOptions.length > 0) {
    setTimeout(() => {
      elements.priorityOptions[0].focus();
    }, 0);
  }
}

/**
 * Closes the priority dropdown
 */
function closePriorityDropdown() {
  elements.priorityMenu.hidden = true;
  elements.priorityTrigger.setAttribute('aria-expanded', 'false');
}

/**
 * Handles priority selection from dropdown menu
 * @param {Event} e - Click event
 */
function handlePrioritySelection(e) {
  const priority = e.currentTarget.getAttribute('data-priority');
  updatePriorityDisplay(priority);
  closePriorityDropdown();
  elements.priorityTrigger.focus();
  saveFormData();
}

/**
 * Handles keyboard navigation in priority dropdown
 * @param {KeyboardEvent} e - Keyboard event
 */
function handlePriorityMenuKeyDown(e) {
  if (elements.priorityMenu.hidden) {
    return;
  }
  
  const options = Array.from(elements.priorityOptions);
  const currentIndex = options.findIndex(opt => opt === document.activeElement);
  let newIndex = currentIndex;
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
      options[newIndex].focus();
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
      options[newIndex].focus();
      break;
      
    case 'Home':
      e.preventDefault();
      if (options.length > 0) {
        options[0].focus();
      }
      break;
      
    case 'End':
      e.preventDefault();
      if (options.length > 0) {
        options[options.length - 1].focus();
      }
      break;
      
    case 'Enter':
    case ' ':
      e.preventDefault();
      if (currentIndex >= 0) {
        options[currentIndex].click();
      }
      break;
      
    case 'Escape':
      e.preventDefault();
      closePriorityDropdown();
      elements.priorityTrigger.focus();
      break;
      
    case 'Tab':
      closePriorityDropdown();
      break;
  }
}

/**
 * Handles clicks outside the priority dropdown to close it
 * @param {Event} event - Click event
 */
function handlePriorityDropdownClickOutside(event) {
  if (elements.priorityMenu.hidden) {
    return;
  }
  
  // Don't close if clicking on trigger or menu
  if (elements.priorityTrigger.contains(event.target) || 
      elements.priorityMenu.contains(event.target)) {
    return;
  }
  
  closePriorityDropdown();
}

/**
 * Initializes the priority dropdown
 */
function initializePriorityDropdown() {
  // Set initial priority display
  updatePriorityDisplay(state.priority);
  
  // Initialize options reference
  elements.priorityOptions = elements.priorityMenu.querySelectorAll('.priority-dropdown__option');
  
  // Attach event listeners to options
  elements.priorityOptions.forEach(option => {
    option.addEventListener('click', handlePrioritySelection);
  });
}

// ============================================
// Event Listeners
// ============================================

// Form submission (only if form exists)
if (elements.form) {
  elements.form.addEventListener('submit', handleFormSubmit);
}

// Real-time validation on task name input (only if input exists)
if (elements.taskNameInput) {
  elements.taskNameInput.addEventListener('input', handleTaskNameChange);
  elements.taskNameInput.addEventListener('blur', handleTaskNameChange);
}

// Save form data on due date input changes (only if input exists)
if (elements.dueDateInput) {
  elements.dueDateInput.addEventListener('input', () => {
    state.dueDate = elements.dueDateInput.value;
    saveFormData();
  });
}

// Save form data on project input changes (only if input exists)
if (elements.projectInput) {
  elements.projectInput.addEventListener('input', () => {
    state.project = elements.projectInput.value;
    saveFormData();
  });
}

// Copy URL button (only if button exists)
if (elements.copyUrlBtn) {
  elements.copyUrlBtn.addEventListener('click', copyUrlToClipboard);
}

// Download QR code button (only if button exists)
if (elements.downloadQrBtn) {
  elements.downloadQrBtn.addEventListener('click', downloadQRCode);
}

// Coffee button - opens Todoist Quick Add with coffee task (only if button exists)
if (elements.coffeeBtn) {
  elements.coffeeBtn.addEventListener('click', () => {
    const coffeeUrl = buildCoffeeTaskUrl();
    window.open(coffeeUrl, '_blank');
  });
}

// Theme toggle button (only if button exists)
if (elements.themeToggleBtn) {
  elements.themeToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleThemeMenu();
  });

  // Keyboard support for theme toggle button
  elements.themeToggleBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleThemeMenu();
    } else if (e.key === 'ArrowDown' && elements.themeMenu.hidden) {
      e.preventDefault();
      toggleThemeMenu();
    }
  });
}

// Keyboard navigation for theme menu (only if menu exists)
if (elements.themeMenu) {
  elements.themeMenu.addEventListener('keydown', handleThemeMenuKeyDown);

  // Focus trap for theme menu
  elements.themeMenu.addEventListener('focusin', handleThemeMenuFocusTrap);
  elements.themeMenu.addEventListener('focusout', (e) => {
    // Only trap focus if menu is open and focus is not moving to a form field
    const relatedTarget = e.relatedTarget;
    const isFormField = relatedTarget && (
      relatedTarget.tagName === 'INPUT' ||
      relatedTarget.tagName === 'TEXTAREA' ||
      relatedTarget.tagName === 'SELECT' ||
      relatedTarget.closest('form')
    );
    
    // If focus is moving to a form field, close menu and allow focus
    if (isFormField) {
      closeThemeMenu(true);
      return;
    }
    
    // Allow focus to move to toggle button, otherwise trap (only for keyboard nav)
    setTimeout(() => {
      if (!elements.themeMenu.hidden && 
          !elements.themeMenu.contains(document.activeElement) &&
          document.activeElement !== elements.themeToggleBtn &&
          !isFormField) {
        focusMenuItem(0);
      }
    }, 0);
  });
}

// Theme menu items (only if items exist)
if (elements.themeMenuItems && elements.themeMenuItems.length > 0) {
  elements.themeMenuItems.forEach(item => {
    item.addEventListener('click', () => {
      const theme = item.getAttribute('data-theme-value');
      setTheme(theme);
    });
  });
}

// Close theme menu when clicking outside
document.addEventListener('click', handleThemeMenuClickOutside);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (getStoredTheme() === THEME_SYSTEM) {
    applyTheme(THEME_SYSTEM);
  }
});

// Priority dropdown trigger
if (elements.priorityTrigger) {
  elements.priorityTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePriorityDropdown();
  });
  
  // Keyboard support for priority trigger
  elements.priorityTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePriorityDropdown();
    } else if (e.key === 'ArrowDown' && elements.priorityMenu.hidden) {
      e.preventDefault();
      togglePriorityDropdown();
    }
  });
}

// Keyboard navigation for priority menu
if (elements.priorityMenu) {
  elements.priorityMenu.addEventListener('keydown', handlePriorityMenuKeyDown);
}

// Close priority dropdown when clicking outside
document.addEventListener('click', handlePriorityDropdownClickOutside);

// Initialize generate button state (only if button exists)
if (elements.generateBtn) {
  updateGenerateButtonState();
}

// ============================================
// Initialization
// ============================================

// Ensure output section is hidden initially (only if section exists)
if (elements.outputSection) {
  elements.outputSection.hidden = true;
}

// Initialize theme system
initializeTheme();

// Initialize priority dropdown (only if dropdown exists)
if (elements.priorityDropdown) {
  initializePriorityDropdown();
}

// Restore form data on page load (only if form exists)
if (elements.form) {
  restoreFormData();
}

