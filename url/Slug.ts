export type SlugCharacterReplacementMap = Array<[RegExp|string, string]>;

export class Slug
{
    private readonly transforms : SlugCharacterReplacementMap;
    /**
     * The sanitizing regexp, that removes all unwanted characters
     */
    private readonly sanitize : RegExp;

    constructor (transforms : SlugCharacterReplacementMap = [], sanitize : null|RegExp = null)
    {
        this.transforms = [];
        this.sanitize = null !== sanitize
            ? sanitize
            : /[^a-z0-9\-._~(),;!]/g;

        transforms = transforms.concat([
            [/ä/, "ae"],
            [/[áâà]/, "a"],
            [/ö/, "oe"],
            [/[óôò]/, "o"],
            [/ü/, "ue"],
            [/[úûù]/, "u"],
            [/ß/, "ss"],
        ]);

        // automatically add the g (for "global") modifier to all regexes
        for (let i = 0; i < transforms.length; i++)
        {
            let from = transforms[i][0];

            if (from instanceof RegExp && -1 === from.flags.indexOf("g"))
            {
                if (-1 === from.flags.indexOf("g"))
                {
                    from = new RegExp(from.source, `${from.flags}g`);
                }
            }

            this.transforms.push([
                from,
                transforms[i][1],
            ]);
        }
    }


    /**
     * Transforms a raw slug to a prepared slug
     */
    transform (raw : string) : string
    {
        raw = raw.toLowerCase();

        for (let i = 0; i < this.transforms.length; i++)
        {
            raw = raw.replace(this.transforms[i][0], this.transforms[i][1]);
        }

        return raw
            .replace(this.sanitize, "-")
            .replace(/-+/g, "-")
            .replace(/^-+/, "");
    }
}
