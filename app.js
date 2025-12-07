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
  prioritySelect: document.getElementById('priority'),
  projectInput: document.getElementById('project'),
  generateBtn: document.getElementById('generate-btn'),
  outputSection: document.getElementById('output-section'),
  generatedUrlInput: document.getElementById('generated-url'),
  copyUrlBtn: document.getElementById('copy-url-btn'),
  downloadQrBtn: document.getElementById('download-qr-btn'),
  qrContainer: document.getElementById('qr-container'),
  qrImage: document.getElementById('qr-image'),
  qrError: document.getElementById('qr-error'),
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
    showTaskNameError('Please enter a task name to generate the link.');
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
  
  // Generate QR code automatically
  generateQRCode();
  
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
  }, 2000);
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
  
  // Hide QR container while generating
  elements.qrContainer.hidden = true;
  
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
        // Show QR container
        state.qrGenerated = true;
        state.qrImageUrl = qrApiUrl;
        elements.qrContainer.hidden = false;
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
    showQRError('We couldn\'t generate the QR code. Please try again.');
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
 * Downloads QR code as PNG
 */
async function downloadQRCode() {
  if (!state.qrGenerated || !elements.qrImage || !elements.qrImage.src) {
    return;
  }
  
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
    link.download = 'todoist-task-qr.png';
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
    link.download = 'todoist-task-qr.png';
    link.href = elements.qrImage.src;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
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

// Download QR code button
elements.downloadQrBtn.addEventListener('click', downloadQRCode);

// Initialize generate button state
updateGenerateButtonState();

// ============================================
// Initialization
// ============================================

// Ensure output section is hidden initially
elements.outputSection.hidden = true;

