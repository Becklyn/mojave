/**
 * Checks whether the given node is an HTMLElement
 *
 * @param {Node} node
 * @returns {boolean}
 */
export function isElement (node)
{
    return node.nodeType === Node.ELEMENT_NODE;
}


/**
 * Splits the string value by spaces
 *
 * @param {string | string[]} value
 * @returns {string[]}
 */
export function splitStringValue (value)
{
    if (Array.isArray(value))
    {
        return value;
    }

    return value === ""
        ? []
        : value.trim().split(/ +/);
}
