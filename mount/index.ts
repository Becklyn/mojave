import {ComponentFactory, h, render} from "preact";
import {mojave} from "../@types/mojave";
import {find} from "../dom/traverse";
import {extend} from "../extend";
import {safeParseJson} from "../json";



export function mount (selector: string, mountable: ComponentFactory<any>, options?: mojave.ComponentMountOptions): void;
export function mount (selector: string, mountable: mojave.StandaloneComponentInterface, options?: mojave.StandaloneMountOptions): void;
export function mount (selector: string, mountable: mojave.MountableFunction, options?: mojave.FunctionMountOptions): void;
export function mount <T extends mojave.Mountable>(selector: string, mountable: mojave.Mountable, options?: mojave.MountOptions) : void
{
    doMount(find(selector), mountable, options);
}


export function mountLazy (selector: string, importPath: string, mountable: ComponentFactory<any>, options: mojave.ComponentMountOptions): void;
export function mountLazy (selector: string, importPath: string, mountable: mojave.StandaloneComponentInterface, options: mojave.StandaloneMountOptions): void;
export function mountLazy <T extends mojave.Mountable>(selector: string, importPath: string, mountable: mojave.Mountable, options: mojave.MountOptions = {}) : void
{
    let elements = find(selector);

    if (!elements.length)
    {
        return;
    }

    import(importPath).then(
        component => doMount(elements, component, options),
        error => console.error(`Mounting of component of path '${importPath}' failed: ${error.message}`, error)
    );
}



/**
 * Actually mounts on the given elements
 */
function doMount (elements: HTMLElement[], mountable: mojave.Mountable, options: mojave.MountOptions = {}) : void
{
    let mountableAny = mountable as any;
    let type = options.type || "func";

    elements.forEach(
        node =>
        {
            // check whether is a JSX component (i.e. it has no `init()` method).
            if ("jsx" === type)
            {
                let opts = options as mojave.ComponentMountOptions;

                if (node.parentElement === null)
                {
                    console.error("Can't mount on container without parent.");
                    return;
                }

                render(
                    h(mountable as ComponentFactory<any>, extend(opts.params || {}, safeParseJson(node.textContent) || {})),
                    node.parentElement,
                    node
                );
            }
            else if ("class" === type)
            {
                let standaloneOptions = options as mojave.StandaloneMountOptions;
                const mounted = new mountableAny(node, ...(standaloneOptions.params || []));
                mounted.init();
            }
            else
            {
                let standaloneOptions = options as mojave.StandaloneMountOptions;
                (mountable as Function)(node, ...(standaloneOptions.params || []));
            }
        }
    );
}



