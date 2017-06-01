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

    return (date.getFullYear() === otherDate.getFullYear())
        && (date.getMonth() === otherDate.getMonth())
        && (date.getDate() === otherDate.getDate());
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
    if (!isSameDay(date, otherDate))
    {
        return false;
    }

    return (date.getHours() === otherDate.getHours())
        && (date.getMinutes() === otherDate.getMinutes())
        && (date.getSeconds() === otherDate.getSeconds());
}
