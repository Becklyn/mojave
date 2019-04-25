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

export type RequestFailureReasons = "status" | "invalid_json" | "request_failed";

export interface SuccessResponse<T> {
    response: Response;
    data: T;
}

export interface FailureResponse {
    error: Error;
    reason: RequestFailureReasons;
}


/**
 * Small wrapper to fetch a JSON response
 */
export function request<T extends object = {}> (url: string, options: RequestOptions = {}) : Promise<SuccessResponse<T>|FailureResponse>
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
                                    if (response.status < 200 || response.status >= 500)
                                    {
                                        return reject({response, data, reason: "status"});
                                    }

                                    resolve({data, response});
                                },
                                (error) => reject({error, reason: "invalid_json"})
                            );
                    },
                    (error) => reject({error, reason: "request_failed"}),
                );
        }
    );
}
