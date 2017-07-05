/**
 * Checks whether the given node is an HTMLElement
 *
 * @param {Node} node
 * @return {boolean}
 */
export function isElement (node)
{
    return node.nodeType === Node.ELEMENT_NODE;
}
