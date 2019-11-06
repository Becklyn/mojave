import {safeParseJson} from "../json";

const storage = window.localStorage;

type PersistedToggleActor = (value: boolean) => void;
type PersistedToggleChanger = (value?: any) => void;

/**
 * A toggle helper that is persisted so it will "survive" a reload
 */
export function persistedToggle (key: string, callback: PersistedToggleActor, defaultValue: boolean = false) : PersistedToggleChanger
{
    let stored: string|null = storage.getItem(key);
    let value = null != stored
        ? "yes" === stored
        : defaultValue;

    callback(value);

    return (explicit?: any) => {
        // if a value is explicitly given use it, otherwise invert the current value
        // the any-hack is required, as so we can just pass the callback to any event listener, for example
        let newValue = (typeof explicit === "boolean")
            ? explicit
            : !value;

        if (newValue !== value)
        {
            value = newValue;
            storage.setItem(key, value ? "yes" : "no");
            callback(value);
        }
    };
}


/**
 * Stores the given value in local storage
 */
export function storeInLocalStorage (key: string, value: unknown) : void
{
    storage.setItem(key, JSON.stringify(value));
}


/**
 * Fetches the value at the given key from local storage
 */
export function fetchFromLocalStorage<T = unknown> (key: string): T|null
{
    return safeParseJson<T>(storage.getItem(key));
}
