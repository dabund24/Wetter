export const root = document.querySelector(':root');

let currentStation = 0;
/**
 * switch station
 * @param newStation - index of new station
 */
export function switchStation(newStation) {
    let stations = document.getElementById("starred");
    document.getElementById("starred__toggle").innerText = "+";
    if (currentStation !== -1 && currentStation < stations.children.length) {
        stations.children[currentStation].classList.remove("starred__station--active");
    }
    if (newStation !== -1) {
        stations.children[newStation].classList.add("starred__station--active");
        document.getElementById("starred__toggle").innerText = "–";
    }
    currentStation = newStation;
}


export let currentTab = 0;
const tabPercentages = ["calc(100% / 6)", "50%", "calc((100% / 6) * 5)"];

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
    if (newDay === -1) {
        newDay = (currentDay + 9) % 10;
    } else if (newDay === -2) {
        newDay = (currentDay + 1) % 10;
    }
    
    const dayLine = document.getElementById("day-indicator");
    const dayLineMobile = document.getElementById("day-indicator--mobile");

    // set variables for start and end
    dayLine.style.setProperty("--animation--tab-indicator__start", dayPercentages[currentDay]);
    dayLine.style.setProperty("--animation--tab-indicator__end", dayPercentages[newDay]);
    dayLineMobile.style.setProperty("--animation--tab-indicator__end", "50%");

    dayLine.classList.remove("indicator__animation-to-right");
    dayLine.classList.remove("indicator__animation-to-left");
    dayLine.offsetWidth;
    dayLineMobile.classList.remove("indicator__animation-to-right");
    dayLineMobile.classList.remove("indicator__animation-to-left");
    dayLine.offsetWidth;
    if (newDay > currentDay) {
        dayLine.classList.add("indicator__animation-to-right");
        dayLineMobile.style.setProperty("--animation--tab-indicator__start", "10%")
        dayLineMobile.classList.add("indicator__animation-to-right");
    } else {
        dayLine.classList.add("indicator__animation-to-left");
        dayLineMobile.style.setProperty("--animation--tab-indicator__start", "90%")
        dayLineMobile.classList.add("indicator__animation-to-left");
    }
    currentDay = newDay;
}


export function setTheme(theme) {
    if (document.documentElement.getAttribute("data-theme") === theme) {
        return
    }
    const themeLine = document.getElementById("theme-indicator");
    themeLine.classList.remove("indicator__animation-to-right");
    themeLine.classList.remove("indicator__animation-to-left");
    themeLine.offsetWidth;

    if (theme === "dark") {
        themeLine.style.setProperty("--animation--tab-indicator__start", "25%");
        themeLine.style.setProperty("--animation--tab-indicator__end", "75%");
        themeLine.classList.add("indicator__animation-to-right");
    } else if (theme === "light") {
        themeLine.style.setProperty("--animation--tab-indicator__start", "75%");
        themeLine.style.setProperty("--animation--tab-indicator__end", "25%");
        themeLine.classList.add("indicator__animation-to-left");
    }
    document.documentElement.setAttribute("data-theme", theme);
    fetch("/setCookie?key=theme&value=" + theme)
}

const colors = ["red", "yellow", "green", "blue", "purple", "gray"];
const colorPercentages = ["calc(100% / 12)", "25%", "calc(100% / 12) * 5", "calc(100% / 12) * 7", "75%", "calc((100% / 12) * 11)"];
let currentColor = -1;
export function setColor(color) {
    if (color === currentColor) {
        return;
    }
    const colorLine = document.getElementById("color-indicator");

    // set variables for start and end
    colorLine.style.setProperty("--animation--tab-indicator__start", colorPercentages[currentColor]);
    colorLine.style.setProperty("--animation--tab-indicator__end", colorPercentages[color]);

    colorLine.classList.remove("indicator__animation-to-right");
    colorLine.classList.remove("indicator__animation-to-left");
    colorLine.offsetWidth;
    if (color > currentColor) {
        colorLine.classList.add("indicator__animation-to-right");
    } else {
        colorLine.classList.add("indicator__animation-to-left");
    }
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