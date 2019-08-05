import {Component, ComponentFactory, ComponentType, createElement, JSX, render} from "preact";
import {mojave} from "../@types/mojave";
import {find} from "../dom/traverse";
import {extend} from "../extend";
import {parseElementAsJson} from "../json";


/**
 * Mounts a Preact function or class component into all elements matching the given selector.
 */
export function mountJsx<T extends ComponentFactory<any>>(selector: string, mountable: T, options?: mojave.ComponentMountOptions<T>): void
{
    doMount(find(selector), mountable, options);
}


/**
 * Mounts a StandaloneComponent into all elements matching the given selector.
 */
export function mountClass<T extends mojave.MountableClass>(selector: string, mountable: T, options?: mojave.ClassMountOptions<T>): void
{
    doMount(find(selector), mountable, options);
}


/**
 * Mounts a function into all elements matching the given selector.
 */
export function mount<T extends mojave.MountableFunction>(selector: string, mountable: T, options?: mojave.FunctionMountOptions<T>): void
{
    doMount(find(selector), mountable, options);
}


/**
 * Mounts the component lazily, if an element matching the selector exists.
 *
 * The importer must import the component.
 * Example:
 *
 *     mountLazy(".selector", () => import("./src/MyComp"));
 */
export function mountLazy <T extends mojave.Mountable>(selector: string, importer: () => Promise<any>, options?: mojave.MountOptions) : void
{
    let elements = find(selector);

    if (!elements.length)
    {
        return;
    }

    importer().then(
        module => doMount(elements, module.default, options),
        error => console.error(`Mounting of component of path '${selector}' failed: ${error.message}`, error)
    );
}



/**
 * Actually mounts on the given elements
 */
function doMount (elements: HTMLElement[], mountable: mojave.Mountable, rawOptions?: mojave.MountOptions) : void
{
    let options = extend({
        type: "func",
    }, rawOptions || {}) as mojave.MountOptions & {type: mojave.MountableType};

    elements.forEach(
        node =>
        {
            // check whether is a JSX component (i.e. it has no `init()` method).
            if ("jsx" === options.type)
            {
                let opts = options as mojave.ComponentMountOptions<any>;
                let parent = node.parentElement;
                let params = (opts.params || {}) as {[key: string]: any};

                if (!parent)
                {
                    console.error("Can't mount on container without parent.");
                    return;
                }

                if (!opts.hydrate)
                {
                    // if the node should not be hydrated, try to use the content as JSON
                    params = extend(params, parseElementAsJson(node) || {});

                    // remove node before mount, so that we can ensure that preact doesn't reuse it.
                    parent.removeChild(node);
                }

                // render
                render(
                    createElement(mountable as ComponentType<any>, params),
                    parent,
                    opts.hydrate ? node : undefined
                );
            }
            else if ("class" === options.type)
            {
                let mountableClass = mountable as mojave.MountableClass;
                let standaloneOptions = options as mojave.ClassMountOptions<any>;
                const mounted = new mountableClass(node, ...(standaloneOptions.params || []));
                mounted.init();
            }
            else
            {
                let standaloneOptions = options as mojave.FunctionMountOptions<any>;
                (mountable as Function)(node, ...(standaloneOptions.params || []));
            }
        }
    );
}
