/**
 * Returns whether both dates are for the same day
 *
 * @param {Date} date
 * @param {Date} otherDate
 * @returns {boolean}
 */
export function isSameDay (date, otherDate)
{
    if (!(date instanceof Date))
    {
        return false;
    }

    if (!(otherDate instanceof Date))
    {
        return false;
    }

    return 0 === compareDate(date, otherDate);
}


/**
 * Returns whether both dates are for the same day and the same hour
 *
 * @param {Date} date
 * @param {Date} otherDate
 * @returns {boolean}
 */
export function isSameTimestamp (date, otherDate)
{
    return 0 === compareTimestamp(date, otherDate);
}


/**
 * Checks whether the `date` is before the `otherDate`
 *
 * @param {Date} date
 * @param {Date} otherDate
 * @returns {boolean}
 */
export function isBeforeDate (date, otherDate)
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
 *
 * @param {Date} date
 * @param {Date} otherDate
 * @return {number}
 */
export function compareDate (date, otherDate)
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
 *
 * @param {Date} date
 * @param {Date} otherDate
 * @return {number}
 */
export function compareTimestamp (date, otherDate)
{
    const compareDate = compareDate(date, otherDate);

    if (0 !== compareDate)
    {
        return compareDate;
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
 * Compares two numbers
 *
 * @param {number} value
 * @param {number} otherValue
 * @return {number}
 */
function compare (value, otherValue)
{
    if (value === otherValue)
    {
        return 0;
    }

    return (value < otherValue) ? -1 : 1;
}
