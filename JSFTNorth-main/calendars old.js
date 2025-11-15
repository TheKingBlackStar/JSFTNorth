// calendars.js - Calendar functionality with Google Apps Script Backend

// ========================================
// CONFIGURATION
// ========================================
// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwS9Xy-mIfjlFQaAEQe1Q1v_uIMtMPzvMx6W-o0hPdu-10M2AVJ3rierG9otEGxucGO/exec"; // E.g., "https://script.google.com/macros/s/AKfy.../exec"
const USE_SERVER = GAS_ENDPOINT.length > 0 && GAS_ENDPOINT !== "PASTE_YOUR_DEPLOYED_WEB_APP_URL_HERE"; // Only use server if endpoint is set
const SYNC_INTERVAL = 60000; // Auto-sync every 60 seconds (set to 0 to disable)

document.addEventListener('DOMContentLoaded', function() {
  // --- Check for Alert Replacement ---
  // IMPORTANT: Since alert() is forbidden, we need a simple modal replacement.
  function showCustomAlert(message) {
    const alertModal = new bootstrap.Modal(document.getElementById('customAlertModal'));
    document.getElementById('customAlertBody').textContent = message;
    alertModal.show();
  }
  
  // Custom Confirmation Dialog Replacement
  function showCustomConfirm(message, callback) {
    const confirmModal = new bootstrap.Modal(document.getElementById('customConfirmModal'));
    document.getElementById('customConfirmBody').textContent = message;
    
    // Remove previous listeners
    const confirmBtn = document.getElementById('customConfirmYes');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('click', () => {
        confirmModal.hide();
        callback(true);
    });

    // Handle No button click
    const confirmNoBtn = document.getElementById('customConfirmNo');
    confirmNoBtn.onclick = () => confirmModal.hide();

    confirmModal.show();
  }
  
  // Override native functions
  window.alert = showCustomAlert;
  window.confirm = showCustomConfirm;

  console.log("Calendar Script Loaded - Backend-First Mode");

  // State Management
  const calendarState = {
    currentDate: new Date(),
    selectedDate: new Date(),
    activeCalendar: 'food',
    events: {
      food: [],
      transportation: [],
      volunteer: [],
      activities: [],
      maintenance: []
    },
    syncing: false
  };

  // Color mapping for each category
  const colorMap = {
    food: '#FF6B6B',
    transportation: '#4ECDC4',
    volunteer: '#95E1D3',
    activities: '#FFD93D',
    maintenance: '#6C63FF'
  };

  // Initialize
  loadEvents();
  renderCalendar();
  setupEventListeners();
  
  // Optional: Auto-sync with server every 60 seconds
  if (USE_SERVER && SYNC_INTERVAL > 0) {
    setInterval(() => {
      console.log("Auto-syncing with server...");
      loadEvents();
    }, SYNC_INTERVAL);
  }

  /**
   * Setup Event Listeners
   */
  function setupEventListeners() {
    // Calendar tab switching
    document.querySelectorAll('.calendar-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        const calendarType = this.getAttribute('data-calendar');
        switchCalendar(calendarType);
      });
    });

    // Month navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
      calendarState.currentDate.setMonth(calendarState.currentDate.getMonth() - 1);
      renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
      calendarState.currentDate.setMonth(calendarState.currentDate.getMonth() + 1);
      renderCalendar();
    });

    // Event form submission
    document.getElementById('saveEventBtn').addEventListener('click', saveEvent);

    // Close modal when escape is pressed
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const modal = bootstrap.Modal.getInstance(document.getElementById('addEventModal'));
        const alertModal = bootstrap.Modal.getInstance(document.getElementById('customAlertModal'));
        const confirmModal = bootstrap.Modal.getInstance(document.getElementById('customConfirmModal'));
        
        if (modal && modal._isShown) modal.hide();
        if (alertModal && alertModal._isShown) alertModal.hide();
        if (confirmModal && confirmModal._isShown) confirmModal.hide();
      }
    });
  }

  /**
   * Switch Calendar Category
   */
  function switchCalendar(calendarType) {
    calendarState.activeCalendar = calendarType;

    // Update active tab
    document.querySelectorAll('.calendar-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-calendar="${calendarType}"]`).classList.add('active');

    // Re-render calendar
    renderCalendar();
    updateEventsList();
  }

  /**
   * Render the Calendar
   */
  function renderCalendar() {
    const year = calendarState.currentDate.getFullYear();
    const month = calendarState.currentDate.getMonth();

    // Update month/year display
    const monthYear = calendarState.currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
    document.getElementById('monthYear').textContent = monthYear;

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const calendarDaysContainer = document.getElementById('calendarDays');
    calendarDaysContainer.innerHTML = '';

    // Previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayElement = createDayElement(daysInPrevMonth - i, true);
      calendarDaysContainer.appendChild(dayElement);
    }

    // Current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayElement = createDayElement(day, false, date);

      // Mark today
      if (date.toDateString() === today.toDateString()) {
        dayElement.classList.add('today');
      }

      // Mark selected date
      if (date.toDateString() === calendarState.selectedDate.toDateString()) {
        dayElement.classList.add('selected');
      }

      dayElement.addEventListener('click', () => selectDate(date));
      calendarDaysContainer.appendChild(dayElement);
    }

    // Next month's days
    const totalCells = calendarDaysContainer.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      const dayElement = createDayElement(day, true);
      calendarDaysContainer.appendChild(dayElement);
    }
  }

  /**
   * Create Day Element
   */
  function createDayElement(day, isOtherMonth = false, date = null) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    if (isOtherMonth) dayElement.classList.add('other-month');

    // Day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayElement.appendChild(dayNumber);

    // Event indicators
    if (date && !isOtherMonth) {
      const eventsContainer = document.createElement('div');
      eventsContainer.className = 'day-events';

      // Get events for this date and category
      const dateStr = formatDate(date);
      
      // Filter events based on the currently active category only for dots on the calendar grid
      const dayEvents = calendarState.events[calendarState.activeCalendar].filter(
        event => event.date === dateStr
      );

      dayEvents.slice(0, 3).forEach(event => {
        const dot = document.createElement('div');
        dot.className = `event-dot ${event.category}`;
        eventsContainer.appendChild(dot);
      });

      // Show more indicator
      if (dayEvents.length > 3) {
        const moreIndicator = document.createElement('div');
        moreIndicator.style.fontSize = '0.65rem';
        moreIndicator.style.color = '#666';
        moreIndicator.textContent = `+${dayEvents.length - 3}`;
        eventsContainer.appendChild(moreIndicator);
      }

      dayElement.appendChild(eventsContainer);
    }

    return dayElement;
  }

  /**
   * Select a Date
   */
  function selectDate(date) {
    calendarState.selectedDate = date;
    renderCalendar();
    updateEventsList();

    // Update sidebar
    const dateDisplay = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    document.getElementById('selectedDateDisplay').textContent = dateDisplay;
  }

  /**
   * Update Events List in Sidebar
   */
  function updateEventsList() {
    const eventsList = document.getElementById('eventsList');
    const dateStr = formatDate(calendarState.selectedDate);

    // Get all events for selected date across ALL categories
    const allEvents = [];
    Object.keys(calendarState.events).forEach(category => {
      calendarState.events[category].forEach(event => {
        if (event.date === dateStr) {
          // The event object already contains the category, but we ensure it's here
          allEvents.push({ ...event, category });
        }
      });
    });

    // Sort by time
    allEvents.sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });

    if (allEvents.length === 0) {
      eventsList.innerHTML = '<p class="text-muted">No events scheduled for this date</p>';
      return;
    }

    // Use event.id to ensure the delete function targets the correct event
    eventsList.innerHTML = allEvents.map(event => `
      <div class="event-card ${event.category}">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <h6>${event.title}</h6>
            <p>${event.description || 'No description'}</p>
            ${event.time ? `<div class="event-time"><i class="fas fa-clock"></i> ${event.time}</div>` : ''}
            ${event.location ? `<div class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</div>` : ''}
          </div>
          <!-- Pass both ID and Category to delete for server (future) -->
          <button class="btn btn-sm btn-link text-danger" onclick="window.deleteEvent('${event.id}', '${event.category}')" title="Delete event">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Save Event
   */
  async function saveEvent() {
    const eventDate = document.getElementById('eventDate').value;
    const eventTitle = document.getElementById('eventTitle').value;
    const eventCategory = document.getElementById('eventCategory').value;
    const eventDescription = document.getElementById('eventDescription').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventLocation = document.getElementById('eventLocation').value;

    if (!eventDate || !eventTitle || !eventCategory) {
      alert('Please fill in all required fields');
      return;
    }

    const newEvent = {
      // Note: We don't assign an ID here; the server will assign one (or use row index)
      date: eventDate,
      title: eventTitle,
      // Send category normalized (e.g., 'food') to match JS state object keys
      category: eventCategory, 
      description: eventDescription,
      time: eventTime,
      location: eventLocation
    };

    // Save to server (or local if no server)
    await saveEventToServer(newEvent);

    // Clear form
    document.getElementById('eventForm').reset();

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addEventModal'));
    if (modal) modal.hide();

    console.log('Event save attempt finished.');
  }

  /**
   * Delete Event (Global function)
   */
  window.deleteEvent = function(eventId, category) {
    
    // Use the custom confirmation dialog
    window.confirm('Are you sure you want to delete this event?', (result) => {
        if (result) {
            if (category) {
              deleteEventFromServer(eventId, category);
            } else {
              // Fallback to searching category if not passed (though it should be)
              let foundCategory = null;
              Object.keys(calendarState.events).forEach(cat => {
                  if (calendarState.events[cat].some(e => e.id === eventId)) {
                      foundCategory = cat;
                  }
              });
              if (foundCategory) {
                deleteEventFromServer(eventId, foundCategory);
              }
            }
        }
    });
  };

  /**
   * Local Storage Management (Fallback for Offline)
   */
  function saveEventsToLocalStorage() {
    localStorage.setItem('jstfCalendarEvents', JSON.stringify(calendarState.events));
  }

  function loadEventsFromLocalStorage() {
    const stored = localStorage.getItem('jstfCalendarEvents');
    if (stored) {
      try {
        const loadedEvents = JSON.parse(stored);
        // Only load if the structure looks right
        if (typeof loadedEvents === 'object' && loadedEvents.food) {
          calendarState.events = loadedEvents;
        }
      } catch (e) {
        console.error('Error loading calendar events from localStorage:', e);
      }
    }
  }

  /**
   * Server Sync Functions (Google Apps Script Backend)
   */
  async function loadEvents() {
    if (USE_SERVER && !calendarState.syncing) {
      calendarState.syncing = true;
      try {
        console.log("Fetching events from server...");
        // Use GET request with no parameters for doGet() endpoint
        const response = await fetch(GAS_ENDPOINT);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.status === 200 && result.data && result.data.events) {
          // Clear existing events
          Object.keys(calendarState.events).forEach(key => {
            calendarState.events[key] = [];
          });
          
          let eventCount = 0;
          // Populate from server
          result.data.events.forEach(event => {
            // Category from server is expected to be lowercase (e.g., 'food')
            const category = (event.category || 'food').toLowerCase();
            if (calendarState.events[category]) {
              calendarState.events[category].push(event);
              eventCount++;
            }
          });

          console.log(`Loaded ${eventCount} events from server.`);
          saveEventsToLocalStorage(); // Cache locally
          renderCalendar();
          updateEventsList();
        } else {
          // Handle server error message, including config errors from Apps Script
          throw new Error(result.message || "Unknown server error");
        }
      } catch (error) {
        console.error('Error loading events from server:', error.message);
        // Fallback to localStorage
        console.log("Falling back to local cache...");
        loadEventsFromLocalStorage();
        renderCalendar();
        updateEventsList();
      } finally {
        calendarState.syncing = false;
      }
    } else if (!USE_SERVER) {
      // No server configured, use local storage only
      loadEventsFromLocalStorage();
      renderCalendar();
      updateEventsList();
    }
  }

  async function saveEventToServer(event) {
    if (!USE_SERVER) {
      // Server not configured, save only to local storage
      // The event ID generation is currently reliant on the server (sheet row index)
      alert("Server is not configured. Please paste the Web App URL into GAS_ENDPOINT to enable saving.");
      return; 
    }

    try {
      console.log("Saving event to server:", event);
      // The category must be sent in the case sensitive format expected by the Apps Script
      // The Apps Script handles normalization (e.g. 'food' -> 'Food') but let's ensure it's sent correct.
      const payload = { ...event, category: event.category.charAt(0).toUpperCase() + event.category.slice(1).toLowerCase() };
      
      const response = await fetch(GAS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.status === 200 || result.status === 207) {
        console.log("Event saved to server successfully:", result.message);
        // Reload from server to ensure consistency and grab the new event ID
        await loadEvents();
        return true;
      } else {
        throw new Error(result.message || "Server error");
      }
    } catch (error) {
      console.error('Error saving event to server:', error.message);
      alert(`Warning: Could not sync to server. Error: ${error.message}`);
      return false;
    }
  }

async function deleteEventFromServer(eventId, category) {
  if (!USE_SERVER) {
    alert("Server not configured. Event deleted locally only.");
    return;
  }

  try {
    console.log(`Deleting event from server: ${eventId} (${category})`);

    const payload = { id: eventId, category };

    const response = await fetch(GAS_ENDPOINT + "?action=delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === 200) {
      console.log("Deleted from server successfully.");
      calendarState.events[category] = calendarState.events[category].filter(e => e.id !== eventId);
      saveEventsToLocalStorage();
      updateEventsList();
      renderCalendar();
      alert("Event deleted successfully.");
    } else {
      throw new Error(result.message || "Unknown server error");
    }
  } catch (err) {
    console.error("Error deleting event:", err);
    alert("Error deleting event: " + err.message);
  }
}


  /**
   * Utility Functions
   */
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Set initial selected date display
  const todayDisplay = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById('selectedDateDisplay').textContent = todayDisplay;

  // Set current date in form when modal opens
  document.getElementById('addEventModal').addEventListener('show.bs.modal', function() {
    const dateInput = document.getElementById('eventDate');
    if (!dateInput.value) {
      dateInput.value = formatDate(calendarState.selectedDate);
    }
  });

  console.log('Calendar fully initialized', calendarState.events);
});