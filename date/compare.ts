/**
 * Returns whether both dates are for the same day
 */
export function isSameDay (date : Date, otherDate : Date) : boolean
{
    return 0 === compareDate(date, otherDate);
}


/**
 * Returns whether both dates are for the same day and the same hour
 */
export function isSameTimestamp (date : Date, otherDate : Date) : boolean
{
    return 0 === compareTimestamp(date, otherDate);
}


/**
 * Checks whether the `date` is before the `otherDate`
 */
export function isBeforeDate (date : Date, otherDate : Date) : boolean
{
    return -1 === compareDate(date, otherDate);
}


/**
 * Returns
 *      -1 if the `date` is before the `other date`,
 *       0 if the dates are equal and
 *      +1 if the `date` is after the `other date`.
 *
 * Only checks the date and ignores the time
 */
export function compareDate (date : Date, otherDate : Date) : number
{
    const compareYear = compare(date.getFullYear(), otherDate.getFullYear());

    if (0 !== compareYear)
    {
        return compareYear;
    }

    const compareMonth = compare(date.getMonth(), otherDate.getMonth());

    if (0 !== compareMonth)
    {
        return compareMonth;
    }

    return compare(date.getDate(), otherDate.getDate());
}


/**
 * Returns
 *      -1 if the `date` is before the `other date`,
 *       0 if the dates are equal and
 *      +1 if the `date` is after the `other date`.
 *
 * Includes time checks.
 */
export function compareTimestamp (date : Date, otherDate : Date) : number
{
    const compareDateResult = compareDate(date, otherDate);

    if (0 !== compareDateResult)
    {
        return compareDateResult;
    }

    const compareHour = compare(date.getHours(), otherDate.getHours());

    if (0 !== compareHour)
    {
        return compareHour;
    }

    const compareMinute = compare(date.getMinutes(), otherDate.getMinutes());

    if (0 !== compareMinute)
    {
        return compareMinute;
    }

    return compare(date.getSeconds(), otherDate.getSeconds());
}


/**
 */
function compare (value : number, otherValue : number) : number
{
    if (value === otherValue)
    {
        return 0;
    }

    return (value < otherValue) ? -1 : 1;
}
