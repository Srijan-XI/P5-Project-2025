@echo off
echo ============================================
echo   Testing SQLite3 Configuration
echo ============================================
echo.
echo Closing this terminal will force PHP to reload configuration...
echo.
pause
echo.
echo Opening NEW terminal to test SQLite3...
echo.

:: Open new terminal with test command
start cmd /k "cd /d "%~dp0" && echo Testing SQLite3... && php php/test_sqlite.php && echo. && echo If test passed, you can now run: start.bat && echo. && pause"

:: Close this terminal
exit
