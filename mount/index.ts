import {ComponentType, createElement, render} from "preact";
import {mojave} from "../@types/mojave";
import {find} from "../dom/traverse";
import {extend} from "../extend";
import {safeParseJson} from "../json";



export function mount (selector: string, mountable: mojave.MountableFunction, options?: mojave.FunctionMountOptions): void;
export function mount (selector: string, mountable: ComponentType<any>, options?: mojave.ComponentMountOptions): void;
export function mount (selector: string, mountable: mojave.MountableClass, options?: mojave.ClassMountOptions): void;
export function mount <T extends mojave.Mountable>(selector: string, mountable: mojave.Mountable, options?: mojave.MountOptions) : void
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
    let mountableAny = mountable as any;
    let options = extend({
        type: "func",
    }, rawOptions || {}) as mojave.MountOptions & {type: mojave.MountableType};

    elements.forEach(
        node =>
        {
            // check whether is a JSX component (i.e. it has no `init()` method).
            if ("jsx" === options.type)
            {
                let opts = options as mojave.ComponentMountOptions;

                if (node.parentElement === null)
                {
                    console.error("Can't mount on container without parent.");
                    return;
                }

                render(
                    createElement(mountable as ComponentType<any>, extend(opts.params || {}, safeParseJson(node.textContent) || {})),
                    node.parentElement,
                    node
                );
            }
            else if ("class" === options.type)
            {
                let standaloneOptions = options as mojave.ClassMountOptions;
                const mounted = new mountableAny(node, ...(standaloneOptions.params || []));
                mounted.init();
            }
            else
            {
                let standaloneOptions = options as mojave.FunctionMountOptions;
                (mountable as Function)(node, ...(standaloneOptions.params || []));
            }
        }
    );
}



