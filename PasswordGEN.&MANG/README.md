# 🔐 Unified Password Manager

**A Complete Password Management Solution**

This is a secure, easy-to-use password manager that helps you generate, store, and manage all your passwords safely. Whether you prefer using a graphical interface (GUI) or command-line interface (CLI), this application has you covered.

## 🎯 What This Application Does

- **Generates strong passwords** automatically
- **Stores all your passwords** in an encrypted file
- **Protects everything** with a single master password
- **Never sends data online** - everything stays on your computer
- **Works on Windows, Mac, and Linux**
- **Provides both GUI and CLI interfaces** for different user preferences

## Features

### 🔐 Core Security Features
- **AES-256 Encryption**: All passwords are encrypted using the Fernet encryption scheme
- **Master Password Protection**: Single master password protects all stored passwords
- **Secure Key Derivation**: Uses SHA-256 to derive encryption keys from master password
- **Local Storage**: All data is stored locally on your machine

### 🎯 Password Management Features
- **Secure Password Generation**: Generate strong passwords with customizable length and character sets
- **CRUD Operations**: Create, Read, Update, and Delete password entries
- **Search Functionality**: Search passwords by site name or username
- **Export Capability**: Export passwords to JSON files for backup
- **Automatic Save**: All changes are automatically saved and encrypted

### 🖥️ Multiple Interfaces
- **Command Line Interface (CLI)**: Full-featured terminal interface
- **Graphical User Interface (GUI)**: Modern, user-friendly interface
- **Theme Support**: Light and dark themes (requires ttkbootstrap)

## 🚀 Quick Start Guide

### Step 1: Check if Python is Installed
Open your terminal/command prompt and type:
```bash
python --version
```
If you see a version number (3.6 or higher), you're good to go! If not, download Python from [python.org](https://python.org).

### Step 2: Install Required Packages
**Essential package (required):**
```bash
pip install cryptography
```

**Optional package (for better themes):**
```bash
pip install ttkbootstrap
```

### Step 3: Run the Application
**Easy way (recommended):**
- Windows: Double-click `launch.bat`
- Mac/Linux: Run `./launch.sh` in terminal

**Manual way:**
```bash
python unified_password_manager.py
```

## Usage

### Running the Application

#### GUI Mode (Default)
```bash
python unified_password_manager.py
```
or
```bash
python unified_password_manager.py --gui
```

#### CLI Mode
```bash
python unified_password_manager.py --cli
```

#### With Custom Theme (GUI only)
```bash
python unified_password_manager.py --gui --theme darkly
```
or
```bash
python unified_password_manager.py --gui --theme litera
```

### 🔑 First Time Setup (Important!)

1. **Run the application** using one of the methods above
2. **Create a master password** when prompted
   - This is the ONE password you need to remember
   - Make it strong but memorable (e.g., a phrase with numbers)
   - Example: "MyDog$Loves2Play!" 
3. **Write down your master password** and store it safely
4. **⚠️ CRITICAL**: If you forget your master password, ALL your stored passwords will be lost forever!

### 💡 Master Password Tips
- Use a mix of letters, numbers, and symbols
- Make it at least 12 characters long
- Use something memorable to you but hard for others to guess
- Consider using a passphrase like "Coffee#Makes$Me4Happy"

## Interface Guide

### Command Line Interface (CLI)

The CLI provides a menu-driven interface with the following options:

1. **Generate Password** - Create a new secure password
2. **Add/Save Password** - Store a new password entry
3. **Retrieve Password** - Get a stored password
4. **View All Passwords** - Display all saved passwords
5. **Search Passwords** - Search by site name or username
6. **Delete Password** - Remove a password entry
7. **Export Passwords** - Save passwords to a JSON file
8. **Exit** - Close the application

### 🖼️ Graphical User Interface (GUI)

**To start GUI mode (default):**
```bash
python unified_password_manager.py
```
Or just double-click `launch.bat` (Windows) or run `./launch.sh` (Mac/Linux)

The GUI has three main sections:

#### 📝 Input Section (Top)
- **Website/Service**: Type the website name (e.g., "gmail.com")
- **Username**: Type your username or email
- **Password**: Type a password or generate one automatically

#### ⚙️ Password Generation (Middle)
- **Length slider**: Choose how long your password should be (4-128 characters)
- **Include Symbols checkbox**: Add special characters like !@#$ for extra security
- **🔄 Generate button**: Creates a new random password instantly

