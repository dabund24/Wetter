import {unixToHoursString, daysOfWeek, leadingZeros, icons_day, icons_night} from "./util.js";




export default class Day {
    
    constructor() {
        this.icon1 = icons_day[0];
    }
    
    setOverviewData(data) {
        this.icon1 = icons_day[data.icon1];
        this.icon2 = icons_day[data.icon2];
        this.temperatureMin = data.temperatureMin / 10 + " °C";
        this.temperatureMax = data.temperatureMax / 10 + " °C";
        this.precipitation = data.precipitation / 10 + " mm";
        this.sunshine = data.sunshine / 650 + " Stunden"; /* TODO check if correct*/
        this.sunrise = unixToHoursString(data.sunrise);
        this.sunset = unixToHoursString(data.sunset);
        this.moonrise = unixToHoursString(data.moonrise);
        this.moonset = unixToHoursString(data.moonset);
        this.windSpeed = data.windSpeed / 10 + " km/h";
        this.windGust = data.windGust / 10 + " km/h";
        this.windDirection = "from-" + data.windDirection / 10 + "-deg";
        this.moonphase = data.moonphase; /* TODO figure out how this works */
    }

    setDate(determined) {
        let determinedDate = new Date(determined);
        this.dayOfWeek = daysOfWeek[determinedDate.getDay()];
        this.stringDate = leadingZeros(determinedDate.getDate(), 2) + "."
            + leadingZeros(determinedDate.getMonth(), 2) + "."
            + leadingZeros(determinedDate.getFullYear(), 4);
    }
}