const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const suggestions = require("./backend/suggestions.js")

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(cors());

//const allStations = await axios.get("https://www.dwd.de/DE/leistungen/met_verfahren_mosmix/mosmix_stationskatalog.cfg?view=nasPublication&nn=16102")
//.then(response => suggestions.collectAllStations(response.data));

const allStations = fetch("https://www.dwd.de/DE/leistungen/met_verfahren_mosmix/mosmix_stationskatalog.cfg?view=nasPublication&nn=16102")
    .then(response => response.text())
    .then(text => suggestions.collectAllStations(text));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get("/data", (req, res) => {
    const backendUrl = "https://app-prod-ws.warnwetter.de/v30/stationOverviewExtended?stationIds=" + req.query.stationIDs;
    axios.get(backendUrl).then(response => res.send(response.data));
});

app.get("/stations", (req, res) => {
    const backendUrl = "https://www.dwd.de/DE/leistungen/met_verfahren_mosmix/mosmix_stationskatalog.cfg?view=nasPublication&nn=16102";
    axios.get(backendUrl).then(response => res.send(response.data));
    res.contentType("text/plain");
});

app.get("/suggest", (req, res) => {

    if (req.query.name !== undefined) {
        const query = req.query.name.toLowerCase();
        allStations.then(stations => stations.filter(station => station["Name"].toLowerCase().startsWith(query))).then(res.send.bind(res));
    } else {
        allStations.then(stations => stations.find(station => station["ID"].includes(req.query.id))).then(res.send.bind(res));
    }
});

app.listen(port);
console.log(" 🌔⛅🌓☃️🌠🌫️🌕🌦️☄️❄️🔥🌗💧⛱️🌪️🌤️🌈\n🌜🌂🌡️ http://localhost:" + port + "  🌧️🌚🌖\n ☂️🌘☔🌬️☀️⭐🌙☁️🌑🌝🌒🌞🌛⛄🌟🌊🌨️");

