import {useEffect, useState} from "preact/hooks";


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


/**
 * Runs the callback in one frame after the next, so that it can act on previously committed DOM.
 *
 * This function is especially useful if you first need to render DOM and then set a CSS class for a transition
 * on it.
 */
export function inNextFrame (callback: () => void) : void
{
    window.requestAnimationFrame(
        () => window.requestAnimationFrame(callback)
    );
}


/**
 * Hook that debounces the given value.
 */
export default function useDebounce<TValue = any>(value: TValue, delay: number) : TValue
{
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
        () =>
        {
            const timer = window.setTimeout(
                () => setDebouncedValue(value),
                delay
            );

            return () => window.clearTimeout(timer);
        },
        [value]
    );

    return debouncedValue;
}
