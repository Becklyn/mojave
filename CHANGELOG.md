4.0
===

*   Added a new `mount()` function: support JSX, classes and functions. Also simplify the function interface.
*   Added a new `mountLazy()` function, that mirrors the `mount()` function, except that it loads the component lazily.
*   `mount*()` can now also mount functions.
*   Added `safeParseJson()` as a safe and easy way to parse JSON.


3.0.5
=====

*   **Bugfix**: fix and unify types of `create*Element()` 


3.0
===

* **BC BREAK**: removed `dom/form`. Inline the implementation instead.
* **BC BREAK**: removed `unistore`. Implement it yourself instead.
* **BC BREAK**: removed `index::mountJsxWithStore()`. No alternative present, you need to wrap it yourself.
* **BC BREAK**: The class `ui/Slug` is no longer a default export but instead a named export.


2.6 (unreleased)
----------------

* *Deprecation*: deprecated `dom/form`. Inline the implementation instead.
* *Deprecation*: deprecated `unistore`. Implement it yourself instead.
* *Deprecation*: deprecated `index::mountJsxWithStore()`. No alternative present, you need to wrap it yourself.
