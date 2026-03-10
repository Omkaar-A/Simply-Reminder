# Simply Reminder

Your own reminders app — colorful, fast, and saved right in your browser. No account needed to start.

**First time?** Open the app in 3 steps below, then add your first reminder.

---

## How to open the app (3 steps)

1. Go to the folder **reminders-app** on your computer.
2. Find the file **index.html**.
3. **Double-click** it.  
   It opens in your web browser. That’s the app.

Your reminders are stored on your device. When you close the browser and open the app again later, they’ll still be there.

---

## Host on GitHub Pages

If your app is already in a GitHub repo, you can host it so it’s available at a public URL (e.g. from your phone or another computer).

1. Open your repo on GitHub (e.g. `github.com/username/reminders-app`).
2. Go to **Settings** → **Pages** (in the left sidebar).
3. Under **Build and deployment** → **Source**, choose **Deploy from a branch**.
4. Under **Branch**, select **main** (or **master**), set **Folder** to **/ (root)**, then click **Save**.
5. After a minute or two, the site will be live at:
   - `https://<username>.github.io/<repo-name>/`
   - Example: repo `omkaar/reminders-app` → `https://omkaar.github.io/reminders-app/`

No code changes are needed — the app is static HTML, CSS, and JS and works as-is from the root of your branch.

If you use **Google Sign-in**, add this exact Pages URL to **Authorized JavaScript origins** in Google Cloud; see **Google Calendar setup** below.

---

## Major update — what’s new

This version is a big upgrade with more ways to organize and track your reminders.

### New features

- **Notes** — Add an optional note to any reminder (extra details, links, or instructions).
- **Due dates** — Pick a date for each reminder. You’ll see “Today”, “Tomorrow”, or the full date, and overdue items are highlighted.
- **Categories** — Tag reminders with one tap: 📚 School, 🏠 Home, 🎮 Fun, 🏃 Sports, 🎵 Music, ⭐ Important.
- **Priority** — Set priority to **Low**, **Normal**, or **High**. High-priority reminders get a red accent and their own filter.
- **Search** — Type in the search box to filter reminders by text. Works with all other filters.
- **Filters** — View **All**, **Active** (not done), **Done**, or **High** priority only.
- **Stats & progress** — See total reminders, how many are active, how many are done, and a progress bar for completion.
- **Edit reminders** — Click the ✏️ (pencil) on any reminder to change its text.
- **Clear completed** — One button to remove all done reminders from the list.
- **Dark mode** — Toggle 🌙/☀️ in the header. Your choice is remembered next time.
- **Confetti** — A quick celebration when you mark a reminder done.
- **Google Calendar** — Sign in with Google to add reminders (with due dates) to your calendar. Optional; the app works fully without it.

The app also has a fresh, colorful design: gradient backgrounds, colored stats, and clear visual cues for priority and due dates.

---

## How to use it

### Add a reminder

1. Type what you want to remember in the main box.
2. *(Optional)* Add a note in the “Add a note” area.
3. *(Optional)* Pick a **due date** with the date picker.
4. *(Optional)* Tap a **category** (📚 🏠 🎮 🏃 🎵 ⭐) to tag it.
5. *(Optional)* Choose **priority**: Low, Normal, or High.
6. Click **Add**. Your reminder appears at the top of the list.

### Mark it done

- Click the **circle** next to the reminder.  
  It gets a check mark, moves to “done,” and you’ll see a short confetti animation.

### Edit a reminder

- Click the **✏️ (pencil)** button on the reminder.  
  A prompt lets you change the text. Save to update.

### Remove a reminder

- Click the **🗑️ (trash)** button on the reminder to delete it.

### Search

- Type in the **Search...** box. The list updates to show only reminders whose text matches. Search works together with the filter buttons (All / Active / Done / High).

### Filter the list

- **All** — Every reminder.
- **Active** — Only reminders you haven’t completed.
- **Done** — Only completed reminders.
- **High** — Only high-priority reminders.

### Clear completed

- When you have at least one completed reminder, a **🗑️ Clear completed** button appears at the bottom. Click it to remove all done items from the list (they are deleted, not just hidden).

### Dark mode

- Click the **🌙** / **☀️** button in the top-right. The app switches between light and dark theme. Your preference is saved for next time.

### Google Calendar (optional)

- Click **Sign in with Google** to link your account. After signing in, reminders that have a **due date** can be added to your Google Calendar (the app can do this automatically when you add them, and you can open **📅 Calendar** on a reminder to add it manually).  
  Setup requires a Google Cloud project and Client ID — see **Google Calendar setup** below if an adult is helping you.
---

## Summary

| Action            | How |
|-------------------|-----|
| Open app          | Double-click **index.html** |
| Add reminder      | Type text, optionally add note, date, category, priority → **Add** |
| Mark done         | Click the circle next to the reminder |
| Edit              | Click ✏️ on the reminder |
| Delete one        | Click 🗑️ on the reminder |
| Search            | Type in the Search box |
| Filter            | Use **All** / **Active** / **Done** / **High** |
| Clear all done    | Click **Clear completed** at the bottom |
| Dark mode         | Click 🌙/☀️ in the header |
| Google Calendar   | Sign in with Google (after Client ID is set in app.js) |

Enjoy your reminders!

