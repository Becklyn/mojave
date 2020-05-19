import "./polyfill/promise";
import {getStyle, setStyles} from "./dom/css";
import {merge} from "./extend";

// global map of active element animations
const elementAnimations = new WeakMap<HTMLElement, AnimationDirector>();

export type AnimationOptions = {
    easing?: string|((progress: number) => number),
    stopPrevious?: boolean,
    duration?: number,
}

export type AnimationDirector = Promise<any> & {
    stop: () => void,
}

type AnimationContext = {
    currentFrame: number|null,
    easing: (progress: number) => number,
    duration: number,
    stopPrevious?: boolean,
    onAnimationFinished: (didFinish: boolean) => void,
}

type PropertyValues = {
    [name: string]: {
        start: number,
        delta: number,
    },
}

// taken from https://gist.github.com/gre/1650294
export const EASE_LINEAR = (t : number) => t;
export const EASE_IN_QUAD = (t : number) => t * t;
export const EASE_OUT_QUAD = (t : number) => t * (2 - t);
export const EASE_IN_OUT_QUAD = (t : number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
export const EASE_IN_CUBIC = (t : number) => t * t * t;
export const EASE_OUT_CUBIC = (t : number) => ((--t) * t * t) + 1;
export const EASE_IN_OUT_CUBIC = (t : number) => t < 0.5 ? 4 * t * t * t : ((t - 1) * (2 * t - 2) * (2 * t - 2)) + 1;
export const EASE_IN_QUART = (t : number) => t * t * t * t;
export const EASE_OUT_QUART = (t : number) => 1 - (--t) * t * t * t;
export const EASE_IN_OUT_QUART = (t : number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
export const EASE_IN_QUINT = (t : number) => t * t * t * t * t;
export const EASE_OUT_QUINT = (t : number) => 1 + (--t) * t * t * t * t;
export const EASE_IN_OUT_QUINT = (t : number) => t < 0.5 ? 16 * t * t * t * t * t : 1 + (16 * (--t) * t * t * t * t);


/**
 * Animates to the given properties for the given element.
 */
export function animate (element : HTMLElement, properties : {[key: string]: any}, options : AnimationOptions = {})
{
    let values : PropertyValues|null = null;

    // stop previous animation by default
    if (options.stopPrevious === undefined || options.stopPrevious)
    {
        stopAnimation(element);
    }

    const director = animateCallback(
        (progress : number) =>
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
    elementAnimations.set(element, director);

    // register the done callback to remove the director from the element
    const onDone = () => {
        elementAnimations.delete(element);
    };
    director.then(onDone, onDone);

    // return the director
    return director;
}


/**
 * Runs an animation with a custom callback.
 */
export function animateCallback (callback : (progress: number) => void, options : AnimationOptions = {}) : AnimationDirector
{
    // first set default options,
    // then merge with given options,
    // then merge with context-specific parameters
    const context : AnimationContext = merge<AnimationOptions>({
        duration: 400,
        easing: EASE_IN_OUT_CUBIC,
    }, options) as AnimationContext;

    // set internal parameters
    context.currentFrame = null;

    // Build animation director + promise
    // we need to use any here, as we only add `stop` later on and otherwise this would be an invalid type in the meantime.
    const animationDirector : any = new Promise(resolve => {
        context.onAnimationFinished = resolve;
    });

    // register first animation frame
    context.currentFrame = window.requestAnimationFrame(
        time => runAnimationStep(time, time, callback, context)
    );

    // add stop() method to animation director (the context needs to be initialized)
    animationDirector.stop = () =>
    {
        context.onAnimationFinished(false);

        if (null !== context.currentFrame)
        {
            window.cancelAnimationFrame(context.currentFrame);
        }
    };

    return animationDirector as AnimationDirector;
}


/**
 * Runs a single animation step
 */
function runAnimationStep (time : number, start : number, callback : (progress: number) => void, context : AnimationContext) : void
{
    const linearProgress = Math.min(1, (time - start) / context.duration);
    const easedProgress = context.easing(linearProgress);
    callback(easedProgress);

    if (linearProgress < 1)
    {
        context.currentFrame = window.requestAnimationFrame(
            time => runAnimationStep(time, start, callback, context)
        );
    }
    else
    {
        context.onAnimationFinished(true);
    }
}


/**
 * Stops any animation on the given element
 */
export function stopAnimation (element : HTMLElement) : void
{
    let director = elementAnimations.get(element);

    if (director !== undefined)
    {
        director.stop();
        elementAnimations.delete(element);
    }
}


/**
 * Fetches the current values of all the given properties.
 */
function fetchPropertyValues (element : HTMLElement|Window, properties : {[name: string]: number}) : PropertyValues
{
    const values : PropertyValues = {};

    for (const property in properties)
    {
        let rawStart = getStyle(element, property);
        let start = null !== rawStart
            ? rawStart as number
            : 0;

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
 */
function applyAllInterpolatedValues (element : HTMLElement|Window, initialValues : PropertyValues, progress : number) : void
{
    const updates : {[name: string]: number} = {};

    for (const property in initialValues)
    {
        updates[property] = initialValues[property].start + (initialValues[property].delta * progress);
    }

    setStyles(element, updates);
}
