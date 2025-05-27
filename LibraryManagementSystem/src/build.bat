@echo off
echo [INFO] Building Library Management System...

:: Compile all source files and link them
g++ main.cpp Library.cpp Book.cpp -I../include -o library_mgmt.exe

:: Check for build success
if %errorlevel% neq 0 (
    echo [ERROR] Build failed. Check for compilation issues.
    pause
    exit /b %errorlevel%
)

echo [SUCCESS] Build successful. Running the application...
echo -----------------------------------------------
.\library_mgmt.exe
echo -----------------------------------------------
pause
