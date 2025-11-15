# Calendar System Documentation

## Overview

The JSTF North calendar system provides separate, categorized calendars for managing:
- **Food**: Meal schedules, potlucks, and food-related events
- **Transportation**: Ride schedules and transportation logistics
- **Volunteers**: Volunteer shift scheduling
- **Activities**: Church activities and programs
- **Maintenance**: Facility maintenance and setup tasks

## Features

### 1. **Multi-Category Calendar View**
- Switch between different calendar types using the tab buttons at the top
- Each category has its own color-coded indicator (dots on calendar dates)
- View all events for a selected date in the sidebar

### 2. **Interactive Calendar**
- Click any date to view events scheduled for that day
- Navigate between months using Previous/Next buttons
- Today's date is highlighted with a gradient background
- Selected date is indicated with a colored border

### 3. **Event Management**
- **Add Events**: Click the "Add Event" button in the sidebar
- **View Events**: See all events for a date in the right sidebar
- **Delete Events**: Remove events using the trash icon next to each event
- **Event Details**: Each event can include:
  - Title
  - Category
  - Description
  - Time
  - Location

### 4. **Visual Indicators**
- Color-coded dots on calendar dates show event types
- Legend at the bottom explains each color
- Sidebar shows detailed event information for selected dates

## File Structure

```
JSFTNorth-main/
├── calendars.html       # Main calendar page
├── calendars.css        # Calendar styling
├── calendars.js         # Calendar functionality
├── script.js            # (Updated with navigation)
└── index.html           # (Updated with calendar link)
```

## How to Use

### For Users

1. **Navigate to Calendars**
   - Click "Calendars" in the main navigation menu
   - You'll see the full calendar interface

2. **View Different Categories**
   - Click the tab buttons (Food, Transportation, Volunteers, Activities, Maintenance)
   - The calendar updates to show events from that category

3. **View Events**
   - Click any date on the calendar
   - Events for that date appear in the right sidebar
   - Details include time, location, and description

4. **Find Upcoming Events**
   - Use Previous/Next buttons to navigate months
   - Today's date is highlighted in purple

### For Administrators/Church Staff

1. **Add an Event**
   - Click "Add Event" in the sidebar
   - Fill in the event details:
     - Select the date
     - Enter event title (required)
     - Choose category (required)
     - Add description (optional)
     - Add time (optional)
     - Add location (optional)
   - Click "Save Event"

2. **Edit or Delete Events**
   - Click the date to view events
   - Click the trash icon next to an event to delete it
   - Confirm the deletion

3. **Data Storage**
   - Events are stored in browser's local storage
   - Data persists between sessions
   - **Note**: Data is device-specific (different devices have separate calendars)

## Customization

### Add a New Calendar Category

1. **In `calendars.html`:**
   - Add a new button to the calendar-tabs div:
   ```html
   <button class="calendar-tab" data-calendar="new-category" title="New Category">
       <i class="fas fa-icon-name"></i>
       <span>New Category</span>
   </button>
   ```

2. **In `calendars.css`:**
   - Add color mapping:
   ```css
   .event-dot.new-category {
       background-color: #COLOR-CODE;
   }
   .event-card.new-category {
       border-left-color: #COLOR-CODE;
   }
   ```

3. **In `calendars.js`:**
   - Update the colorMap object:
   ```javascript
   const colorMap = {
       // ... existing entries ...
       'new-category': '#COLOR-CODE'
   };
   ```
   - The category will automatically appear in the form dropdown

### Change Colors

Edit the color codes in `calendars.css`:
```css
.event-dot.food { background-color: #FF6B6B; }        /* Red */
.event-dot.transportation { background-color: #4ECDC4; } /* Teal */
.event-dot.volunteer { background-color: #95E1D3; }    /* Mint */
.event-dot.activities { background-color: #FFD93D; }   /* Yellow */
.event-dot.maintenance { background-color: #6C63FF; }  /* Purple */
```

## Technical Details

### Data Storage
- Events are stored in browser's localStorage
- Key: `jstfCalendarEvents`
- Format: JSON object with categories as keys

### Event Object Structure
```javascript
{
  id: "event-1234567890",
  date: "2025-12-25",
  title: "Christmas Potluck",
  category: "food",
  description: "Community Christmas celebration",
  time: "18:30",
  location: "Fellowship Hall"
}
```

### Browser Compatibility
- Chrome, Firefox, Safari, Edge (all modern versions)
- Requires JavaScript enabled
- Local storage must be available

## Future Enhancements

The calendar system is designed to be easily integrated with Google Sheets using the existing Google Apps Script endpoint in your project. When ready, you can:

1. Create a Google Sheet for event management
2. Modify `calendars.js` to fetch/push events to the sheet
3. Replace localStorage with cloud-based data storage
4. Enable real-time sync across devices

### Example Integration Points

```javascript
// Replace this in calendars.js:
function saveEventsToLocalStorage() {
    // POST events to Google Apps Script
}

function loadEventsFromLocalStorage() {
    // Fetch events from Google Apps Script
}
```

## Troubleshooting

**Events not showing up?**
- Check browser console for errors (F12)
- Verify localStorage is enabled
- Try refreshing the page

**Calendar not loading?**
- Ensure all three files are in the correct location
- Check that script.js is loaded before calendars.js
- Clear browser cache and reload

**Events disappeared?**
- Check if you're using the same browser
- Private/Incognito mode doesn't save data
- Check browser's storage settings

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all files are in the correct location
3. Ensure Bootstrap and Font Awesome are loading correctly

---

**Version**: 1.0  
**Last Updated**: November 2025
