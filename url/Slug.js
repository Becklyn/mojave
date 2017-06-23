

export default class Slug
{
    /**
     * Constructs a new instance
     *
     * @param {Array.<Array.<*>>} transforms
     * @param {?RegExp} sanitize
     */
    constructor (transforms = [], sanitize = null)
    {
        /**
         * @private
         * @type {Array.<Array.<RegExp, string>>}
         */
        this.transforms = [];

        /**
         * The sanitizing regexp, that removes all unwanted characters
         *
         * @private
         * @type {RegExp}
         */
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

            if (-1 === from.flags.indexOf("g"))
            {
                from = new RegExp(from.source, `${from.flags}g`);
            }

            this.transforms.push([
                from,
                transforms[i][1],
            ]);
        }
    }


    /**
     * Transforms a raw slug to a prepared slug
     *
     * @param {string} raw
     * @return {string}
     */
    transform (raw)
    {
        // transform to string
        raw = ("" + raw).toLowerCase(); // eslint-disable-line prefer-template

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
