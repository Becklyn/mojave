const CUSTOM_PROPERTY_REGEX = /^--/;
const DEFAULT_STYLES = document.createElement("div").style;
const VENDOR_PREFIXES = ["Webkit", "Moz", "ms"];
const propertyNameCache = {};
// DOM properties that should NOT have "px" added when numeric
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;


/**
 * Returns the normalized (like vendor-prefixed) name of the given CSS property
 *
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

    const capitalized = property[0].toUpperCase() + property.slice(1);

    for (let i = 0; i < VENDOR_PREFIXES.length; i++)
    {
        const prefixedName = `${VENDOR_PREFIXES[i]}${capitalized}`;

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
export function setCss (elements, styles)
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

            // add "px" to all numbers of dimensional values
            const value = typeof styles[property] === "number" && false === IS_NON_DIMENSIONAL.test(property)
                ? `${styles[property]}px`
                : styles[property];

            if (CUSTOM_PROPERTY_REGEX.test(element))
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
