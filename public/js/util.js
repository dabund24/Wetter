/**
 * converts unix timestamp to human-readable string in German
 * @param {number} unix - timestamp
 * @returns {string} - a string following this scheme: `hh.mm Uhr`
 */
export function unixToHoursString(unix) {
    let date = new Date(unix);
    return leadingZeros(date.getHours(), 2) + "." + leadingZeros(date.getMinutes(), 2) + " Uhr"
}

/**
 * a function for adding hours to a date
 * @param {Date} date - the base date
 * @param {number} toBeAdded - the amount of to be added hours
 * @returns {Date} - the result
 */
export function addHours(date, toBeAdded) {
    let result = new Date(date);
    result.setHours(result.getHours() + Number(toBeAdded), result.getMinutes(), result.getSeconds(), result.getMilliseconds());
    return result;
}

/**
 * a function for adding days to a date
 * @param {Date} date - the base date
 * @param {Date} toBeAdded - the amount of to be added days
 * @returns {Date} - the result
 */
export function addDays(date, toBeAdded) {
    let result = new Date(date);
    result.setDate(result.getDate() + Number(toBeAdded));
    return result;
}

/**
 * a function for subtracting a day from another one
 * @param {Date} dateA - the earlier date
 * @param {Date} dateB - the later date
 * @returns {number} - the amount of days in the time span `dateB - dateA`
 */
export function dayDifference(dateA, dateB) {
    const ms_per_day = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
    const utc2 = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());

    return Math.floor((utc2 - utc1) / ms_per_day);
}

/**
 * adds, if necessary, leading zeroes to a number to reach an amount of digits
 * @param {number} number - the number that needs leading zeroes
 * @param {number} digits - the amount of digits the number is supposed to have
 * @returns {string} - the number with leading zeroes
 */
export function leadingZeros(number, digits) {
    return String(number).padStart(digits, '0');
}

/**
 * takes a `Date` in utc time and translates it to local time by adding/subtracting hours
 * @param {Date, number} date - the date in utc time
 * @returns {number} - the same date in local time
 */
export function cancelTimezoneOffset(date) {
    const utcDate = new Date(date);
    const timezoneOffset = new Date().getTimezoneOffset();
    return utcDate.setMinutes(utcDate.getMinutes() + timezoneOffset);
}

/**
 * stores German representations of weekdays starting with `Sonntag` and ending with `Montag`
 * @type {string[]}
 */
export const daysOfWeek = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
]

/**
 * stores short German representations of weekdays starting with `So` and ending with `Sa`
 * @type {string[]}
 */
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

/**
 * stores css classes for eight moon phases starting with `wi-moon-waxing-crescent-4` and ending with `wi-moon-new`
 * @type {string[]}
 */
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

/**
 * stores `wi-na` at index 0 and all day css classes for every icon specified in the dwd api
 * @type {string[]}
 */
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

/**
 * stores `wi-na` at index 0 and all day css classes for every icon specified in the dwd api
 * @type {string[]}
 */
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

/**
 * stores css classes for icons shown in warning display
 * @type {string[]}
 */
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

/**
 * adds a class to a child of a parent
 * @param {DocumentFragment} parent - the parent
 * @param {string} childSelector - a selector of the child
 * @param {string} newClass - the class the child should have
 */
export function addClassToChildOfParent(parent, childSelector, newClass) {
    parent.querySelector(childSelector).classList.add(newClass);
}

/**
 * replaces the class `wi-na` of a child of a parent
 * @param {HTMLElement} parent - the parent
 * @param {string} childSelector - a selector of the child
 * @param {string} newClass - the class that should replace `wi-na`
 */
export function replaceNaClassOfChildOfParent(parent, childSelector, newClass) {
    if (newClass === undefined) {
        return;
    }
    parent.querySelector(childSelector).classList.replace("wi-na", newClass);
}

/**
 * sets the innerHTML of a child of a parent
 * @param {HTMLElement} parent - the parent
 * @param {string} childSelector - a selector of the child
 * @param {string} innerHTML - the innerHTML the child should have
 */
export function setHTMLOfChildOfParent(parent, childSelector, innerHTML) {
    if (parent != null) {
        parent.querySelector(childSelector).innerHTML = innerHTML;
    }
}

/**
 * displays a notification in page footer in this scheme:
 * `hh.mm Uhr: <notification>`
 * @param {string} notification - the notification to be displayed
 */
export function printNotification(notification) {
    document.getElementById("footer__status-bar").innerHTML = unixToHoursString(Date.now()) + ": " + notification;
}

export async function getStationById(id) {
    return fetch("/suggest?id=" + id).then(response => response.json());
}

export function checkUndefined(value, suffix) {
    return value === undefined || value === "3,276.7" ? "nicht verfügbar" : value + suffix;
}