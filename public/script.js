// Function to format dates
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Function to populate the table with data
function populateTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        // ID column
        const idCell = document.createElement('td');
        idCell.textContent = item.ID;
        row.appendChild(idCell);
        
        // Status column
        const statusCell = document.createElement('td');
        statusCell.textContent = item.Status.charAt(0).toUpperCase() + item.Status.slice(1);
        statusCell.className = `status-${item.Status.toLowerCase()}`;
        row.appendChild(statusCell);
        
        // Business Unit column
        const businessUnitCell = document.createElement('td');
        businessUnitCell.textContent = item.BusinessUnit;
        row.appendChild(businessUnitCell);
        
        // Days Taken column
        const daysTakenCell = document.createElement('td');
        daysTakenCell.textContent = item.DaysTaken;
        row.appendChild(daysTakenCell);
        
        // Days O/U column
        const daysOUCell = document.createElement('td');
        daysOUCell.textContent = item.DaysOU;
        if (item.DaysOU > 0) {
            daysOUCell.className = 'overdue';
        }
        row.appendChild(daysOUCell);
        
        // Effective Date column
        const effectiveDateCell = document.createElement('td');
        effectiveDateCell.textContent = formatDate(item.EffectiveDate);
        row.appendChild(effectiveDateCell);
        
        // End Date column
        const endDateCell = document.createElement('td');
        endDateCell.textContent = formatDate(item.EndDate);
        row.appendChild(endDateCell);
        
        tableBody.appendChild(row);
    });
}

// Load the table when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Populate the table with data
    populateTable(jsonData);
});

document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("table-body");

    const startDateFilter = document.getElementById("date");
    const endDateFilter = document.getElementById("end date");
    const unitFilter = document.getElementById("unit");
    const statusFilter = document.getElementById("status");
    const siteFilter = document.getElementById("site");

    function filterData() {
        let filteredData = leaveData.filter(item => {
            let startDate = new Date(startDateFilter.value);
            let endDate = new Date(endDateFilter.value);
            let effectiveDate = new Date(item.effectiveDate);

            return (
                (unitFilter.value === "unit" || item.unit === unitFilter.value) &&
                (statusFilter.value === "status" || item.status === statusFilter.value) &&
                (siteFilter.value === "site" || item.site === siteFilter.value) &&
                (effectiveDate >= startDate && effectiveDate <= endDate)
            );
        });

        populateTable(filteredData);
    }

    function populateTable(data) {
        tableBody.innerHTML = "";
        data.forEach(item => {
            let row = `<tr>
                <td>${item.id}</td>
                <td>${item.status}</td>
                <td>${item.unit}</td>
                <td>${item.daysTaken}</td>
                <td>${item.daysTaken}</td>
                <td>${item.effectiveDate}</td>
                <td>${item.endDate}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    }

    startDateFilter.addEventListener("change", filterData);
    endDateFilter.addEventListener("change", filterData);
    unitFilter.addEventListener("change", filterData);
    statusFilter.addEventListener("change", filterData);
    siteFilter.addEventListener("change", filterData);

    populateTable(leaveData); // Initial population
});