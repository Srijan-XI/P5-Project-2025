// Entry point: wiring modules together
import * as api from './api.js';
import notify from './notifications.js';
import * as loading from './loading.js';
import filters from './filters.js';
import tasks from './tasks.js';
import modal from './modal.js';
import { updateCharCounter, getPriorityInfo } from './utils.js';

async function bootstrap() {
  loading.show();
  try {
    filters.init(
      document.querySelectorAll('[data-filter-status]'),
      document.querySelectorAll('[data-filter-priority]'),
      () => tasks.refresh()
    );

    await tasks.init('#task-list');

    const descriptionInput = document.getElementById('task-input');
    const counter = document.getElementById('char-counter');
    if (descriptionInput && counter) {
      descriptionInput.addEventListener('input', () => updateCharCounter(descriptionInput, counter));
    }

    const form = document.getElementById('task-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const desc = descriptionInput?.value?.trim();
        const prioritySel = document.getElementById('priority');
        const priority = prioritySel ? prioritySel.value : 'medium';
        const ok = await tasks.create(desc, priority);
        if (ok && descriptionInput) descriptionInput.value = '';
      });
    }

    document.addEventListener('task:edit', (e) => {
      const t = e.detail;
      const pr = getPriorityInfo(t.priority);
      modal.open(`
        <div class="modal-header">
          <h3>Edit Task</h3>
          <button data-modal-close>×</button>
        </div>
        <div class="modal-body">
          <label>Description</label>
          <input id="edit-desc" value="${t.description}" />
          <label>Priority</label>
          <select id="edit-priority" value="${t.priority}">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div class="priority-hint">${pr.icon} ${pr.label}</div>
        </div>
        <div class="modal-footer">
          <button id="save-edit">Save</button>
        </div>
      `);
      modal.bindClose();
      const saveBtn = document.getElementById('save-edit');
      saveBtn?.addEventListener('click', async () => {
        const newDesc = document.getElementById('edit-desc')?.value || t.description;
        const newPriority = document.getElementById('edit-priority')?.value || t.priority;
        const ok = await tasks.update(t.id, newDesc, newPriority, t.completed);
        if (ok) modal.close();
      });
    });
  } catch (err) {
    notify.error('Failed to bootstrap application');
    console.error(err);
  } finally {
    loading.hide();
  }
}

document.addEventListener('DOMContentLoaded', bootstrap);
