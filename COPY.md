# Copy Documentation

This document contains all user-visible copy in the Todoist TapLinks application. Each entry includes context about where and when users see it.

**Last Updated:** 2025

---

## Meta & SEO

### COPY-001: Page Title
- **Location:** `index.html` - `<title>` tag
- **Context:** Appears in browser tab and bookmarks
- **Current Copy:** `Todoist TapLinks`
- **Type:** Static HTML

### COPY-002: Meta Description
- **Location:** `index.html` - `<meta name="description">`
- **Context:** Used by search engines and social media previews
- **Current Copy:** `Create Todoist task links for QR codes and NFC tags.`
- **Type:** Static HTML

---

## Header Section

### COPY-003: Main Heading
- **Location:** `index.html` - `.header__title`
- **Context:** Visible at the top of the page on all views
- **Current Copy:** `Todoist TapLinks`
- **Type:** Static HTML

### COPY-004: Header Subtitle
- **Location:** `index.html` - `.header__subtitle`
- **Context:** Visible below the main heading, describes the app's purpose
- **Current Copy:** `Create Todoist task links for QR codes and NFC tags.`
- **Type:** Static HTML

---

## Theme Toggle

### COPY-005: Theme Toggle Button (Aria Label)
- **Location:** `index.html` - `#theme-toggle-btn` aria-label
- **Context:** Screen reader announcement when focusing the theme toggle button
- **Current Copy:** `Theme options`
- **Type:** Static HTML (aria-label)

### COPY-006: Theme Menu (Aria Label)
- **Location:** `index.html` - `#theme-menu` aria-label
- **Context:** Screen reader announcement for the theme selection menu
- **Current Copy:** `Theme selection`
- **Type:** Static HTML (aria-label)

### COPY-007: Theme Menu - System Option
- **Location:** `index.html` - Theme menu item with `data-theme-value="system"`
- **Context:** Visible in theme dropdown menu
- **Current Copy:** `System`
- **Type:** Static HTML

### COPY-008: Theme Menu - Light Option
- **Location:** `index.html` - Theme menu item with `data-theme-value="light"`
- **Context:** Visible in theme dropdown menu
- **Current Copy:** `Light`
- **Type:** Static HTML

### COPY-009: Theme Menu - Dark Option
- **Location:** `index.html` - Theme menu item with `data-theme-value="dark"`
- **Context:** Visible in theme dropdown menu
- **Current Copy:** `Dark`
- **Type:** Static HTML

---

## Form Section

### COPY-010: Task Name Label
- **Location:** `index.html` - `.form-label` for `#task-name`
- **Context:** Visible above the task name input field
- **Current Copy:** `Task name`
- **Type:** Static HTML

### COPY-011: Task Name Required Indicator
- **Location:** `index.html` - `.form-label__required` within task name label
- **Context:** Visible next to "Task name" label
- **Current Copy:** `• Required`
- **Type:** Static HTML

### COPY-012: Task Name Helper Text
- **Location:** `index.html` - `#task-name-helper`
- **Context:** Visible below the task name input field
- **Current Copy:** `Type the task as you'd naturally say it.`
- **Type:** Static HTML

### COPY-013: Task Name Error Message
- **Location:** `app.js` - `showTaskNameError()` function
- **Context:** Appears when user tries to submit form without a task name
- **Current Copy:** `Please give your task a name.`
- **Type:** Dynamic JavaScript

### COPY-014: Due Date Label
- **Location:** `index.html` - `.form-label` for `#due-date`
- **Context:** Visible above the due date input field
- **Current Copy:** `Due date`
- **Type:** Static HTML

### COPY-015: Due Date Optional Indicator
- **Status:** Deprecated - Removed as optional fields are now implied (only task name is marked as required)
- **Previous Location:** `index.html` - `.form-label__optional` within due date label
- **Previous Copy:** `(optional)`

### COPY-016: Due Date Helper Text
- **Location:** `index.html` - `#due-date-helper`
- **Context:** Visible below the due date input field
- **Current Copy:** `Use natural language like "today", "in 90 mins", or "every Monday". <a href="https://www.todoist.com/help/articles/introduction-to-dates-and-time-q7VobO#h_01HD1A9MAEMR98FZT5FG6ZZB73" target="_blank" rel="noopener noreferrer">Learn more</a>.`
- **Type:** Static HTML (contains HTML link)

### COPY-017: Priority Label
- **Location:** `index.html` - `.form-label` for `#priority-dropdown`
- **Context:** Visible above the priority dropdown
- **Current Copy:** `Priority`
- **Type:** Static HTML
- **Note:** Priority is always set (defaults to Priority 4). The "(optional)" indicator has been removed. Priority labels include descriptive suffixes: "Priority 1 (Highest)" and "Priority 4 (Default)".

