/**
 * Wraps parsing of JSON, so that an error is logged, but no exception is thrown
 */
export function safeParseJson<T extends {[k: string]: any}> (value?: string|false|null) : T|null
{
    try
    {
        if (value)
        {
            const content = value.trim();
            return (content !== "")
                ? JSON.parse(content)
                : null;
        }
    }
    catch (e)
    {
        console.error(`Could not parse JSON content: ${e.message}`, e);
    }

    return null;
}

/**
 * Parses JSON from the given element's content.
 */
export function parseElementAsJson<T extends {[k: string]: any}> (element: HTMLElement) : T|null
{
    return safeParseJson(
        (element.textContent || "")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
    );
}
