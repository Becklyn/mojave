import {on} from "../dom/events";
import {parse, stringify} from "query-string";

type GenericQueryParameters = Record<string, number|null>;

export type QueryParameters<TKeys extends keyof GenericQueryParameters> = Pick<GenericQueryParameters, TKeys>;
type AtLeastOne<T, U = {[K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];


export class QueryRouter<TKey extends keyof GenericQueryParameters>
{
    private readonly keys: TKey[];
    private readonly onChange: (data: QueryParameters<TKey>, forceRefresh: boolean) => void;

    /**
     *
     */
    public constructor (keys: TKey[], onChange: (data: QueryParameters<TKey>, forceRefresh: boolean) => void)
    {
        this.keys = keys;
        this.onChange = onChange;
    }


    /**
     * Initializes the query router
     */
    public init () : void
    {
        this.onChange(this.parse(), false);
        on(window, "popstate", (event: PopStateEvent) => this.onHistoryChange(event));
    }


    /**
     * Navigates to the target by overwriting the query parameters
     */
    public navigate (data: AtLeastOne<QueryParameters<TKey>>) : void
    {
        let filled = this.fill(data);
        window.history.pushState(filled, document.title, this.generate(filled));
        this.onChange(filled, false);
    }


    /**
     * Refreshes the current view
     */
    public refresh () : void
    {
        this.onChange(this.parse(), true);
    }


    /**
     *
     */
    private onHistoryChange (event: PopStateEvent) : void
    {
        this.onChange(event.state || this.parse(), false);
    }


    /**
     * Builds the URL
     */
    public generate (data: AtLeastOne<QueryParameters<TKey>>) : string
    {
        return document.location.origin + document.location.pathname + "?" + stringify(data, {skipNull: true});
    }


    /**
     * Parses the query parameters
     */
    private parse () : QueryParameters<TKey>
    {
        let parsed: Partial<QueryParameters<TKey>> = {};
        let data = parse(document.location.search, {parseNumbers: true});

        this.keys.forEach(key => {
            let value = data[key] as string|number|null;

            if (typeof value == "string")
            {
                value = parseInt(value, 10);

                if (isNaN(value))
                {
                    value = null;
                }
            }

            parsed[key] = (typeof value == "number")
                ? value
                : null;
        });

        return parsed as QueryParameters<TKey>;
    }


    /**
     * Fills all gaps in the provided data.
     */
    private fill (data: Partial<QueryParameters<TKey>>) : QueryParameters<TKey>
    {
        this.keys.forEach(key => {
            if (data[key] === undefined)
            {
                data[key] = null;
            }
        });

        return data as QueryParameters<TKey>;
    }


    /**
     * Creates a generator for props, that can be applied to any element.
     *
     * You use it in a JSX component like this:
     *
     * <a {...router.linkProperties({id: 5, page: 3})}>...</a>
     *
     * It will automatically generate all required props to wire the link to the router + still enable shift+click.
     */
    public linkProperties (properties: AtLeastOne<QueryParameters<TKey>>) : any
    {
        return {
            href: this.generate(properties),
            onClick: (event: Event) => {
                event.preventDefault();
                this.navigate(properties);
            },
        };
    }
}
