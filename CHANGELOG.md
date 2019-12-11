3.1.5
=====

*   (bug) Automatically remove trailing hyphens from generated slug.


3.1.4
=====

*   **Bugfix**: fix automatic cookie secure setting


3.0.5
=====

*   **Bugfix**: fix and unify types of `create*Element()` 


3.0
===

* **BC BREAK**: removed `dom/form`. Inline the implementation instead.
* **BC BREAK**: removed `unistore`. Implement it yourself instead.
* **BC BREAK**: removed `mount::mountJsxWithStore()`. No alternative present, you need to wrap it yourself.
* **BC BREAK**: The class `ui/Slug` is no longer a default export but instead a named export.


2.6 (unreleased)
----------------

* *Deprecation*: deprecated `dom/form`. Inline the implementation instead.
* *Deprecation*: deprecated `unistore`. Implement it yourself instead.
* *Deprecation*: deprecated `mount::mountJsxWithStore()`. No alternative present, you need to wrap it yourself.
