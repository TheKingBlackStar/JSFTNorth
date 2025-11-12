# 🎯 Backend-First Calendar Implementation

## What's Done (You Can Use Now)

I've converted the calendar system to a **backend-first architecture** where:
- ✅ Events live in **Google Sheets** (multiple tabs per category)
- ✅ Frontend **pulls from Google Sheets** automatically
- ✅ New events **post to Google Sheets** immediately
- ✅ Team can **edit directly in Google Sheet**
- ✅ Calendar displays **real-time data**

---

## Files Created & Updated

### New Files
```
✅ GOOGLE_APPS_SCRIPT.gs      (Backend: copy to Google Sheets Apps Script)
✅ BACKEND_SETUP.md           (Step-by-step setup guide)
✅ BACKEND_QUICKREF.md        (Quick reference card)
```

### Updated Files
```
✅ calendars.js               (Now uses GAS backend + localStorage fallback)
```

### Unchanged
```
calendars.html                (Same beautiful UI)
calendars.css                 (Same styling)
```

---

## Your Next Steps (Exact Order)

### Step 1: Create Google Sheet (5 min) ⏱️
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create new sheet, name: **`JSTF Church Calendars`**
3. Rename default tab to: **`Food`**
4. Add headers to row 1:
   - A1: `Date`
   - B1: `Title`
   - C1: `Description`
   - D1: `Time`
   - E1: `Location`
5. Create 4 more tabs: `Transportation`, `Volunteers`, `Activities`, `Maintenance`
6. Copy headers to each tab

**Result:** Empty Google Sheet with 5 category tabs ready for data.

---

### Step 2: Deploy Google Apps Script (10 min) ⏱️
1. Open your Google Sheet
2. Click **Tools** > **Apps Script**
3. Delete any existing code
4. Copy all code from: `GOOGLE_APPS_SCRIPT.gs` (in your project)
5. Paste into Apps Script editor
6. Click **Ctrl+S** to save
7. Click **Deploy** > **New deployment**
8. Select **Web app**
9. Execute as: **Me** (your account)
10. Access: **Anyone, even anonymous**
11. Click **Deploy**
12. **COPY THE URL** that appears (looks like: `https://script.google.com/macros/s/AKfy...../exec`)

**Result:** Live backend ready to receive/send events.

---

### Step 3: Connect Frontend to Backend (2 min) ⏱️
1. Open `calendars.js` in your code editor
2. Find line: `const GAS_ENDPOINT = "";`
3. Paste your URL from Step 2:
   ```javascript
   const GAS_ENDPOINT = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
   ```
4. Save the file
5. Upload to your website

**Result:** Calendar now syncs with Google Sheet.

---

### Step 4: Test (5 min) ⏱️
1. Open your calendar page
2. Open browser console (F12 > Console)
3. You should see: `"Fetching events from server..."`
4. Then: `"Loaded 0 events from server."` (0 because sheet is empty)
5. Click "Add Event"
6. Fill in:
   - Date: 2025-12-25
   - Title: Test Event
   - Category: Food
7. Click "Save Event"
8. Check console: `"Event saved to server successfully."`
9. Open your Google Sheet > Food tab
10. You should see a new row with your event!

**Result:** Backend and frontend are syncing!

---

## How It Works

### Architecture
```
Google Sheets (Your Data Source)
    ↓ (API)
Google Apps Script (Backend)
    ↓ (Fetches/Saves)
calendars.js (Frontend)
    ↓ (Displays)
Calendar UI (Users see this)
```

### When Adding Event
1. User fills form in calendar
2. Frontend POSTs to `GAS_ENDPOINT`
3. Backend appends row to Google Sheet
4. Frontend reloads events from backend
5. Event appears in calendar
6. Event is now in Google Sheet permanently

### When Opening Calendar
1. Page loads
2. Frontend calls `GAS_ENDPOINT` to fetch
3. Backend reads all sheets (Food, Transportation, etc.)
4. Returns JSON array of all events
5. Frontend organizes by category
6. Calendar displays organized events

---

## Key Features

✅ **Multiple Categories**
- Food, Transportation, Volunteers, Activities, Maintenance
- Each has its own Google Sheet tab
- Filter by clicking tabs

✅ **Real-Time Sync**
- Auto-sync every 60 seconds
- Can add/edit in Google Sheet directly
- Calendar updates automatically

✅ **Offline Support**
- Events cached locally (localStorage)
- Works if server unavailable
- Auto-syncs when back online

✅ **Team Access**
- Share Google Sheet with team
- Anyone can view/edit in sheet
- Calendar UI is read-only (by default)

✅ **Data Persistence**
- Events in Google Sheet (permanent)
- Backed up by Google Drive
- No database needed

---

## What's NOT Yet Implemented

⏳ **Delete from Backend**
- Currently deleted from local cache only
- Manual deletion: go to Google Sheet and delete row
- Will add proper delete endpoint soon

