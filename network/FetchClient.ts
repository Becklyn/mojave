import {mojave, mojaveIntegration} from "../@types/mojave";
import {extend} from "../extend";
import AjaxResponse = mojave.AjaxResponse;
import ToastManagerInterface = mojaveIntegration.ToastManagerInterface;
import AjaxResponseData = mojave.AjaxResponseData;


/**
 * The options to create a fetch request with.
 */
export interface FetchOptions
{
    data?: BodyInit|null;
    headers?: Record<string, string>;
    json?: Record<string|number, any>|Array<any>|null;
    method?: string;

    /**
     * undefined = silent mode, no loaderuse default message
     * string    = use the given string as message
     */
    loading?: string;

    /**
     * Flag whether to automatically handle generic request errors:
     *
     *      + posts an error to the console
     *      + displays an error toast
     */
    handleGenericRequestErrors?: boolean;
}

/**
 * Automated fetch client, that transparently handles a large part of the fetch integration.
 */
export class FetchClient
{
    private toasts: ToastManagerInterface;
    private loader: mojaveIntegration.LoaderInterface | null;
    private failureMessage: string;


    /**
     *
     */
    public constructor (
        toasts: ToastManagerInterface,
        failureMessage: string,
        loader: mojaveIntegration.LoaderInterface|null = null,
    )
    {
        this.toasts = toasts;
        this.failureMessage = failureMessage;
        this.loader = loader;
    }


    /**
     * Sends a request
     */
    public request <TData extends object> (url: string, options: FetchOptions) : Promise<AjaxResponseData<TData>>
    {
        const headers = extend(options.headers || {}, {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
        });

        let data = options.data;
        let method = options.method;
        const showGenericRequestErrors = false !== options.handleGenericRequestErrors;

        // start loader, if needed
        if (options.loading && this.loader)
        {
            this.loader.start(options.loading);
        }

        // if JSON is passed, the data is overwritten
        if (options.json)
        {
            data = JSON.stringify(options.json);
            headers["Content-Type"] = "application/json; charset=UTF-8";
        }

        // default to automatically determined method, based on whether any data is passed.
        if (!method)
        {
            method = data ? "post" : "get";
        }

        return new Promise(
            (resolve, reject) =>
            {
                fetch(url, {
                    body: data,
                    cache: "no-cache",
                    credentials: "include",
                    headers: headers,
                    method: method,
                })
                    .then(
                        raw =>
                        {
                            return raw.json().then(
                                // region valid response (with valid json)
                                (data: AjaxResponse<TData>) => this.handleResponse(data),
                                // endregion

                                // region Invalid JSON
                                error =>
                                {
                                    if (showGenericRequestErrors)
                                    {
                                        console.error("Request failed (json)", error);
                                        this.toasts.show(this.failureMessage, "negative");
                                    }

                                    reject();
                                }
                                // endregion
                            )
                        },

                        // region Request failed
                        error => {
                            if (showGenericRequestErrors)
                            {
                                console.error("Request failed (generic)", error);
                                this.toasts.show(this.failureMessage, "negative");
                            }

                            reject();
                        }
                        // endregion
                    )
                    .finally(() => {
                        if (options.loading && this.loader)
                        {
                            this.loader.stop();
                        }
                    });
            }
        );
    }


    /**
     * Handles the response and transforms it to the response data
     */
    protected handleResponse<TData extends object> (
        response: AjaxResponse<TData>
    ) : AjaxResponseData<TData>
    {
        // display toast message
        if (response.message)
        {
            this.toasts.show(
                response.message.text,
                response.message.impact,
                response.message.action
            );
        }

        // handle redirect (must be the last entry)
        if (response.redirect)
        {
            document.location.href = response.redirect;
        }

        // return response
        return {
            ok: response.ok,
            status: response.status,
            data: response.data,
        };
    }
}
