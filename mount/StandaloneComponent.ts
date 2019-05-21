import {mojave} from "../@types/mojave";


export class StandaloneComponent<TContainer extends HTMLElement = HTMLElement> implements mojave.StandaloneComponentInterface
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
