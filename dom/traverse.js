import "../polyfill/dom";
import {isElement} from "./utils";


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
        if (isElement(child) && (null === selector || child.matches(selector)))
        {
            list.push(child);
        }

        child = child.nextSibling;
    }

    return list;
}
