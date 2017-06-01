/**
 * Debounces functions that are frequently invoked
 *
 * @param {function} func       function to be invoked
 * @param {number} delay         time to wait before func is invoked
 * @returns {function(...[*]=)}
 */
export function debounce (func, delay = 80)
{
    let timeoutId = null;

    return (...args) =>
    {
        const later = () =>
        {
            timeoutId = null;
            func(...args);
        };

        window.clearTimeout(timeoutId);

        timeoutId = window.setTimeout(later, delay);
    };
}
