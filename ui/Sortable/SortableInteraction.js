import "../../polyfill/promise";
import {EASE_OUT_CUBIC, animate} from "../../animation";
import {before, remove} from "../../dom/manipulate";
import {duplicate} from "../../dom/clone";
import {setStyles} from "../../dom/css";

/**
 * @typedef {{
 *      element: HTMLElement,
 *      rect: ClientRect,
 *      isMoved: boolean,
 *      shouldBeMoved: boolean,
 *      movement: number,
 * }} SortableInteractionItem
 */


export default class SortableInteraction
{
    /**
     * @param {HTMLElement} draggedItem
     * @param {HTMLElement[]} allItems
     * @param {number} interactionX
     * @param {number} interactionY
     */
    constructor (draggedItem, allItems, interactionX, interactionY)
    {
        /**
         * The dragged item
         *
         * @private
         * @type {HTMLElement}
         */
        this.draggedItem = draggedItem;

        /**
         * The rect of the dragged item
         *
         * @private
         * @type {ClientRect}
         */
        this.draggedRect = draggedItem.getBoundingClientRect();

        /**
         * The index of the dragged item
         *
         * @private
         * @type {number}
         */
        this.draggedIndex = allItems.indexOf(draggedItem);

        /**
         * The list of all items
         *
         * @private
         * @type {HTMLElement[]}
         */
        this.allItems = allItems;

        /**
         * The offset of the mouse inside the dragged item to the top left corner of it
         *
         * @private
         * @type {{x: number, y: number}}
         */
        this.itemDragOffset = {
            x: interactionX - this.draggedRect.left,
            y: interactionY - this.draggedRect.top,
        };

        /**
         * Flag, whether the item was moved already at least once
         *
         * @private
         * @type {boolean}
         */
        this.hasMovedBefore = false;

        /**
         * The offset of the top left corner of the dragged item to its center
         *
         * @private
         * @type {{width: number, height: number}}
         */
        this.itemCenterOffset = {
            width: this.draggedRect.width / 2,
            height: this.draggedRect.height / 2,
        };

        /**
         * The height, by which all items are moved when animating
         *
         * @private
         * @type {number}
         */
        this.movement = this.draggedRect.height + 5;

        /**
         * The list of items BEFORE the dragged one
         *
         * @private
         * @type {SortableInteractionItem[]}
         */
        this.itemsBefore = this.allItems.slice(0, this.draggedIndex).map(item => this.prepareItem(item, true));

        /**
         * The list of items AFTER the dragged one
         *
         * @private
         * @type {SortableInteractionItem[]}
         */
        this.itemsAfter = this.allItems.slice(this.draggedIndex + 1).map(item => this.prepareItem(item, false));


        /**
         * @private
         * @type {HTMLElement}
         */
        this.placeholder = this.createPlaceholder();
    }


    /**
     * Creates a placeholder in place of the dragged item
     *
     * @private
     * @returns {HTMLElement}
     */
    createPlaceholder ()
    {
        const placeholder = duplicate(this.draggedItem);
        before(this.draggedItem, placeholder);
        setStyles(placeholder, {
            visibility: "hidden",
        });

        return placeholder;
    }


    /**
     * Prepares a single item
     *
     * @private
     * @param {HTMLElement} item
     * @param {boolean} movementDown
     * @returns {SortableInteractionItem}
     */
    prepareItem (item, movementDown)
    {
        return {
            element: item,
            rect: item.getBoundingClientRect(),
            isMoved: false,
            shouldBeMoved: false,
            movement: this.movement * (movementDown ? 1 : -1),
        };
    }


    /**
     * Starts the interaction of the sortable
     */
    start ()
    {
        // prepare styles of items
        setStyles(this.allItems, {
            position: "relative",
            transition: "0s",
            "z-index": 0,
            "will-change": "transform",
            "box-sizing": "border-box",
        });

        // set style of dragged item
        setStyles(this.draggedItem, {
            "z-index": 1,
            position: "fixed",
            left: this.draggedRect.left,
            top: this.draggedRect.top,
            width: this.draggedRect.width,
            height: this.draggedRect.height,
        });

        this.updateMovementOfItems();
    }


