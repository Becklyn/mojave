/**
 * Replaces all occurrences of substrings in the given string.
 *
 * @param {string}                text
 * @param {Object<string,string>} replacements
 *
 * @returns {string}
 */
export function replaceAll (text, replacements)
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
