interface CreateElementOptions {
    css? : {[key : string]: string|number},
    text? : string|number,
    html? : string|number,
    [p: string] : string|number,
}


/**
 * Creates an element with the given attributes
 */
declare function createElement (
    type : string,
    attributes? : CreateElementOptions,
) : HTMLElement;


/**
 * Removes the given element(s)
 */
export function remove (
    element : HTMLElement | Array<HTMLElement>,
) : void;


/**
 * Empties the given element(s)
 */
export function empty (
    element : HTMLElement | Array<HTMLElement>,
) : void;


/**
 * Replaces the given element with the replacement element
 */
export function replace (
    element : HTMLElement,
    replacement : HTMLElement,
) : void;


/**
 * Inserts the given element/HTML string at the end of the reference element.
 */
export function append (
    reference : HTMLElement,
    insert : string | HTMLElement | Array<HTMLElement>,
) : void;


/**
 * Inserts the given element/HTML string at the beginning of the reference element.
 */
export function prepend (
    reference : HTMLElement,
    insert : string | HTMLElement | Array<HTMLElement>,
) : void;


/**
 * Inserts the given element/HTML string just before the reference element.
 */
export function before (
    reference : HTMLElement,
    insert : string | HTMLElement | Array<HTMLElement>,
) : void;


/**
 * Inserts the given element/HTML string just after the reference element.
 */
export function after (
    reference : HTMLElement,
    insert : string | HTMLElement | Array<HTMLElement>,
) : void;
