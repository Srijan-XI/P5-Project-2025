# Task Manager ✅

> **STATUS: ✅ FULLY OPERATIONAL** - All systems upgraded and working!

A modern, secure, and feature-rich task management application with a beautiful glassmorphic UI.

## 🎉 Quick Start

```bash
cd "P:\CODE-XI\P5-Project-2025\Task Manager Project"
.\start.bat
```

That's it! Your browser will open automatically to http://localhost:8000

## ✨ Features

- ✅ **Task Management**: Create, read, update, and delete tasks
- ✅ **Task Priorities**: Assign High/Medium/Low priorities with color coding (NEW! 🎉)
- ✅ **Priority Filters**: Filter tasks by priority level
- ✅ **Task Completion**: Mark tasks as complete with checkboxes and strikethrough
- ✅ **Status Filters**: Filter by All/Active/Completed tasks
- ✅ **Real-time Validation**: Character counter (0/500) and input validation
- ✅ **Loading States**: Beautiful loading spinner for async operations
- ✅ **Toast Notifications**: User-friendly success/error messages
- ✅ **Secure Database**: SQLite with prepared statements and indexes
- ✅ **Input Sanitization**: XSS protection and data validation
- ✅ **Error Handling**: Comprehensive error handling throughout
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Accessibility**: ARIA labels, keyboard navigation, focus states
- ✅ **Smooth Animations**: Micro-interactions and transitions

## 🚀 Technologies

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styles with glassmorphism
- **Vanilla JavaScript** - No frameworks, pure JS
- **Google Fonts** - Outfit font family
- **Font Awesome** - Icons

### Backend
- **PHP 8.0+** - Server-side logic
- **SQLite 3** - Lightweight database
- **PDO/SQLite3** - Prepared statements for security

## 📦 Installation

### Prerequisites
- PHP 8.0 or higher with SQLite extension
- Web server (Apache, Nginx, or PHP built-in server)
- Modern web browser

### Setup Instructions

1. **Clone or download** this project to your local machine

2. **Check PHP and SQLite**:
   ```bash
   php -v
   php -m | grep sqlite
   ```

3. **Migrate existing data** (if you have tasks.json):
   ```bash
   cd "P:\CODE-XI\P5-Project-2025\Task Manager Project\php"
   php migrate.php
   ```

4. **Start the PHP server**:
   ```bash
   cd "P:\CODE-XI\P5-Project-2025\Task Manager Project"
   php -S localhost:8000
   ```

5. **Open in browser**:
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
Task Manager Project/
├── index.html              # Main HTML file
├── db/
│   ├── tasks.db           # SQLite database (auto-created)
│   └── tasks.json         # Old JSON storage (deprecated)
├── php/
│   ├── config.php         # Configuration & security headers
│   ├── Database.php       # Database class with ORM-like methods
│   ├── db.php            # Get all tasks endpoint
│   ├── add_task.php      # Create new task endpoint
│   ├── update_task.php   # Update/complete task endpoint
│   ├── delete_task.php   # Delete task endpoint
│   └── migrate.php       # JSON to SQLite migration script
├── scripts/
│   └── app.js            # Frontend JavaScript logic
├── styles/
│   └── main.css          # All CSS styles
└── start.bat             # Quick start script (Windows)
```

## 🔒 Security Features

1. **Input Sanitization**:
   - HTML special characters escaped
   - Strip tags to prevent HTML injection
   - Maximum length validation (500 characters)

2. **Prepared Statements**:
   - All SQL queries use parameterized statements
   - Protection against SQL injection

3. **Security Headers**:
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection: 1; mode=block

4. **Error Handling**:
   - Errors logged, not displayed to users
   - Graceful degradation
   - User-friendly error messages

5. **Database Security**:
   - WAL mode for better concurrency
   - File locking mechanisms
   - Proper transaction handling

## 🎨 UI/UX Features

### Glassmorphism Design
- Frosted glass effect with backdrop blur
- Smooth gradients and color palette
- Modern dark theme

### Micro-animations
- Hover effects on buttons
- Slide-in animations for tasks
- Smooth transitions
- Loading spinners

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators
- High contrast ratios

## 🔧 API Endpoints

### GET `/php/db.php`
Get all tasks (sorted by newest first)

**Response**:
```json
[
  {
    "id": 1,
    "description": "Complete project documentation",
    "completed": false,
    "priority": "high",
    "created_at": "2025-12-14 18:20:00",
    "updated_at": "2025-12-14 18:20:00"
  }
]
```

### POST `/php/add_task.php`
Create a new task

**Request**:
```json
{
  "description": "New task description",
  "priority": "medium"
}
```

**Response**:
```json
{
  "success": true,
  "id": 2
}
```

### POST `/php/update_task.php`
Update or toggle task completion

**Request (Update)**:
```json
{
  "id": 1,
  "description": "Updated description",
  "priority": "high"
}
```

**Request (Toggle Completion)**:
```json
{
  "id": 1,
  "completed": true
}
```

### POST `/php/delete_task.php`
Delete a task

**Request**:
```json
{
  "id": 1
}
```

## 🐛 Troubleshooting

### Database Issues
If you encounter database errors:
```bash
# Delete and recreate database
rm db/tasks.db
# Refresh the page - database will auto-create
```

### PHP SQLite Extension Missing
```bash
# Windows (uncomment in php.ini)
extension=sqlite3

# Linux/Mac
sudo apt-get install php-sqlite3
```

### Permission Issues
```bash
# Ensure db directory is writable
chmod 755 db/
```

## 📝 Future Enhancements

- [ ] Priority filtering (high/medium/low)
- [ ] Due dates and reminders
- [ ] Task categories/tags
- [ ] Search functionality
- [ ] Drag-and-drop reordering
- [ ] Export tasks (CSV/JSON)
- [ ] User authentication
- [ ] Dark/Light mode toggle
- [ ] Progressive Web App (PWA)
- [ ] Browser notifications

## 📄 License

This project is free to use for educational purposes.

## 👨‍💻 Author

Created for P5 Project 2025

---

## 🎯 Quick Start Commands

### Windows (using start.bat)
```batch
start.bat
```

### Manual Start
```bash
cd "P:\CODE-XI\P5-Project-2025\Task Manager Project"
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

---

**Enjoy managing your tasks! 🎉**
