4.x to 5.0
==========

* `mount` has been split into three methods:
    * `mount` for mounting functions
    * `mountClass` for mounting `StandaloneComponent`s
    * `mountJsx` for mounting Preact components (functional and class)
* Corresponding to the changes in `mount`, we had to change the mounting option types to add support for automatic parameter inference:
    * `mojave.ClassMountOptions` has been made generic: `mojave.ClassMountOptions<T extends mojave.MountableClass>`
    * `mojave.FunctionMountOptions` has been made generic: `mojave.FunctionMountOptions<T extends mojave.MountableFunction>`
    * `mojave.ComponentMountOptions` has been made generic: `mojave.ComponentMountOptions<T extends ComponentClass<any> | FunctionComponent<any>>`



3.x to 4.0
==========

*   **IE 10 support was dropped.** 
*   The previous `mount()` and `mountJsx()` were removed and replaced with a new `mount()`.
*   `getData(element)` and `setData(element)` were removed. Use `element.dataset` directly instead.
*   `getAttr(element)` was removed. Use `element.getAttribute()` directly instead.
*   `addClass()` and `removeClass()` were removed. Use `element.classList` directly instead.
*   `preact` was bumped to 10.x
