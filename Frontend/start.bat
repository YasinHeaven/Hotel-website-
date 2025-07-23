@echo off
echo Starting Yasin Heaven Star Hotel Frontend...
echo.

if not exist .env (
    echo Error: .env file not found!
    echo Please run setup.bat first or create .env file
    pause
    exit /b 1
)

echo Frontend will be available at: http://localhost:3000
echo.

echo Choose startup mode:
echo 1. Development server
echo 2. Build for production
echo.

set /p choice="Enter your choice (1-2): "

if "%choice%"=="1" (
    echo Starting development server...
    npm start
) else if "%choice%"=="2" (
    echo Building for production...
    npm run build
    echo.
    echo Build completed! Check the build/ folder
    echo To serve the build, you can use: npx serve -s build
) else (
    echo Invalid choice. Starting development server...
    npm start
)

pause