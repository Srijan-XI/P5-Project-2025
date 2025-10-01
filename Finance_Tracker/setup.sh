#!/bin/bash

echo "================================"
echo "    Finance Tracker Setup"
echo "================================"
echo

echo "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

echo "Python found!"
echo

echo "Creating virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "Error: Failed to create virtual environment"
    exit 1
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo "Initializing database..."
python init_db.py
if [ $? -ne 0 ]; then
    echo "Error: Failed to initialize database"
    exit 1
fi

echo
echo "================================"
echo "    Setup Complete!"
echo "================================"
echo
echo "To start the application:"
echo "1. Run: source venv/bin/activate"
echo "2. Run: python run.py"
echo "3. Open: http://localhost:5000"
echo