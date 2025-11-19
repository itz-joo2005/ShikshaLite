@echo off
echo Starting ShikshaLite Local Server...
echo.
echo This will start a local server for Chrome compatibility
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
node server.js
pause