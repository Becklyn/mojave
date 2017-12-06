/**
 * @typedef {{
 *      string: string,
 * }|Object} mojave.replacementStringObject
 */


/**
 * Replaces all occurrences of a given matching string with a given replacement string
 *
 * @param {string}                         text
 * @param {mojave.replacementStringObject} replacements
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
