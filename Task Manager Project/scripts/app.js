document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');

    // Fetch and display tasks
    function fetchTasks() {
        fetch('php/db.php')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const li = document.createElement('li');
                    li.className = 'task-item';
                    li.dataset.id = task.id;

                    const span = document.createElement('span');
                    span.textContent = task.description;

                    const actions = document.createElement('div');
                    actions.className = 'task-actions';

                    // Edit button
                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Edit';
                    editBtn.className = 'edit-btn';
                    editBtn.onclick = () => editTask(task.id, task.description);

                    // Delete button
                    const delBtn = document.createElement('button');
                    delBtn.textContent = 'Delete';
                    delBtn.onclick = () => deleteTask(task.id);

                    actions.appendChild(editBtn);
                    actions.appendChild(delBtn);

                    li.appendChild(span);
                    li.appendChild(actions);

                    taskList.appendChild(li);
                });
            });
    }

    // Add Task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = taskInput.value.trim();
        if (!description) return;

        fetch('php/add_task.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({description})
        })
        .then(() => {
            taskInput.value = '';
            fetchTasks();
        });
    });

    // Edit Task
    function editTask(id, oldDesc) {
        const newDesc = prompt('Edit task:', oldDesc);
        if (newDesc && newDesc.trim() !== '') {
            fetch('php/update_task.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id, description: newDesc})
            })
            .then(fetchTasks);
        }
    }

    // Delete Task
    function deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            fetch('php/delete_task.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id})
            })
            .then(fetchTasks);
        }
    }

    fetchTasks();
});
