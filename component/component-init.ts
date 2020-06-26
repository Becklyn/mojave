import {find} from "../dom/traverse";

export type ComponentInitializer = (element: HTMLElement) => void;

/**
 * Returns a function, that initializes the the component with the given initializer action.
 * Will automatically guard against duplicate initialization.
 */
export function createComponentInitializer (
    selector: string,
    action: ComponentInitializer
): (container: HTMLElement) => void
{
    const alreadyInitialized = new WeakMap<HTMLElement, true>();

    return (container: HTMLElement): void =>
    {
        // if the element itself matches, then just initialize on it directly
        const mounts = container.matches(selector)
            ? [container]
            : find(selector, container);

        mounts.forEach(
            mount =>
            {
                // check if already initialized
                if (alreadyInitialized.get(mount))
                {
                    return;
                }

                alreadyInitialized.set(mount, true);
                // run actual action
                action(mount);
            }
        );
    };
}
