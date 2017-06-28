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
 * Filters a list of DOM elements that DO NOT match the given selector
 *
 * @param {HTMLElement[]} list
 * @param {string} selector
 * @return {HTMLElement[]}
 */
export function not (list, selector)
{
    return list.filter(
        (e) => !e.matches(selector)
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
    let sibling;

    while (sibling = element.previousSibling)
    {
        if (elementMatches(sibling, selector))
        {
            return sibling;
        }
    }

    return null;
}


/**
 * Returns the nearest next sibling
 * (optionally matching the given selector)
 *
 * @param {HTMLElement} element
 * @param {?string} selector
 * @return {?HTMLElement}
 */
export function next (element, selector = null)
{
    let sibling;

    while (sibling = element.nextSibling)
    {
        if (elementMatches(sibling, selector))
        {
            return sibling;
        }
    }

    return null;
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
            list.push(element);
        }

        sibling = element.nextSibling;
    }

    return list;
}
