/**
 * Filters Module - Handle task filtering logic
 */

const Filters = {
    currentStatusFilter: 'all',
    currentPriorityFilter: 'all',
    allTasks: [],

    /**
     * Initialize filter buttons
     */
    init(statusButtons, priorityButtons, onFilterChange) {
        // Status filter buttons
        statusButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                statusButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentStatusFilter = btn.dataset.filter;
                onFilterChange();
            });
        });

        // Priority filter buttons
        priorityButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                priorityButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentPriorityFilter = btn.dataset.priority;
                onFilterChange();
            });
        });
    },

    /**
     * Set all tasks
     */
    setTasks(tasks) {
        this.allTasks = tasks;
    },

    /**
     * Get filtered tasks based on current filters
     */
    getFilteredTasks() {
        let filtered = [...this.allTasks];

        // Apply status filter
        if (this.currentStatusFilter === 'active') {
            filtered = filtered.filter(t => !t.completed);
        } else if (this.currentStatusFilter === 'completed') {
            filtered = filtered.filter(t => t.completed);
        }

        // Apply priority filter
        if (this.currentPriorityFilter !== 'all') {
            filtered = filtered.filter(t => t.priority === this.currentPriorityFilter);
        }

        return filtered;
    },

    /**
     * Reset all filters
     */
    reset() {
        this.currentStatusFilter = 'all';
        this.currentPriorityFilter = 'all';
    }
};

export default Filters;
