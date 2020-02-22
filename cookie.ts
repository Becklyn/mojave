import {safeParseJson} from "./json";


export type CookieOptions = Partial<{
    domain: string,
    path: string,
    secure: boolean,
    expires: number|Date,
    sameSite: "strict"|"lax"|null,
}>;


/**
 * Sets a cookie's value. If the value is an object or array, it'll be JSON.stringify and saved as a string
 */
export function setCookie (key : string, value : any, options : CookieOptions = {}) : void
{
    document.cookie = formatCookieString(key, value, options);
}

/**
 * Formats the cookie string
 *
 * @private
 */
export function formatCookieString (key : string, value : any, options : CookieOptions = {}) : string
{
    let config : {[key: string]: string|boolean|null} = {
        domain: options.domain || false,
        path: options.path || "/",
        secure: options.secure || (window.location.protocol === "https:"),
        sameSite: options.sameSite !== undefined ? options.sameSite : "strict",
    };

    // if a Date is given, just use the date.
    // if a number is given, use it as days.
    // if nothing is given, default to 30 days.
    let expireDate = (options.expires instanceof Date)
        ? options.expires
        : new Date((new Date()).getTime() + ((options.expires || 30) * 864e5));

    config.expires = expireDate.toUTCString();


    if (/[^a-z0-9\-_.]/i.test(key))
    {
        throw new Error("Invalid cookie name: only A-Z 0-9 -_. allowed.");
    }

    // encode the cookie value and de-encode characters, that don't need to be escaped.
    const encodedValue = encodeURIComponent(JSON.stringify(value))
        .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
    const encodedOptions = encodeCookieOptions(config);

    return `${key}=${encodedValue};${encodedOptions}`;
}


/**
 * Retrieves a cookie's value
 */
export function getCookie (key : string) : any
{
    const matcher = new RegExp(`; ${key}=([^;]+)`);
    const match = matcher.exec(`; ${document.cookie}`);

    return match ? safeParseJson(decodeURIComponent(match[1])) : null;
}


/**
 * Removes the given cookie
 */
export function removeCookie (key : string) : void
{
    setCookie(key, "", {
        expires: -1,
    });
}


/**
 * @private
 * @param {Object.<string, string|boolean|null>} options
 *
 * @return {string}
 */
function encodeCookieOptions (options : {[key: string]: string|boolean|null}) : string
{
    const encodedOptions = [];

    // eslint-disable-next-line guard-for-in
    for (let optionName in options)
    {
        const optionValue = options[optionName];

        // Flags with a `false` value needs to be omitted
        if (!optionValue)
        {
            continue;
        }

        // RFC 6265 section 5.2:
        // =====================
        // 3.  If the remaining unparsed-attributes contains a %x3B (";") character:
        // Consume the characters of the unparsed-attributes up to, not including, the first %x3B (";") character.
        const sanitizedOption = (optionValue === true)
            ? optionName
            : `${optionName}=${("" + optionValue).split(";")[0]}`;

        encodedOptions.push(sanitizedOption);
    }

    return encodedOptions.join(" ;");
}
