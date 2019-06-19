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


/**
 * Returns a callback. If this returned value is called, it will call the given run callback in the
 * next animation frame. Duplicate calls in the same frame will be dropped.
 *
 * Example usage is handling scroll events without thrashing the main thread, but acting
 * on every scroll paint update:
 *
 *      on(window, "scroll", onNextAnimationFrame(() => doSth(1, 2, 3));
 *
 * The arguments will be passed to the given callback.
 */
export function onNextAnimationFrame (run: (...args: any[]) => void) : (...args: any[]) => void
{
    let token: number|null = null;

    return (...args) =>
    {
        if (!token)
        {
            token = window.requestAnimationFrame(() => {
                run(...args);
                token = null;
            });
        }
    }
}
