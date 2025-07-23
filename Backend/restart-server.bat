@echo off
echo Stopping any existing server processes...
taskkill /F /IM node.exe 2>NUL
timeout /t 2
echo Starting server...
cd /d "c:\Users\DELL\Desktop\Yasin Heaven Star Hotel\Backend"
node server.js
