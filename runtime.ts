/**
 * Checks whether the object has an own property.
 */
export function hasOwnProperty (value: object, property: string) : boolean
{
    return Object.prototype.hasOwnProperty.call(value, property);
}
