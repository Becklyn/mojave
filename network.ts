import fetch from "./polyfill/fetch";
import {extend} from "./extend";

interface FetchOptions
{
    method?: string;
    headers?: {[name: string]: string};
    data?: BodyInit|null;
    json?: null|{[name: string]: any}|Array<any>,
}


/**
 * Small wrapper to fetch a JSON response
 */
export function request<T extends object = {}> (url: string, options: FetchOptions = {}) : Promise<T>
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

    return fetch(url, {
        body: data,
        cache: "no-cache",
        credentials: "include",
        headers: headers,
        method: options.method || "get",
    })
        .then(response => response.json());
}
