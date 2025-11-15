// calendars.js — Multi-calendar with Firebase database (NO localStorage)

import { db } from './firebase-config.js';
import { collection, query, onSnapshot, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Color map used for dots
const colorMap = {
  food: "#FF6B6B",
  transportation: "#4ECDC4",
  volunteer: "#95E1D3",
  volunteers: "#95E1D3",
  activities: "#FFD93D",
  maintenance: "#6C63FF"
};

// Normalize category keys
function normalizeCategory(cat) {
  if (!cat) return "food";
  const c = String(cat).toLowerCase().trim();
  if (c === "volunteers") return "volunteer";
  return c;
}

document.addEventListener("DOMContentLoaded", () => {
  const calendarState = {
    currentDate: new Date(),
    selectedDate: new Date(),
    activeCalendar: "all",
    events: {
      food: [],
      transportation: [],
      volunteer: [],
      activities: [],
      maintenance: []
    }
  };

  init();

  function init() {
    bindUI();
    loadEventsFromFirebase();
    renderCalendar();
    updateSelectedDateLabel();
  }

  function bindUI() {
    document.querySelectorAll(".calendar-tab").forEach(tab => {
      tab.addEventListener("click", function () {
        const cal = this.getAttribute("data-calendar");
        switchCalendar(cal);
      });
    });

    document.getElementById("prevMonth").addEventListener("click", () => {
      calendarState.currentDate.setMonth(calendarState.currentDate.getMonth() - 1);
      renderCalendar();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
      calendarState.currentDate.setMonth(calendarState.currentDate.getMonth() + 1);
      renderCalendar();
    });
  }

  function switchCalendar(type) {
    calendarState.activeCalendar = type;

    document.querySelectorAll(".calendar-tab").forEach(t => t.classList.remove("active"));
    const btn = document.querySelector(`.calendar-tab[data-calendar="${type}"]`);
    if (btn) btn.classList.add("active");

    renderCalendar();
    updateEventsList();
  }

  // =====================
  // Firebase Data Loading
  // =====================
  function loadEventsFromFirebase() {
    const eventsQuery = query(collection(db, 'calendarEvents'), orderBy('date', 'asc'));
    
    onSnapshot(eventsQuery, (snapshot) => {
      // Reset all events
      Object.keys(calendarState.events).forEach(k => (calendarState.events[k] = []));

      snapshot.forEach((docSnap) => {
        const event = docSnap.data();
        const cat = normalizeCategory(event.category);
        
        if (calendarState.events[cat]) {
          calendarState.events[cat].push({
            id: docSnap.id,
            date: event.date,
            title: event.title || '',
            category: cat,
            description: event.description || '',
            time: event.time || '',
            location: event.location || '',
            food: event.food || '',
            cook: event.cook || ''
          });
        }
      });

      renderCalendar();
      updateEventsList();
    }, (error) => {
      console.error("Error loading events from Firebase:", error);
    });
  }

  // =====================
  // Rendering
  // =====================
  function renderCalendar() {
    const year = calendarState.currentDate.getFullYear();
    const month = calendarState.currentDate.getMonth();

    document.getElementById("monthYear").textContent = calendarState.currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const container = document.getElementById("calendarDays");
    container.innerHTML = "";

    // prev-month cells
    for (let i = firstDay - 1; i >= 0; i--) {
      const el = createDayCell(daysInPrevMonth - i, true);
      container.appendChild(el);
    }

    const today = new Date();
    // current-month cells
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const el = createDayCell(d, false, date);

      if (date.toDateString() === today.toDateString()) el.classList.add("today");
      if (date.toDateString() === calendarState.selectedDate.toDateString()) el.classList.add("selected");

      el.addEventListener("click", () => {
        calendarState.selectedDate = date;
        renderCalendar();
        updateSelectedDateLabel();
        updateEventsList();
      });

      container.appendChild(el);
    }

    // next-month cells (fill to 6 rows)
    const totalCells = container.children.length;
    const remaining = 42 - totalCells;
    for (let d = 1; d <= remaining; d++) {
      const el = createDayCell(d, true);
      container.appendChild(el);
    }

    updateEventsList();
  }

  function createDayCell(dayNum, isOtherMonth = false, dateObj = null) {
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    if (isOtherMonth) cell.classList.add("other-month");

    const num = document.createElement("div");
    num.className = "day-number";
    num.textContent = dayNum;
    cell.appendChild(num);

    if (dateObj && !isOtherMonth) {
      const dateStr = formatDate(dateObj);

      // collect all events for this date across all categories
      const dayEvents = [];
      Object.keys(calendarState.events).forEach(cat => {
        calendarState.events[cat].forEach(ev => {
          if (ev.date === dateStr) dayEvents.push({ ...ev, category: normalizeCategory(ev.category) });
        });
      });

      if (dayEvents.length > 0) {
        const dotsWrap = document.createElement("div");
        dotsWrap.className = "day-events";

        dayEvents.slice(0, 3).forEach(ev => {
          const dot = document.createElement("div");
          dot.className = "event-dot";
          const clr = colorMap[normalizeCategory(ev.category)] || "#999";
          dot.style.backgroundColor = clr;
          dotsWrap.appendChild(dot);
        });

        if (dayEvents.length > 3) {
          const more = document.createElement("div");
          more.style.fontSize = "0.65rem";
          more.style.color = "#666";
          more.textContent = `+${dayEvents.length - 3}`;
          dotsWrap.appendChild(more);
        }

        cell.appendChild(dotsWrap);
      }
    }

    return cell;
  }

  function updateSelectedDateLabel() {
    const label = calendarState.selectedDate.toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric"
    });
    document.getElementById("selectedDateDisplay").textContent = label;
  }

  function updateEventsList() {
    const list = document.getElementById("eventsList");
    const dateStr = formatDate(calendarState.selectedDate);

    let items = [];
    if (calendarState.activeCalendar === "all") {
      Object.keys(calendarState.events).forEach(cat => {
        calendarState.events[cat].forEach(ev => {
          if (ev.date === dateStr) items.push({ ...ev, category: normalizeCategory(cat) });
        });
      });
    } else {
      const cat = calendarState.activeCalendar;
      (calendarState.events[cat] || []).forEach(ev => {
        if (ev.date === dateStr) items.push({ ...ev, category: normalizeCategory(cat) });
      });
    }

    // Sort by time, blanks last
    items.sort((a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return String(a.time).localeCompare(String(b.time));
    });

    if (items.length === 0) {
      list.innerHTML = '<p class="text-muted">No events scheduled for this date</p>';
      return;
    }

    list.innerHTML = items.map(ev => {
      const clr = colorMap[normalizeCategory(ev.category)] || "#999";
      const foodCookLine = ev.category === 'food' && (ev.food || ev.cook)
        ? `<div class=\"mt-1\"><small><span class=\"text-danger fw-semibold\">${escapeHtml(ev.food)}</span>${ev.food && ev.cook ? ' • ' : ''}<span class=\"text-primary\">${ev.cook ? 'Cook: ' + escapeHtml(ev.cook) : ''}</span></small></div>`
        : '';
      return `
        <div class="event-card" style="border-left: 4px solid ${clr}">
          <div>
            <h6>${escapeHtml(ev.title || "")}</h6>
            <p>${escapeHtml(ev.description || "No description")}</p>
            ${ev.time ? `<div class="event-time"><i class="fas fa-clock"></i> ${escapeHtml(ev.time)}</div>` : ""}
            ${ev.location ? `<div class="event-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(ev.location)}</div>` : ""}
            ${foodCookLine}
          </div>
        </div>
      `;
    }).join("");
  }

  // =====================
  // Utils
  // =====================
  function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
});
