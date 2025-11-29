@echo off
echo Starting Task Manager Project...
echo Server running at http://localhost:8000
echo Press Ctrl+C to stop the server.

:: Open the default web browser
start http://localhost:8000

:: Start the PHP built-in server
php -S localhost:8000
