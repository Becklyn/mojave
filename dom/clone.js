/* eslint-disable no-underscore-dangle */

import {on} from "./events";
import {setData} from "./attr";


/**
 * Duplicates the given DOM node
 *
 * @param {HTMLElement} element
 * @return {HTMLElement}
 */
export function duplicate (element)
{
    return element.cloneNode(true);
}


/**
 * Clones the given node, that includes duplicating the node and copying
 * all data and events.
 *
 * @param {HTMLElement} element
 * @return {HTMLElement}
 */
export function clone (element)
{
    const clonedElement = duplicate(element);
    const listeners = element._listeners;
    const dataset = element.dataset;

    // copy events
    if (typeof listeners !== "undefined")
    {
        for (const type in listeners)
        {
            if (!listeners.hasOwnProperty(type))
            {
                continue;
            }

            for (let i = 0; i < listeners[type].length; i++)
            {
                on(clonedElement, type, listeners[type][i]);
            }
        }
    }

    // @legacy IE <= 10 doesn't support dataset
    // no need to do anything here, as the attributes are already cloned.

    // copy dataset
    if (typeof dataset !== "undefined")
    {
        for (const key in dataset)
        {
            if (dataset.hasOwnProperty(key))
            {
                setData(clonedElement, key, dataset[key]);
            }
        }
    }

    // copy custom data values
    if (typeof element._data === "object")
    {
        for (const key in element._data)
        {
            if (element._data.hasOwnProperty(key))
            {
                setData(clonedElement, key, element._data[key]);
            }
        }
    }

    return clonedElement;
}