### COPY-018: Priority Optional Indicator
- **Status:** Deprecated - Removed as priority is now always required (defaults to Priority 4)
- **Previous Location:** `index.html` - `.form-label__optional` within priority label
- **Previous Copy:** `(optional)`

### COPY-019: Priority None Option
- **Status:** Deprecated - Removed. Priority 4 is now the default and minimum priority.
- **Previous Location:** `index.html` - `#priority` select option with empty value
- **Previous Copy:** `None`

### COPY-020: Priority Helper Text
- **Status:** Deprecated - Removed as priority flags now provide sufficient visual indication
- **Previous Location:** `index.html` - `#priority-helper`
- **Previous Copy:** `Higher numbers mean more urgent in Todoist.`

### COPY-021: Project Label
- **Location:** `index.html` - `.form-label` for `#project`
- **Context:** Visible above the project input field
- **Current Copy:** `Project`
- **Type:** Static HTML
- **Note:** The Project input displays a fixed, non-editable "#" prefix to guide users. Users type only the project name (not the "#").

### COPY-022: Project Optional Indicator
- **Status:** Deprecated - Removed as optional fields are now implied (only task name is marked as required)
- **Previous Location:** `index.html` - `.form-label__optional` within project label
- **Previous Copy:** `(optional)`

### COPY-023: Project Helper Text
- **Location:** `index.html` - `#project-helper`
- **Context:** Visible below the project input field
- **Current Copy:** `Leave blank to send the task to your Inbox, or use your project's exact name (spelling and capitalisation matter).`
- **Type:** Static HTML

### COPY-024: Generate Button
- **Location:** `index.html` - `#generate-btn`
- **Context:** Visible at the bottom of the form, disabled until task name is entered
- **Current Copy:** `Generate`
- **Type:** Static HTML

---

## Output Section

### COPY-025: Generated URL Label
- **Location:** `index.html` - `.form-label` for `#generated-url`
- **Context:** Visible above the generated URL input field (after form submission)
- **Current Copy:** `Generated Todoist link`
- **Type:** Static HTML

### COPY-026: Generated URL Helper Text
- **Location:** `index.html` - `#url-helper`
- **Context:** Visible below the generated URL input field
- **Current Copy:** `This link opens Todoist Quick Add with your task. Use it on mobile to keep your project. On desktop, Todoist sends the task to Inbox.`
- **Type:** Static HTML

### COPY-027: Copy URL Button (Default State)
- **Location:** `index.html` - `#copy-url-btn` and `app.js` - button text content
- **Context:** Visible in output section after URL is generated
- **Current Copy:** `Copy URL`
- **Type:** Static HTML (initial state), Dynamic JavaScript (after reset)

### COPY-028: Copy URL Button (Aria Label - Default)
- **Location:** `index.html` - `#copy-url-btn` aria-label and `app.js` - aria-label attribute
- **Context:** Screen reader announcement for copy button
- **Current Copy:** `Copy URL`
- **Type:** Static HTML (initial), Dynamic JavaScript (after reset)

### COPY-029: Copy URL Button (Copied State)
- **Location:** `app.js` - `showCopySuccess()` function
- **Context:** Visible after user clicks "Copy URL" button, shows for 6 seconds
- **Current Copy:** `Copied`
- **Type:** Dynamic JavaScript

### COPY-030: Copy URL Button (Aria Label - Copied State)
- **Location:** `app.js` - `showCopySuccess()` function
- **Context:** Screen reader announcement when URL is copied
- **Current Copy:** `URL copied to clipboard`
- **Type:** Dynamic JavaScript

### COPY-031: Output Section Success (Aria Label)
- **Location:** `app.js` - `handleFormSubmit()` function
- **Context:** Screen reader announcement when link is successfully generated (announced via aria-live region, not focus)
- **Current Copy:** `Todoist link generated successfully`
- **Type:** Dynamic JavaScript

### COPY-032: QR Code Label
- **Location:** `index.html` - `.form-label` within `#qr-container`
- **Context:** Visible above QR code image (after generation)
- **Current Copy:** `QR code for this link`
- **Type:** Static HTML

### COPY-033: QR Code Loading Text
- **Location:** `index.html` - `.qr-loading__text`
- **Context:** Visible while QR code is being generated
- **Current Copy:** `Generating QR code...`
- **Type:** Static HTML

