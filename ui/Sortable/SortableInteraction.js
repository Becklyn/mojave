import "../../polyfill/promise";
import {EASE_OUT_CUBIC, animate} from "../../animation";
import {after, before} from "../../dom/manipulate";
import {find} from "../../dom/traverse";
import {setStyles} from "../../dom/css";

/**
 * @typedef {{
 *      element: HTMLElement,
 *      rect: ClientRect,
 *      top: number,
 *      left: number,
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
         * @private
         * @type {string}
         */
        this.itemSelector = itemSelector;

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
         * @private
         * @type {Number}
         */
        this.startScrollPosition = window.pageYOffset;


        const displacement = this.calculateDisplacement();

        /**
         * @private
         * @type {SortableInteractionItem[]}
         */
        this.itemsBefore = this.allItems.slice(0, this.draggedIndex).map(item => this.prepareItem(item, 0, displacement));

        /**
         * @private
         * @type {SortableInteractionItem[]}
         */
        this.itemsAfter = this.allItems.slice(this.draggedIndex + 1).map(item => this.prepareItem(item, displacement, 0));
    }


    /**
     * Calculates the displacement of the dragged item
     *
     * @private
     * @returns {number}
     */
    calculateDisplacement ()
    {
        const margin = this.allItems[1].getBoundingClientRect().top - this.allItems[0].getBoundingClientRect().bottom;
        return this.draggedRect.height + margin;
    }


    /**
     * Prepares a single item
     *
     * @private
     * @param {HTMLElement} item
     * @param {number} initialPosition
     * @param {number} displacedPosition
     * @returns {SortableInteractionItem}
     */
    prepareItem (item, initialPosition, displacedPosition)
    {
        const rect = item.getBoundingClientRect();

        return {
            element: item,
            rect: rect,
            top: rect.top,
            left: rect.left,
            bottom: rect.bottom,
            isMoved: false,
            shouldBeMoved: false,
            initialPosition: initialPosition,
            displacedPosition: displacedPosition,
        };
    }

    /**
     * Calculates the offsets for the dragged element
     *
     * @private
     * @param {number} x
     * @param {number} y
     * @returns {{left: number, top: number, centerLeft: number, centerTop: number}}
     */
    calculateOffsets (x, y)
    {
        const left = x - this.itemDragOffset.x;
        const top = y - this.itemDragOffset.y;

        return {
            left: left,
            top: top,
            centerLeft: left + (this.draggedRect.width / 2),
            centerTop: top + (this.draggedRect.height / 2),
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

        this.itemsAfter.forEach(
            (item) => setStyles(item.element, {
                transform: `translateY(${item.initialPosition}px)`,
            })
        );

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

        // fix margin if dragged item is first item
        if (0 === this.draggedIndex && this.itemsAfter[0] !== undefined)
        {
            setStyles(this.itemsAfter[0].element, {
                margin: 0,
            });
        }

        this.updateMovementOfItems();
    }


    /**
     * Callback on when the item was moved
     *
     * @param {number} x
     * @param {number} y
     */
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

        const {left, top, centerLeft, centerTop} = this.calculateOffsets(x, y);
        const [list, itemIndex] = this.findIntersection(centerLeft, centerTop);

        // activate list
        this.activateList(list, itemIndex);

        // update position of dragged element
        setStyles(this.draggedItem, {
            left,
            top,
        });

        this.updateMovementOfItems();
    }


    /**
     * Finds the intersection
     *
     * Returns the active list and the active index. If the index is `null`, no item is active.
     *
     * @private
     * @param {number} centerLeft
     * @param {number} centerTop
     * @returns {[SortableInteractionItem[], ?number]}
     */
    findIntersection (centerLeft, centerTop)
    {
        // first: simple out of bounds check
        // check whether the dragged item is out of bounds on the X axis
        if (this.draggedRect.left <= centerLeft && this.draggedRect.right >= centerLeft)
        {
            if (0 !== this.itemsBefore.length && this.itemsBefore[0].top <= centerTop && this.itemsBefore[this.itemsBefore.length - 1].bottom >= centerTop)
            {
                for (let i = 0; i < this.itemsBefore.length; i++)
                {
                    if (this.itemsBefore[i].bottom >= centerTop)
                    {
                        return [this.itemsBefore, i];
                    }
                }
            }
            else if (0 !== this.itemsAfter.length && this.itemsAfter[0].top <= centerTop && this.itemsAfter[this.itemsAfter.length - 1].bottom >= centerTop)
            {
                for (let i = 0; i < this.itemsAfter.length; i++)
                {
                    if (this.itemsAfter[i].top > centerTop)
                    {
                        return [this.itemsAfter, i - 1];
                    }
                }

                return [this.itemsAfter, this.itemsAfter.length - 1];
            }
        }

        return [this.itemsBefore, null];
    }


    /**
     * Activates the given list
     *
     * @private
     * @param {SortableInteractionItem[]} activeList
     * @param {?number} activeIndex
     */
    activateList (activeList, activeIndex)
    {
        const isBeforeList = activeList === this.itemsBefore;
        const inactiveList = isBeforeList ? this.itemsAfter : this.itemsBefore;

        for (let i = 0; i < activeList.length; i++)
        {
            if (null === activeIndex)
            {
                activeList[i].shouldBeMoved = false;
            }
            else
            {
                activeList[i].shouldBeMoved = isBeforeList
                    ? (i >= activeIndex)
                    : (i <= activeIndex);
            }
        }

        for (let i = 0; i < inactiveList.length; i++)
        {
            inactiveList[i].shouldBeMoved = false;
        }
    }


    /**
     * Scroll handler
     */
    onScroll ()
    {
        const items = this.itemsAfter.concat(this.itemsBefore);
        const delta = window.pageYOffset - this.startScrollPosition;

        for (let i = 0; i < items.length; i++)
        {
            const item = items[i];
            item.top = item.rect.top - delta;
            item.bottom = item.rect.bottom - delta;
        }
    }


    /**
     * Updates the movement of all items
     *
     * @private
     */
    updateMovementOfItems ()
    {
        const list = this.itemsBefore.concat(this.itemsAfter);

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
     * Handles the dropping of elements at specific coordinates
     *
     * @param {number} x
     * @param {number} y
     * @returns {Promise}
     */
    drop (x, y)
    {
        const {centerLeft, centerTop} = this.calculateOffsets(x, y);
        const [list, itemIndex] = this.findIntersection(centerLeft, centerTop);

        if (null === itemIndex)
        {
            return this.abort();
        }

        const target = list[itemIndex];
        const updateMethod = list === this.itemsBefore
            ? before
            : after;

        return this.resetStyles({
            top: target.top,
            left: target.left,
        }, () => {
            updateMethod(target.element, this.draggedItem);
        });
    }


    /**
     * Aborts the interaction
     *
     * @returns {Promise}
     */
    abort ()
    {
        const delta = window.pageYOffset - this.startScrollPosition;

        return this.resetStyles({
            top: this.draggedRect.top - delta,
            left: this.draggedRect.left,
        });
    }


    /**
     * @private
     *
     * @param {Object} animateTo
     * @param {function=} endAnimationCallback
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
                        easing: EASE_OUT_CUBIC,
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
        const items = find(this.itemSelector, this.container);

        for (let i = 0; i < items.length; i++)
        {
            if (items[i] !== this.allItems[i])
            {
                return true;
            }
        }

        return false;
    }
}
