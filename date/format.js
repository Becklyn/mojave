var MINUTE = 60;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var WEEK = 7 * DAY;
var YEAR = 365 * DAY;
var MONTH = YEAR / 12;
var TIME_SECTION_LABELS_DE = [
    'gerade eben',
    'vor einer Minute',
    'vor # Minuten',
    'vor einer Stunde',
    'vor # Stunden',
    'gestern',
    'vorgestern',
    'vor # Tagen',
    'vor einer Woche',
    'vor # Wochen',
    'vor einem Monat',
    'vor # Monaten',
    'vor einem Jahr',
    'vor # Jahren',
];
var germanRelativeDateLabelFormatter = function (index, delta) {
    var text = TIME_SECTION_LABELS_DE[index];
    if (delta < 0) {
        text = text
            .replace("vorgestern", "übermorgen")
            .replace("gestern", "morgen")
            .replace("vor", "in");
    }
    return text;
};
var TIME_SECTIONS = [
    [0.8 * MINUTE],
    [1.5 * MINUTE],
    [60 * MINUTE, MINUTE],
    [1.5 * HOUR],
    [DAY, HOUR],
    [2 * DAY],
    [3 * DAY],
    [7 * DAY, DAY],
    [1.5 * WEEK],
    [MONTH, WEEK],
    [1.5 * MONTH],
    [YEAR, MONTH],
    [1.5 * YEAR],
    [null, YEAR],
];
export function formatRelative(date, referenceDate, formatLabel) {
    if (referenceDate === void 0) { referenceDate = null; }
    if (formatLabel === void 0) { formatLabel = null; }
    if (null === formatLabel) {
        formatLabel = germanRelativeDateLabelFormatter;
    }
    if (null === referenceDate) {
        referenceDate = new Date();
    }
    if (!(date instanceof Date)) {
        return "";
    }
    var delta = (referenceDate.getTime() - date.getTime()) / 1000;
    var absDelta = Math.abs(delta);
    for (var i = 0; i < TIME_SECTIONS.length; i++) {
        var entry = TIME_SECTIONS[i];
        var firstEntry = entry[0];
        if (firstEntry === null || absDelta < firstEntry) {
            var text = formatLabel(i, delta);
            var secondEntry = entry[1];
            return secondEntry !== undefined && secondEntry !== null
                ? text.replace("#", Math.round(absDelta / secondEntry) + "")
                : text;
        }
    }
    return "";
}
export function formatDate(date) {
    return zeroFill(date.getDate()) + "." + zeroFill(date.getMonth() + 1) + "." + date.getFullYear();
}
export function formatDateShort(date) {
    return zeroFill(date.getDate()) + "." + zeroFill(date.getMonth() + 1) + ".";
}
function zeroFill(value) {
    return value < 10 ? "0" + value : value + "";
}
