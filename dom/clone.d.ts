/**
 * Duplicates the given DOM node
 */
declare function duplicate (
    element : HTMLElement,
) : HTMLElement;


/**
 * Clones the given node, that includes duplicating the node and copying
 * all data and events.
 */
declare function clone (
    element : HTMLElement,
) : HTMLElement;
