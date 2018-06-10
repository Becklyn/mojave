import {h, render} from "preact";
import {find} from "./dom/traverse";
import {merge} from "./extend";


/**
 * Mounts the given class on all elements of the given selector
 *
 * @param {string} selector
 * @param {function(new:*, HTMLElement)} ComponentToMount
 * @param {Array} constructorParameters
 */
export function mount (selector, ComponentToMount, constructorParameters = [])
{
    const elements = find(selector);

    for (let i = 0; i < elements.length; i++)
    {
        constructorParameters.unshift(elements[i]);
        const mounted = new ComponentToMount(...constructorParameters);
        mounted.init();
    }
}




/**
 * Mounts the component as JSX Component.
 * The matched node must contain the data as JSON encoded content.
 *
 * @param {string} selector
 * @param {preact.Component} ComponentToMount
 * @param {Object} additionalProps
 */
export function mountJsx (selector, ComponentToMount, additionalProps = {})
{
    const elements = find(selector);

    for (let i = 0; i < elements.length; i++)
    {
        try
        {
            const node = elements[i];
            let data = JSON.parse(node.textContent);
            data = merge(data, additionalProps);

            render(
                h(ComponentToMount, data),
                node.parentElement,
                node
            );
        }
        catch (e)
        {
            console.error("Could not mount component", e);
        }
    }
}
