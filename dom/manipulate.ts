import {isElement} from "./utils";
import {setAttrs} from "./attr";
import {setStyles} from "./css";
import {mojave as types} from "../global-types";


/**
 * Parses the HTML to an HTMLElement
 *
 * @private
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
export function createElement (type : string, attributes : types.CreateElementOptions = {}) : HTMLElement
{
    const element = (-1 !== type.indexOf("<"))
        ? parseHtml(type)
        : document.createElement(type);

    setAttrs(element, attributes);

    if (typeof attributes.css !== "undefined")
    {
        setStyles(element, attributes.css);
    }

    if (typeof attributes.text !== "undefined")
    {
        element.textContent = attributes.text;
    }
    else if (typeof attributes.html !== "undefined")
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

    const list : Element[] = Array.isArray(element) ? element : [element];

    for (let i = 0; i < list.length; i++)
    {
        list[i].parentNode.removeChild(list[i]);
    }
}


/**
 * Empties the given element(s)
 */
export function empty (element : Element|Element[]) : void
{
    const list : Element[] = Array.isArray(element) ? element : [element];

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
    element.parentNode.replaceChild(replacement, element);
}


/**
 * Inserts the given element(s)/HTML string at the given position.
 *
 * @private
 */
function insertElement (
    reference : Element,
    insert : mojave.InsertableElement,
    adjacentPosition : InsertPosition,
    insertInto : Element,
    insertReference : Element | null
) : void // eslint-disable-line max-params
{
    // if element to insert is string
    if (typeof insert === "string")
    {
        reference.insertAdjacentHTML(adjacentPosition, insert);
        return;
    }

    // if element to insert is HTMLElement or HTMLElement[]
    const list : Element[] = Array.isArray(insert) ? insert : [insert];

    for (let i = 0; i < list.length; i++)
    {
        insertInto.insertBefore(list[i], insertReference);
    }
}


/**
 * Inserts the given element/HTML string at the end of the reference element.
 */
export function append (reference : Element, insert : mojave.InsertableElement) : void
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
export function prepend (reference : Element, insert : mojave.InsertableElement) : void
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
export function before (reference : Element, insert : mojave.InsertableElement) : void
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
export function after (reference : Element, insert : mojave.InsertableElement) : void
{
    insertElement(
        reference,
        insert,
        "afterend",
        reference.parentElement,
        reference.nextElementSibling
    );
}
