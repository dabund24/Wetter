import Day from "./day.js";
import {root, switchTab as sTab, switchTheme as sTheme, switchDay as sDay} from "./navigation.js";
import {resetDisplay, setDisplay} from "./data.js";
import {addDays} from "./util.js";

let stationID = 10863;
let data;
let dayZero;
export const days = [new Day()];

for (let i = 1; i < 10; i++) {
    days.push(new Day());
}

console.log("WTF")

fetchData(stationID);



export function fetchData(stationID) {
    
    resetDisplay();
    
    fetch("https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/forecast_mosmix_" + stationID + ".json")
        .then(response => response.json()).then(freshData => {
            data = freshData;
            setDates();
            setOverviewData();
            setDisplay();
    });
}

function setDates() {
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