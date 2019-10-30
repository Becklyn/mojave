/**
 * Combines all class names in the map to a single class string
 */
export function classes (...args: Array<string|{[key: string] : any}>) : string
{
    let list = [];

    for (let i = 0; i < args.length; i++)
    {
        let entry = args[i];

        if (typeof entry === "string")
        {
            list.push(args[i]);
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
