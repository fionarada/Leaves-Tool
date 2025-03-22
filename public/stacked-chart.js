document.addEventListener("DOMContentLoaded", function () {
  // Process data to get monthly counts dynamically
  const monthlyData = processDataByMonth(jsonData);

  // Create charts
  const stackedChart = createStackedBarChart(monthlyData);
  const cumulativeChart = createCumulativeOpenChart(monthlyData);

  // Set up event listeners for filters
  setupFilters(stackedChart, cumulativeChart);
});

// Process data dynamically based on the available date range
function processDataByMonth(data) {
  if (!data || data.length === 0) return;

  const currentDate = new Date();
  const minDate = new Date(
    Math.min(...data.map((d) => new Date(d.EffectiveDate)))
  );
  const maxDate = new Date(
    Math.max(...data.map((d) => new Date(d.EndDate || currentDate)))
  );

  const months = [];
  const monthLabels = [];
  const monthlyCounts = {};

  let date = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  while (date <= maxDate) {
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    months.push(monthKey);
    monthLabels.push(
      date.toLocaleString("default", { month: "short", year: "numeric" })
    );
    monthlyCounts[monthKey] = { open: 0, closed: 0, cumulativeOpen: 0 };
    date.setMonth(date.getMonth() + 1);
  }

  let runningTotal = 0;
  data.forEach((record) => {
    const effectiveMonth = `${new Date(
      record.EffectiveDate
    ).getFullYear()}-${String(
      new Date(record.EffectiveDate).getMonth() + 1
    ).padStart(2, "0")}`;
    if (months.includes(effectiveMonth)) {
      monthlyCounts[effectiveMonth][
        record.Status === "open" ? "open" : "closed"
      ]++;
    }
  });

  months.forEach((month) => {
    runningTotal += monthlyCounts[month].open;
    monthlyCounts[month].cumulativeOpen = runningTotal;
  });

  return { months, labels: monthLabels, counts: monthlyCounts };
}

function createStackedBarChart(monthlyData) {
  const ctx = document.getElementById("stackedChart").getContext("2d");
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: monthlyData.labels,
      datasets: [
        {
          label: "Open",
          data: monthlyData.months.map((m) => monthlyData.counts[m].open),
          backgroundColor: "rgba(100, 116, 139,.7)",
          borderColor: "rgb(100, 116, 139)",
          borderWidth: 2,
        },
        {
          label: "Closed",
          data: monthlyData.months.map((m) => monthlyData.counts[m].closed),
          backgroundColor: "rgba(34, 197, 94, 0.7)",
          borderColor: "rgb(34, 197, 94)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { x: { stacked: true }, y: { stacked: true } },
    },
  });
}

function createCumulativeOpenChart(monthlyData) {
  const ctx = document.getElementById("cumulativeOpenChart").getContext("2d");
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: monthlyData.labels,
      datasets: [
        {
          label: "Cumulative Open Records",
          data: monthlyData.months.map(
            (m) => monthlyData.counts[m].cumulativeOpen
          ),
          borderColor: "rgba(0, 102, 204, 1)",
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointBackgroundColor: "rgba(0, 102, 204, 1)",
          pointRadius: 5,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });
}

function updateChart(chart, filteredData) {
  const updatedData = processDataByMonth(filteredData);
  chart.data.labels = updatedData.labels;
  chart.data.datasets[0].data = updatedData.months.map(
    (m) => updatedData.counts[m].open
  );
  chart.data.datasets[1].data = updatedData.months.map(
    (m) => updatedData.counts[m].closed
  );
  chart.update();
}

function setupFilters(stackedChart, cumulativeChart) {
  document.querySelectorAll(".filter").forEach((filter) => {
    filter.addEventListener("change", () => {
      const filteredData = jsonData.filter((record) => {
        const effectiveDate = new Date(record.EffectiveDate);
        const endDate = record.EndDate ? new Date(record.EndDate) : null;
        const startDate = new Date(
          document.getElementById("startDateFilter").value || "2000-01-01"
        );
        const endDateInput = document.getElementById("endDateFilter").value;
        const endFilter = endDateInput ? new Date(endDateInput) : new Date();

        return (
          effectiveDate >= startDate &&
          (!endDate || endDate <= endFilter) &&
          (document.getElementById("statusFilter").value === "all" ||
            record.Status === document.getElementById("statusFilter").value)
        );
      });
      updateChart(stackedChart, filteredData);
      updateChart(cumulativeChart, filteredData);
    });
  });
}
