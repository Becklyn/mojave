import {ComponentFactory, createElement, render} from "preact";
import {mojave} from "../@types/mojave";
import {find} from "../dom/traverse";
import {extend} from "../extend";
import {parseElementAsJson} from "../json";


/**
 * Mounts a Preact function or class component into all elements matching the given selector.
 */
export function mountJsx<T extends ComponentFactory<any>>(selector: string, mountable: T, options?: mojave.ComponentMountOptions<T>): void
{
    find(selector).forEach(node => doMountJsx<T>(node, mountable, options));
}


/**
 * Mounts the component lazily, if an element matching the selector exists.
 *
 * The importer must import the component.
 * Example:
 *
 *     mountLazy(".selector", () => import("./src/MyComp"));
 */
export function mountLazyJsx<T extends ComponentFactory<any>>(selector: string, importer: () => Promise<any>, options?: mojave.ComponentMountOptions<T>) : void
{
    let elements = find(selector);

    if (!elements.length)
    {
        return;
    }

    importer().then(
        module => {
            elements.forEach(element => {
                doMountJsx<T>(element, module.default, options);
            });
        },
        error => console.error(`Mounting of component of path '${selector}' failed: ${error.message}`, error)
    );
}


/**
 * Mounts a Preact function or class component
 */
function doMountJsx<T extends ComponentFactory<any>>(node: HTMLElement, mountable: T, options?: mojave.ComponentMountOptions<T>): void
{
    options = options || {};
    let parent = node.parentElement;
    let params = (options.params || {});

    if (!parent)
    {
        console.error("Can't mount on container without parent.");
        return;
    }

    if (!options.hydrate)
    {
        // if the node should not be hydrated, try to use the content as JSON
        params = extend(params, parseElementAsJson(node) || {});

        // remove node before mount, so that we can ensure that preact doesn't reuse it.
        parent.removeChild(node);
    }

    // render
    render(
        createElement(mountable, params),
        parent,
        options.hydrate ? node : undefined
    );
}


/**
 * Mounts a StandaloneComponent into all elements matching the given selector.
 */
export function mountClass<T extends mojave.MountableClass>(selector: string, mountable: T, options?: mojave.ClassMountOptions<T>): void
{
    find(selector).forEach(node => {
        doMountClass<T>(node, mountable, options);
    });
}


/**
 * Mounts the component lazily, if an element matching the selector exists.
 *
 * The importer must import the component.
 * Example:
 *
 *     mountLazy(".selector", () => import("./src/MyComp"));
 */
export function mountLazyClass <T extends mojave.MountableClass>(selector: string, importer: () => Promise<any>, options?: mojave.ClassMountOptions<T>) : void
{
    let elements = find(selector);

    if (!elements.length)
    {
        return;
    }

    importer().then(
        module => {
            elements.forEach(element => {
                doMountClass<T>(element, module.default, options);
            });
        },
        error => console.error(`Mounting of component of path '${selector}' failed: ${error.message}`, error)
    );
}


/**
 * Mounts a StandaloneComponent
 */
function doMountClass<T extends mojave.MountableClass>(node: HTMLElement, mountable: T, options?: mojave.ClassMountOptions<T>): void
{
    options = options || {};
    const mounted = new mountable(node, ...(options.params || []));
    mounted.init();
}


/**
 * Mounts a function into all elements matching the given selector.
 */
export function mount<T extends mojave.MountableFunction>(selector: string, mountable: T, options?: mojave.FunctionMountOptions<T>): void
{
    find(selector).forEach(node => {
        doMountFunction<T>(node, mountable, options);
    });
}


/**
 * Mounts the component lazily, if an element matching the selector exists.
 *
 * The importer must import the component.
 * Example:
 *
 *     mountLazy(".selector", () => import("./src/MyComp"));
 */
export function mountLazy <T extends mojave.MountableFunction>(selector: string, importer: () => Promise<any>, options?: mojave.FunctionMountOptions<T>) : void
{
    let elements = find(selector);

    if (!elements.length)
    {
        return;
    }

    importer().then(
        module => {
            elements.forEach(element => {
                doMountFunction<T>(element, module.default, options);
            });
        },
        error => console.error(`Mounting of component of path '${selector}' failed: ${error.message}`, error)
    );
}


/**
 * Mounts a function
 */
function doMountFunction<T extends mojave.MountableFunction>(node: HTMLElement, mountable: T, options?: mojave.FunctionMountOptions<T>): void
{
    options = options || {};
    mountable(node, ...(options.params || []));
}
