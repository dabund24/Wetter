import Day from "./day.js";
import Warning from "./warning.js";
import Station from "./station.js";
import {
    currentDay, currentTab,
    root,
    switchColor as sColor,
    switchDay as sDay,
    switchStation as sStation,
    switchTab as sTab,
    switchTheme as sTheme,
    toggleNowcast as tNowcast
} from "./navigation.js";
import {
    resetDisplay,
    resetForecastDisplay,
    resetOverviewDisplay,
    resetWarningDisplay,
    setDayDisplay,
    setForecastDisplay, setNowcastDisplay,
    setOverviewDisplay, setStarredDisplay,
    setWarningDisplay
} from "./data.js";
import {addDays, addHours, cancelTimezoneOffset, dayDifference, printNotification} from "./util.js";

/**
 * json overviewData of current station
 * @type {Object}
 */
let baseData;

/**
 * json nowcastData of current station
 * @type {Object}
 */
let nowcastData;

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
export const stations = [
    new Station("10389", "Berlin-Alexanderplatz"),
    new Station("P0489", "Hamburg Innenstadt"),
    new Station("10865", "München Stadt"),
    new Station("P0532", "Garching"),
    new Station("10863", "Weihenstephan-Dürnast")
]
/**
 * the index of the station in stations that is displayed
 * @type {number}
 */
export let currentStation = 0;

setStarredDisplay();
document.getElementsByClassName("starred__station")[0].classList.add("starred__station--active");

document.getElementById("station__name").innerHTML = stations[currentStation].name;
resetData();

/**
 * fetches overviewData, resets and sets display
 * @returns {Promise<boolean>} - success of overviewData fetch
 */
export async function resetData() {
    root.classList.add("loading");
    printNotification("Hole Daten für " + stations[currentStation].name + "...");

    if (!(await fetchData())) {
        // if overviewData fetch failed
        root.classList.remove("loading");
        return false;
    }

    resetDisplay();
    resetForecastDisplay();
    resetWarningDisplay();

    setOverviewData();
    setForecastData();
    setWarningData();

    if (nowcastData !== undefined) {
        setNowcastData();
    }

    setNowcastDisplay();
    setDayDisplay();
    setOverviewDisplay();
    setForecastDisplay();
    setWarningDisplay();

    printNotification("Daten für " + stations[currentStation].name + " erfolgreich aktualisiert.");

    root.classList.remove("loading");
    return true;
}

/**
 * fetches overviewData for current station
 * @returns {Promise<boolean>} - success of overviewData fetch
 */
export async function fetchData() {
    const overviewFetch = fetch(stations[currentStation].overviewURL)
        .then(response => response.json())
        .then(freshData => {
            baseData = freshData[stations[currentStation].id];
            return true;
        })
        .catch((err) => {
            printNotification(err);
            return false;
        });

    await fetch(stations[currentStation].nowcastURL)
        .then(response => response.json())
        .then(freshData => {
            nowcastData = freshData;
            return true;
        })
        .catch((err) => {
            nowcastData = undefined;
            return false;
        });

    return await overviewFetch;
}

function setNowcastData() {
    stations[currentStation].setNowcast(nowcastData);
}

/**
 * sets overview overviewData for all days
 */
function setOverviewData() {
    let daysData = baseData.days;
    for (let i in daysData) {
        days[i].setOverviewData(daysData[i]);
    }
}

/**
 * sets forecast overviewData for all days
 */
function setForecastData() {
    for (let day of days) {
        day.resetData();
    }
    const forecastRoot1 = baseData.forecast1;
    const forecastRoot2 = baseData.forecast2;
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
 * sets warning overviewData for all days
 */
function setWarningData() {
    let warningRoot = baseData.warnings;
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

export function toggleNowcast() {
    tNowcast();
}

/**
 * allows switching to specified day, resets and displays forecast and overview overviewData
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
 * switches station by fetching overviewData
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
        document.getElementById("station__name").innerHTML = stations[currentStation].name;
    } else {
        currentStation = oldStation;
        return false;
    }
    return true;
}

export function addStation(index) {

}

document.addEventListener("keydown", ev => {
    switch (ev.key.toLowerCase()) {
        case "p":
            sTheme();
            break;
        case "o":
            sColor();
            break;
        case "i":
            resetData();
            break;
        case "s":
            switchStation((currentStation + 1) % stations.length);
            break;
        case "n":
            tNowcast();
            break;
        case "d":
            switchDay((currentDay + 1) % days.length);
            break;
        case "t":
            switchTab((currentTab + 1) % 3);
            break;
    }
})