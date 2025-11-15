// calendars.js — Read-only multi-calendar with proper filtering

// =====================
// CONFIG
// =====================
const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwS9Xy-mIfjlFQaAEQe1Q1v_uIMtMPzvMx6W-o0hPdu-10M2AVJ3rierG9otEGxucGO/exec";
const USE_SERVER = !!GAS_ENDPOINT && GAS_ENDPOINT !== "PASTE_YOUR_DEPLOYED_WEB_APP_URL_HERE";
const SYNC_INTERVAL = 60000; // 60s auto-refresh

// Color map used for dots
const colorMap = {
  food: "#FF6B6B",
  transportation: "#4ECDC4",
  volunteer: "#95E1D3",
  volunteers: "#95E1D3",      // tolerate sheet value
  activities: "#FFD93D",
  maintenance: "#6C63FF"
};

// Normalize category keys from server/sheets to our internal keys
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
    activeCalendar: "all", // default to All
    events: {
      food: [],
      transportation: [],
      volunteer: [],
      activities: [],
      maintenance: []
    },
    syncing: false
  };

  init();
  function init() {
    bindUI();
    loadEvents();
    renderCalendar();
    updateSelectedDateLabel();

    if (USE_SERVER && SYNC_INTERVAL > 0) {
      setInterval(() => loadEvents(), SYNC_INTERVAL);
    }
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

    // update list for current selection
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

    // Dots for ALL categories at once
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
      return `
        <div class="event-card" style="border-left: 4px solid ${clr}">
          <div>
            <h6>${escapeHtml(ev.title || "")}</h6>
            <p>${escapeHtml(ev.description || "No description")}</p>
            ${ev.time ? `<div class="event-time"><i class="fas fa-clock"></i> ${escapeHtml(ev.time)}</div>` : ""}
            ${ev.location ? `<div class="event-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(ev.location)}</div>` : ""}
          </div>
        </div>
      `;
    }).join("");
  }

  // =====================
  // Data loading
  // =====================
  async function loadEvents() {
    if (!USE_SERVER || calendarState.syncing) return;
    calendarState.syncing = true;

    try {
      const res = await fetch(GAS_ENDPOINT, { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (!(json && json.status === 200 && json.data && Array.isArray(json.data.events))) {
        throw new Error(json?.message || "Invalid server response");
      }

      // reset
      Object.keys(calendarState.events).forEach(k => (calendarState.events[k] = []));

      // ingest
      json.data.events.forEach(ev => {
        const cat = normalizeCategory(ev.category);
        if (calendarState.events[cat]) {
          calendarState.events[cat].push({
            id: ev.id,
            date: ev.date,
            title: ev.title,
            category: cat,
            description: ev.description || "",
            time: ev.time || "",
            location: ev.location || ""
          });
        }
      });

      renderCalendar();
      updateEventsList();
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      calendarState.syncing = false;
    }
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
