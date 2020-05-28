/**
 * Combines all class names in the map to a single class string
 */
export function classes (...args: Array<string|{[key: string] : any}>) : string
{
    const list: string[] = [];

    for (let i = 0; i < args.length; i++)
    {
        const entry = args[i];

        if (typeof entry === "string")
        {
            list.push(entry);
        }
        else
        {
            for (let key in entry)
            {
                if (entry[key])
                {
                    list.push(key);
                }
            }
        }
    }

    return list.join(" ");
}
