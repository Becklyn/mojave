/**
 * Merges the given objects.
 *
 * Is a simplified "deep extend" functionality. Useful for merging configuration parameters.
 * If the sources don't (syntactically) match or are incompatible with the target,
 * the sources are just ignored.
 *
 * @param {*} target
 * @param {...*} sources
 * @return {*}
 */
export function merge (target, ...sources)
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
    const sourceType = Array.isArray(source) ? "array" : typeof source;
    const targetType = Array.isArray(target) ? "array" : typeof target;


    if (sourceType === targetType)
    {
        // both items are an array: just concat and return
        if ("array" === targetType)
        {
            return target.concat(source);
        }

        // both items are objects. Assume simple objects and merge recursively
        if ("object" === targetType)
        {
            for (const key in source)
            {
                if (source.hasOwnProperty(key))
                {
                    target[key] = (typeof target[key] !== "undefined")
                        ? merge(target[key], source[key])
                        : source[key];
                }
            }

            return target;
        }

        // if these are scalar types (number, boolean, string) just replace the target
        return source;
    }

    // just completely ignore the source if it is incompatible with the target
    //      - if the types don't match
    return target;
}
