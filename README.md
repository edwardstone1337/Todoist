# Todoist TapLinks

A mobile-first, single-page web application that generates Todoist "Add Task" URLs and QR codes for use with NFC tags and QR codes.

## Overview

Todoist TapLinks lets you quickly create Todoist task launcher URLs that can be:
- Embedded in QR codes (printed and scanned)
- Written to NFC tags using apps like NFC Tools

When scanned/tapped on a phone with Todoist installed, these URLs open Todoist's Quick Add UI, pre-populated with task content, due date, priority, and project.

## Features

- **Simple Form Interface**: Only task name is required; all other fields are optional
- **One-Click Generation**: Single "Generate" button creates both the URL and QR code simultaneously
- **URL Generation**: Creates properly formatted Todoist Quick Add URLs
- **QR Code Generation**: Automatically generates QR codes from the created URLs using goQR API
- **Download QR Codes**: Export QR codes as PNG images
- **Copy to Clipboard**: One-click URL copying with visual feedback
- **Mobile-First Design**: Optimized for mobile devices with large tap targets
- **Design Token System**: Built with a comprehensive 8-point spacing system and full token architecture
- **Light/Dark Mode Support**: Token-based theme system (ready for dark mode implementation)

## Usage

1. Enter a task name (required)
2. Optionally add:
   - Due date (supports Todoist natural language like "today", "in 90 mins", "every Monday")
   - Priority (P1-P4, where P1 is most urgent)
   - Project name (exact Todoist project name)
3. Click "Generate"
4. The URL and QR code are created automatically
5. Optionally copy the URL or download the QR code

## Technical Details

### Design Token System

The application uses a comprehensive design token system:

- **Primitive Tokens**: Raw values (8px spacing base, colors, typography, etc.)
- **Alias Tokens**: Grouped primitives (spacing scales, color families)
- **Semantic Tokens**: UI-purpose mapped tokens (spacing roles, text styles, color functions)
- **Component Tokens**: Component-specific semantic tokens
- **Mode Variants**: Light and dark theme support via CSS custom properties

All spacing follows an 8-point system, ensuring consistent visual rhythm throughout the interface.

### URL Format

Generated URLs follow Todoist's Quick Add URL format:
```
https://todoist.com/add?content=Task%20Name&date=in%2090%20mins&priority=1
```

Project names are appended to the content using Quick Add syntax: `Task Name #Project Name`

### QR Code Generation

QR codes are generated using the goQR API (api.qrserver.com), providing reliable QR code generation without requiring client-side libraries. The QR codes are displayed as images and can be downloaded as PNG files.

### Browser Support

- Modern browsers with ES6+ support
- Clipboard API support (with fallback for older browsers)
- Fetch API for QR code generation via external service

## File Structure

```
/Users/edwardstone/Development/Todoist/
├── index.html          # Main HTML structure
├── styles/
│   ├── tokens.css      # Design token system (primitives, semantics, modes)
│   └── styles.css      # Component styles using tokens
├── app.js              # Core application logic
└── README.md           # Project documentation
```

## Dependencies

- **goQR API**: QR code generation service
  - API: `https://api.qrserver.com/v1/create-qr-code/`
  - Used for reliable QR code generation without client-side libraries

No build tools or package managers required. The application is a static front-end app with no runtime dependencies.

## Notes

- This is an unofficial tool for Todoist; no official affiliation
- URLs work best on mobile devices
- Project names must match exactly in Todoist; otherwise tasks go to Inbox
- Desktop browsers may ignore project assignment via URL (mobile recommended)

## License

This project is provided as-is for personal use.

