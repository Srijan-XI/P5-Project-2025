# Setup Guide - Enabling SQLite3 in PHP

## 🔴 Error: SQLite3 Extension Not Enabled

If you're seeing this error: **"SQLite3 extension not enabled"**, follow these steps:

## Windows Setup

### Step 1: Locate your php.ini file

Run this command to find your PHP configuration file:
```bash
php --ini
```

You'll see output like:
```
Configuration File (php.ini) Path: C:\php
Loaded Configuration File:         C:\php\php.ini
```

### Step 2: Edit php.ini

1. Open the `php.ini` file in a text editor (as Administrator)
2. Search for this line (Ctrl+F):
   ```ini
   ;extension=sqlite3
   ```

3. Remove the semicolon to uncomment it:
   ```ini
   extension=sqlite3
   ```

4. Also ensure this line is uncommented:
   ```ini
   extension_dir = "ext"
   ```

### Step 3: Verify the DLL file exists

Check that `php_sqlite3.dll` exists in your PHP's `ext` folder:
```
C:\php\ext\php_sqlite3.dll
```

If it's missing, you may need to reinstall PHP or download the extension.

### Step 4: Restart

1. Close all Command Prompt/PowerShell windows
2. Open a new terminal
3. Verify SQLite3 is enabled:
   ```bash
   php -r "if (class_exists('SQLite3')) { echo 'SUCCESS: SQLite3 is enabled!'; } else { echo 'FAILED: Still not enabled'; }"
   ```

## Alternative: Use PHP with SQLite Pre-enabled

Download PHP from: https://windows.php.net/download/

- Choose "Thread Safe" version
- Extract to `C:\php`
- Add `C:\php` to your system PATH
- Edit `php.ini` as described above

## Linux/Mac Setup

### Ubuntu/Debian:
```bash
sudo apt-get install php-sqlite3
sudo systemctl restart apache2  # if using Apache
```

### macOS:
SQLite3 is usually included with PHP on macOS. If not:
```bash
brew install php
```

## Verify Installation

After completing the setup, run:

```bash
cd "P:\CODE-XI\P5-Project-2025\Task Manager Project"
php -r "if (class_exists('SQLite3')) { echo 'SQLite3 is ready!'; }"
```

If you see "SQLite3 is ready!", you can now run:

```bash
.\start.bat
```

## Troubleshooting

### Problem: php_sqlite3.dll not found
**Solution**: Ensure you downloaded the correct PHP version (Thread Safe vs Non-Thread Safe)

### Problem: Access denied editing php.ini
**Solution**: Run your text editor as Administrator

### Problem: Still not working after restart
**Solution**: 
1. Completely close all terminals
2. Check Windows Environment Variables for PHP path
3. Restart Windows if necessary

## Quick Test

Run this in the project directory:
```bash
php php/test_sqlite.php
```

This will confirm SQLite3 is working properly.

---

## 🎯 After SQLite is Enabled

Once SQLite3 is working:

1. Run `.\start.bat` to start the server
2. Choose "Y" when asked to migrate old tasks
3. Open http://localhost:8000 in your browser
4. Enjoy your enhanced Task Manager! 🎉
