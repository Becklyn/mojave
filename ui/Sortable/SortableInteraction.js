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


const ITEMS_BEFORE = 0;
const ITEMS_AFTER = 1;


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


        const displacement = this.calculateDisplacement();
        /**
         * All items, sorted whether they are before or after the dragged element
         *
         * Index 0 -> before dragged element
         * Index 1 -> after dragged element
         *
         * @private
         * @type {[SortableInteractionItem[], SortableInteractionItem[]]}
         */
        this.items = [
            this.allItems.slice(0, this.draggedIndex).map(item => this.prepareItem(item, 0, displacement)),
            this.allItems.slice(this.draggedIndex + 1).map(item => this.prepareItem(item, displacement, 0)),
        ];
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
        return {
            element: item,
            rect: item.getBoundingClientRect(),
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

        this.items[ITEMS_AFTER].forEach(
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
        if (0 === this.draggedIndex && this.items[ITEMS_AFTER][0] !== undefined)
        {
            setStyles(this.items[ITEMS_AFTER][0].element, {
                "margin": 0,
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
        const [listIndex, itemIndex] = this.findIntersection(centerLeft, centerTop);

        // activate list
        this.activateList(listIndex, itemIndex);

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
     * @returns {[number, ?number]}
     */
    findIntersection (centerLeft, centerTop)
    {
        // first: simple out of bounds check
        // check whether the dragged item is out of bounds on the X axis
        if (this.draggedRect.left <= centerLeft && this.draggedRect.right >= centerLeft)
        {
            const before = this.items[ITEMS_BEFORE];
            const after = this.items[ITEMS_AFTER];

            if (0 !== before.length && before[0].rect.top <= centerTop && before[before.length - 1].rect.bottom >= centerTop)
            {
                for (let i = 0; i < before.length; i++)
                {
                    if (before[i].rect.bottom >= centerTop)
                    {
                        return [ITEMS_BEFORE, i];
                    }
                }
            }
            else if (0 !== after.length && after[0].rect.top <= centerTop && after[after.length - 1].rect.bottom >= centerTop)
            {
                for (let i = 0; i < after.length; i++)
                {
                    if (after[i].rect.top > centerTop)
                    {
                        return [ITEMS_AFTER, i - 1];
                    }
                }

                return [ITEMS_AFTER, after.length - 1];
            }
        }

        return [ITEMS_BEFORE, null];
    }


    /**
     * Activates the given list
     * @param listIndex
     * @param activeIndex
     */
    activateList (listIndex, activeIndex)
    {
        const activeList = this.items[listIndex];
        const inactiveList = this.items[ Math.abs(listIndex - 1) ];

        for (let i = 0; i < activeList.length; i++)
        {
            activeList[i].shouldBeMoved = null === activeIndex ? false : (listIndex === ITEMS_BEFORE ? (i >= activeIndex) : (i <= activeIndex));
        }

        for (let i = 0; i < inactiveList.length; i++)
        {
            inactiveList[i].shouldBeMoved = false;
        }
    }


    /**
     * Updates the movement of all items
     *
     * @private
     */
    updateMovementOfItems ()
    {
        for (let listIndex = ITEMS_BEFORE; listIndex <= ITEMS_AFTER; listIndex++)
        {
            const list = this.items[listIndex];

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
    }


    /**
     * Handles the dropping of elements at specific coordinates
     *
     * @param {number} x
     * @param {number} y
     */
    drop (x, y)
    {
        const {centerLeft, centerTop} = this.calculateOffsets(x, y);
        const [listIndex, itemIndex] = this.findIntersection(centerLeft, centerTop);

        if (null === itemIndex)
        {
            return this.abort();
        }

        const target = this.items[listIndex][itemIndex];
        const updateMethod = [before, after];

        return this.resetStyles({
            top: target.rect.top,
            left: target.rect.left,
        }, () => {
            updateMethod[listIndex](target.element, this.draggedItem);
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
