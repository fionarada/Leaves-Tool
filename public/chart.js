    // Create the chart
    myChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: chartTitle,
                data: chartData,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: chartType === 'daysTaken' ? 'Days Taken' : 'Days Over/Under'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'ID'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const index = context.dataIndex;
                            const item = data[index];
                            return `Status: ${item.Status}`;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });

// Event listeners for chart controls
document.addEventListener('DOMContentLoaded', function() {
    // Initial chart creation
    updateChart(jsonData);
    
    // Chart type change handler
    document.getElementById('chart-type').addEventListener('change', function() {
        const chartType = this.value;
        const statusFilter = document.getElementById('chart-filter').value;
        
        let filteredData = jsonData;
        if (statusFilter !== 'all') {
            filteredData = jsonData.filter(item => item.Status === statusFilter);
        }
        
        updateChart(filteredData, chartType);
    });
    
    // Chart filter change handler
    document.getElementById('chart-filter').addEventListener('change', function() {
        const statusFilter = this.value;
        const chartType = document.getElementById('chart-type').value;
        
        let filteredData = jsonData;
        if (statusFilter !== 'all') {
            filteredData = jsonData.filter(item => item.Status === statusFilter);
        }
        
        updateChart(filteredData, chartType);
    });
});