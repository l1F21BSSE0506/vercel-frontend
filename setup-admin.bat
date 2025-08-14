@echo off
echo Setting up Admin Dashboard...
echo.

cd backend
echo Installing dependencies...
npm install

echo.
echo Creating admin user...
node scripts/setupAdmin.js

echo.
echo Admin setup complete!
echo You can now login to the dashboard with the credentials shown above.
pause
