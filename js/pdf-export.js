/**
 * PowerSense PDF Export
 *
 * Handles generating and downloading a PDF report of the energy audit results.
 */

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const results = JSON.parse(localStorage.getItem('powersense_results'));
    const audit = JSON.parse(localStorage.getItem('powersense_audit'));

    if (!results || !audit) return;

    const stateNames = {
        AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
        CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
        HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
        KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
        MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
        MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
        NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
        OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
        SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
        VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
    };

    // --- PDF Styling & Header ---
    doc.setFillColor(15, 31, 61); // Navy
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("PowerSense Energy Audit", 20, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 160, 25);

    // --- Section 1: Summary ---
    doc.setTextColor(15, 31, 61);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", 20, 60);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Location: ${stateNames[results.state] || results.state}`, 20, 70);
    doc.text(`Home Size: ${audit.home_size.toUpperCase()}`, 20, 77);

    // Summary Grid
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 85, 190, 85);

    doc.setFont("helvetica", "bold");
    doc.text("Monthly Cost", 20, 95);
    doc.text("Annual Savings", 85, 95);
    doc.text("Annual CO2", 150, 95);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`$${results.monthlyCost.toFixed(2)}`, 20, 105);
    doc.text(`$${results.potentialAnnualSavings.toFixed(2)}`, 85, 105);
    doc.text(`${Math.round(results.annualCO2).toLocaleString()} lbs`, 150, 105);

    // --- Section 2: Breakdown ---
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Energy Breakdown", 20, 130);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const systems = [
        { n: 'Heating', p: results.heating_pct },
        { n: 'Cooling', p: results.cooling_pct },
        { n: 'Water Heating', p: results.water_heater_pct },
        { n: 'Appliances', p: results.appliances_pct },
        { n: 'Lighting', p: results.lighting_pct }
    ];

    let y = 140;
    systems.forEach(s => {
        doc.text(s.n, 20, y);
        doc.text(`${s.p.toFixed(1)}%`, 170, y);

        // Simple bar chart
        doc.setFillColor(243, 244, 246);
        doc.rect(60, y - 4, 100, 5, 'F');

        // Color coding based on percentage
        let barColor = [22, 163, 74]; // Default Green (#16a34a)
        if (s.p > 30) barColor = [220, 38, 38]; // Red (#dc2626)
        else if (s.p > 15) barColor = [245, 158, 11]; // Amber (#f59e0b)

        doc.setFillColor(barColor[0], barColor[1], barColor[2]);
        doc.rect(60, y - 4, s.p, 5, 'F');

        y += 12;
    });

    // --- Section 3: Action Plan ---
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Top Recommendations", 20, 210);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const recommendations = [];

    if (audit.insulation === 'poor') {
        recommendations.push({
            title: 'SEAL & INSULATE ATTIC',
            desc: 'Add insulation to your attic and seal air gaps around pipes and vents.',
            monthly: (results.monthlyCost * 0.15).toFixed(2),
            annual: (results.monthlyCost * 0.15 * 12).toFixed(2)
        });
    }

    if (audit.fridge_age === 'old') {
        recommendations.push({
            title: 'UPGRADE REFRIGERATOR',
            desc: 'Replace your old fridge with a new Energy Star certified model to save ~50% energy.',
            monthly: '8.00',
            annual: '96.00'
        });
    }

    if (audit.bulbs === 'incandescent') {
        recommendations.push({
            title: 'SWITCH TO LED LIGHTING',
            desc: 'Replace remaining incandescent bulbs with LEDs to use 75% less energy for lighting.',
            monthly: (results.monthlyCost * 0.10).toFixed(2),
            annual: (results.monthlyCost * 0.10 * 12).toFixed(2)
        });
    }

    if (audit.home_age === 'pre1980') {
        recommendations.push({
            title: 'MODERNIZE OLD SYSTEMS',
            desc: 'Install a smart thermostat and seal leaky ducts to ensure air reaches your rooms.',
            monthly: (results.monthlyCost * 0.12).toFixed(2),
            annual: (results.monthlyCost * 0.12 * 12).toFixed(2)
        });
    }

    if (audit.heating === 'electric') {
        recommendations.push({
            title: 'SWITCH TO HEAT PUMP',
            desc: 'Replace resistive electric heat with a heat pump to use 3x less energy.',
            monthly: (results.monthlyCost * 0.20).toFixed(2),
            annual: (results.monthlyCost * 0.20 * 12).toFixed(2)
        });
    }

    if (audit.ac === 'window') {
        recommendations.push({
            title: 'UPGRADE TO INVERTER AC',
            desc: 'Use inverter-based window units or mini-splits to reduce cooling waste.',
            monthly: (results.monthlyCost * 0.10).toFixed(2),
            annual: (results.monthlyCost * 0.10 * 12).toFixed(2)
        });
    }

    let planY = 220;
    recommendations.forEach((rec, index) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 31, 61); // Navy
        doc.text(`${index + 1}. ${rec.title}`, 20, planY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0); // Black for desc
        doc.text(rec.desc, 20, planY + 5);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(22, 163, 74); // Green
        doc.text(`Save $${rec.monthly}/month — $${rec.annual}/year`, 20, planY + 10);

        planY += 18;
    });

    // --- Footer ---
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("PowerSense Energy Audit — Built by Arav Patel. Data from EIA, EPA, and DOE.", 105, 285, { align: "center" });

    doc.save(`PowerSense_Report_${audit.state}.pdf`);
}
