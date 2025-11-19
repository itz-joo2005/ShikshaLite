# ShikshaLite Setup Guide

## Quick Start for Chrome

### Option 1: Using Local Server (Recommended)
1. Install Node.js if not already installed
2. Open Command Prompt in the Hack folder
3. Run: `npm install`
4. Double-click `start-server.bat` OR run: `npm start`
5. Open Chrome and go to: `http://localhost:3000`
6. Allow microphone access when prompted

### Option 2: Direct File Access
1. Open Chrome
2. Go to Settings > Privacy and Security > Site Settings
3. Click "Microphone" and ensure it's allowed
4. Right-click on `index.html` or `super_game.html`
5. Choose "Open with" > Chrome
6. Allow microphone access when prompted

## Chrome Microphone Setup
1. Click the microphone icon in Chrome's address bar
2. Select "Always allow microphone access"
3. Refresh the page if needed

## Files Overview
- `index.html` - Simple quiz game
- `super_game.html` - Advanced multi-game platform
- `server.js` - Local development server
- `start-server.bat` - Easy server startup

## Troubleshooting
- **No voice recognition**: Use Chrome browser and allow microphone access
- **HTTPS required**: Use the local server (localhost) or deploy to HTTPS
- **Microphone blocked**: Check Chrome's site settings and permissions

## Browser Requirements
- Google Chrome (recommended)
- Microphone access enabled
- JavaScript enabled
- Local server OR HTTPS for full functionality