import {isElement} from "./utils";
import {OptionalKeyMap, setAttrs} from "./attr";
import {setStyles, StylePropertiesMap} from "./css";

/**
 * Options for createUnstyledElement()
 */
export type CreateUnstyledElementOptions = OptionalKeyMap & {
    text? : string,
    html? : string,
}
/**
 * Options for createElement()
 */
export type CreateElementOptions = CreateUnstyledElementOptions & {
    css? : StylePropertiesMap,
}

/**
 * Allowed argument for DOM insert methods.
 */
export type InsertableElement = string | Element | Element[];


/**
 * Parses the HTML to an HTMLElement
 *
 * @private
 * @param {string} html
 * @returns {HTMLElement}
 */
function parseHtml (html : string) : HTMLElement
{
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const children = doc.body.children;

    if (children.length !== 1)
    {
        throw new Error("Can only parse HTML with exactly one valid root element. A valid element can stand on its own in the body.");
    }

    return children[0] as HTMLElement;
}


/**
 * Creates an element with the given attributes
 */
export function createElement (type : string, attributes : CreateElementOptions = {}) : HTMLElement
{
    const element = createUnstyledElement(type, attributes);

    if (attributes.css !== undefined)
    {
        setStyles(element, attributes.css);
    }

    return element;
}


/**
 * Creates a simple, unstyled element.
 *
 * This is a smaller alternative to `createElement`, if you definitely don't need to style the element.
 */
export function createUnstyledElement (type : string, attributes : CreateUnstyledElementOptions = {}) : HTMLElement
{
    const element = (-1 !== type.indexOf("<"))
        ? parseHtml(type)
        : document.createElement(type);

    setAttrs(element, attributes);

    if (attributes.text !== undefined)
    {
        element.textContent = attributes.text;
    }
    else if (attributes.html !== undefined)
    {
        element.innerHTML = attributes.html;
    }

    return element;
}


/**
 * Removes the given element(s)
 */
export function remove (element : Element|Element[]|null) : void
{
    if (null === element)
    {
        return;
    }

    const list = Array.isArray(element) ? element : [element];

    for (let i = 0; i < list.length; i++)
    {
        let parentNode = list[i].parentNode;

        if (null !== parentNode)
        {
            parentNode.removeChild(list[i]);
        }
    }
}


/**
 * Empties the given element(s)
 */
export function empty (element : HTMLElement|HTMLElement[]) : void
{
    const list = Array.isArray(element) ? element : [element];

    for (let i = 0; i < list.length; i++)
    {
        if (isElement(list[i]))
        {
            list[i].innerHTML = "";
        }
    }
}


/**
 * Replaces the given element with the replacement element
 */
export function replace (element : Element, replacement : Element) : void
{
    let parentNode = element.parentNode;

    if (null !== parentNode)
    {
        parentNode.replaceChild(replacement, element);
    }
}


/**
 * Inserts the given element(s)/HTML string at the given position.
 */
function insertElement (
    reference : Element,
    insert : InsertableElement,
    adjacentPosition : InsertPosition,
    insertInto : null|Element,
    insertReference : null|Element
) // eslint-disable-line max-params
{
    // if element to insert is string
    if (typeof insert === "string")
    {
        reference.insertAdjacentHTML(adjacentPosition, insert);
        return;
    }

    if (insertInto === null)
    {
        return;
    }

    // if element to insert is HTMLElement or HTMLElement[]
    const list = Array.isArray(insert) ? insert : [insert];

    for (let i = 0; i < list.length; i++)
    {
        insertInto.insertBefore(list[i], insertReference);
    }
}


/**
 * Inserts the given element/HTML string at the end of the reference element.
 */
export function append (reference : Element, insert : InsertableElement) : void
{
    insertElement(
        reference,
        insert,
        "beforeend",
        reference,
        null
    );
}


/**
 * Inserts the given element/HTML string at the beginning of the reference element.
 */
export function prepend (reference : Element, insert : InsertableElement) : void
{
    insertElement(
        reference,
        insert,
        "afterbegin",
        reference,
        reference.firstElementChild
    );
}


/**
 * Inserts the given element/HTML string just before the reference element.
 */
export function before (reference : Element, insert : InsertableElement) : void
{
    insertElement(
        reference,
        insert,
        "beforebegin",
        reference.parentElement,
        reference
    );
}


/**
 * Inserts the given element/HTML string just after the reference element.
 */
export function after (reference : Element, insert : InsertableElement) : void
{
    insertElement(
        reference,
        insert,
        "afterend",
        reference.parentElement,
        reference.nextElementSibling
    );
}