#### 🎮 Action Buttons (Bottom)
- **💾 Save Password**: Saves the information you entered
- **🔍 Retrieve Password**: Gets a saved password (just enter the website name)
- **📜 View All**: Shows all your passwords in a nice table
- **🔍 Search**: Finds passwords by typing part of a website or username
- **🗑️ Delete**: Removes a password you don't need anymore
- **📤 Export**: Creates a backup file of all your passwords
- **🌗 Toggle Theme**: Switches between light and dark appearance

#### 🎨 Visual Features
- **Status area**: Shows what the program is doing
- **Theme switching**: Choose light or dark mode
- **Organized layout**: Everything is clearly labeled and easy to find

## 📖 Real-World Examples

### Example 1: Saving Your First Password
1. **Start the app**: Double-click `launch.bat` or run the application
2. **Enter master password**: Create something like "MySecure2024Pass!"
3. **Fill in details**:
   - Website: `gmail.com`
   - Username: `john.doe@gmail.com`
   - Click "🔄 Generate" for password
4. **Click "💾 Save Password"**
5. Done! Your Gmail password is now safely stored.

### Example 2: Getting a Saved Password
1. **Open the app** and enter your master password
2. **Type the website**: `gmail.com` in the Website field
3. **Click "🔍 Retrieve Password"**
4. The app fills in your username and password automatically!

### Example 3: Creating a Backup
1. **Click "📤 Export"** button
2. **Choose where to save** your backup file
3. **Keep this file safe** - it contains all your passwords (unencrypted)

## 📁 Files Created by the Application

The application automatically creates these files:

- **`passwords.json`** - Your encrypted password database (appears after you save your first password)
- **`theme_pref.json`** - Remembers if you prefer light or dark theme (GUI only)

## Security Considerations

### ✅ Security Features
- All passwords are encrypted using industry-standard AES-256 encryption
- Master password is never stored - only used to derive encryption keys
- Local storage - no data is sent over the network
- Secure random password generation

### ⚠️ Important Security Notes
- **Master Password**: Choose a strong, unique master password
- **Backup**: Consider backing up your `passwords.json` file securely
- **Recovery**: If you forget your master password, your data cannot be recovered
- **File Security**: Protect your `passwords.json` file from unauthorized access

## Advanced Features

### Password Generation Options
- Customizable length (4-128 characters)
- Option to include/exclude special characters
- Ensures password complexity with mixed character types

### Search and Organization
- Search by website/service name
- Search by username
- View all passwords in organized format
- Timestamps for password creation and modification

### Export and Backup
- Export passwords to JSON format
- Unencrypted export for migration purposes
- Easy backup and restore capabilities

## Project File Structure

```
PasswordGEN.&MANG/
│
├── unified_password_manager.py    # Main application file (755+ lines)
├── README.md                      # This documentation file
├── requirements.txt               # Python dependencies
├── launch.bat                     # Windows launcher script
├── launch.sh                      # Unix/Linux launcher script
├── theme_pref.json               # Theme preferences (created automatically)
├── ANALYSIS_SUMMARY.md           # Technical analysis documentation
│
└── Generated at runtime:
    └── passwords.json             # Encrypted password storage (created when you save passwords)
```

### File Descriptions

- **`unified_password_manager.py`**: The main application containing all functionality
- **`README.md`**: Complete user documentation (this file)
- **`requirements.txt`**: List of required Python packages
- **`launch.bat`**: Easy launcher for Windows users
- **`launch.sh`**: Easy launcher for Unix/Linux/macOS users
- **`theme_pref.json`**: Stores your GUI theme preference
- **`passwords.json`**: Your encrypted password database (created automatically)
- **`ANALYSIS_SUMMARY.md`**: Technical documentation about the code unification

## Code Architecture

The unified password manager is built with a clean, modular architecture:

### Core Classes
- **`PasswordManager`**: Handles all password operations and encryption
  - Password storage and retrieval
  - AES-256 encryption/decryption
  - Master password authentication
  - File operations

- **`PasswordManagerCLI`**: Command-line interface
  - Menu-driven terminal interface
  - All password management operations
  - User-friendly prompts and feedback

- **`PasswordManagerGUI`**: Graphical user interface
  - Modern tkinter/ttkbootstrap interface
  - Theme support and visual feedback
  - Intuitive forms and buttons

### Key Functions
- **`generate_password()`**: Creates secure random passwords
- **`generate_key()`**: Derives encryption keys from master password
- **`start_cli()`** / **`start_gui()`**: Application entry points

