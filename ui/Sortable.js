import {closest, find, findOne} from "../dom/traverse";
import {delegate, off, on} from "../dom/events";
import {merge} from "../extend";
import mitt from "mitt";
import SortableInteraction from "./Sortable/SortableInteraction";


/**
 * @typedef {{
 *      items: string,
 *      ?handle: string,
 * }} SortableConfig
 */


/**
 * Generic sortable implementation
 *
 * @todo handle scrolling while dragging correctly
 */
export default class Sortable
{
    /**
     * @param {HTMLElement} container
     * @param {SortableConfig} config
     */
    constructor (container, config)
    {
        /**
         * @private
         * @type {HTMLElement}
         */
        this.container = container;

        /**
         * @private
         * @type {SortableConfig}
         */
        this.config = merge({
            handle: "",
        }, config);

        /**
         * @private
         * @type {?SortableInteraction}
         */
        this.interaction = null;

        /**
         * @private
         * @type {mitt}
         */
        this.emitter = mitt();


        // bind methods
        this.listeners = {
            move: this.onDragMove.bind(this),
            end: this.onDragEnd.bind(this),
            mouseOut: this.onMouseOut.bind(this),
        };
    }


    /**
     * Initializes the component
     */
    init ()
    {
        delegate(this.container, `${this.config.items} ${this.config.handle}`, "mousedown", (event) => this.onInteractionStart(event));
        // on(this.container, "dragstart", (event) => this.onDragStart(event));
        // on(this.container, "dragover", (event) => this.onDragOver(event));
        // on(this.container, "drop", (event) => this.onDragEnd(event));
    }


    /**
     * Callback on when the interaction starts
     *
     * @private
     * @param {Event} event
     */
    onInteractionStart (event)
    {
        if (null !== this.interaction)
        {
            return;
        }

        const draggedItem = event.target.matches(this.config.items) ? event.target : closest(event.target, this.config.items);
        const allItems = find(this.config.items, this.container);

        this.interaction = new SortableInteraction(this.container, draggedItem, allItems, event.pageX, event.pageY);
        this.interaction.start();

        // prepare items

        // register event listeners
        on(document.body, "mousemove", this.listeners.move);
        on(document.body, "mouseup", this.listeners.end);
        on(window, "mouseout", this.listeners.mouseOut);

        event.preventDefault();
    }


    /**
     * Event on when the input devices moved while dragging
     *
     * @private
     * @param {Event} event
     */
    onDragMove (event)
    {
        if (null === this.interaction)
        {
            return;
        }

        this.interaction.onMove(event.pageX, event.pageY);
    }


    /**
     * Event on when the dragging ended
     *
     * @private
     * @param {?Event} event
     */
    onDragEnd (event)
    {
        if (null === this.interaction)
        {
            return;
        }

        // remove event listeners
        off(document.body, "mousemove", this.listeners.move);
        off(document.body, "mouseup", this.listeners.end);
        off(window, "mouseout", this.listeners.mouseOut);

        // check for state changes
        // reload all items and check whether the order has changed
        const currentItems = find(this.config.items, this.container);
        const orderHasChanged = this.interaction.orderHasChanged();

        // reset current interaction
        const endAction = (event !== undefined)
            ? this.interaction.drop(event.pageX, event.pageY)
            : this.interaction.abort();

        endAction
            .then(
                () => {
                    // reset interaction
                    this.interaction = null;

                    if (orderHasChanged)
                    {
                        this.emitter.emit("changed", {items: currentItems});
                    }
                }
            );
    }


    onMouseOut (event)
    {
        const html = findOne("html");
        if (event.relatedTarget === html && event.toElement === html)
        {
            this.onDragEnd();
        }
    }


    /**
     * Register an event listener
     *
     * @param {string} event
     * @param {function} callback
     */
    on (event, callback)
    {
        this.emitter.on(event, callback);
    }
}
