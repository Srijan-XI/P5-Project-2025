
// ============ BIN FUNCTIONALITY ============

// Update bin count
async function updateBinCount() {
    try {
        const response = await fetch(`${API_BASE}/bin`);
        if (response.ok) {
            const binTasks = await response.json();
            document.getElementById('binCount').textContent = binTasks.length;
        }
    } catch (error) {
        console.error('Error loading bin count:', error);
    }
}

// Open bin modal
async function openBinModal() {
    const modal = document.getElementById('binModal');
    modal.classList.add('show');
    await loadBinTasks();
}

// Close bin modal
function closeBinModal() {
    const modal = document.getElementById('binModal');
    modal.classList.remove('show');
}

// Load bin tasks
async function loadBinTasks() {
    try {
        const response = await fetch(`${API_BASE}/bin`);
        if (response.ok) {
            const binTasks = await response.json();
            renderBinTasks(binTasks);
        } else {
            showNotification('Failed to load bin', 'error');
        }
    } catch (error) {
        console.error('Error loading bin:', error);
        showNotification('Error connecting to server', 'error');
    }
}

// Render bin tasks
function renderBinTasks(binTasks) {
    const binContainer = document.getElementById('binContainer');

    if (binTasks.length === 0) {
        binContainer.innerHTML = `
            <div class="bin-empty-state">
                <div class="bin-empty-icon">🗑️</div>
                <div class="bin-empty-text">Bin is empty</div>
            </div>
        `;
        return;
    }

    binContainer.innerHTML = '';
    binTasks.forEach((task, index) => {
        const binItemDiv = document.createElement('div');
        binItemDiv.className = 'bin-item';
        binItemDiv.style.animationDelay = `${index * 0.05}s`;

        const deletedDate = formatDate(task.deleted_at);

        binItemDiv.innerHTML = `
            <div class="bin-item-content">
                <div class="bin-item-text">${escapeHtml(task.task)}</div>
                <div class="bin-item-meta">
                    <span class="task-badge priority-${task.priority}">${task.priority}</span>
                    <span>📁 ${task.category}</span>
                    <span>🕒 Deleted ${deletedDate}</span>
                </div>
            </div>
            <div class="bin-item-actions">
                <button class="btn-restore" onclick="restoreTask(${task.id})">
                    ♻️ Restore
                </button>
                <button class="btn-permanent-delete" onclick="permanentlyDeleteTask(${task.id})">
                    ❌ Delete
                </button>
            </div>
        `;

        binContainer.appendChild(binItemDiv);
    });
}

// Restore task from bin
async function restoreTask(taskId) {
    try {
        const response = await fetch(`${API_BASE}/bin/${taskId}/restore`, {
            method: 'POST'
        });

        if (response.ok) {
            const data = await response.json();
            tasks.push(data.task);
            await loadBinTasks();
            updateBinCount();
            renderTasks();
            updateStats();
            showNotification('Task restored successfully!', 'success');
        } else {
            showNotification('Failed to restore task', 'error');
        }
    } catch (error) {
        console.error('Error restoring task:', error);
        showNotification('Error connecting to server', 'error');
    }
}

// Permanently delete task from bin
async function permanentlyDeleteTask(taskId) {
    if (!confirm('Permanently delete this task? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/bin/${taskId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await loadBinTasks();
            updateBinCount();
            showNotification('Task permanently deleted', 'success');
        } else {
            showNotification('Failed to delete task', 'error');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Error connecting to server', 'error');
    }
}

// Empty entire bin
async function emptyBin() {
    if (!confirm('Empty the entire bin? This will permanently delete ALL tasks in the bin and cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/bin/empty`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await loadBinTasks();
            updateBinCount();
            showNotification('Bin emptied successfully', 'success');
        } else {
            showNotification('Failed to empty bin', 'error');
        }
    } catch (error) {
        console.error('Error emptying bin:', error);
        showNotification('Error connecting to server', 'error');
    }
}
