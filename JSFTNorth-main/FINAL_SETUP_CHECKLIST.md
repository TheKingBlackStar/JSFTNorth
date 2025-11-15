# ✅ FINAL SETUP CHECKLIST - Backend-First Calendar

## Pre-Setup
- [ ] You have access to Google Sheets
- [ ] You have access to Google Apps Script
- [ ] You have your website files ready to upload

---

## Phase 1: Google Sheet Creation (5 minutes)

### Step 1.1: Create Sheet
- [ ] Go to [sheets.google.com](https://sheets.google.com)
- [ ] Click "+ New" > "Spreadsheet"
- [ ] Name it: **`JSTF Church Calendars`**

### Step 1.2: Set Up Tabs
- [ ] Right-click default "Sheet1"
- [ ] Rename to: `Food`
- [ ] Create 4 more tabs:
  - [ ] `Transportation`
  - [ ] `Volunteers`
  - [ ] `Activities`
  - [ ] `Maintenance`

### Step 1.3: Add Headers
For each tab, add headers in Row 1:
- [ ] Column A: `Date`
- [ ] Column B: `Title`
- [ ] Column C: `Description`
- [ ] Column D: `Time`
- [ ] Column E: `Location`

**Verification:** Sheet should look like this:
```
Tab: Food         | Date | Title | Description | Time | Location |
Tab: Transportation | (same headers) |
Tab: Volunteers   | (same headers) |
Tab: Activities   | (same headers) |
Tab: Maintenance  | (same headers) |
```

---

## Phase 2: Deploy Google Apps Script (10 minutes)

### Step 2.1: Open Apps Script Editor
- [ ] In your Google Sheet, click **Tools** > **Apps Script**
- [ ] New tab opens with code editor

### Step 2.2: Paste Backend Code
- [ ] Copy all code from `GOOGLE_APPS_SCRIPT.gs` file
- [ ] Delete any existing code in editor
- [ ] Paste the code you just copied
- [ ] Press **Ctrl+S** (or Cmd+S on Mac) to save

### Step 2.3: Deploy as Web App
- [ ] Click **Deploy** button (top right, blue)
- [ ] Click **"New deployment"**
- [ ] Click dropdown: select **"Web app"**
- [ ] **Execute as:** Select your Google account
- [ ] **Who has access:** "Anyone, even anonymous"
- [ ] Click **Deploy**
- [ ] Wait for confirmation

### Step 2.4: Copy Web App URL
- [ ] Popup shows: "New deployment created"
- [ ] You'll see a URL that looks like: `https://script.google.com/macros/s/AKfycbw.../exec`
- [ ] **Click the copy icon** (or copy manually)
- [ ] **Save this URL in a text file** (you'll need it next)

**Verification:** You have a working web app URL

---

## Phase 3: Configure Frontend (2 minutes)

### Step 3.1: Update calendars.js
- [ ] Open `calendars.js` in your code editor
- [ ] Find line: `const GAS_ENDPOINT = "";`
- [ ] Replace with your URL from Step 2.4:
  ```javascript
  const GAS_ENDPOINT = "https://script.google.com/macros/s/YOUR_URL_HERE/exec";
  ```
- [ ] Make sure the URL is inside the quotes: `"https://..."`
- [ ] Save the file
- [ ] Upload to your website

### Step 3.2: Verify Configuration
- [ ] Open `calendars.js` and verify URL is there
- [ ] Check that `USE_SERVER` shows: `const USE_SERVER = GAS_ENDPOINT.length > 0;`
- [ ] Verify `SYNC_INTERVAL` is: `const SYNC_INTERVAL = 60000;`

**Verification:** Frontend is configured to use backend

---

## Phase 4: Testing (10 minutes)

### Test 4.1: Open Calendar Page
- [ ] Open `calendars.html` in browser
- [ ] Page should load normally
- [ ] You see the calendar interface

### Test 4.2: Check Console
- [ ] Press **F12** to open Developer Tools
- [ ] Click **Console** tab
- [ ] You should see messages:
  - `"Calendar Script Loaded - Backend-First Mode"`
  - `"Fetching events from server..."`
  - `"Loaded 0 events from server."` (0 because sheet is empty)
- [ ] **No red errors** should appear

### Test 4.3: Add a Test Event
- [ ] In calendar, click **"Add Event"** button
- [ ] Fill in:
  - [ ] Date: `2025-12-25`
  - [ ] Title: `Test Event`
  - [ ] Category: `Food`
  - [ ] Leave others blank (optional)
- [ ] Click **"Save Event"**

### Test 4.4: Check Console Again
- [ ] Look at console for success message:
  - `"Event saved to server successfully."`
  - OR `"Loaded X events from server."`
- [ ] Event should appear in calendar

### Test 4.5: Verify in Google Sheet
- [ ] Open your Google Sheet (in another tab)
- [ ] Go to **Food** tab
- [ ] Look for a new row with:
  - Date: `2025-12-25`
  - Title: `Test Event`
- [ ] **You should see your event in the sheet!**

### Test 4.6: Refresh Calendar
- [ ] Refresh calendar page (F5)
- [ ] Console should show: `"Loaded 1 events from server."`
- [ ] Event should still be visible

**Verification:** Backend and frontend are syncing! ✅

---

## Phase 5: Data Verification (5 minutes)

### Check Google Sheet
- [ ] Google Sheet exists: `JSTF Church Calendars` ✅
- [ ] All 5 tabs exist: Food, Transportation, Volunteers, Activities, Maintenance ✅
- [ ] Headers are correct in each tab ✅
- [ ] At least 1 event row in Food tab ✅

### Check Calendar UI
- [ ] Calendar displays event ✅
- [ ] Event color matches Food category (Red) ✅
- [ ] Clicking date shows event in sidebar ✅
- [ ] Switching tabs works ✅

### Check Backend
- [ ] Google Apps Script is deployed ✅
- [ ] Apps Script has `doGet()` and `doPost()` functions ✅
- [ ] No errors in Apps Script Logs ✅

---

## Phase 6: Optional - Add More Test Data (5 minutes)

### Add Events Directly in Google Sheet
- [ ] Open Google Sheet
- [ ] In **Food** tab, add a few more rows:
  - `2025-12-20 | Holiday Party | Celebration dinner | 19:00 | Fellowship Hall`
  - `2025-12-22 | Potluck | Bring a dish | | Main Hall`
- [ ] Refresh calendar page
- [ ] Wait 10 seconds (auto-sync)
- [ ] You should see new events appear! ✅

### Add Events via Calendar Form
- [ ] Click "Add Event"
- [ ] Add events to different categories:
  - [ ] Food event
  - [ ] Transportation event
  - [ ] Volunteers event
  - [ ] Activities event
  - [ ] Maintenance event
- [ ] Verify each appears in correct tab ✅

---

## Post-Setup

### Share with Team
- [ ] Share Google Sheet with team members
- [ ] Send them calendar.html link
- [ ] Tell them: "View events in calendar, edit in Google Sheet"

### Monitor
- [ ] Check browser console (F12) occasionally for errors
- [ ] Check Google Sheet for new events
- [ ] Verify calendar updates automatically

### Documentation
- [ ] Read `BACKEND_SETUP.md` for detailed help
- [ ] Read `BACKEND_QUICKREF.md` for quick commands
- [ ] Keep `BACKEND_IMPLEMENTATION.md` as reference

---

## Troubleshooting Checklist

If something doesn't work, check in order:

### Problem: No events show up
- [ ] Is GAS_ENDPOINT set in calendars.js? (not empty string)
- [ ] Does Google Sheet exist with exact name: `JSTF Church Calendars`?
- [ ] Do all 5 tabs exist? (Food, Transportation, Volunteers, Activities, Maintenance)
- [ ] Do tabs have correct headers? (Date, Title, Description, Time, Location)
- [ ] Open console (F12) - are there red errors?
- [ ] Check Apps Script logs: Tools > Apps Script > Logs

### Problem: "Falling back to local cache" message
- [ ] Is GAS_ENDPOINT URL correct?
- [ ] Did you deploy Apps Script as Web App?
- [ ] Is URL pasted in quotes? Example: `"https://..."`
- [ ] Try copying URL again and repasting
- [ ] Check you can access the URL in browser (should show JSON response)

### Problem: Added event but it doesn't show up
- [ ] Check console for error messages
- [ ] Check Google Sheet - is the event row there?
- [ ] Check date format is YYYY-MM-DD (e.g., 2025-12-25)
- [ ] Check category matches sheet name (food → Food tab)
- [ ] Try refreshing the calendar page

### Problem: Google Sheet shows event but calendar doesn't
- [ ] Try refreshing calendar page
- [ ] Wait 60 seconds (auto-sync interval)
- [ ] Check browser console for fetch errors
- [ ] Check date format in sheet is correct (YYYY-MM-DD)
- [ ] Check sheet tabs are named exactly: Food, Transportation, Volunteers, Activities, Maintenance

### Problem: HTTP errors in console
- [ ] Check Apps Script deployment has "Anyone, even anonymous" access
- [ ] Check Google Sheet is shared (or doesn't need sharing)
- [ ] Try deploying Apps Script again with new deployment

### Problem: Can't find Apps Script in Google Sheet
- [ ] Look at top menu: **Tools** > **Apps Script**
- [ ] OR look at left sidebar (should have 3-line menu)

---

## Success Checklist - You're Done When:

- ✅ Google Sheet exists with correct name and structure
- ✅ Apps Script deployed as web app
- ✅ GAS_ENDPOINT URL pasted in calendars.js
- ✅ Calendar page loads without errors
- ✅ Console shows: "Fetching events from server..."
- ✅ Can add event via form
- ✅ Event appears in calendar
- ✅ Event row appears in Google Sheet
- ✅ Calendar refreshes and event is still there
- ✅ Auto-sync works (events added in sheet appear in calendar)

---

## Quick Reference - Key Files

| File | What It Does | Where To Edit |
|------|-----------|-----------|
| `calendars.html` | Calendar UI | Don't touch (it's perfect) |
| `calendars.css` | Calendar styling | Edit if you want to change colors/fonts |
| `calendars.js` | Frontend logic | Edit: Paste GAS_ENDPOINT URL here |
| `GOOGLE_APPS_SCRIPT.gs` | Backend code | Copy to Google Sheets Apps Script editor |
| `BACKEND_SETUP.md` | Setup help | Read if stuck |
| `BACKEND_QUICKREF.md` | Quick commands | Read for quick fixes |

---

## One-Minute Summary

1. **Create Google Sheet** named `JSTF Church Calendars` with 5 tabs
2. **Deploy Apps Script** from `GOOGLE_APPS_SCRIPT.gs` as web app
3. **Copy web app URL**
4. **Paste URL** into `calendars.js` (GAS_ENDPOINT variable)
5. **Test:** Add event, verify it appears in sheet + calendar

✅ Done!

---

**Print this checklist or bookmark it!**  
**Refer back to it if you get stuck.**

**Status:** Ready to Deploy  
**Difficulty:** Easy (follow checklist step-by-step)  
**Time:** 30 minutes total  
**Date:** November 11, 2025

---

## Need Help?

1. **Setup stuck?** → Read `BACKEND_SETUP.md`
2. **Quick fix?** → Read `BACKEND_QUICKREF.md`
3. **Want details?** → Read `BACKEND_IMPLEMENTATION.md`
4. **Something broken?** → Check "Troubleshooting Checklist" above
5. **Console errors?** → Open F12 Console and post error message

Good luck! 🚀
