/**
 * Checks whether the given node is an HTMLElement
 */
export function isElement (node : Node) : boolean
{
    return node.nodeType === Node.ELEMENT_NODE;
}


/**
 * Splits the string value by spaces
 */
export function splitStringValue (value : string|string[]) : string[]
{
    if (Array.isArray(value))
    {
        return value;
    }

    return value === ""
        ? []
        : value.trim().split(/ +/);
}
