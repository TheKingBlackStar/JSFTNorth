# Quick Reference: Backend-First Calendar

## Architecture

```
Google Sheet (Backend)
├── Food sheet        ← Add rows here to create Food events
├── Transportation    ← Add rows here to create Transportation events
├── Volunteers        ← Add rows here to create Volunteer events
├── Activities        ← Add rows here to create Activity events
└── Maintenance       ← Add rows here to create Maintenance events
       ↓ (Data flows UP)
Google Apps Script
       ↓ (API calls)
calendars.js (Frontend)
       ↓ (Displays)
Calendar UI ← Users see events here
```

---

## Setup Checklist

- [ ] Create Google Sheet named "JSTF Church Calendars"
- [ ] Create sheets: Food, Transportation, Volunteers, Activities, Maintenance
- [ ] Add headers to each sheet: Date | Title | Description | Time | Location
- [ ] Copy GOOGLE_APPS_SCRIPT.gs code
- [ ] Paste into Google Apps Script editor (Tools > Apps Script)
- [ ] Deploy as Web App
- [ ] Copy web app URL
- [ ] Paste URL into calendars.js (GAS_ENDPOINT variable)
- [ ] Test: Add event from calendar form
- [ ] Verify: Event appears in Google Sheet

---

## Quick Commands

### To check if backend is connected:
```javascript
// In browser console (F12):
console.log(GAS_ENDPOINT);    // Should show URL, not empty string
console.log(USE_SERVER);      // Should show true
```

### To manually test backend:
```javascript
// Manually fetch events (in browser console):
fetch(GAS_ENDPOINT).then(r => r.json()).then(d => console.log(d));
```

### To see sync logs:
```javascript
// Open browser console (F12 > Console)
// You'll see messages like:
// "Fetching events from server..."
// "Loaded 42 events from server."
```

---

## Data Flow

### Adding Event:
```
User fills form
    ↓
Clicks "Save Event"
    ↓
JavaScript creates event object: {date, title, category, description, time, location}
    ↓
Frontend POSTs to GAS_ENDPOINT
    ↓
Google Apps Script doPost() appends row to sheet
    ↓
Frontend reloads all events
    ↓
Calendar refreshes
    ↓
Event visible in calendar AND Google Sheet
```

### Viewing Events:
```
Calendar page loads
    ↓
JavaScript calls GAS_ENDPOINT
    ↓
Google Apps Script doGet() reads all sheets
    ↓
Returns JSON: [{date, title, category, ...}, ...]
    ↓
Frontend organizes by category
    ↓
Calendar renders
    ↓
User sees events organized by Food/Transportation/etc.
```

---

## Google Sheet Format

Each sheet should have:

```
Row 1 (Headers):  Date         Title                Description            Time    Location
Row 2 (Example):  2025-12-25   Christmas Potluck    Bring food to share    18:30   Fellowship Hall
Row 3 (Example):  2025-12-26   Cleanup              Post-holiday cleanup   09:00   Main Hall
```

**Important:**
- Date format: `YYYY-MM-DD` (e.g., 2025-12-25)
- Time format: `HH:MM` (e.g., 18:30, optional)
- Location is optional (can be blank)
- Description is optional (can be blank)
- Title is required
- Date is required

---

## Troubleshooting One-Liners

| Problem | Solution |
|---------|----------|
| No events show up | Check GAS_ENDPOINT is not empty |
| "Falling back to local cache" | GAS_ENDPOINT URL is wrong |
| Events in sheet but not in calendar | Sheet name might be wrong (must be Food, Transportation, etc.) |
| Can add events but they don't appear | Check headers in sheet are exactly: Date, Title, Description, Time, Location |
| Getting HTTP errors | Check browser console (F12) for exact error message |
| Auto-sync not working | SYNC_INTERVAL might be 0 or GAS_ENDPOINT empty |

---

## Files You Need to Know

| File | Purpose | Modified |
|------|---------|----------|
| `calendars.html` | Calendar UI | No (same as before) |
| `calendars.css` | Calendar styling | No (same as before) |
| `calendars.js` | Calendar logic | **YES** - now uses GAS backend |
| `GOOGLE_APPS_SCRIPT.gs` | Backend code | **NEW** - copy to Google Sheets |
| `BACKEND_SETUP.md` | Setup instructions | **NEW** |

---

## After Deployment

### Your Google Sheet becomes:
- ✅ Source of truth for all calendar events
- ✅ Editable by team members directly
- ✅ Automatically displayed in calendar UI
- ✅ Backed up by Google Drive

### Your Calendar UI becomes:
- ✅ Read-only display by default
- ✅ Add events via form (syncs to sheet)
- ✅ Beautiful interface for browsing
- ✅ Works offline (cached events)

### Team Workflow:
1. Admin adds events in Google Sheet
2. Calendar automatically shows them (auto-sync every 60s)
3. OR team adds via calendar form
4. Form syncs to sheet immediately
5. All team members see same events

---

## Configuration

In `calendars.js`, you can customize:

```javascript
// Change these values:
const GAS_ENDPOINT = "https://...";    // Your web app URL (REQUIRED)
const USE_SERVER = true;               // Set to false to use local-only
const SYNC_INTERVAL = 60000;           // Auto-sync every 60 seconds (0 = disable)
```

---

## Status

✅ **Backend-first architecture implemented**
✅ **Google Sheets integration ready**
✅ **Frontend can add/view events**
⚠️ **Delete not yet in backend** (marked as TODO)
📋 **Edit/update events** (coming soon)

---

## Next Features to Add

1. **Delete endpoint** in Google Apps Script
2. **Edit endpoint** in Google Apps Script
3. **User authentication** (optional)
4. **Email notifications** (optional)
5. **Bulk import** from CSV (optional)

---

## Remember:

🔑 **Key URL:** Paste this in `calendars.js` after deploying:
```
GAS_ENDPOINT = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

📊 **Data lives here:** Your Google Sheet "JSTF Church Calendars"

🎯 **Users access here:** Your website's calendars.html page

---

**Version:** 1.0 Backend-First  
**Date:** November 11, 2025
