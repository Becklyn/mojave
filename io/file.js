/**
 * All supported file units
 * @type {string[]}
 */
export const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];


/**
 * Formats the given file size in a human readable format
 *
 * @param {number} size
 * @returns {string}
 */
export function formatSize (size)
{
    const isNegative = size < 0;
    const prefix = isNegative ? "-" : "";

    if (isNegative)
    {
        size = -size;
    }

    if (size < 1)
    {
        return `${prefix}${size} B`;
    }

    const exponent = Math.min(Math.floor(Math.log(size) / Math.log(1000)), UNITS.length - 1);
    let sizeFormatted = Number((size / Math.pow(1000, exponent)).toPrecision(3));
    sizeFormatted = ("" + sizeFormatted).replace(".", ",");
    const unit = UNITS[exponent];

    return `${prefix}${sizeFormatted} ${unit}`;
}
