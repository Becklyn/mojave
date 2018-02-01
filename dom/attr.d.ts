/**
 * Sets all attributes on the given element
 */
declare function setAttrs (
    element : HTMLElement,
    attributes : {[p: string]: string},
) : void;


/**
 * Returns the attribute value for the given html node
 */
declare function getAttr (
    element : HTMLElement,
    attribute : string,
) : string | null;


/**
 * Adds all given classes to the element
 */
declare function addClass (
    element: HTMLElement | Array<HTMLElement>,
    classes: string | Array<string>,
) : void;


/**
 * Remove all given classes from the element
 */
declare function removeClass (
    element: HTMLElement | Array<HTMLElement>,
    classes: string | Array<string>,
) : void;


/**
 * Sets the data on the given element
 */
declare function setData (
    element : HTMLElement,
    key : string,
    value : any,
) : void;


/**
 * Loads the data from the element
 */
declare function getData (
    element : HTMLElement,
    key : string,
) : any;
