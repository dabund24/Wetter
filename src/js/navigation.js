const root = document.querySelector(':root');
let currentTab = 0;
const tabPercentages = ["17%", "50%", "83%"]

function switchTab(newTab) {
    if (newTab === currentTab) {
        return;
    }

    const tabLine = document.getElementById("tab-indicator");
    
    // set variables for start and end
    tabLine.style.setProperty("--animation--tab-indicator__start", tabPercentages[currentTab]);
    tabLine.style.setProperty("--animation--tab-indicator__end", tabPercentages[newTab]);
    
    tabLine.classList.remove("tab-indicator__animation-to-right");
    tabLine.classList.remove("tab-indicator__animation-to-left");
    tabLine.offsetWidth;
    if (newTab > currentTab) {
        tabLine.classList.add("tab-indicator__animation-to-right");
    } else {
        tabLine.classList.add("tab-indicator__animation-to-left");
    }
    currentTab = newTab;
}

function switchTheme() {
    if (document.documentElement.getAttribute("data-theme") === "light") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }
}