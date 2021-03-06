import {ComponentFactory, createElement, render} from "preact";
import {mojave} from "../@types/mojave";
import {find} from "../dom/traverse";
import {extend} from "../extend";
import {parseElementAsJson} from "../json";
import {createUnstyledElement} from "../dom/manipulate";
import {Tuple} from "ts-toolbelt";


/**
 * Mounts a Preact function or class component into all elements matching the given selector.
 */
export function mountJsxAndWrap<TPreactComponent extends ComponentFactory<any>>(selector: string|HTMLElement[], mountable: TPreactComponent, options?: mojave.ComponentMountOptions<TPreactComponent>): void
{
    let elements = typeof selector === "string" ? find(selector) : selector;

    elements.forEach(node => {
        const parent = node.parentElement;
        const componentContainer = createUnstyledElement("div", {
            class: "component-container",
        });

        if (null !== parent)
        {
            parent.insertBefore(componentContainer, node.nextSibling);
            componentContainer.appendChild(node);

            doMountJsx<TPreactComponent>(node, mountable, options);
        }
    });
}


/**
 * Mounts a Preact function or class component into all elements matching the given selector.
 */
export function mountJsx<TPreactComponent extends ComponentFactory<any>>(selector: string|HTMLElement[], mountable: TPreactComponent, options?: mojave.ComponentMountOptions<TPreactComponent>): void
{
    let elements = typeof selector === "string" ? find(selector) : selector;

    elements.forEach(node => {
        doMountJsx<TPreactComponent>(node, mountable, options);
    });
}


/**
 * Mounts the component lazily, if an element matching the selector exists.
 *
 * The importer must import the component.
 * Example:
 *
 *     mountLazyJsx<MyPreactComp>(".selector", () => import("./src/MyPreactComp"));
 */
export function mountLazyJsx<TPreactComponent extends ComponentFactory<any>>(selector: string|HTMLElement[], importer: () => Promise<any>, options?: mojave.ComponentMountOptions<TPreactComponent>) : void
{
    let elements = typeof selector === "string" ? find(selector) : selector;

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
export function mountClass<TStandaloneComponent extends mojave.MountableClass>(selector: string|HTMLElement[], mountable: TStandaloneComponent, options?: mojave.ClassMountOptions<TStandaloneComponent>): void
{
    let elements = typeof selector === "string" ? find(selector) : selector;

    elements.forEach(node => {
        doMountClass<TStandaloneComponent>(node, mountable, options);
    });
}


/**
 * Mounts the component lazily, if an element matching the selector exists.
 *
 * The importer must import the component.
 * Example:
 *
 *     mountLazyClass<MyStandaloneComp>(".selector", () => import("./src/MyStandaloneComp"));
 */
export function mountLazyClass <TStandaloneComponent extends mojave.MountableClass>(selector: string|HTMLElement[], importer: () => Promise<any>, options?: mojave.ClassMountOptions<TStandaloneComponent>) : void
{
    let elements = typeof selector === "string" ? find(selector) : selector;

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
export function mount<TFunction extends mojave.MountableFunction>(selector: string|HTMLElement[], mountable: TFunction, options?: mojave.FunctionMountOptions<TFunction>): void
{
    let elements = typeof selector === "string" ? find(selector) : selector;

    elements.forEach(node => {
        doMountFunction<TFunction>(node, mountable, options);
    });
}


/**
 * Mounts the component lazily, if an element matching the selector exists.
 *
 * The importer must import the component.
 * Example:
 *
 *     mountLazy<MyFunctionComp>(".selector", () => import("./src/MyFunctionComp"));
 */
export function mountLazy <TFunction extends mojave.MountableFunction>(selector: string|HTMLElement[], importer: () => Promise<any>, options?: mojave.FunctionMountOptions<TFunction>) : void
{
    let elements = typeof selector === "string" ? find(selector) : selector;

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


/**
 * Mounts a function into all elements matching the given selector.
 *
 * The selector is expected to match `<script type="application/json">{…}</script>` elements,
 * which will parse its content and pass in as a parameter to the functional component.
 */
export function mountDataContainer<TFunction extends mojave.MountableDataContainerFunction | mojave.MountableDataContainerAsyncFunction>(
    selector: string|HTMLElement[],
    mountable: TFunction,
    options?: mojave.FunctionDataContainerMountOptions<TFunction>
) : void
{
    let elements = typeof selector === "string" ? find(selector) : selector;

    elements.forEach(node => {
        doMountDataContainerFunction<TFunction>(node, mountable, options);
    });
}


/**
 * Mounts the component lazily, if an element matching the selector exists.
 *
 * The importer must import the component.
 * Example:
 *
 *     mountLazyDataContainer<MyFunctionComp>(".selector", () => import("./src/MyFunctionComp"));
 */
export function mountLazyDataContainer <TFunction extends mojave.MountableDataContainerFunction | mojave.MountableDataContainerAsyncFunction>(
    selector: string|HTMLElement[],
    importer: () => Promise<any>,
    options?: mojave.FunctionDataContainerMountOptions<TFunction>
) : void
{
    let elements = typeof selector === "string" ? find(selector) : selector;

    if (!elements.length)
    {
        return;
    }

    importer().then(
        module => elements.forEach(element => doMountDataContainerFunction<TFunction>(element, module.default, options)),
        error => console.error(`Mounting of component of path '${selector}' failed: ${error.message}`, error)
    );
}


/**
 * Mounts a function on a data container.
 */
function doMountDataContainerFunction<TFunction extends mojave.MountableDataContainerFunction | mojave.MountableDataContainerAsyncFunction>(
    node: HTMLElement,
    mountable: TFunction,
    options?: mojave.FunctionDataContainerMountOptions<TFunction>
) : void
{
    let parent = node.parentElement;

    if (!parent)
    {
        console.error("Can't mount on container without parent.");
        return;
    }

    options = options || {};
    const params = (options.params || []) as Tuple.Drop<Parameters<TFunction>, "1", "->">;
    const parsedMountableConfig =  (parseElementAsJson(node) || {}) as Tuple.Take<Parameters<TFunction>, "1", "->">

    params.unshift(parsedMountableConfig);

    parent.removeChild(node);
    mountable(...params);
}
