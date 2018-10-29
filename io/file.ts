/**
 * All supported file units
 * @type {string[]}
 */
export const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];


/**
 * Formats the given file size in a human readable format
 */
export function formatSize (size : number) : string
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
    let sizeFormatted : number|string = Number((size / Math.pow(1000, exponent)).toPrecision(3));

    return `${prefix}${("" + sizeFormatted).replace(".", ",")} ${UNITS[exponent]}`;
}
