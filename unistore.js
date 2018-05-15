const SELECTOR_MATCHER = /^((.+?)\s*:\s*)?(.+)$/;


/**
 * Returns an accessor for usage in unistore state to props mapping.
 *
 * Supported:
 *  - separate selectors via comma
 *  - the name of the property in the result object is the last key
 *  - properties can be aliased with a `alias:` prefix
 *  - all whitespace is stripped from the selector
 *  - name clashes will always return the last matched entry
 *
 * @param {string|Array} selector
 * @returns {function(object):object}
 */
export function get (selector)
{
    // if the function is used as template function, an array is the first parameter
    selector = Array.isArray(selector) ? selector[0] : selector;
    // strip all whitespace from the selector
    selector = selector.replace(/\s+/g, "");
    const mapping = {};

    selector.split(/,+/).forEach(
        (segment) =>
        {
            const match = SELECTOR_MATCHER.exec(segment.trim());
            const path = match[3].split(".");
            const name = match[2] || path[path.length - 1];

            mapping[name] = path;
        }
    );

    return (state) => {
        const props = {};

        for (const name in mapping)
        {
            if (mapping.hasOwnProperty(name))
            {
                props[name] = fetchBySelectors(state, mapping[name]);
            }
        }

        return props;
    };
}


/**
 * Fetches the value from an object
 *
 * @param {Object} value
 * @param {Array} selectorList
 * @returns {function(object):object}
 */
function fetchBySelectors (value, selectorList)
{
    for (let i = 0; i < selectorList.length; i++)
    {
        const selector = selectorList[i];

        if (typeof value !== "object" || value[selector] === undefined)
        {
            return null;
        }

        value = value[selector];
    }

    return value;
}
