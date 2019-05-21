/**
 * Polyfill for Element.matches
 *
 * https://developer.mozilla.org/de/docs/Web/API/Element/matches
 */
if (!Element.prototype.matches) {
    const elementPrototype = Element.prototype as any;

    Element.prototype.matches =
        elementPrototype.msMatchesSelector ||
        elementPrototype.webkitMatchesSelector;
}
