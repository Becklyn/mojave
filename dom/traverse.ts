import "../polyfill/dom";


/**
 * Returns whether the given element is - in fact - an HTMLElement and
 * it matches the optional selector
 */
function elementMatches (element : Element, selector : string|null = null)
{
    return (null === selector || element.matches(selector));
}


/**
 * Fetches all siblings
 */
function fetchAllSiblings (element : Element, selector : null|string, accessor : string) : HTMLElement[]
{
    let indexableElement = element as mojave.types.StringIndexedHTMLElement;
    let sibling = indexableElement[accessor];
    const list = [];

    while (sibling)
    {
        if (elementMatches(sibling, selector))
        {
            list.push(sibling);
        }

        sibling = sibling[accessor];
    }

    return list;
}


/**
 * Fetches a single sibling
 */
function fetchSingleSibling (element : HTMLElement, selector : null|string, accessor : string) : null|HTMLElement
{
    let indexableElement = element as mojave.types.StringIndexedHTMLElement;
    let sibling = indexableElement[accessor];

    while (sibling)
    {
        if (elementMatches(sibling, selector))
        {
            return sibling;
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
 */
export function findOne (selector : string, context : HTMLElement|Document = document) : null|HTMLElement
{
    return context.querySelector(selector);
}


/**
 * Filters a list of DOM elements that match the given selector
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
 */
export function children (parent : HTMLElement, selector : null|string = null) : HTMLElement[]
{
    const list : HTMLElement[] = [];
    let child = parent.firstElementChild;

    while (child)
    {
        if (elementMatches(child, selector))
        {
            list.push(child as HTMLElement);
        }

        child = child.nextElementSibling;
    }

    return list;
}


/**
 * Returns the first child
 */
export function firstChild (parent : HTMLElement, selector : null|string = null) : null|HTMLElement
{
    let child = parent.firstElementChild;

    while (child)
    {
        if (elementMatches(child, selector))
        {
            return child as HTMLElement;
        }

        child = child.nextElementSibling;
    }

    return null;
}


/**
 * Returns the nearest previous sibling matching
 * (optionally matching the given selector)
 */
export function prev (element : HTMLElement, selector : null|string = null) : null|HTMLElement
{
    return fetchSingleSibling(element, selector, "previousElementSibling");
}


/**
 * Returns the nearest following sibling
 * (optionally matching the given selector)
 */
export function next (element : HTMLElement, selector : null|string = null) : null|HTMLElement
{
    return fetchSingleSibling(element, selector, "nextElementSibling");
}


/**
 * Returns all previous siblings
 * (optionally matching the given selector)
 *
 * The nearest sibling is the first element in the list.
 */
export function prevAll (element : HTMLElement, selector : null|string = null) : HTMLElement[]
{
    return fetchAllSiblings(element, selector, "previousElementSibling");
}


/**
 * Returns all following siblings
 * (optionally matching the given selector)
 *
 * The nearest sibling is the first element in the list.
 */
export function nextAll (element : HTMLElement, selector : null|string = null) : HTMLElement[]
{
    return fetchAllSiblings(element, selector, "nextElementSibling");
}


/**
 * Returns all siblings
 * (optionally matching the given selector)
 */
export function siblings (element : HTMLElement, selector : null|string = null) : HTMLElement[]
{
    const list : HTMLElement[] = [];
    let sibling : null|Element = null;

    if (null !== element.parentElement)
    {
        sibling = element.parentElement.firstElementChild;
    }

    while (null !== sibling)
    {
        if (sibling !== element && elementMatches(sibling, selector))
        {
            list.push(sibling as HTMLElement);
        }

        sibling = sibling.nextElementSibling;
    }

    return list;
}


/**
 * Returns the closest parent that matches the selector.
 *
 * If a root element is given, the parent is only searched up to (and excluding) this root node.
 */
export function closest (element : HTMLElement, selector : string, rootElement : null|HTMLElement = null) : null|HTMLElement
{
    let parent = element.parentElement;

    while (null !== parent && rootElement !== parent)
    {
        if (parent.matches(selector))
        {
            return parent;
        }

        parent = parent.parentElement;
    }

    return null;
}
