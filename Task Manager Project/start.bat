@echo off
cls
color 0A
echo ========================================
echo    Task Manager - Quick Start
echo ========================================
echo.
echo Starting local development server...
echo.
echo Server URL: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

:: Open browser after a short delay
timeout /t 2 /nobreak >nul
start http://localhost:8000/index.html

:: Start Python simple HTTP server (works on most systems)
python -m http.server 8000

:: If Python server fails, try PHP
if %errorlevel% neq 0 (
    echo.
    echo Python not found, trying PHP...
    php -S localhost:8000
)

:: If server stops
echo.
echo Server stopped.
pause
