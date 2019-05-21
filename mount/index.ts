import {ComponentFactory, h, render} from "preact";
import {mojave} from "../@types/mojave";
import {find} from "../dom/traverse";
import {merge} from "../extend";



export function mount (selector: string, mountable: ComponentFactory<any>, options: mojave.ComponentMountOptions): void;
export function mount (selector: string, mountable: mojave.StandaloneComponentInterface, options: mojave.StandaloneMountOptions): void;
export function mount <T extends mojave.Mountable>(selector: string, mountable: mojave.Mountable, options: mojave.MountOptions = {}) : void
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
    let isJsx = typeof (mountable as any).init !== "function";

    for (let i = 0; i < elements.length; i++)
    {
        let node = elements[i];

        if (isJsx)
        {
            let Component = mountable as ComponentFactory<any>;
            let opts = options as mojave.ComponentMountOptions;

            if (node.parentElement === null)
            {
                console.error("Can't mount on container without parent.");
                continue;
            }

            render(
                h(Component, merge(opts.params || {}, safeParseJson(node.textContent) || {})),
                node.parentElement,
                node
            );
        }
        else
        {
            let StandaloneComponent = mountable as any;
            let standaloneOptions = options as mojave.StandaloneMountOptions;
            const mounted = new StandaloneComponent(node, ...(standaloneOptions.params || []));
            mounted.init();
        }
    }
}



