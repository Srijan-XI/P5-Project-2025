document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const emptyState = document.getElementById('empty-state');
    const charCounter = document.getElementById('char-counter');
    const prioritySelect = document.getElementById('priority-select');

    // Modal elements
    const editModal = document.getElementById('edit-modal');
    const editInput = document.getElementById('edit-input');
    const editPrioritySelect = document.getElementById('edit-priority-select');
    const saveEditBtn = document.getElementById('save-edit');
    const cancelEditBtn = document.getElementById('cancel-edit');

    // Filter elements
    const filterBtns = document.querySelectorAll('.filter-btn');
    const priorityFilterBtns = document.querySelectorAll('.priority-filter-btn');

    let currentEditId = null;
    let currentEditPriority = 'medium';
    let isLoading = false;
    let allTasks = [];
    let currentFilter = 'all';
    let currentPriorityFilter = 'all';

    const MAX_LENGTH = 500;

    // Update character counter
    function updateCharCounter(input, counter) {
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
    }

    // Character counter for main input
    taskInput.addEventListener('input', () => {
        updateCharCounter(taskInput, charCounter);
    });

    // Show loading state
    function showLoading() {
        isLoading = true;
        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.id = 'loading-overlay';
        loader.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loader);
    }

    function hideLoading() {
        isLoading = false;
        const loader = document.getElementById('loading-overlay');
        if (loader) loader.remove();
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Fetch and display tasks
    function fetchTasks() {
        fetch('php/db.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Received non-JSON response from server. Ensure PHP is running.");
                }
                return response.json();
            })
            .then(tasks => {
                allTasks = tasks;
                applyFilters();
            })
            .catch(err => {
                console.error('Error fetching tasks:', err);
                taskList.innerHTML = `<li style="color: #ff7675; text-align: center; padding: 20px;">
                    Error loading tasks. <br> 
                    <small>${err.message}</small>
                </li>`;
                showToast('Failed to load tasks', 'error');
            });
    }

    // Apply current filters
    function applyFilters() {
        let filteredTasks = allTasks;

        // Apply completion filter
        if (currentFilter === 'active') {
            filteredTasks = filteredTasks.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = filteredTasks.filter(t => t.completed);
        }

        // Apply priority filter
        if (currentPriorityFilter !== 'all') {
            filteredTasks = filteredTasks.filter(t => t.priority === currentPriorityFilter);
        }

        // Display filtered tasks
        taskList.innerHTML = '';
        if (filteredTasks.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            filteredTasks.forEach(task => {
                const li = createTaskElement(task);
                taskList.appendChild(li);
            });
        }
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item priority-' + task.priority;
        if (task.completed) {
            li.classList.add('completed');
        }
        li.dataset.id = task.id;

        // Checkbox for completion
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.onchange = () => toggleComplete(task.id, checkbox.checked);

        const span = document.createElement('span');
        span.className = 'task-content';

        // Add priority badge
        const priorityBadge = document.createElement('span');
        priorityBadge.className = 'priority-badge priority-badge-' + task.priority;
        const priorityIcons = { high: '🔴', medium: '🟡', low: '🟢' };
        const priorityLabels = { high: 'High', medium: 'Medium', low: 'Low' };
        priorityBadge.textContent = priorityIcons[task.priority] + ' ' + priorityLabels[task.priority];

        span.appendChild(priorityBadge);
        span.appendChild(document.createTextNode(' ' + task.description));

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.innerHTML = '<i class="fas fa-pen"></i>';
        editBtn.setAttribute('aria-label', 'Edit task');
        editBtn.onclick = () => openEditModal(task.id, task.description);

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'action-btn delete-btn';
        delBtn.innerHTML = '<i class="fas fa-trash"></i>';
        delBtn.setAttribute('aria-label', 'Delete task');
        delBtn.onclick = () => deleteTask(task.id);

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(actions);

        return li;
    }

    // Toggle task completion
    function toggleComplete(id, completed) {
        const item = document.querySelector(`li[data-id="${id}"]`);

        // Optimistic update
        if (item) {
            if (completed) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
        }

        fetch('php/update_task.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, completed })
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to update task');
                return res.json();
            })
            .catch(err => {
                console.error('Error toggling task:', err);
                // Revert on error
                if (item) {
                    if (completed) {
                        item.classList.remove('completed');
                    } else {
                        item.classList.add('completed');
                    }
                    const checkbox = item.querySelector('.task-checkbox');
                    if (checkbox) checkbox.checked = !completed;
                }
                showToast('Failed to update task', 'error');
            });
    }

    // Add Task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = taskInput.value.trim();

        if (!description) {
            showToast('Please enter a task description', 'error');
            return;
        }

        if (description.length > MAX_LENGTH) {
            showToast(`Task too long (max ${MAX_LENGTH} characters)`, 'error');
            return;
        }

        if (isLoading) return;

        // Hide empty state if it's visible
        emptyState.classList.add('hidden');

        showLoading();

        const priority = prioritySelect.value;

        fetch('php/add_task.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, priority })
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to add task');
                return res.json();
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.message || 'Failed to add task');
                }
                taskInput.value = '';
                prioritySelect.value = 'medium';
                updateCharCounter(taskInput, charCounter);
                fetchTasks();
                showToast('Task added successfully!', 'success');
            })
            .catch(err => {
                console.error('Error adding task:', err);
                showToast(err.message || 'Failed to add task', 'error');
            })
            .finally(() => {
                hideLoading();
            });
    });

    // Edit Modal Logic
    function openEditModal(id, currentDesc) {
        currentEditId = id;
        const task = allTasks.find(t => t.id === id);
        currentEditPriority = task ? task.priority : 'medium';

        editInput.value = currentDesc;
        editPrioritySelect.value = currentEditPriority;
        editModal.classList.remove('hidden');
        setTimeout(() => {
            editModal.classList.add('active');
            editInput.focus();
        }, 10);
    }

    function closeEditModal() {
        editModal.classList.remove('active');
        setTimeout(() => {
            editModal.classList.add('hidden');
            currentEditId = null;
            editInput.value = '';
        }, 300);
    }

    saveEditBtn.addEventListener('click', () => {
        const newDesc = editInput.value.trim();

        if (!newDesc) {
            showToast('Task description cannot be empty', 'error');
            return;
        }

        if (newDesc.length > MAX_LENGTH) {
            showToast(`Task too long (max ${MAX_LENGTH} characters)`, 'error');
            return;
        }

        if (currentEditId) {
            showLoading();
            const newPriority = editPrioritySelect.value;

            fetch('php/update_task.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: currentEditId, description: newDesc, priority: newPriority })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to update task');
                    return res.json();
                })
                .then(data => {
                    if (data.error) {
                        throw new Error(data.message || 'Failed to update task');
                    }
                    fetchTasks();
                    closeEditModal();
                    showToast('Task updated successfully!', 'success');
                })
                .catch(err => {
                    console.error('Error updating task:', err);
                    showToast(err.message || 'Failed to update task', 'error');
                })
                .finally(() => {
                    hideLoading();
                });
        }
    });

    cancelEditBtn.addEventListener('click', closeEditModal);

    // Close modal on outside click
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !editModal.classList.contains('hidden')) {
            closeEditModal();
        }
    });

    // Delete Task
    function deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            const item = document.querySelector(`li[data-id="${id}"]`);

            // Animate removal
            if (item) {
                item.style.opacity = '0';
                item.style.transform = 'translateX(20px)';
            }

            showLoading();

            fetch('php/delete_task.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to delete task');
                    return res.json();
                })
                .then(data => {
                    if (data.error) {
                        throw new Error(data.message || 'Failed to delete task');
                    }
                    setTimeout(() => {
                        fetchTasks();
                        showToast('Task deleted', 'success');
                    }, 300);
                })
                .catch(err => {
                    console.error('Error deleting task:', err);
                    if (item) {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }
                    showToast(err.message || 'Failed to delete task', 'error');
                })
                .finally(() => {
                    hideLoading();
                });
        }
    }

    // Filter button handlers
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            applyFilters();
        });
    });

    priorityFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            priorityFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPriorityFilter = btn.dataset.priority;
            applyFilters();
        });
    });

    // Initial fetch
    fetchTasks();
});
