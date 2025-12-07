/* ============================================
   Todoist TapLinks - Application Logic
   ============================================ */

// ============================================
// State Management
// ============================================

const state = {
  taskName: '',
  dueDate: '',
  priority: '',
  project: '',
  generatedUrl: '',
  qrGenerated: false
};

// ============================================
// DOM Elements
// ============================================

const elements = {
  form: document.getElementById('task-form'),
  taskNameInput: document.getElementById('task-name'),
  dueDateInput: document.getElementById('due-date'),
  prioritySelect: document.getElementById('priority'),
  projectInput: document.getElementById('project'),
  generateBtn: document.getElementById('generate-btn'),
  outputSection: document.getElementById('output-section'),
  generatedUrlInput: document.getElementById('generated-url'),
  copyUrlBtn: document.getElementById('copy-url-btn'),
  generateQrBtn: document.getElementById('generate-qr-btn'),
  downloadQrBtn: document.getElementById('download-qr-btn'),
  qrContainer: document.getElementById('qr-container'),
  qrCanvas: document.getElementById('qr-canvas'),
  copySuccess: document.getElementById('copy-success'),
  taskNameError: document.getElementById('task-name-error')
};

// ============================================
// URL Generation
// ============================================

/**
 * Builds a Todoist "Add Task" URL from form inputs
 * @param {Object} params - Form parameters
 * @param {string} params.taskName - Task name (required)
 * @param {string} params.dueDate - Due date (optional)
 * @param {string} params.priority - Priority value 1-4 (optional)
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
  
  // Add priority if provided (and not empty/default)
  if (priority && priority !== '') {
    url += '&priority=' + priority;
  }
  
  return url;
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
  const isValid = validateTaskName(state.taskName);
  elements.generateBtn.disabled = !isValid;
}

/**
 * Shows error message for task name field
 * @param {string} message - Error message to display
 */
function showTaskNameError(message) {
  elements.taskNameError.textContent = message;
  elements.taskNameInput.setAttribute('aria-invalid', 'true');
}

/**
 * Clears error message for task name field
 */
function clearTaskNameError() {
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
  state.taskName = elements.taskNameInput.value;
  updateGenerateButtonState();
  
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
  state.priority = elements.prioritySelect.value;
  state.project = elements.projectInput.value.trim();
  
  // Validate task name
  if (!validateTaskName(state.taskName)) {
    showTaskNameError('Please enter a task name to generate a link.');
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
  
  // Reset QR state
  state.qrGenerated = false;
  elements.qrContainer.hidden = true;
  
  // Scroll to output section
  elements.outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
 * Shows success message after copying
 */
function showCopySuccess() {
  elements.copySuccess.classList.add('show');
  
  // Remove class after animation completes
  setTimeout(() => {
    elements.copySuccess.classList.remove('show');
  }, 2500);
}

// ============================================
// QR Code Generation
// ============================================

/**
 * Generates QR code from the generated URL
 */
function generateQRCode() {
  if (!state.generatedUrl) {
    return;
  }
  
  // Check if QRCode library is available
  if (typeof QRCode === 'undefined') {
    console.error('QRCode library not loaded');
    alert('QR code library failed to load. Please refresh the page.');
    return;
  }
  
  // Clear previous QR code
  const ctx = elements.qrCanvas.getContext('2d');
  ctx.clearRect(0, 0, elements.qrCanvas.width, elements.qrCanvas.height);
  
  // Generate QR code using qrcode.js library
  // The library is loaded via CDN and available as QRCode
  QRCode.toCanvas(elements.qrCanvas, state.generatedUrl, {
    width: 256,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  }, (error) => {
    if (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code. Please try again.');
      return;
    }
    
    // Show QR container with animation
    state.qrGenerated = true;
    elements.qrContainer.hidden = false;
    
    // Scroll to QR code
    elements.qrContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/**
 * Downloads QR code as PNG
 */
function downloadQRCode() {
  if (!state.qrGenerated || !elements.qrCanvas) {
    return;
  }
  
  // Convert canvas to data URL
  const dataURL = elements.qrCanvas.toDataURL('image/png');
  
  // Create download link
  const link = document.createElement('a');
  link.download = 'todoist-task-qr.png';
  link.href = dataURL;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================
// Event Listeners
// ============================================

// Form submission
elements.form.addEventListener('submit', handleFormSubmit);

// Real-time validation on task name input
elements.taskNameInput.addEventListener('input', handleTaskNameChange);
elements.taskNameInput.addEventListener('blur', handleTaskNameChange);

// Copy URL button
elements.copyUrlBtn.addEventListener('click', copyUrlToClipboard);

// Generate QR code button
elements.generateQrBtn.addEventListener('click', generateQRCode);

// Download QR code button
elements.downloadQrBtn.addEventListener('click', downloadQRCode);

// Initialize generate button state
updateGenerateButtonState();

// ============================================
// Initialization
// ============================================

// Ensure output section is hidden initially
elements.outputSection.hidden = true;

