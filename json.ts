/**
 * Wraps parsing of JSON, so that an error is logged, but no exception is thrown
 */
function safeParseJson (value?: string|boolean|null) : {[k: string]: any}|null
{
    if (!value)
    {
        return null;
    }

    try
    {
        const content = value.trim();
        return (content !== "")
            ? JSON.parse(content)
            : null;
    }
    catch (e)
    {
        console.error(`Could not parse JSON content: ${e.message}`, e);
        return null;
    }
}


