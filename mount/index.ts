import {ComponentFactory, createElement, render} from "preact";
import {mojave} from "../@types/mojave";
import {find} from "../dom/traverse";
import {extend} from "../extend";
import {parseElementAsJson} from "../json";


/**
 * Mounts a Preact function or class component into all elements matching the given selector.
 */
export function mountJsx<TPreactComponent extends ComponentFactory<any>>(selector: string, mountable: TPreactComponent, options?: mojave.ComponentMountOptions<TPreactComponent>): void
{
    find(selector).forEach(node => doMountJsx<TPreactComponent>(node, mountable, options));
}


/**
 * Mounts the component lazily, if an element matching the selector exists.
 *
 * The importer must import the component.
 * Example:
 *
 *     mountLazy(".selector", () => import("./src/MyComp"));
 */
export function mountLazyJsx<TPreactComponent extends ComponentFactory<any>>(selector: string, importer: () => Promise<any>, options?: mojave.ComponentMountOptions<TPreactComponent>) : void
{
    let elements = find(selector);

    if (!elements.length)
    {
        return;
    }

    importer().then(
        module => {
            elements.forEach(element => {
                doMountJsx<TPreactComponent>(element, module.default, options);
            });
        },
        error => console.error(`Mounting of component of path '${selector}' failed: ${error.message}`, error)
    );
}


/**
 * Mounts a Preact function or class component
 */
function doMountJsx<TPreactComponent extends ComponentFactory<any>>(node: HTMLElement, mountable: TPreactComponent, options?: mojave.ComponentMountOptions<TPreactComponent>): void
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
export function mountClass<TStandaloneComponent extends mojave.MountableClass>(selector: string, mountable: TStandaloneComponent, options?: mojave.ClassMountOptions<TStandaloneComponent>): void
{
    find(selector).forEach(node => {
        doMountClass<TStandaloneComponent>(node, mountable, options);
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
export function mountLazyClass <TStandaloneComponent extends mojave.MountableClass>(selector: string, importer: () => Promise<any>, options?: mojave.ClassMountOptions<TStandaloneComponent>) : void
{
    let elements = find(selector);

    if (!elements.length)
    {
        return;
    }

    importer().then(
        module => {
            elements.forEach(element => {
                doMountClass<TStandaloneComponent>(element, module.default, options);
            });
        },
        error => console.error(`Mounting of component of path '${selector}' failed: ${error.message}`, error)
    );
}


/**
 * Mounts a StandaloneComponent
 */
function doMountClass<TStandaloneComponent extends mojave.MountableClass>(node: HTMLElement, mountable: TStandaloneComponent, options?: mojave.ClassMountOptions<TStandaloneComponent>): void
{
    options = options || {};
    const mounted = new mountable(node, ...(options.params || []));
    mounted.init();
}


/**
 * Mounts a function into all elements matching the given selector.
 */
export function mount<TFunction extends mojave.MountableFunction>(selector: string, mountable: TFunction, options?: mojave.FunctionMountOptions<TFunction>): void
{
    find(selector).forEach(node => {
        doMountFunction<TFunction>(node, mountable, options);
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
export function mountLazy <TFunction extends mojave.MountableFunction>(selector: string, importer: () => Promise<any>, options?: mojave.FunctionMountOptions<TFunction>) : void
{
    let elements = find(selector);

    if (!elements.length)
    {
        return;
    }

    importer().then(
        module => {
            elements.forEach(element => {
                doMountFunction<TFunction>(element, module.default, options);
            });
        },
        error => console.error(`Mounting of component of path '${selector}' failed: ${error.message}`, error)
    );
}


/**
 * Mounts a function
 */
function doMountFunction<TFunction extends mojave.MountableFunction>(node: HTMLElement, mountable: TFunction, options?: mojave.FunctionMountOptions<TFunction>): void
{
    options = options || {};
    mountable(node, ...(options.params || []));
}
