# How to Get Your Google Spreadsheet ID

The Google Apps Script needs to know which spreadsheet to use. Here's how to find and add your Spreadsheet ID:

---

## Step 1: Open Your Google Sheet

Open the spreadsheet "JSTF Church Calendars" in Google Sheets.

**URL will look like:**
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p/edit#gid=0
```

---

## Step 2: Find Your Spreadsheet ID

The spreadsheet ID is the long string between `/d/` and `/edit`

**Example:**
```
URL: https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p/edit#gid=0
                                            ↓↓↓ THIS IS YOUR ID ↓↓↓
ID:  1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

### How to Copy It:
1. Click on the address bar (URL)
2. Look for the long string between `/d/` and `/edit`
3. **Double-click to select it**
4. **Ctrl+C to copy** (or right-click → Copy)

---

## Step 3: Update Google Apps Script

1. Go back to **Google Apps Script** (where you created the script)
2. Find this line at the very top:

```javascript
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
```

3. **Replace** `YOUR_SPREADSHEET_ID_HERE` with your actual ID

**Example of what it should look like:**

```javascript
const SPREADSHEET_ID = "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p";
```

---

## Step 4: Save and Deploy

1. **Press Ctrl+S** to save
2. Click **Deploy** button
3. Click **New Deployment**
4. Choose type: **Web app**
5. Execute as: **Your email**
6. Who has access: **Anyone, even anonymous**
7. Click **Deploy**
8. Copy the URL that appears
9. Paste it in `calendars.js` line 8 as `GAS_ENDPOINT`

---

## Verify It Works

1. Open `calendars.html` in your browser
2. Open **Developer Tools** (F12)
3. Go to **Console** tab
4. You should see:
   - ✅ **Green message**: "✅ Events loaded successfully"
   - ✅ **No red errors**

If you see red errors, check:
- Is your Spreadsheet ID correct?
- Are all 5 sheet tabs created?
- Are column headers exactly: Date, Title, Description, Time, Location?

---

## Common Mistakes

❌ **Mistake 1:** Using the entire URL
```javascript
const SPREADSHEET_ID = "https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p/edit#gid=0";
```
✅ **Correct:**
```javascript
const SPREADSHEET_ID = "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p";
```

❌ **Mistake 2:** Including quotes in the wrong place
```javascript
const SPREADSHEET_ID = 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p;  // No quotes = ERROR
```
✅ **Correct:**
```javascript
const SPREADSHEET_ID = "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p";  // With quotes
```

❌ **Mistake 3:** Only copying part of the ID
```javascript
const SPREADSHEET_ID = "1a2b3c4d5e6f7g";  // Too short = ERROR
```
✅ **Correct:** Full ID (usually 30+ characters)

---

## Still Not Working?

**Check this checklist:**

- [ ] Spreadsheet is named exactly "JSTF Church Calendars"
- [ ] All 5 tabs exist: Food, Transportation, Volunteers, Activities, Maintenance
- [ ] Each tab has headers: Date | Title | Description | Time | Location
- [ ] Spreadsheet ID is 30+ characters long
- [ ] Spreadsheet ID has NO quotes around it in the URL
- [ ] Google Apps Script is deployed as Web App
- [ ] Web App is set to "Anyone, even anonymous"
- [ ] You copied the correct URL from the deployment dialog
- [ ] GAS_ENDPOINT in calendars.js has the full URL ending in /usercontent/

---

## Getting Help

**If you're stuck:**

1. Share the error from the browser console (F12 → Console)
2. Verify your Spreadsheet ID by:
   - Opening sheet in browser
   - Looking at URL in address bar
   - Copying the part between `/d/` and `/edit`
3. Ask an AI assistant: "Here's my error: [ERROR]. What does it mean?"

---

**Still have questions?** Use `AI_ASSISTANT_PROMPTS.md` to get help from Gemini or ChatGPT!
