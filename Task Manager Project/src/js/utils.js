/**
 * Utils Module - Utility functions
 */

const MAX_LENGTH = 500;

const Utils = {
    MAX_LENGTH,

    /**
     * Update character counter display
     */
    updateCharCounter(input, counter) {
        const length = input.value.length;
        const remaining = MAX_LENGTH - length;
        counter.textContent = `${length}/${MAX_LENGTH}`;

        if (remaining < 50) {
            counter.style.color = '#ff7675';
        } else if (remaining < 100) {
            counter.style.color = '#ffeaa7';
        } else {
            counter.style.color = 'var(--text-secondary)';
        }
    },

    /**
     * Validate task description
     */
    validateTask(description) {
        if (!description || description.trim().length === 0) {
            return { valid: false, error: 'Please enter a task description' };
        }

        if (description.length > MAX_LENGTH) {
            return { valid: false, error: `Task too long (max ${MAX_LENGTH} characters)` };
        }

        return { valid: true };
    },

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    /**
     * Get priority icon and label
     */
    getPriorityInfo(priority) {
        const icons = { high: '🔴', medium: '🟡', low: '🟢' };
        const labels = { high: 'High', medium: 'Medium', low: 'Low' };
        return {
            icon: icons[priority] || icons.medium,
            label: labels[priority] || labels.medium
        };
    }
};

export default Utils;
