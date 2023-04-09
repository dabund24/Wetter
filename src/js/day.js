import {unixToHoursString, daysOfWeek, leadingZeros, moonPhases, icons_day, icons_night} from "./util.js";

export default class Day {
    

    constructor() {
        this.date = new Date(0);
        this.icon = icons_day[0];
        this.moonPhase = icons_day[0];
        this.times = [];
        this.icons = [];
        this.temperatures = [];
        this.precipitations = [];
        this.windSpeeds = [];
        this.windGusts = [];
        this.windDirections = [];
    }
    
    setOverviewData(data) {
        this.date = new Date(data.dayDate);
        this.dayOfWeek = daysOfWeek[this.date.getDay()]
        this.stringDate = leadingZeros(this.date.getDate(), 2) + "."
            + leadingZeros(this.date.getMonth() + 1, 2) + "."
            + leadingZeros(this.date.getFullYear(), 4);
        
        this.icon = icons_day[data.icon];
        this.temperatureMin = data.temperatureMin / 10 + " °C";
        this.temperatureMax = data.temperatureMax / 10 + " °C";
        this.precipitation = data.precipitation / 10 + " mm";
        this.sunshine = (data.sunshine / 500).toFixed(1) + " Stunden"; /* TODO check if correct*/
        this.sunrise = unixToHoursString(data.sunrise);
        this.sunriseTime = data.sunrise;
        this.sunset = unixToHoursString(data.sunset);
        this.sunsetTime = data.sunset;
        this.moonrise = unixToHoursString(data.moonrise);
        this.moonset = unixToHoursString(data.moonset);
        this.windSpeed = data.windSpeed / 10 + " km/h";
        this.windGust = data.windGust / 10 + " km/h";
        this.windDirection = "from-" + data.windDirection / 10 + "-deg";
        this.moonPhase = moonPhases[data.moonPhase]; /* TODO figure out how this works */
    }
    
    resetData() {
        this.times.length = 0;
        this.icons.length = 0;
        this.temperatures.length = 0;
        this.precipitations.length = 0;
        this.windSpeeds.length = 0;
        this.windGusts.length = 0;
        this.windDirections.length = 0;
    }
    
    pushData(time, icon, temperature, precipitation, windSpeed, windGust, windDirection) {
        this.times.push(time.getHours() + " Uhr");
        if (this.sunriseTime != null && (this.sunriseTime > time || this.sunsetTime < time)) {
            this.icons.push(icons_night[icon]);
        } else {
            this.icons.push(icons_day[icon]);
        }
        this.temperatures.push(temperature / 10 + " °C");
        this.precipitations.push(precipitation / 10 + " mm");
        this.windSpeeds.push(windSpeed / 10 + " km/h");
        this.windGusts.push(windGust / 10 + " km/h");
        this.windDirections.push("from-" + windDirection / 10 + "-deg");
    }
}