/// <reference path="../mojave.d.ts" />

const CUSTOM_PROPERTY_REGEX = /^--/;
const DEFAULT_STYLES = document.createElement("div").style;
const VENDOR_PREFIXES = ["-webkit-", "-moz-", "-o-", "-ms-"];
const propertyNameCache = {};
// DOM properties that should NOT have "px" added when numeric
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
const DIRECTLY_ACCESSIBLE_SETTERS = /scroll(Top|Left)/i;
const HAS_PIXELS_UNIT = /px$/;


/**
 * Returns the normalized (like vendor-prefixed) name of the given CSS property
 *
 * @private
 */
function normalizeProperty (property : string) : string
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
        const prefixedName : string = `${VENDOR_PREFIXES[i]}${property}`;

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
 */
export function setStyles (elements : HTMLElement|HTMLElement[], styles : mojave.types.KeyMap) : void
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

            // don't transform custom properties
            if (CUSTOM_PROPERTY_REGEX.test(property))
            {
                style.setProperty(property, value);
                continue;
            }

            // add "px" to all numbers of dimensional values
            if (typeof styles[property] === "number" && false === IS_NON_DIMENSIONAL.test(property))
            {
                value += "px";
            }

            property = normalizeProperty(property);
            style[property] = value;
        }
    }
}


/**
 * Returns the computed styles for the given element
 *
 * @private
 */
function getComputedStyles (element : Element, pseudoElement : string = null) : CSSStyleDeclaration
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
 * Returns the CSS property value for the given property and element
 */
export function getStyle (element : HTMLElement, property : string, pseudoElement : string = null) : null|string|number
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


    if (value !== undefined && !IS_NON_DIMENSIONAL.test(property) && typeof value === "string" && HAS_PIXELS_UNIT.test(value))
    {
        return parseInt(value.replace(HAS_PIXELS_UNIT, ""), 10);
    }

    return value;
}


/**
 * Updates the display value of the given element
 *
 * @private
 */
function updateDisplay (element : HTMLElement|HTMLElement[], style : string) : void
{
    const list : HTMLElement[] = Array.isArray(element) ? element : [element];

    for (let i = 0; i < list.length; i++)
    {
        list[i].style.display = style;
    }
}


/**
 * Hides the given element(s)
 */
export function hide (element : HTMLElement|HTMLElement[]) : void
{
    updateDisplay(element, "none");
}


/**
 * Shows the given element(s)
 */
export function show (element : HTMLElement|HTMLElement[]) : void
{
    updateDisplay(element, "");
}


/**
 * Returns the position of the element
 */
export function position (element : HTMLElement) : {top: number, left: number}
{
    return {
        top: element.offsetTop,
        left: element.offsetLeft,
    };
}


/**
 * Returns the global offset of the element
 */
export function offset (element : HTMLElement) : {top: number, left: number}
{
    const rect = element.getBoundingClientRect();

    return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft,
    };
}
