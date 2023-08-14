const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const cookieParser = require("cookie-parser")
const suggestions = require("./backend/suggestions.js")

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(cors());
app.use(cookieParser())

const allStations = fetch("https://www.dwd.de/DE/leistungen/met_verfahren_mosmix/mosmix_stationskatalog.cfg?view=nasPublication&nn=16102")
    .then(response => response.text())
    .then(text => suggestions.collectAllStations(text));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/icons', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/html/icons.html'));
});

app.get("/data", (req, res) => {
    const backendUrl = "https://app-prod-ws.warnwetter.de/v30/stationOverviewExtended?stationIds=" + req.query.stationIDs;
    axios.get(backendUrl).then(response => res.send(response.data)).catch(e => console.log(e));
});

app.get("/stations", (req, res) => {
    const backendUrl = "https://www.dwd.de/DE/leistungen/met_verfahren_mosmix/mosmix_stationskatalog.cfg?view=nasPublication&nn=16102";
    axios.get(backendUrl).then(response => res.send(response.data)).catch(e => console.log(e));
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

app.get("/setcookie", (req, res) => {
    if (req.query.key !== "theme" && req.query.key !== "color" && req.query.key !== "stations" && req.query.key !== "station") {
        console.log("incorrect cookie key " + req.query.key)
        return
    }
    res.cookie(req.query.key, req.query.value, {
        maxAge: 31536000000,
        secure: true,
        sameSite: "strict"
    })
    res.send("cookie saved successfully")
})

app.get("/getcookies", (req, res) => {
    res.send(req.cookies)
})

app.listen(port);
console.log(" 🌔⛅🌓☃️🌠🌫️🌕🌦️☄️❄️🔥🌗💧⛱️🌪️🌤️🌈\n🌜🌂🌡️ http://localhost:" + port + "  🌧️🌚🌖\n ☂️🌘☔🌬️☀️⭐🌙☁️🌑🌝🌒🌞🌛⛄🌟🌊🌨️");

