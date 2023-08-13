function collectAllStations(stationsString) {
    const cells = stationsString.split("\n").map(el => {
        const array = el.split(/\s+/);
        const start = array.slice(0, 2);
        let name = array.slice(2, array.length - 3).map(string => {
            string =
                string.toLowerCase().replace(/([-(/.]\w)+/, word => word[0] + word[1].toUpperCase()
                + word.slice(2));
            return string[0].toUpperCase() + string.slice(1);
        }).join(" ");
        if (start[1] !== "----" && start[1] !== "ICAO") { // Airports
            name += " &#x2708;"
        }
        const end = array.slice(array.length - 3);
        return start.concat(name).concat(end);
    });
    const headings = cells.shift();
    cells.shift();
    return cells.map(el => {
        let obj = {};
        for (let i = 0, l = el.length; i < l; i++) {
            if (i < 3) {
                obj[headings[i]] = el[i];
            } else {
                obj[headings[i]] = +el[i];
            }
        }
        return obj;
    });
}

module.exports = {collectAllStations};