/**
 * Wraps parsing of JSON, so that an error is logged, but no exception is thrown
 */
export function safeParseJson<T = unknown> (value?: string|false|null) : T|null
{
    if (value)
    {
        try
        {
            const content = value.trim();
            return (content !== "")
                ? JSON.parse(content) as T
                : null;
        }
        catch (e)
        {
            console.error(`Could not parse JSON content: ${e.message}`, e);
        }
    }

    return null;
}

/**
 * Parses JSON from the given element's content.
 */
export function parseElementAsJson<T = unknown> (element: HTMLElement|null) : T|null
{
    return null !== element
        ? safeParseJson<T>(
            (element.textContent || "")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&amp;/g, "&")
        )
        : null;
}
