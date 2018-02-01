type Position = {
    top : number,
    left : number,
};


/**
 * Sets all styles on the element
 */
declare function setStyles (
    elements : HTMLElement | Array<HTMLElement>,
    styles: {[key : string]: string|number},
) : void;


/**
 * Returns the CSS property value for the given propery and element
 */
declare function getStyle (
    element : HTMLElement,
    property : string,
    pseudoElemen? : string,
) : string | number;


/**
 * Hides the given element(s)
 */
declare function hide (
    element : HTMLElement | Array<HTMLElement>,
) : void;


/**
 * Shows the given element(s)
 */
declare function show (
    element : HTMLElement | Array<HTMLElement>,
) : void;


/**
 * Returns the position of the element
 */
declare function position (
    element : HTMLElement,
) : Position;


/**
 * Returns the global offset of the element
 */
declare function offset (
    element : HTMLElement,
) : Position;
