export default class Station {

    /**
     * initialises new station with id, name, url and lastRefresh
     * @param {string} id - the id of the station based on https://www.dwd.de/DE/leistungen/met_verfahren_mosmix/mosmix_stationskatalog.cfg?view=nasPublication&nn=16102
     * @param {string} name - the name of the station
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.url = "";
        this.lastRefresh = Date.now();
        const proxyURL = "https://api.allorigins.win/raw?url=";
        this.baseURL = "https://dwd.api.proxy.bund.dev/v30/stationOverviewExtended?stationIds=" + id;
        const addProxy = true;
        if (addProxy) {
            this.baseURL = proxyURL + this.baseURL;
        }
        this.url = this.baseURL;
    }

    /**
     * adds attribute consisting of timestamp to url of station to disallow caching of data,
     * sets lastRefresh attribute of station
     */
    resetURL() {
        this.lastRefresh = Date.now();
        this.url = this.baseURL + "&t=" + this.lastRefresh;
    }
}