/* eslint-disable no-underscore-dangle */

import {splitStringValue} from "./utils";
import {mojave as types} from "../global-types";

/**
 * Registers an event listener for the given events
 */
export function on (
    element : EventTarget|EventTarget[],
    type : string,
    handler : EventListenerOrEventListenerObject
) : void
{
    const list : types.AnnotatedHTMLElement[] = (Array.isArray(element) ? element : [element]) as types.AnnotatedHTMLElement[];
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
 */
export function off (
    element : EventTarget|EventTarget[],
    type : string,
    handler : EventListenerOrEventListenerObject|types.EventIntermediateToken
) : void
{
    const list : types.AnnotatedHTMLElement[] = (Array.isArray(element) ? element : [element]) as types.AnnotatedHTMLElement[];
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
 */
export function once (
    element : EventTarget,
    type : string,
    handler : EventListenerOrEventListenerObject
) : types.EventIntermediateToken
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
 */
export function delegate (
    element : EventTarget,
    selector : string,
    type : string,
    handler : types.DelegatedEventHandler
) : types.EventIntermediateToken
{
    const intermediate = (event) =>
    {
        const matchedDelegatedTarget = findDelegatedTarget(element, event.target, selector);

        if (null !== matchedDelegatedTarget)
        {
            handler(event, matchedDelegatedTarget);
        }
    };

    on(element, type, intermediate);

    return intermediate;
}


/**
 * In a delegated event listener, this function finds the actual desired event target.
 */
function findDelegatedTarget (delegateElement : EventTarget, currentTarget : Element, selector : string) : Element|null
{
    let node = currentTarget;

    while (null !== currentTarget && node !== delegateElement)
    {
        if (node.matches(selector))
        {
            return node;
        }

        node = node.parentElement;
    }

    return null;
}


/**
 * Dispatches an event
 */
export function trigger (element : EventTarget, type : string, data : any = null) : void
{
    const event = createEvent(type, {
        bubbles: true,
        cancelable: true,
        detail: data,
    });

    element.dispatchEvent(event);
}


/**
 * Creates an event
 *
 * @private
 */
function createEvent (type : string, args : CustomEventInit) : CustomEvent
{
    // @legacy IE <= 11 doesn't support the global CustomEvent
    if (typeof CustomEvent !== "function")
    {
        const event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, args.bubbles, args.cancelable, args.detail);
        return event;
    }

    return new CustomEvent(type, args);
}
