import {splitStringValue} from "./utils";

const SPECIAL_ATTRIBUTE_SETTERS = /^(html|text|css)$/;
const customDataStorage = new window.WeakMap();


/**
 * Sets all attributes on the given element
 *
 * @param {Element} element
 * @param {mojave.types.OptionalKeyMap} attributes
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
            element.setAttribute(
                key,
                (value === true) ? key : ("" + value)
            );
        }
    }
}


/**
 * Returns the attribute value for the given html node
 *
 * @param {Element} element
 * @param {string} attribute
 * @returns {string | null}
 */
export function getAttr (element, attribute)
{
    return element.getAttribute(attribute);
}


/**
 * Updates the classes on the given element
 *
 * @private
 * @param {Element | Element[]} element
 * @param {string | string[]} classes
 * @param {string} method
 */
function updateClasses (element, classes, method)
{
    /** @type {Element[]} list */
    const list = Array.isArray(element) ? element : [element];
    const classList = splitStringValue(classes);

    for (let i = 0; i < list.length; i++)
    {
        for (let j = 0; j < classList.length; j++)
        {
            list[i].classList[method](classList[j]);
        }
    }
}


/**
 * Adds all given classes to the element
 *
 * @param {Element | Element[]} element
 * @param {string | string[]} classes
 */
export function addClass (element, classes)
{
    updateClasses(element, classes, "add");
}


/**
 * Remove all given classes from the element
 *
 * @param {Element | Element[]} element
 * @param {string | string[]} classes
 */
export function removeClass (element, classes)
{
    updateClasses(element, classes, "remove");
}


/**
 * Normalizes the key for *Data functions
 *
 * @private
 * @param {string} key
 * @returns {string}
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
 * @param {Element} element
 * @param {string} key
 * @param {*} value
 */
export function setData (element, key, value)
{
    key = normalizeDataKey(key);
    let storage = customDataStorage.get(element);

    if (storage === undefined)
    {
        storage = {};
        customDataStorage.set(element, storage);
    }

    storage[key] = value;
}


/**
 * Loads the data from the element
 *
 * @param {HTMLElement} element
 * @param {string} key
 * @returns {*}
 */
export function getData (element, key)
{
    const normalizedKey = normalizeDataKey(key);
    const storage = customDataStorage.get(element);

    if (typeof storage === "object" && storage[normalizedKey] !== undefined)
    {
        return storage[normalizedKey];
    }

    // @legacy IE <= 10 doesn't support dataset
    if (element.dataset === undefined)
    {
        return getAttr(element, `data-${key}`);
    }

    const value = element.dataset[normalizedKey];
    return value === undefined
        ? null
        : value;
}


/**
 * Determines whether the given attribute is set on the element
 *
 * @param {Element} element
 * @param {string} key
 * @returns {boolean}
 */
export function hasData (element, key)
{
    const normalizedKey = normalizeDataKey(key);
    const storage = customDataStorage.get(element);

    if (typeof storage === "object")
    {
        return storage[normalizedKey] !== undefined;
    }

    // @legacy IE <= 10 doesn't support dataset
    if (element.dataset === undefined)
    {
        return hasAttr(element, `data-${key}`);
    }

    return undefined !== element.dataset[normalizedKey];
}


/**
 * Returns all data in custom storage
 *
 * @param {HTMLElement} element
 * @returns {Object}
 */
export function getAllCustomData (element)
{
    return customDataStorage.get(element) || {};
}
