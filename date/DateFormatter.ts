interface FormatMap
{
    [key: string]: Intl.DateTimeFormatOptions;
}

/**
 * All possible available formats, that might be used in an app.
 */
export const EXTENDED_FORMATS: FormatMap = {
    date: {day: "2-digit", month: "2-digit", year: "numeric"},
    time: {hour: "2-digit", minute: "2-digit", second: "2-digit"},
    full: {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"},
    "date.short": {day: "2-digit", month: "2-digit"},
    "date.text": {day: "2-digit", month: "long", year: "numeric"},
    "date.text.short": {day: "2-digit", month: "short", year: "numeric"},
    "date.month": {day: "2-digit", month: "long"},
    "date.month.short": {day: "2-digit", month: "short"},
};

/**
 * The minimal set of available formats
 */
export const FORMATS: FormatMap = {
    date: {day: "2-digit", month: "2-digit", year: "numeric"},
    full: {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"},
    "date.text": {day: "2-digit", month: "long", year: "numeric"},
};

/**
 *
 */
export class DateFormatter
{
    private locale: string[]|string|undefined;
    private formatters: {[key: string]: Intl.DateTimeFormat} = {};
    private options: FormatMap;


    /**
     *
     */
    constructor (locale?: string|string[], optionsMap: FormatMap = FORMATS)
    {
        this.locale = locale;
        this.options = optionsMap;
    }


    /**
     * Formats the date with the given format
     */
    format (format: string, date: Date) : string
    {
        if (!this.formatters[format])
        {
            let options = this.options[format];

            if (!options)
            {
                throw new Error(`Unknown format '${format}'`);
            }

            this.formatters[format] = new Intl.DateTimeFormat(this.locale, options);
        }

        // IE 11 inserts some (invisible) LTR characters, that can be removed (as we only support LTR).
        return this.formatters[format].format(date).replace(/\u200E/g,"");
    }
}
