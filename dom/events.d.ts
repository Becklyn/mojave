type EventRegistrationToken = Function;


/**
 * Registers an event listener for the given events
 */
declare function on (
    element : HTMLElement | Window | Array<HTMLElement|Window>,
    type : string,
    handler : (Event) => void,
) : void;


/**
 * Removes an event listener for the given events
 */
declare function off (
    element : HTMLElement | Window | Array<HTMLElement|Window>,
    type : string,
    handler : (Event) => void | EventRegistrationToken,
) : void;


/**
 * Registers an event listener, that is automatically removed after it was executed once.
 *
 * Returns the intermediate function, so that the event listener can be removed:
 *
 *      const intermediate = once(element, event, handler);
 *      off(element, event, intermediate);
 */
declare function once (
    element : HTMLElement | Window,
    type : string,
    handler : (Event) => void,
) : EventRegistrationToken;


/**
 * Registers an delegated event listener, that reacts to events thrown on specific child elements.
 *
 * Returns the intermediate function, so that the event listener can be removed:
 *
 *      const intermediate = delegate(element, selector, type, handler);
 *      off(element, event, intermediate);
 */
declare function delegate (
    element : HTMLElement | Window,
    selector : string,
    type : string,
    handler : (Event, HTMLElement) => void,
) : EventRegistrationToken;


/**
 * Dispatches an event
 */
declare function trigger (
    element : HTMLElement | Window,
    type : string,
    data : any,
) : void;
