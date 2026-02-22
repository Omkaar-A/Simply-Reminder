const STORAGE_KEY = 'reminders-app';

const form = document.getElementById('addForm');
const input = document.getElementById('reminderInput');
const dueDateInput = document.getElementById('dueDate');
const listEl = document.getElementById('reminderList');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');

let reminders = [];
let currentFilter = 'all';

function loadReminders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    reminders = raw ? JSON.parse(raw) : [];
  } catch {
    reminders = [];
  }
}

function saveReminders() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  d.setHours(0, 0, 0, 0);

  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function getFilteredReminders() {
  if (currentFilter === 'active') return reminders.filter((r) => !r.done);
  if (currentFilter === 'done') return reminders.filter((r) => r.done);
  return reminders;
}

function render() {
  const filtered = getFilteredReminders();
  listEl.innerHTML = '';

  filtered.forEach((reminder) => {
    const li = document.createElement('li');
    li.className = 'reminder-item' + (reminder.done ? ' done' : '');
    li.dataset.id = reminder.id;

    const dueFormatted = formatDueDate(reminder.dueDate);

    li.innerHTML = `
      <input type="checkbox" class="reminder-checkbox" ${reminder.done ? 'checked' : ''} aria-label="Mark as ${reminder.done ? 'active' : 'done'}" />
      <div class="reminder-content">
        <span class="reminder-text">${escapeHtml(reminder.text)}</span>
        ${dueFormatted ? `<div class="reminder-due">${escapeHtml(dueFormatted)}</div>` : ''}
      </div>
      <button type="button" class="btn-delete" aria-label="Delete reminder">×</button>
    `;

    li.querySelector('.reminder-checkbox').addEventListener('change', () => toggleDone(reminder.id));
    li.querySelector('.btn-delete').addEventListener('click', () => remove(reminder.id));

    listEl.appendChild(li);
  });

  const totalActive = reminders.filter((r) => !r.done).length;
  emptyState.classList.toggle('hidden', reminders.length > 0);
  emptyState.textContent =
    filtered.length === 0 && reminders.length > 0
      ? `No ${currentFilter} reminders.`
      : 'No reminders yet. Add one above.';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function addReminder(text, dueDate = null) {
  if (!text.trim()) return;
  reminders.push({
    id: crypto.randomUUID(),
    text: text.trim(),
    dueDate: dueDate || null,
    done: false,
  });
  saveReminders();
  render();
}

function toggleDone(id) {
  const r = reminders.find((x) => x.id === id);
  if (r) {
    r.done = !r.done;
    saveReminders();
    render();
  }
}

function remove(id) {
  reminders = reminders.filter((r) => r.id !== id);
  saveReminders();
  render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  const due = dueDateInput.value || null;
  addReminder(text, due);
  input.value = '';
  dueDateInput.value = '';
  input.focus();
});

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

loadReminders();
render();
