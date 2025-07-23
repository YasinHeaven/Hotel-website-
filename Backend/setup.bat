@echo off
echo Setting up Yasin Heaven Star Hotel Backend...
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
        echo Please edit .env file with your configuration
    ) else (
        echo Warning: .env.example not found
    )
) else (
    echo .env file already exists
)

echo.
echo Step 3: Testing database connection...
call npm run test-db
if errorlevel 1 (
    echo Warning: Database connection test failed
    echo Please check your MongoDB connection settings in .env
)

echo.
echo Step 4: Seeding database...
call npm run seed
if errorlevel 1 (
    echo Warning: Database seeding failed
    echo Please check your database configuration
)

echo.
echo ✅ Backend setup completed!
echo.
echo Next steps:
echo 1. Edit .env file with your configuration
echo 2. Start development: npm run dev
echo 3. Start production: npm start
echo.
pause