### COPY-034: QR Code Helper Text
- **Location:** `index.html` - `#qr-helper`
- **Context:** Visible below QR code image
- **Current Copy:** `Scan this QR code to open Todoist Quick Add with your task. Scanning on mobile keeps your project. On desktop, Todoist sends the task to Inbox.`
- **Type:** Static HTML

### COPY-035: Download QR Button
- **Location:** `index.html` - `#download-qr-btn`
- **Context:** Visible below QR code helper text
- **Current Copy:** `Download QR`
- **Type:** Static HTML

### COPY-036: Download QR Button (Aria Label)
- **Location:** `index.html` - `#download-qr-btn` aria-label
- **Context:** Screen reader announcement for download button
- **Current Copy:** `Download QR code`
- **Type:** Static HTML (aria-label)

### COPY-037: QR Code Error Message
- **Location:** `app.js` - `showQRError()` function
- **Context:** Appears when QR code generation fails
- **Current Copy:** `Couldn't generate the QR code. Give it another try.`
- **Type:** Dynamic JavaScript

### COPY-038: QR Code Image Alt Text
- **Location:** `index.html` - `#qr-image` alt attribute
- **Context:** Screen reader announcement for QR code image
- **Current Copy:** `QR code for Todoist task link`
- **Type:** Static HTML (alt attribute)

---

## Snackbar

### COPY-039: Snackbar Success Message
- **Location:** `index.html` - `.snackbar__message`
- **Context:** Appears at bottom of screen when URL is copied, shows for 6 seconds
- **Current Copy:** `Link copied!`
- **Type:** Static HTML

---

## Info Section

### COPY-040: Info Section Title
- **Location:** `index.html` - `.info-card__title`
- **Context:** Visible at top of info card section
- **Current Copy:** `How it works`
- **Type:** Static HTML

### COPY-041: Info List Item 1
- **Location:** `index.html` - `.info-list li` (first item)
- **Context:** Visible in "How it works" list
- **Current Copy:** `Just give your task a name—that's all you need to get started.`
- **Type:** Static HTML

### COPY-042: Info List Item 2
- **Location:** `index.html` - `.info-list li` (second item)
- **Context:** Visible in "How it works" list
- **Current Copy:** `If you don't specify a project, tasks go to your Inbox.`
- **Type:** Static HTML

### COPY-043: Info List Item 3
- **Location:** `index.html` - `.info-list li` (third item)
- **Context:** Visible in "How it works" list
- **Current Copy:** `These links work best on mobile devices or when scanned from QR codes.`
- **Type:** Static HTML

### COPY-044: Info List Item 4
- **Location:** `index.html` - `.info-list li` (fourth item)
- **Context:** Visible in "How it works" list
- **Current Copy:** `You can write the URL to an NFC tag using apps like NFC Tools.`
- **Type:** Static HTML

### COPY-045: Info List Item 5
- **Location:** `index.html` - `.info-list li` (fifth item)
- **Context:** Visible in "How it works" list
- **Current Copy:** `Make sure your project name matches exactly, or Todoist will use your Inbox instead.`
- **Type:** Static HTML

### COPY-046: Info Note
- **Location:** `index.html` - `.info-note`
- **Context:** Visible at bottom of info card, below the list
- **Current Copy:** `**Note:** This is an unofficial tool and isn't affiliated with Todoist.`
- **Type:** Static HTML (contains HTML formatting)

---

## Accessibility

### COPY-047: Skip Link
- **Location:** `index.html` - `.skip-link`
- **Context:** Visible when focused via keyboard navigation (for screen readers)
- **Current Copy:** `Skip to main content`
- **Type:** Static HTML

---

## Coffee Button Section

### COPY-048: Coffee Button Label
- **Location:** `index.html` - `#coffee-btn`
- **Context:** Visible in output section after URL/QR code is generated, below the QR code container
- **Current Copy:** `Add a task to tip this tool's creator`
- **Type:** Static HTML

### COPY-049: Coffee Button (Aria Label)
- **Location:** `index.html` - `#coffee-btn` aria-label
- **Context:** Screen reader announcement for coffee button
- **Current Copy:** `Add a task to tip this tool's creator`
- **Type:** Static HTML (aria-label)

### COPY-050: Coffee Button Helper Text
- **Location:** `index.html` - `.form-helper` within `#coffee-button-container`
- **Context:** Visible below the coffee button
- **Current Copy:** `Opens Todoist Quick Add with a task to tip the creator of this tool. 😊`
- **Type:** Static HTML

---

## Notes

- All copy should maintain a friendly, conversational tone
- Follow Nielsen Norman Group principles: clear, concise, helpful without cognitive load
- Dynamic copy (JavaScript) should match the tone of static copy
- HTML formatting (like `<strong>`) is preserved in the copy where applicable

