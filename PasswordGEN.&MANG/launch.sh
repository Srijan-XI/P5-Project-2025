#!/bin/bash

# Unified Password Manager Launcher
# This script helps launch the password manager with different options

echo ""
echo "============================================"
echo "    UNIFIED PASSWORD MANAGER LAUNCHER"
echo "============================================"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "ERROR: Python is not installed or not in PATH"
        echo "Please install Python 3.6 or higher"
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

# Check if required dependencies are installed
echo "Checking dependencies..."
$PYTHON_CMD -c "import cryptography" 2>/dev/null
if [ $? -ne 0 ]; then
    echo ""
    echo "WARNING: cryptography module not found"
    echo "Installing required dependencies..."
    pip3 install cryptography || pip install cryptography
    if [ $? -ne 0 ]; then
        echo ""
        echo "ERROR: Failed to install dependencies"
        echo "Please run: pip install cryptography"
        exit 1
    fi
fi

echo "Dependencies OK"
echo ""

# Show menu
while true; do
    echo "Choose launch mode:"
    echo "1. GUI Mode (Graphical Interface)"
    echo "2. CLI Mode (Command Line Interface)"
    echo "3. Install Optional Dependencies (ttkbootstrap for themes)"
    echo "4. Exit"
    echo ""
    read -p "Enter your choice (1-4): " choice

    case $choice in
        1)
            echo ""
            echo "Starting GUI mode..."
            $PYTHON_CMD unified_password_manager.py --gui
            break
            ;;
        2)
            echo ""
            echo "Starting CLI mode..."
            $PYTHON_CMD unified_password_manager.py --cli
            break
            ;;
        3)
            echo ""
            echo "Installing ttkbootstrap for modern themes..."
            pip3 install ttkbootstrap || pip install ttkbootstrap
            echo ""
            echo "Installation complete. You can now use theme features in GUI mode."
            read -p "Press Enter to continue..."
            echo ""
            ;;
        4)
            break
            ;;
        *)
            echo "Invalid choice. Please try again."
            echo ""
            ;;
    esac
done

echo ""
echo "Thank you for using Unified Password Manager!"