// API Base URL
const API_BASE = '/api';

// State management
let tasks = [];
let currentFilter = 'all';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    await loadTasks();
    setupEventListeners();
    updateStats();
}

// Setup event listeners
function setupEventListeners() {
    // Add task on button click
    document.getElementById('addTaskBtn').addEventListener('click', addTask);

    // Add task on Enter key
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Clear completed tasks
    document.getElementById('clearCompletedBtn').addEventListener('click', clearCompleted);

    // Bin button
    document.getElementById('binBtn').addEventListener('click', openBinModal);
    document.getElementById('closeBinModal').addEventListener('click', closeBinModal);
    document.getElementById('emptyBinBtn').addEventListener('click', emptyBin);

    // Close modal when clicking outside
    document.getElementById('binModal').addEventListener('click', (e) => {
        if (e.target.id === 'binModal') {
            closeBinModal();
        }
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            setFilter(e.target.dataset.filter);
        });
    });

    // Load bin count
    updateBinCount();
}

// Load tasks from API
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE}/tasks`);
        if (response.ok) {
            tasks = await response.json();
            renderTasks();
        } else {
            showNotification('Failed to load tasks', 'error');
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        showNotification('Error connecting to server', 'error');
    }
}

// Add a new task
async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const categorySelect = document.getElementById('categorySelect');

    const taskText = taskInput.value.trim();

    if (!taskText) {
        showNotification('Please enter a task', 'warning');
        return;
    }

    const taskData = {
        task: taskText,
        priority: prioritySelect.value,
        category: categorySelect.value
    };

    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            const newTask = await response.json();
            tasks.push(newTask);

            // Clear inputs
            taskInput.value = '';
            prioritySelect.value = 'medium';
            categorySelect.value = 'general';

            // Update UI
            renderTasks();
            updateStats();
            showNotification('Task added successfully!', 'success');

            // Focus back on input
            taskInput.focus();
        } else {
            showNotification('Failed to add task', 'error');
        }
    } catch (error) {
        console.error('Error adding task:', error);
        showNotification('Error connecting to server', 'error');
    }
}

// Toggle task completion
async function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ done: !task.done })
        });

        if (response.ok) {
            task.done = !task.done;
            renderTasks();
            updateStats();
        } else {
            showNotification('Failed to update task', 'error');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        showNotification('Error connecting to server', 'error');
    }
}

// Delete a task
async function deleteTask(taskId) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            tasks = tasks.filter(t => t.id !== taskId);
            renderTasks();
            updateStats();
            updateBinCount();
            showNotification('Task moved to bin', 'success');
        } else {
            showNotification('Failed to delete task', 'error');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Error connecting to server', 'error');
    }
}

// Clear all completed tasks
async function clearCompleted() {
    try {
        const response = await fetch(`${API_BASE}/tasks/clear-completed`, {
            method: 'DELETE'
        });

        if (response.ok) {
            tasks = tasks.filter(t => !t.done);
            renderTasks();
            updateStats();
            showNotification('Completed tasks cleared', 'success');
        } else {
            showNotification('Failed to clear completed tasks', 'error');
        }
    } catch (error) {
        console.error('Error clearing tasks:', error);
        showNotification('Error connecting to server', 'error');
    }
}

// Set filter
function setFilter(filter) {
    currentFilter = filter;

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    renderTasks();
}

// Render tasks based on current filter
function renderTasks() {
    const tasksContainer = document.getElementById('tasksContainer');

    // Filter tasks
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.done);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.done);
    }

    // Clear container
    tasksContainer.innerHTML = '';

    // Show empty state if no tasks
    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-text">
                    ${currentFilter === 'all' ? 'No tasks yet. Add one to get started!' :
                currentFilter === 'active' ? 'No active tasks. Great job!' :
                    'No completed tasks yet.'}
                </div>
            </div>
        `;
        return;
    }

    // Render each task
    filteredTasks.forEach((task, index) => {
        const taskElement = createTaskElement(task, index);
        tasksContainer.appendChild(taskElement);
    });
}

// Create task element
function createTaskElement(task, index) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task-item ${task.done ? 'completed' : ''}`;
    taskDiv.style.animationDelay = `${index * 0.05}s`;

    const formattedDate = formatDate(task.created_at);

    taskDiv.innerHTML = `
        <div class="checkbox-wrapper">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.done ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            />
        </div>
        <div class="task-content">
            <div class="task-text">${escapeHtml(task.task)}</div>
            <div class="task-meta">
                <span class="task-badge priority-${task.priority}">${task.priority}</span>
                <span class="task-category">📁 ${task.category}</span>
                <span class="task-date">🕒 ${formattedDate}</span>
            </div>
        </div>
        <div class="task-actions">
            <button class="btn-icon btn-delete" onclick="deleteTask(${task.id})" title="Delete task">
                🗑️
            </button>
        </div>
    `;

    return taskDiv;
}

// Update statistics
function updateStats() {
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter(t => !t.done).length;
    const completedTasks = tasks.filter(t => t.done).length;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('activeTasks').textContent = activeTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification (simple toast implementation)
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Remove existing notifications
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
            type === 'error' ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' :
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
