const CUSTOM_PROPERTY_REGEX = /^--/;
const DEFAULT_STYLES = document.createElement("div").style;
const PREFIXES = ["Webkit", "Moz", "ms"];
const propertyNameCache = {};
// DOM properties that should NOT have "px" added when numeric
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;


/**
 * Returns the normalized (like vendor-prefixed) name of the given CSS property
 *
 * @param {string} name
 * @return {string}
 */
function normalizeName (name)
{
    if (propertyNameCache[name])
    {
        return propertyNameCache[name];
    }

    // if the property already exists, just use it
    if (name in DEFAULT_STYLES)
    {
        return name;
    }

    const capitalizedName = name[0].toUpperCase() + name.slice(1);

    for (let i = 0; i < PREFIXES.length; i++)
    {
        const prefixedName = `${PREFIXES[i]}${capitalizedName}`;

        if (prefixedName in DEFAULT_STYLES)
        {
            propertyNameCache[name] = prefixedName;
            return prefixedName;
        }
    }

    propertyNameCache[name] = name;
    return name;
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

        for (let key in styles)
        {
            if (!styles.hasOwnProperty(key))
            {
                continue;
            }

            // add "px" to all numbers of dimensional values
            const value = typeof styles[key] === "number" && false === IS_NON_DIMENSIONAL.test(key)
                ? `${styles[key]}px`
                : styles[key];

            if (CUSTOM_PROPERTY_REGEX.test(element))
            {
                style.setProperty(key, value);
            }
            else
            {
                key = normalizeName(key);
                style[key] = value;
            }
        }
    }
}
