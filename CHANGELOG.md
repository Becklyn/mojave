5.10.0
======

*   (feature) Add `useLiveRef()` hook.


5.9.4
=====

*   (improvement) Add `_mojave-dragged-item` class on dragged item in sortable.
*   (improvement) Add option to disable sortable hook easily (default is still "enabled").
*   (bug) Warn when mounting a sortable directly on a table.
*   (improvement) Improve properties reset in sortable items.


5.9.3
=====

*   (improvement) Fix export of return type of `initDismissableContainer()`.


5.9.2
=====

*   (improvement) Export return type of `initDismissableContainer()`.


5.9.1
=====

*   (improvement) Add `destroy` option in return value for `initDismissableContainer()`.
*   (improvement) Removed overly pedantic use of `hasOwnProperty()`.


5.9.0
=====

*   (bug) Add missing hook dependency.
*   (feature) Added `toStringArray`.


5.8.2
=====

*   (bug) Properly reset `z-index` in Sortable after drag.


5.8.1
=====

*   (bug) Fix `getCookie()` method to read a cookie string set with `formatCookieString()`.
*   (internal) A test for `getCookie()` has been added.


5.8.0
=====

*   (feature) Add sameSite option to `formatCookieString()` and `setCookie()`. Additionally `{sameSite: "strict"}` is set as a default. Other possible values include `"lax"` and `null`. `null` will hinder the `sameSite` attribute of being set in a cookie.
*   (feature) Add support for passing in multiple classes to `toggleClass`.


5.7.1
=====

*   (bug) Automatically remove trailing hyphens from generated slug.


5.7.0
=====

*   (feature) Allow passing in `HTMLElement[]` instead of a CSS selector into all `mount*` versions to directly mount on specific elements.
*   (improvement) Return the `item` + `before` in the `Sortable` result (to integrate with the new RAD bundle).
*   (improvement) Added `Sortable::destroy()`.
*   (feature) Added `useSortable()` hook.


5.6.0
=====

*   Use better default types + simplify implementation in `json`
*   Added `storeInLocalStorage()` and `fetchFromLocalStorage()`.


5.5.4
=====

*   `classes()` is now variadic and can also take string arguments. Also any truthy/falsy values are now supported in objects.
*   Allow passing `null` as element to `parseElementAsJson()`


5.5.3
=====

*   `popup-interaction::initDismissableContainer()` now returns the close function. This way you can wire up your own close buttons, so 
    that they are handled correctly.
*   `popup-interaction::initDismissableContainer()` can now handle multiple opener triggers.


5.5.2
=====

*   Improve variable name


5.5.1
=====

*   `ts-toolbelt` is a required dependency.


5.5.0
=====

(parallel release to `4.6.0`)

*   Added more date formatter functions: `formatDateTime()` and `formatDateTime()`.
*   Added a localized `DateFormatter`.


5.4.0
=====

*   Added `popup-interaction::initDismissableContainer()` and `popup-interaction::registerBodyClickHandler()`.


5.3.0
=====

*   Add missing export for type `MediaQueryMatcher`.
*   Added first Preact hook: `useMediaQueryMatcher(mediaQueryMatcher)`.


5.2.0
=====

*   Added `dom/wire/wireSourceTargetLists()`
*   Added `mediaQueryMatcher()` as a for attaching event listeners to `window.matchMedia()` without checking for the existence of `addListener()` or `addEventListener()` yourself.
*   Added `storage/local-storage::persistedToggle`


5.1.1
=====

*   If `params` are set in `mountJsx`, they only need to be a partial set of the props of the component now (as the rest can come from the mounted JSON container).


5.1.0
=====

*   Added `onOff` for easy event use in (preact) hooks.


5.0.0
=====

*   Split `mount` into three methods:
    *   `mount` for mounting `function`s
    *   `mountClass` for mounting `StandaloneComponent`s
    *   `mountJsx` for mounting Preact components (functional and class)
*   Split `mountLazy` into three methods:
    *   `mountLazy` for mounting `function`s
    *   `mountLazyClass` for mounting `StandaloneComponent`s
    *   `mountLazyJsx` for mounting Preact components (functional and class)
*   Removed `{ type: "func"|"class"|"jsx" }` property from derived `mojave.MountOptions`s.
*   `mojave.MountOptions`'s specific implementations have been updated to add support for automatic parameter inference:
    *   `mojave.ClassMountOptions` has been made generic: `mojave.ClassMountOptions<TClass extends mojave.MountableClass>`
    *   `mojave.FunctionMountOptions` has been made generic: `mojave.FunctionMountOptions<TFunction extends mojave.MountableFunction>`
    *   `mojave.ComponentMountOptions` has been made generic: `mojave.ComponentMountOptions<TComponent extends ComponentClass<any> | FunctionComponent<any>>`
*   Fixed broken automatic secure setting for cookies 


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
