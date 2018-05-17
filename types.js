/**
 * Returns the type of the value
 *
 * @param {*} value
 * @returns {string}
 */
export function typeOf (value)
{
    return /^\[object (.*?)\]$/.exec(
        Object.prototype.toString.call(value)
    )[1].toLowerCase();
}
