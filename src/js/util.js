export function unixToHoursString(unix) {
    let date = new Date(unix);
    return leadingZeros(date.getHours(), 2) + "." + leadingZeros(date.getMinutes(), 2) + " Uhr"
}

export function addHours(date, toBeAdded) {
    let result = new Date(date);
    result.setHours(result.getHours() + Number(toBeAdded), result.getMinutes(), result.getSeconds(), result.getMilliseconds());
    return result;
}

export function addDays(date, toBeAdded) {
    let result = new Date(date);
    result.setDate(result.getDate() + Number(toBeAdded));
    return result;
}

export function dayDifference(dateA, dateB) {
    const ms_per_day = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
    const utc2 = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());

    return Math.floor((utc2 - utc1) / ms_per_day);
}


export const leadingZeros = (number, digits) => String(number).padStart(digits, '0');

export const daysOfWeek = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
]

export const daysOfWeekShort = [
    "So",
    "Mo",
    "Di",
    "Mi",
    "Do",
    "Fr",
    "Sa",
    "So"
]

export const moonPhases = [
    "wi-moon-waxing-crescent-4",
    "wi-moon-first-quarter",
    "wi-moon-waxing-gibbous-3",
    "wi-moon-full",
    "wi-moon-waning-gibbous-4",
    "wi-moon-third-quarter",
    "wi-moon-waning-crescent-3",
    "wi-moon-new"
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
    "wi-night-alt-rain",
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

export const warningIcons = [
    "wi-lightning",
    "wi-strong-wind",
    "wi-rain",
    "wi-snow-wind",
    "wi-fog",
    "wi-snowflake-cold",
    "wi-stars",
    "wi-flood",
    "wi-fire",
    "wi-hot",
    "wi-na",
    "wi-na",
    "wi-na"
]

export function addClassToChildOfParent(parent, classSelector, newClass) {
    parent.querySelector(classSelector).classList.add(newClass);
}

export function replaceNaClassFromChildOfParent(parent, classSelector, newClass) {
    parent.querySelector(classSelector).classList.replace("wi-na", newClass);
}

export function setHTMLOfChildOfParent(parent, classSelector, innerHTML) {
    if (parent != null) {
        parent.querySelector(classSelector).innerHTML = innerHTML;
    }
}