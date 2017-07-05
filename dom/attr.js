import {splitStringValue} from "./utils";

/**
 * Adds all given classes to the element
 *
 * @param {HTMLElement|HTMLElement[]} element
 * @param {string|string[]} classes
 */
export function addClass (element, classes)
{
    const list = Array.isArray(element) ? element : [element];
    const classList = splitStringValue(classes);

    for (let i = 0; i < list.length; i++)
    {
        for (let j = 0; j < classList.length; j++)
        {
            list[i].classList.add(classList[j]);
        }
    }
}


/**
 * Remove all given classes from the element
 *
 * @param {HTMLElement|HTMLElement[]} element
 * @param {string|string[]} classes
 */
export function removeClass (element, classes)
{
    const list = Array.isArray(element) ? element : [element];
    const classList = splitStringValue(classes);

    for (let i = 0; i < list.length; i++)
    {
        for (let j = 0; j < classList.length; j++)
        {
            list[i].classList.remove(classList[j]);
        }
    }
}
