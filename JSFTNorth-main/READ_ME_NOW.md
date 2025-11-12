# ⚡ IMMEDIATE ACTION REQUIRED

Your Google Apps Script has errors. **Here's what to do RIGHT NOW:**

---

## The Problem

You got these errors when you tried to test:
```
Setup Error: TypeError: SpreadsheetApp.openByName is not a function
doPost Error: TypeError: Cannot read properties of undefined
```

**Why:** The code was trying to use a function Google doesn't provide.

**Solution:** Already fixed in your GOOGLE_APPS_SCRIPT.gs file ✅

---

## What You Need to Do (3 Simple Steps)

### 1️⃣ Get Your Spreadsheet ID

Your Google Sheet URL looks like:
```
https://docs.google.com/spreadsheets/d/YOUR_ID_HERE/edit
```

The `YOUR_ID_HERE` part (30+ characters) is your Spreadsheet ID.

**How to get it:**
- Open Google Sheet "JSTF Church Calendars"
- Look at the URL in the address bar
- Copy everything between `/d/` and `/edit`
- Example: `1KhZrGy2x8kL_mN4pP9qRsT`

### 2️⃣ Update Google Apps Script

- Go back to Google Apps Script
- Open `GOOGLE_APPS_SCRIPT.gs`
- Find line 11: `const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";`
- Replace with: `const SPREADSHEET_ID = "YOUR_ACTUAL_ID";` (your real ID!)
- Press Ctrl+S to save

### 3️⃣ Deploy Again

- Click **Deploy** button
- Click **Manage Deployments** (gear icon)
- Click trash icon to delete old deployment
- Click **New Deployment**
- Select type: **Web app**
- Execute as: **Your email**
- Who has access: **Anyone (even anonymous)**
- Click **Deploy**
- Copy the new URL it shows
- Paste this URL into `calendars.js` line 8 as the `GAS_ENDPOINT`

---

## Verify It Works

Open `calendars.html` in browser and press F12:

**✅ If working:** You'll see green "✅ Events loaded successfully"  
**❌ If not working:** You'll see red errors - read them carefully!

---

## Still Having Issues?

Read these files in order:

1. **`QUICK_FIX.md`** ← Start here for detailed step-by-step
2. **`GET_SPREADSHEET_ID.md`** ← If you're stuck getting your ID
3. **`BACKEND_QUICKREF.md`** ← Quick reference guide
4. **Use AI Help:** Copy a prompt from `AI_ASSISTANT_PROMPTS.md` and ask Gemini/ChatGPT

---

## Timeline

- ⏱️ **5 minutes:** Get Spreadsheet ID
- ⏱️ **2 minutes:** Update Google Apps Script
- ⏱️ **3 minutes:** Deploy again
- ⏱️ **2 minutes:** Test in browser
- ✅ **Total: ~12 minutes** to fix!

---

**Question: Why did I get these errors?**

The original code used `SpreadsheetApp.openByName()` which doesn't exist. The fix uses `SpreadsheetApp.openById()` instead, which requires your Spreadsheet ID. That's why you need to add it!

---

## Next: When This Is Fixed

Once you see the ✅ messages:

1. Try adding an event via the calendar form
2. Check it appears in your Google Sheet
3. Refresh browser
4. Check event is still there
5. 🎉 **You're done!**

---

**Created:** November 11, 2025  
**Severity:** High Priority  
**Time to Fix:** ~12 minutes  
**Difficulty:** Easy (just copy-paste your ID)

👉 **START WITH:** `QUICK_FIX.md`
