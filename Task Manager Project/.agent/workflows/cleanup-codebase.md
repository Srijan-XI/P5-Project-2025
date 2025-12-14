---
description: Cleanup Codebase - Remove Legacy Files and Fix Structure
---

# Codebase Cleanup Workflow

This workflow will clean up the Task Manager Project by removing legacy files and fixing the directory structure.

## Issues Identified

1. **Duplicate Legacy Files**: `scripts/` and `styles/` folders contain old monolithic code not used by `index.html`
2. **Empty PHP Directories**: `src/php/config/`, `src/php/models/`, `src/php/api/tasks/` are empty placeholders
3. **README Documentation Mismatch**: README references old structure

## Cleanup Steps

### Step 1: Backup Current Working State
Before making changes, ensure the current working code is backed up.

### Step 2: Remove Legacy Script and Style Directories
These folders contain old code that has been replaced by the modular structure in `src/`:

```powershell
# Remove old scripts folder
Remove-Item -Path "P:\CODE-XI\P5-Project-2025\Task Manager Project\scripts" -Recurse -Force

# Remove old styles folder
Remove-Item -Path "P:\CODE-XI\P5-Project-2025\Task Manager Project\styles" -Recurse -Force
```

### Step 3: Remove Empty PHP Directories
These empty directories in `src/php/` serve no purpose:

```powershell
# Remove empty PHP subdirectories
Remove-Item -Path "P:\CODE-XI\P5-Project-2025\Task Manager Project\src\php" -Recurse -Force
```

### Step 4: Update README.md
Update the README to reflect the correct project structure:
- Remove references to `scripts/app.js` and `styles/main.css`
- Update structure diagram to show `src/js/` and `src/css/` with modular files
- Update structure to show `php/` (not `src/php/`)

### Step 5: Verify Application Still Works
After cleanup:
1. Start the PHP server: `php -S localhost:8000`
2. Open browser to `http://localhost:8000`
3. Test all functionality:
   - Add tasks
   - Edit tasks
   - Delete tasks
   - Filter by status
   - Filter by priority
   - Character counter
   - Loading states
   - Toast notifications

## Expected Outcome

After cleanup, the structure will be:
```
Task Manager Project/
├── index.html              # Main HTML file
├── db/                     # Database directory
│   └── tasks.db           # SQLite database
├── php/                    # Backend PHP files (ACTIVE)
│   ├── config.php
│   ├── Database.php
│   ├── db.php
│   ├── add_task.php
│   ├── update_task.php
│   ├── delete_task.php
│   └── migrate.php
├── src/                    # Frontend source files
│   ├── css/               # Modular CSS (8 files)
│   │   ├── main.css       # Entry point
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── tasks.css
│   │   ├── filters.css
│   │   ├── modal.css
│   │   └── animations.css
│   └── js/                # Modular JavaScript (9 files)
│       ├── main.js        # Entry point
│       ├── api.js
│       ├── filters.js
│       ├── loading.js
│       ├── modal.js
│       ├── notifications.js
│       ├── tasks.js
│       ├── ui.js
│       └── utils.js
└── start.bat              # Quick start script
```

## Safety Notes

- The `scripts/` and `styles/` folders are NOT referenced anywhere in `index.html`
- All active code is in `src/js/` and `src/css/`
- Backend PHP files are in root `php/` directory
- This cleanup is safe and will not break functionality
