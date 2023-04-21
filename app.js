const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(cors());

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
})

app.listen(port);
console.log(" 🌔⛅🌓☃️🌠🌫️🌕🌦️☄️❄️🔥🌗💧⛱️🌪️🌤️🌈\n🌜🌂🌡️ http://localhost:" + port + "  🌧️🌚🌖\n ☂️🌘☔🌬️☀️⭐🌙☁️🌑🌝🌒🌞🌛⛄🌟🌊🌨️");