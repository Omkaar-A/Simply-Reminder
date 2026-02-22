/* ===== CONFIG ===== */
// ⚠️ IMPORTANT: Replace this with your own Google Client ID!
// Ask an adult to follow the setup guide in README.md
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com';

/* ===== STORAGE ===== */
const STORAGE_KEY = 'reminders-app';
const DARK_KEY = 'reminders-dark';

/* ===== DOM ===== */
const form = document.getElementById('addForm');
const input = document.getElementById('reminderInput');
const noteInput = document.getElementById('noteInput');
const dueDateInput = document.getElementById('dueDate');
const listEl = document.getElementById('reminderList');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const darkModeToggle = document.getElementById('darkModeToggle');
const prioritySelect = document.getElementById('prioritySelect');
const categoryBtns = document.querySelectorAll('.cat-btn');
const clearDoneBtn = document.getElementById('clearDoneBtn');
const greetingEl = document.getElementById('greeting');
const progressBar = document.getElementById('progressBar');
const statTotal = document.getElementById('statTotal');
const statActive = document.getElementById('statActive');
const statDone = document.getElementById('statDone');
const statPercent = document.getElementById('statPercent');
const confettiContainer = document.getElementById('confetti-container');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const googleSignOutBtn = document.getElementById('googleSignOutBtn');
const googleSignedOut = document.getElementById('googleSignedOut');
const googleSignedIn = document.getElementById('googleSignedIn');
const googleAvatar = document.getElementById('googleAvatar');
const googleName = document.getElementById('googleName');

/* ===== STATE ===== */
let reminders = [];
let currentFilter = 'all';
let searchQuery = '';
let selectedCategory = '';

/* ===== LOAD / SAVE ===== */
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

/* ===== GREETING ===== */
function updateGreeting() {
  const h = new Date().getHours();
  let msg = 'Good evening 🌙';
  if (h < 5) msg = 'Up late? 🌟';
  else if (h < 12) msg = 'Good morning ☀️';
  else if (h < 17) msg = 'Good afternoon 🌤️';
  greetingEl.textContent = msg;
}

/* ===== DARK MODE ===== */
function loadDarkMode() {
  const dark = localStorage.getItem(DARK_KEY) === 'true';
  document.body.classList.toggle('dark', dark);
  darkModeToggle.textContent = dark ? '☀️' : '🌙';
}

darkModeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem(DARK_KEY, isDark);
  darkModeToggle.textContent = isDark ? '☀️' : '🌙';
});

/* ===== HELPERS ===== */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
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

function isOverdue(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr + 'T23:59:59');
  return d < new Date();
}

/* ===== CONFETTI ===== */
function launchConfetti() {
  const colors = ['#ff6b6b', '#ffa502', '#51cf66', '#1e90ff', '#a55eea', '#fd79a8', '#00cec9', '#fdcb6e'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.top = '-10px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.5 + 's';
    piece.style.animationDuration = (1 + Math.random()) + 's';
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (6 + Math.random() * 8) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    confettiContainer.appendChild(piece);
    setTimeout(() => piece.remove(), 2000);
  }
}

/* ===== GOOGLE SIGN-IN & CALENDAR ===== */
let googleToken = null;
let tokenClient = null;

function initGoogle() {
  // Don't init if placeholder client ID
  if (GOOGLE_CLIENT_ID.startsWith('YOUR_')) return;

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile',
    callback: handleGoogleToken,
  });
}

function handleGoogleToken(response) {
  if (response.error) return;
  googleToken = response.access_token;
  fetchGoogleProfile();
}

function fetchGoogleProfile() {
  fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: 'Bearer ' + googleToken },
  })
    .then((r) => r.json())
    .then((user) => {
      googleAvatar.src = user.picture || '';
      googleName.textContent = user.name || 'Connected';
      googleSignedOut.classList.add('hidden');
      googleSignedIn.classList.remove('hidden');
    })
    .catch(() => {});
}

function googleSignIn() {
  if (GOOGLE_CLIENT_ID.startsWith('YOUR_')) {
    alert('Google Calendar is not set up yet. Ask an adult to add a Google Client ID. See README.md for instructions!');
    return;
  }
  if (tokenClient) tokenClient.requestAccessToken();
}

function googleSignOut() {
  if (googleToken) {
    google.accounts.oauth2.revoke(googleToken);
  }
  googleToken = null;
  googleSignedOut.classList.remove('hidden');
  googleSignedIn.classList.add('hidden');
}

function addToGoogleCalendar(reminder) {
  if (!googleToken || !reminder.dueDate) return;

  const event = {
    summary: (reminder.category ? reminder.category + ' ' : '') + reminder.text,
    start: { date: reminder.dueDate },
    end: { date: reminder.dueDate },
    reminders: { useDefault: true },
  };

  fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + googleToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.id) {
        // Save the Google Calendar event ID on the reminder
        reminder.calendarEventId = data.id;
        saveReminders();
      }
    })
    .catch(() => {});
}

function getGoogleCalendarUrl(reminder) {
  const title = encodeURIComponent(reminder.text);
  let dateParam = '';
  if (reminder.dueDate) {
    const d = reminder.dueDate.replace(/-/g, '');
    dateParam = `&dates=${d}/${d}`;
  }
  return `https://calendar.google.com/calendar/event?action=TEMPLATE&text=${title}${dateParam}`;
}

googleSignInBtn.addEventListener('click', googleSignIn);
googleSignOutBtn.addEventListener('click', googleSignOut);

// Init Google when the library loads
window.addEventListener('load', () => {
  if (typeof google !== 'undefined' && google.accounts) {
    initGoogle();
  }
});