    onMove (x, y)
    {
        if (!this.hasMovedBefore)
        {
            for (let i = 0; i < this.allItems.length; i++)
            {
                if (i !== this.draggedIndex)
                {
                    setStyles(this.allItems[i], {
                        transition: "0.2s transform cubic-bezier(0.2, 0, 0, 1)",
                    });
                }
            }

            this.hasMovedBefore = true;
        }

        const left = x - this.itemDragOffset.x;
        const top = y - this.itemDragOffset.y;
        const centerLeft = left + this.itemCenterOffset.width;
        const centerTop = top + this.itemCenterOffset.height;
        this.findIntersection(centerLeft, centerTop);

        // update position of dragged element
        setStyles(this.draggedItem, {left, top});

        this.updateMovementOfItems();
    }


    /**
     * Finds the intersection
     *
     * @private
     * @param {number} centerLeft
     * @param {number} centerTop
     * @returns {*}
     */
    findIntersection (centerLeft, centerTop)
    {
        // first: simple out of bounds check
        // check whether the dragged item is out of bounds on the X axis
        if (this.draggedRect.left <= centerLeft && this.draggedRect.right >= centerLeft)
        {
            if (0 !== this.itemsBefore.length && this.itemsBefore[0].rect.top <= centerTop && this.itemsBefore[this.itemsBefore.length - 1].rect.bottom >= centerTop)
            {
                for (let i = 0; i < this.itemsBefore.length; i++)
                {
                    if (this.itemsBefore[i].rect.bottom >= centerTop)
                    {
                        return this.activateBefore(i);
                    }
                }
            }
            else if (0 !== this.itemsAfter.length && this.itemsAfter[0].rect.top <= centerTop && this.itemsAfter[this.itemsAfter.length - 1].rect.bottom >= centerTop)
            {
                for (let i = 0; i < this.itemsAfter.length; i++)
                {
                    if (this.itemsAfter[i].rect.top > centerTop)
                    {
                        return this.activateAfter(i - 1);
                    }
                }

                return this.activateAfter(this.itemsAfter.length - 1);
            }
        }

        this.deactivate(this.itemsAfter);
        this.deactivate(this.itemsBefore);
    }

    activateBefore (index)
    {
        for (let i = 0; i < this.itemsBefore.length; i++)
        {
            this.itemsBefore[i].shouldBeMoved = (i >= index);
        }

        this.deactivate(this.itemsAfter);
    }

    activateAfter (index)
    {
        for (let i = 0; i < this.itemsAfter.length; i++)
        {
            this.itemsAfter[i].shouldBeMoved = (i <= index);
        }

        this.deactivate(this.itemsBefore);
    }

    deactivate (list)
    {
        for (let i = 0; i < list.length; i++)
        {
            list[i].shouldBeMoved = false;
        }
    }


    /**
     *
     */
    updateMovementOfItems ()
    {
        this.updateMovementOfList(this.itemsAfter);
        this.updateMovementOfList(this.itemsBefore);
    }

    /**
     *
     * @param {SortableInteractionItem[]} list
     */
    updateMovementOfList (list)
    {
        for (let i = 0; i < list.length; i++)
        {
            const item = list[i];

            if (item.shouldBeMoved !== item.isMoved)
            {
                const movement = item.shouldBeMoved ? item.movement : 0;
                setStyles(item.element, {
                    transform: `translateY(${movement}px)`,
                });
                item.isMoved = item.shouldBeMoved;
            }
        }
    }


    /**
     * Aborts the interaction
     *
     * @returns {Promise}
     */
    abort ()
    {
        return this.resetStyles({
            top: this.draggedRect.top,
            left: this.draggedRect.left,
        }, () => {
            console.log("Styles about to reset.");
        });
    }


    /**
     * @private
     *
     * @param {Object} animateTo
     * @param {?function} endAnimationCallback
     * @returns {Promise}
     */
    resetStyles (animateTo, endAnimationCallback)
    {
        return new window.Promise(
            (resolve) => {
                const endAnimation = animate(
                    this.draggedItem,
                    animateTo,
                    {
                        duration: 200,
                        easing: EASE_OUT_CUBIC
                    }
                );

                endAnimation
                    .then(
                        () => {

                            if (endAnimationCallback !== undefined)
                            {
                                endAnimationCallback();
                            }

                            setStyles(this.allItems, {
                                transition: "0s",
                                transform: "translate(0, 0)",
                                top: 0,
                                left: 0,
                                width: "",
                                height: "",
                                position: "relative",
                            });

                            remove(this.placeholder);
                            resolve();
                        }
                    );
            }
        );
    }


    /**
     * Returns whether the order of the items has changed
     *
     * @returns {boolean}
     */
    orderHasChanged ()
    {
        return true;
    }
}
