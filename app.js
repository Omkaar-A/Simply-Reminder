/* ===== CONFIG ===== */
// ⚠️ IMPORTANT: Replace this with your own Google Client ID!
// Ask an adult to follow the setup guide in README.md
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com';

/* ===== STORAGE ===== */
const STORAGE_KEY = 'reminders-app';
const BIRTHDAYS_KEY = 'reminders-birthdays';
const DARK_KEY = 'reminders-dark';
const SETTINGS_KEYS = {
  animatedBg: 'reminders-animated-bg',
  confetti: 'reminders-confetti',
  statsBar: 'reminders-stats-bar',
  progressBar: 'reminders-progress-bar',
  autoCalendar: 'reminders-auto-calendar',
  autoAppearance: 'reminders-auto-appearance',
};

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
const birthdayForm = document.getElementById('birthdayForm');
const birthdayNameInput = document.getElementById('birthdayName');
const birthdayLabelInput = document.getElementById('birthdayLabel');
const birthdayDateInput = document.getElementById('birthdayDate');
const birthdayListEl = document.getElementById('birthdayList');
const birthdayEmptyEl = document.getElementById('birthdayEmpty');
const editBirthdayOverlay = document.getElementById('editBirthdayOverlay');
const editBirthdayForm = document.getElementById('editBirthdayForm');
const editBirthdayNameInput = document.getElementById('editBirthdayName');
const editBirthdayLabelInput = document.getElementById('editBirthdayLabel');
const editBirthdayDateInput = document.getElementById('editBirthdayDate');
const editBirthdayClose = document.getElementById('editBirthdayClose');
const editBirthdayCancel = document.getElementById('editBirthdayCancel');
const editReminderOverlay = document.getElementById('editReminderOverlay');
const editReminderForm = document.getElementById('editReminderForm');
const editReminderTextInput = document.getElementById('editReminderText');
const editReminderNoteInput = document.getElementById('editReminderNote');
const editReminderDueDateInput = document.getElementById('editReminderDueDate');
const editReminderPriorityInput = document.getElementById('editReminderPriority');
const editReminderClose = document.getElementById('editReminderClose');
const editReminderCancel = document.getElementById('editReminderCancel');
const editCategoryPicker = document.getElementById('editCategoryPicker');
const editCategoryBtns = editCategoryPicker ? editCategoryPicker.querySelectorAll('.cat-btn') : [];
const tabReminders = document.getElementById('tabReminders');
const tabBirthdays = document.getElementById('tabBirthdays');
const remindersSection = document.getElementById('remindersSection');
const birthdaysSectionEl = document.getElementById('birthdaysSection');
const settingsBtn = document.getElementById('settingsBtn');
const settingsOverlay = document.getElementById('settingsOverlay');
const settingsClose = document.getElementById('settingsClose');
const settingsDarkModeToggle = document.getElementById('settingsDarkMode');
const settingsAnimatedBg = document.getElementById('settingsAnimatedBg');
const settingsConfetti = document.getElementById('settingsConfetti');
const settingsStatsBar = document.getElementById('settingsStatsBar');
const settingsProgressBar = document.getElementById('settingsProgressBar');
const settingsAutoCalendar = document.getElementById('settingsAutoCalendar');
const settingsAutoAppearance = document.getElementById('settingsAutoAppearance');

/* ===== STATE ===== */
let reminders = [];
let birthdays = [];
let currentFilter = 'all';
let searchQuery = '';
let selectedCategory = '';
let editingReminderId = null;
let selectedEditCategory = '';

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

function loadBirthdays() {
  try {
    const raw = localStorage.getItem(BIRTHDAYS_KEY);
    birthdays = raw ? JSON.parse(raw) : [];
  } catch {
    birthdays = [];
  }
}

function saveBirthdays() {
  localStorage.setItem(BIRTHDAYS_KEY, JSON.stringify(birthdays));
}

