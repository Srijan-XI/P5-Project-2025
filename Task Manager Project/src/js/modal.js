// Modal management module
let modalEl = null;
let overlayEl = null;

function ensureElements() {
  if (!modalEl) modalEl = document.getElementById('modal');
  if (!overlayEl) overlayEl = document.getElementById('overlay');
}

export function open(contentHtml) {
  ensureElements();
  if (!modalEl || !overlayEl) return;
  modalEl.innerHTML = contentHtml || '';
  overlayEl.classList.add('show');
  modalEl.classList.add('show');
}

export function close() {
  ensureElements();
  if (!modalEl || !overlayEl) return;
  overlayEl.classList.remove('show');
  modalEl.classList.remove('show');
}

export function bindClose(selector = '[data-modal-close]') {
  document.addEventListener('click', (e) => {
    const target = e.target.closest(selector);
    if (target) {
      e.preventDefault();
      close();
    }
  });
}

export default { open, close, bindClose };
