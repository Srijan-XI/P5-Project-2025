/**
 * API Module - Handles all server communication
 */

const API = {
    /**
     * Fetch all tasks from server
     */
    async getTasks() {
        try {
            const response = await fetch('php/db.php');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Received non-JSON response from server. Ensure PHP is running.");
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    /**
     * Create a new task
     */
    async createTask(description, priority = 'medium') {
        try {
            const response = await fetch('php/add_task.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, priority })
            });

            if (!response.ok) {
                throw new Error('Failed to add task');
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.message || 'Failed to add task');
            }

            return data;
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
            const payload = { id, description };
            if (priority !== null) payload.priority = priority;
            if (completed !== null) payload.completed = completed;

            const response = await fetch('php/update_task.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.message || 'Failed to update task');
            }

            return data;
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
            const response = await fetch('php/update_task.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, completed })
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            return await response.json();
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
            const response = await fetch('php/delete_task.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.message || 'Failed to delete task');
            }

            return data;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
};

export default API;
