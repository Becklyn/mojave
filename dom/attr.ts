const SPECIAL_ATTRIBUTE_SETTERS = /^(html|text|css)$/;

/**
 * Generic map from string keys -> string | number | null | boolean
 */
export interface OptionalKeyMap
{
    [key: string]: string | number | null | boolean;
}


/**
 * Sets all attributes on the given element
 */
export function setAttrs (element: Element, attributes: OptionalKeyMap): void
{
    for (const key in attributes)
    {
        const value = attributes[key];

        if (SPECIAL_ATTRIBUTE_SETTERS.test(key))
        {
            continue;
        }

        if (value === null || value === false)
        {
            element.removeAttribute(key);
        }
        else
        {
            // @ts-ignore
            if (element[key] !== undefined)
            {
                // @ts-ignore
                element[key] = value;
                continue;
            }

            element.setAttribute(
                key,
                (value === true) ? key : ("" + value),
            );
        }
    }
}
