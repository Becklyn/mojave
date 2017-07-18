/**
 * @typedef {{
 *      ?easing: string|function(number):number,
 * }} mojave.AnimationOptions
 */

import {getStyle, setStyles} from "./css";

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
 */
export function animate (element, properties, duration, options = {})
{
    let values = null;

    animateCallback(
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
}


/**
 * Runs an animation with a custom callback.
 *
 *
 * @param {function(number)} callback
 * @param {number} duration
 * @param {mojave.AnimationOptions} options
 */
export function animateCallback (callback, duration, options = {})
{
    if (typeof options.easing === "undefined")
    {
        options.easing = EASE_IN_OUT_CUBIC;
    }

    if (typeof options.easing !== "function")
    {
        throw new Error("Option `easing` must be a function.");
    }

    window.requestAnimationFrame(
        (time) => runAnimationStep(time, time, callback, duration, options)
    );
}



/**
 * Runs a single animation step
 *
 * @param {number} time
 * @param {number} start
 * @param {function(number)} callback
 * @param {number} duration
 * @param {mojave.AnimationOptions} options
 */
function runAnimationStep (time, start, callback, duration, options)
{
    const linearProgress = Math.min(1, (time - start) / duration);
    const easedProgress = options.easing(linearProgress);
    callback(easedProgress);

    if (linearProgress < 1)
    {
        window.requestAnimationFrame(
            (time) => runAnimationStep(time, start, callback, duration, options)
        );
    }
    else
    {
        console.log("finished");
    }
}
