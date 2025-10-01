#!/usr/bin/env python3
"""
Unified Password Manager
========================
A comprehensive password manager with CLI and GUI interfaces.
Combines features from alpha_ver_1.py, pwd_beta_ver.py, and PWD_3rd_version.py

Features:
- Secure password generation
- Encrypted password storage using Fernet encryption
- Master password authentication
- Command-line interface
- Modern GUI with theme support
- CRUD operations for passwords

Dependencies:
- cryptography
- ttkbootstrap (for GUI)
- tkinter (built-in)

Author: Password Manager Project
Version: Unified 1.0
"""

import tkinter as tk
from tkinter import messagebox, simpledialog
import random
import string
import json
import os
import sys
import argparse
from cryptography.fernet import Fernet
import base64
import hashlib

# Try to import ttkbootstrap for modern themes, fallback to standard tkinter
try:
    import ttkbootstrap as ttk
    from ttkbootstrap import Window as TtkWindow
    TTK_AVAILABLE = True
    TTKBOOTSTRAP_AVAILABLE = True
except ImportError:
    import tkinter.ttk as ttk
    TtkWindow = None
    TTK_AVAILABLE = True
    TTKBOOTSTRAP_AVAILABLE = False
    print("⚠️  ttkbootstrap not available. Install with: pip install ttkbootstrap")

# Configuration
PASSWORDS_FILE = "passwords.json"
THEME_FILE = "theme_pref.json"
DEFAULT_THEME = "darkly"
DEFAULT_PASSWORD_LENGTH = 16

# ================================
# CORE UTILITY FUNCTIONS
# ================================

def generate_key(master_password):
    """Generate a secure key from a master password using SHA-256"""
    key = hashlib.sha256(master_password.encode()).digest()
    return base64.urlsafe_b64encode(key)

def generate_password(length=DEFAULT_PASSWORD_LENGTH, include_symbols=True):
    """Generate a secure random password"""
    characters = string.ascii_letters + string.digits
    if include_symbols:
        characters += string.punctuation
    
    # Ensure at least one character from each category
    password = []
    password.append(random.choice(string.ascii_lowercase))
    password.append(random.choice(string.ascii_uppercase))
    password.append(random.choice(string.digits))
    if include_symbols:
        password.append(random.choice(string.punctuation))
    
    # Fill remaining length with random characters
    for _ in range(length - len(password)):
        password.append(random.choice(characters))
    
    # Shuffle the password
    random.shuffle(password)
    return ''.join(password)

# ================================
# PASSWORD MANAGER CLASS
# ================================

class PasswordManager:
    """Core password manager with encryption functionality"""
    
    def __init__(self, master_password, filename=PASSWORDS_FILE):
        self.filename = filename
        self.key = generate_key(master_password)
        self.cipher = Fernet(self.key)
        self.passwords = self.load_passwords()
        self.master_password = master_password

    def load_passwords(self):
        """Load and decrypt passwords from file"""
        if os.path.exists(self.filename):
            try:
                with open(self.filename, "r") as file:
                    encrypted_data = file.read().encode()
                    decrypted_data = self.cipher.decrypt(encrypted_data)
                    return json.loads(decrypted_data)
            except Exception as e:
                print(f"❌ Error loading passwords: {e}")
                return {}
        return {}

    def save_passwords(self):
        """Encrypt and save passwords to file"""
        try:
            encrypted_data = self.cipher.encrypt(json.dumps(self.passwords, indent=2).encode())
            with open(self.filename, "w") as file:
                file.write(encrypted_data.decode())
        except Exception as e:
            print(f"❌ Error saving passwords: {e}")

    def add_password(self, site, username, password):
        """Add a new password entry"""
        self.passwords[site] = {
            "username": username, 
            "password": password,
            "created": self._get_timestamp()
        }
        self.save_passwords()
        return True

    def get_password(self, site):
        """Retrieve password for a specific site"""
        return self.passwords.get(site, None)

    def get_all_sites(self):
        """Get list of all saved sites"""
        return list(self.passwords.keys())

    def delete_password(self, site):
        """Delete password for a specific site"""
        if site in self.passwords:
            del self.passwords[site]
            self.save_passwords()
            return True
        return False

    def update_password(self, site, username=None, password=None):
        """Update existing password entry"""
        if site in self.passwords:
            if username:
                self.passwords[site]["username"] = username
            if password:
                self.passwords[site]["password"] = password
            self.passwords[site]["modified"] = self._get_timestamp()
            self.save_passwords()
            return True
        return False

    def search_passwords(self, query):
        """Search passwords by site name or username"""
        results = {}
        query_lower = query.lower()
        for site, data in self.passwords.items():
            if (query_lower in site.lower() or 
                query_lower in data.get("username", "").lower()):
                results[site] = data
        return results

    def export_passwords(self, export_file="passwords_export.json"):
        """Export passwords to a JSON file (unencrypted)"""
        try:
            with open(export_file, "w") as file:
                json.dump(self.passwords, file, indent=2)
            return True
        except Exception as e:
            print(f"❌ Error exporting passwords: {e}")
            return False

    def _get_timestamp(self):
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()

