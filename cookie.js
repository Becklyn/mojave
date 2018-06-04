import { merge } from "./extend";

/**
 * @typedef {{
 *      domain: string,
 *      path: string,
 *      secure: boolean,
 *      ?expires: number|Date,
 * }} mojave.CookieOptions
 */


/**
 * Sets a cookie's value. If the value is an object or array, it'll be JSON.stringify and saved as a string
 *
 * @param {string} key
 * @param {*} value
 * @param {mojave.CookieOptions} options
 */
export function setCookie (key, value, options = {})
{
    document.cookie = formatCookieString(key, value, options);
}

/**
 * Formats the cookie string
 *
 * @private
 * @param {string} key
 * @param {*} value
 * @param {mojave.CookieOptions} options
 * @returns {string}
 */
export function formatCookieString (key, value, options = {})
{
    options = merge({
        path: "/",
        secure: window.location.protocol === "https",
        expires: 30,
    }, options);

    if (typeof options.expires === "number")
    {
        options.expires = new Date((new Date()).getTime() + (options.expires * 864e+5));
    }

    options.expires = !options.expires ? "" : options.expires.toUTCString();

    if (/[^a-z0-9\-_.]/i.test(key))
    {
        throw new Error("Invalid cookie name: only A-Z 0-9 -_. allowed.");
    }

    // encode the cookie value and de-encode characters, that don't need to be escaped.
    const encodedValue = encodeURIComponent(JSON.stringify(value))
        .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
    const encodedOptions = encodeCookieOptions(options);

    return `${key}=${encodedValue};${encodedOptions}`;
}


/**
 * Retrieves a cookie's value
 *
 * @param {string} key
 *
 * @returns {*|null}
 */
export function getCookie (key)
{
    const matcher = new RegExp(`; ${key}=([^;]+)`);
    const match = matcher.exec(`; ${document.cookie}`);

    return null !== match
        ? JSON.parse(decodeURIComponent(match[1]))
        : null;
}


/**
 * Removes the given cookie
 *
 * @param {string} key
 */
export function removeCookie (key)
{
    setCookie(key, "", {
        expires: -1,
    });
}


/**
 * @private
 * @param {Object.<string, string|boolean>} options
 *
 * @return {string}
 */
function encodeCookieOptions (options)
{
    const encodedOptions = [];

    // eslint-disable-next-line guard-for-in
    for (let optionName in options)
    {
        const optionValue = options[optionName];

        // Flags with a `false` value needs to be omitted
        if (!options.hasOwnProperty(optionName) || optionValue === false)
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
