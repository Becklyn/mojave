const CUSTOM_PROPERTY_REGEX = /^--/;
const DEFAULT_STYLES = document.createElement("div").style;
const VENDOR_PREFIXES = ["-webkit-", "-moz-", "-o-", "-ms-"];
const propertyNameCache = {};
// DOM properties that should NOT have "px" added when numeric
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
const DIRECTLY_ACCESSIBLE_SETTERS = /scroll(Top|Left)/i;


/**
 * Returns the normalized (like vendor-prefixed) name of the given CSS property
 *
 * @private
 * @param {string} property
 * @return {string}
 */
function normalizeProperty (property)
{
    if (propertyNameCache[property])
    {
        return propertyNameCache[property];
    }

    // if the property already exists, just use it
    if (property in DEFAULT_STYLES)
    {
        return property;
    }

    for (let i = 0; i < VENDOR_PREFIXES.length; i++)
    {
        const prefixedName = `${VENDOR_PREFIXES[i]}${property}`;

        if (prefixedName in DEFAULT_STYLES)
        {
            propertyNameCache[property] = prefixedName;
            return prefixedName;
        }
    }

    propertyNameCache[property] = property;
    return property;
}


/**
 * Sets all styles on the element
 *
 * @param {HTMLElement|HTMLElement[]} elements
 * @param {Object} styles
 */
export function setStyles (elements, styles)
{
    elements = Array.isArray(elements) ? elements : [elements];

    for (let i = 0; i < elements.length; i++)
    {
        const element = elements[i];
        const style = element.style;

        for (let property in styles)
        {
            if (!styles.hasOwnProperty(property))
            {
                continue;
            }

            let value = styles[property];

            // handle directly accessible setters
            if (DIRECTLY_ACCESSIBLE_SETTERS.test(property))
            {
                element[property] = value;
                continue;
            }

            // add "px" to all numbers of dimensional values
            if (typeof styles[property] === "number" && false === IS_NON_DIMENSIONAL.test(property))
            {
                value += "px";
            }

            if (CUSTOM_PROPERTY_REGEX.test(property))
            {
                style.setProperty(property, value);
            }
            else
            {
                property = normalizeProperty(property);
                style[property] = value;
            }
        }
    }
}


/**
 * Returns the computed styles for the given element
 *
 * @param {HTMLElement} element
 * @param {?string} pseudoElement
 * @return {CssStyle}
 */
function getComputedStyles (element, pseudoElement)
{
    // @legacy IE <= 11
    // IE throws on elements created in popups
    let view = element.ownerDocument.defaultView;

    if (!view || !view.opener)
    {
        view = window;
    }

    return view.getComputedStyle(element, pseudoElement);
}


/**
 * Returns the CSS property value for the given propery and element
 *
 * @param {HTMLElement} element
 * @param {string} property
 * @param {?string} pseudoElement
 * @return {string}
 */
export function getStyle (element, property, pseudoElement = null)
{
    if (DIRECTLY_ACCESSIBLE_SETTERS.test(property))
    {
        return element[property];
    }

    if (!CUSTOM_PROPERTY_REGEX.test(property))
    {
        property = normalizeProperty(property);
    }

    const styles = getComputedStyles(element, pseudoElement);
    // getPropertyValue is needed for:
    //   getStyle(el, '--customProperty')
    const value = styles.getPropertyValue(property) || styles[property];

    // always return a value for opacity, the default is "1"
    if ("opacity" === property)
    {
        return value === "" ? "1" : value;
    }

    return value !== undefined
        ? value + ""
        : value;
}


/**
 * Updates the display value of the given element
 *
 * @private
 * @param {HTMLElement|HTMLElement[]} element
 * @param {string} style
 */
function updateDisplay (element, style)
{
    const list = Array.isArray(element) ? element : [element];

    for (let i = 0; i < list.length; i++)
    {
        list[i].style.display = style;
    }
}

/**
 * Hides the given element(s)
 *
 * @param {HTMLElement|HTMLElement[]} element
 */
export function hide (element)
{
    updateDisplay(element, "none");
}


/**
 * Hides the given element(s)
 *
 * @param {HTMLElement|HTMLElement[]} element
 */
export function show (element)
{
    updateDisplay(element, "");
}


/**
 * Returns the position of the element
 *
 * @param {HTMLElement} element
 * @return {{top: number, left: number}}
 */
export function position (element)
{
    return {
        top: element.offsetTop,
        left: element.offsetLeft,
    };
}


/**
 * Returns the global offset of the element
 *
 * @param {HTMLElement} element
 * @return {{top: number, left: number}}
 */
export function offset (element)
{
    const rect = element.getBoundingClientRect();

    return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft,
    };
}
