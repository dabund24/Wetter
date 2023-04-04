import Day from "./day.js";
import Station from "./station.js";
import {
    root, switchTab as sTab, switchTheme as sTheme, switchDay as sDay, switchStation as sStation, switchColor as sColor
} from "./navigation.js";
import {
    resetOverviewDisplay, resetDisplay, resetForecastDisplay, setDayDisplay, setForecastDisplay, setOverviewDisplay
} from "./data.js";
import {addHours, addDays, dayDifference, unixToHoursString} from "./util.js";

let data;
let dayZero;
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
switchStation(0);

/**
 * fetches data for current station and displays it
 * @returns {Promise<boolean>} - success of data fetch
 */
export function fetchData() {
    root.classList.add("loading");
    printNotication("Hole Daten für " + stations[currentStation].name + "...");
    return fetch("https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/forecast_mosmix_" + stations[currentStation].id + ".json" + "?t=" + Date.now())
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
    });
}

/**
 * sets date and day of week data for all days
 */
function setDates() {
    dayZero = data.days[0].dayDate;
    for (let i in days) {
        days[i].setDate(addDays(dayZero, i));
    }
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
    const forecastRoot = data.forecast;
    const forecastStart = new Date(forecastRoot.start);
    let currentTime;
    let currentDayIndex;

    for (let i = 0; i < forecastRoot.temperature.length; i++) {
        currentTime = addHours(forecastStart, i * 6);
        currentDayIndex = dayDifference(forecastStart, currentTime);
        days[currentDayIndex].pushData(
            currentTime,
            forecastRoot.icon[i],
            forecastRoot.temperature[i],
            forecastRoot.precipitationTotal[i],
            forecastRoot.windSpeed[i],
            forecastRoot.windGust[i],
            forecastRoot.windDirection[i]);
    }
}

// displays a notification in page footer //
function printNotication(notification) {
    document.getElementById("status-bar").innerHTML = notification;
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
    resetForecastDisplay()
    setOverviewDisplay();
    setForecastDisplay();
}

/**
 * switches station by fetching data
 * @param {number} index - index of station in stations
 * @returns {Promise<void>}
 */
export async function switchStation(index) {
    let oldStation = currentStation;
    currentStation = index;
    if (await fetchData()) {
        currentStation = index;
        sStation(currentStation);
        document.getElementById("station-name").innerHTML = stations[currentStation].name;
    } else {
        currentStation = oldStation;
    }
}

export function addStation(index) {

}