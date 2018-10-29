/**
 * Returns the position of the mouse event relative to the given element
 */
export function getRelativeEventPosition (event : MouseEvent, element : HTMLElement) : {left: number, top: number}
{
    const rect = element.getBoundingClientRect();

    return {
        left: event.clientX - rect.left,
        top: event.clientY - rect.top,
    };
}
