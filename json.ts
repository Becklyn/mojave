/**
 * Wraps parsing of JSON, so that an error is logged, but no exception is thrown
 */
export function safeParseJson (value?: string|false|null) : {[k: string]: any}|null
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
export function parseElementAsJson (element: HTMLElement) : {[k: string]: any}|null
{
    return safeParseJson(
        (element.textContent || "")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
    );
}
