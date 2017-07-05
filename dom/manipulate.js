import {setAttrs} from "./attr";
import {setStyles} from "./css";


/**
 * Parses the HTML to an HTMLElement
 *
 * @param {string} html
 * @return {HTMLElement}
 */
function parseHtml (html)
{
    const doc = document.implementation.createHTMLDocument("");
    doc.body.innerHTML = html;
    const children = doc.body.children;

    if (children.length > 1)
    {
        throw new Error("Can't parse HTML with more than one root elements.");
    }

    return children[0];
}

/**
 * Creates an element with the given attributes
 *
 * @param {string} type
 * @param {{html: string, text: string, css: {}}|Object} attributes
 *
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
 * @param {HTMLElement|HTMLElement[]} element
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
 * @param {HTMLElement|HTMLElement[]} element
 */
export function empty (element)
{
    const list = Array.isArray(element) ? element : [element];

    for (let i = 0; i < list.length; i++)
    {
        list[i].innerHTML = "";
    }
}


/**
 * Replaces the given element with the replacement element
 *
 * @param {HTMLElement} element
 * @param {HTMLElement} replacement
 */
export function replace (element, replacement)
{
    element.parentNode.replaceChild(replacement, element);
}


/**
 * Inserts the given element(s)/HTML string at the given position.
 *
 * @private
 * @param {HTMLElement} reference                       The reference element from which the position is calculated.
 * @param {string|HTMLElement|HTMLElement[]} insert     The elements to insert. Can be an HTML string.
 * @param {string} adjacentPosition                     The argument for the .insertAdjacentHTML() call.
 * @param {Node} insertInto                      The parent element the item is inserted to.
 * @param {?Node} insertReference                The reference element for the .insertBefore() call.
 */
function insertElement (reference, insert, adjacentPosition, insertInto, insertReference) // eslint-disable-line max-params
{
    if (typeof insert === "string")
    {
        reference.insertAdjacentHTML(adjacentPosition, insert);
    }

    const list = Array.isArray(insert) ? insert : [insert];

    for (let i = 0; i < list.length; i++)
    {
        insertInto.insertBefore(list[i], insertReference);
    }
}

/**
 * Inserts the given element/HTML string at the end of the reference element.
 *
 * @param {HTMLElement} reference
 * @param {string|HTMLElement|HTMLElement[]} insert
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
 * @param {HTMLElement} reference
 * @param {string|HTMLElement|HTMLElement[]} insert
 */
export function prepend (reference, insert)
{
    insertElement(
        reference,
        insert,
        "afterbegin",
        reference,
        reference.firstChild
    );
}


/**
 * Inserts the given element/HTML string just before the reference element.
 *
 * @param {HTMLElement} reference
 * @param {string|HTMLElement|HTMLElement[]} insert
 */
export function before (reference, insert)
{
    insertElement(
        reference,
        insert,
        "afterbegin",
        reference.parentNode,
        reference
    );
}


/**
 * Inserts the given element/HTML string just after the reference element.
 *
 * @param {HTMLElement} reference
 * @param {string|HTMLElement|HTMLElement[]} insert
 */
export function after (reference, insert)
{
    insertElement(
        reference,
        insert,
        "afterend",
        reference.parentNode,
        reference.nextSibling
    );
}
