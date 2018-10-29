import {closest, find, findOne} from "../dom/traverse";
import {delegate, off, on} from "../dom/events";
import {merge} from "../extend";
//@ts-ignore
import mitt from "mitt";
import SortableInteraction from "./Sortable/SortableInteraction";

/**
 * Config object for working with ui/sortable
 */
export type SortableConfig = {
    items: string,
    handle?: string,
}

export type SortableListeners = {
    move: (event : Event) => void;
    end: (event : Event) => void;
    mouseOut: (event : Event) => void;
    scroll: (event : Event) => void;
};

/**
 * Generic sortable implementation
 */
export default class Sortable
{
    private readonly container : HTMLElement;
    private readonly config : SortableConfig;
    private interaction : null|SortableInteraction;
    private readonly emitter : mitt.Emitter;
    private listeners : SortableListeners;

    /**
     */
    constructor (container : HTMLElement, config : SortableConfig)
    {
        this.container = container;
        this.config = merge({
            handle: "",
        }, config) as SortableConfig;
        this.interaction = null;
        this.emitter = mitt();
        this.listeners = {
            move: this.onDragMove.bind(this),
            end: this.onDragEnd.bind(this),
            mouseOut: this.onMouseOut.bind(this),
            scroll: this.onScroll.bind(this),
        };
    }


    /**
     * Initializes the component
     */
    init ()
    {
        delegate(
            this.container,
            `${this.config.items} ${this.config.handle}`,
            "mousedown",
            (event : Event) => this.onInteractionStart(event as MouseEvent)
        );
    }


    /**
     * Callback on when the interaction starts
     */
    private onInteractionStart (event : MouseEvent) : void
    {
        if (null !== this.interaction)
        {
            return;
        }

        let eventTarget = event.target as HTMLElement;

        if (null === eventTarget)
        {
            return;
        }

        const draggedItem = eventTarget.matches(this.config.items) ? eventTarget : closest(eventTarget, this.config.items) as HTMLElement;

        this.interaction = new SortableInteraction(this.container, draggedItem, this.config.items, event.screenX, event.screenY);
        this.interaction.start();

        // prepare items

        // register event listeners
        on(document.body, "mousemove", this.listeners.move);
        on(document.body, "mouseup", this.listeners.end);
        on(window, "mouseout", this.listeners.mouseOut);
        on(window, "scroll", this.listeners.scroll);

        this.emitter.emit("start", [draggedItem]);
        event.preventDefault();
    }


    /**
     * Event on when the input devices moved while dragging
     */
    private onDragMove (event : MouseEvent) : void
    {
        if (null === this.interaction)
        {
            return;
        }

        this.interaction.onMove(event.screenX, event.screenY);
    }


    /**
     * Event on when the dragging ended
     */
    private onDragEnd (event? : MouseEvent) : void
    {
        if (null === this.interaction)
        {
            return;
        }

        // remove event listeners
        off(document.body, "mousemove", this.listeners.move);
        off(document.body, "mouseup", this.listeners.end);
        off(window, "mouseout", this.listeners.mouseOut);
        off(window, "scroll", this.listeners.scroll);

        // reset current interaction
        const endAction = (event !== undefined)
            ? this.interaction.drop(event.screenX, event.screenY)
            : this.interaction.abort();

        endAction
            .then(
                () => {
                    // check for state changes
                    // reload all items and check whether the order has changed
                    const currentItems = find(this.config.items, this.container);

                    if (null === this.interaction)
                    {
                        return;
                    }

                    const orderHasChanged = this.interaction.orderHasChanged();

                    // reset interaction
                    this.interaction = null;

                    // trigger end event
                    this.emitter.emit("end");

                    if (orderHasChanged)
                    {
                        this.emitter.emit("changed", {items: currentItems});
                    }

                }
            );
    }


    /**
     * Callback on when the mouse leaves the window
     */
    private onMouseOut (event : MouseEvent) : void
    {
        const html = findOne("html");
        if (event.relatedTarget === html && event.toElement === html)
        {
            this.onDragEnd();
        }
    }

    /**
     * Callback on scroll
     */
    private onScroll () : void
    {
        if (null === this.interaction)
        {
            return;
        }

        this.interaction.onScroll();
    }


    /**
     * Register an event listener
     */
    on (event : string, callback : (...args : any[]) => void) : void
    {
        this.emitter.on(event, callback);
    }
}
