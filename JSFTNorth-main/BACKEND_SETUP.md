# Backend-First Calendar Setup Guide

## What Changed

✅ **Frontend now pulls from backend (Google Sheets) instead of localStorage**
- Events are managed in your Google Sheet (multiple tabs per category)
- Calendar displays events fetched from the sheet
- New events are posted to the sheet automatically
- Local storage is a fallback for offline access

---

## Step-by-Step Setup

### Phase 1: Create Google Sheet (5 minutes)

1. **Create a new Google Sheet**
   - Go to [sheets.google.com](https://sheets.google.com)
   - Click "+ New" > "Spreadsheet"
   - Name it: **`JSTF Church Calendars`**

2. **Rename the default sheet to `Food`**
   - Right-click the "Sheet1" tab at bottom
   - Select "Rename"
   - Type: `Food`

3. **Add headers to Food sheet (row 1):**
   - A1: `Date` (format as YYYY-MM-DD, e.g., 2025-12-25)
   - B1: `Title`
   - C1: `Description`
   - D1: `Time` (format HH:MM, e.g., 18:30, optional)
   - E1: `Location` (optional)

4. **Create 4 more sheets**
   - Right-click the `Food` tab
   - Click "Insert 1 below"
   - Name it: `Transportation`
   - Repeat for: `Volunteers`, `Activities`, `Maintenance`

5. **Add same headers to each sheet**
   - Copy row 1 from Food sheet
   - Paste into row 1 of each other sheet

**Done! Your Google Sheet is ready.**

---

### Phase 2: Deploy Google Apps Script (10 minutes)

1. **Open Google Apps Script Editor**
   - In your Google Sheet, click **Tools** > **Apps Script**
   - A new tab will open

2. **Copy the backend code**
   - Open file `GOOGLE_APPS_SCRIPT.gs` from your project
   - Copy **all** the code

3. **Paste into Apps Script editor**
   - In the Apps Script editor, delete any existing code
   - Paste the code you just copied
   - Press **Ctrl+S** (or Cmd+S) to save

4. **Deploy as Web App**
   - Click the **"Deploy"** button (top right, blue)
   - Click **"New deployment"**
   - From the dropdown, select **"Web app"**
   - Fill in:
     - **Execute as:** Select your Google account
     - **Who has access:** "Anyone, even anonymous"
   - Click **"Deploy"**

5. **Copy the Web App URL**
   - A popup shows: "New deployment created"
   - Click the copy icon next to the URL
   - It looks like: `https://script.google.com/macros/s/AKfycbw.../exec`
   - **Save this URL!**

**Done! Backend is now live.**

---

### Phase 3: Connect Frontend to Backend (2 minutes)

1. **Open `calendars.js`** in your project editor

2. **Find the line:**
   ```javascript
   const GAS_ENDPOINT = "";
   ```

3. **Paste your Web App URL:**
   ```javascript
   const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbw.../exec";
   ```

4. **Save the file**

**Done! Frontend is now connected to backend.**

---

## How It Works Now

### When User Opens Calendar:
1. ✅ Frontend loads `calendars.html`
2. ✅ JavaScript calls `GAS_ENDPOINT` with `doGet` to fetch all events
3. ✅ Events from all sheets (Food, Transportation, etc.) arrive as JSON
4. ✅ Calendar displays events organized by category
5. ✅ Events are cached locally (works offline)

### When User Adds Event:
1. ✅ User fills form and clicks "Save Event"
2. ✅ Frontend POSTs event to `GAS_ENDPOINT` with `doPost`
3. ✅ Google Apps Script appends event to the correct sheet (based on category)
4. ✅ Frontend reloads events from server
5. ✅ Calendar refreshes to show new event
6. ✅ Event is now in your Google Sheet permanently

### When User Deletes Event:
1. ⚠️ Currently deleted only from local cache
2. 📋 TODO: Implement DELETE endpoint in Google Apps Script (coming soon)
3. 💡 For now, manually delete from Google Sheet if needed

---

## Testing

### Test 1: View Events
1. Open `calendars.html` in your browser
2. Check browser console (F12 > Console)
3. You should see: `"Loaded X events from server"`
4. Calendar should display with events (if any exist in your sheet)

### Test 2: Add Event
1. Click "Add Event" button
2. Fill in:
   - Date: 2025-12-25
   - Title: Test Event
   - Category: Food
3. Click "Save Event"
4. Check browser console
5. You should see: `"Event saved to server successfully"`
6. Event should appear in calendar
7. Check your Google Sheet > Food tab
   - New row should be there!

### Test 3: Category Switching
1. Click "Transportation" tab
2. Calendar should show events from Transportation sheet
3. Click "Food" tab again
4. Calendar shows Food sheet events

---

## Troubleshooting

### "Error: SPREADSHEET_NAME not found"
- **Cause:** Google Sheet is not named `JSTF Church Calendars`
- **Fix:** Rename your sheet to exactly `JSTF Church Calendars`

### "Error: Sheet not found for category"
- **Cause:** Missing sheet tab (e.g., no `Food` sheet)
- **Fix:** Create all 5 tabs: Food, Transportation, Volunteers, Activities, Maintenance

### "Falling back to local cache"
- **Cause:** GAS_ENDPOINT is empty or wrong URL
- **Fix:** Paste correct web app URL into `calendars.js`

### "HTTP 403: Forbidden"
- **Cause:** Permissions issue with Google Sheet
- **Fix:** Make sure you own the sheet and Apps Script deployment has correct permissions

### Events not appearing
1. Check browser console (F12) for errors
2. Verify Google Sheet has data (not just headers)
3. Verify date format is YYYY-MM-DD
4. Try refreshing the page

### "No events show up even though sheet has data"
1. Make sure sheet headers are exact: Date, Title, Description, Time, Location
2. Check that data starts in row 2 (row 1 is headers)
3. Check date format: must be YYYY-MM-DD
4. Refresh calendar page

---

## File Reference

### Files in Your Project
```
calendars.html           ← Calendar UI (unchanged)
calendars.css            ← Styling (unchanged)
calendars.js             ← Updated: uses GAS backend
GOOGLE_APPS_SCRIPT.gs    ← New: backend code (copy to Google Sheets)
```

### Google Sheets Setup
```
Google Sheet: "JSTF Church Calendars"
├── Food (sheet/tab)
│   ├── A1: Date | B1: Title | C1: Description | D1: Time | E1: Location
│   └── Row 2+: Event data
├── Transportation (sheet/tab)
│   └── Same headers
├── Volunteers (sheet/tab)
│   └── Same headers
├── Activities (sheet/tab)
│   └── Same headers
└── Maintenance (sheet/tab)
    └── Same headers
```

---

## Features

### Now Available
✅ View events from Google Sheets  
✅ Add new events (saved to sheet)  
✅ Switch between categories  
✅ Auto-sync every 60 seconds  
✅ Offline fallback (local cache)  
✅ Beautiful, responsive UI  

### Coming Soon
📋 Delete events from sheet  
📋 Edit existing events  
📋 Bulk import from CSV  
📋 Email notifications  
📋 User authentication  

---

## Next Steps

### After Setup is Complete:
1. **Add test events** to each sheet manually in Google Sheets
2. **Open calendar page** and verify events appear
3. **Test adding event** from calendar form
4. **Share Google Sheet** with team members (they can view and edit)
5. **Monitor** console logs (F12) for sync status

### To Manage Events:
- **Add:** Use calendar form ("Add Event" button)
- **View:** Browse calendar by category
- **Edit:** Go to Google Sheet directly and edit cells
- **Delete:** Either from Google Sheet or implement frontend delete (coming)

---

## Security Notes

⚠️ **Current Setup:**
- Anyone with the web app URL can view events
- Anyone with the web app URL can add events
- Only you can delete/edit data in the sheet

### To Restrict Access:
1. Change deployment: **"Who has access"** to **"Me"**
2. Or implement Google Sign-In (advanced)

---

## Support

**If something doesn't work:**

1. Check Google Sheet exists and is named exactly `JSTF Church Calendars`
2. Check all 5 sheet tabs exist: Food, Transportation, Volunteers, Activities, Maintenance
3. Check headers are correct in each sheet
4. Check GAS_ENDPOINT URL is pasted in `calendars.js`
5. Check browser console (F12) for error messages
6. Open Google Apps Script editor and check Logs (Extensions > Apps Script > Logs)

**Browser Console Tips:**
```javascript
// Check endpoint is configured
console.log(GAS_ENDPOINT);

// Check if USE_SERVER is true
console.log(USE_SERVER);

// Check current events state
console.log(calendarState.events);
```

---

**Status:** ✅ Backend-First Architecture Implemented  
**Last Updated:** November 11, 2025
