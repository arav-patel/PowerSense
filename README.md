# PowerSense

**Know What You're Wasting. Know Why. Know How to Fix It.**

PowerSense is a free interactive home energy audit tool. You put in some 
basic info about your home, and it tells you exactly how much energy you are using 
wasting, why it is happening, and what you can do to fix it. The goal is to 
help regular people understand their energy use in a way that actually makes 
sense, not just throw a number at them.

---

## Why I Built This

Most energy calculators give you a final number and call it a day. 
I wanted to build something that explains the reasoning behind that number 
using real engineering concepts, but in plain language that anyone can understand. 
Energy waste is a real problem, and most people have no idea how much they are 
contributing to it or how easy some of the fixes are.

---

## What It Does

Step-by-step home audit where you enter your home details, appliances, and 
usage habits. Then PowerSense breaks down exactly where your energy is going, 
explains why each system in your home wastes energy, and shows your carbon impact 
in real-world terms that are easy to understand, and gives you a ranked action 
plan with estimated savings in both dollars and emissions.

---

## Data Sources

All data comes from credible government and scientific sources.

U.S. Energy Information Administration for appliance wattages, energy stats 
and electricity prices by state.

U.S. Environmental Protection Agency for CO2 emission factors per kWh 
by region.

U.S. Department of Energy for typical home energy breakdown percentages.

OpenWeatherMap API for local weather data used in heating and cooling 
estimates.

---

## Tech Stack

HTML, CSS, and JavaScript for the core site. Chart.js for the interactive 
visualizations. jsPDF for the downloadable audit report. Hosted on 
GitHub Pages.

---

## Live Site

Coming soon.

---

## Project Structure

index.html is the landing page. audit.html is the input form and calculator. 
results.html is where your results and visualizations show up. why.html is 
the climate impact and mission page. The css folder holds styles.css for all 
the styling. The js folder holds calculator.js for all the energy math and 
charts.js for the visualizations. The assets folder holds images and diagrams.

---

## About

Built by Arav Patel as an aspiring mechanical engineer. I am interested in energy 
systems and wanted to build something that helps people understand the 
basics of how their homes use and waste energy.

---

## License

MIT License, see LICENSE file for details.
