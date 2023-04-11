import {unixToHoursString, daysOfWeek, leadingZeros, moonPhases, icons_day, icons_night} from "./util.js";

export default class Day {

    /**
     * initialises new station with date and empty arrays for forecast and warnings
     */
    constructor() {
        this.date = new Date(0);
        this.icon = icons_day[0];
        this.moonPhase = icons_day[0];
        this.times = [];
        this.icons = [];
        this.temperatures = [];
        this.precipitations = [];
        this.surfacePressures = [];
        this.humidities = [];
        this.dewPoints2m = [];
        this.warnings = [];
    }

    /**
     * sets correct strings of day for overview
     * @param {Object} data - the object storing necessary data for this day
     */
    setOverviewData(data) {
        this.date = new Date(data.dayDate);
        this.dayOfWeek = daysOfWeek[this.date.getDay()]
        this.stringDate = leadingZeros(this.date.getDate(), 2) + "."
            + leadingZeros(this.date.getMonth() + 1, 2) + "."
            + leadingZeros(this.date.getFullYear(), 4);
        
        this.icon = icons_day[data.icon];
        this.temperatureMin = (data.temperatureMin / 10).toLocaleString() + " °C";
        this.temperatureMax = (data.temperatureMax / 10).toLocaleString() + " °C";
        this.precipitation = (data.precipitation / 10).toLocaleString() + " mm";
        this.sunshine = Number((data.sunshine / 500).toFixed(1)).toLocaleString() + " Stunden"; /* TODO check if correct*/
        this.sunrise = unixToHoursString(data.sunrise);
        this.sunriseTime = data.sunrise;
        this.sunset = unixToHoursString(data.sunset);
        this.sunsetTime = data.sunset;
        this.moonrise = unixToHoursString(data.moonrise);
        this.moonset = unixToHoursString(data.moonset);
        this.windSpeed = (data.windSpeed / 10).toLocaleString() + " km/h";
        this.windGust = (data.windGust / 10).toLocaleString() + " km/h";
        this.windDirection = "from-" + data.windDirection / 10 + "-deg";
        this.moonPhase = moonPhases[data.moonPhase];
    }

    /**
     * resets arrays for forecast and warnings
     */
    resetData() {
        this.times.length = 0;
        this.icons.length = 0;
        this.temperatures.length = 0;
        this.precipitations.length = 0;
        this.surfacePressures.length = 0;
        this.humidities.length = 0;
        this.dewPoints2m.length = 0;
        this.warnings.length = 0;
    }

    /**
     * adds a data point for each data array of this day
     * @param {Date} time - the time the data is for
     * @param {number} icon - the icon number specified in api docs
     * @param {number} temperature - unit: `0.1 °C`
     * @param {number} precipitation - unit: `0.1 mm`
     * @param {number} surfacePressure - unit: `0.1 hPa`
     * @param {number} humidity - unit: `0.1 %`
     * @param {number} dewPoint2m - unit: `0.1 °C`
     */
    pushData(time, icon, temperature, precipitation, surfacePressure, humidity, dewPoint2m) {
        this.times.push(time.getHours() + " Uhr");
        if (this.sunriseTime != null && (this.sunriseTime > time || this.sunsetTime < time)) {
            this.icons.push(icons_night[icon]);
        } else {
            this.icons.push(icons_day[icon]);
        }
        this.temperatures.push((temperature / 10).toLocaleString() + " °C");
        this.precipitations.push((precipitation / 10).toLocaleString() + " mm");
        this.surfacePressures.push((surfacePressure / 10).toLocaleString() + " hPa");
        this.humidities.push((humidity / 10).toLocaleString() + " %");
        this.dewPoints2m.push((dewPoint2m / 10).toLocaleString() + " °C");
    }

    /**
     * adds warning object to warnings array of this day
     * @param {Warning} warning
     */
    pushWarning(warning) {
        this.warnings.push(warning);
    }
}