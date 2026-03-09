// UI helpers: DOM manipulation isolated from business logic
import { getPriorityInfo } from './utils.js';

export function renderTaskItem(task) {
  const { icon, label } = getPriorityInfo(task.priority);
  const li = document.createElement('li');
  li.className = `task-item ${task.completed ? 'completed' : ''}`;
  li.dataset.id = task.id;
  li.innerHTML = `
    <div class="task-left">
      <input type="checkbox" class="task-toggle" ${task.completed ? 'checked' : ''} />
      <span class="description">${task.description}</span>
    </div>
    <div class="task-right">
      <span class="priority ${label}">${icon} ${label}</span>
      <button class="task-edit">Edit</button>
      <button class="task-delete">Delete</button>
    </div>
  `;
  return li;
}

export function mountTasks(container, tasks) {
  if (!container) return;
  container.innerHTML = '';
  tasks.forEach(t => container.appendChild(renderTaskItem(t)));
}

export function bindTaskInteractions(container, { onToggle, onEdit, onDelete }) {
  if (!container) return;
  container.addEventListener('change', (e) => {
    const toggle = e.target.closest('.task-toggle');
    if (toggle) {
      const li = e.target.closest('.task-item');
      const id = li?.dataset.id;
      onToggle && onToggle(id, toggle.checked);
    }
  });

  container.addEventListener('click', (e) => {
    const delBtn = e.target.closest('.task-delete');
    if (delBtn) {
      const li = delBtn.closest('.task-item');
      const id = li?.dataset.id;
      onDelete && onDelete(id);
      return;
    }
    const editBtn = e.target.closest('.task-edit');
    if (editBtn) {
      const li = editBtn.closest('.task-item');
      const id = li?.dataset.id;
      onEdit && onEdit(id);
    }
  });
}

export default { renderTaskItem, mountTasks, bindTaskInteractions };
