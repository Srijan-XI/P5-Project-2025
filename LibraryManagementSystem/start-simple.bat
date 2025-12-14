@echo off
echo ================================================
echo   Starting Library Management System
echo ================================================
echo.
echo Checking dependencies...
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Node modules not found. Installing...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

echo [OK] Dependencies ready
echo.
echo Starting servers...
echo.

:: Start Python API
echo [1/2] Starting Python API Server on port 5000...
start "Library API" cmd /k "python api/app.py"
timeout /t 3 /nobreak > nul

:: Start Node.js server
echo [2/2] Starting Web Server on port 3000...
start "Library Web" cmd /k "npm start"
timeout /t 3 /nobreak > nul

echo.
echo ================================================
echo   Servers Started Successfully!
echo ================================================
echo.
echo API Server: http://localhost:5000
echo Web Server: http://localhost:3000
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak > nul
start http://localhost:3000

echo.
echo [INFO] Servers are running in separate windows
echo [INFO] Close those windows to stop the servers
echo.
pause
