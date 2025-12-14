@echo off
cls
color 0A
echo ========================================
echo    Task Manager - Quick Start
echo ========================================
echo.

:: Check if PHP is installed
php -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PHP is not installed or not in PATH
    echo Please install PHP 8.0+ with SQLite extension
    echo Download from: https://www.php.net/downloads
    pause
    exit /b 1
)

echo [OK] PHP is installed
echo.

:: Check if SQLite extension is enabled
for /f "tokens=*" %%i in ('php -m ^| findstr /I "sqlite3"') do set SQLITE_FOUND=1
if not defined SQLITE_FOUND (
    echo [ERROR] PHP SQLite3 extension not found.
    echo You can enable it via the provided helper scripts.
    if exist "enable-sqlite.bat" (
        choice /C YN /M "Run enable-sqlite.bat now"
        if errorlevel 2 goto sqlite_skip
        if errorlevel 1 call enable-sqlite.bat
        echo.
        echo Re-checking SQLite extension...
        set SQLITE_FOUND=
        for /f "tokens=*" %%i in ('php -m ^| findstr /I "sqlite3"') do set SQLITE_FOUND=1
        if not defined SQLITE_FOUND (
            echo [ERROR] SQLite still not enabled. Please enable manually (php.ini).
            pause
            exit /b 1
        )
    ) else (
        echo Please enable sqlite3 in php.ini (extension=sqlite3).
        pause
        exit /b 1
    )
)

echo [OK] SQLite extension enabled
echo.

:: Check for migration
if exist "db\tasks.json" (
    echo [INFO] Old tasks.json file detected!
    echo.
    choice /C YN /M "Do you want to migrate old tasks to SQLite"
    if errorlevel 2 goto skip_migration
    if errorlevel 1 goto do_migration
)

:do_migration
echo.
echo [MIGRATION] Running migration script...
cd php
php migrate.php
cd ..
echo.
echo [DONE] Migration complete!
echo.
pause
goto start_server

:skip_migration
echo [INFO] Skipping migration...
echo.

:start_server
echo ========================================
echo Starting PHP Development Server...
echo ========================================
echo.
echo Server URL: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

:: Open browser after a short delay (index.html)
timeout /t 2 /nobreak >nul
start http://localhost:8000/index.html

:: Start PHP server
php -S localhost:8000

:: If server stops
echo.
echo Server stopped.
pause
