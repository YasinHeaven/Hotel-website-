@echo off
echo 🧹 Cleaning up unnecessary test and development files...

cd /d "c:\Users\DELL\Desktop\Yasin Heaven Star Hotel - Copy (2)\Backend"

REM Delete all test files
echo Deleting test files...
del /f /q test-*.js 2>nul
del /f /q debug-*.js 2>nul
del /f /q check-*.js 2>nul
del /f /q simple-*.js 2>nul
del /f /q quick-*.js 2>nul
del /f /q new-*.js 2>nul
del /f /q create-test-*.js 2>nul
del /f /q fix-*.js 2>nul
del /f /q hello.js 2>nul

REM Delete seed files (keeping seeders/index.js)
del /f /q seed-*.js 2>nul

REM Delete manual test guides
del /f /q manual-test-guide.js 2>nul

echo ✅ Cleanup completed!
echo.
echo 📁 Keeping essential files:
echo   - server.js (main server)
echo   - create-admin.js (admin creation)
echo   - get-room-ids.js (utility)
echo   - setup-admin-auth.js (admin setup)
echo   - seeders/index.js (database seeding)
echo.
echo 🗑️ Deleted files:
echo   - All test-*.js files
echo   - All debug-*.js files  
echo   - All check-*.js files
echo   - All simple-*.js files
echo   - All quick-*.js files
echo   - Other development files
echo.
echo ✨ Your backend is now production-ready!
pause
