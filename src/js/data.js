import {days} from "./main.js";
import {currentDay} from "./navigation.js";
import {addClassToChildOfParent, replaceNaClassFromChildOfParent, setHTMLOfChildOfParent} from "./util.js";

export function resetDisplay() {
    const prefix = "wi-";
    let dataElements = document.getElementsByClassName("wi_-data");
    for (let dataElement of dataElements) {
        const classes = dataElement.className.split(" ").filter(c => !c.startsWith(prefix));
        dataElement.className = classes.join(" ").trim();
        dataElement.classList.add("wi-na");
    }
}

export function setDisplay() {
    /* set day displays */
    const dayTiles = document.getElementsByClassName("day");
    for (let i in dayTiles) {
        
        
        replaceNaClassFromChildOfParent(dayTiles[i], ".day__icon__1", days[i].icon1);
        
        if (i < 4) {
            replaceNaClassFromChildOfParent(dayTiles[i], ".day__icon__2", days[i].icon2);
        }

        setHTMLOfChildOfParent(dayTiles[i], ".day__temperature", days[i].temperatureMin + " / " + days[i].temperatureMax);
        setHTMLOfChildOfParent(dayTiles[i], ".day__precipitation", days[i].precipitation);
        setHTMLOfChildOfParent(dayTiles[i], ".day__date", days[i].stringDate);
        setHTMLOfChildOfParent(dayTiles[i], ".day__day-of-week", days[i].dayOfWeek);
    }
}