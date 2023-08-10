export const root = document.querySelector(':root');

let currentStation = 0;
/**
 * switch station
 * @param newStation - index of new station
 */
export function switchStation(newStation) {
    let stations = document.getElementById("starred");
    if (currentStation !== -1 && currentStation < stations.children.length) {
        stations.children[currentStation].classList.remove("starred__station--active");
    }
    if (newStation !== -1) {
        stations.children[newStation].classList.add("starred__station--active");
    }
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
        fetch("/setCookie?key=theme&value=dark")
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        fetch("/setCookie?key=theme&value=light")
    }
}

export function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    fetch("/setCookie?key=theme&value=" + theme)
}

const colors = ["green", "red", "blue"];
let currentColor = 0;
export function switchColor() {
    currentColor = (currentColor + 1) % 3;
    document.documentElement.setAttribute("data-color", colors[currentColor]);
    fetch("/setcookie?key=color&value=" + currentColor)//.then(res => console.log(res.body));
}

export function setColor(color) {
    currentColor = color;
    document.documentElement.setAttribute("data-color", colors[color]);
    fetch("/setcookie?key=color&value=" + color)
}

/**
 * show nowcast
 */
export function toggleNowcast(index) {
    const bsn = document.getElementById("below-station-name");
    if (bsn.getAttribute("data-nowcast") !== index) {
        bsn.setAttribute("data-nowcast", index);
    } else {
        bsn.setAttribute("data-nowcast", "0");
    }
}