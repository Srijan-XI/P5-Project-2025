@echo off
echo ==========================================
echo       Starting Finance Tracker
echo ==========================================

:: Check for virtual environment and activate it
if exist .venv\Scripts\activate.bat (
    echo Activating virtual environment (.venv)...
    call .venv\Scripts\activate.bat
) else if exist venv\Scripts\activate.bat (
    echo Activating virtual environment (venv)...
    call venv\Scripts\activate.bat
) else (
    echo Warning: No virtual environment found. Using system Python.
)

:: Run the application
echo.
echo Launching application...
python run.py

:: Keep window open if app crashes
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Application exited with error code %ERRORLEVEL%
    pause
)
