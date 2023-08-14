import {days, stations, currentStation} from "./main.js";
import {currentDay} from "./navigation.js";
import {addClassToChildOfParent, replaceNaClassOfChildOfParent, setHTMLOfChildOfParent} from "./util.js";

/**
 * shows all stations below search bar
 */
export function setStarredDisplay() {
    const starredDisplay = document.getElementById("starred-wrapper");
    starredDisplay.querySelector("#starred").replaceChildren();
    const template = starredDisplay.querySelector("template").content;
    let toBeAdded;
    for (let i = 0; i < stations.length; i++) {
        toBeAdded = document.importNode(template, true);
        setHTMLOfChildOfParent(toBeAdded, ".starred__station-name", stations[i].name);
        starredDisplay.querySelector("#starred").append(toBeAdded);
        starredDisplay.getElementsByClassName("starred__station")[i].setAttribute("onclick", "switchStation(0, " + i + ")");
    }
}

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

export function resetWarningDisplay() {
    const warningDisplay = document.querySelector("#warning__display");
    warningDisplay.replaceChildren();
}

export function setInfoDisplay() {
    const station = currentStation;
    const info = document.getElementById("station-info");

    setHTMLOfChildOfParent(info, ".info__position", station.latitudeStr + ", " + station.longitudeStr);
    info.querySelector(".info__position").setAttribute("href", station.mapURL);
    setHTMLOfChildOfParent(info, ".info__elevation", station.elevation);
    setHTMLOfChildOfParent(info, ".info__icao", station.icao);
    setHTMLOfChildOfParent(info, ".info__id", station.id);
}

export function setNowcastDisplay() {
    const station = currentStation;
    const stationIcon = document.getElementById("station__icon");
    const nowcast = document.getElementById("nowcast");
    replaceNaClassOfChildOfParent(stationIcon, ".station__icon__0", station.icon);
    setHTMLOfChildOfParent(nowcast, ".nowcast__temperature", station.temperature);
    setHTMLOfChildOfParent(nowcast, ".nowcast__precipitation", station.precipitation);
    setHTMLOfChildOfParent(nowcast, ".nowcast__totalSnow", station.totalSnow);
    setHTMLOfChildOfParent(nowcast, ".nowcast__sunshine", station.sunshine);
    setHTMLOfChildOfParent(nowcast, ".nowcast__meanWind", station.meanWind);
    setHTMLOfChildOfParent(nowcast, ".nowcast__maxWind", station.maxWind);
    replaceNaClassOfChildOfParent(nowcast, ".nowcast__windDirection", "wi-wind");
    addClassToChildOfParent(nowcast, ".nowcast__windDirection", station.windDirection);
    setHTMLOfChildOfParent(nowcast, ".nowcast__pressure", station.pressure);
    setHTMLOfChildOfParent(nowcast, ".nowcast__humidity", station.humidity);
    setHTMLOfChildOfParent(nowcast, ".nowcast__dewPoint", station.dewPoint);
    setHTMLOfChildOfParent(nowcast, ".nowcast__time", "Um " + station.time + " gemessene Daten.");

}

/**
 * displays day preview data for all days
 */
export function setDayDisplay() {
    const dayTiles = document.getElementsByClassName("day");
    for (let i = 0; i < dayTiles.length; i++) {
        replaceNaClassOfChildOfParent(dayTiles[i], ".day__icon__0", days[i].icon);
        setHTMLOfChildOfParent(dayTiles[i], ".day__icon__warning", "");
        if (days[i].warnings.length !== 0) {
            setHTMLOfChildOfParent(dayTiles[i], ".day__icon__warning", "!");
        }
        setHTMLOfChildOfParent(dayTiles[i], ".day__temperature", days[i].temperatureMin + " / " + days[i].temperatureMax);
        setHTMLOfChildOfParent(dayTiles[i], ".day__precipitation", days[i].precipitation);
        setHTMLOfChildOfParent(dayTiles[i], ".day__date", days[i].stringDate);
        setHTMLOfChildOfParent(dayTiles[i], ".day__day-of-week", days[i].dayOfWeek);
    }
}

export function setSingleDayDisplay() {
    const dayTile = document.getElementById("day--mobile");
    dayTile.getElementsByClassName("day__icon__0")[0].className = "day__icon__0 wi wi_-data " + days[currentDay].icon;
    //replaceNaClassOfChildOfParent(dayTile, ".day__icon__0", days[index].icon);
    if (days[currentDay].warnings.length === 0) {
        setHTMLOfChildOfParent(dayTile, ".day__icon__warning", "");
    } else {
        setHTMLOfChildOfParent(dayTile, ".day__icon__warning", "!");
    }
    setHTMLOfChildOfParent(dayTile, ".day__temperature", days[currentDay].temperatureMin + " / " + days[currentDay].temperatureMax);
    setHTMLOfChildOfParent(dayTile, ".day__precipitation", days[currentDay].precipitation);
    setHTMLOfChildOfParent(dayTile, ".day__date", days[currentDay].stringDate);
    setHTMLOfChildOfParent(dayTile, ".day__day-of-week", days[currentDay].dayOfWeek);

}

/**
 * displays overview data for current day
 */
export function setOverviewDisplay() {
    const dayData = document.getElementById("tab-content-1");
    const day = days[currentDay];
    replaceNaClassOfChildOfParent(dayData, ".day-data__icon", day.icon);
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
    replaceNaClassOfChildOfParent(dayData, ".day-data__windDirection", "wi-wind");
    addClassToChildOfParent(dayData, ".day-data__windDirection", day.windDirection);
    replaceNaClassOfChildOfParent(dayData, ".day-data__moonPhase", day.moonPhase);
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
        replaceNaClassOfChildOfParent(toBeAdded, ".forecast__icon", day.icons[i]);
        setHTMLOfChildOfParent(toBeAdded, ".forecast__temperature", day.temperatures[i]);
        setHTMLOfChildOfParent(toBeAdded, ".forecast__precipitation", day.precipitations[i]);
        setHTMLOfChildOfParent(toBeAdded, ".forecast__surfacePressure", day.surfacePressures[i]);
        setHTMLOfChildOfParent(toBeAdded, ".forecast__humidity", day.humidities[i]);
        setHTMLOfChildOfParent(toBeAdded, ".forecast__dewPoint2m", day.dewPoints2m[i]);
        forecast.querySelector("#forecast__content").appendChild(toBeAdded);
    }
}

/**
 * displays warning data for current day
 */
export function setWarningDisplay() {
    const warningDisplay = document.getElementById("tab-content-2");
    const day = days[currentDay];
    if (day.warnings.length === 0) {
        document.getElementById("no-warning").style.setProperty("display", "block");
        return;
    }
    const template = warningDisplay.querySelector("template").content;
    let toBeAdded;
    for (let warning of day.warnings) {
        toBeAdded = document.importNode(template, true);
        setHTMLOfChildOfParent(toBeAdded, ".warning__title", warning.title);
        addClassToChildOfParent(toBeAdded, ".warning__level","warning__level--" + warning.level);
        replaceNaClassOfChildOfParent(toBeAdded, ".warning__type-icon", warning.typeIcon);
        setHTMLOfChildOfParent(toBeAdded, ".warning__text__description", warning.description);
        setHTMLOfChildOfParent(toBeAdded, ".warning__text__instruction", warning.instruction);
        warningDisplay.querySelector("#warning__display").appendChild(toBeAdded);
    }
    document.getElementById("no-warning").style.setProperty("display", "none");
}