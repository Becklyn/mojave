4.0
===

*   **Dropped IE 10 support.**
*   Removed functions: `getData()`, `setData()`, `getAttr()`, `addClass()` and `removeClass()`
*   Removed the old `mount()` function.
*   Added a new `mount()` function: support JSX, classes and functions. Also simplify the function interface.
*   Added a new `mountLazy()` function, that mirrors the `mount()` function, except that it loads the component lazily.
*   `mount*()` can now also mount functions.
*   Added `safeParseJson()` as a safe and easy way to parse JSON.
*   `preact` was bumped to 10.x



3.0
===

*   Fix and unify types of `create*Element()` 
*   Removed `dom/form`. Inline the implementation instead.
*   Removed `unistore`. Implement it yourself instead.
*   Removed `index::mountJsxWithStore()`. No alternative present, you need to wrap it yourself.
*   The class `ui/Slug` is no longer a default export but instead a named export.


2.6 (unreleased)
----------------

*   Deprecated `dom/form`. Inline the implementation instead.
*   Deprecated `unistore`. Implement it yourself instead.
*   Deprecated `index::mountJsxWithStore()`. No alternative present, you need to wrap it yourself.
