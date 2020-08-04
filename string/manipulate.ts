/**
 * Replaces all occurrences of substrings in the given string.
 */
export function replaceAll (text : string, replacements : {[key: string]: string}) : string
{
    for (const key in replacements)
    {
        text = text.split(key).join(replacements[key]);
    }

    return text;
}

/**
 * Transforms the value to a string array.
 */
export function toStringArray (value: string|string[]|null|undefined) : string[]
{
    if (!value)
    {
        return [];
    }

    return typeof value == "string"
        ? [value]
        : value;
}

/**
 * Escapes all special characters in a given string for usage in Regular Expressions.
 */
export function escapeStringRegexp (text: string) : string
{
    return text.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
