@echo off
echo ================================
echo    Finance Tracker Setup
echo ================================
echo.

echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

echo Python found!
echo.

echo Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo Error: Failed to create virtual environment
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo Initializing database...
python init_db.py
if errorlevel 1 (
    echo Error: Failed to initialize database
    pause
    exit /b 1
)

echo.
echo ================================
echo    Setup Complete!
echo ================================
echo.
echo To start the application:
echo 1. Run: venv\Scripts\activate
echo 2. Run: python run.py
echo 3. Open: http://localhost:5000
echo.

pause