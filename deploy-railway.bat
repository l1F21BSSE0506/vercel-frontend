@echo off
echo ========================================
echo Railway Deployment Script
echo ========================================
echo.

echo 1. Installing dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 2. Testing server locally...
start /B npm start
timeout /t 5 /nobreak >nul

echo 3. Testing health endpoint...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Health check passed locally
) else (
    echo ❌ Health check failed locally
    echo Please check if server is running on port 5000
)

echo.
echo 4. Committing changes...
cd ..
git add .
git commit -m "Fix Railway deployment: server startup and health check"
if %errorlevel% neq 0 (
    echo ❌ Failed to commit changes
    pause
    exit /b 1
)

echo.
echo 5. Pushing to Railway...
git push
if %errorlevel% neq 0 (
    echo ❌ Failed to push changes
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Deployment initiated successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Check Railway dashboard for deployment status
echo 2. Monitor logs for any errors
echo 3. Test health endpoint: https://your-app.railway.app/health
echo.
echo The health check should now pass within 5 minutes.
pause
