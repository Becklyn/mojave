import {setCss} from "./css";

/**
 * Creates an element with the given attributes
 *
 * @param {string} type
 * @param {{html: string, text: string, css: {}}|Object} attributes
 */
export function createElement (type, attributes = {})
{
    const element = document.createElement(type);
    setAttrs(element, attributes);

    if (typeof attributes.css !== "undefined")
    {
        setCss(element, attributes.css);
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
    Object.keys(attributes).forEach(
        (key) => {
            const value = attributes[key];

            if (/^(html|text|css)$/.test(key))
            {
                return;
            }

            if (value === null || value === false)
            {
                element.removeAttribute(key);
            }
            else
            {
                element.setAttribute(key, attributes[key]);
            }
        }
    );
}

