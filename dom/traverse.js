import "../polyfill/dom";
import {isElement} from "./utils";


/**
 * Returns whether the given element is - in fact - an HTMLElement and
 * it matches the optional selector
 *
 * @param {Node|HTMLElement} element
 * @param {?string} selector
 * @return {boolean}
 */
function elementMatches (element, selector)
{
    return isElement(element) && (null === selector || element.matches(selector));
}

/**
 *
 * @param {HTMLElement} element
 * @param {?string} selector
 * @param {string} method
 * @param {boolean} onlyFirst
 * @return {HTMLElement[]|HTMLElement}
 */
function fetchSiblings (element, selector, method, onlyFirst)
{
    let sibling = element[method];
    const list = [];

    while (sibling)
    {
        if (elementMatches(sibling, selector))
        {
            if (onlyFirst)
            {
                return sibling;
            }

            list.push(sibling);
        }

        sibling = sibling[method];
    }

    return onlyFirst ? null : list;
}


/**
 * Finds all DOM elements matching the selector
 *
 * @param {string} selector
 * @param {Document|HTMLElement} context
 * @return {HTMLElement[]}
 */
export function find (selector, context = document)
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
export function findOne (selector, context = document)
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
export function filter (list, selector)
{
    return list.filter(
        (e) => e.matches(selector)
    );
}


/**
 * Filters a list of DOM elements that DO NOT match the given selector or are
 * not the given node.
 *
 * @param {HTMLElement[]} list
 * @param {string|HTMLElement} selector
 * @return {HTMLElement[]}
 */
export function not (list, selector)
{
    if (typeof selector === "string")
    {
        return list.filter(
            (e) => !e.matches(selector)
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
export function children (parent, selector = null)
{
    const list = [];
    let child = parent.firstChild;

    while (child)
    {
        if (elementMatches(child, selector))
        {
            list.push(child);
        }

        child = child.nextSibling;
    }

    return list;
}


/**
 * Returns the nearest previous sibling matching
 * (optionally matching the given selector)
 *
 * @param {HTMLElement} element
 * @param {?string} selector
 * @return {?HTMLElement}
 */
export function prev (element, selector = null)
{
    return fetchSiblings(element, selector, "previousSibling", true);
}


/**
 * Returns the nearest following sibling
 * (optionally matching the given selector)
 *
 * @param {HTMLElement} element
 * @param {?string} selector
 * @return {?HTMLElement}
 */
export function next (element, selector = null)
{
    return fetchSiblings(element, selector, "nextSibling", true);
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
export function prevAll (element, selector = null)
{
    return fetchSiblings(element, selector, "previousSibling", false);
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
export function nextAll (element, selector = null)
{
    return fetchSiblings(element, selector, "nextSibling", false);
}


/**
 * Returns all siblings
 * (optionally matching the given selector)
 *
 * @param {HTMLElement} element
 * @param {?string} selector
 * @return {HTMLElement[]}
 */
export function siblings (element, selector = null)
{
    let sibling = element.parentNode.firstChild;
    const list = [];

    while (sibling)
    {
        if (sibling !== element && elementMatches(sibling, selector))
        {
            list.push(sibling);
        }

        sibling = sibling.nextSibling;
    }

    return list;
}


/**
 * Returns the closest parent that matches the selector
 *
 * @param {HTMLElement} element
 * @param {string} selector
 * @return {?HTMLElement}
 */
export function closest (element, selector)
{
    let parent = element.parentNode;

    /** @type {HTMLElement} node */
    while (parent)
    {
        if (parent.matches(selector))
        {
            return parent;
        }

        parent = parent.parentNode;
    }

    return null;
}
