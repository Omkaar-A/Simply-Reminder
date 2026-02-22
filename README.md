# Reminders App

Your own reminders app. Here’s how to use it.

**First time?** Just do the “How to open the app” steps below.

---

## How to open the app (3 steps)

1. Go to the folder called **reminders-app** on your computer.
2. Find the file named **index.html**.
3. **Double-click** it.  
   It will open in your web browser. That’s the app.

---

## How to use it

**Add a reminder**
- Type what you want to remember in the box.
- Click the **Add** button.
- Your reminder appears in the list.

**Mark it done**
- When you did the thing, click the **little box** next to the reminder.  
  It will get a check mark and look “done.”

**Remove a reminder**
- Click the **×** next to a reminder to delete it.

**See different lists**
- **All** = every reminder.
- **Active** = only things you haven’t done yet.
- **Done** = only things you already did.

Your reminders are saved. When you close the browser and open the app again later, they'll still be there.

---

## Google Calendar Setup (needs an adult)

To link Google Calendar so reminders automatically appear there:

### Step 1 — Create a Google Cloud project
1. Go to https://console.cloud.google.com
2. Sign in with a Google account
3. Click **Select a project** → **New Project**
4. Name it "Simply Reminder" and click **Create**

### Step 2 — Enable the Calendar API
1. In the left menu, go to **APIs & Services** → **Library**
2. Search for **Google Calendar API**
3. Click on it and press **Enable**

### Step 3 — Create credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If asked, configure the consent screen first (choose **External**, fill in the app name)
4. For Application type, choose **Web application**
5. Under **Authorized JavaScript origins**, add your website URL (e.g. `https://simplyreminder.github.io`)
6. Click **Create**
7. Copy the **Client ID** (it looks like `123456.apps.googleusercontent.com`)

### Step 4 — Add the Client ID to the app
1. Open `app.js`
2. Find the line that says `YOUR_CLIENT_ID_HERE.apps.googleusercontent.com`
3. Replace it with the Client ID you copied
4. Save the file and re-upload to GitHub

Now the "Sign in with Google" button will work!
