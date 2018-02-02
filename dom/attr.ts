/// <reference path="../mojave.d.ts" />
/* eslint-disable no-underscore-dangle */

import {splitStringValue} from "./utils";

const SPECIAL_ATTRIBUTE_SETTERS = /^(html|text|css)$/;


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
            element.setAttribute(key, "" + attributes[key]);
        }
    }
}


/**
 * Returns the attribute value for the given html node
 */
export function getAttr (element : Element, attribute : string) : string|null
{
    return element.getAttribute(attribute);
}


/**
 * Adds all given classes to the element
 */
export function addClass (element : Element|Element[], classes : string|string[]) : void
{
    const list : Element[] = Array.isArray(element) ? element : [element];
    const classList : string[] = splitStringValue(classes);

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
 */
export function removeClass (element : Element|Element[], classes : string|string[]) : void
{
    const list : Element[] = Array.isArray(element) ? element : [element];
    const classList : string[] = splitStringValue(classes);

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
    const node : mojave.types.AnnotatedHTMLElement = element as mojave.types.AnnotatedHTMLElement;
    key = normalizeDataKey(key);

    if (node._data === undefined)
    {
        node._data = {};
    }

    node._data[key] = value;
}


/**
 * Loads the data from the element
 */
export function getData (element : HTMLElement, key : string) : any
{
    const node : mojave.types.AnnotatedHTMLElement = element as mojave.types.AnnotatedHTMLElement;
    const normalizedKey = normalizeDataKey(key);

    if (typeof node._data === "object" && typeof node._data[normalizedKey] !== "undefined")
    {
        return node._data[normalizedKey];
    }

    // @legacy IE <= 10 doesn't support dataset
    if (node.dataset === undefined)
    {
        return getAttr(element, `data-${key}`);
    }

    const value = element.dataset[normalizedKey];
    return value === undefined
        ? null
        : value;
}
