import Day from "./day.js";
import {
    root, switchTab as sTab, switchTheme as sTheme, switchDay as sDay, switchColor as sColor
} from "./navigation.js";
import {
    resetDayDisplay, resetDisplay, resetForecastDisplay, setDayDisplay, setForecastDisplay, setOverviewDisplay
} from "./data.js";
import {addHours, addDays, dayDifference, unixToHoursString} from "./util.js";

let stationID = 10863;
let data;
let dayZero;
export const days = [new Day()];

for (let i = 1; i < 10; i++) {
    days.push(new Day());
}


fetchData(stationID);


export function fetchData(stationID) {
    
    root.classList.add("loading");

    printNotication("Hole Daten...");

    resetDisplay();
    resetForecastDisplay();

    fetch("https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/forecast_mosmix_" + stationID + ".json" + "?t=" + Date.now())
        .then(response => response.json(), () => {
            printNotication(unixToHoursString(Date.now()) + ": Fehler, Holen der Daten gescheitert.");
        }).then(freshData => {
        if (freshData == null) {
            setDayDisplay();
            setOverviewDisplay();
            setForecastDisplay();
            root.classList.remove("loading");
            return;
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
    });
}

function setDates() {
    // sets date and day of week data for all days //
    dayZero = data.days[0].dayDate;
    for (let i in days) {
        days[i].setDate(addDays(dayZero, i));
    }
}

function setOverviewData() {
    let daysData = data.days;
    for (let i in daysData) {
        days[i].setOverviewData(daysData[i]);
    }
}

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

function printNotication(notification) {
    document.getElementById("status-bar").innerHTML = notification;
}

export function switchTab(index) {
    sTab(index);
}

export function switchTheme() {
    sTheme();
}

export function switchColor() {
    sColor();
}

export function switchDay(index) {
    sDay(index);
    resetDayDisplay();
    resetForecastDisplay()
    setOverviewDisplay();
    setForecastDisplay();
}