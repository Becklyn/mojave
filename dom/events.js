/* eslint-disable no-underscore-dangle */

import {splitStringValue} from "./utils";

/**
 * Registers an event listener for the given events
 *
 * @param {Window|HTMLElement|HTMLElement[]} element
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
 * @param {Window|HTMLElement|HTMLElement[]} element
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
 * Registers an event listener, that is automatically removed after it was executed once.
 *
 * Returns the intermediate function, so that the event listener can be removed:
 *
 *      const intermediate = once(element, event, handler);
 *      off(element, event, intermediate);
 *
 * @param {Window|HTMLElement} element
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
 * Registers an delegated event listener, that reacts to events thrown on specific child elements.
 *
 * Returns the intermediate function, so that the event listener can be removed:
 *
 *      const intermediate = delegate(element, selector, type, handler);
 *      off(element, event, intermediate);
 *
 * @param {Window|HTMLElement} element
 * @param {string} selector
 * @param {string} type
 * @param {function(*):*} handler
 * @return {function():*}
 */
export function delegate (element, selector, type, handler)
{
    const intermediate = (event) =>
    {
        const matchedDelegatedTarget = findDelegatedTarget(element, event.target, selector);

        if (null !== matchedDelegatedTarget)
        {
            handler(event);
        }
    };

    on(element, type, intermediate);

    return intermediate;
}


/**
 * In a delegated event listener, this function finds the actual desired event target.
 *
 * @param {HTMLElement} delegateElement
 * @param {HTMLElement} currentTarget
 * @param {string} selector
 * @return {?HTMLElement}
 */
function findDelegatedTarget (delegateElement, currentTarget, selector)
{
    let node = currentTarget;

    while (node !== delegateElement)
    {
        if (node.matches(selector))
        {
            return node;
        }

        node = node.parentNode;
    }

    return null;
}


/**
 * Dispatches an event
 *
 * @param {Window|HTMLElement} element
 * @param {string} type
 * @param {*} data
 */
export function trigger (element, type, data = null)
{
    const event = createEvent(type, {
        bubbles: true,
        cancelable: true,
        preventDefault: false,
        detail: data,
    });

    element.dispatchEvent(event);
}


/**
 * Creates an event
 *
 * @private
 * @param {string} type
 * @param {CustomEventInit|{bubbles: boolean, cancelable: boolean, preventDefault: boolean, detail: *}} args
 * @return {CustomEvent}
 */
function createEvent (type, args)
{
    // @legacy IE <= 11 doesn't support the global CustomEvent
    if (typeof window.CustomEvent !== "function")
    {
        /** @type {CustomEvent|Event} event */
        const event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, args.bubbles, args.cancelable, args.detail);
        return event;
    }

    return new CustomEvent(type, args);
}