/* ===== BIRTHDAY HELPERS ===== */
// Format as "Dec 25" (month + day only)
function formatBirthdayDisplay(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Days until next occurrence of this month-day (0 = today, 1 = tomorrow, etc.)
function daysUntilNextBirthday(dateStr) {
  if (!dateStr) return 9999;
  const parts = dateStr.split('-');
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let next = new Date(today.getFullYear(), month, day);
  if (next < today) next = new Date(today.getFullYear() + 1, month, day);
  const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function getBirthdayLabel(days) {
  if (days === 0) return 'Today! 🎉';
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `In ${days} days`;
  if (days <= 30) return `In ${days} days`;
  return `${days} days away`;
}

/* ===== GREETING ===== */
function updateGreeting() {
  const d = new Date();
  const h = d.getHours();
  const totalMins = h * 60 + d.getMinutes();
  let msg = 'Good night 🌙';
  if (h < 5) msg = 'Up late? 🌟';
  else if (h < 12) msg = 'Good morning ☀️';
  else if (h < 17) msg = 'Good afternoon 🌤️';
  else if (totalMins < 19 * 60 + 1) msg = 'Good evening 🌆';
  greetingEl.textContent = msg;
}

/* ===== DARK MODE & AUTO APPEARANCE ===== */
// Morning 5–12: light, ☀️ | Afternoon 12–17: light, ☀️☁️ | Night 17–5: dark, 🌙
// Light until 7:00 PM, dark from 7:01 PM onward
function getAppearanceByTime() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const totalMins = h * 60 + m;
  const darkFrom = 19 * 60 + 1; // 7:01 PM
  const isDark = totalMins >= darkFrom;
  if (isDark) return { dark: true, icon: '🌙' };
  if (h < 12) return { dark: false, icon: '☀️' };
  return { dark: false, icon: '☀️☁️' };
}

function updateAppearanceByTime() {
  if (!getSetting('autoAppearance', false)) return;
  const { dark, icon } = getAppearanceByTime();
  document.body.classList.toggle('dark', dark);
  localStorage.setItem(DARK_KEY, dark);
  darkModeToggle.textContent = icon;
  syncSettingsDarkModeUI();
}

function loadDarkMode() {
  if (getSetting('autoAppearance', false)) {
    const { dark, icon } = getAppearanceByTime();
    document.body.classList.toggle('dark', dark);
    localStorage.setItem(DARK_KEY, dark);
    darkModeToggle.textContent = icon;
  } else {
    const dark = localStorage.getItem(DARK_KEY) === 'true';
    document.body.classList.toggle('dark', dark);
    darkModeToggle.textContent = dark ? '☀️' : '🌙';
  }
  syncSettingsDarkModeUI();
}

function setDarkMode(isDark) {
  document.body.classList.toggle('dark', isDark);
  localStorage.setItem(DARK_KEY, isDark);
  if (getSetting('autoAppearance', false)) {
    const { icon } = getAppearanceByTime();
    darkModeToggle.textContent = icon;
  } else {
    darkModeToggle.textContent = isDark ? '☀️' : '🌙';
  }
  if (settingsDarkModeToggle) {
    settingsDarkModeToggle.setAttribute('aria-checked', isDark);
    settingsDarkModeToggle.classList.toggle('on', isDark);
  }
}

darkModeToggle.addEventListener('click', () => {
  const autoOn = getSetting('autoAppearance', false);
  if (autoOn) {
    setSetting('autoAppearance', false);
    if (settingsAutoAppearance) {
      settingsAutoAppearance.setAttribute('aria-checked', 'false');
      settingsAutoAppearance.classList.remove('on');
    }
  }
  const newDark = !document.body.classList.contains('dark');
  setDarkMode(newDark);
});

function syncSettingsDarkModeUI() {
  const isDark = document.body.classList.contains('dark');
  if (settingsDarkModeToggle) {
    settingsDarkModeToggle.setAttribute('aria-checked', isDark);
    settingsDarkModeToggle.classList.toggle('on', isDark);
  }
}

/* ===== SETTINGS (TOGGLES) ===== */
function getSetting(key, defaultValue = true) {
  const raw = localStorage.getItem(SETTINGS_KEYS[key]);
  if (raw === null) return defaultValue;
  return raw === 'true';
}

function setSetting(key, value) {
  localStorage.setItem(SETTINGS_KEYS[key], value);
  applySetting(key, value);
}

function applySetting(key, value) {
  switch (key) {
    case 'animatedBg':
      document.body.classList.toggle('no-animate-bg', !value);
      break;
    case 'statsBar':
      document.querySelector('.stats-bar').classList.toggle('hidden', !value);
      break;
    case 'progressBar':
      document.querySelector('.progress-bar-container').classList.toggle('hidden', !value);
      break;
    case 'autoAppearance':
      if (value) {
        // Keep current theme when turning on; only update the header icon to match time
        const { icon } = getAppearanceByTime();
        darkModeToggle.textContent = icon;
        syncSettingsDarkModeUI();
      } else {
        darkModeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
      }
      break;
    default:
      break;
  }
}

function loadSettings() {
  const animatedBg = getSetting('animatedBg', true);
  const statsBar = getSetting('statsBar', true);
  const progressBar = getSetting('progressBar', true);
  document.body.classList.toggle('no-animate-bg', !animatedBg);
  document.querySelector('.stats-bar').classList.toggle('hidden', !statsBar);
  document.querySelector('.progress-bar-container').classList.toggle('hidden', !progressBar);
  if (getSetting('autoAppearance', false)) updateAppearanceByTime();
}

function syncSettingsTogglesUI() {
  const toggles = [
    [settingsAnimatedBg, 'animatedBg', true],
    [settingsConfetti, 'confetti', true],
    [settingsStatsBar, 'statsBar', true],
    [settingsProgressBar, 'progressBar', true],
    [settingsAutoCalendar, 'autoCalendar', true],
    [settingsAutoAppearance, 'autoAppearance', false],
  ];
  toggles.forEach(([el, key, defaultOn]) => {
    if (!el) return;
    const on = getSetting(key, defaultOn);
    el.setAttribute('aria-checked', on);
    el.classList.toggle('on', on);
  });
}

/* ===== SETTINGS ===== */
function openSettings() {
  settingsOverlay.classList.remove('hidden');
  settingsOverlay.setAttribute('aria-hidden', 'false');
  syncSettingsDarkModeUI();
  syncSettingsTogglesUI();
}

function closeSettings() {
  settingsOverlay.classList.add('hidden');
  settingsOverlay.setAttribute('aria-hidden', 'true');
}

settingsBtn.addEventListener('click', openSettings);
settingsClose.addEventListener('click', closeSettings);
settingsOverlay.addEventListener('click', (e) => {
  if (e.target === settingsOverlay) closeSettings();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !settingsOverlay.classList.contains('hidden')) closeSettings();
});
settingsDarkModeToggle.addEventListener('click', () => {
  if (getSetting('autoAppearance', false)) {
    setSetting('autoAppearance', false);
    if (settingsAutoAppearance) {
      settingsAutoAppearance.setAttribute('aria-checked', 'false');
      settingsAutoAppearance.classList.remove('on');
    }
  }
  const isDark = !document.body.classList.contains('dark');
  setDarkMode(isDark);
});
document.querySelector('label[for="settingsDarkMode"]')?.addEventListener('click', (e) => {
  e.preventDefault();
  settingsDarkModeToggle.click();
});

