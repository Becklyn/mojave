import "../polyfill/dom";
import {mojave} from "../@types/mojave";


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
function fetchAllSiblings<T extends HTMLElement = HTMLElement> (element : Element, selector : null|string, accessor : string) : T[]
{
    let indexableElement = element as mojave.types.StringIndexedHTMLElement;
    let sibling = indexableElement[accessor];
    const list: T[] = [];

    while (sibling)
    {
        if (elementMatches(sibling, selector))
        {
            list.push(sibling as T);
        }

        sibling = sibling[accessor];
    }

    return list;
}


/**
 * Fetches a single sibling
 */
function fetchSingleSibling<T extends HTMLElement = HTMLElement> (element : HTMLElement, selector : null|string, accessor : string) : null|T
{
    let indexableElement = element as mojave.types.StringIndexedHTMLElement;
    let sibling = indexableElement[accessor];

    while (sibling)
    {
        if (elementMatches(sibling, selector))
        {
            return sibling as T;
        }

        sibling = sibling[accessor];
    }

    return null;
}


/**
 * Finds all DOM elements matching the selector
 */
export function find<T extends HTMLElement = HTMLElement> (selector : string, context : HTMLElement|Document = document) : T[]
{
    return Array.prototype.slice.call(context.querySelectorAll(selector)) as T[];
}


/**
 * Finds a single DOM node matching the selector
 */
export function findOne<T extends HTMLElement = HTMLElement> (selector : string, context : HTMLElement|Document = document) : null|T
{
    return context.querySelector(selector) as T;
}


/**
 * Filters a list of DOM elements that match the given selector
 */
export function filter<TList extends HTMLElement[]> (list : TList, selector : string) : TList
{
    return list.filter(
        (e) => e.matches(selector)
    ) as TList;
}


/**
 * Filters a list of DOM elements that DO NOT match the given selector,
 * are not the given node or are not in the given node list.
 */
export function not<TList extends HTMLElement[]> (list : TList, selector : string|HTMLElement|HTMLElement[]) : TList
{
    if (typeof selector === "string")
    {
        return list.filter(
            (e) => !e.matches(selector)
        ) as TList;
    }
    else if (Array.isArray(selector))
    {
        return list.filter(
            (e) => -1 !== selector.indexOf(e)
        ) as TList;
    }

    return list.filter(
        (e) => e !== selector
    ) as TList;
}


/**
 * Returns all children
 */
export function children<T extends HTMLElement = HTMLElement> (parent : HTMLElement, selector : null|string = null) : T[]
{
    const list : T[] = [];
    let child = parent.firstElementChild;

    while (child)
    {
        if (elementMatches(child, selector))
        {
            list.push(child as T);
        }

        child = child.nextElementSibling;
    }

    return list as T[];
}


/**
 * Returns the first child
 */
export function firstChild<T extends HTMLElement = HTMLElement> (parent : HTMLElement, selector : null|string = null) : null|T
{
    let child = parent.firstElementChild;

    while (child)
    {
        if (elementMatches(child, selector))
        {
            return child as T;
        }

        child = child.nextElementSibling;
    }

    return null;
}


/**
 * Returns the nearest previous sibling matching
 * (optionally matching the given selector)
 */
export function prev<T extends HTMLElement = HTMLElement> (element : HTMLElement, selector : null|string = null) : null|T
{
    return fetchSingleSibling<T>(element, selector, "previousElementSibling");
}


/**
 * Returns the nearest following sibling
 * (optionally matching the given selector)
 */
export function next<T extends HTMLElement = HTMLElement> (element : HTMLElement, selector : null|string = null) : null|T
{
    return fetchSingleSibling<T>(element, selector, "nextElementSibling");
}


/**
 * Returns all previous siblings
 * (optionally matching the given selector)
 *
 * The nearest sibling is the first element in the list.
 */
export function prevAll<T extends HTMLElement = HTMLElement> (element : HTMLElement, selector : null|string = null) : T[]
{
    return fetchAllSiblings<T>(element, selector, "previousElementSibling");
}


/**
 * Returns all following siblings
 * (optionally matching the given selector)
 *
 * The nearest sibling is the first element in the list.
 */
export function nextAll<T extends HTMLElement = HTMLElement> (element : HTMLElement, selector : null|string = null) : T[]
{
    return fetchAllSiblings<T>(element, selector, "nextElementSibling");
}


/**
 * Returns all siblings
 * (optionally matching the given selector)
 */
export function siblings<T extends HTMLElement = HTMLElement> (element : HTMLElement, selector : null|string = null) : T[]
{
    const list : T[] = [];
    let sibling : null|Element = null;

    if (null !== element.parentElement)
    {
        sibling = element.parentElement.firstElementChild;
    }

    while (null !== sibling)
    {
        if (sibling !== element && elementMatches(sibling, selector))
        {
            list.push(sibling as T);
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
export function closest<T extends HTMLElement = HTMLElement> (element : HTMLElement, selector : string, rootElement : null|HTMLElement = null) : null|T
{
    let parent = element.parentElement;

    while (null !== parent && rootElement !== parent)
    {
        if (parent.matches(selector))
        {
            return parent as T;
        }

        parent = parent.parentElement;
    }

    return null;
}
