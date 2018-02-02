declare namespace mojave
{
    /**
     * Annotated HTML element, as it is internally used by mojave
     */
    type AnnotatedHTMLElement = HTMLElement & {
        _data: undefined | KeyMap,
        _listeners: undefined | {[key : string] : EventListenerOrEventListenerObject[]},
    };


    /**
     * Options for createElement()
     */
    interface CreateElementOptions extends KeyMap {
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
     * Custom event listener token, that can unregister delegated or once event listeners
     */
    type EventIntermediateToken = (any) => void;

    /**
     * Event handler for delegated events
     */
    type DelegatedEventHandler = (Event, HTMLElement) => void;
}