# ================================
# COMMAND LINE INTERFACE
# ================================

class PasswordManagerCLI:
    """Command-line interface for the password manager"""
    
    def __init__(self, manager):
        self.manager = manager

    def run(self):
        """Main CLI loop"""
        print("🔐 SECURE PASSWORD MANAGER - CLI MODE")
        print("=" * 50)
        
        while True:
            self._display_menu()
            choice = input("\n🔹 Select an option (1-8): ").strip()
            
            if choice == "1":
                self._generate_password()
            elif choice == "2":
                self._add_password()
            elif choice == "3":
                self._retrieve_password()
            elif choice == "4":
                self._view_all_passwords()
            elif choice == "5":
                self._search_passwords()
            elif choice == "6":
                self._delete_password()
            elif choice == "7":
                self._export_passwords()
            elif choice == "8":
                print("\n🔒 Exiting Password Manager. Stay secure!")
                break
            else:
                print("\n❌ Invalid choice! Please select a valid option.")

    def _display_menu(self):
        """Display the main menu"""
        print("\n📋 MAIN MENU")
        print("1️⃣  Generate Password")
        print("2️⃣  Add/Save Password")
        print("3️⃣  Retrieve Password")
        print("4️⃣  View All Passwords")
        print("5️⃣  Search Passwords")
        print("6️⃣  Delete Password")
        print("7️⃣  Export Passwords")
        print("8️⃣  Exit")

    def _generate_password(self):
        """Generate a new password"""
        try:
            length = int(input("\n🔢 Enter password length (default 16): ") or DEFAULT_PASSWORD_LENGTH)
            include_symbols = input("🔣 Include symbols? (y/n, default y): ").lower() != 'n'
            password = generate_password(length, include_symbols)
            print(f"\n🆕 Generated Password: {password}")
            
            save = input("\n💾 Save this password? (y/n): ").lower()
            if save == 'y':
                site = input("🌐 Enter website/service name: ")
                username = input("👤 Enter username: ")
                if site and username:
                    self.manager.add_password(site, username, password)
                    print(f"✅ Password for {site} saved securely!")
        except ValueError:
            print("❌ Invalid length! Please enter a number.")

    def _add_password(self):
        """Add a new password manually"""
        site = input("\n🌐 Enter website/service name: ")
        username = input("👤 Enter username: ")
        
        choice = input("🔑 (G)enerate password or (E)nter manually? (g/e): ").lower()
        if choice == 'g':
            length = int(input(f"🔢 Password length (default {DEFAULT_PASSWORD_LENGTH}): ") or DEFAULT_PASSWORD_LENGTH)
            password = generate_password(length)
            print(f"🆕 Generated: {password}")
        else:
            password = input("🔑 Enter password: ")
        
        if site and username and password:
            self.manager.add_password(site, username, password)
            print(f"✅ Password for {site} saved securely!")
        else:
            print("❌ All fields are required!")

    def _retrieve_password(self):
        """Retrieve a specific password"""
        site = input("\n🌐 Enter website/service name: ")
        result = self.manager.get_password(site)
        
        if result:
            print(f"\n📌 Site: {site}")
            print(f"👤 Username: {result['username']}")
            print(f"🔑 Password: {result['password']}")
            if 'created' in result:
                print(f"📅 Created: {result['created']}")
        else:
            print(f"❌ No password found for '{site}'")

    def _view_all_passwords(self):
        """Display all saved passwords"""
        if not self.manager.passwords:
            print("\n🔍 No passwords saved yet.")
            return
        
        print(f"\n🔐 SAVED PASSWORDS ({len(self.manager.passwords)} total)")
        print("=" * 60)
        
        for site, data in self.manager.passwords.items():
            print(f"📌 {site}")
            print(f"   👤 Username: {data['username']}")
            print(f"   🔑 Password: {data['password']}")
            if 'created' in data:
                print(f"   📅 Created: {data['created']}")
            print()

    def _search_passwords(self):
        """Search for passwords"""
        query = input("\n🔍 Enter search term (site or username): ")
        results = self.manager.search_passwords(query)
        
        if results:
            print(f"\n🔍 SEARCH RESULTS for '{query}' ({len(results)} found)")
            print("=" * 50)
            for site, data in results.items():
                print(f"📌 {site}: {data['username']} | {data['password']}")
        else:
            print(f"❌ No results found for '{query}'")

    def _delete_password(self):
        """Delete a password"""
        site = input("\n🗑️  Enter website/service name to delete: ")
        if self.manager.delete_password(site):
            print(f"✅ Password for '{site}' deleted successfully!")
        else:
            print(f"❌ No password found for '{site}'")

    def _export_passwords(self):
        """Export passwords to file"""
        filename = input("\n📤 Enter export filename (default: passwords_export.json): ") or "passwords_export.json"
        if self.manager.export_passwords(filename):
            print(f"✅ Passwords exported to '{filename}'")
        else:
            print("❌ Failed to export passwords")

