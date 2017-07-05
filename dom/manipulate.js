import {setStyles} from "./css";

const SPECIAL_ATTRIBUTE_SETTERS = /^(html|text|css)$/;

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
    const element = document.createElement(type);
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
 * Removes the given element(s)
 *
 * @param {HTMLElement|HTMLElement[]} element
 */
export function remove (element)
{
    const list = Array.isArray(element) ? element : [element];

    for (let i = 0; i < list.length; i++)
    {
        list[i].parentNode.removeChild(list[i]);
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
function insertElement (reference, insert, adjacentPosition, insertInto, insertReference)
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
