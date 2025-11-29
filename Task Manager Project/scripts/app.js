document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const emptyState = document.getElementById('empty-state');

    // Modal elements
    const editModal = document.getElementById('edit-modal');
    const editInput = document.getElementById('edit-input');
    const saveEditBtn = document.getElementById('save-edit');
    const cancelEditBtn = document.getElementById('cancel-edit');

    let currentEditId = null;

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
                taskList.innerHTML = '';

                if (!Array.isArray(tasks) || tasks.length === 0) {
                    emptyState.classList.remove('hidden');
                } else {
                    emptyState.classList.add('hidden');
                    tasks.forEach(task => {
                        const li = createTaskElement(task);
                        taskList.appendChild(li);
                    });
                }
            })
            .catch(err => {
                console.error('Error fetching tasks:', err);
                taskList.innerHTML = `<li style="color: #ff7675; text-align: center; padding: 20px;">
                    Error loading tasks. <br> 
                    <small>${err.message}</small>
                </li>`;
            });
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;

        const span = document.createElement('span');
        span.className = 'task-content';
        span.textContent = task.description;

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.innerHTML = '<i class="fas fa-pen"></i>';
        editBtn.onclick = () => openEditModal(task.id, task.description);

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'action-btn delete-btn';
        delBtn.innerHTML = '<i class="fas fa-trash"></i>';
        delBtn.onclick = () => deleteTask(task.id);

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        li.appendChild(span);
        li.appendChild(actions);

        return li;
    }

    // Add Task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = taskInput.value.trim();
        if (!description) return;

        // Hide empty state if it's visible
        emptyState.classList.add('hidden');

        fetch('php/add_task.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description })
        })
            .then(res => {
                if (res.ok) {
                    taskInput.value = '';
                    fetchTasks(); // Refresh to get real ID and state
                }
            })
            .catch(err => console.error('Error adding task:', err));
    });

    // Edit Modal Logic
    function openEditModal(id, currentDesc) {
        currentEditId = id;
        editInput.value = currentDesc;
        editModal.classList.remove('hidden');
        // Small delay to allow display:block to apply before adding active class for transition
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
        }, 300); // Match transition duration
    }

    saveEditBtn.addEventListener('click', () => {
        const newDesc = editInput.value.trim();
        if (newDesc && currentEditId) {
            fetch('php/update_task.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: currentEditId, description: newDesc })
            })
                .then(() => {
                    fetchTasks();
                    closeEditModal();
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

    // Delete Task
    function deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            // Animate removal
            const item = document.querySelector(`li[data-id="${id}"]`);
            if (item) {
                item.style.opacity = '0';
                item.style.transform = 'translateX(20px)';
            }

            fetch('php/delete_task.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
                .then(() => {
                    setTimeout(fetchTasks, 300); // Wait for animation
                });
        }
    }

    // Initial fetch
    fetchTasks();
});