# ================================
# GRAPHICAL USER INTERFACE
# ================================

class PasswordManagerGUI:
    """Modern GUI interface for the password manager"""
    
    def __init__(self, root, manager):
        self.manager = manager
        self.root = root
        self.current_theme = self._load_theme()
        
        self._setup_window()
        self._create_widgets()
        
    def _setup_window(self):
        """Configure the main window"""
        self.root.title("🔐 Unified Password Manager")
        self.root.geometry("550x650")
        self.root.resizable(True, True)
        
        # Set minimum size
        self.root.minsize(450, 500)

    def _create_widgets(self):
        """Create all GUI widgets"""
        # Main frame with padding
        main_frame = ttk.Frame(self.root, padding=15)
        main_frame.pack(expand=True, fill="both")

        # Title
        title_label = ttk.Label(
            main_frame, 
            text="🔐 Unified Password Manager", 
            font=("Arial", 18, "bold")
        )
        title_label.pack(pady=(0, 20))

        # Theme toggle (only if ttkbootstrap is available)
        if TTKBOOTSTRAP_AVAILABLE:
            theme_frame = ttk.Frame(main_frame)
            theme_frame.pack(fill="x", pady=(0, 15))
            
            self.theme_button = ttk.Button(
                theme_frame, 
                text="🌗 Toggle Theme", 
                command=self._toggle_theme
            )
            self.theme_button.pack(side="right")

        # Input section
        input_frame = ttk.LabelFrame(main_frame, text="Password Entry", padding=10)
        input_frame.pack(fill="x", pady=(0, 15))

        # Site entry
        ttk.Label(input_frame, text="🌐 Website/Service:").grid(row=0, column=0, sticky="w", padx=(0, 10))
        self.site_entry = ttk.Entry(input_frame, width=40)
        self.site_entry.grid(row=0, column=1, pady=5, sticky="ew")

        # Username entry
        ttk.Label(input_frame, text="👤 Username:").grid(row=1, column=0, sticky="w", padx=(0, 10))
        self.username_entry = ttk.Entry(input_frame, width=40)
        self.username_entry.grid(row=1, column=1, pady=5, sticky="ew")

        # Password entry
        ttk.Label(input_frame, text="🔑 Password:").grid(row=2, column=0, sticky="w", padx=(0, 10))
        self.password_entry = ttk.Entry(input_frame, width=40, show="*")
        self.password_entry.grid(row=2, column=1, pady=5, sticky="ew")

        # Configure grid weights
        input_frame.columnconfigure(1, weight=1)

        # Password generation section
        gen_frame = ttk.LabelFrame(main_frame, text="Password Generation", padding=10)
        gen_frame.pack(fill="x", pady=(0, 15))

        gen_controls = ttk.Frame(gen_frame)
        gen_controls.pack(fill="x")

        ttk.Label(gen_controls, text="Length:").pack(side="left")
        self.length_var = tk.StringVar(value=str(DEFAULT_PASSWORD_LENGTH))
        length_spin = ttk.Spinbox(gen_controls, from_=4, to=128, width=5, textvariable=self.length_var)
        length_spin.pack(side="left", padx=(5, 15))

        self.symbols_var = tk.BooleanVar(value=True)
        symbols_check = ttk.Checkbutton(gen_controls, text="Include Symbols", variable=self.symbols_var)
        symbols_check.pack(side="left", padx=(0, 15))

        generate_btn = ttk.Button(gen_controls, text="🔄 Generate", command=self._generate_password)
        generate_btn.pack(side="right")

        # Action buttons
        button_frame = ttk.Frame(main_frame)
        button_frame.pack(fill="x", pady=(0, 15))

        # Primary actions
        primary_frame = ttk.Frame(button_frame)
        primary_frame.pack(fill="x", pady=(0, 10))

        save_btn = ttk.Button(primary_frame, text="💾 Save Password", command=self._save_password)
        save_btn.pack(side="left", padx=(0, 10))

        retrieve_btn = ttk.Button(primary_frame, text="🔍 Retrieve Password", command=self._retrieve_password)
        retrieve_btn.pack(side="left", padx=(0, 10))

        # Secondary actions
        secondary_frame = ttk.Frame(button_frame)
        secondary_frame.pack(fill="x")

        view_all_btn = ttk.Button(secondary_frame, text="📜 View All", command=self._view_all_passwords)
        view_all_btn.pack(side="left", padx=(0, 10))

        search_btn = ttk.Button(secondary_frame, text="🔍 Search", command=self._search_passwords)
        search_btn.pack(side="left", padx=(0, 10))

        delete_btn = ttk.Button(secondary_frame, text="🗑️ Delete", command=self._delete_password)
        delete_btn.pack(side="left", padx=(0, 10))

        export_btn = ttk.Button(secondary_frame, text="📤 Export", command=self._export_passwords)
        export_btn.pack(side="right")

        # Status section
        status_frame = ttk.LabelFrame(main_frame, text="Status", padding=10)
        status_frame.pack(fill="both", expand=True)

        self.status_text = tk.Text(status_frame, height=8, wrap="word", state="disabled")
        scrollbar = ttk.Scrollbar(status_frame, orient="vertical", command=self.status_text.yview)
        self.status_text.configure(yscrollcommand=scrollbar.set)

        self.status_text.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        # Initial status
        self._log_status(f"🔐 Password Manager ready. {len(self.manager.passwords)} passwords loaded.")

    def _generate_password(self):
        """Generate a new password and insert into entry"""
        try:
            length = int(self.length_var.get())
            include_symbols = self.symbols_var.get()
            password = generate_password(length, include_symbols)
            
            self.password_entry.delete(0, tk.END)
            self.password_entry.insert(0, password)
            
            self._log_status(f"🆕 Generated {length}-character password")
        except ValueError:
            messagebox.showerror("Error", "Invalid password length!")

    def _save_password(self):
        """Save the current password entry"""
        site = self.site_entry.get().strip()
        username = self.username_entry.get().strip()
        password = self.password_entry.get()

        if not all([site, username, password]):
            messagebox.showerror("Error", "Please fill all fields!")
            return

        # Check if site already exists
        existing = self.manager.get_password(site)
        if existing:
            if not messagebox.askyesno("Confirm", f"Password for '{site}' already exists. Overwrite?"):
                return

        if self.manager.add_password(site, username, password):
            messagebox.showinfo("Success", f"✅ Password for '{site}' saved securely!")
            self._clear_entries()
            self._log_status(f"💾 Saved password for {site}")
        else:
            messagebox.showerror("Error", "Failed to save password!")

    def _retrieve_password(self):
        """Retrieve and display password for a site"""
        site = self.site_entry.get().strip()
        if not site:
            messagebox.showerror("Error", "Please enter a website/service name!")
            return

        result = self.manager.get_password(site)
        if result:
            # Fill the form with retrieved data
            self.username_entry.delete(0, tk.END)
            self.username_entry.insert(0, result['username'])
            self.password_entry.delete(0, tk.END)
            self.password_entry.insert(0, result['password'])
            
            # Also show in a message box
            info = f"📌 Site: {site}\n👤 Username: {result['username']}\n🔑 Password: {result['password']}"
            if 'created' in result:
                info += f"\n📅 Created: {result['created']}"
            
            messagebox.showinfo("Password Retrieved", info)
            self._log_status(f"🔍 Retrieved password for {site}")
        else:
            messagebox.showerror("Error", f"No password found for '{site}'")

    def _view_all_passwords(self):
        """Display all saved passwords in a new window"""
        if not self.manager.passwords:
            messagebox.showinfo("Info", "No passwords saved yet!")
            return

        # Create new window
        all_window = tk.Toplevel(self.root)
        all_window.title("All Saved Passwords")
        all_window.geometry("700x500")

        # Create treeview for better display
        frame = ttk.Frame(all_window, padding=10)
        frame.pack(fill="both", expand=True)

        # Treeview with scrollbar
        tree_frame = ttk.Frame(frame)
        tree_frame.pack(fill="both", expand=True)

        columns = ("Site", "Username", "Password", "Created")
        tree = ttk.Treeview(tree_frame, columns=columns, show="headings", height=15)

        # Configure columns
        tree.heading("Site", text="🌐 Site")
        tree.heading("Username", text="👤 Username")
        tree.heading("Password", text="🔑 Password")
        tree.heading("Created", text="📅 Created")

        tree.column("Site", width=150)
        tree.column("Username", width=150)
        tree.column("Password", width=200)
        tree.column("Created", width=150)

        # Add scrollbar
        scrollbar_tree = ttk.Scrollbar(tree_frame, orient="vertical", command=tree.yview)
        tree.configure(yscrollcommand=scrollbar_tree.set)

        # Pack treeview and scrollbar
        tree.pack(side="left", fill="both", expand=True)
        scrollbar_tree.pack(side="right", fill="y")

        # Populate treeview
        for site, data in self.manager.passwords.items():
            created = data.get('created', 'N/A')
            if created != 'N/A' and 'T' in created:
                created = created.split('T')[0]  # Show only date part
            
            tree.insert("", "end", values=(site, data['username'], data['password'], created))

        self._log_status(f"📜 Displayed all {len(self.manager.passwords)} passwords")

    def _search_passwords(self):
        """Search for passwords"""
        query = simpledialog.askstring("Search", "Enter search term (site or username):")
        if not query:
            return

        results = self.manager.search_passwords(query)
        if results:
            result_text = f"🔍 Search results for '{query}':\n\n"
            for site, data in results.items():
                result_text += f"📌 {site}\n   👤 {data['username']} | 🔑 {data['password']}\n\n"
            
            messagebox.showinfo("Search Results", result_text)
            self._log_status(f"🔍 Found {len(results)} results for '{query}'")
        else:
            messagebox.showinfo("Search Results", f"No results found for '{query}'")

    def _delete_password(self):
        """Delete a password"""
        site = self.site_entry.get().strip()
        if not site:
            messagebox.showerror("Error", "Please enter a website/service name!")
            return

        if not messagebox.askyesno("Confirm Delete", f"Are you sure you want to delete the password for '{site}'?"):
            return

        if self.manager.delete_password(site):
            messagebox.showinfo("Success", f"🗑️ Password for '{site}' deleted successfully!")
            self._clear_entries()
            self._log_status(f"🗑️ Deleted password for {site}")
        else:
            messagebox.showerror("Error", f"No password found for '{site}'")

    def _export_passwords(self):
        """Export passwords to a file"""
        from tkinter import filedialog
        
        filename = filedialog.asksaveasfilename(
            defaultextension=".json",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")],
            title="Export Passwords"
        )
        
        if filename:
            if self.manager.export_passwords(filename):
                messagebox.showinfo("Success", f"✅ Passwords exported to '{filename}'")
                self._log_status(f"📤 Exported passwords to {filename}")
            else:
                messagebox.showerror("Error", "Failed to export passwords!")

    def _clear_entries(self):
        """Clear all input fields"""
        self.site_entry.delete(0, tk.END)
        self.username_entry.delete(0, tk.END)
        self.password_entry.delete(0, tk.END)

    def _log_status(self, message):
        """Add a status message to the status text area"""
        self.status_text.config(state="normal")
        self.status_text.insert(tk.END, f"{message}\n")
        self.status_text.see(tk.END)
        self.status_text.config(state="disabled")

    def _load_theme(self):
        """Load theme preference from file"""
        if os.path.exists(THEME_FILE):
            try:
                with open(THEME_FILE, "r") as file:
                    return json.load(file).get("theme", DEFAULT_THEME)
            except:
                pass
        return DEFAULT_THEME

    def _save_theme(self):
        """Save theme preference to file"""
        try:
            with open(THEME_FILE, "w") as file:
                json.dump({"theme": self.current_theme}, file)
        except Exception as e:
            print(f"Failed to save theme: {e}")

    def _toggle_theme(self):
        """Toggle between light and dark themes (ttkbootstrap only)"""
        if not TTKBOOTSTRAP_AVAILABLE:
            messagebox.showinfo("Info", "Theme switching requires ttkbootstrap")
            return
            
        self.current_theme = "litera" if self.current_theme == "darkly" else "darkly"
        self._save_theme()
        
        # Ask user to restart for theme change
        if messagebox.askyesno("Theme Changed", "Restart application to apply new theme?"):
            self.root.destroy()
            start_gui(self.current_theme, self.manager.master_password)

