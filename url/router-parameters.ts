import {ParameterNormalizer} from "./LocalRouter";


/**
 * Generates a default type error
 *
 * @internal
 */
function typeError (expected: string, value: any): never
{
    throw new Error(
        undefined === value
            ? `Missing parameter, expected ${expected}`
            : `Can't parse value as ${expected}: '${value}'`
    );
}


/**
 * Normalizes the value as string.
 *
 * A missing default means this value is always required.
 */
export function stringParameter (defaultValue?: string) : ParameterNormalizer<string>
{
    return (value: any) =>
    {
        if (null == value)
        {
            return defaultValue === undefined
                ? typeError("string", value)
                : defaultValue;
        }

        return "" + value;
    };
}

/**
 * Normalizes the value as number.
 *
 * A missing default means this value is always required.
 */
export function numberParameter (defaultValue?: number) : ParameterNormalizer<number>
{
    return (value: any) =>
    {
        if (typeof value === "number")
        {
            return value;
        }

        const parsed = parseInt(value, 10);

        if (!isNaN(parsed))
        {
            return parsed;
        }

        // throw if required or invalid (non-empty) value given
        return (defaultValue === undefined || null != value)
            ? typeError("number", value)
            : defaultValue;
    };
}

/**
 * Normalizes the value as boolean.
 *
 * A missing default means this value is always required.
 */
export function booleanParameter (defaultValue?: boolean) : ParameterNormalizer<boolean>
{
    return (value: any) =>
    {
        if (typeof value == "boolean")
        {
            return value;
        }

        const isTrue = "true" === value;

        if ("false" === value || isTrue)
        {
            return isTrue;
        }

        // throw if required or invalid (non-empty) value given
        return (defaultValue === undefined || null != value)
            ? typeError("boolean", value)
            : defaultValue;
    };
}
