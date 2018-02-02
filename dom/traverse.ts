import "../polyfill/dom";


/**
 * Returns whether the given element is - in fact - an HTMLElement and
 * it matches the optional selector
 *
 * @param {Node|Element} element
 * @param {?string} selector
 * @return {boolean}
 */
function elementMatches (element : Element, selector? : string = null) : boolean
{
    return (null === selector || element.matches(selector));
}


/**
 * Fetches all siblings
 */
function fetchAllSiblings (element : Element, selector : string|null, accessor : string) : HTMLElement[]
{
    let sibling : Element = element[accessor];
    const list : Element[] = [];

    while (sibling)
    {
        if (elementMatches(sibling, selector))
        {
            list.push(sibling);
        }

        sibling = sibling[accessor];
    }

    return list as HTMLElement[];
}


/**
 * Fetches a single sibling
 */
function fetchSingleSibling (element : HTMLElement, selector : string|null, accessor : string) : HTMLElement|null
{
    let sibling : Element = element[accessor];

    while (sibling)
    {
        if (elementMatches(sibling, selector))
        {
            return sibling as HTMLElement;
        }

        sibling = sibling[accessor];
    }

    return null;
}


/**
 * Finds all DOM elements matching the selector
 */
export function find (selector : string, context : HTMLElement|Document = document) : HTMLElement[]
{
    return Array.prototype.slice.call(context.querySelectorAll(selector));
}


/**
 * Finds a single DOM node matching the selector
 *
 * @param {string} selector
 * @param {Document|HTMLElement} context
 * @return {?HTMLElement}
 */
export function findOne (selector : string, context : HTMLElement | Document = document) : HTMLElement | null
{
    return context.querySelector(selector);
}


/**
 * Filters a list of DOM elements that match the given selector
 *
 * @param {HTMLElement[]} list
 * @param {string} selector
 * @return {HTMLElement[]}
 */
export function filter (list : HTMLElement[], selector : string) : HTMLElement[]
{
    return list.filter(
        (e) => e.matches(selector)
    );
}


/**
 * Filters a list of DOM elements that DO NOT match the given selector,
 * are not the given node or are not in the given node list.
 *
 * @param {HTMLElement[]} list
 * @param {string|HTMLElement|HTMLElement[]} selector
 * @return {HTMLElement[]}
 */
export function not (list : HTMLElement[], selector : string|HTMLElement|HTMLElement[]) : HTMLElement[]
{
    if (typeof selector === "string")
    {
        return list.filter(
            (e) => !e.matches(selector)
        );
    }
    else if (Array.isArray(selector))
    {
        return list.filter(
            (e) => -1 !== selector.indexOf(e)
        );
    }

    return list.filter(
        (e) => e !== selector
    );
}


/**
 * Returns all children
 *
 * @param {HTMLElement} parent
 * @param {?string} selector
 * @return {HTMLElement[]}
 */
export function children (parent : HTMLElement, selector? : string = null) : HTMLElement[]
{
    const list : Element[] = [];
    let child : Element = parent.firstElementChild;

    while (child)
    {
        if (elementMatches(child, selector))
        {
            list.push(child);
        }

        child = child.nextElementSibling;
    }

    return list as HTMLElement[];
}


/**
 * Returns the nearest previous sibling matching
 * (optionally matching the given selector)
 *
 * @param {HTMLElement} element
 * @param {?string} selector
 * @return {?HTMLElement}
 */
export function prev (element : HTMLElement, selector? : string = null) : HTMLElement|null
{
    return fetchSingleSibling(element, selector, "previousElementSibling");
}


/**
 * Returns the nearest following sibling
 * (optionally matching the given selector)
 *
 * @param {HTMLElement} element
 * @param {?string} selector
 * @return {?HTMLElement}
 */
export function next (element : HTMLElement, selector? : string = null) : HTMLElement|null
{
    return fetchSingleSibling(element, selector, "nextElementSibling");
}


/**
 * Returns all previous siblings
 * (optionally matching the given selector)
 *
 * The nearest sibling is the first element in the list.
 *
 * @param {HTMLElement} element
 * @param {?string} selector
 * @return {HTMLElement[]}
 */
export function prevAll (element : HTMLElement, selector? : string = null) : HTMLElement[]
{
    return fetchAllSiblings(element, selector, "previousElementSibling");
}


/**
 * Returns all following siblings
 * (optionally matching the given selector)
 *
 * The nearest sibling is the first element in the list.
 *
 * @param {HTMLElement} element
 * @param {?string} selector
 * @return {HTMLElement[]}
 */
export function nextAll (element : HTMLElement, selector? : string = null) : HTMLElement[]
{
    return fetchAllSiblings(element, selector, "nextElementSibling");
}


/**
 * Returns all siblings
 * (optionally matching the given selector)
 */
export function siblings (element : HTMLElement, selector? : string = null) : HTMLElement[]
{
    let sibling : Element = element.parentElement .firstElementChild;
    const list : Element[] = [];

    while (sibling)
    {
        if (sibling !== element && elementMatches(sibling, selector))
        {
            list.push(sibling);
        }

        sibling = sibling.nextElementSibling;
    }

    return list as HTMLElement[];
}


/**
 * Returns the closest parent that matches the selector
 */
export function closest (element : HTMLElement, selector : string) : HTMLElement|null
{
    let parent : Element|null = element.parentElement;

    while (null !== parent)
    {
        if ((parent as HTMLElement).matches(selector))
        {
            return parent as HTMLElement;
        }

        parent = parent.parentElement;
    }

    return null;
}
