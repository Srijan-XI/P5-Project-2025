/**
 * API Module - LocalStorage-based task management
 * No backend required - all data stored in browser
 */

const STORAGE_KEY = 'taskManagerTasks';

// Get next available ID
function getNextId(tasks) {
    if (tasks.length === 0) return 1;
    return Math.max(...tasks.map(t => t.id)) + 1;
}

const API = {
    /**
     * Fetch all tasks from localStorage
     */
    async getTasks() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }
    },

    /**
     * Create a new task
     */
    async createTask(description, priority = 'medium') {
        try {
            const tasks = await this.getTasks();
            const newTask = {
                id: getNextId(tasks),
                description: description.trim(),
                priority: priority,
                completed: false,
                createdAt: new Date().toISOString()
            };

            tasks.push(newTask);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

            return { success: true, task: newTask };
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    },

    /**
     * Update a task
     */
    async updateTask(id, description, priority = null, completed = null) {
        try {
            const tasks = await this.getTasks();
            const taskIndex = tasks.findIndex(t => t.id === id);

            if (taskIndex === -1) {
                throw new Error('Task not found');
            }

            tasks[taskIndex].description = description.trim();
            if (priority !== null) tasks[taskIndex].priority = priority;
            if (completed !== null) tasks[taskIndex].completed = completed;
            tasks[taskIndex].updatedAt = new Date().toISOString();

            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

            return { success: true, task: tasks[taskIndex] };
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    },

    /**
     * Toggle task completion
     */
    async toggleComplete(id, completed) {
        try {
            const tasks = await this.getTasks();
            const taskIndex = tasks.findIndex(t => t.id === id);

            if (taskIndex === -1) {
                throw new Error('Task not found');
            }

            tasks[taskIndex].completed = completed;
            tasks[taskIndex].updatedAt = new Date().toISOString();

            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

            return { success: true, task: tasks[taskIndex] };
        } catch (error) {
            console.error('Error toggling task:', error);
            throw error;
        }
    },

    /**
     * Delete a task
     */
    async deleteTask(id) {
        try {
            const tasks = await this.getTasks();
            const filteredTasks = tasks.filter(t => t.id !== id);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));

            return { success: true };
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    },

    /**
     * Clear all tasks (for testing/reset)
     */
    async clearAll() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            return { success: true };
        } catch (error) {
            console.error('Error clearing tasks:', error);
            throw error;
        }
    }
};

export default API;
