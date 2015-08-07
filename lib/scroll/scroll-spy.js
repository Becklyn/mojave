"use strict";

import RequestAnimationFrame from "../polyfill/request-animation-frame.js";
import $ from "jquery";


class ScrollSpy
{
    /**
     *
     */
    constructor ()
    {
        /**
         *
         * @private
         * @type {Array}
         */
        this.$itemsToWatch = [];


        /**
         *
         * @private
         * @type {boolean}
         */
        this.didScroll = false;

        /**
         * @private
         * @type {boolean}
         */
        this.isStarted = false;


        /**
         * The last result
         *
         * @private
         * @type {Array<jQuery>}
         */
        this.lastResult = [];


        /**
         * The last requested animation frame
         *
         * @private
         * @type {null|number}
         */
        this.requestedAnimationFrame = null;
    }


    /**
     * Adds a watched item to the scroll spy
     *
     * @param {jQuery} $section
     */
    addItemToWatch ($section)
    {
        this.$itemsToWatch.push($section);
    }


    /**
     * Initializes the component
     */
    start ()
    {
        if (this.isStarted)
        {
            return;
        }

        this.isStarted = true;
        // register even listener
        $(window).on("scroll", () => this.registerUpdate());

        // initialize with update
        this.registerUpdate();
    }


    /**
     * Registers the next update
     *
     * @private
     */
    registerUpdate  ()
    {
        if (!this.requestedAnimationFrame)
        {
            this.requestedAnimationFrame = RequestAnimationFrame.request(
                () => this.updateStatus()
            );
        }
    }



    /**
     * Updates the status
     *
     * @private
     */
    updateStatus ()
    {
        console.log("updateStatus");
        this.requestedAnimationFrame = null;
        var activeElements = this.fetchActiveElements();

        if (this.hasChanged(activeElements))
        {
            $(this).trigger("update", [activeElements]);
            this.lastResult = activeElements;
        }
    }



    /**
     * Returns, whether the list of active items has changed
     *
     * @private
     * @param {Array.<jQuery>} currentlyActiveElements
     * @returns {boolean}
     */
    hasChanged (currentlyActiveElements)
    {
        if (currentlyActiveElements.length !== this.lastResult.length)
        {
            return true;
        }

        for (var i = 0, l = currentlyActiveElements.length; i < l; i++)
        {
            if (!currentlyActiveElements[i].is(this.lastResult[i]))
            {
                return true;
            }
        }

        return false;
    }



    /**
     * Fetches all active elements
     *
     * @private
     * @returns {Array.<jquery>}
     */
    fetchActiveElements ()
    {
        var activeElements = [];

        for (let $element of this.$itemsToWatch)
        {
            if (ScrollSpy.isActiveElement($element))
            {
                activeElements.push($element);
            }
        }

        return activeElements;
    }



    /**
     * Returns whether the element is active
     *
     * @private
     * @param {jquery} $element
     * @returns {boolean}
     */
    static isActiveElement ($element)
    {
        var viewportMiddle = $(window).scrollTop() + $(window).height() / 2;
        var sectionTop = $element.offset().top;
        var sectionBottom = sectionTop + $element.outerHeight();

        // idea: sectionTop needs to be at least in the middle of the screen (or higher)
        // sectionBottom needs to be at least in the middle of the screen (or lower)
        return sectionTop <= viewportMiddle && viewportMiddle <= sectionBottom;
    }
}

export default ScrollSpy;
