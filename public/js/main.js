import Day from "./day.js";
import Warning from "./warning.js";
import Station from "./station.js";
import {
    root,
    switchColor as sColor,
    switchDay as sDay,
    switchStation as sStation,
    switchTab as sTab,
    switchTheme as sTheme
} from "./navigation.js";
import {
    resetDisplay,
    resetForecastDisplay,
    resetOverviewDisplay,
    resetWarningDisplay,
    setDayDisplay,
    setForecastDisplay,
    setOverviewDisplay,
    setWarningDisplay
} from "./data.js";
import {addDays, addHours, cancelTimezoneOffset, dayDifference, unixToHoursString, printNotification} from "./util.js";

/**
 * json data of current station
 * @type {Object}
 */
let data;

/**
 * an array storing all (10) days
 * @type {Day[]}
 */
export const days = [];
for (let i = 0; i < 10; i++) {
    days.push(new Day());
}

/**
 * an array storing all pinned stations
 * @type {Station[]}
 */
const stations = [
    new Station("10382", "Berlin-Tegel"),
    new Station("10865", "München Stadt"),
    new Station("P0532", "Garching"),
    new Station("10863", "Weihenstephan-Dürnast"),
    new Station("N3951", "Wertheim-Eichel")
]
/**
 * the index of the station in stations that is displayed
 * @type {number}
 */
let currentStation = 0;
document.getElementById("station-name").innerHTML = stations[currentStation].name;
resetData(false);

/**
 * fetches data, resets and sets display
 * @param {boolean} noCache - if set to true, fetch of fresh data is guaranteed
 * @returns {Promise<boolean>} - success of data fetch
 */
export async function resetData(noCache) {
    root.classList.add("loading");
    if (noCache) {
        stations[currentStation].resetURL();
        printNotification("Hole Daten für " + stations[currentStation].name + "...");
    }

    if (!(await fetchData())) {
        // if data fetch failed
        root.classList.remove("loading");
        return false;
    }

    resetDisplay();
    resetForecastDisplay();
    resetWarningDisplay();

    setOverviewData();
    setForecastData();
    setWarningData();
    
    setDayDisplay();
    setOverviewDisplay();
    setForecastDisplay();
    setWarningDisplay();
    
    if (noCache) {
        printNotification("Daten für " + stations[currentStation].name + " erfolgreich aktualisiert.");
    } else {
        printNotification("Zeige Daten von " + unixToHoursString(stations[currentStation].lastRefresh) + ".");
    }
    root.classList.remove("loading");
    return true;
}

/**
 * fetches data for current station
 * @returns {Promise<boolean>} - success of data fetch
 */
export async function fetchData() {
    return fetch(stations[currentStation].url)
        .then(response => response.json())
        .then(freshData => {
            data = freshData[stations[currentStation].id];
            return true;
        })
        .catch((err) => {
            printNotification(err);
            return false;
        });
}

/**
 * sets overview data for all days
 */
function setOverviewData() {
    let daysData = data.days;
    for (let i in daysData) {
        days[i].setOverviewData(daysData[i]);
    }
}

// TODO set trend data
/**
 * sets forecast data for all days
 */
function setForecastData() {
    for (let day of days) {
        day.resetData();
    }
    const forecastRoot1 = data.forecast1;
    const forecastRoot2 = data.forecast2;
    const forecastStart1 = new Date(forecastRoot1.start);
    const forecastStart2 = new Date(forecastRoot2.start);
    const forecastStep1 = forecastRoot1.timeStep / 3600000;
    const forecastStep2 = forecastRoot2.timeStep / 3600000;
    let currentTime;
    let currentDayIndex;

    let forecast2IndexBase;

    for (let i = 0; i < forecastRoot1.temperature.length; i++) {
        currentTime = addHours(forecastStart1, i * forecastStep1);
        // if forecastRoot2 starts
        if (currentTime >= forecastStart2) {
            forecast2IndexBase = i;
            break;
        }
        currentDayIndex = dayDifference(forecastStart1, currentTime);
        if (Date.now() > addHours(currentTime, 1)) {
            continue;
        }
        if (currentDayIndex >= days.length) {
            break;
        }
        days[currentDayIndex].pushData(
            currentTime,
            forecastRoot1.icon[i],
            forecastRoot1.temperature[i],
            forecastRoot1.precipitationTotal[i],
            forecastRoot1.surfacePressure[i],
            forecastRoot1.humidity[i],
            forecastRoot1.dewPoint2m[i]);
    }

    for (let i = 0; i < forecastRoot2.icon.length; i++) {
        currentTime = addHours(forecastStart2, i * forecastStep2);
        currentDayIndex = dayDifference(forecastStart1, currentTime);
        if (currentDayIndex >= days.length) {
            break;
        }
        console.log(forecast2IndexBase + (forecastStep2 / forecastStep1) * i);
        days[currentDayIndex].pushData(
            currentTime,
            forecastRoot2.icon[i],
            forecastRoot1.temperature[forecast2IndexBase + (forecastStep2 / forecastStep1) * i],
            forecastRoot2.precipitationTotal[i],
            forecastRoot2.surfacePressure[i],
            forecastRoot2.humidity[i],
            forecastRoot2.dewPoint2m[i]);
    }
}

/**
 * sets warning data for all days
 */
function setWarningData() {
    let warningRoot = data.warnings;
    // loop through all warnings
    for (let warningData of warningRoot) {
        const warning = new Warning(warningData.event,
            warningData.start,
            warningData.end,
            warningData.level,
            warningData.type,
            warningData.description,
            warningData.instruction);
        const warningStart = new Date(warning.start);
        const warningEnd = new Date(warning.end);
        // loop through all days to check if warning fits in
        for (let day of days) {
            const dayStart = new Date(cancelTimezoneOffset(day.date));
            const dayEnd = new Date(cancelTimezoneOffset(addDays(day.date, 1)));
            // check if warning is within day
            if ((warningStart >= dayStart && warningStart < dayEnd) ||
                (warningEnd >= dayStart && warningEnd < dayEnd) ||
                (warningStart <= dayStart && warningEnd >= dayEnd)) {
                day.pushWarning(warning);
            }
        }
    }
}

/**
 * allows switching between forecast, overview and warning tabs
 * @param {number} index - the index of the selected tab
 */
export function switchTab(index) {
    sTab(index);
}

/**
 * allows switching between light and dark theme
 */
export function switchTheme() {
    sTheme();
}

/**
 * allows switching between green, red and blue accent color
 */
export function switchColor() {
    sColor();
}

/**
 * allows switching to specified day, resets and displays forecast and overview data
 * @param {number} index - index of day to be switched to
 */
export function switchDay(index) {
    sDay(index);
    resetOverviewDisplay();
    resetForecastDisplay();
    resetWarningDisplay();
    setOverviewDisplay();
    setForecastDisplay();
    setWarningDisplay();
}

/**
 * switches station by fetching data
 * @param {number} index - index of station in stations
 * @returns {Promise<boolean>} - success of station switch
 */
export async function switchStation(index) {
    if (index === currentStation) {
        return false;
    }
    let oldStation = currentStation;
    currentStation = index;
    if (await resetData()) {
        sStation(currentStation);
        document.getElementById("station-name").innerHTML = stations[currentStation].name;
    } else {
        currentStation = oldStation;
        return false;
    }
    return true;
}

export function addStation(index) {

}