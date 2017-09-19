import {after, before} from "../dom/manipulate";
import {delegate, on} from "../dom/events";
import {closest, find} from "../dom/traverse";
import {merge} from "../extend";
import mitt from "mitt";
import {setAttrs} from "../dom/attr";


/**
 * @typedef {{
 *      items: string,
 *      ?handle: string,
 * }} SortableConfig
 */


/**
 * Generic sortable implementation
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
         * @type {?{
         *      element: HTMLElement,
         *      before: HTMLElement[],
         * }}
         */
        this.currentInteraction = null;

        /**
         * @private
         * @type {mitt}
         */
        this.emitter = mitt();
    }


    /**
     * Initializes the component
     */
    init ()
    {
        delegate(this.container, `${this.config.items} ${this.config.handle}`, "mousedown", (event) => this.onInteractionStart(event));
        on(this.container, "dragstart", (event) => this.onDragStart(event));
        on(this.container, "dragover", (event) => this.onDragOver(event));
        on(this.container, "drop", (event) => this.onDragEnd(event));
    }


    /**
     * Callback on when the interaction starts
     *
     * @private
     * @param {Event} event
     */
    onInteractionStart (event)
    {
        const item = event.target.matches(this.config.items) ? event.target : closest(event.target, this.config.items);
        setAttrs(item, {
            draggable: true,
        });
    }


    /**
     * Callback on when a move started
     *
     * @private
     * @param {Event} event
     */
    onDragStart (event)
    {
        // only allow at most one moved item at the same time
        if (null !== this.currentInteraction)
        {
            this.onDragEnd();
        }

        this.currentInteraction = {
            element: event.target,
            before: find(this.config.items, this.container),
        };
    }


    /**
     * Callback on when the dragged element enters another element
     *
     * @private
     * @param {DragEvent|Event} event
     */
    onDragOver (event)
    {
        // allow dropping of elements
        event.preventDefault();

        // abort if there is no drag interaction ongoing
        if (null === this.currentInteraction)
        {
            return;
        }

        /** @type {HTMLElement} dropTarget */
        const dropTarget = event.target;
        console.log(dropTarget.textContent);
        const draggedElement = this.currentInteraction.element;

        if (dropTarget === draggedElement)
        {
            return;
        }

        const dropRect = dropTarget.getBoundingClientRect();
        const rectDivider = dropRect.top + (dropRect.height / 2);

        if (event.pageY > rectDivider && dropTarget.previousElementSibling === draggedElement)
        {
            after(dropTarget, draggedElement);
        }
        else if (event.pageY < rectDivider && dropTarget.nextElementSibling === draggedElement)
        {
            before(dropTarget, draggedElement);
        }
    }


    /**
     * Callback on when a move ended
     *
     * @private
     */
    onDragEnd ()
    {
        if (null !== this.currentInteraction)
        {
            // check for state changes
            this.triggerChangeEvent();

            // reset state
            setAttrs(this.currentInteraction.element, {
                draggable: false,
            });

            this.currentInteraction = null;
        }
    }


    /**
     * Triggers the change event, if the order of the items has changed
     *
     * @private
     */
    triggerChangeEvent ()
    {
        // reload all items and check whether the order has changed
        const currentItems = find(this.config.items, this.container);
        let orderChanged = false;

        for (let i = 0; i < currentItems.length; i++)
        {
            if (currentItems[i] !== this.currentInteraction.before[i])
            {
                orderChanged = true;
                break;
            }
        }

        if (orderChanged)
        {
            this.emitter.emit("changed", {items: currentItems});
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
