import "../../polyfill/promise";
import {SortableResult} from "../Sortable";
import TrHandler from "./GhostHandler/TrHandler";
import {EASE_OUT_CUBIC, animate} from "../../animation";
import {after, before} from "../../dom/manipulate";
import {find} from "../../dom/traverse";
import {setStyles} from "../../dom/css";
import {GhostHandler} from "./GhostHandler/GhostHandler";


export type SortableInteractionItem = {
    element: HTMLElement;
    rect: ClientRect;
    top: number;
    bottom: number;
    left: number;
    isMoved: boolean;
    shouldBeMoved: boolean;
    initialPosition: number;
    displacedPosition: number;
};


export default class SortableInteraction
{
    private readonly container : HTMLElement;
    private readonly draggedItem : HTMLElement;
    private readonly itemSelector : string;
    private readonly draggedRect : ClientRect | DOMRect;
    private readonly allItems : HTMLElement[];
    private readonly draggedIndex : number;
    private readonly containedIFrames : HTMLElement[];
    private ghostHandler : null|GhostHandler;
    private itemDragOffset : { x: number; y: number };
    private hasMovedBefore : boolean;
    private readonly startScrollPosition : number;
    private readonly itemsBefore : SortableInteractionItem[];
    private readonly itemsAfter : SortableInteractionItem[];

    /**
     */
    constructor (container : HTMLElement, draggedItem : HTMLElement, itemSelector : string, interactionX : number, interactionY : number)
    {
        this.container = container;
        this.draggedItem = draggedItem;
        this.itemSelector = itemSelector;
        this.draggedRect = draggedItem.getBoundingClientRect();
        this.allItems = find(itemSelector, this.container);
        this.draggedIndex = this.allItems.indexOf(draggedItem);
        this.containedIFrames = find(`${itemSelector} iframe`, this.container);
        this.ghostHandler = null;
        this.itemDragOffset = {
            x: interactionX - this.draggedRect.left,
            y: interactionY - this.draggedRect.top,
        };
        this.hasMovedBefore = false;
        this.startScrollPosition = window.pageYOffset;

        if (this.container.tagName.toLowerCase() === "table")
        {
            // @deprecated remove in mojave v7
            console.error("To avoid render issues, you should never use a table as container. Wrap a div around the table to fix layout issues.");
        }

        const displacement = this.calculateDisplacement();

        this.itemsBefore = this.allItems.slice(0, this.draggedIndex).map(item => this.prepareItem(item, 0, displacement));
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
     */
    private prepareItem (item : HTMLElement, initialPosition : number, displacedPosition : number) : SortableInteractionItem
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
     */
    private calculateOffsets (x : number, y : number) : {left: number, top: number, centerLeft: number, centerTop: number}
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
    start () : void
    {
        switch (this.draggedItem.tagName)
        {
            case "TR":
                this.ghostHandler = new TrHandler(this.draggedItem as HTMLTableRowElement);
                break;
        }

        if (null !== this.ghostHandler)
        {
            this.ghostHandler.onStart();
        }

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

        // add marker class
        this.draggedItem.classList.add("_mojave-dragged-item");

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
     */
    onMove (x : number, y : number) : void
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
     */
    findIntersection (centerLeft : number, centerTop : number) : [SortableInteractionItem[], number|null]
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
     */
    activateList (activeList : SortableInteractionItem[], activeIndex : number|null) : void
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
    onScroll () : void
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
     */
    private updateMovementOfItems () : void
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
     */
    drop (x : number, y : number) : Promise<SortableResult|undefined>
    {
        const {centerLeft, centerTop} = this.calculateOffsets(x, y);
        const [list, itemIndex] = this.findIntersection(centerLeft, centerTop);

        if (null === itemIndex)
        {
            return this.abort();
        }

        const target = list[itemIndex];
        let beforeItem: HTMLElement|null = target.element;
        let updateMethod = before;

        if (list !== this.itemsBefore)
        {
            beforeItem = list[itemIndex + 1] !== undefined
                ? list[itemIndex + 1].element
                : null;
            updateMethod = after;
        }

        return this.resetStyles(
            {
                top: target.top,
                left: target.left,
            },
            () => updateMethod(target.element, this.draggedItem),
            {
                item: this.draggedItem,
                before: beforeItem,
            }
        );
    }


    /**
     * Aborts the interaction
     */
    abort () : Promise<any>
    {
        const delta = window.pageYOffset - this.startScrollPosition;

        return this.resetStyles({
            top: this.draggedRect.top - delta,
            left: this.draggedRect.left,
        });
    }


    /**
     */
    private resetStyles (
        animateTo : Object,
        endAnimationCallback? : () => void,
        result?: SortableResult
    ) : Promise<SortableResult|undefined>
    {
        return new Promise(
            resolve => {
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

                            if (null !== this.ghostHandler)
                            {
                                this.ghostHandler.onEnd();
                            }

                            setStyles(this.allItems, {
                                height: "",
                                left: "",
                                margin: "",
                                position: "",
                                top: "",
                                transform: "",
                                transition: "",
                                width: "",
                                "will-change": "",
                                "z-index": "",
                            });

                            // remove marker class
                            this.draggedItem.classList.remove("_mojave-dragged-item");

                            setStyles(this.containedIFrames, {
                                "pointer-events": "",
                            });

                            setStyles(this.container, {
                                height: "",
                            });

                            resolve(result);
                        }
                    );
            }
        );
    }


    /**
     * Returns whether the order of the items has changed
     */
    orderHasChanged () : boolean
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
