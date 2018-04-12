import "../polyfill/dom";


/**
 * Returns whether the given element is - in fact - an HTMLElement and
 * it matches the optional selector
 *
 * @private
 *
 * @param {Element} element
 * @param {string|null} [selector]
 * @returns {boolean}
 */
function elementMatches (element, selector = null)
{
    return (null === selector || element.matches(selector));
}


/**
 * Fetches all siblings
 *
 * @private
 * @param {Element} element
 * @param {string | null} selector
 * @param {string} accessor
 * @returns {HTMLElement[]}
 */
function fetchAllSiblings (element, selector, accessor)
{
    let sibling = element[accessor];
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
 *
 * @private
 * @param {HTMLElement} element
 * @param {string | null} selector
 * @param {string} accessor
 * @returns {HTMLElement | null}
 */
function fetchSingleSibling (element, selector, accessor)
{
    let sibling = element[accessor];

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
 *
 * @param {string} selector
 * @param {HTMLElement | Document} [context]
 * @returns {HTMLElement[]}
 */
export function find (selector, context = document)
{
    return Array.prototype.slice.call(context.querySelectorAll(selector));
}


/**
 * Finds a single DOM node matching the selector
 *
 * @param {string} selector
 * @param {HTMLElement | Document} [context]
 * @returns {HTMLElement | null}
 */
export function findOne (selector, context = document)
{
    return context.querySelector(selector);
}


/**
 * Filters a list of DOM elements that match the given selector
 *
 * @param {HTMLElement[]} list
 * @param {string} selector
 * @returns {HTMLElement[]}
 */
export function filter (list, selector)
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
 * @param {string | HTMLElement | HTMLElement[]} selector
 * @returns {HTMLElement[]}
 */
export function not (list, selector)
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
 * @param {string|null} [selector]
 * @returns {HTMLElement[]}
 */
export function children (parent, selector = null)
{
    const list = [];
    let child = parent.firstElementChild;

    while (child)
    {
        if (elementMatches(child, selector))
        {
            list.push(child);
        }

        child = child.nextElementSibling;
    }

    return list;
}


/**
 * Returns the nearest previous sibling matching
 * (optionally matching the given selector)
 *
 * @param {HTMLElement} element
 * @param {string|null} [selector]
 * @returns {HTMLElement | null}
 */
export function prev (element, selector = null)
{
    return fetchSingleSibling(element, selector, "previousElementSibling");
}


/**
 * Returns the nearest following sibling
 * (optionally matching the given selector)
 *
 * @param {HTMLElement} element
 * @param {string|null} [selector]
 * @returns {HTMLElement | null}
 */
export function next (element, selector = null)
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
 * @param {string|null} [selector]
 * @returns {HTMLElement[]}
 */
export function prevAll (element, selector = null)
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
 * @param {string|null} [selector]
 * @returns {HTMLElement[]}
 */
export function nextAll (element, selector = null)
{
    return fetchAllSiblings(element, selector, "nextElementSibling");
}


/**
 * Returns all siblings
 * (optionally matching the given selector)
 *
 * @param {HTMLElement} element
 * @param {string|null} [selector]
 * @returns {HTMLElement[]}
 */
export function siblings (element, selector = null)
{
    let sibling = element.parentElement.firstElementChild;
    const list = [];

    while (sibling)
    {
        if (sibling !== element && elementMatches(sibling, selector))
        {
            list.push(sibling);
        }

        sibling = sibling.nextElementSibling;
    }

    return list;
}


/**
 * Returns the closest parent that matches the selector
 *
 * @param {HTMLElement} element
 * @param {string} selector
 * @returns {HTMLElement | null}
 */
export function closest (element, selector)
{
    let parent = element.parentElement;

    while (null !== parent)
    {
        if (parent.matches(selector))
        {
            return parent;
        }

        parent = parent.parentElement;
    }

    return null;
}
