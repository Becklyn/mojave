/**
 * Escapes the given text as HTML
 *
 * @param {string} text
 * @return {string}
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
