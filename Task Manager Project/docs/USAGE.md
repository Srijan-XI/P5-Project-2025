# Task Manager - User Guide

## 🚀 Getting Started

### Starting the Application

1. Open Command Prompt or PowerShell
2. Navigate to the project folder:
   ```bash
   cd "P:\CODE-XI\P5-Project-2025\Task Manager Project"
   ```
3. Run the start script:
   ```bash
   .\start.bat
   ```
4. Your browser will automatically open to http://localhost:8000

### Stopping the Application

Press `Ctrl+C` in the terminal, then press `Y` to confirm stopping the server.

---

## 📝 Managing Tasks

### Adding a New Task

1. **Type** your task in the input field at the top
2. **Watch** the character counter update (e.g., "25/500")
3. **Click** the purple ➕ button or press `Enter`
4. **See** the success notification: "Task added successfully!"
5. Your task appears at the top of the list

**Tips:**
- Maximum 500 characters per task
- Counter turns yellow when you have 50-100 characters remaining
- Counter turns red when you have less than 50 characters remaining

### Completing a Task

1. **Click** the checkbox ☐ next to any task
2. The task gets a strikethrough and fades slightly
3. Task is automatically saved as completed
4. **Click again** to mark it incomplete

### Editing a Task

1. **Click** the ✏️ (edit) icon on the right side of any task
2. A modal dialog opens with the current task text
3. **Modify** the text as needed
4. **Click** "Save Changes" or press `Enter`
5. **Click** "Cancel" or press `Escape` to discard changes
6. See confirmation: "Task updated successfully!"

### Deleting a Task

1. **Click** the 🗑️ (trash) icon on the right side of any task
2. **Confirm** the deletion in the popup dialog
3. Task smoothly slides out and disappears
4. See confirmation: "Task deleted"

**Note:** Deletions are permanent and cannot be undone!

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Add task / Save edit |
| `Escape` | Close edit modal |
| `Tab` | Navigate between elements |
| `Space` | Toggle checkbox (when focused) |

---

## 🎨 Understanding the Interface

### Main Screen Elements

```
┌─────────────────────────────────────────┐
│         Task Manager                     │
│   Organize your day efficiently         │
├─────────────────────────────────────────┤
│  [What needs to be done?        ] [+]   │
│  0/500                                   │  ← Character counter
├─────────────────────────────────────────┤
│  ☑ Buy groceries            [✏️] [🗑️]   │  ← Completed task
│  ☐ Finish project report    [✏️] [🗑️]   │  ← Active task
│  ☐ Call dentist             [✏️] [🗑️]   │  ← Active task
└─────────────────────────────────────────┘
```

### Visual Indicators

- **Checkbox (☐/☑)**: Click to toggle task completion
- **Strikethrough text**: Indicates completed task
- **Faded appearance**: Completed tasks have reduced opacity
- **Hover effects**: Elements highlight when you mouse over them
- **Edit button (✏️)**: Opens edit modal
- **Delete button (🗑️)**: Deletes the task after confirmation

### Notifications

**Success (Green border):**
- "Task added successfully!"
- "Task updated successfully!"
- "Task deleted"

**Error (Red border):**
- "Failed to add task"
- "Task description cannot be empty"
- "Failed to load tasks"

---

## 💡 Tips for Effective Use

### Organization Tips

1. **Be Specific**: Write clear, actionable task descriptions
2. **Prioritize**: Add important tasks first (they appear at the top)
3. **Complete Regularly**: Check off tasks as you finish them
4. **Review Daily**: Start each day by reviewing your task list
5. **Keep It Current**: Delete or complete old tasks

### Productivity Tricks

- **Quick Entry**: Use `Enter` key to rapidly add multiple tasks
- **Batch Similar Tasks**: Group related tasks together
- **Time Estimates**: Include time estimates in descriptions (e.g., "Review report - 30min")
- **Context Tags**: Add tags like [Work], [Personal], [Urgent] in descriptions
- **Morning Ritual**: Review and add tasks every morning

### Examples of Good Task Descriptions

✅ Good:
- "Email John about quarterly report by 3 PM"
- "Buy milk, eggs, and bread from supermarket"
- "Review and approve design mockups"

