# Calendar System - Quick Start Guide

## ✅ What's Been Created

Your new calendar system includes:

### Files Created:
1. **`calendars.html`** - Main calendar page
2. **`calendars.css`** - Calendar styling
3. **`calendars.js`** - Calendar functionality
4. **`CALENDARS_README.md`** - Full documentation

### Files Updated:
- All navigation menus now include "Calendars" link
- `index.html`, `about.html`, `events.html`, `contact.html`, `leadership.html`, `ministries.html`, `sermons.html`

---

## 🚀 How to Use Right Now

### For Users:
1. Click **"Calendars"** in the navigation menu
2. Switch between categories: Food, Transportation, Volunteers, Activities, Maintenance
3. Click any date to see events
4. Click "Add Event" to create new entries

### Data Storage:
- Events are stored in your **browser's local storage**
- Data persists between sessions (device-specific)
- Each browser/device has its own calendar

---

## 📋 Calendar Features

✨ **5 Separate Categories:**
- 🍽️ **Food** - Meal schedules and potlucks (Red)
- 🚌 **Transportation** - Ride schedules (Teal)
- 🤝 **Volunteers** - Volunteer shifts (Mint)
- 📅 **Activities** - Programs and events (Yellow)
- 🔧 **Maintenance** - Setup and maintenance (Purple)

✨ **Interactive Features:**
- Month navigation (Previous/Next buttons)
- Today highlighted in purple
- Event indicators on calendar dates
- Detailed event sidebar
- Add/delete events
- Color-coded event cards

---

## 🔜 Next Steps: Google Sheets Integration

To connect your calendars to a Google Sheet for data syncing:

### Step 1: Create Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet named "JSTF Church Calendars"
3. Set up columns:
   - A: Date
   - B: Title
   - C: Category
   - D: Description
   - E: Time
   - F: Location

### Step 2: Create Google Apps Script
1. In your Google Sheet: **Tools > Apps Script**
2. Replace the code with a form submission handler
3. Deploy as web app

### Step 3: Update `calendars.js`
Replace the localStorage functions with fetch calls to your Apps Script:

```javascript
// Example integration point
function saveEventsToGoogle() {
    fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
        method: 'POST',
        body: JSON.stringify(calendarState.events)
    });
}
```

---

## 🎨 Customization Tips

### Add Another Category:
1. **In `calendars.html`:** Add a new tab button
2. **In `calendars.css`:** Add color definition
3. **In `calendars.js`:** Update the colorMap
4. Done! The form automatically includes it

### Change Colors:
Edit in `calendars.css`:
```css
.event-dot.food { background-color: #YOUR-COLOR; }
```

### Styling Tweaks:
The calendar uses Bootstrap 5 + custom CSS
- Primary color: `#703ABD` (purple)
- Font: Poppins (headings), Open Sans (body)
- Responsive: Works on mobile, tablet, desktop

---

## 🐛 Troubleshooting

**Events not showing?**
- Check browser console (F12) for errors
- Ensure JavaScript is enabled
- Try refreshing the page

**Calendar page blank?**
- Verify all 3 files are uploaded:
  - calendars.html
  - calendars.css
  - calendars.js
- Check that filenames are exactly correct

**Events disappeared after closing browser?**
- Using private/incognito mode? Data won't save there
- Try regular browsing mode

---

## 📱 Mobile Responsive

The calendar is fully responsive:
- ✅ Tablets: Full calendar with sidebar
- ✅ Mobile: Simplified view, tabs scroll horizontally
- ✅ Desktop: Full feature set

---

## 💾 Backup Your Events

To export calendar data:
1. Open browser console (F12)
2. Type: `copy(localStorage.getItem('jstfCalendarEvents'))`
3. Paste into a text file to save

To restore:
1. In console: `localStorage.setItem('jstfCalendarEvents', 'PASTE_DATA_HERE')`

---

## 📞 Support

For issues:
1. Check `CALENDARS_README.md` for detailed docs
2. Review browser console for error messages
3. Ensure all dependencies are loaded:
   - Bootstrap 5.3.3
   - Font Awesome 6.5.2
   - Google Fonts

---

## 🎯 What's Next?

When ready to add Google Sheets integration:
1. Let me know and I can help set up the Apps Script
2. Then we can create the form that populates your spreadsheet
3. Finally, connect calendars to Google Sheets for real-time sync

Enjoy your new calendar system! 🎉
