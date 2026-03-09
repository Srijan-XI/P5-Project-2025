@echo off
cls
color 0E
echo ========================================
echo    SQLite3 Setup Helper
echo ========================================
echo.

:: Find PHP directory
for /f "tokens=*" %%i in ('where php 2^>nul') do (
    set PHP_EXE=%%i
    goto :found_php
)

echo [ERROR] PHP not found in PATH
pause
exit /b 1

:found_php
for %%i in ("%PHP_EXE%") do set PHP_DIR=%%~dpi
echo [INFO] PHP found at: %PHP_DIR%
echo.

:: Check for php.ini
set PHP_INI=%PHP_DIR%php.ini
if not exist "%PHP_INI%" (
    echo [WARN] php.ini not found at: %PHP_INI%
    echo.
    
    :: Check for php.ini-development or php.ini-production
    if exist "%PHP_DIR%php.ini-development" (
        echo [INFO] Found php.ini-development
        echo [ACTION] Copying php.ini-development to php.ini...
        copy "%PHP_DIR%php.ini-development" "%PHP_INI%"
        echo [DONE] php.ini created
        echo.
    ) else if exist "%PHP_DIR%php.ini-production" (
        echo [INFO] Found php.ini-production
        echo [ACTION] Copying php.ini-production to php.ini...
        copy "%PHP_DIR%php.ini-production" "%PHP_INI%"
        echo [DONE] php.ini created
        echo.
    ) else (
        echo [ERROR] No template php.ini file found!
        echo Please manually create php.ini
        pause
        exit /b 1
    )
)

echo [INFO] php.ini location: %PHP_INI%
echo.

:: Check if sqlite3 extension exists
set EXT_DIR=%PHP_DIR%ext
set SQLITE_DLL=%EXT_DIR%\php_sqlite3.dll

if exist "%SQLITE_DLL%" (
    echo [OK] SQLite3 DLL found: %SQLITE_DLL%
) else (
    echo [ERROR] SQLite3 DLL NOT found at: %SQLITE_DLL%
    echo Your PHP installation may be incomplete
    pause
    exit /b 1
)

echo.
echo ========================================
echo  NEXT STEPS (Manual):
echo ========================================
echo.
echo 1. Open Notepad as Administrator
echo 2. Open this file: %PHP_INI%
echo 3. Find the line: ;extension=sqlite3
echo 4. Remove the semicolon: extension=sqlite3
echo 5. Save and close
echo 6. Close ALL terminals and reopen
echo.
echo ========================================
echo.

choice /C ON /M "Do you want to open php.ini now"
if errorlevel 2 goto :skip_open
if errorlevel 1 goto :open_ini

:open_ini
echo Opening php.ini in Notepad...
notepad "%PHP_INI%"
echo.
echo Remember to:
echo  - Find: ;extension=sqlite3
echo  - Change to: extension=sqlite3
echo  - Also check: ;extension_dir = "ext"
echo  - Change to: extension_dir = "ext"
echo  - Save and restart terminal
echo.

:skip_open
echo ========================================
echo After editing php.ini:
echo  1. Close ALL Command Prompts/PowerShell
echo  2. Open a new terminal
echo  3. Run: php php/test_sqlite.php
echo  4. If test passes, run: start.bat
echo ========================================
echo.
pause
