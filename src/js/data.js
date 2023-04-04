import {days} from "./main.js";
import {currentDay} from "./navigation.js";
import {addClassToChildOfParent, replaceNaClassFromChildOfParent, setHTMLOfChildOfParent} from "./util.js";

/**
 * resets data icons globally
 */
export function resetDisplay() {
    let dataElements = document.getElementsByClassName("wi_-data");
    for (let dataElement of dataElements) {
        const classes = dataElement.className.split(" ").filter(c => !c.startsWith("wi-") && !c.startsWith("from-"));
        dataElement.className = classes.join(" ").trim();
        dataElement.classList.add("wi-na");
    }
}

/**
 * resets data icons in overview
 */
export function resetOverviewDisplay() {
    let tabContent = document.getElementById("tab-content");
    let dataElements = tabContent.getElementsByClassName("wi_-data");
    for (let dataElement of dataElements) {
        const classes = dataElement.className.split(" ").filter(c => !c.startsWith("wi-") && !c.startsWith("from-"));
        dataElement.className = classes.join(" ").trim();
        dataElement.classList.add("wi-na");
    }
}

/**
 * deletes all rows in forecast table
 */
export function resetForecastDisplay() {
    const forecastContent = document.querySelector("#forecast__content");
    forecastContent.replaceChildren();
}

/**
 * displays preview data for all days
 */
export function setDayDisplay() {
    const dayTiles = document.getElementsByClassName("day");
    for (let i = 0; i < dayTiles.length; i++) {
        replaceNaClassFromChildOfParent(dayTiles[i], ".day__icon__1", days[i].icon1);
        if (i < 4) {
            replaceNaClassFromChildOfParent(dayTiles[i], ".day__icon__2", days[i].icon2);
            setHTMLOfChildOfParent(dayTiles[i], ".day__temperature", days[i].temperatureMin + " / " + days[i].temperatureMax);
            setHTMLOfChildOfParent(dayTiles[i], ".day__precipitation", days[i].precipitation);
        }
        setHTMLOfChildOfParent(dayTiles[i], ".day__date", days[i].stringDate);
        setHTMLOfChildOfParent(dayTiles[i], ".day__day-of-week", days[i].dayOfWeek);
    }
}

/**
 * displays overview data for current day
 */
export function setOverviewDisplay() {
    const dayData = document.getElementById("tab-content-1");
    const day = days[currentDay];
    replaceNaClassFromChildOfParent(dayData, ".day-data__icon1", day.icon1);
    replaceNaClassFromChildOfParent(dayData, ".day-data__icon2", day.icon2);
    setHTMLOfChildOfParent(dayData, ".day-data__temperatureMin", day.temperatureMin);
    setHTMLOfChildOfParent(dayData, ".day-data__temperatureMax", day.temperatureMax);
    setHTMLOfChildOfParent(dayData, ".day-data__precipitation", day.precipitation);
    setHTMLOfChildOfParent(dayData, ".day-data__sunshine", day.sunshine);
    setHTMLOfChildOfParent(dayData, ".day-data__sunrise", day.sunrise);
    setHTMLOfChildOfParent(dayData, ".day-data__sunset", day.sunset);
    setHTMLOfChildOfParent(dayData, ".day-data__moonrise", day.moonrise);
    setHTMLOfChildOfParent(dayData, ".day-data__moonset", day.moonset);
    setHTMLOfChildOfParent(dayData, ".day-data__windSpeed", day.windSpeed);
    setHTMLOfChildOfParent(dayData, ".day-data__windGust", day.windGust);
    replaceNaClassFromChildOfParent(dayData, ".day-data__windDirection", "wi-wind");
    addClassToChildOfParent(dayData, ".day-data__windDirection", day.windDirection);
    replaceNaClassFromChildOfParent(dayData, ".day-data__moonPhase", day.moonPhase);
}

/**
 * displays forecast data for current day
 */
export function setForecastDisplay() {
    const forecast = document.getElementById("tab-content-0");
    const template = forecast.querySelector("template").content;
    const day = days[currentDay];
    let toBeAdded;
    for (let i = 0; i < day.times.length; i++) {
        toBeAdded = document.importNode(template, true);
        setHTMLOfChildOfParent(toBeAdded, ".forecast__time", day.times[i]);
        replaceNaClassFromChildOfParent(toBeAdded, ".forecast__icon", day.icons[i]);
        setHTMLOfChildOfParent(toBeAdded, ".forecast__temperature", day.temperatures[i]);
        setHTMLOfChildOfParent(toBeAdded, ".forecast__precipitation", day.precipitations[i]);
        setHTMLOfChildOfParent(toBeAdded, ".forecast__windSpeed", day.windSpeeds[i]);
        setHTMLOfChildOfParent(toBeAdded, ".forecast__windGust", day.windGusts[i]);
        replaceNaClassFromChildOfParent(toBeAdded, ".forecast__windDirection", "wi-wind");
        addClassToChildOfParent(toBeAdded, ".forecast__windDirection", day.windDirections[i]);
        forecast.querySelector("#forecast__content").appendChild(toBeAdded);
    }
}