export type MediaQueryChangeCallback = (matches: boolean) => void;

interface MediaQueryMatcher
{
    on(callback: MediaQueryChangeCallback): void;
    off(callback: MediaQueryChangeCallback): void;
    onOff(callback: MediaQueryChangeCallback): () => void;
    matches(): boolean;
    destroy(): void;
}

/**
 * Creates a new media query matcher
 */
export function mediaQueryMatcher (query: string): MediaQueryMatcher
{
    let media = window.matchMedia(query);
    let listeners: MediaQueryChangeCallback[] = [];
    let updater = (event: MediaQueryListEvent) => listeners.forEach(listener => listener(event.matches));

    if (media.addEventListener)
    {
        media.addEventListener("change", updater);
    }
    else
    {
        media.addListener(updater);
    }

    return {
        /**
         * Registers a callback
         */
        on (callback: MediaQueryChangeCallback) : void
        {
            listeners.push(callback);
        },

        /**
         * Unregisters a callback
         */
        off (callback: MediaQueryChangeCallback) : void
        {
            let index = listeners.indexOf(callback);
            if (-1 < index)
            {
                listeners.splice(index, 1);
            }
        },

        /**
         * Returns whether the query matches right now
         */
        matches () : boolean
        {
            return media.matches;
        },

        /**
         * Registers a callback + returns the unregister function.
         */
        onOff (callback: MediaQueryChangeCallback) : () => void
        {
            this.on(callback);
            return () => this.off(callback)
        },

        /**
         * Destroys the matcher
         */
        destroy (): void
        {
            listeners = [];

            if (media.removeEventListener)
            {
                media.removeEventListener("change", updater);
            }
            else
            {
                media.removeListener(updater);
            }
        }
    };
}
