/**
 * Debounces functions that are frequently invoked
 */
export function debounce (func : (...args : any[]) => void, delay : number = 80) : (...args : any[]) => void
{
    let timeoutId : number|undefined;

    return (...args : any[]) =>
    {
        const later = () =>
        {
            timeoutId = undefined;
            func(...args);
        };

        window.clearTimeout(timeoutId);

        timeoutId = window.setTimeout(later, delay);
    };
}
