export function slideIndicator(indicatorID, selectableCount, start, end) {
    const indicator = document.getElementById(indicatorID)

    indicator.classList.remove("indicator__animation-to-right")
    indicator.classList.remove("indicator__animation-to-left")
    indicator.offsetWidth

    if (start < end) {
        indicator.classList.add("indicator__animation-to-right");
    } else {
        indicator.classList.add("indicator__animation-to-left")
    }

    indicator.style.setProperty("--animation--tab-indicator__start", (100 * start + 50) / selectableCount + "%")
    indicator.style.setProperty("--animation--tab-indicator__end", (100 * end + 50) / selectableCount + "%")
}

export function showLoadSlider() {
    document.querySelector(":root").classList.add("loading")
}

export function hideLoadSlider() {
    document.querySelector(":root").classList.remove("loading")
}
