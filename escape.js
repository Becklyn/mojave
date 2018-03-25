///<reference path="types/escape.d.ts">

/**
 * Escapes the given text as HTML
 *
 * @param {string} text
 * @return {string}
 */
export function escapeHtml (text)
{
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
