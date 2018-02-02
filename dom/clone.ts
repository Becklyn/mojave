/// <reference path="../mojave.d.ts" />
/* eslint-disable no-underscore-dangle */

import {on} from "./events";
import {setData} from "./attr";


/**
 * Duplicates the given DOM node
 *
 * @param {Element} element
 * @return {HTMLElement}
 */
export function duplicate (element : Element) : HTMLElement
{
    return element.cloneNode(true) as HTMLElement;
}


/**
 * Clones the given node, that includes duplicating the node and copying
 * all data and events.
 *
 * @param {Element} element
 * @return {HTMLElement}
 */
export function clone (element : Element) : HTMLElement
{
    const node : mojave.types.AnnotatedHTMLElement = element as mojave.types.AnnotatedHTMLElement;
    const clonedElement : HTMLElement = duplicate(node);
    const listeners = node._listeners;
    const dataset = node.dataset;

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
    if (typeof node._data === "object")
    {
        for (const key in node._data)
        {
            if (node._data.hasOwnProperty(key))
            {
                setData(clonedElement, key, node._data[key]);
            }
        }
    }

    return clonedElement;
}
