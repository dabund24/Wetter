export const root = document.querySelector(':root');

let currentStation = 0;
/**
 * switch station
 * @param newStation - index of new station
 */
export function switchStation(newStation) {
    let stations = document.getElementById("starred");
    stations.children[currentStation].classList.remove("starred__station--active");
    stations.children[newStation].classList.add("starred__station--active");
    currentStation = newStation;
}


export let currentTab = 0;
const tabPercentages = ["17%", "50%", "83%"];

/**
 * switches to tab with index
 * @param newTab - index of new tab: 0 -> forecast, 1 -> dayData, 2 -> warnings
 */
export function switchTab(newTab) {
    if (newTab === currentTab) {
        return;
    }

    const tabLine = document.getElementById("tab-indicator");
    
    // set variables for start and end
    tabLine.style.setProperty("--animation--tab-indicator__start", tabPercentages[currentTab]);
    tabLine.style.setProperty("--animation--tab-indicator__end", tabPercentages[newTab]);
    
    tabLine.classList.remove("indicator__animation-to-right");
    tabLine.classList.remove("indicator__animation-to-left");
    tabLine.offsetWidth;
    if (newTab > currentTab) {
        tabLine.classList.add("indicator__animation-to-right");
    } else {
        tabLine.classList.add("indicator__animation-to-left");
    }
    
    document.getElementById("tab-content-" + currentTab).style.setProperty("display", "none");
    document.getElementById("tab-content-" + newTab).style.setProperty("display", "block");

    currentTab = newTab;
}

export let currentDay = 0;
const dayPercentages = ["5%", "15%", "25%", "35%", "45%", "55%", "65%", "75%", "85%", "95%"];

/**
 * switch day
 * @param newDay - index of new day
 */
export function switchDay(newDay) {
    if (newDay === currentDay) {
        return;
    }
    
    const dayLine = document.getElementById("day-indicator");

    // set variables for start and end
    dayLine.style.setProperty("--animation--tab-indicator__start", dayPercentages[currentDay]);
    dayLine.style.setProperty("--animation--tab-indicator__end", dayPercentages[newDay]);

    dayLine.classList.remove("indicator__animation-to-right");
    dayLine.classList.remove("indicator__animation-to-left");
    dayLine.offsetWidth;
    if (newDay > currentDay) {
        dayLine.classList.add("indicator__animation-to-right");
    } else {
        dayLine.classList.add("indicator__animation-to-left");
    }
    currentDay = newDay;
}

export function switchTheme() {
    if (document.documentElement.getAttribute("data-theme") === "light") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }
}

const colors = ["green", "red", "blue"];
let currentColor = 0;
export function switchColor() {
    currentColor = (currentColor + 1) % 3;
    document.documentElement.setAttribute("data-color", colors[currentColor]);
}

/**
 * show nowcast
 */
export function toggleNowcast() {
    const nowcast = document.getElementById("nowcast");
    if (nowcast.getAttribute("data-nowcast") === "0") {
        nowcast.setAttribute("data-nowcast", "1");
    } else {
        nowcast.setAttribute("data-nowcast", "0");
    }
}