/* ===== FILTERING ===== */
function getFilteredReminders() {
  let list = reminders;

  // Filter by status
  if (currentFilter === 'active') list = list.filter((r) => !r.done);
  else if (currentFilter === 'done') list = list.filter((r) => r.done);
  else if (currentFilter === 'high') list = list.filter((r) => r.priority === 'high');

  // Filter by search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter((r) => r.text.toLowerCase().includes(q));
  }

  return list;
}

/* ===== STATS ===== */
function updateStats() {
  const total = reminders.length;
  const done = reminders.filter((r) => r.done).length;
  const active = total - done;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  statTotal.textContent = total;
  statActive.textContent = active;
  statDone.textContent = done;
  statPercent.textContent = percent + '%';
  progressBar.style.width = percent + '%';

  // Show/hide clear done button
  clearDoneBtn.classList.toggle('hidden', done === 0);
}

/* ===== RENDER ===== */
function render() {
  const filtered = getFilteredReminders();
  listEl.innerHTML = '';

  filtered.forEach((reminder) => {
    const li = document.createElement('li');
    const priorityClass = 'priority-' + (reminder.priority || 'normal');
    li.className = 'reminder-item ' + priorityClass + (reminder.done ? ' done' : '');
    li.dataset.id = reminder.id;

    const dueFormatted = formatDueDate(reminder.dueDate);
    const overdue = !reminder.done && isOverdue(reminder.dueDate);
    const calUrl = getGoogleCalendarUrl(reminder);

    li.innerHTML = `
      <div class="custom-check${reminder.done ? ' checked' : ''}" role="checkbox" aria-checked="${reminder.done}" tabindex="0"></div>
      <div class="reminder-content">
        <span class="reminder-text">${reminder.category ? reminder.category + ' ' : ''}${escapeHtml(reminder.text)}</span>
        ${reminder.note ? `<p class="reminder-note">${escapeHtml(reminder.note)}</p>` : ''}
        <div class="reminder-meta">
          ${dueFormatted ? `<span class="tag tag-date${overdue ? ' overdue' : ''}">${overdue ? '⚠️ ' : ''}${escapeHtml(dueFormatted)}</span>` : ''}
          ${reminder.dueDate ? `<a href="${calUrl}" target="_blank" class="tag tag-cal" title="Add to Google Calendar">📅 Calendar</a>` : ''}
        </div>
      </div>
      <div class="reminder-actions">
        <button type="button" class="btn-action" aria-label="Edit" title="Edit">✏️</button>
        <button type="button" class="btn-action delete" aria-label="Delete" title="Delete">🗑️</button>
      </div>
    `;

    li.querySelector('.custom-check').addEventListener('click', () => toggleDone(reminder.id));
    li.querySelector('.btn-action.delete').addEventListener('click', () => remove(reminder.id));
    li.querySelector('.btn-action:not(.delete)').addEventListener('click', () => editReminder(reminder.id));

    listEl.appendChild(li);
  });

  // Empty state
  const hasReminders = reminders.length > 0;
  emptyState.classList.toggle('hidden', filtered.length > 0);
  if (filtered.length === 0 && hasReminders) {
    emptyState.querySelector('.empty-title').textContent = searchQuery
      ? `No matches for "${searchQuery}"`
      : `No ${currentFilter} reminders`;
    emptyState.querySelector('.empty-sub').textContent = 'Try a different filter';
  } else if (!hasReminders) {
    emptyState.querySelector('.empty-title').textContent = 'No reminders yet';
    emptyState.querySelector('.empty-sub').textContent = 'Add your first one above!';
  }

  updateStats();
}

/* ===== ACTIONS ===== */
function addReminder(text, note, dueDate, category, priority) {
  if (!text.trim()) return;
  const reminder = {
    id: crypto.randomUUID(),
    text: text.trim(),
    note: note ? note.trim() : '',
    dueDate: dueDate || null,
    category: category || '',
    priority: priority || 'normal',
    done: false,
    createdAt: Date.now(),
  };
  reminders.unshift(reminder);
  saveReminders();

  // Auto-add to Google Calendar if signed in and has a date
  if (googleToken && reminder.dueDate) {
    addToGoogleCalendar(reminder);
  }

  render();
}

function toggleDone(id) {
  const r = reminders.find((x) => x.id === id);
  if (r) {
    r.done = !r.done;
    if (r.done) launchConfetti();
    saveReminders();
    render();
  }
}

function remove(id) {
  reminders = reminders.filter((r) => r.id !== id);
  saveReminders();
  render();
}

function editReminder(id) {
  const r = reminders.find((x) => x.id === id);
  if (!r) return;
  const newText = prompt('Edit reminder:', r.text);
  if (newText !== null && newText.trim()) {
    r.text = newText.trim();
    saveReminders();
    render();
  }
}

function clearDone() {
  reminders = reminders.filter((r) => !r.done);
  saveReminders();
  render();
}

/* ===== CATEGORY PICKER ===== */
categoryBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    if (selectedCategory === cat) {
      selectedCategory = '';
      btn.classList.remove('selected');
    } else {
      categoryBtns.forEach((b) => b.classList.remove('selected'));
      selectedCategory = cat;
      btn.classList.add('selected');
    }
  });
});

/* ===== EVENT LISTENERS ===== */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  const note = noteInput.value.trim();
  const due = dueDateInput.value || null;
  const priority = prioritySelect.value;
  addReminder(text, note, due, selectedCategory, priority);
  input.value = '';
  noteInput.value = '';
  dueDateInput.value = '';
  prioritySelect.value = 'normal';
  selectedCategory = '';
  categoryBtns.forEach((b) => b.classList.remove('selected'));
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

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim();
  render();
});

clearDoneBtn.addEventListener('click', clearDone);

/* ===== INIT ===== */
updateGreeting();
loadDarkMode();
loadReminders();
render();
