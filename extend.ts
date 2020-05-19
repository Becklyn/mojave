import {hasOwnProperty} from "./runtime";
import {typeOf} from "./types";

/**
 * Merges the given objects.
 *
 * Is a simplified "deep extend" functionality. Useful for merging configuration parameters.
 * If the sources don't (syntactically) match or are incompatible with the target,
 * the sources are just ignored.
 */
export function merge <T extends Record<string|number, any>> (target : T, ...sources : Partial<T>[]) : T
{
    // no source given: just return the target
    if (0 === sources.length)
    {
        return target;
    }

    // multiple sources given. Just apply them iteratively
    if (1 < sources.length)
    {
        let result = target;

        for (let i = 0; i < sources.length; i++)
        {
            result = merge(result, sources[i]);
        }

        return result;
    }

    // only one source given
    const source = sources[0];
    const sourceType = typeOf(source);
    const targetType = typeOf(target);

    // null is implicitly compatible with any (scalar) type
    if (sourceType === targetType || "null" === sourceType || "null" === targetType)
    {
        // both items are an array: just concat and return
        if ("array" === targetType)
        {
            return (target as any).concat(source);
        }

        // both items are objects. Assume simple objects and merge recursively
        if ("object" === targetType)
        {
            for (const key in source)
            {
                target[key] = (target[key] !== undefined)
                    ? merge(target[key], source[key] as any)
                    : source[key] as any;
            }

            return target;
        }

        // if these are scalar types (number, boolean, string) just replace the target
        return source as any;
    }

    // just completely ignore the source if it is incompatible with the target
    //      - if the types don't match
    return target;
}


/**
 * Extends the component without mutating any of the sources.
 * Is basically a shallow object copy.
 */
export function extend<T,U> (target: T, source: U) : T & U;
export function extend<T,U,V> (target: T, source: U, source2: V) : T & U & V;
export function extend<T,U,V,W> (target: T, source: U, source2: V, source3: W) : T & U & V & W;
export function extend (
    source: Record<string|number, any>,
    ...sources : Array<Record<string|number, any>>
) : Record<string|number, any>
{
    const target: Record<string|number, any> = {};
    sources.unshift(source);

    for (let i = 0; i < sources.length; i++) {
        let source = sources[i];

        for (const key in source)
        {
            if (hasOwnProperty(source, key))
            {
                target[key] = source[key];
            }
        }
    }

    return target;
}
