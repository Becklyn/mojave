const hasOwnProp = Object.prototype.hasOwnProperty;

/**
 * Merges the given objects
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
    }

    // just completely replace the target with the source
    //      - if the types don't match
    //      - if the types can't be combined
    return source;
}