## 🔧 Troubleshooting Guide

### ❌ Common Problems and Solutions

#### Problem: "Python is not recognized" or "python: command not found"
**Solution:** Python is not installed or not in your system PATH
- Download Python from [python.org](https://python.org)
- During installation, check "Add Python to PATH"
- Restart your terminal/command prompt after installation

#### Problem: "No module named 'cryptography'"
**Solution:** Required package is missing
```bash
pip install cryptography
```
If that doesn't work, try:
```bash
python -m pip install cryptography
```

#### Problem: "Incorrect master password or corrupted file"
**Possible causes:**
- You typed the wrong master password (remember, it's case-sensitive!)
- The `passwords.json` file got corrupted
- Someone else used a different master password

**Solutions:**
- Double-check your master password spelling and capitalization
- If you're sure it's correct, the file might be corrupted (you'll need to start over)
- Try running the app from the same folder where you originally created passwords

#### Problem: App won't start or crashes immediately
**Solutions:**
1. Make sure you're in the right folder (where `unified_password_manager.py` is located)
2. Try running: `python unified_password_manager.py --cli` to see error messages
3. Check if all files are present (especially `unified_password_manager.py`)

#### Problem: "Permission denied" when saving passwords
**Solutions:**
- Make sure you have write permissions in the current folder
- Try running the app as administrator (Windows) or with `sudo` (Mac/Linux)
- Check if your antivirus is blocking the app

#### Problem: Can't see passwords in GUI (they appear as dots)
**This is normal!** The password field shows dots for security. To see the actual password:
- Use "🔍 Retrieve Password" - it will show the password in a popup
- Or use "📜 View All" to see all passwords in a table

### 🆘 Emergency Situations

#### "I forgot my master password!"
**Unfortunately, this cannot be fixed.** For security, master passwords cannot be recovered. You'll need to:
1. Delete the `passwords.json` file
2. Start over with a new master password
3. Re-enter all your passwords manually

#### "My passwords.json file is corrupted!"
**If you have a backup:**
1. Replace the corrupted file with your backup
2. Use the same master password as when you created the backup

**If you don't have a backup:**
1. Delete the corrupted `passwords.json` file
2. Start fresh (unfortunately, you'll lose your saved passwords)

### 💡 Prevention Tips
- **Write down your master password** and store it safely
- **Export your passwords regularly** using the "📤 Export" button
- **Keep backups** of your `passwords.json` file
- **Don't change the master password** unless absolutely necessary

## 🔄 Upgrading from Older Versions

If you were using one of the individual password manager files before this unified version:

1. **Keep your existing files**: Don't delete your old `passwords.json` - it will work with the new version!
2. **Copy files to new folder**: Put your `passwords.json` and `theme_pref.json` in the same folder as `unified_password_manager.py`
3. **Use the same master password**: Your old master password will still work
4. **Enjoy new features**: You now have access to search, export, and enhanced interfaces!

## 🤝 Support and Contributing

### Need Help?
- Read this README thoroughly - most questions are answered here
- Check the troubleshooting section above
- Try running in CLI mode to see detailed error messages: `python unified_password_manager.py --cli`

### Want to Improve This App?
This unified password manager combines the best features from multiple implementations. It includes:
- ✅ Strong encryption and security practices
- ✅ User-friendly interfaces for all skill levels
- ✅ Cross-platform compatibility (Windows, Mac, Linux)
- ✅ Comprehensive error handling and user feedback
- ✅ Modern GUI with theme support
- ✅ Extensive documentation and examples

## 📄 License and Disclaimer

This project is provided **as-is** for educational and personal use. 

**⚠️ Important:**
- Use at your own risk
- Always keep backups of your passwords
- The developers are not responsible for lost passwords or data
- This is a learning project - for critical business use, consider commercial solutions

## 🚀 Version History

### Version Unified 1.0 (Current)
**What's New:**
- 🎯 Combined three separate password managers into one powerful application
- 🖥️ Both CLI and GUI interfaces in a single file
- 🔍 Advanced search functionality
- 📤 Export/backup capabilities
- 🎨 Modern GUI with light/dark themes
- 🛡️ Enhanced security and error handling
- 📚 Comprehensive documentation with examples
- 🔧 Easy launcher scripts for all platforms
- ⚡ Improved performance and user experience

---

**🎉 You're all set! Enjoy secure password management with the Unified Password Manager!**

For the best experience, start with the GUI mode by running `launch.bat` (Windows) or `./launch.sh` (Mac/Linux).