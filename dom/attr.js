/* eslint-disable no-underscore-dangle */

import {splitStringValue} from "./utils";

const SPECIAL_ATTRIBUTE_SETTERS = /^(html|text|css)$/;


/**
 * Sets all attributes on the given element
 *
 * @param {HTMLElement} element
 * @param {Object.<string, string>} attributes
 */
export function setAttrs (element, attributes)
{
    for (const key in attributes)
    {
        if (!attributes.hasOwnProperty(key))
        {
            continue;
        }

        const value = attributes[key];

        if (SPECIAL_ATTRIBUTE_SETTERS.test(key))
        {
            return;
        }

        if (value === null || value === false)
        {
            element.removeAttribute(key);
        }
        else
        {
            element.setAttribute(key, "" + attributes[key]);
        }
    }
}


/**
 * Returns the attribute value for the given html node
 *
 * @param {HTMLElement} element
 * @param {string} attribute
 * @return {?string}
 */
export function getAttr (element, attribute)
{
    return element.getAttribute(attribute);
}


/**
 * Adds all given classes to the element
 *
 * @param {HTMLElement|HTMLElement[]} element
 * @param {string|string[]} classes
 */
export function addClass (element, classes)
{
    const list = Array.isArray(element) ? element : [element];
    const classList = splitStringValue(classes);

    for (let i = 0; i < list.length; i++)
    {
        for (let j = 0; j < classList.length; j++)
        {
            list[i].classList.add(classList[j]);
        }
    }
}


/**
 * Remove all given classes from the element
 *
 * @param {HTMLElement|HTMLElement[]} element
 * @param {string|string[]} classes
 */
export function removeClass (element, classes)
{
    const list = Array.isArray(element) ? element : [element];
    const classList = splitStringValue(classes);

    for (let i = 0; i < list.length; i++)
    {
        for (let j = 0; j < classList.length; j++)
        {
            list[i].classList.remove(classList[j]);
        }
    }
}


/**
 * Normalizes the key for *Data functions
 *
 * @private
 * @param {string} key
 * @return {string}
 */
function normalizeDataKey (key)
{
    return key.replace(
        /-([a-z])/g,
        (matches) => matches[1].toUpperCase()
    );
}


/**
 * Sets the data on the given element
 *
 * @param {HTMLElement} element
 * @param {string} key
 * @param {*} value
 */
export function setData (element, key, value)
{
    key = normalizeDataKey(key);

    if (typeof element._data === "undefined")
    {
        element._data = {};
    }

    element._data[key] = value;
}


/**
 * Loads the data from the element
 *
 * @param {HTMLElement} element
 * @param {string} key
 * @return {*}
 */
export function getData (element, key)
{
    const normalizedKey = normalizeDataKey(key);

    if (typeof element._data === "object" && typeof element._data[normalizedKey] !== "undefined")
    {
        return element._data[normalizedKey];
    }

    // @legacy IE <= 10 doesn't support dataset
    if (true || typeof element.dataset === "undefined")
    {
        return getAttr(element, `data-${key}`);
    }

    const value = element.dataset[normalizedKey];
    return value === undefined
        ? null
        : value;
}
