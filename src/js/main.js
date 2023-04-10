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
import {addDays, addHours, dayDifference, unixToHoursString} from "./util.js";

let data;
export const days = [new Day()];

for (let i = 1; i < 10; i++) {
    days.push(new Day());
}

const stations = [
    new Station("10382", "Berlin-Tegel"),
    new Station("10865", "München Stadt"),
    new Station("P0532", "Garching"),
    new Station("10863", "Weihenstephan-Dürnast"),
    new Station("N3951", "Wertheim-Eichel")
]
let currentStation = 0;
document.getElementById("station-name").innerHTML = stations[currentStation].name;
resetData();

/*switchStation(0);*/

export async function resetData() {
    root.classList.add("loading");
    printNotication("Hole Daten für " + stations[currentStation].name + "...");

    if (!(await fetchData())) {
        // if data fetch failed
        //printNotication(unixToHoursString(Date.now()) + ": Fehler, Holen der Daten gescheitert.");
        root.classList.remove("loading");
        return false;
    }
    console.log(data);

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
    printNotication("Daten erfolgreich aktualisiert.")
    root.classList.remove("loading");
    return true;
}

/**
 * fetches data for current station and displays it
 * @returns {Promise<boolean>} - success of data fetch
 */
export async function fetchData() {
    /*root.classList.add("loading");
    printNotication("Hole Daten für " + stations[currentStation].name + "...");
    return fetch("https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/forecast_mosmix_" + stations[currentStation].id + ".json" + "&t=" + Date.now())
        .then(response => response.json(), () => {
            printNotication(unixToHoursString(Date.now()) + ": Fehler, Holen der Daten gescheitert.");
        }).then(freshData => {
        resetDisplay();
        resetForecastDisplay();
        if (freshData == null) {
            setDayDisplay();
            setOverviewDisplay();
            setForecastDisplay();
            root.classList.remove("loading");
            return false;
        }
        data = freshData;
        setDates();
        setOverviewData();
        setForecastData();
        setDayDisplay();
        setOverviewDisplay();
        setForecastDisplay();
        printNotication(unixToHoursString(Date.now()) + ": Daten erfolgreich aktualisiert.")
        root.classList.remove("loading");
        return true;
    });*/
    return fetch("https://api.allorigins.win/raw?url=https://dwd.api.proxy.bund.dev/v30/stationOverviewExtended?stationIds=" + stations[currentStation].id/* + "&t=" + Date.now()*/)
        .then(response => response.json())
        .then(freshData => {
            data = freshData[stations[currentStation].id];
            return true;
        })
        .catch((err) => {
            console.log(err);
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

// TODO figure out why some data of last days is misaligned //
// TODO set trend data                                      //
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
            const dayStart = day.date;
            const dayEnd = addHours(day.date, 24);
            // check if warning is within day
            if ((warningStart > dayStart && warningStart < dayEnd) ||
                (warningEnd > dayStart && warningEnd < dayEnd) ||
                (warningStart < dayStart && warningEnd > dayEnd)) {
                day.pushWarning(warning);
            }
        }
    }
}

// displays a notification in page footer //
function printNotication(notification) {
    document.getElementById("status-bar").innerHTML = unixToHoursString(Date.now()) + ": " + notification;
}

// switches tab to parameter //
export function switchTab(index) {
    sTab(index);
}

// switches between light and dark theme //
export function switchTheme() {
    sTheme();
}

// switches between green, red and blue accent color //
export function switchColor() {
    sColor();
}

// switches day to parameter; resets and displays forecast and overview data //
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
 * @returns {Promise<void>}
 */
export async function switchStation(index) {
    if (index === currentStation) {
        return;
    }
    let oldStation = currentStation;
    currentStation = index;
    if (await resetData()) {
        sStation(currentStation);
        document.getElementById("station-name").innerHTML = stations[currentStation].name;
    } else {
        currentStation = oldStation;
    }
}

export function addStation(index) {

}