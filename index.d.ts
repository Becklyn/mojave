declare namespace mojave.types
{
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
