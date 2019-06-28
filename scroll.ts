import {animate} from "./animation";


/**
 * Returns the scroll parent of the given node.
 *
 * If this returns null, the scroll parent is document.documentElement
 */
export function getScrollParent (node: Node|null) : HTMLElement|null
{
    if (!node || !(node instanceof Element))
    {
        return null;
    }

    const overflowY = window.getComputedStyle(node).overflowY || "";
    // is scrollable if value is neither visible nor hidden
    const isScrollable = (overflowY.indexOf('visible') + overflowY.indexOf('hidden')) === -2;

    if (isScrollable && node.scrollHeight >= node.clientHeight)
    {
        return node as HTMLElement;
    }

    return getScrollParent(node.parentNode);
}


/**
 * Scrolls to the given element
 */
export function scrollToElement (element: HTMLElement, inContainer?: HTMLElement) : void
{
    if (element.scrollIntoView)
    {
        element.scrollIntoView({behavior: "smooth"});
        return;
    }

    let scrollContainer = inContainer || getScrollParent(element) || document.documentElement;

    animate(scrollContainer, {
        scrollTop: element.offsetTop,
    });
}
