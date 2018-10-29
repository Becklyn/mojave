declare namespace mojave.types
{
    /**
     * Options for createElement()
     */
    type CreateElementOptions = KeyMap & {
        css? : KeyMap,
        text? : string,
        html? : string,
    }

    /**
     * Allowed argument for DOM insert methods.
     */
    type InsertableElement = string | Element | Element[];

    /**
     * Generic map from string keys -> string | number
     */
    type KeyMap = {[key : string] : string | number};

    /**
     * Generic map from string keys -> string | number | null | boolean
     */
    type OptionalKeyMap = {[key : string] : string | number | null | boolean};

    /**
     * Custom event listener token, that can unregister delegated or once event listeners
     */
    type EventIntermediateToken = (any : any) => void;

    /**
     * Event handler for delegated events
     */
    type DelegatedEventHandler = (Event : Event, HTMLElement : HTMLElement) => void;
}
