# TaskFlow - Premium To-Do List Application

A beautiful, modern to-do list web application built with HTML, CSS, JavaScript, and Python (Flask).

## ✨ Features

- 🎨 **Premium Dark Theme** - Stunning gradient-based design with glassmorphism effects
- ⚡ **Real-time Updates** - Instant task management with smooth animations
- 📊 **Statistics Dashboard** - Track your productivity at a glance
- 🏷️ **Task Categories** - Organize tasks by category (Work, Personal, Shopping, etc.)
- 🎯 **Priority Levels** - Set task priorities (High, Medium, Low)
- 🔍 **Smart Filtering** - View all, active, or completed tasks
- 💾 **Data Persistence** - All tasks are saved to a JSON file
- 📱 **Responsive Design** - Works beautifully on all devices
- 🎭 **Smooth Animations** - Delightful micro-interactions throughout

## 🛠️ Tech Stack

- **Frontend:**
  - HTML5 - Semantic structure
  - CSS3 - Modern styling with gradients, animations, and glassmorphism
  - JavaScript (ES6+) - Async/await API calls and dynamic UI

- **Backend:**
  - Python 3.x
  - Flask - Web framework
  - Flask-CORS - Cross-origin resource sharing

- **Data Storage:**
  - JSON - Lightweight file-based storage

## 📁 Project Structure

```
To-do-list/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── tasks.json            # Task storage (auto-generated)
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── style.css         # Stylesheet
│   └── script.js         # JavaScript logic
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd "p:\CODE-XI\P5-Project-2025\To-do-list"
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```bash
   python app.py
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:5000
   ```

## 📖 Usage

### Adding Tasks
1. Enter your task in the input field
2. Select priority level (High, Medium, or Low)
3. Choose a category
4. Click "Add Task" or press Enter

### Managing Tasks
- **Complete a task:** Click the checkbox
- **Delete a task:** Click the trash icon
- **Filter tasks:** Use the filter buttons (All, Active, Completed)
- **Clear completed:** Click "Clear Completed" to remove all done tasks

### Task Categories
- 📁 General
- 💼 Work
- 👤 Personal
- 🛒 Shopping
- 🏥 Health
- 📚 Study

## 🎨 Design Philosophy

This application follows modern web design principles:
- **Dark theme** for reduced eye strain
- **Gradient accents** for visual appeal
- **Smooth animations** for better UX
- **Glassmorphism** for depth and sophistication
- **Responsive layout** for all screen sizes

## 🔌 API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/<id>` - Update a task
- `DELETE /api/tasks/<id>` - Delete a task
- `DELETE /api/tasks/clear-completed` - Clear all completed tasks

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created with ❤️ by Srijan

---

**Enjoy organizing your tasks with TaskFlow!** ✨
