import Day from "./day.js";
import {root, switchTab as sTab, switchTheme as sTheme, switchDay as sDay} from "./navigation.js";

let stationID = 10863;
const days = [new Day()];

for (let i = 1; i < 10; i++) {
    days.push(new Day());
}


root.classList.add("loading");

fetchData(stationID);



export function fetchData(stationIDlol) {
    fetch("https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/forecast_mosmix_" + stationID + ".json")
        .then(response => response.json()).then(data => {
            processOverviewData(data);
    });
}

function processOverviewData(data) {
    let daysData = data.days;
    for (let i in daysData) {
        days[i].addOverviewData(daysData[i]);
    }
}

function logData(data) {
    console.log(data);
}

export function switchTab(index) {
    sTab(index);
}

export function switchTheme(index) {
    sTheme(index);
}

export function switchDay(index) {
    sDay(index);
}