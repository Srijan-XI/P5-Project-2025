@echo off
echo ================================================
echo   Library Management System - Complete Launcher
echo ================================================
echo.
echo Starting all components...
echo.

:: Check if C++ executable exists (needed for security)
if not exist "src\library_mgmt.exe" (
    echo [WARNING] C++ Security Module not found.
    echo          Please build it using: cd src ^&^& build.bat
    echo.
) else (
    echo [OK] C++ Security Module found.
)
echo.

echo [1/2] Starting Python Flask API Server...
start "Python API Server" cmd /k "python api/app.py"
timeout /t 3 /nobreak > nul
echo [OK] API server started on port 5000
echo.

echo [2/2] Starting Node.js Web Server...
start "Node.js Web Server" cmd /k "npm start"
timeout /t 3 /nobreak > nul
echo [OK] Web server started on port 3000
echo.

echo ================================================
echo            All Systems Running!
echo ================================================
echo.
echo Python API Server:  http://localhost:5000
echo Node.js Web Server: http://localhost:3000
echo.
echo Opening web browser...
timeout /t 5 /nobreak > nul
start http://localhost:3000
echo.
echo ================================================
echo Press any key to stop ALL servers and exit...
echo ================================================
pause > nul

:: Kill all server processes
echo.
echo Stopping all servers...
taskkill /FI "WindowTitle eq Python API Server*" /T /F > nul 2>&1
taskkill /FI "WindowTitle eq Node.js Web Server*" /T /F > nul 2>&1

echo [OK] All servers stopped.
echo.
exit
