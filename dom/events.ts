import {splitStringValue} from "./utils";
const listenerRegistry = new WeakMap();

/**
 * Custom event listener token, that can unregister delegated or once event listeners
 */
export type EventIntermediateToken = (any : any) => void;

/**
 * Event handler for delegated events
 */
export type DelegatedEventHandler = (Event : Event, HTMLElement : HTMLElement) => void;


/**
 * Registers an event listener for the given events
 */
export function on (element : null|EventTarget|EventTarget[], type : string|string[], handler : EventListener) : void
{
    if (null === element)
    {
        return;
    }

    const list = (Array.isArray(element) ? element : [element]);
    const types = splitStringValue(type);

    for (let i = 0; i < list.length; i++)
    {
        for (let j = 0; j < types.length; j++)
        {
            const node = list[i];
            const eventType = types[j];

            node.addEventListener(eventType, handler);
            let listeners = listenerRegistry.get(node);

            if (!listeners)
            {
                listeners = {};
                listenerRegistry.set(node, listeners);
            }

            if (listeners[eventType] === undefined)
            {
                listeners[eventType] = [];
            }

            listeners[eventType].push(handler);
        }
    }
}


/**
 * Removes an event listener for the given events
 */
export function off (element : null|EventTarget|EventTarget[], type : string|string[], handler : EventListener) : void
{
    if (null === element)
    {
        return;
    }

    const list = (Array.isArray(element) ? element : [element]);
    const types = splitStringValue(type);

    for (let i = 0; i < list.length; i++)
    {
        for (let j = 0; j < types.length; j++)
        {
            const node = list[i];
            const eventType = types[j];

            node.removeEventListener(eventType, handler);
            const listeners = listenerRegistry.get(node);

            if (listeners !== undefined && listeners[eventType] !== undefined)
            {
                const index = listeners[eventType].indexOf(handler);

                if (-1 !== index)
                {
                    listeners[eventType].splice(index, 1);
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
export function once (element : null|EventTarget, type : string, handler : EventListener) : null|EventIntermediateToken
{
    if (null === element)
    {
        return null;
    }

    const intermediate = (event : Event) => {
        handler(event);
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
export function delegate (element : null|EventTarget, selector : string, type : string, handler : DelegatedEventHandler) : null|EventIntermediateToken
{
    if (null === element)
    {
        return null;
    }

    const intermediate = (event : Event) =>
    {
        const matchedDelegatedTarget = findDelegatedTarget(element, event.target as Element, selector);

        if (null !== matchedDelegatedTarget)
        {
            handler(event, matchedDelegatedTarget as HTMLElement);
        }
    };

    on(element, type, intermediate);

    return intermediate;
}


/**
 * In a delegated event listener, this function finds the actual desired event target.
 */
function findDelegatedTarget (delegateElement : EventTarget, currentTarget : null|Element, selector : string) : null|Element
{
    let node : null|Element|HTMLElement = currentTarget;

    while (null !== node && node !== delegateElement)
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
export function trigger (element : null|EventTarget, type : string, data : any = null) : void
{
    if (null === element)
    {
        return;
    }

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
 * @param {string} type
 * @param {CustomEventInit} args
 * @returns {CustomEvent}
 */
function createEvent (type : string, args : CustomEventInit) : CustomEvent
{
    // @legacy IE <= 11 doesn't support the global CustomEvent
    if (typeof CustomEvent !== "function")
    {
        const event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, !!args.bubbles, !!args.cancelable, args.detail);
        return event;
    }

    return new CustomEvent(type, args);
}


/**
 * Returns all event listeners for the given element
 */
export function getAllListeners (element : EventTarget) : Object
{
    return listenerRegistry.get(element) || {};
}
