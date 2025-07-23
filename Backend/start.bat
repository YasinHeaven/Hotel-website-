@echo off
echo Starting Yasin Heaven Star Hotel Backend...
echo.

if not exist .env (
    echo Error: .env file not found!
    echo Please run setup.bat first or create .env file
    pause
    exit /b 1
)

echo Backend API will be available at: http://localhost:5000
echo.

echo Choose startup mode:
echo 1. Development (with nodemon)
echo 2. Production
echo 3. Standalone API only
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Starting in development mode...
    npm run dev
) else if "%choice%"=="2" (
    echo Starting in production mode...
    npm start
) else if "%choice%"=="3" (
    echo Starting standalone API...
    npm run standalone
) else (
    echo Invalid choice. Starting in development mode...
    npm run dev
)

pause