import {getAllCustomData, setData} from "./attr";
import {getAllListeners, on} from "./events";


/**
 * Duplicates the given DOM node
 *
 * @param {Element} element
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
 * @param {Element} element
 * @return {HTMLElement}
 */
export function clone (element)
{
    const clonedElement = duplicate(element);
    const listeners = getAllListeners(element);
    const dataset = element.dataset;
    const customDataset = getAllCustomData(element);

    // copy events
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

    // @legacy IE <= 10 doesn't support dataset
    // no need to do anything here, as the attributes are already cloned.

    // copy dataset
    if (dataset !== undefined)
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
    for (const key in customDataset)
    {
        if (customDataset.hasOwnProperty(key))
        {
            setData(clonedElement, key, customDataset[key]);
        }
    }

    return clonedElement;
}
