3.x to 4.0
==========

*   **IE 10 support was dropped.** 
*   The previous `mount()` and `mountJsx()` were removed and replaced with a new `mount()`.
*   `getData(element)` and `setData(element)` were removed. Use `element.dataset` directly instead.
*   `getAttr(element)` was removed. Use `element.getAttribute()` directly instead.
*   `addClass()` and `removeClass()` were removed. Use `element.classList` directly instead.
*   `preact` was bumped to 10.x
