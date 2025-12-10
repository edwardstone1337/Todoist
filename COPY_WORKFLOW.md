# Copy Workflow

This document outlines the process for updating user-visible copy in the Todoist TapLinks application.

## Overview

All user-visible copy is documented in `COPY.md`. When copy needs to be updated, the workflow ensures changes flow from the documentation to the codebase.

## Workflow Process

### Step 1: Update Copy Documentation

1. Open `COPY.md`
2. Locate the copy item you want to update using its ID (e.g., `COPY-001`, `COPY-013`)
3. Update the **Current Copy** field with the new text
4. If the context or location changes, update those fields as well
5. Save `COPY.md`

### Step 2: Update Code Files

After updating `COPY.md`, update the corresponding code:

#### For Static HTML Copy (Most Items)

1. Open the appropriate HTML file (`index.html` or `how-it-works.html`)
2. Find the element using the **Location** information from `COPY.md`
3. Update the text content directly in the HTML
4. If the copy contains HTML formatting (like `<strong>`), preserve it

#### For Dynamic JavaScript Copy

1. Open `app.js`
2. Find the function or code section mentioned in the **Location** field
3. Update the string value in the code
4. Ensure the updated copy maintains the same tone and style

#### For Aria Labels and Alt Text

1. Update the `aria-label` or `alt` attribute in the HTML element
2. If the aria-label is set dynamically in JavaScript, update it in `app.js`

### Step 3: Verification Checklist

Before considering the update complete:

- [ ] Copy in `COPY.md` matches the updated code
- [ ] HTML formatting (if any) is preserved correctly
- [ ] Dynamic copy updates correctly in all states (e.g., button states)
- [ ] No typos or formatting issues
- [ ] Copy maintains consistent tone with the rest of the application
- [ ] Accessibility labels (aria-labels, alt text) are updated if needed

### Step 4: Testing

Test the updated copy:

- [ ] View the page to verify static copy appears correctly
- [ ] Test interactive elements to verify dynamic copy (button states, error messages)
- [ ] Test with screen reader to verify aria-labels and alt text
- [ ] Check responsive design to ensure copy displays well on mobile

## Copy Update Examples

### Example 1: Updating Static Helper Text

**Scenario:** Update the task name helper text

1. In `COPY.md`, find `COPY-012: Task Name Helper Text`
2. Update the **Current Copy** field
3. In `index.html`, find the element with `id="task-name-helper"`
4. Update the text content inside the `<p>` tag
5. Verify the change appears correctly on the page

### Example 1b: Updating Use Case Button Helper Text

**Scenario:** Update the use case button helper text on how-it-works page

1. In `COPY.md`, find `COPY-052: Use Case Button Helper Text`
2. Update the **Current Copy** field
3. In `how-it-works.html`, find all instances of the helper text below use case buttons
4. Update the text content inside the `<p>` tags
5. Verify the change appears correctly on all use cases

### Example 2: Updating Dynamic Error Message

**Scenario:** Update the task name error message

1. In `COPY.md`, find `COPY-013: Task Name Error Message`
2. Update the **Current Copy** field
3. In `app.js`, find the `showTaskNameError()` function call in `handleFormSubmit()`
4. Update the string: `showTaskNameError('Your new error message here.');`
5. Test by submitting the form without a task name

### Example 3: Updating Button State Copy

**Scenario:** Update the "Copied" button text

1. In `COPY.md`, find `COPY-029: Copy URL Button (Copied State)`
2. Update the **Current Copy** field
3. In `app.js`, find the `showCopySuccess()` function
4. Update: `elements.copyUrlBtn.textContent = 'Your new text';`
5. Also update the corresponding aria-label if needed (`COPY-030`)
6. Test by copying a URL and verifying the button text changes

## Best Practices

1. **Always update `COPY.md` first** - This serves as the single source of truth
2. **Maintain consistency** - Keep the friendly, conversational tone throughout
3. **Preserve HTML formatting** - If copy includes `<strong>`, `<em>`, etc., keep it
4. **Update related copy together** - If updating a button label, also update its aria-label
5. **Test thoroughly** - Especially for dynamic copy that appears in different states
6. **Document context changes** - If when/where copy appears changes, update the Context field

## Finding Copy Locations

### By File

- **`index.html`**: Most static copy, labels, helper text, buttons, info section
- **`how-it-works.html`**: Use case buttons, helper text, section content
- **`app.js`**: Dynamic copy, error messages, button state changes, aria-label updates

### By Type

- **Static HTML**: Look for text content between HTML tags
- **Dynamic JavaScript**: Look for `textContent`, `innerHTML`, or string assignments
- **Aria Labels**: Look for `aria-label` attributes in HTML or `setAttribute('aria-label', ...)` in JS
- **Alt Text**: Look for `alt` attributes on `<img>` tags

## Troubleshooting

### Copy doesn't appear after update

- Check that you updated the correct element ID/class
- For dynamic copy, ensure the JavaScript function is being called
- Clear browser cache and refresh

### Copy appears but formatting is wrong

- Check if the copy should include HTML tags (see **Current Copy** in `COPY.md`)
- Verify HTML tags are properly closed
- Check CSS isn't overriding the display

### Copy updates but old version still shows

- For dynamic copy, check if there are multiple places where it's set
- Verify you updated both the initial state and any state changes
- Check browser cache

## Questions?

If you're unsure about:
- Where a piece of copy is located, check the **Location** field in `COPY.md`
- When copy appears, check the **Context** field in `COPY.md`
- How to update a specific type of copy, refer to the examples above

