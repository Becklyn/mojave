export class StandaloneComponent<TContainer extends HTMLElement = HTMLElement>
{
    protected container: TContainer;

    /**
     *
     */
    public constructor (container: TContainer)
    {
        this.container = container;
    }


    /**
     * Initializes the component
     */
    public init () : void
    {

    }
}
