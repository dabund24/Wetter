import {daysOfWeekShort, leadingZeros, unixToHoursString, warningIcons} from "./util.js";

export default class Warning {

    /**
     * initialises warning with correct string representation
     * @param {string} event - type of warning
     * @param {Date} start - start of warning
     * @param {Date} end - end of warning
     * @param {number} level - level of warning on scale from 1 to 4
     * @param {number} type - type of warning to select correct icon from `warningIcons`
     * @param {string} description - text description of warning
     * @param {string} instruction - instructions
     */
    constructor(event, start, end, level, type, description, instruction) {
        this.event = event;
        this.start = new Date(start);
        /**
         * string representation of start of warning following this scheme:
         * `<dayOfWeekShort>, DD.MM.YYYY, hh.mm Uhr`
         * @type {string}
         */
        this.stringStart = daysOfWeekShort[this.start.getDay()] + ", "
            + leadingZeros(this.start.getDate(), 2) + "."
            + leadingZeros(this.start.getMonth() + 1, 2) + "."
            + leadingZeros(this.start.getFullYear(), 4) + ", "
            + unixToHoursString(start);
        this.end = new Date(end);

        if (this.start.getDate() === this.end.getDate()) {
            this.stringEnd = unixToHoursString(end);
        } else {
            /**
             * string representation of end of warning following this scheme:
             * `<dayOfWeekShort>, DD.MM.YYYY, hh.mm Uhr`
             * @type {string}
             */
            this.stringEnd = daysOfWeekShort[this.end.getDay()] + ", "
                + leadingZeros(this.end.getDate(), 2) + "."
                + leadingZeros(this.end.getMonth() + 1, 2) + "."
                + leadingZeros(this.end.getFullYear(), 4) + ", "
                + unixToHoursString(end);
        }
        /**
         * string representation of html of warning title
         * @type {string}
         */
        this.title = "<strong>" + event + "</strong><br/><i>" + this.stringStart + " – " + this.stringEnd + "</i>"
        this.level = level;
        this.type = type;
        this.typeIcon = warningIcons[type];
        this.description = description;
        this.instruction = instruction;
    }
}