⏳ **Edit Events**
- Currently no edit button (planned)
- Workaround: edit directly in Google Sheet

⏳ **User Authentication**
- Anyone with URL can add events
- Optional: add Google Sign-In later

⏳ **Notifications**
- No email/SMS alerts yet
- Planned for future

---

## Configuration

In `calendars.js`, you can change:

```javascript
// Your Google Apps Script web app URL (REQUIRED)
const GAS_ENDPOINT = "https://script.google.com/macros/s/YOUR_ID/exec";

// Use backend? (set to false for local-only mode)
const USE_SERVER = GAS_ENDPOINT.length > 0;

// Auto-sync interval (60000ms = 60 seconds, set 0 to disable)
const SYNC_INTERVAL = 60000;
```

---

## Troubleshooting

### Events don't show up
**Check:** GAS_ENDPOINT is correct (not empty)
**Check:** Google Sheet exists and is named `JSTF Church Calendars`
**Check:** All 5 tabs exist: Food, Transportation, Volunteers, Activities, Maintenance
**Check:** Browser console (F12) for errors

### "Falling back to local cache"
**Cause:** Can't reach backend
**Fix:** Verify GAS_ENDPOINT URL is correct
**Fix:** Check Google Apps Script is deployed
**Fix:** Check internet connection

### Added event but it doesn't appear
**Check:** Check Google Sheet has the event (should see new row)
**Check:** Refresh calendar page
**Check:** Check browser console for errors

### Google Sheet is empty but calendar shows events
**Cause:** Events are in local cache, not synced yet
**Fix:** Check if GAS_ENDPOINT is configured
**Fix:** Open browser console and look for errors

---

## File Reference

### Core Files
- `calendars.html` — Calendar UI (unchanged)
- `calendars.css` — Styling (unchanged)
- `calendars.js` — **UPDATED** to use backend
- `GOOGLE_APPS_SCRIPT.gs` — **NEW** backend code

### Documentation
- `BACKEND_SETUP.md` — Detailed setup instructions
- `BACKEND_QUICKREF.md` — Quick reference
- `BACKEND_FIRST_IMPLEMENTATION.md` — This file

### Legacy (No Longer Used)
- `CALENDAR_*.md` — Old documentation (for reference)
- `START_HERE.md` — Old documentation (for reference)

---

## Success Indicators

When setup is complete, you'll see:

✅ **Browser Console Shows:**
```
Calendar Script Loaded - Backend-First Mode
Fetching events from server...
Loaded X events from server.
```

✅ **You Can:**
- Add events via calendar form
- See them appear in Google Sheet immediately
- Refresh calendar and they're still there
- Edit directly in Google Sheet
- Calendar updates automatically

✅ **Google Sheet Has:**
- Events in correct tabs (by category)
- Proper date format: YYYY-MM-DD
- Multiple events per tab

---

## Summary

### Before (Local-Only)
- Events stored in browser
- Only visible on that device
- Lost if browser cleared
- No team access

### After (Backend-First)
- Events stored in Google Sheet
- Visible on any device
- Permanent (Google Drive backup)
- Team can edit directly
- Real-time sync

---

## Next Steps (After Setup Works)

1. **Add team members** to Google Sheet (share it)
2. **Add test data** to each category in Google Sheet
3. **Verify** calendar displays everything correctly
4. **Share calendar link** with church members
5. **Monitor** console logs if issues arise

---

## Support Resources

📚 **Setup Instructions:** `BACKEND_SETUP.md` (detailed, step-by-step)
📝 **Quick Reference:** `BACKEND_QUICKREF.md` (commands, troubleshooting)
💬 **Google Apps Script Logs:** Tools > Apps Script > Logs (debug backend)
🔍 **Browser Console:** F12 > Console (debug frontend)

---

## Questions?

**Where's my data?**
→ Google Sheet "JSTF Church Calendars"

**How do I edit events?**
→ Edit in Google Sheet directly OR use "Add Event" form (delete not yet implemented)

**Can my team edit calendars?**
→ Yes, share the Google Sheet with them

**What if server is down?**
→ Calendar still works (uses offline cache)

**How often does it sync?**
→ Every 60 seconds (auto-sync) + on every add/delete

**Can I change colors/layout?**
→ Yes, edit `calendars.css`

**Can I add more categories?**
→ Yes, add sheet tab + update category names in code

---

**Status:** ✅ Backend-First Implementation Complete  
**Ready to Deploy:** Yes  
**Data Persistence:** Google Sheets (100%)  
**Team Access:** Yes  
**Date:** November 11, 2025

---

## One Last Thing

After you complete the 4 steps above, send me:
1. Your Google Apps Script **web app URL**
2. A screenshot showing an event in Google Sheet
3. A screenshot showing calendar displaying that event

Then I can verify everything is working and help with any tweaks! 🚀
