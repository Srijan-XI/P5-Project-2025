@echo off
echo ================================================
echo   Library Management System - Complete Launcher
echo ================================================
echo.
echo Starting all components...
echo.

:: Check if C++ executable exists
if exist "src\library_mgmt.exe" (
    echo [1/3] Starting C++ Library System...
    start "C++ Library System" cmd /k "cd src && library_mgmt.exe"
    timeout /t 2 /nobreak > nul
    echo [OK] C++ system started
) else (
    echo [WARNING] C++ executable not found. Skipping...
    echo          Build it first using: cd src ^&^& build.bat
)
echo.

echo [2/3] Starting Python Flask API Server...
start "Python API Server" cmd /k "python api/app.py"
timeout /t 3 /nobreak > nul
echo [OK] API server started on port 5000
echo.

echo [3/3] Starting Node.js Web Server...
start "Node.js Web Server" cmd /k "npm start"
timeout /t 3 /nobreak > nul
echo [OK] Web server started on port 3000
echo.

echo ================================================
echo            All Systems Running!
echo ================================================
echo.
echo C++ Library System: Running in separate window
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
taskkill /FI "WindowTitle eq C++ Library System*" /T /F > nul 2>&1

echo [OK] All servers stopped.
echo.
exit
