/**
 * Replaces all occurrences of substrings in the given string.
 */
export function replaceAll (text : string, replacements : {[key: string]: string}) : string
{
    for (const key in replacements)
    {
        if (!replacements.hasOwnProperty(key))
        {
            continue;
        }

        text = text.split(key).join(replacements[key]);
    }

    return text;
}
