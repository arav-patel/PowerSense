/**
 * PowerSense Calculator
 *
 * This script processes home energy audit data to estimate monthly
 * electricity usage (kWh), costs, and carbon footprint.
 */

function calculateResults() {
    // Read user answers from localStorage
    const auditData = JSON.parse(localStorage.getItem('powersense_audit'));

    if (!auditData) {
        console.error("No audit data found in localStorage.");
        return;
    }

    // Extract variables from audit data
    const {
        state,
        home_type,
        home_size,
        people,
        home_age,
        heating,
        ac,
        insulation,
        appliances,
        fridge_age,
        bulbs
    } = auditData;

    // --- STEP 1: BASE ENERGY ---
    // Start with a baseline monthly kWh based on the square footage of the home.
    let baseKwh = 899; // Default to medium
    if (home_size === 'small') baseKwh = 550;
    else if (home_size === 'medium') baseKwh = 899;
    else if (home_size === 'large') baseKwh = 1200;
    else if (home_size === 'xlarge') baseKwh = 1600;
    // Source: EIA RECS 2020, average U.S. household 899 kWh/month

    let runningTotalKwh = baseKwh;

    // --- STEP 2: OCCUPANCY MULTIPLIER ---
    // Adjust usage based on how many people live in the home.
    let occupancyFactor = 1.0;
    if (people === '1') occupancyFactor = 0.70;
    else if (people === '2') occupancyFactor = 0.90;
    else if (people === '3-4') occupancyFactor = 1.0;
    else if (people === '5+') occupancyFactor = 1.20;
    // Source: EIA RECS 2020 household size data

    runningTotalKwh *= occupancyFactor;

    // --- STEP 3: HOME AGE MULTIPLIER ---
    // Older homes are generally less efficient due to construction standards of the time.
    let ageFactor = 1.10; // Default/Unsure
    if (home_age === 'pre1980') ageFactor = 1.25;
    else if (home_age === '1980-2000') ageFactor = 1.10;
    else if (home_age === 'post2000') ageFactor = 1.0;
    else if (home_age === 'unsure') ageFactor = 1.10;
    // Source: EIA RECS building vintage efficiency data

    runningTotalKwh *= ageFactor;

    // --- STEP 4: INSULATION MULTIPLIER ---
    // Insulation quality determines how much energy is needed to maintain temperature.
    let insulationFactor = 1.0; // Default/Unsure
    if (insulation === 'poor') insulationFactor = 1.20;
    else if (insulation === 'average') insulationFactor = 1.0;
    else if (insulation === 'good') insulationFactor = 0.85;
    else if (insulation === 'unsure') insulationFactor = 1.0;
    // Source: EPA estimates 15% savings from proper insulation, DOE estimates 20-50% savings from insulation plus air sealing

    runningTotalKwh *= insulationFactor;

    // --- STEP 5: HEATING ADDITION ---
    // Add energy for heating based on the fuel source used.
    let heatingAddition = 0;
    if (heating === 'gas') heatingAddition = runningTotalKwh * 0.18;
    else if (heating === 'electric') heatingAddition = runningTotalKwh * 0.25;
    else if (heating === 'heatpump') heatingAddition = runningTotalKwh * 0.10;
    else if (heating === 'oil') heatingAddition = runningTotalKwh * 0.22;
    else if (heating === 'none') heatingAddition = 0;
    // Source: EIA residential energy consumption data

    runningTotalKwh += heatingAddition;

    // --- STEP 6: COOLING ADDITION ---
    // Add energy for air conditioning based on the system type.
    let coolingAddition = 0;
    if (ac === 'central') coolingAddition = runningTotalKwh * 0.19;
    else if (ac === 'window') coolingAddition = runningTotalKwh * 0.10;
    else if (ac === 'none') coolingAddition = 0;
    // Source: EIA RECS 2020 cooling energy data

    runningTotalKwh += coolingAddition;

    // --- STEP 7: APPLIANCE ADDITIONS ---
    // Add energy for specific major appliances selected by the user.
    let applianceKwh = 0;

    // Refrigerator calculation based on age
    let fridgeKwh = 0;
    if (appliances.includes('fridge')) {
        if (fridge_age === 'new') fridgeKwh = 35;
        else if (fridge_age === 'mid') fridgeKwh = 50;
        else if (fridge_age === 'old') fridgeKwh = 72;
        else if (fridge_age === 'unsure') fridgeKwh = 50;
    }
    // Source: Silicon Valley Power Appliance Energy Use Chart, Energy Star certified data

    applianceKwh += fridgeKwh;
    if (appliances.includes('dishwasher')) applianceKwh += 25;
    if (appliances.includes('washer')) applianceKwh += 40;
    if (appliances.includes('dryer')) applianceKwh += 50;
    if (appliances.includes('oven')) applianceKwh += 70;
    // Source: Silicon Valley Power Appliance Energy Use Chart 2023

    runningTotalKwh += applianceKwh;

    // --- STEP 8: LIGHTING ADJUSTMENT ---
    // Adjust the lighting portion of energy based on the type of bulbs used.
    const lightingPortionBase = baseKwh * 0.15; // Lighting is 15% of the base home energy.
    // Source: DOE — Lighting = 15% of home electricity use.

    let lightingKwh = lightingPortionBase;
    if (bulbs === 'led') lightingKwh = lightingPortionBase * 0.25;
    else if (bulbs === 'mixed') lightingKwh = lightingPortionBase * 0.60;
    else if (bulbs === 'incandescent') lightingKwh = lightingPortionBase * 1.0;
    else if (bulbs === 'unsure') lightingKwh = lightingPortionBase * 0.60;
    // Source: DOE — LED bulbs use 75% less energy than incandescent.

    // Calculate the difference between base lighting and actual bulb type to adjust the total
    const lightingAdjustment = lightingKwh - lightingPortionBase;
    runningTotalKwh += lightingAdjustment;

    const totalKwh = runningTotalKwh;

    // --- STEP 9: CALCULATE MONTHLY COST ---
    // Multiply total usage by the state-specific electricity rate.
    const stateRates = {
        AL: 16.79, AK: 26.57, AZ: 15.62, AR: 13.32, CA: 33.75, CO: 16.33, CT: 27.84, DE: 18.39,
        DC: 24.03, FL: 15.77, GA: 14.60, HI: 39.89, ID: 12.51, IL: 18.82, IN: 17.42, IA: 13.54,
        KS: 15.23, KY: 13.68, LA: 12.44, ME: 29.55, MD: 22.40, MA: 31.51, MI: 20.55, MN: 16.44,
        MS: 14.53, MO: 13.01, MT: 14.33, NE: 13.19, NV: 13.83, NH: 27.39, NJ: 22.65, NM: 15.00,
        NY: 27.07, NC: 15.12, ND: 12.87, OH: 17.93, OK: 14.48, OR: 16.23, PA: 20.58, RI: 31.30,
        SC: 15.71, SD: 14.15, TN: 13.12, TX: 16.18, UT: 13.75, VT: 24.89, VA: 16.43, WA: 14.12,
        WV: 16.26, WI: 18.45, WY: 15.18
    };
    // Source: EIA via ElectricChoice.com February 2026

    const stateRate = stateRates[state] || 18.05; // Default rate if state not found
    const monthlyCost = totalKwh * (stateRate / 100); // Cost = kWh * (cents per kWh / 100)
    const annualCost = monthlyCost * 12; // Yearly cost is 12 times the monthly cost.

    // --- STEP 10: CALCULATE CO2 EMISSIONS ---
    // Convert energy usage to carbon dioxide emissions based on the national average.
    const monthlyCO2 = totalKwh * 0.81; // Monthly lbs of CO2 = kWh * 0.81
    const annualCO2 = monthlyCO2 * 12; // Yearly lbs of CO2
    // Source: EIA 2023 — U.S. average 0.81 lbs CO2 per kWh

    // --- STEP 11: WASTE BREAKDOWN PERCENTAGES ---
    // Calculate the percentage of total energy consumed by each major system.
    const heating_pct = (heatingAddition / totalKwh) * 100;
    const cooling_pct = (coolingAddition / totalKwh) * 100;
    const water_heater_pct = ((baseKwh * 0.12) / totalKwh) * 100; // Fixed at 12% of base energy.
    const appliances_pct = (applianceKwh / totalKwh) * 100;
    const lighting_pct = (lightingKwh / totalKwh) * 100;
    // Source: University of Michigan CSS 2025 Residential Buildings Factsheet (Water heating 12%)

    // --- STEP 12: POTENTIAL SAVINGS ---
    // Estimate how much money could be saved by making energy-efficiency upgrades.
    let potentialMonthlySavings = 0;

    // Insulation savings
    if (insulation === 'poor') {
        potentialMonthlySavings += monthlyCost * 0.15; // Save 15% with proper insulation.
    }
    // Source: EPA 15% savings estimate

    // Refrigerator upgrade savings
    if (fridge_age === 'old') {
        potentialMonthlySavings += 8; // Difference between old and new fridge models.
    }
    // Source: Difference between fridge new (35) and fridge old (72) is ~37 kWh. 37 * $0.21 avg rate ≈ $8.

    // Lighting upgrade savings
    if (bulbs === 'incandescent') {
        potentialMonthlySavings += monthlyCost * 0.10; // Lighting accounts for 10% of waste in this scenario.
    }
    // Source: 10% of bill is wasted lighting

    // Vintage home upgrade savings
    if (home_age === 'pre1980') {
        potentialMonthlySavings += monthlyCost * 0.12; // Efficiency gains from modernizing an older home.
    }

    const potentialAnnualSavings = potentialMonthlySavings * 12;

    // --- STEP 13: SAVE RESULTS ---
    // Store all calculated metrics into localStorage for the results page to display.
    const results = {
        totalKwh,
        monthlyCost,
        annualCost,
        monthlyCO2,
        annualCO2,
        heating_pct,
        cooling_pct,
        water_heater_pct,
        appliances_pct,
        lighting_pct,
        potentialMonthlySavings,
        potentialAnnualSavings,
        stateRate,
        state
    };

    localStorage.setItem('powersense_results', JSON.stringify(results));
}

