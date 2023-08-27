import {slideIndicator} from "./pageActions.js";

let currentStation = 0;
/**
 * switch station
 * @param newStation - index of new station
 */
export function switchStation(newStation) {
    let stations = document.getElementById("starred");
    document.getElementById("starred__toggle").innerText = "+";
    if (currentStation !== -1 && currentStation < stations.children.length) {
        stations.children[currentStation].classList.remove("selectable--horizontal--active");
    }
    if (newStation !== -1) {
        stations.children[newStation].classList.add("selectable--horizontal--active");
        document.getElementById("starred__toggle").innerText = "–";
    }
    currentStation = newStation;
}


export let currentTab = 0;

/**
 * switches to tab with index
 * @param newTab - index of new tab: 0 -> forecast, 1 -> dayData, 2 -> warnings
 */
export function switchTab(newTab) {
    if (newTab === currentTab) {
        return;
    }

    slideIndicator("tab-indicator", 3, currentTab, newTab)

    document.getElementById("tab-content-" + currentTab).style.setProperty("display", "none");
    document.getElementById("tab-content-" + newTab).style.setProperty("display", "block");

    currentTab = newTab;
}

export let currentDay = 0;

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

    const daysMobile = document.getElementsByClassName("day-mobile")
    daysMobile[currentDay].classList.remove("option--focus")
    daysMobile[newDay].classList.add("option--focus")

    slideIndicator("day-indicator", 10, currentDay, newDay)
    slideIndicator("day-indicator--mobile", 3, newDay > currentDay ? 0 : 2, 1)

    currentDay = newDay
}

let mobileDaySelectIsShown = false

export function showMobileDaySelect() {
    if (!mobileDaySelectIsShown) {
        document.getElementById("day-select-mobile").style.removeProperty("display")
        mobileDaySelectIsShown = true
    } else {
        document.getElementById("day-select-mobile").style.setProperty("display", "none")
        mobileDaySelectIsShown = false
    }
}


export function setTheme(theme) {
    if (document.documentElement.getAttribute("data-theme") === theme) {
        return
    }
    slideIndicator("theme-indicator", 2, theme === "light", theme === "dark")

    document.documentElement.setAttribute("data-theme", theme);
    fetch("/setCookie?key=theme&value=" + theme)
}

const colors = ["red", "yellow", "green", "blue", "purple", "gray"];
let currentColor = -1;
export function setColor(color) {
    if (color === currentColor) {
        return;
    }

    slideIndicator("color-indicator", 6, currentColor, color)

    currentColor = color;
    document.documentElement.setAttribute("data-color", colors[color]);
    fetch("/setcookie?key=color&value=" + color)
}

/**
 * show nowcast
 */
export function toggleNowcast(index) {
    const station = document.getElementById("station");
    const stationSelectables = station.getElementsByClassName("selectable--horizontal");
    if (stationSelectables[index - 1].classList.contains("selectable--horizontal--active")) {
        stationSelectables[index - 1].classList.remove("selectable--horizontal--active")
    } else {
        stationSelectables[(index % 2)].classList.remove("selectable--horizontal--active")
        stationSelectables[index - 1].classList.add("selectable--horizontal--active")
    }

    const bsn = document.getElementById("below-station-name");
    if (bsn.getAttribute("data-nowcast") !== index) {
        bsn.setAttribute("data-nowcast", index);
    } else {
        bsn.setAttribute("data-nowcast", "0");
    }
}