function bindSettingsToggle(element, key, defaultValue = true) {
  if (!element) return;
  element.addEventListener('click', () => {
    const next = !getSetting(key, defaultValue);
    setSetting(key, next);
    element.setAttribute('aria-checked', next);
    element.classList.toggle('on', next);
  });
}
document.querySelector('label[for="settingsAnimatedBg"]')?.addEventListener('click', (e) => {
  e.preventDefault();
  settingsAnimatedBg?.click();
});
document.querySelector('label[for="settingsConfetti"]')?.addEventListener('click', (e) => {
  e.preventDefault();
  settingsConfetti?.click();
});
document.querySelector('label[for="settingsStatsBar"]')?.addEventListener('click', (e) => {
  e.preventDefault();
  settingsStatsBar?.click();
});
document.querySelector('label[for="settingsProgressBar"]')?.addEventListener('click', (e) => {
  e.preventDefault();
  settingsProgressBar?.click();
});
document.querySelector('label[for="settingsAutoCalendar"]')?.addEventListener('click', (e) => {
  e.preventDefault();
  settingsAutoCalendar?.click();
});
document.querySelector('label[for="settingsAutoAppearance"]')?.addEventListener('click', (e) => {
  e.preventDefault();
  settingsAutoAppearance?.click();
});
bindSettingsToggle(settingsAnimatedBg, 'animatedBg');
bindSettingsToggle(settingsConfetti, 'confetti');
bindSettingsToggle(settingsStatsBar, 'statsBar');
bindSettingsToggle(settingsProgressBar, 'progressBar');
bindSettingsToggle(settingsAutoCalendar, 'autoCalendar');
bindSettingsToggle(settingsAutoAppearance, 'autoAppearance', false);

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

  // Auto-add to Google Calendar if signed in, has a date, and setting is on
  if (googleToken && reminder.dueDate && getSetting('autoCalendar', true)) {
    addToGoogleCalendar(reminder);
  }

  render();
}

