import {checkUndefined, icons_day, unixToHoursString} from "./util.js";

export default class Station {

    /**
     * initialises new station with id, name, url and lastRefresh
     * @param {Object} stationObj - the id of the station based on https://www.dwd.de/DE/leistungen/met_verfahren_mosmix/mosmix_stationskatalog.cfg?view=nasPublication&nn=16102
     */
    constructor(stationObj) {
        this.id = stationObj.ID
        this.name = stationObj.Name;
        this.latitude = stationObj.LAT;
        const latMins = ~~((this.latitude * 100) % 100);
        this.longitude = stationObj.LON
        const lonMins = ~~((this.longitude) * 100  % 100);
        this.latitudeStr = ~~this.latitude + "°" + latMins + "\' " + (this.latitude > 0 ? "N" : "S");
        this.longitudeStr = ~~this.longitude + "°" + lonMins + "\' " + (this.longitude > 0 ? "W" : "O");
        this.mapURL = "https://www.openstreetmap.org/?mlat=" + (~~this.latitude + latMins / 60) + "&mlon=" + (~~this.longitude + lonMins / 60) + "&zoom=12";
        this.elevation = stationObj.ELEV + " m";
        this.icao = stationObj.ICAO;
        this.overviewURL = "/data?stationIDs=" + this.id;
        this.nowcastURL = "https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/current_measurement_" + this.id + ".json"
    }

    /**
     * sets nowcast data of station
     * @param {Object} data - nowcast data of station
     */
    setNowcast(data) {
        this.time = unixToHoursString(data.time);
        if (data.icon !== undefined && data.icon !== 32767) {
            console.log(data.icon);
            this.icon = icons_day[data.icon];
        }
        this.temperature = checkUndefined((data.temperature / 10).toLocaleString(), " °C");
        this.precipitation = checkUndefined((data.precipitation / 10).toLocaleString(), " mm");
        this.totalSnow = checkUndefined((data.totalsnow / 10).toLocaleString(), " cm");
        this.sunshine = checkUndefined((data.sunshine / 10).toLocaleString(), " Minuten");
        this.meanWind = checkUndefined((data.meanwind / 10).toLocaleString(), " km/h");
        this.maxWind = checkUndefined((data.maxwind / 10).toLocaleString(), " km/h");
        this.windDirection = "from-" + (data.winddirection / 10) + "-deg";
        this.pressure = checkUndefined((data.pressure / 10).toLocaleString(), " hPa");
        this.humidity = checkUndefined((data.humidity / 10).toLocaleString(), " %");
        this.dewPoint = checkUndefined((data.dewpoint / 10).toLocaleString(), " °C");
    }
}