@echo off
echo Setting up Yasin Heaven Star Hotel Frontend...
echo.

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Setting up environment file...
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo Created .env file from .env.example
        echo Please edit .env file with your API URL
    ) else (
        echo Warning: .env.example not found
    )
) else (
    echo .env file already exists
)

echo.
echo ✅ Frontend setup completed!
echo.
echo Next steps:
echo 1. Edit .env file with your backend API URL
echo 2. Start development: npm start
echo 3. Build for production: npm run build
echo.
echo The app will run on http://localhost:3000
pause