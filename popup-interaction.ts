import {off, on} from "./dom/events";
import {isChildElement} from "./dom/traverse";


/**
 * Registers a body click handler, that will trigger for any click in the body.
 * You can define allowed click targets, where the handler will not be called for.
 *
 * Returns a callback to remove the listener.
 */
export function registerBodyClickHandler (allowedClickTargets: HTMLElement[], onInvalidTargetClick: () => void) : () => void
{
    let handler = (event: Event) => {
        for (let i = 0; i < allowedClickTargets.length; i++)
        {
            // if the click is in any of the allowed containers -> do nothing
            if (isChildElement(allowedClickTargets[i], event.target as Node))
            {
                return;
            }
        }

        // click is outside of allowed containers -> callback
        onInvalidTargetClick();
    };

    on(document.body, "click", handler);

    return () => {
        off(document.body, "click", handler);
    };
}


/**
 * Initializes the complete interaction for a dismissable container.
 * The trigger opens the container.
 *
 * Returns a close function, with which you can close the container.
 * The close function has a property `.destroy`, which is a function that destroys the dismissable container
 */
export function initDismissableContainer (trigger: HTMLElement|HTMLElement[], allowedContainers: HTMLElement[], callback: (isActive: boolean) => void) : () => void
{
    let globalHandler: (() => void)|null = null;
    const triggers = Array.isArray(trigger) ? trigger : [trigger];

    const close = () =>
    {
        if (globalHandler)
        {
            globalHandler();
            globalHandler = null;
        }

        callback(false);
    };

    const open = () =>
    {
        if (globalHandler)
        {
            return;
        }

        globalHandler = registerBodyClickHandler(triggers.concat(allowedContainers), close);
        callback(true);
    };

    const eventListener = () => {
        (globalHandler ? close : open)();
    };

    on(triggers, "click", eventListener);

    close.destroy = () => {
        close();
        off(triggers, "click", eventListener);
    };
    return close;
}
