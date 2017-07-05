/* eslint-disable no-underscore-dangle */

import {splitStringValue} from "./utils";

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
    key = normalizeDataKey(key);

    if (typeof element._data === "object" && typeof element._data[key] !== "undefined")
    {
        return element._data[key];
    }

    const value = element.dataset[key];
    return value === undefined
        ? null
        : value;
}
