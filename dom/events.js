/* eslint-disable no-underscore-dangle */

import {splitStringValue} from "./utils";

/**
 * Registers an event listener for the given events
 *
 * @param {HTMLElement|HTMLElement[]} element
 * @param {string|string[]} type
 * @param {function(*):*} handler
 */
export function on (element, type, handler)
{
    const list = Array.isArray(element) ? element : [element];
    const types = splitStringValue(type);

    for (let i = 0; i < list.length; i++)
    {
        for (let j = 0; j < types.length; j++)
        {
            const node = list[i];
            const eventType = types[j];

            node.addEventListener(eventType, handler);

            if (typeof node._listeners === "undefined")
            {
                node._listeners = {};
            }

            if (typeof node._listeners[eventType] === "undefined")
            {
                node._listeners[eventType] = [];
            }

            node._listeners[eventType].push(handler);
        }
    }
}


/**
 * Removes an event listener for the given events
 *
 * @param {HTMLElement|HTMLElement[]} element
 * @param {string|string[]} type
 * @param {function(*):*} handler
 */
export function off (element, type, handler)
{
    const list = Array.isArray(element) ? element : [element];
    const types = splitStringValue(type);

    for (let i = 0; i < list.length; i++)
    {
        for (let j = 0; j < types.length; j++)
        {
            const node = list[i];
            const eventType = types[j];

            node.removeEventListener(eventType, handler);

            if (typeof node._listeners !== "undefined" && typeof node._listeners[eventType] !== "undefined")
            {
                const index = node._listeners[eventType].indexOf(handler);

                if (-1 !== index)
                {
                    node._listeners[eventType].splice(index, 1);
                }
            }
        }
    }
}


/**
 * Registers an event listener, that it automatically is removed after it was executed once.
 *
 * Returns the intermediate function, so that the event listener can be removed:
 *
 *      const intermediate = once(element, event, handler);
 *      off(element, event, intermediate);
 *
 * @param {HTMLElement} element
 * @param {string} type
 * @param {function(*):*} handler
 * @return {function():*}
 */
export function once (element, type, handler)
{
    const intermediate = (...args) => {
        handler(...args);
        off(element, type, intermediate);
    };
    on(element, type, intermediate);

    return intermediate;
}


/**
 * Registers an event listener, that it automatically is removed after it was executed once.
 *
 * Returns the intermediate function, so that the event listener can be removed:
 *
 *      const intermediate = once(element, event, handler);
 *      off(element, event, intermediate);
 *
 * @param {HTMLElement} element
 * @param {string} selector
 * @param {string} type
 * @param {function(*):*} handler
 * @return {function():*}
 */
export function live (element, selector, type, handler)
{
    const intermediate = (event) => {
        if (event.target.matches(selector))
        {
            handler(event);
        }
    };
    on(element, type, intermediate);

    return intermediate;
}
