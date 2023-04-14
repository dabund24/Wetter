import {icons_day, unixToHoursString} from "./util.js";

export default class Station {

    /**
     * initialises new station with id, name, url and lastRefresh
     * @param {string} id - the id of the station based on https://www.dwd.de/DE/leistungen/met_verfahren_mosmix/mosmix_stationskatalog.cfg?view=nasPublication&nn=16102
     * @param {string} name - the name of the station
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.overviewURL = "";
        this.lastRefresh = Date.now();
        const proxyURL = "https://api.allorigins.win/raw?url=";
        this.overviewBaseURL = "https://dwd.api.proxy.bund.dev/v30/stationOverviewExtended?stationIds=" + id;
        // this.overviewBaseURL = "https://app-prod-ws.warnwetter.de/v30/stationOverviewExtended?stationIds=" + id;
        this.nowcastBaseURL = "https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/current_measurement_" + id + ".json"
        const addProxy = true;
        if (addProxy) {
            this.overviewBaseURL = proxyURL + this.overviewBaseURL;
        }
        this.overviewURL = this.overviewBaseURL;
        this.nowcastURL = this.nowcastBaseURL;
    }

    /**
     * adds attribute consisting of timestamp to url of station to disallow caching of data,
     * sets lastRefresh attribute of station
     */
    resetURL() {
        this.lastRefresh = Date.now();
        this.overviewURL = this.overviewBaseURL + "&t=" + this.lastRefresh;
    }

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