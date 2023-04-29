import Day from "./day.js";
import Warning from "./warning.js";
import Station from "./station.js";
import {
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
    setForecastDisplay,
    setInfoDisplay,
    setNowcastDisplay,
    setOverviewDisplay,
    setStarredDisplay,
    setWarningDisplay
} from "./data.js";
import {addDays, addHours, cancelTimezoneOffset, dayDifference, getStationById, printNotification} from "./util.js";
import {getSearchSuggestions, displaySearchSuggestions, setupSearch} from "./search.js";

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
    new Station(await getStationById("10389")), // B-A
    new Station(await getStationById("P0489")), // H-I
    new Station(await getStationById("10865")), //M-S
    new Station(await getStationById("P0532")), // G
    new Station(await getStationById("10863")) //W-D
];

/**
 * the index of the station in stations that is displayed
 * @type {Station}
 */
export let currentStation = stations[0];

setupSearch();

setStarredDisplay();

document.getElementById("station__name").innerHTML = currentStation.name;
resetData();


/**
 * fetches overviewData, resets and sets display
 * @returns {Promise<boolean>} - success of overviewData fetch
 */
export async function resetData() {
    root.classList.add("loading");
    printNotification("Hole Daten für " + currentStation.name + "...");

    if (!(await fetchData()) || baseData === undefined) {
        // if overviewData fetch failed
        root.classList.remove("loading");
        printNotification("Daten konnten nicht geladen werden.")
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
        document.getElementById("nowcast").setAttribute("data-nowcast-available", "1");
    } else {
        document.getElementById("nowcast").setAttribute("data-nowcast-available", "0");
    }

    setInfoDisplay();
    setNowcastDisplay();
    setDayDisplay();
    setOverviewDisplay();
    setForecastDisplay();
    setWarningDisplay();

    printNotification("Daten für " + currentStation.name + " erfolgreich aktualisiert.");

    root.classList.remove("loading");
    return true;
}

/**
 * fetches overviewData for current station
 * @returns {Promise<boolean>} - success of overviewData fetch
 */
export async function fetchData() {
    const overviewFetch = fetch(currentStation.overviewURL)
        .then(response => response.json())
        .then(freshData => {
            baseData = freshData[currentStation.id];
            return true;
        })
        .catch((err) => {
            printNotification(err);
            return false;
        });

    await fetch(currentStation.nowcastURL)
        .then(response => response.json())
        .then(freshData => {
            nowcastData = freshData;
            return true;
        })
        .catch(() => {
            nowcastData = undefined;
            return false;
        });

    return await overviewFetch;
}

function setNowcastData() {
    currentStation.setNowcast(nowcastData);
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

    currentStation.icon = days[0].icons[0];
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

export async function refreshAutocomplete(text) {
    if (text === "") {
        document.getElementById("search__suggestions").replaceChildren();
        displaySearchSuggestions([]);
        return;
    }
    let suggestions = await getSearchSuggestions(text);
    displaySearchSuggestions(suggestions);
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

export function toggleNowcast(index) {
    tNowcast(index);
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
 * @param {string} id - id of station, 0 if called from pinned bar
 * @param {number} index - index of station in pinned stations, -1 if not called from pinned bar
 * @returns {Promise<boolean>} - success of station switch
 */
export async function switchStation(id, index) {
    let newStation;
    // if new station is not yet pinned
    const isNotPinned = index === -1 && stations.find(station => station.id === id) === undefined;
    if (isNotPinned) {
        console.log(id);
        newStation = new Station(await getStationById(id));
    } else if (index === -1) {
        newStation = stations.find(station => station.id === id);
        index = stations.indexOf(newStation);
    } else {
        newStation = stations[index];
        if (newStation === currentStation) {
            return false;
        }
    }
    let oldStation = currentStation;
    currentStation = newStation;
    if (await resetData()) {
        sStation(index);
        document.getElementById("station__name").innerHTML = currentStation.name;
        return true;
    } else {
        currentStation = oldStation;
        return false;
    }
}

export function toggleStationStar() {
    if (stations.includes(currentStation)) {
        stations.splice(stations.indexOf(currentStation), 1);
        setStarredDisplay();
        sStation(-1);
    } else {
        stations.push(currentStation);
        setStarredDisplay();
        sStation(stations.length - 1);
    }

}

/*document.addEventListener("keydown", ev => {
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
})*/