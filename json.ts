/**
 * Wraps parsing of JSON, so that an error is logged, but no exception is thrown
 */
function safeParseJson (value?: string|null) : {[k: string]: any}
{
    if (!value)
    {
        return {};
    }

    try
    {
        const content = value.trim();
        return (content !== "")
            ? JSON.parse(content)
            : {};
    }
    catch (e)
    {
        console.error(`Could not parse JSON content: ${e.message}`, e);
        return {};
    }
}