# ================================
# MAIN APPLICATION FUNCTIONS
# ================================

def get_master_password():
    """Prompt for master password"""
    import getpass
    return getpass.getpass("🔑 Enter your master password: ")

def start_cli(master_password):
    """Start the command-line interface"""
    try:
        manager = PasswordManager(master_password)
        cli = PasswordManagerCLI(manager)
        cli.run()
    except Exception as e:
        print(f"❌ Error starting CLI: {e}")

def start_gui(theme=None, master_password=None):
    """Start the graphical user interface"""
    if not master_password:
        # Create a temporary root for the password dialog
        temp_root = tk.Tk()
        temp_root.withdraw()  # Hide the main window
        
        master_password = simpledialog.askstring(
            "🔑 Master Password", 
            "Enter your master password:", 
            show="*"
        )
        temp_root.destroy()
        
        if not master_password:
            print("❌ Master password is required!")
            return

    try:
        manager = PasswordManager(master_password)
        
        # Create root window
        if TTKBOOTSTRAP_AVAILABLE and TtkWindow:
            # Use ttkbootstrap window with theme
            if theme:
                root = TtkWindow(themename=theme)
            else:
                # Load saved theme
                saved_theme = DEFAULT_THEME
                if os.path.exists(THEME_FILE):
                    try:
                        with open(THEME_FILE, "r") as file:
                            saved_theme = json.load(file).get("theme", DEFAULT_THEME)
                    except:
                        pass
                root = TtkWindow(themename=saved_theme)
        else:
            # Use standard tkinter
            root = tk.Tk()
        
        app = PasswordManagerGUI(root, manager)
        root.mainloop()
        
    except Exception as e:
        print(f"❌ Error starting GUI: {e}")
        if 'messagebox' in globals():
            messagebox.showerror("Error", f"Failed to start GUI: {e}")

def main():
    """Main entry point with argument parsing"""
    parser = argparse.ArgumentParser(description="Unified Password Manager")
    parser.add_argument("--cli", action="store_true", help="Start in CLI mode")
    parser.add_argument("--gui", action="store_true", help="Start in GUI mode")
    parser.add_argument("--theme", type=str, help="GUI theme (darkly/litera)")
    
    args = parser.parse_args()
    
    # Print welcome message
    print("🔐 UNIFIED PASSWORD MANAGER")
    print("=" * 50)
    print("Features: Password Generation, Encrypted Storage, CLI & GUI")
    
    # Check for required dependencies
    try:
        from cryptography.fernet import Fernet
    except ImportError:
        print("❌ Missing required dependency: cryptography")
        print("📦 Install with: pip install cryptography")
        return
    
    # Get master password
    if args.cli:
        master_password = get_master_password()
        start_cli(master_password)
    elif args.gui or not any([args.cli, args.gui]):
        # Default to GUI if no mode specified
        start_gui(args.theme)
    else:
        print("❌ Please specify --cli or --gui mode")

if __name__ == "__main__":
    main()