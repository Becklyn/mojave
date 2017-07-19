/**
 * @typedef {{
 *      ?easing: string|function(number):number,
 *      ?stopPrevious: boolean,
 * }} mojave.AnimationOptions
 *
 * @typedef {{
 *      ?easing: string|function(number):number,
 *      currentFrame: ?number,
 *      emitter: mitt,
 * }} mojave.AnimationContext
 *
 * @typedef {{
 *      stop: function(),
 * }} mojave.AnimationDirector
 */

import {getStyle, setStyles} from "./dom/css";
import mitt from "mitt";

// taken from https://gist.github.com/gre/1650294
export const EASE_LINEAR = (t) => t;
export const EASE_IN_QUAD = (t) => t*t;
export const EASE_OUT_QUAD = (t) => t*(2-t);
export const EASE_IN_OUT_QUAD = (t) => t<.5 ? 2*t*t : -1+(4-2*t)*t;
export const EASE_IN_CUBIC = (t) => t*t*t;
export const EASE_OUT_CUBIC = (t) => (--t)*t*t+1;
export const EASE_IN_OUT_CUBIC = (t) => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
export const EASE_IN_QUART = (t) => t*t*t*t;
export const EASE_OUT_QUART = (t) => 1-(--t)*t*t*t;
export const EASE_IN_OUT_QUART = (t) => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;
export const EASE_IN_QUINT = (t) => t*t*t*t*t;
export const EASE_OUT_QUINT = (t) => 1+(--t)*t*t*t*t;
export const EASE_IN_OUT_QUINT = (t) => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t;


/**
 * Animates to the given properties for the given element.
 *
 * @param {HTMLElement} element
 * @param {Object.<string, *>} properties
 * @param {number} duration
 * @param {mojave.AnimationOptions} options
 * @return {mojave.AnimationDirector}
 */
export function animate (element, properties, duration, options = {})
{
    let values = null;

    if (typeof options.stopPrevious !== "undefined" && options.stopPrevious)
    {
        stopAnimation(element);
    }

    const director = animateCallback(
        (progress) => {
            if (null === values)
            {
                // if first run:
                //  - parse current properties
                //  - no update needed, as the progress is 0 in the first run
                values = {};

                for (const property in properties)
                {
                    if (!properties.hasOwnProperty(property))
                    {
                        continue;
                    }

                    const start = getStyle(element, property);
                    values[property] = {
                        start: start,
                        delta: properties[property] - start,
                    };
                }
            }
            else
            {
                // sequential runs
                //  - update values
                const updates = {};

                for (const property in properties)
                {
                    if (!properties.hasOwnProperty(property))
                    {
                        continue;
                    }

                    updates[property] = values[property].start + (values[property].delta * progress);
                }

                setStyles(element, updates);
            }
        },
        duration,
        options
    );

    director.on("finished", () => {
        element._currentAnimation = null;
    });

    element._currentAnimation = director;

    return director;
}


/**
 * Runs an animation with a custom callback.
 *
 *
 * @param {function(number)} callback
 * @param {number} duration
 * @param {mojave.AnimationOptions} options
 * @return {mojave.AnimationDirector}
 */
export function animateCallback (callback, duration, options = {stopPrevious: true})
{
    /** @type {mojave.AnimationContext} context */
    const context = {};

    if (typeof options.easing === "undefined")
    {
        context.easing = EASE_IN_OUT_CUBIC;
    }
    else
    {
        if (typeof options.easing !== "function")
        {
            throw new Error("Option `easing` must be a function.");
        }

        context.easing = options.easing;
    }

    context.currentFrame = null;
    context.emitter = mitt();

    const animationDirector = {
        stop ()
        {
            window.cancelAnimationFrame(context.currentFrame);
        },
        on: context.emitter.on.bind(context.emitter),
    };

    context.emitter.emit("start");
    window.requestAnimationFrame(
        (time) => runAnimationStep(time, time, callback, duration, context)
    );

    return animationDirector;
}



/**
 * Runs a single animation step
 *
 * @param {number} time
 * @param {number} start
 * @param {function(number)} callback
 * @param {number} duration
 * @param {mojave.AnimationContext} context
 */
function runAnimationStep (time, start, callback, duration, context)
{
    const linearProgress = Math.min(1, (time - start) / duration);
    const easedProgress = context.easing(linearProgress);
    callback(easedProgress);

    if (linearProgress < 1)
    {
        context.currentFrame = window.requestAnimationFrame(
            (time) => runAnimationStep(time, start, callback, duration, context)
        );
    }
    else
    {
        context.emitter.emit("finished");
    }
}


export function stopAnimation (element)
{
    if (typeof element._currentAnimation !== "undefined" && element._currentAnimation !== null)
    {
        element._currentAnimation.stop();
        element._currentAnimation = null;
    }
}
