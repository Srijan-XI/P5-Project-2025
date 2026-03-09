@echo off
REM Unified Password Manager Launcher
REM This script helps launch the password manager with different options

echo.
echo ============================================
echo    UNIFIED PASSWORD MANAGER LAUNCHER
echo ============================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.6 or higher
    pause
    exit /b 1
)

REM Check if required dependencies are installed
echo Checking dependencies...
python -c "import cryptography" >nul 2>&1
if errorlevel 1 (
    echo.
    echo WARNING: cryptography module not found
    echo Installing required dependencies...
    pip install cryptography
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies
        echo Please run: pip install cryptography
        pause
        exit /b 1
    )
)

echo Dependencies OK
echo.

REM Show menu
:menu
echo Choose launch mode:
echo 1. GUI Mode (Graphical Interface)
echo 2. CLI Mode (Command Line Interface)
echo 3. Install Optional Dependencies (ttkbootstrap for themes)
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo Starting GUI mode...
    python unified_password_manager.py --gui
    goto end
)

if "%choice%"=="2" (
    echo.
    echo Starting CLI mode...
    python unified_password_manager.py --cli
    goto end
)

if "%choice%"=="3" (
    echo.
    echo Installing ttkbootstrap for modern themes...
    pip install ttkbootstrap
    echo.
    echo Installation complete. You can now use theme features in GUI mode.
    pause
    goto menu
)

if "%choice%"=="4" (
    goto end
)

echo Invalid choice. Please try again.
echo.
goto menu

:end
echo.
echo Thank you for using Unified Password Manager!
pause