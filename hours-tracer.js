const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const weeksContainer = document.getElementById("weeks-container");
const monthTotalEl = document.getElementById("month-total");
const weeklyBreakdown = document.getElementById("weekly-breakdown");
const addWeekBtn = document.getElementById("add-week");
const clearDataBtn = document.getElementById("clear-data");

let weekCount = 0;

/* ---------- Helpers for time math (H.MM or H:MM) ---------- */

// Parse strings like "7.34", "7:34", "7", "07:05"
function parseHM(str) {
  if (!str) return { h: 0, m: 0 };
  let s = String(str).trim().replace(",", "."); // allow comma -> dot
  if (!s) return { h: 0, m: 0 };

  // colon format takes priority
  if (s.includes(":")) {
    const [h, m] = s.split(":");
    return normalize({
      h: safeInt(h),
      m: safeInt(m),
    });
  }

  // dot format "hh.mm" where mm are minutes (NOT decimal)
  if (s.includes(".")) {
    const [h, mRaw] = s.split(".");
    // take at most 2 minute digits and treat as minutes (07.5 -> 07:5)
    const m = safeInt((mRaw || "").slice(0, 2));
    return normalize({ h: safeInt(h), m });
  }

  // pure hours like "8"
  return normalize({ h: safeInt(s), m: 0 });
}

// add two {h, m}
function addHM(a, b) {
  return normalize({ h: a.h + b.h, m: a.m + b.m });
}

// carry every 60 minutes into hours
function normalize(t) {
  let h = safeInt(t.h);
  let m = safeInt(t.m);
  if (m >= 60) {
    h += Math.floor(m / 60);
    m = m % 60;
  }
  if (m < 0) m = 0;
  if (h < 0) h = 0;
  return { h, m };
}

function formatHM(t) {
  return `${t.h}.${String(t.m).padStart(2, "0")}`;
}

function safeInt(v) {
  const n = parseInt(v, 10);
  return isNaN(n) ? 0 : n;
}

/* ---------- UI builders & totals ---------- */

function addNewWeek() {
  weekCount++;
  const weekId = `week-${weekCount}`;

  const weekCard = document.createElement("div");
  weekCard.classList.add("section-card");
  weekCard.setAttribute("id", weekId);

  let weekHTML = `<h6 class="mb-3">📅 Week ${weekCount}</h6>`;

  days.forEach((day) => {
    weekHTML += `
      <div class="day-card">
        <span class="day-label">${day}</span>
        <input
          type="text"
          inputmode="numeric"
          pattern="\\d{1,2}([:\\.]\\d{1,2})?"
          placeholder="hh.mm or hh:mm"
          class="hours-input"
          data-week="${weekId}"
          value="0"
        />
        <span class="day-total">0.00h</span>
      </div>
    `;
  });

  weekHTML += `
    <div class="summary-box mt-3">
      <h6>📊 Week ${weekCount} Total</h6>
      <h5 id="${weekId}-total">0.00 hours</h5>
    </div>
  `;

  weekCard.innerHTML = weekHTML;
  weeksContainer.appendChild(weekCard);

  // Weekly breakdown row
  const breakdownItem = document.createElement("div");
  breakdownItem.classList.add("day-card");
  breakdownItem.innerHTML = `<span>Week ${weekCount}</span><span id="breakdown-${weekId}">0.00h</span>`;
  weeklyBreakdown.appendChild(breakdownItem);

  // Attach input listeners
  const inputs = weekCard.querySelectorAll(".hours-input");
  inputs.forEach((input) => {
    input.addEventListener("input", () => updateTotals(weekId));
  });
  updateTotals(weekId); // initialize totals
}

function updateTotals(weekId) {
  const weekEl = document.getElementById(weekId);
  const inputs = weekEl.querySelectorAll(".hours-input");

  // sum this week
  let weekTotal = { h: 0, m: 0 };
  inputs.forEach((input) => {
    const t = parseHM(input.value);
    // show normalized per-day value to the right
    const label = input.parentElement.querySelector(".day-total");
    if (label) label.textContent = `${formatHM(t)}h`;
    weekTotal = addHM(weekTotal, t);
  });

  // update week total + breakdown
  document.getElementById(`${weekId}-total`).textContent = `${formatHM(
    weekTotal
  )} hours`;
  document.getElementById(`breakdown-${weekId}`).textContent = `${formatHM(
    weekTotal
  )}h`;

  // update month
  updateMonthlyTotal();
}

function updateMonthlyTotal() {
  // sum across every input in the document
  const inputs = document.querySelectorAll(".hours-input");
  let monthTotal = { h: 0, m: 0 };

  inputs.forEach((input) => {
    monthTotal = addHM(monthTotal, parseHM(input.value));
  });

  monthTotalEl.textContent = `${formatHM(monthTotal)} hours`;
}

function clearAllData() {
  weeksContainer.innerHTML = "";
  weeklyBreakdown.innerHTML = "";
  monthTotalEl.textContent = "0.00 hours";
  weekCount = 0;
}

addWeekBtn.addEventListener("click", addNewWeek);
clearDataBtn.addEventListener("click", clearAllData);

// start with one week
addNewWeek();
