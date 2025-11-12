/**
 * JSTF Church Calendars - Google Apps Script Backend
 * 
 * This script reads/writes event data from multiple Google Sheets tabs.
 * Each tab represents a category (Food, Transportation, Volunteers, Activities, Maintenance).
 * 
 * Deploy as Web App with:
 *   - Execute as: Me (your account)
 *   - Who has access: Anyone, even anonymous
 */

// IMPORTANT: Replace this with your actual spreadsheet ID (from URL)
// Example: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p"
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";

const CATEGORIES = ["Food", "Transportation", "Volunteers", "Activities", "Maintenance"];
const HEADER_ROW = 1;
const HEADERS = ["Date", "Title", "Description", "Time", "Location"];

/**
 * doGet: Fetch all events from all category sheets.
 * Returns JSON array of all events across all categories.
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const allEvents = [];

    // Read from each category sheet
    CATEGORIES.forEach(category => {
      const sheet = ss.getSheetByName(category);
      if (sheet) {
        const events = readSheetEvents(sheet, category);
        allEvents.push(...events);
      }
    });

    return createJsonResponse(200, "Success", { events: allEvents });
  } catch (error) {
    Logger.log("doGet Error: " + error.toString());
    return createJsonResponse(500, "Error: " + error.toString(), {});
  }
}

/**
 * doPost: Add or update a single event.
 * Expects JSON body with: { date, title, category, description, time, location }
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    if (!e || !e.postData) {
      return createJsonResponse(400, "Error: No data received. Check that request is sending JSON.", {});
    }

    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createJsonResponse(400, "Error: Invalid JSON format. " + parseError.toString(), {});
    }

    // Support both single event and array of events
    const events = Array.isArray(payload) ? payload : [payload];

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let addedCount = 0;

    events.forEach(event => {
      const { date, title, category, description, time, location } = event;

      if (!date || !title || !category) {
        throw new Error("Event must have date, title, and category.");
      }

      if (!CATEGORIES.includes(category)) {
        throw new Error(`Invalid category: ${category}. Must be one of: ${CATEGORIES.join(", ")}`);
      }

      const sheet = ss.getSheetByName(category);
      if (!sheet) {
        throw new Error(`Sheet not found for category: ${category}`);
      }

      // Append new row
      sheet.appendRow([date, title, description || "", time || "", location || ""]);
      addedCount++;
    });

    return createJsonResponse(200, `Success: ${addedCount} event(s) added.`, { added: addedCount });
  } catch (error) {
    Logger.log("doPost Error: " + error.toString());
    return createJsonResponse(500, "Error: " + error.toString(), {});
  } finally {
    lock.releaseLock();
  }
}

/**
 * Helper: Read all events from a single sheet.
 * @param {Sheet} sheet The Google Sheet to read from.
 * @param {string} category The category name (e.g., "Food").
 * @returns {Array} Array of event objects.
 */
function readSheetEvents(sheet, category) {
  const events = [];
  const data = sheet.getDataRange().getValues();

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const date = row[0];
    const title = row[1];
    const description = row[2];
    const time = row[3];
    const location = row[4];

    // Skip empty rows
    if (!date || !title) continue;

    events.push({
      id: `${category}-${i}-${date}`, // Simple unique ID based on sheet, row, date
      date: formatDateValue(date),
      title: title.toString().trim(),
      category: category.toLowerCase(),
      description: description ? description.toString().trim() : "",
      time: time ? time.toString().trim() : "",
      location: location ? location.toString().trim() : ""
    });
  }

  return events;
}

/**
 * Helper: Convert spreadsheet date value to YYYY-MM-DD format.
 * Handles both date objects and string formats.
 */
function formatDateValue(dateValue) {
  if (!dateValue) return "";

  if (typeof dateValue === "string") {
    // If already a string, try to parse it
    const d = new Date(dateValue);
    if (!isNaN(d)) {
      return formatDate(d);
    }
    return dateValue;
  }

  if (dateValue instanceof Date) {
    return formatDate(dateValue);
  }

  // Assume it's a serial date number (Google Sheets format)
  try {
    const d = new Date((dateValue - 25569) * 86400 * 1000);
    return formatDate(d);
  } catch (e) {
    return dateValue.toString();
  }
}

/**
 * Helper: Format a Date object to YYYY-MM-DD.
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Helper: Create a standardized JSON response.
 */
function createJsonResponse(status, message, data = {}) {
  const response = {
    status: status,
    message: message,
    data: data
  };
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Copy this entire script into Google Apps Script editor (in your Google Sheet).
 * 2. Save the script (File > Save).
 * 3. Deploy as Web App:
 *    - Click "Deploy" > "New deployment"
 *    - Select type: "Web app"
 *    - Execute as: Me (your Google account)
 *    - Who has access: "Anyone, even anonymous"
 *    - Click "Deploy"
 * 4. Copy the resulting URL (looks like: https://script.google.com/macros/s/AKfy...../exec)
 * 5. Paste this URL into calendars.js as the GAS_ENDPOINT value.
 * 
 * Testing in Google Sheets:
 *  - Go to Extensions > Apps Script > Logs to see debug output.
 */
