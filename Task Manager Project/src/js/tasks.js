// Task operations module: orchestrates API + UI + notifications
import * as api from './api.js';
import ui from './ui.js';
import filters from './filters.js';
import { validateTask } from './utils.js';
import notify from './notifications.js';

let tasksCache = [];
let listEl = null;

export async function init(listSelector) {
  listEl = document.querySelector(listSelector);
  await refresh();
  ui.bindTaskInteractions(listEl, {
    onToggle: async (id, completed) => {
      try {
        await api.toggleComplete(id, completed);
        notify.success('Task updated');
        await refresh();
      } catch (e) {
        notify.error('Failed to update task');
      }
    },
    onDelete: async (id) => {
      try {
        await api.deleteTask(id);
        notify.success('Task deleted');
        await refresh();
      } catch (e) {
        notify.error('Failed to delete task');
      }
    },
    onEdit: (id) => {
      const task = tasksCache.find(t => String(t.id) === String(id));
      if (!task) return;
      const event = new CustomEvent('task:edit', { detail: task });
      document.dispatchEvent(event);
    }
  });
}

export async function refresh() {
  const tasks = await api.getTasks();
  tasksCache = tasks || [];
  filters.setTasks(tasksCache);
  ui.mountTasks(listEl, filters.getFilteredTasks());
}

export async function create(description, priority) {
  const error = validateTask(description);
  if (error) {
    notify.error(error);
    return false;
  }
  try {
    await api.createTask(description, priority);
    notify.success('Task created');
    await refresh();
    return true;
  } catch (e) {
    notify.error('Failed to create task');
    return false;
  }
}

export async function update(id, description, priority, completed) {
  const error = validateTask(description);
  if (error) {
    notify.error(error);
    return false;
  }
  try {
    await api.updateTask(id, description, priority, completed);
    notify.success('Task updated');
    await refresh();
    return true;
  } catch (e) {
    notify.error('Failed to update task');
    return false;
  }
}

export default { init, refresh, create, update };
