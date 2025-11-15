# AI Assistant Setup Guide - JSTF Church Calendar Backend Integration

**Purpose:** This document provides clear instructions for an AI assistant (like Gemini, ChatGPT, Claude, etc.) to help users set up and connect the backend-first calendar system.

---

## Context for AI Assistant

### What Has Been Done
- ✅ Calendar frontend built (`calendars.html`, `calendars.css`, `calendars.js`)
- ✅ Google Apps Script backend created (`GOOGLE_APPS_SCRIPT.gs`)
- ✅ Frontend updated to support backend sync
- ✅ Documentation created for setup
- ⏳ **REMAINING:** User needs help deploying backend and connecting frontend

### What AI Should Help With
1. Guide user through Google Sheet creation
2. Help deploy Google Apps Script
3. Help troubleshoot issues
4. Verify setup is working correctly
5. Provide clear step-by-step instructions

---

## AI Todo List - Phase 1: Google Sheet Setup

### Task 1.1: Verify User Has Google Account
**What to ask:**
- "Do you have a Google account (Gmail, Google Workspace, etc.)?"
- "Do you have access to Google Sheets?"

**What to do if answer is YES:**
- Proceed to Task 1.2

**What to do if answer is NO:**
- Provide link: [Create Google Account](https://accounts.google.com/signup)
- Wait for user to complete signup
- Then proceed to Task 1.2

---

### Task 1.2: Guide Sheet Creation
**Instructions to give user:**

```
Step 1: Open Google Sheets
- Go to https://sheets.google.com
- Click "+ New" button (top left)
- Click "Spreadsheet"

Step 2: Rename the spreadsheet
- At the top, you'll see "Untitled spreadsheet"
- Click on it
- Type: JSTF Church Calendars
- Press Enter

Step 3: Rename the first sheet
- At the bottom, you'll see a tab labeled "Sheet1"
- Right-click on it
- Click "Rename"
- Type: Food
- Press Enter

Step 4: Add headers to Food sheet
- Make sure you're in the Food sheet
- Click cell A1
- Type: Date
- Press Tab → Type: Title
- Press Tab → Type: Description
- Press Tab → Type: Time
- Press Tab → Type: Location
- Press Enter
```

**What to ask:**
- "Can you see the Food sheet with headers: Date, Title, Description, Time, Location?"

**If user says NO:**
- Ask: "Which step did you get stuck on?"
- Provide detailed help for that specific step

**If user says YES:**
- Proceed to Task 1.3

---

### Task 1.3: Create Remaining Sheets
**Instructions to give user:**

```
You now need to create 4 more sheets. Repeat this for each:

For EACH of these names:
- Transportation
- Volunteers
- Activities
- Maintenance

DO THIS:
1. Right-click the "Food" tab at the bottom
2. Click "Insert 1 below"
3. A new sheet appears
4. Right-click the new sheet tab
5. Click "Rename"
6. Type the name (Transportation, Volunteers, Activities, or Maintenance)
7. Press Enter

THEN:
1. Go back to the Food sheet
2. Select cells A1:E1 (the header row: Date, Title, Description, Time, Location)
3. Press Ctrl+C (or Cmd+C on Mac) to copy
4. Go to the new sheet
5. Click cell A1
6. Press Ctrl+V (or Cmd+V) to paste

Repeat for all 4 sheets.
```

**What to ask:**
- "Can you see 5 sheets at the bottom: Food, Transportation, Volunteers, Activities, Maintenance?"
- "Does each sheet have the same headers in row 1: Date, Title, Description, Time, Location?"

**If user answers YES to both:**
- Proceed to Task 1.4

**If user answers NO:**
- Ask which sheet is missing
- Help them create it
- Ask them to verify each sheet has headers
- Once verified, proceed to Task 1.4

---

### Task 1.4: Verify Sheet Structure
**What to do:**
- Ask user to take a screenshot of their Google Sheet showing:
  - All 5 sheet tabs visible at bottom
  - Headers visible in row 1

**What to verify:**
- ✅ Sheet name: "JSTF Church Calendars"
- ✅ 5 tabs present: Food, Transportation, Volunteers, Activities, Maintenance
- ✅ Each tab has headers: Date, Title, Description, Time, Location
- ✅ Headers are in row 1 (row 2+ is empty)

**If everything looks good:**
- Congratulate user
- Proceed to Phase 2

**If something is wrong:**
- Identify the issue
- Provide step-by-step fix
- Re-verify

---

## AI Todo List - Phase 2: Google Apps Script Deployment

### Task 2.1: Prepare Backend Code
**What to tell user:**

```
NEXT STEP: Deploy the backend (Google Apps Script)

Your setup folder contains a file called:
GOOGLE_APPS_SCRIPT.gs

This file contains all the backend code needed.

DO THIS:
1. Open the file GOOGLE_APPS_SCRIPT.gs from your setup files
2. Select ALL the code (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)
4. Keep this code copied to your clipboard
```

**What to verify:**
- Ask: "Did you copy the code from GOOGLE_APPS_SCRIPT.gs?"

**If YES:**
- Proceed to Task 2.2

**If NO:**
- Ask: "Can you see the file GOOGLE_APPS_SCRIPT.gs?"
- If NO: help them locate it
- If YES: guide them to copy the code again

---

### Task 2.2: Access Google Apps Script Editor
**Instructions to give user:**

```
NOW: Open Google Apps Script Editor

STEPS:
1. Go back to your Google Sheet (JSTF Church Calendars)
2. At the top menu, look for: Tools
3. Click Tools
4. Click "Apps Script"
5. A new window/tab will open with code editor
6. You might see some default code or comments
```

**What to verify:**
- Ask: "Do you see the Apps Script editor with code?"
- Ask: "Do you see a file name like 'Code.gs' or similar in the left sidebar?"

**If YES:**
- Proceed to Task 2.3

**If NO:**
- Ask: "What do you see instead?"
- Help based on what they describe
- Try again

---

### Task 2.3: Replace Code in Apps Script
**Instructions to give user:**

```
IMPORTANT: You need to replace ALL code in this editor

STEPS:
1. In the Apps Script editor, select all code
   - Use Ctrl+A (or Cmd+A on Mac)
   - This should highlight all the text (usually turns blue)

2. Delete it
   - Press Delete or Backspace

3. Paste the code you copied earlier
   - Use Ctrl+V (or Cmd+V on Mac)
   - The code from GOOGLE_APPS_SCRIPT.gs should appear

4. Click File → Save (or Ctrl+S)
   - Wait for "Saved" message to appear

5. You should see no red error indicators
```

**What to verify:**
- Ask: "Did the code paste successfully?"
- Ask: "Did you save the file?"
- Ask: "Do you see any red error messages on the left side?"

**If NO errors and it saved:**
- Proceed to Task 2.4

**If there are errors:**
- Ask: "What error message do you see?"
- Common errors:
  - Syntax error: usually copy/paste went wrong, try again
  - Reference error: might mean wrong code version

---

### Task 2.4: Deploy as Web App
**Instructions to give user:**

```
DEPLOYMENT TIME!

STEPS:
1. At the top of the Apps Script editor, click: Deploy
2. A dropdown menu appears, click: "New deployment"
3. A dialog box opens, click the dropdown at top right
4. Select: "Web app"
5. You should see options:
   - "Execute as": Should say your email (e.g., your.email@gmail.com)
   - "Who has access": Click this dropdown
6. Change "Who has access" to: "Anyone, even anonymous"
7. Click the blue: "Deploy" button
8. Wait... it will process for a few seconds
9. A confirmation dialog appears with:
   - Text: "New deployment created"
   - A URL that looks like: https://script.google.com/macros/s/AKfycbw.../exec
```

**What to verify:**
- Ask: "Do you see 'New deployment created' message?"
- Ask: "Can you see a URL starting with https://script.google.com/macros/s/ ?"

**If YES:**
- Proceed to Task 2.5

**If NO:**
- Ask: "What happened instead?"
- If it says error: help troubleshoot
- If it's still processing: wait and try again
- If nothing appears: try clicking Deploy again

---

### Task 2.5: Copy Web App URL
**Instructions to give user:**

```
CRITICAL STEP: Save this URL!

In the deployment dialog, you should see a URL like:
https://script.google.com/macros/s/AKfycbwS9Xy-mIfjlFQaAEQe1Q1v_uIMtMPzvMx6W-o0hPdu-10M2AVJ3rierG9otEGxucGO/exec

DO THIS:
1. Click the copy icon next to the URL (small icon with two overlapping squares)
   OR
   Triple-click the URL to select it, then copy with Ctrl+C

2. Open a text editor (Notepad, Word, Google Docs, etc.)

3. Paste the URL there as a backup

4. KEEP THIS URL SAFE - YOU NEED IT IN THE NEXT PHASE

Example format (YOURS WILL BE DIFFERENT):
https://script.google.com/macros/s/AKfycbwS9Xy-mIfjlFQaAEQe1Q1v_uIMtMPzvMx6W-o0hPdu-10M2AVJ3rierG9otEGxucGO/exec
```

**What to verify:**
- Ask: "Do you have the URL copied to a text file?"
- Ask: "Does it start with: https://script.google.com/macros/s/ ?"
- Ask: "Does it end with: /exec ?"

**If YES to all:**
- Proceed to Phase 3

**If NO:**
- Ask: "What's missing?"
- Help them locate and copy the URL again

---

## AI Todo List - Phase 3: Connect Frontend to Backend

### Task 3.1: Locate Frontend Configuration File
**Instructions to give user:**

```
NOW: Update the frontend code

You need to edit a file called: calendars.js

This file is in your project folder.

DO THIS:
1. Find and open the file: calendars.js
2. Open it with any text editor (VS Code, Notepad, etc.)
3. Look for these lines near the top (around line 8):

const GAS_ENDPOINT = "";
const USE_SERVER = GAS_ENDPOINT.length > 0;
const SYNC_INTERVAL = 60000;

You should see:
const GAS_ENDPOINT = "";
(with empty quotes)
```

**What to verify:**
- Ask: "Did you find the calendars.js file?"
- Ask: "Can you see the line: const GAS_ENDPOINT = "" ?"

**If YES:**
- Proceed to Task 3.2

**If NO:**
- Ask: "Where is your calendars.js file located?"
- Help them find it
- If still can't find: ask if they have the setup files

---

### Task 3.2: Paste Web App URL
**Instructions to give user:**

```
CONNECTING THE FRONTEND TO BACKEND!

STEPS:
1. In calendars.js file, find this line:
   const GAS_ENDPOINT = "";

2. Click between the quotes (where it's empty)

3. Paste your Web App URL there

4. After pasting, the line should look like:
   const GAS_ENDPOINT = "https://script.google.com/macros/s/YOUR_UNIQUE_ID/exec";

5. Make sure:
   - The URL is inside the quotes
   - The URL starts with: https://script.google.com/macros/s/
   - The URL ends with: /exec
   - There's no space before or after the URL

6. Save the file (Ctrl+S)

7. Upload the updated calendars.js to your website
```

**What to verify:**
- Ask: "Is the URL now inside the quotes?"
- Ask: "Does the line look like this format: const GAS_ENDPOINT = "https://..." ?"
- Ask: "Did you save the file?"
- Ask: "Did you upload it to your website?"

**If YES to all:**
- Proceed to Phase 4

**If NO to any:**
- Ask which step had the issue
- Help fix it
- Re-verify

---

## AI Todo List - Phase 4: Testing & Verification

### Task 4.1: Open Calendar Page
**Instructions to give user:**

```
TIME TO TEST!

STEPS:
1. Go to your website
2. Click the "Calendars" link in the navigation menu
3. The calendar page should load normally

4. Open the browser Developer Tools (press F12)
5. Look for the "Console" tab at the top
6. You should see messages like:
   - "Calendar Script Loaded - Backend-First Mode"
   - "Fetching events from server..."
   - "Loaded 0 events from server." (0 because sheet is empty)

IMPORTANT: Look for red error messages
- If you see red text, there's an error
- Take a screenshot of the error
```

**What to verify:**
- Ask: "Did the calendar page load?"
- Ask: "Do you see messages in the console (F12)?"
- Ask: "Do you see 'Fetching events from server...'?"
- Ask: "Are there any RED error messages?"

**If calendar loaded and no red errors:**
- Proceed to Task 4.2

**If there are red errors:**
- Ask: "What is the error message?"
- Common errors:
  - "Failed to fetch": URL might be wrong
  - "Unexpected token": backend might have error
  - "Cannot read property": might be synchronization issue
- Help troubleshoot based on error

**If calendar didn't load:**
- Ask: "Did you get a blank page or an error?"
- Help determine the issue

---

### Task 4.2: Add Test Event
**Instructions to give user:**

```
TEST: Adding an event through the calendar form

STEPS:
1. In the calendar, click: "Add Event" button

2. A form appears, fill it in:
   - Date: 2025-12-25 (Christmas - easy to remember)
   - Title: Test Event
   - Category: Food
   - Leave others blank (optional fields)

3. Click: "Save Event" button

4. Look at the browser console (F12 > Console)

5. You should see messages:
   - "Saving event to server: ..."
   - "Event saved to server successfully."

6. The form should close
7. The event should appear on the calendar

IMPORTANT: Look for RED errors again
- If red error appears, something went wrong
```

**What to verify:**
- Ask: "Was the event added to the calendar?"
- Ask: "Do you see 'Event saved to server' in console?"
- Ask: "Are there red errors?"

**If event appears and no errors:**
- Proceed to Task 4.3

**If there are errors:**
- Ask: "What is the error message?"
- Common issues:
  - "Failed to fetch": Backend URL wrong
  - "Invalid category": Sheet tab might have wrong name
- Help troubleshoot

---

### Task 4.3: Verify in Google Sheet
**Instructions to give user:**

```
CRITICAL VERIFICATION: Check if backend saved the data!

STEPS:
1. Open your Google Sheet (JSTF Church Calendars)
2. Go to the "Food" sheet
3. Look for a new row (should be row 2 if it's the first event)
4. You should see:
   - A2: 2025-12-25
   - B2: Test Event
   - C2: (empty)
   - D2: (empty)
   - E2: (empty)

If you see this row, SUCCESS! 🎉

If you DON'T see the row:
- Something went wrong saving to the backend
- We need to troubleshoot
```

**What to verify:**
- Ask: "Can you see the new row in the Food sheet?"
- Ask: "Do you see: Date = 2025-12-25 and Title = Test Event?"

**If YES:**
- SUCCESS! Proceed to Task 4.4

**If NO:**
- Ask: "What do you see in the Food sheet?"
- Likely causes:
  - URL is wrong → verify URL in calendars.js
  - Apps Script wasn't deployed correctly → redeploy
  - Sheet name is wrong → verify sheet names match exactly
- Help troubleshoot

---

### Task 4.4: Test Calendar Refresh
**Instructions to give user:**

```
FINAL TEST: Make sure everything stays synced

STEPS:
1. Refresh the calendar page (press F5)
2. Wait 5 seconds
3. Look at the console (F12)
4. You should see:
   - "Fetching events from server..."
   - "Loaded 1 events from server." (notice it says 1 now, not 0)

5. The calendar should still show the Test Event
6. The event should be on December 25th

If the event is still there:
SUCCESS! Backend and frontend are fully synced! 🎉🎉
```

**What to verify:**
- Ask: "After refreshing, does the console show 'Loaded 1 events'?"
- Ask: "Does the Test Event still appear on the calendar?"
- Ask: "Is the event date December 25th?"

**If YES to all:**
- FULLY SUCCESS! Proceed to Task 4.5

**If NO:**
- Ask: "What happened when you refreshed?"
- Check browser console for errors
- Help troubleshoot

---

### Task 4.5: Summary & Next Steps
**What to tell user:**

```
🎉 CONGRATULATIONS! 🎉

Your backend-first calendar system is now FULLY OPERATIONAL!

SUMMARY OF WHAT YOU HAVE:
✅ Google Sheet with 5 categories (Food, Transportation, Volunteers, Activities, Maintenance)
✅ Google Apps Script backend deployed and working
✅ Calendar frontend connected to backend
✅ Events can be added and synced
✅ Everything persists in Google Sheets

WHAT YOU CAN DO NOW:

1. ADD EVENTS:
   - Use the calendar form ("Add Event" button)
   - Events automatically save to Google Sheet
   - Appear in calendar within 60 seconds

2. EDIT EVENTS:
   - Go to Google Sheet directly
   - Edit cells
   - Calendar updates automatically (every 60 seconds)

3. SHARE WITH TEAM:
   - Share the Google Sheet with team members
   - They can view and edit events
   - Everyone sees the same calendar

4. MANAGE CATEGORIES:
   - Food events in Food sheet
   - Transportation events in Transportation sheet
   - (etc. for each category)

NEXT STEPS:
1. Add some real events to test
2. Share Google Sheet with team members
3. Send team the calendar.html link
4. Let everyone start adding/viewing events!

TROUBLESHOOTING RESOURCES:
- Check BACKEND_SETUP.md for detailed help
- Check BACKEND_QUICKREF.md for quick fixes
- Browser Console (F12) shows error messages
- Google Apps Script > Logs shows backend errors
```

**What to do:**
- Ask: "Are you ready to start using it?"
- Provide contact info if more help needed
- Point to documentation for reference

---

## AI Reference: Common Issues & Solutions

### Issue 1: "Failed to fetch" error
**Cause:** Calendar can't reach backend  
**Solutions:**
1. Check GAS_ENDPOINT URL is pasted correctly in calendars.js
2. Check URL starts with: https://script.google.com/macros/s/
3. Check URL ends with: /exec
4. Try refreshing calendar page
5. Check internet connection

### Issue 2: "Event saved locally" warning
**Cause:** Backend unreachable but event saved to local cache  
**Solutions:**
1. Same as Issue 1 (check URL)
2. Verify Google Apps Script deployment is still live
3. Try adding event again

### Issue 3: Google Sheet doesn't have headers
**Cause:** Headers not set up correctly  
**Solutions:**
1. Go to each sheet (Food, Transportation, etc.)
2. Make sure row 1 has: Date | Title | Description | Time | Location
3. Make sure data starts in row 2, not row 1
4. Add headers to any missing sheets

### Issue 4: Added event but doesn't appear in Google Sheet
**Cause:** Event saved locally but not to backend  
**Solutions:**
1. Check browser console for error messages
2. Check Google Apps Script URL is correct
3. Check sheet tab names match exactly:
   - Food (capital F)
   - Transportation (capital T)
   - Volunteers (capital V)
   - Activities (capital A)
   - Maintenance (capital M)
4. Try refreshing calendar

### Issue 5: Date format wrong in Google Sheet
**Cause:** Dates showing as numbers or weird format  
**Solutions:**
1. In Google Sheet, select column A (Date column)
2. Format > Number > Date format YYYY-MM-DD
3. Or manually enter dates as: 2025-12-25

### Issue 6: Too many red errors in console
**Causes could be:**
- Apps Script URL wrong
- Apps Script has syntax errors
- Google Sheet permissions issue
- Missing sheet tabs

**Solutions:**
1. Screenshot the errors
2. Check Google Apps Script > Tools > Logs for backend errors
3. Verify all sheet names are correct
4. Verify Apps Script is deployed correctly
5. Try deploying a new version of Apps Script

---

## AI Reference: Helpful Commands

### Browser Console Commands (F12 > Console)

```javascript
// Check if backend is configured
console.log(GAS_ENDPOINT);
// Should output: https://script.google.com/macros/s/...

// Check if backend mode is on
console.log(USE_SERVER);
// Should output: true

// Check current events in memory
console.log(calendarState.events);
// Should show the events object

// Manually reload events from server
loadEvents();
// Should show in console: "Fetching events from server..."

// Check sync status
console.log(calendarState.syncing);
// Should output: false (when not syncing)
```

---

## AI Instructions Summary

**When helping user, follow this order:**

1. ✅ **Phase 1:** Google Sheet Setup (verify structure)
2. ✅ **Phase 2:** Google Apps Script Deployment (verify URL obtained)
3. ✅ **Phase 3:** Frontend Configuration (verify URL pasted)
4. ✅ **Phase 4:** Testing (verify everything works)
5. ✅ **Troubleshooting:** Any issues that come up

**Always:**
- Ask questions to verify each step
- Have user take screenshots if needed
- Look at browser console (F12) for errors
- Be patient - first time setup can be confusing
- Refer to documentation in BACKEND_*.md files
- When stuck, ask: "What error message do you see?"

---

**Created:** November 11, 2025  
**Version:** 1.0  
**For:** AI Assistants helping users set up backend-first calendar
