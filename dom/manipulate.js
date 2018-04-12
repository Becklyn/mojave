import {isElement} from "./utils";
import {setAttrs} from "./attr";
import {setStyles} from "./css";


/**
 * Parses the HTML to an HTMLElement
 *
 * @private
 * @param {string} html
 * @returns {HTMLElement}
 */
function parseHtml (html)
{
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const children = doc.body.children;

    if (children.length !== 1)
    {
        throw new Error("Can only parse HTML with exactly one valid root element. A valid element can stand on its own in the body.");
    }

    return children[0];
}


/**
 * Creates an element with the given attributes
 *
 * @param {string} type
 * @param {mojave.types.CreateElementOptions} [attributes]
 * @returns {HTMLElement}
 */
export function createElement (type, attributes = {})
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
 *
 * @param {Element | Element[] | null} element
 */
export function remove (element)
{
    if (null === element)
    {
        return;
    }

    const list = Array.isArray(element) ? element : [element];

    for (let i = 0; i < list.length; i++)
    {
        list[i].parentNode.removeChild(list[i]);
    }
}


/**
 * Empties the given element(s)
 *
 * @param {Element | Element[]} element
 */
export function empty (element)
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
 *
 * @param {Element} element
 * @param {Element} replacement
 */
export function replace (element, replacement)
{
    element.parentNode.replaceChild(replacement, element);
}


/**
 * Inserts the given element(s)/HTML string at the given position.
 *
 * @private
 * @param {Element} reference
 * @param {mojave.types.InsertableElement} insert
 * @param {InsertPosition} adjacentPosition
 * @param {Element} insertInto
 * @param {Element | null} insertReference
 */
function insertElement (reference, insert, adjacentPosition, insertInto, insertReference) // eslint-disable-line max-params
{
    // if element to insert is string
    if (typeof insert === "string")
    {
        reference.insertAdjacentHTML(adjacentPosition, insert);
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
 *
 * @param {Element} reference
 * @param {mojave.types.InsertableElement} insert
 */
export function append (reference, insert)
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
 *
 * @param {Element} reference
 * @param {mojave.types.InsertableElement} insert
 */
export function prepend (reference, insert)
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
 *
 * @param {Element} reference
 * @param {mojave.types.InsertableElement} insert
 */
export function before (reference, insert)
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
 *
 * @param {Element} reference
 * @param {mojave.types.InsertableElement} insert
 */
export function after (reference, insert)
{
    insertElement(
        reference,
        insert,
        "afterend",
        reference.parentElement,
        reference.nextElementSibling
    );
}
