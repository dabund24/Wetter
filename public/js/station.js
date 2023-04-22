import {icons_day, unixToHoursString} from "./util.js";

export default class Station {

    /**
     * initialises new station with id, name, url and lastRefresh
     * @param {Object} stationObj - the id of the station based on https://www.dwd.de/DE/leistungen/met_verfahren_mosmix/mosmix_stationskatalog.cfg?view=nasPublication&nn=16102
     */
    constructor(stationObj) {
        //this.stationObj = allStations.find(station => station.ID === id);
        this.stationObj = stationObj;
        this.id = stationObj.ID
        this.name = this.stationObj.Name;
        this.overviewURL = "";
        this.overviewBaseURL = "/data?stationIDs=" + this.id;
        this.nowcastBaseURL = "https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/current_measurement_" + this.id + ".json"
        this.overviewURL = this.overviewBaseURL;
        this.nowcastURL = this.nowcastBaseURL;
    }

    /**
     * sets nowcast data of station
     * @param {Object} data - nowcast data of station
     */
    setNowcast(data) {
        this.time = unixToHoursString(data.time);
        this.icon = icons_day[data.icon];
        this.temperature = (data.temperature / 10).toLocaleString() + " °C";
        this.precipitation = (data.precipitation / 10).toLocaleString() + " mm";
        this.totalSnow = (data.totalsnow / 10).toLocaleString() + " cm";
        this.sunshine = (data.sunshine / 10).toLocaleString() + " Minuten";
        this.meanWind = (data.meanwind / 10).toLocaleString() + " km/h";
        this.maxWind = (data.maxwind / 10).toLocaleString() + " km/h";
        this.windDirection = "from-" + (data.winddirection / 10) + "-deg";
        this.pressure = (data.pressure / 10).toLocaleString() + " hPa";
        this.humidity = (data.humidity / 10).toLocaleString() + " %";
        this.dewPoint = (data.dewpoint / 10).toLocaleString() + " °C";
    }
}