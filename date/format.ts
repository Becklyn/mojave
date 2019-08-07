const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const YEAR = 365 * DAY;
const MONTH = YEAR / 12;

const TIME_SECTION_LABELS_DE = [
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

type DateFormatter = (index : number, delta : number) => string;

const germanRelativeDateLabelFormatter : DateFormatter = (index : number, delta : number) : string =>
{
    let text = TIME_SECTION_LABELS_DE[index];

    // if the date is in the future
    if (delta < 0)
    {
        // replace by descending length
        text = text
            .replace("vorgestern", "übermorgen")
            .replace("gestern", "morgen")
            .replace("vor", "in");
    }

    return text;
};

const TIME_SECTIONS = [
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
    [Infinity, YEAR],
];


/**
 * Formats the date relative to now / the fromDate
 *
 * The format label function formats the label.
 * It receives
 *      * `index` {number} (of the translation labels, see the default german ones for which one is which)
 *      * `delta` {number} the difference between the two dates in seconds. If the delta is negative, the given date is in the future (in relation to the reference date)
 */
export function formatRelative (date : Date, referenceDate : null|Date = null, formatLabel : null|DateFormatter = null) : string
{
    if (null === formatLabel)
    {
        formatLabel = germanRelativeDateLabelFormatter;
    }

    if (null === referenceDate)
    {
        referenceDate = new Date();
    }

    const delta = (referenceDate.getTime() - date.getTime()) / 1000;
    const absDelta = Math.abs(delta);

    for (let i = 0; i < TIME_SECTIONS.length; i++)
    {
        const entry = TIME_SECTIONS[i];

        if (absDelta < entry[0])
        {
            const text = formatLabel(i, delta);

            return entry[1] !== undefined
                ? text.replace("#", Math.round(absDelta / entry[1]) + "")
                : text;
        }
    }

    return "";
}


/**
 * Formats the date in the little endian format (DD.MM.YYYY)
 */
export function formatDate (date : Date) : string
{
    return `${zeroFill(date.getDate())}.${zeroFill(date.getMonth() + 1)}.${date.getFullYear()}`;
}

/**
 * Formats a date time
 */
export function formatDateTime (date: Date, withSeconds: boolean = true) : string
{
    return `${formatDate(date)} ${formatTime(date, withSeconds)}`;
}


/**
 * Formats the date in the little endian format (DD.MM.) without the year
 */
export function formatDateShort (date : Date) : string
{
    return `${zeroFill(date.getDate())}.${zeroFill(date.getMonth() + 1)}.`;
}

/**
 * Formats a time
 */
export function formatTime (date: Date, withSeconds: boolean = true) : string
{
    let time = `${zeroFill(date.getHours())}:${zeroFill(date.getMinutes())}`;

    if (withSeconds)
    {
        time += `:${zeroFill(date.getSeconds())}`;
    }

    return time;
}


/**
 * Prefixes a single digit number with a zero
 */
function zeroFill (value : number) : string
{
    return value < 10 ? `0${value}` : value + "";
}
