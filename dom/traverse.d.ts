/**
 * Finds all DOM elements matching the selector
 */
declare function find (
    selector : string,
    context? : HTMLElement |Document,
) : Array<HTMLElement>;


/**
 * Finds a single DOM node matching the selector
 */
declare function findOne (
    selector : string,
    context? : HTMLElement |Document,
) : HTMLElement | null;


/**
 * Filters a list of DOM elements that match the given selector
 */
declare function filter (
    list : Array<HTMLElement>,
    selector : string,
) : Array<HTMLElement>;


/**
 * Filters a list of DOM elements that DO NOT match the given selector,
 * are not the given node or are not in the given node list.
 */
declare function not (
    list : Array<HTMLElement>,
    selector : string | HTMLElement | Array<HTMLElement>,
) : Array<HTMLElement>;


/**
 * Returns all children
 */
declare function children (
    parent : HTMLElement,
    selector? : string,
) : Array<HTMLElement>;


/**
 * Returns the nearest previous sibling matching
 * (optionally matching the given selector)
 */
declare function prev (
    parent : HTMLElement,
    selector? : string,
) : HTMLElement | null;


/**
 * Returns the nearest following sibling
 * (optionally matching the given selector)
 */
declare function next (
    parent : HTMLElement,
    selector? : string,
) : HTMLElement | null;


/**
 * Returns all previous siblings
 * (optionally matching the given selector)
 *
 * The nearest sibling is the first element in the list.
 */
declare function prevAll (
    parent : HTMLElement,
    selector? : string,
) : Array<HTMLElement>;


/**
 * Returns all following siblings
 * (optionally matching the given selector)
 *
 * The nearest sibling is the first element in the list.
 */
declare function nextAll (
    parent : HTMLElement,
    selector? : string,
) : Array<HTMLElement>;


/**
 * Returns all siblings
 * (optionally matching the given selector)
 */
declare function siblings (
    parent : HTMLElement,
    selector? : string,
) : Array<HTMLElement>;


/**
 * Returns the closest parent that matches the selector
 */
declare function closest (
    element : HTMLElement,
    selector : string,
) : HTMLElement | null;
