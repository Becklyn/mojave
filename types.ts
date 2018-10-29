/**
 * Returns the type of the value
 */
export function typeOf (value : any) : string
{
    const match = /^\[object (.*?)]$/.exec(
        Object.prototype.toString.call(value)
    );

    return match !== null
        ? match[1].toLowerCase()
        : "object";
}
