let stationID = 10863;
let fm_data;

function fetchData(stationIDlol) {
    const spinner = document.getElementById("load-indicator");
    spinner.style.setProperty("display", "block");
    fetch("https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/forecast_mosmix_" + stationID + ".json")
        .then((response) => response.json()).then((data) => {
        fm_data = data;
        logData(data);
        
    });
    setTimeout(function(){
        console.log('after');
        spinner.style.setProperty("display", "none");
    },5000);
}

function logData(data) {
    console.log(data);
}


console.log(fm_data);