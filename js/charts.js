/**
 * PowerSense Charts
 *
 * Handles the Chart.js visualizations for the results dashboard.
 */

function initWasteChart(results) {
    const ctx = document.getElementById('wasteChart').getContext('2d');

    // Data from the audit results
    const data = {
        labels: ['Heating', 'Cooling', 'Water Heater', 'Appliances', 'Lighting'],
        datasets: [{
            data: [
                results.heating_pct,
                results.cooling_pct,
                results.water_heater_pct,
                results.appliances_pct,
                results.lighting_pct
            ],
            backgroundColor: [
                '#dc2626', // Heating (Red)
                '#f59e0b', // Cooling (Amber)
                '#1a56db', // Water Heater (Blue)
                '#7c3aed', // Appliances (Purple)
                '#16a34a'  // Lighting (Green)
            ],
            borderWidth: 0,
            hoverOffset: 15
        }]
    };

    // Chart Configuration
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            family: "'DM Sans', sans-serif",
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.label}: ${context.parsed.toFixed(1)}%`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    // Create the chart
    new Chart(ctx, config);
}
