4.6.1
=====

*   (bug) Use `MouseEvent.target` instead of `MouseEvent.toElement` in `Sortable`
*   (bug) Automatically remove trailing hyphens from generated slug.


4.6.0
=====

*   Added more date formatter functions: `formatDateTime()` and `formatDateTime()`.
*   Added a localized `DateFormatter`.


4.5.2
=====

*   Fixed broken enum check in `isStatusFailure()`.


4.5.1
=====

*   Only show error in `initFromGlobalData()` if the element is not missing, but has an invalid structure. Ignore missing keys.


4.5.0
=====

*   Consistently use mojave's own `hasOwnProperty()` in all of mojave's functions.
*   Added `inNextFrame()` timing function.


4.4.1
=====

*   Return initializer from `initFromGlobalData()`.


4.4.0
=====

*   Added `initFromGlobalData()`.
*   Added `toggleClass()`.


4.3.0
=====

*   Added `isChildElement()`.
*   Added `scrollToElement()`.
*   Improved the return types of `request()`. Also several type guard helper functions were added, to more easily handle failed requests.


4.2.0
=====

*   Added `parseElementAsJson()` that automatically parses JSON from the content of a node and removes HTML escaping.
*   Added `getScrollParent()`, that fetches a scrollable parent of an element.
*   Added `onNextAnimationFrame()`.


4.1.0
=====

*   Added new function `hasOwnProperty()`.
*   Added a new `hydrate` option when mounting JSX components. It decides whether 
    *   `hydrate: false/undefined` -> the body is parsed as JSON (and passed as props) and the mounting node is removed
    *   `hydrate: true` -> the mounting node is left untouched and preact mounts on this node (if possible). The content is *not* parsed as JSON.


4.0.0
=====

*   **Dropped IE 10 support.**
*   Removed functions: `getData()`, `setData()`, `getAttr()`, `addClass()` and `removeClass()`
*   Removed the old `mount()` function.
*   Added a new `mount()` function: support JSX, classes and functions. Also simplify the function interface.
*   Added a new `mountLazy()` function, that mirrors the `mount()` function, except that it loads the component lazily.
*   `mount*()` can now also mount functions.
*   Added `safeParseJson()` as a safe and easy way to parse JSON.
*   `preact` was bumped to 10.x


3.0.0
=====

*   Fix and unify types of `create*Element()` 
*   Removed `dom/form`. Inline the implementation instead.
*   Removed `unistore`. Implement it yourself instead.
*   Removed `index::mountJsxWithStore()`. No alternative present, you need to wrap it yourself.
*   The class `ui/Slug` is no longer a default export but instead a named export.


2.6.0
=====

*   Deprecated `dom/form`. Inline the implementation instead.
*   Deprecated `unistore`. Implement it yourself instead.
*   Deprecated `index::mountJsxWithStore()`. No alternative present, you need to wrap it yourself.