function toggleDone(id) {
  const r = reminders.find((x) => x.id === id);
  if (r) {
    r.done = !r.done;
    if (r.done && getSetting('confetti', true)) launchConfetti();
    saveReminders();
    render();
  }
}

function remove(id) {
  reminders = reminders.filter((r) => r.id !== id);
  saveReminders();
  render();
}

function openEditReminder(id) {
  const r = reminders.find((x) => x.id === id);
  if (!r) return;
  editingReminderId = id;
  selectedEditCategory = r.category || '';
  
  if (editReminderTextInput) editReminderTextInput.value = r.text;
  if (editReminderNoteInput) editReminderNoteInput.value = r.note || '';
  if (editReminderDueDateInput) editReminderDueDateInput.value = r.dueDate || '';
  if (editReminderPriorityInput) editReminderPriorityInput.value = r.priority || 'normal';
  
  // Set category buttons
  editCategoryBtns.forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.cat === selectedEditCategory);
  });
  
  editReminderOverlay.classList.remove('hidden');
  editReminderOverlay.setAttribute('aria-hidden', 'false');
  if (editReminderTextInput) editReminderTextInput.focus();
}

function closeEditReminder() {
  editingReminderId = null;
  selectedEditCategory = '';
  editReminderOverlay.classList.add('hidden');
  editReminderOverlay.setAttribute('aria-hidden', 'true');
}

function saveEditReminder() {
  if (!editingReminderId) return;
  const text = editReminderTextInput ? editReminderTextInput.value.trim() : '';
  if (!text) return;
  
  const r = reminders.find((x) => x.id === editingReminderId);
  if (!r) return;
  
  r.text = text;
  r.note = editReminderNoteInput ? editReminderNoteInput.value.trim() : '';
  r.dueDate = editReminderDueDateInput ? editReminderDueDateInput.value || null : null;
  r.category = selectedEditCategory;
  r.priority = editReminderPriorityInput ? editReminderPriorityInput.value : 'normal';
  
  saveReminders();
  render();
  closeEditReminder();
}

function editReminder(id) {
  openEditReminder(id);
}

function clearDone() {
  reminders = reminders.filter((r) => !r.done);
  saveReminders();
  render();
}

/* ===== BIRTHDAYS ===== */
function addBirthday(name, label, dateStr) {
  if (!name.trim() || !dateStr) return;
  const entry = {
    id: crypto.randomUUID(),
    name: name.trim(),
    label: label ? label.trim() : '',
    date: dateStr,
    createdAt: Date.now(),
  };
  birthdays.push(entry);
  saveBirthdays();
  renderBirthdays();
}

function removeBirthday(id) {
  birthdays = birthdays.filter((b) => b.id !== id);
  saveBirthdays();
  renderBirthdays();
}

let editingBirthdayId = null;

function toYYYYMMDD(dateStr) {
  if (!dateStr) return '';
  const s = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s + (s.includes('T') ? '' : 'T12:00:00'));
  if (isNaN(d.getTime())) return s;
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function openEditBirthday(id) {
  const b = birthdays.find((x) => x.id === id);
  if (!b) return;
  editingBirthdayId = id;
  if (editBirthdayNameInput) editBirthdayNameInput.value = b.name;
  if (editBirthdayLabelInput) editBirthdayLabelInput.value = b.label || '';
  if (editBirthdayDateInput) editBirthdayDateInput.value = toYYYYMMDD(b.date);
  editBirthdayOverlay.classList.remove('hidden');
  editBirthdayOverlay.setAttribute('aria-hidden', 'false');
  if (editBirthdayNameInput) editBirthdayNameInput.focus();
}

function closeEditBirthday() {
  editingBirthdayId = null;
  editBirthdayOverlay.classList.add('hidden');
  editBirthdayOverlay.setAttribute('aria-hidden', 'true');
}

function editBirthday(id) {
  openEditBirthday(id);
}

function saveEditBirthday() {
  if (!editingBirthdayId) return;
  const name = editBirthdayNameInput ? editBirthdayNameInput.value.trim() : '';
  const date = editBirthdayDateInput ? editBirthdayDateInput.value.trim() : '';
  if (!name || !date) return;
  const b = birthdays.find((x) => x.id === editingBirthdayId);
  if (!b) return;
  b.name = name;
  b.label = editBirthdayLabelInput ? editBirthdayLabelInput.value.trim() : '';
  b.date = date;
  saveBirthdays();
  renderBirthdays();
  closeEditBirthday();
}

