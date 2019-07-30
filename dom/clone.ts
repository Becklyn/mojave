import {hasOwnProperty} from "../runtime";
import {getAllListeners, on} from "./events";


/**
 * Duplicates the given DOM node
 */
export function duplicate<T extends HTMLElement = HTMLElement> (element : T) : T
{
    return element.cloneNode(true) as T;
}


/**
 * Clones the given node, that includes duplicating the node and copying
 * all data and events.
 */
export function clone<T extends HTMLElement = HTMLElement> (element : T) : T
{
    const clonedElement = duplicate<T>(element);
    const listeners = getAllListeners(element);

    // copy events
    for (const type in listeners)
    {
        if (!hasOwnProperty(listeners, type))
        {
            continue;
        }

        for (let i = 0; i < listeners[type].length; i++)
        {
            on(clonedElement, type, listeners[type][i]);
        }
    }

    return clonedElement;
}
