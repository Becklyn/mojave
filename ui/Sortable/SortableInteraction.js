import "../../polyfill/promise";
import {EASE_OUT_CUBIC, animate} from "../../animation";
import {after, before} from "../../dom/manipulate";
import {find} from "../../dom/traverse";
import {setStyles} from "../../dom/css";

/**
 * @typedef {{
 *      element: HTMLElement,
 *      rect: ClientRect,
 *      isMoved: boolean,
 *      shouldBeMoved: boolean,
 *      initialPosition: number,
 *      displacedPosition: number,
 * }} SortableInteractionItem
 */


export default class SortableInteraction
{
    /**
     * @param {HTMLElement} container
     * @param {HTMLElement} draggedItem
     * @param {string} itemSelector
     * @param {number} interactionX
     * @param {number} interactionY
     */
    constructor (container, draggedItem, itemSelector, interactionX, interactionY)
    {
        /**
         * @private
         * @type {HTMLElement}
         */
        this.container = container;

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
         * The list of all items
         *
         * @private
         * @type {HTMLElement[]}
         */
        this.allItems = find(itemSelector, this.container);

        /**
         * The index of the dragged item
         *
         * @private
         * @type {number}
         */
        this.draggedIndex = this.allItems.indexOf(draggedItem);

        /**
         * @private
         * @type {HTMLElement[]}
         */
        this.containedIFrames = find(`${itemSelector} iframe`, this.container);

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
    }


    /**
     * Prepares a single item
     *
     * @private
     * @param {HTMLElement} item
     * @param {boolean} isBefore
     * @returns {SortableInteractionItem}
     */
    prepareItem (item, isBefore)
    {
        return {
            element: item,
            rect: item.getBoundingClientRect(),
            isMoved: false,
            shouldBeMoved: false,
            initialPosition: isBefore ? 0 : this.movement,
            displacedPosition: this.movement * (isBefore ? 1 : 0),
        };
    }


    /**
     * Starts the interaction of the sortable
     */
    start ()
    {
        // force container size
        setStyles(this.container, {
            height: this.container.getBoundingClientRect().height,
        });

        // prepare styles of items
        setStyles(this.allItems, {
            position: "relative",
            transition: "0s",
            "z-index": 0,
            "will-change": "transform",
            "box-sizing": "border-box",
        });

        for (let i = 0; i < this.itemsAfter.length; i++)
        {
            setStyles(this.itemsAfter[i].element, {
                transform: `translateY(${this.itemsAfter[i].initialPosition}px)`,
            });
        }

        // set style of dragged item
        setStyles(this.draggedItem, {
            "z-index": 1,
            position: "fixed",
            left: this.draggedRect.left,
            top: this.draggedRect.top,
            width: this.draggedRect.width,
            height: this.draggedRect.height,
            margin: 0,
        });

        setStyles(this.containedIFrames, {
            "pointer-events": "none",
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
        const [isBefore, index] = this.findIntersection(centerLeft, centerTop);

        if (null === isBefore)
        {
            this.deactivate(this.itemsAfter);
            this.deactivate(this.itemsBefore);
        }
        else if (isBefore)
        {
            this.activateBefore(index);
        }
        else
        {
            this.activateAfter(index);
        }

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
     * @returns {Array}
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
                        return [true, i];
                    }
                }
            }
            else if (0 !== this.itemsAfter.length && this.itemsAfter[0].rect.top <= centerTop && this.itemsAfter[this.itemsAfter.length - 1].rect.bottom >= centerTop)
            {
                for (let i = 0; i < this.itemsAfter.length; i++)
                {
                    if (this.itemsAfter[i].rect.top > centerTop)
                    {
                        return [false, i - 1];
                    }
                }

                return [false, this.itemsAfter.length - 1];
            }
        }

        return [null, undefined];
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
                const movement = item.shouldBeMoved ? item.displacedPosition : item.initialPosition;
                setStyles(item.element, {
                    transform: `translateY(${movement}px)`,
                });
                item.isMoved = item.shouldBeMoved;
            }
        }
    }


    /**
     *
     * @param {number} x
     * @param {number} y
     */
    drop (x, y)
    {
        const left = x - this.itemDragOffset.x;
        const top = y - this.itemDragOffset.y;
        const centerLeft = left + this.itemCenterOffset.width;
        const centerTop = top + this.itemCenterOffset.height;

        const [isBefore, index] = this.findIntersection(centerLeft, centerTop);

        if (null === isBefore)
        {
            return this.abort();
        }

        const target = isBefore
            ? this.itemsBefore[index]
            : this.itemsAfter[index];

        return this.resetStyles({
            top: target.rect.top,
            left: target.rect.left,
        }, () => {
            if (isBefore)
            {
                before(target.element, this.draggedItem);
            }
            else
            {
                after(target.element, this.draggedItem);
            }
        })
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
                                margin: "",
                            });

                            setStyles(this.containedIFrames, {
                                "pointer-events": "",
                            });

                            setStyles(this.container, {
                                height: "",
                            });

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
        // @todo implement me pliis kthxbai
        return true;
    }
}
