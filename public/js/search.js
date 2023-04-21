export async    function collectAllStations() {
    const stationsString = await fetch("/stations")
        .then(response => response.text());
    const cells = stationsString.split("\n").map(el => {
        const array = el.split(/\s+/);
        const start = array.slice(0, 2);
        const name = array.slice(2, array.length - 3).map(string => {
            string = string.toLowerCase().replace(/(([-(/.])\w.?)+/, word => word[0] + word[1].toUpperCase() + word.slice(2));
            return string[0].toUpperCase() + string.slice(1);
            /*string = string.toLowerCase();
            const strings = string.split(/(?=(-.))/);
            return strings.map(substring => substring.charAt(0).toUpperCase() + substring.slice(1)).join();*/
        }).join(" ");
        const end = array.slice(array.length - 3);
        return start.concat(name).concat(end);
    });
    const headings = cells.shift();
    cells.shift();
    console.log(cells);
    const allStations = cells.map(el => {
        let obj = {};
        for (let i = 0, l = el.length; i < l; i++) {
            obj[headings[i]] = isNaN(Number(el[i])) ? el[i] : +el[i];
        }
        return obj;
    });
    console.log(allStations);
}