function renderBirthdays() {
  // Sort by next occurrence (soonest first)
  const sorted = [...birthdays].sort((a, b) => daysUntilNextBirthday(a.date) - daysUntilNextBirthday(b.date));
  birthdayListEl.innerHTML = '';

  sorted.forEach((b) => {
    const li = document.createElement('li');
    const days = daysUntilNextBirthday(b.date);
    const isToday = days === 0;
    li.className = 'birthday-item' + (isToday ? ' birthday-today' : '');
    li.dataset.id = b.id;
    const labelPart = b.label ? ` <span class="birthday-label">(${escapeHtml(b.label)})</span>` : '';
    li.innerHTML = `
      <div class="birthday-content">
        <span class="birthday-name">${escapeHtml(b.name)}${labelPart}</span>
        <div class="birthday-meta">
          <span class="tag tag-birthday-date">${formatBirthdayDisplay(b.date)}</span>
          <span class="tag tag-birthday-next${isToday ? ' birthday-today-tag' : ''}">${getBirthdayLabel(days)}</span>
        </div>
      </div>
      <div class="reminder-actions">
        <button type="button" class="btn-action" aria-label="Edit" title="Edit">✏️</button>
        <button type="button" class="btn-action delete" aria-label="Delete" title="Delete">🗑️</button>
      </div>
    `;
    li.querySelector('.btn-action.delete').addEventListener('click', () => removeBirthday(b.id));
    li.querySelector('.btn-action:not(.delete)').addEventListener('click', () => editBirthday(b.id));
    birthdayListEl.appendChild(li);
  });

  birthdayEmptyEl.classList.toggle('hidden', birthdays.length > 0);
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

birthdayForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = birthdayNameInput.value.trim();
  const label = birthdayLabelInput.value.trim();
  const date = birthdayDateInput.value;
  addBirthday(name, label, date);
  birthdayNameInput.value = '';
  birthdayLabelInput.value = '';
  birthdayDateInput.value = '';
  birthdayNameInput.focus();
});

if (editBirthdayForm) {
  editBirthdayForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveEditBirthday();
  });
}
if (editBirthdayClose) editBirthdayClose.addEventListener('click', closeEditBirthday);
if (editBirthdayCancel) editBirthdayCancel.addEventListener('click', closeEditBirthday);
if (editBirthdayOverlay) {
  editBirthdayOverlay.addEventListener('click', (e) => {
    if (e.target === editBirthdayOverlay) closeEditBirthday();
  });
}

/* ===== EDIT REMINDER DIALOG EVENTS ===== */
if (editReminderForm) {
  editReminderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveEditReminder();
  });
}
if (editReminderClose) editReminderClose.addEventListener('click', closeEditReminder);
if (editReminderCancel) editReminderCancel.addEventListener('click', closeEditReminder);
if (editReminderOverlay) {
  editReminderOverlay.addEventListener('click', (e) => {
    if (e.target === editReminderOverlay) closeEditReminder();
  });
}

/* ===== EDIT CATEGORY PICKER ===== */
editCategoryBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    if (selectedEditCategory === cat) {
      selectedEditCategory = '';
      btn.classList.remove('selected');
    } else {
      editCategoryBtns.forEach((b) => b.classList.remove('selected'));
      selectedEditCategory = cat;
      btn.classList.add('selected');
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (editBirthdayOverlay && !editBirthdayOverlay.classList.contains('hidden')) closeEditBirthday();
    if (editReminderOverlay && !editReminderOverlay.classList.contains('hidden')) closeEditReminder();
  }
});

/* ===== SECTION TABS ===== */
function showSection(sectionId) {
  const isReminders = sectionId === 'reminders';
  remindersSection.hidden = !isReminders;
  birthdaysSectionEl.hidden = isReminders;
  tabReminders.classList.toggle('active', isReminders);
  tabBirthdays.classList.toggle('active', !isReminders);
}

tabReminders.addEventListener('click', () => showSection('reminders'));
tabBirthdays.addEventListener('click', () => showSection('birthdays'));

/* ===== INIT ===== */
updateGreeting();
loadDarkMode();
loadSettings();
loadReminders();
setInterval(updateAppearanceByTime, 60000);
loadBirthdays();
render();
renderBirthdays();
