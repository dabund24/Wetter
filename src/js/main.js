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
            printNotication(err);
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
    let forecastRoot = data.forecast1;
    let forecastStart = new Date(forecastRoot.start);
    let forecastStep = forecastRoot.timeStep;
    let currentTime;
    let currentDayIndex;

    for (let i = 0; i < forecastRoot.temperature.length; i++) {
        currentTime = addHours(forecastStart, i * (forecastStep / 3600000));
        currentDayIndex = dayDifference(forecastStart, currentTime);
        if (Date.now() > addHours(currentTime, 1)) {
            continue;
        }
        if (currentDayIndex >= days.length) {
            break;
        }
        days[currentDayIndex].pushData(
            currentTime,
            forecastRoot.icon[i],
            forecastRoot.temperature[i],
            forecastRoot.precipitationTotal[i],
            forecastRoot.surfacePressure[i],
            forecastRoot.humidity[i],
            forecastRoot.dewPoint2m[i]);
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