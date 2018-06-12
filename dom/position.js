/**
 * Returns the position of the mouse event relative to the given element
 *
 * @param {MouseEvent} event
 * @param {HTMLElement} element
 * @returns {{left: number, top: number}}
 */
export function getRelativeEventPosition (event, element)
{
    const rect = element.getBoundingClientRect();

    return {
        left: event.clientX - rect.left,
        top: event.clientY - rect.top,
    };
}
