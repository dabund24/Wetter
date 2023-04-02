export function unixToHoursString(unix) {
    let date = new Date(unix);
    return date.getHours() + "." + date.getMinutes() + " Uhr"
}

export function addDays(date, toBeAdded) {
    let result = new Date(date);
    result.setDate(result.getDate() + Number(toBeAdded));
    return result;
}


export const leadingZeros = (number, digits) => String(number).padStart(digits, '0');

export const daysOfWeek = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag"
]

export const icons_day = [
    "wi-na",
    "wi-day-sunny",
    "wi-day-sunny-overcast",
    "wi-day-cloudy",
    "wi-cloud",
    "wi-fog",
    "wi-fog" /* TODO slippery */,
    "wi-sprinkle",
    "wi-showers",
    "wi-rain",
    "wi-sprinkle" /* TODO slippery */,
    "wi-rain" /* TODO slippery */,
    "wi-rain-mix",
    "wi-sleet",
    "wi-snow" /* TODO little snow */,
    "wi-snow",
    "wi-snow-wind",
    "wi-hail",
    "wi-day-sprinkle",
    "wi-day-rain",
    "wi-day-rain-mix",
    "wi-day-sleet",
    "wi-day-snow",
    "wi-day-snow-wind",
    "wi-day-hail",
    "wi-day-rain-wind",
    "wi-lightning",
    "wi-storm-showers",
    "wi-thunderstorm",
    "wi-storm-showers" /* TODO thunderstorm + hail */,
    "wi-thunderstorm" /* TODO thunderstorm + strong hail */,
    "wi-day-wind"
];

export const icons_night = [
    "wi-na",
    "wi-night-clear",
    "wi-night-alt-partly-cloudy",
    "wi-night-alt-cloudy",
    "wi-cloud",
    "wi-fog",
    "wi-fog" /* TODO slippery */,
    "wi-sprinkle",
    "wi-showers",
    "wi-rain",
    "wi-sprinkle" /* TODO slippery */,
    "wi-rain" /* TODO slippery */,
    "wi-rain-mix",
    "wi-sleet",
    "wi-snow" /* TODO little snow */,
    "wi-snow",
    "wi-snow-wind",
    "wi-hail",
    "wi-night-alt-sprinkle",
    "wi-night-rain",
    "wi-night-alt-rain-mix",
    "wi-night-alt-sleet",
    "wi-night-alt-snow",
    "wi-night-alt-snow-wind",
    "wi-night-alt-hail",
    "wi-night-alt-rain-wind",
    "wi-lightning",
    "wi-storm-showers",
    "wi-thunderstorm",
    "wi-storm-showers" /* TODO thunderstorm + hail */,
    "wi-thunderstorm" /* TODO thunderstorm + strong hail */,
    "wi-strong-wind"
];

export function addClassToChildOfParent(parent, classSelector, newClass) {
    parent.querySelector(classSelector).classList.add(newClass);
}

export function replaceNaClassFromChildOfParent(parent, classSelector, newClass) {
    parent.querySelector(classSelector).classList.replace("wi-na", newClass);
}

export function setHTMLOfChildOfParent(parent, classSelector, innerHTML) {
    parent.querySelector(classSelector).innerHTML = innerHTML;
}