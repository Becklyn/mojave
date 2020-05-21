import {parse, stringify} from "query-string";
import { on } from "../dom/events";
import {extend} from "../extend";


export type RouteParams<TParams = Record<string, any>> = TParams;


export type RouteHandler<TParams = Record<string, any>> = (params: RouteParams<TParams>) => void;

type RouteParamNormalizers<TRouteParams> = {
    [TKey in keyof TRouteParams]: ParameterNormalizer<TRouteParams[TKey]>;
};

export type ParameterNormalizer<Target> = (value: any) => Target;

type RouteDefinition<TRouteParams> = {
    handler: RouteHandler<TRouteParams>,
    normalizers: RouteParamNormalizers<TRouteParams>,
};


/**
 * Normalizes the given params with the given normalizers
 */
function normalizeParams (params: RouteParams, normalizers: RouteParamNormalizers<any>) : RouteParams
{
    const result: RouteParams = {};

    for (const key in normalizers)
    {
        // skip internal param
        if ("route" === key)
        {
            continue;
        }

        const value = params[key];

        try
        {
            result[key] = normalizers[key](value);
        }
        catch (e)
        {
            throw new Error(`Missing / invalid value for param '${key}': ${e.message}`);
        }
    }

    return result;
}

/**
 * Generates the query string
 */
function generateQueryString (route: string, params: RouteParams) : string
{
    return "?" + stringify(extend({route}, params), {
        skipNull: true,
        skipEmptyString: true,
        // sort parameters, so that "route" is always the first one
        sort: (left, right) =>
        {
            if (left === "route")
            {
                return -1;
            }

            if (right === "route")
            {
                return 1;
            }

            if (left === right)
            {
                return 0;
            }

            return left < right ? -1 : 1;
        },
    });
}

/**
 * Parses the current query parameters
 */
function parseQueryString (queryString: string) : RouteParams
{
    return parse(queryString, {parseNumbers: true}) as RouteParams;
}


/**
 * A local router that uses URL query parameters for routing
 */
export class LocalRouter
{
    private collection: Record<string, RouteDefinition<any>> = {};
    private useUrl: boolean;


    /**
     */
    public constructor (updateUrl: boolean = true)
    {
        this.useUrl = updateUrl;
    }


    /**
     * Registers a new route handler
     */
    public on <TRouteParams> (
        name: string,
        handler: RouteHandler<TRouteParams>,
        normalizers: RouteParamNormalizers<TRouteParams>
    ) : this
    {
        if (this.collection[name])
        {
            throw new Error("Can't define two routes with the same name.");
        }

        if ("route" in normalizers)
        {
            throw new Error("Can't use 'route' as route parameter");
        }

        this.collection[name] = {handler, normalizers};

        return this;
    }


    /**
     * Initializes the router
     */
    public init (fallbackRoute: string, fallbackParams: RouteParams = {}) : void
    {
        const fallback = this.collection[fallbackRoute];

        // fail early, to always catch the error, even in early exit
        if (!fallback)
        {
            throw new Error(`Invalid initialization: there is no route named '${fallbackRoute}'`);
        }

        if (this.useUrl)
        {
            // register event listener
            on(window, "popstate", () => this.match(document.location.search));

            // try to match
            if (this.match(document.location.search))
            {
                return;
            }
        }

        fallback.handler(normalizeParams(fallbackParams, fallback.normalizers));
    }


    /**
     * Navigates to the given route
     */
    public navigate (route: string, params: RouteParams = {}): void
    {
        const definition = this.collection[route];

        if (!definition)
        {
            throw new Error(`Route not found: ${route}`);
        }

        // let the exception bubble through
        const normalized = normalizeParams(params, definition.normalizers);
        definition.handler(normalized);

        if (this.useUrl && normalized)
        {
            window.history.pushState(
                params,
                document.title,
                generateQueryString(route, normalized)
            );
        }
    }


    /**
     * Tries to match the query string
     */
    private match (queryString: string) : boolean
    {
        const params = parseQueryString(queryString);
        const route = params.route;

        if (typeof route !== "string")
        {
            return false;
        }

        const definition = this.collection[route];

        if (!definition)
        {
            return false;
        }

        try
        {
            definition.handler(normalizeParams(params, definition.normalizers));
            return true;
        }
        catch
        {
            return false;
        }
    }
}
