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
            <input type="number" min="0" step="0.5" class="hours-input" data-week="${weekId}" value="0">
            <span class="day-total">0.0h</span>
          </div>
        `;
      });

      weekHTML += `
        <div class="summary-box mt-3">
          <h6>📊 Week ${weekCount} Total</h6>
          <h5 id="${weekId}-total">0.0 hours</h5>
        </div>
      `;

      weekCard.innerHTML = weekHTML;
      weeksContainer.appendChild(weekCard);

      const breakdownItem = document.createElement("div");
      breakdownItem.classList.add("day-card");
      breakdownItem.innerHTML = `<span>Week ${weekCount}</span><span id="breakdown-${weekId}">0.0h</span>`;
      weeklyBreakdown.appendChild(breakdownItem);

      const inputs = weekCard.querySelectorAll(".hours-input");
      inputs.forEach((input) => {
        input.addEventListener("input", () => updateTotals(weekId));
      });
    }

    function updateTotals(weekId) {
      const inputs = document.querySelectorAll(`#${weekId} .hours-input`);
      let weekTotal = 0;

      inputs.forEach((input) => {
        const hours = parseFloat(input.value) || 0;
        input.nextElementSibling.textContent = hours.toFixed(1) + "h";
        weekTotal += hours;
      });

      document.getElementById(`${weekId}-total`).textContent =
        weekTotal.toFixed(1) + " hours";
      document.getElementById(`breakdown-${weekId}`).textContent =
        weekTotal.toFixed(1) + "h";

      updateMonthlyTotal();
    }

    function updateMonthlyTotal() {
      let monthTotal = 0;
      for (let i = 1; i <= weekCount; i++) {
        const weekTotalEl = document.getElementById(`week-${i}-total`);
        if (weekTotalEl) {
          monthTotal += parseFloat(weekTotalEl.textContent) || 0;
        }
      }
      monthTotalEl.textContent = monthTotal.toFixed(1) + " hours";
    }

    function clearAllData() {
      weeksContainer.innerHTML = "";
      weeklyBreakdown.innerHTML = "";
      monthTotalEl.textContent = "0.0 hours";
      weekCount = 0;
    }

    addWeekBtn.addEventListener("click", addNewWeek);
    clearDataBtn.addEventListener("click", clearAllData);

    addNewWeek();
  