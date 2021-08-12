/**
 * Tries to detect whether a user is currently browsing using a popular mobile device.
 *
 * The regex is based off the recommendation on MDN: https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
 *
 * - "In summary, we recommend looking for the string 'Mobi' anywhere in the User Agent to detect a mobile device."
 *
 * The 'Android' part is a recommendation based off StackOverflow, since a lot of Android browser UAs contain this word:
 * https://stackoverflow.com/a/24600597/2690438
 */
export function isOnMobileDevice () : boolean
{
    return /Mobi|Android/.test(navigator.userAgent);
}