❌ Less Effective:
- "Email" (too vague)
- "Shopping" (not specific enough)
- "Work stuff" (unclear action)

---

## 🎯 Common Scenarios

### Scenario 1: Daily To-Do List

```
Morning:
1. Add your daily tasks
2. Check off items as you complete them
3. Add new tasks as they come up

Evening:
1. Review what was completed
2. Delete finished tasks
3. Plan tomorrow's tasks
```

### Scenario 2: Project Tracking

```
1. Create tasks for each project milestone
2. Use detailed descriptions with deadlines
3. Mark tasks complete as milestones are met
4. Add new subtasks as needed
```

### Scenario 3: Shopping List

```
1. Add items as you think of them
2. Check them off as you shop
3. Delete the list when shopping is done
4. Start a new list for next time
```

---

## 🔍 Troubleshooting

### "Failed to load tasks" Error

**Cause:** Server or database issue

**Solution:**
1. Check that the server is running (look at the terminal)
2. Refresh the browser page (F5)
3. Restart the server (`Ctrl+C`, then `.\start.bat`)

### Task Not Saving

**Cause:** Connection or validation issue

**Solution:**
1. Check that the task description isn't empty
2. Verify it's under 500 characters
3. Look at the error toast for specific message
4. Try again

### Character Counter Not Updating

**Cause:** Page needs refresh

**Solution:**
1. Refresh the page (F5)
2. Clear browser cache if issue persists

### Edit Modal Won't Close

**Solution:**
1. Press `Escape` key
2. Click the "Cancel" button
3. Click outside the modal on the dark background

---

## 📊 Data Management

### Your Data Location

All tasks are stored in:
```
P:\CODE-XI\P5-Project-2025\Task Manager Project\db\tasks.db
```

### Backup Your Tasks

**Automatic Backup:**
When you first started the upgraded version, your old tasks were backed up to:
```
db/tasks.json.backup.2025-12-14_183738
```

**Manual Backup:**
```bash
# Copy the database file
copy db\tasks.db db\tasks.db.backup
```

### Restore from Backup

```bash
# Stop the server first (Ctrl+C)
# Copy backup over current database
copy db\tasks.db.backup db\tasks.db
# Restart server
.\start.bat
```

---

## 🎨 Accessibility Features

### Screen Reader Support
- All buttons have descriptive ARIA labels
- Task completion status is announced
- Proper heading hierarchy

### Keyboard Navigation
- Tab through all interactive elements
- Enter to submit forms
- Escape to close dialogs
- Space to toggle checkboxes

### Visual Accessibility
- High contrast colors
- Clear focus indicators
- Large clickable areas
- Readable font sizes

---

## 🌐 Browser Compatibility

**Fully Supported:**
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Features Used:**
- CSS Grid & Flexbox
- CSS Custom Properties
- ES6 JavaScript
- Fetch API
- Glassmorphism effects

---

## ⚙️ Advanced Usage

### Using on Mobile/Tablet

The application is responsive and works on mobile devices:

1. Get your computer's local IP address:
   ```bash
   ipconfig
   # Look for "IPv4 Address"
   ```

2. Start the server:
   ```bash
   .\start.bat
   ```

3. On your mobile device, navigate to:
   ```
   http://[YOUR-IP]:8000
   ```
   (e.g., http://192.168.1.100:8000)

**Note:** Both devices must be on the same network

### Custom Port

To use a different port:

```bash
# Stop the server
# Edit start.bat and change 8000 to your preferred port
# Or run manually:
php -S localhost:8080
```

---

## 📞 Getting Help

### Check Documentation
- **README.md** - Installation guide
- **SUCCESS.md** - Setup success and features
- **IMPLEMENTATION.md** - Technical details
- **SETUP_GUIDE.md** - SQLite setup

### Common Issues
See the Troubleshooting section above

---

## 🎉 Tips Summary

**For Best Experience:**
✅ Use keyboard shortcuts for speed
✅ Keep task descriptions clear and specific
✅ Complete tasks regularly
✅ Review your list daily
✅ Back up your database periodically

**Enjoy managing your tasks! 📝✨**
