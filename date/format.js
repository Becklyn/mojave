const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const YEAR = 365 * DAY;
const MONTH = YEAR / 12;

const TIME_SECTIONS = [
    [0.8 * MINUTE, 'in diesem Moment'],
    [1.5 * MINUTE, 'vor einer Minute'],
    [60 * MINUTE, 'vor # Minuten', MINUTE],
    [1.5 * HOUR, 'vor einer Stunde'],
    [DAY, 'vor # Stunden', HOUR],
    [2 * DAY, 'gestern'],
    [3 * DAY, 'vorgestern'],
    [7 * DAY, 'vor # Tagen', DAY],
    [1.5 * WEEK, 'vor einer Woche'],
    [MONTH, 'vor # Wochen', WEEK],
    [1.5 * MONTH, 'vor einem Monat'],
    [YEAR, 'vor # Monaten', MONTH],
    [1.5 * YEAR, 'vor einem Jahr'],
    [null, 'vor # Jahren', YEAR],
];


/**
 * Formats the date relative to now / the fromDate
 *
 * @param {Date} date
 * @param {?Date} referenceDate
 *
 * @returns {string}
 */
export function formatRelative (date, referenceDate = null)
{
    if (null === referenceDate)
    {
        referenceDate = new Date();
    }

    if (!(date instanceof Date) || !(referenceDate instanceof Date))
    {
        return "";
    }

    const delta = (referenceDate.getTime() - date.getTime()) / 1000;
    const absDelta = Math.abs(delta);

    for (let i = 0; i < TIME_SECTIONS.length; i++)
    {
        const entry = TIME_SECTIONS[i];

        if (entry[0] === null || absDelta < entry[0])
        {
            let text = entry[1];

            // if the date is in the future
            if (delta < 0)
            {
                // replace by descending length
                text = text
                    .replace("vorgestern", "übermorgen")
                    .replace("gestern", "morgen")
                    .replace("vor", "in");
            }

            return typeof entry[2] !== "undefined"
                ? text.replace("#", Math.round(absDelta / entry[2]))
                : text;
        }
    }

    return "";
}
