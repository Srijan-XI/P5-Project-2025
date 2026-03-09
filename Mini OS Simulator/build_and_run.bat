

@echo off
echo ================================
echo Building Mini OS Simulator ...
echo ================================

:: Create build directory if it doesn't exist
if not exist build (
    mkdir build
)

:: Compile using g++
g++ src\main.cpp src\process_scheduler.cpp -Iinclude -o build\mos_sim.exe

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Build failed. Please check for errors.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ✅ Build successful!
echo ================================
echo Running MOS-Sim ...
echo ================================
echo.

:: Run the executable
build\mos_sim.exe

echo.
echo ================================
echo Program ended.
pause
