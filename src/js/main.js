fetch("https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/forecast_mosmix_10863.json")
.then((response) => response.json()).then((data) => console.log(data));