import fetch from "./polyfill/fetch";
import {extend} from "./extend";

export interface RequestOptions
{
    method?: string;
    headers?: {[name: string]: string};
    data?: BodyInit|null;
    json?: null|{[name: string]: any}|Array<any>;
    credentials?: boolean;
}

/**
 * Promise return value if the request succeeded, and the promise resolves.
 *
 * The success flag indicates if the request was performed successfully (will be false if the status code was `400`).
 */
export interface SuccessResponse<T> {
    response: Response;
    success: boolean;
    data: T;
}


/**
 * All promise return values in the rejection cases.
 */
export type FailureResponse = RequestFailureResponse | JsonFailureResponse | StatusFailureResponse;

/**
 * Promise return value if the request failed
 */
export interface RequestFailureResponse {
    error: Error;
    reason: "request_failed";
}

/**
 * Promise return value if the JSON decoding failed
 */
export interface JsonFailureResponse {
    error: Error;
    response: Response;
    reason: "invalid_json";
}

/**
 * Promise return value if the HTTP status code indicated an (unexpected) error
 */
export interface StatusFailureResponse {
    error: Error;
    response: Response;
    data: any;
    reason: "status";
}


/**
 * Returns whether the response is a FailureResponse
 */
export function isFailureResponse (response: any): response is FailureResponse
{
    return response.reason && response.error;
}

/**
 * Returns whether the response is a RequestFailureResponse
 */
export function isRequestFailure (response: any): response is RequestFailureResponse
{
    return response.reason && "request_failed" === response.reason;
}


/**
 * Returns whether the response is a JsonFailureResponse
 */
export function isJsonFailure (response: any): response is JsonFailureResponse
{
    return response.reason && "invalid_json" === response.reason;
}


/**
 * Returns whether the response is a StatusFailureResponse
 */
export function isStatusFailure (response: any): response is StatusFailureResponse
{
    return response.reason && "invalid_json" === response.reason;
}


/**
 * Small wrapper to fetch a JSON response
 *
 * In case of rejection, it is highly likely that the response is a FailureResponse.
 * Use the type guards above to check for the different cases.
 */
export function request<T extends object = {}> (url: string, options: RequestOptions = {}) : Promise<SuccessResponse<T>>
{
    let headers = extend(options.headers || {}, {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    });
    let data = options.data;

    if (options.json !== undefined)
    {
        data = JSON.stringify(options.json);
        headers["Content-Type"] = "application/json; charset=UTF-8";
    }

    return new Promise(
        (resolve, reject) => {
            fetch(url, {
                body: data,
                cache: "no-cache",
                credentials: false !== options.credentials ? "include" : "omit",
                headers: headers,
                method: options.method || "get",
            })
                .then(response => {
                        return response.json()
                            .then(
                                data =>
                                {
                                    // allow 400, as we pass validation errors as 400 and they should resolve the promise,
                                    // as they are "expected" errors.
                                    if ((response.status >= 200 && response.status < 300) || response.status === 400)
                                    {
                                        return resolve({data, response, success: response.status !== 400});
                                    }

                                    reject({response, data, reason: "status"});
                                },
                                (error) => reject({response, error, reason: "invalid_json"})
                            );
                    },
                    (error) => reject({error, reason: "request_failed"}),
                );
        }
    );
}
