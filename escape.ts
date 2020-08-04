/**
 * Escapes the given text as HTML
 */
export function escapeHtml (text : string) : string
{
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/**
 * Escapes all special characters in a given string for usage in Regular Expressions.
 */
export function escapeRegexp (text: string) : string
{
    return text.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
