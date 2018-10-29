import {splitStringValue} from "./utils";

const SPECIAL_ATTRIBUTE_SETTERS = /^(html|text|css)$/;
const customDataStorage = new WeakMap();


/**
 * Sets all attributes on the given element
 */
export function setAttrs (element : Element, attributes : mojave.types.OptionalKeyMap) : void
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
 * @deprecated use `element.getAttribute()` directly instead. Will be removed in v3.0
 */
export function getAttr (element : Element, attribute : string) : null|string
{
    return element.getAttribute(attribute);
}


/**
 * Updates the classes on the given element
 *
 * @private
 */
function updateClasses (element : Element|Element[], classes : string|string[], method : (...tokens : string[]) => void) : void
{
    const list = Array.isArray(element) ? element : [element];
    const classList = splitStringValue(classes);

    for (let i = 0; i < list.length; i++)
    {
        for (let j = 0; j < classList.length; j++)
        {
            method.call(list[i].classList, classList[j]);
        }
    }
}


/**
 * Adds all given classes to the element
 */
export function addClass (element : Element|Element[], classes : string|string[]) : void
{
    updateClasses(element, classes, DOMTokenList.prototype.add);
}


/**
 * Remove all given classes from the element
 */
export function removeClass (element : Element|Element[], classes : string|string[]) : void
{
    updateClasses(element, classes, DOMTokenList.prototype.remove);
}


/**
 * Normalizes the key for *Data functions
 */
function normalizeDataKey (key : string) : string
{
    return key.replace(
        /-([a-z])/g,
        (matches) => matches[1].toUpperCase()
    );
}


/**
 * Sets the data on the given element
 */
export function setData (element : Element, key : string, value : any) : void
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
 */
export function getData (element : HTMLElement, key : string) : any
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
 * Determines whether the given data attribute is set on the element
 */
export function hasData (element : HTMLElement, key : string) : boolean
{
    const value = getData(element, key);

    // Empty data attributes' value is an empty string
    if ("" === value)
    {
        return true;
    }

    return null != value;
}


/**
 * Returns all data in custom storage
 */
export function getAllCustomData (element : HTMLElement) : {}
{
    return customDataStorage.get(element) || {};
}
