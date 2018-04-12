/* eslint-disable no-underscore-dangle */
/**
 * @typedef {{
 *      ?easing: string|function(number):number,
 *      ?stopPrevious: boolean,
 *      ?duration: number,
 * }} mojave.AnimationOptions
 *
 * @typedef {{
 *      currentFrame: ?number,
 *      easing: function(number):number,
 *      duration: number,
 *      ?stopPrevious: boolean,
 *      onAnimationFinished: function(boolean),
 * }} mojave.AnimationContext
 *
 * @typedef {{
 *      stop: function(),
 * }|Promise} mojave.AnimationDirector
 */

import "./polyfill/promise";
import {getStyle, setStyles} from "./dom/css";
import {merge} from "./extend";

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
 * @param {mojave.AnimationOptions} options
 * @return {mojave.AnimationDirector}
 */
export function animate (element, properties, options = {})
{
    let values = null;

    // stop previous animation by default
    if (typeof options.stopPrevious === "undefined" || true === options.stopPrevious)
    {
        stopAnimation(element);
    }

    const director = animateCallback(
        (progress) =>
        {
            if (null === values)
            {
                // if first run:
                //  - parse current properties
                //  - no update needed, as the progress is 0 in the first run
                values = fetchPropertyValues(element, properties);
            }
            else
            {
                // consecutive runs
                //  - update values
                applyAllInterpolatedValues(element, values, progress);
            }
        },
        options
    );

    // store the director in the element that is currently animated
    element._currentAnimation = director;

    // register the done callback to remove the director from the element
    const onDone = () => {
        element._currentAnimation = null;
    };
    director.then(onDone, onDone);

    // return the director
    return director;
}


/**
 * Runs an animation with a custom callback.
 *
 *
 * @param {function(number)} callback
 * @param {mojave.AnimationOptions} options
 * @return {mojave.AnimationDirector}
 */
export function animateCallback (callback, options = {})
{
    // first set default options,
    // then merge with given options,
    // then merge with context-specific parameters
    /** @type {mojave.AnimationContext} context */
    const context = merge({
        duration: 400,
        easing: EASE_IN_OUT_CUBIC,
    }, options);

    // set internal parameters
    context.currentFrame = null;

    // Build animation director + promise
    const animationDirector = new Promise((resolve, reject) => {
        context.onAnimationFinished = resolve;
    });

    // register first animation frame
    context.currentFrame = window.requestAnimationFrame(
        (time) => runAnimationStep(time, time, callback, context)
    );

    // add stop() method to animation director (the context needs to be initialized)
    animationDirector.stop = () =>
    {
        context.onAnimationFinished(false);
        window.cancelAnimationFrame(context.currentFrame);
    };

    return animationDirector;
}



/**
 * Runs a single animation step
 *
 * @param {number} time
 * @param {number} start
 * @param {function(number)} callback
 * @param {mojave.AnimationContext} context
 */
function runAnimationStep (time, start, callback, context)
{
    const linearProgress = Math.min(1, (time - start) / context.duration);
    const easedProgress = context.easing(linearProgress);
    callback(easedProgress);

    if (linearProgress < 1)
    {
        context.currentFrame = window.requestAnimationFrame(
            (time) => runAnimationStep(time, start, callback, context)
        );
    }
    else
    {
        context.onAnimationFinished(true);
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



/**
 * Fetches the current values of all the given properties.
 *
 * @param {HTMLElement|Window} element
 * @param {Object.<string, *>} properties
 * @return {Object.<string, {start: number, delta: number}>}
 */
function fetchPropertyValues (element, properties)
{
    const values = {};

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

    return values;
}

/**
 * First this function calculates the new interpolated value according to the current progress.
 * Then all values are applied to the given element.
 *
 * @param {HTMLElement|Window} element
 * @param {Object.<string, {start: number, delta: number}>} initialValues
 * @param {number} progress
 */
function applyAllInterpolatedValues (element, initialValues, progress)
{
    const updates = {};

    for (const property in initialValues)
    {
        if (!initialValues.hasOwnProperty(property))
        {
            continue;
        }

        updates[property] = initialValues[property].start + (initialValues[property].delta * progress);
    }

    setStyles(element, updates);
}
