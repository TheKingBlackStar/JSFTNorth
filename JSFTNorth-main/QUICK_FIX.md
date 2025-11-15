# 🔧 URGENT FIX: Google Apps Script Errors

**Problem:** You got these errors:
```
Setup Error: TypeError: SpreadsheetApp.openByName is not a function
doPost Error: TypeError: Cannot read properties of undefined
```

**Solution:** This guide explains the fix.

---

## What Went Wrong

The Google Apps Script code tried to use a function `openByName()` that doesn't exist. Google only provides `openById()`.

---

## How to Fix (2 Steps)

### Step 1: Get Your Spreadsheet ID

1. **Open your Google Sheet** "JSTF Church Calendars"
2. **Look at the URL** in your browser:
   ```
   https://docs.google.com/spreadsheets/d/XXXXXXX/edit
                                          ↑↑↑↑↑↑↑
                                     This part
   ```
3. **Copy that long string** (it's about 30+ characters)
4. **Don't include** `/edit` or anything after it

**Example:**
```
My URL:  https://docs.google.com/spreadsheets/d/1KhZrGy2x8kL_mN4pP9qRsT/edit#gid=0
My ID:   1KhZrGy2x8kL_mN4pP9qRsT
```

---

### Step 2: Update Google Apps Script

1. **Go back to Google Apps Script** (your deployment project)
2. **Open the file** `GOOGLE_APPS_SCRIPT.gs`
3. **Find line 11** that says:
   ```javascript
   const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
   ```
4. **Replace** `YOUR_SPREADSHEET_ID_HERE` with your actual ID
5. **Make it look like:**
   ```javascript
   const SPREADSHEET_ID = "1KhZrGy2x8kL_mN4pP9qRsT";
   ```
6. **Press Ctrl+S** to save

---

## Step 3: Deploy Again

1. Click **Deploy** button
2. Click **Manage Deployments** (gear icon)
3. Delete the old deployment (click trash icon)
4. Click **New Deployment**
5. **Type:** Web app
6. **Execute as:** Your email
7. **Who has access:** Anyone (even anonymous)
8. Click **Deploy**
9. **Copy the new URL**
10. Paste into `calendars.js` line 8 as `GAS_ENDPOINT`

---

## Verify It Works

1. Open `calendars.html` in browser
2. Press **F12** (opens Developer Tools)
3. Click **Console** tab
4. Check for messages:
   - ✅ Green text = Success!
   - ❌ Red text = Still has problems

**Should see:**
```
✅ Events loaded successfully
✅ Calendar initialized
```

---

## If It Still Doesn't Work

**Check these:**

1. **Is your Spreadsheet ID correct?**
   - Open Google Sheet
   - Copy ID from URL again (very carefully)
   - Make sure it's 30+ characters
   - Paste into line 11 of Google Apps Script
   - Make sure there are quotes around it: `"ID_HERE"`

2. **Are your sheet tabs named correctly?**
   - Open Google Sheet
   - Check that you have exactly these 5 tabs:
     - Food
     - Transportation
     - Volunteers
     - Activities
     - Maintenance
   - Check spelling (capital letters matter!)

3. **Do the headers exist?**
   - In each tab, row 1 should have:
     - Column A: Date
     - Column B: Title
     - Column C: Description
     - Column D: Time
     - Column E: Location

4. **Was the web app deployed correctly?**
   - Go back to Google Apps Script
   - Click **Deployments** button
   - You should see ONE entry
   - It should be type "Web app"
   - It should say "Anyone, even anonymous"

---

## Get Help from AI

**Copy this and send to Gemini/ChatGPT:**

```
I'm getting this error when trying to deploy my Google Apps Script:
[PASTE YOUR ERROR]

I've done:
1. Created Google Sheet named "JSTF Church Calendars"
2. Created 5 tabs: Food, Transportation, Volunteers, Activities, Maintenance
3. Added headers: Date, Title, Description, Time, Location
4. Got my Spreadsheet ID from the URL
5. Updated line 11 in Google Apps Script with my Spreadsheet ID

What should I check next?
```

---

## Next Steps (After This Fix)

Once you see ✅ messages in console:

1. Add a test event via the calendar form
2. Check that it appears in your Google Sheet
3. Refresh the browser
4. Check that the event still shows up
5. You're done! 🎉

---

**For detailed setup guide:** See `BACKEND_SETUP.md`  
**For full troubleshooting:** See `BACKEND_QUICKREF.md`  
**For AI assistance:** See `AI_ASSISTANT_PROMPTS.md`

---

**Created:** November 11, 2025  
**Purpose:** Quick fix for common Google Apps Script deployment errors
