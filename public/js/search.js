import {refreshAutocomplete, switchStation} from "./main.js";
import {setHTMLOfChildOfParent} from "./util.js";

let selectedStation = 0;
const suggestionsContainer = document.getElementById("search__suggestions");

export function setupSearch() {
    const searchInput = document.getElementById("search__input");

    searchInput.addEventListener("focusin", function (event) {
        refreshAutocomplete(this.value);
    })

    searchInput.addEventListener("keyup", function (event) {
        if (event.key !== "Enter" && event.key !== "ArrowDown" && event.key !== "ArrowUp") {
            refreshAutocomplete(this.value);
        }
    });

    searchInput.addEventListener("keydown", function(event){
        if (event.key === "Enter") {
            if (suggestionsContainer.children.length === 1) {
                return;
            }
            clickSuggestion(suggestionsContainer.children[selectedStation]);
            searchInput.blur();
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            changeSuggestionFocus(suggestionsContainer.children, selectedStation + 1);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            changeSuggestionFocus(suggestionsContainer.children, selectedStation - 1);
        }
    });

    const stationHeader = document.getElementById("station");
    const observer = new IntersectionObserver(
        ([e]) => e.target.classList.toggle('sticks', e.intersectionRatio < 1),
        {threshold: [1]}
    );
    observer.observe(stationHeader);
}

function changeSuggestionFocus(suggestions, toBeFocused) {
    if (toBeFocused < 0) {
        toBeFocused = suggestions.length - 2;
    } else if (toBeFocused >= suggestions.length - 1) {
        toBeFocused = 0;
    }
    if (toBeFocused < 0) {
        return;
    }
    if (selectedStation < suggestions.length - 1 && selectedStation >= 0) {
        suggestions[selectedStation].classList.remove("suggestion--focus");
    }
    selectedStation = toBeFocused;
    suggestions[selectedStation].classList.add("suggestion--focus");
}

/**
 *
 * @param {string} text
 * @returns {Promise<*[]>}
 */
export async function getSearchSuggestions(text) {
    text = text.replaceAll(/ä/gi, "ae");
    text = text.replaceAll(/ö/gi, "oe");
    text = text.replaceAll(/ü/gi, "ue");
    text = text.replaceAll(/ß/gi, "ss");

    let suggestions = [];
    await fetch("/suggest?name=" + text)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length && i < 10; i++) {
                suggestions.push(data[i]);
            }
        })
    if (suggestions.length === 10) {
        return suggestions
    }
    await fetch("/suggest?name=" + text + "&sndRun=true")
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length && suggestions.length < 10; i++) {
                suggestions.push(data[i]);
            }
        })
    return suggestions
}

export function displaySearchSuggestions(suggestions) {
    const searchDisplay = document.getElementById("search");
    document.getElementById("search__suggestions").replaceChildren();
    const template = searchDisplay.querySelector("template").content;
    let toBeAdded;
    for (let suggestion of suggestions) {
        toBeAdded = document.importNode(template, true);
        setHTMLOfChildOfParent(toBeAdded, ".option__text", suggestion.Name);
        toBeAdded.querySelector(".search__suggestion__click").setAttribute("value", suggestion.Name);
        toBeAdded.querySelector(".search__suggestion__click").setAttribute("data-id", suggestion.ID);
        toBeAdded.querySelector(".option").addEventListener("click", function () {
            clickSuggestion(this);
        });
        suggestionsContainer.appendChild(toBeAdded);
        document.querySelector(".option").focus();
    }
    if (selectedStation >= suggestionsContainer.children.length) {
        changeSuggestionFocus(suggestionsContainer.children, suggestionsContainer.childElementCount - 1);
    }
    if (selectedStation >= 0 && selectedStation < suggestions.length) {
        suggestionsContainer.children[selectedStation].classList.add("suggestion--focus");
    }

    // add no suggestions
    const noSuggestions = document.importNode(template, true);
    setHTMLOfChildOfParent(noSuggestions, ".option__text", "Keine Vorschläge");
    suggestionsContainer.appendChild(noSuggestions)
}

function clickSuggestion(suggestion) {
    switchStation(suggestion.getElementsByTagName("input")[0].getAttribute("data-id"), -1);
    let suggestionString = suggestion.getElementsByTagName("input")[0].value
    if (suggestionString.endsWith("&#x2708;")) {
        suggestionString = suggestionString.slice(0, suggestionString.length - 9)
    }
    refreshAutocomplete(suggestionString);
    document.querySelector("#search__input").value = suggestionString;
}