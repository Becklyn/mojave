import {ComponentInitializer, createComponentInitializer} from "./component-init";


/**
 * Component initializer, that conveniently groups initializers.
 */
export class ComponentManager
{
    private inits: ComponentInitializer[] = [];


    /**
     * Registers a new initializer.
     * Every initializer must pass a selector (to find the elements to mount on) and the actual
     * initialization action.
     *
     * The manager automatically ensures that no component is initialized on element more than once.
     */
    public register (
        selector: string,
        action: ComponentInitializer
    ): this
    {
        this.inits.push(createComponentInitializer(selector, action));
        return this;
    }


    /**
     * Runs all initializers in the given container
     */
    initializeIn (container: HTMLElement): void
    {
        this.inits.forEach(init => init(container));
    }
}
