const CUSTOM_PROPERTY_REGEX = /^--/;
const DEFAULT_STYLES = document.createElement("div").style;
const PREFIXES = ["Webkit", "Moz", "ms"];


/**
 * Returns the vendor prefixed name of the given CSS property
 *
 * @param {string} name
 * @return {string}
 */
function prefixedName (name)
{
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
            return prefixedName;
        }
    }

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

            if (CUSTOM_PROPERTY_REGEX.test(element))
            {
                style.setProperty(key, styles[key]);
            }
            else
            {
                key = prefixedName(key);
                style[key] = styles[key];
            }
        }
    }
}
