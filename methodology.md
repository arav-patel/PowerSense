# PowerSense — Methodology & Data Sources
This document explains the data sources and reasoning behind every calculation in the PowerSense energy calculator. All data comes from U.S. government agencies or peer-reviewed academic institutions.
Data for the calculator:
1. Electricity Prices by State
Source: U.S. Energy Information Administration (EIA) via [ElectricChoice.com](https://www.electricchoice.com/electricity-prices-by-state/)
AL=16.79, AK=26.57, AZ=15.62, AR=13.32, CA=33.75, CO=16.33, CT=27.84, DE=18.39, DC=24.03, FL=15.77, GA=14.60, HI=39.89, ID=12.51, IL=18.82, IN=17.42, IA=13.54, KS=15.23, KY=13.68, LA=12.44, ME=29.55, MD=22.40, MA=31.51, MI=20.55, MN=16.44, MS=14.53, MO=13.01, MT=14.33, NE=13.19, NV=13.83, NH=27.39, NJ=22.65, NM=15.00, NY=27.07, NC=15.12, ND=12.87, OH=17.93, OK=14.48, OR=16.23, PA=20.58, RI=31.30, SC=15.71, SD=14.15, TN=13.12, TX=16.18, UT=13.75, VT=24.89, VA=16.43, WA=14.12, WV=16.26, WI=18.45, WY=15.18

Why we use it: PowerSense automatically uses the right electricity rate for each user's state when calculating their monthly cost. Someone in California pays almost triple what someone in Louisiana does for the same energy use.

2. CO2 Emission Factor
Source: U.S. Energy Information Administration (EIA) via [EIA FAQ](https://www.eia.gov/tools/faqs/faq.php?id=74)
Every kWh of electricity used produces approximately 0.81 pounds of CO2 on average in the United States.
*Data published in 2023, last updated in December of 2024, but the most current data out there right now, and is the same figure used in EPA's official Greenhouse Gas Equivalencies Calculator

Why we use it: To convert a household's kWh usage into a real carbon emissions number.

3. Home Energy Breakdown
Source: University of Michigan's Center for Sustainable Systems via [University of Michigan CSS](https://css.umich.edu/publications/factsheets/built-environment/residential-buildings-factsheet)
Heating and cooling account for 45% of the total energy use in the residential sector. Water heating accounts for 12% of residential energy consumption. Appliances and lighting can account for 24% of household energy costs. Miscellaneous electronics make up the rest.

Why we use it: We know how to split someone's total energy use into categories: heating, cooling, water, appliances, and lighting. This is what creates the breakdown chart on the results page.

4. Average Household Consumption
Source: U.S. Energy Information Administration (EIA) via [EIA FAQ](https://www.eia.gov/tools/faqs/faq.php?id=97)
In 2022, the average annual amount of electricity sold to (purchased by) a U.S. residential electric-utility customer was 10,791 kilowatthours (kWh), an average of about 899 kWh per month.

Why we use it: Every calculation begins from 899 kWh per month and adjusts up or down based on the user's answers.

5. Appliance Energy Use
Source: Silicon Valley Power Appliance Energy Use Chart via [Silicon Valley Power](https://www.siliconvalleypower.com/residents/save-energy/appliance-energy-use-chart)
New Energy Star fridge: about 35-50 kWh per month
Older 2000-era fridge: 72 kWh per month
Dishwasher normal cycle uses 1-2 kWh per load, roughly 5-6 loads per week = about 25 kWh per month.
Clothes Dryer uses 2.5-4 kWh per load, roughly 4-5 loads per week = about 50 kWh per month.
Washing Machine: Warm wash about 2.3 kWh per load, 4-5 loads per week = about 40 kWh per month.
Oven uses 2.3 kWh per hour, roughly 1 hour per day = about 70 kWh per month.

Why we use it: We can add the real energy cost of each appliance on top of the base estimate. An old fridge alone can add $15 to $20 per month to someone's bill.

6. Insulation and Building Age Impact
Source: U.S. Environmental Protection Agency (EPA) via [EPA](https://www.epa.gov/energystar) and U.S. Department of Energy (DOE) via [DOE](https://www.energy.gov/energysaver/insulation)
The EPA states homeowners can save an average of 15% on heating and cooling costs through proper insulation and air sealing. The DOE states that combining insulation with proper air sealing can cut heating and cooling energy use by 20% to 50%.

Why we use it: Poor insulation forces heating and cooling systems to work harder and longer. This multiplier adjusts the total energy estimate based on how well the home holds temperature.

7. LED Lighting Savings
Source: U.S. Department of Energy (DOE) via [DOE Lighting](https://www.energy.gov/energysaver/lighting-choices-save-you-money) and [DOE LED Facts](https://www.energy.gov/energysaver/led-lighting)
LED bulbs use at least 75% less energy than traditional incandescent bulbs and last 25 times longer. Lighting accounts for about 15% of an average home's electricity use.

Why we use it: This lets us show users exactly how much they could save by switching to LEDs, one of the cheapest and easiest fixes available.
---
## Calculation Logic
The calculator follows 13 steps in order: base energy by home size → occupancy adjustment → home age adjustment → insulation adjustment → heating addition → cooling addition → appliance additions → lighting adjustment → monthly cost by state rate → CO2 emissions → waste breakdown percentages → potential savings → save results to localStorage.
Last updated: March 2026
