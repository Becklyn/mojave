import {getAttr, setAttrs} from "../dom/attr";
import fetch from "./fetch";
import {find} from "../dom/traverse";


/**
 * The list of browsers, that need the polyfill
 *
 * @type {RegExp[]}
 */
const BROWSERS = [
    // IE 10+
    /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/,
    // Edge 12
    /\bEdge\/12\.(\d+)\b/,
];


/**
 * Returns, whether the polyfill is required
 *
 * @returns {boolean}
 */
function polyfillRequired ()
{
    for (let i = 0; i < BROWSERS.length; i++)
    {
        if (BROWSERS[i].test(navigator.userAgent))
        {
            return true;
        }
    }

    return false;
}


/**
 * Adds support for <svg><use xlink:href="url#id"/></svg> for older IE and Edge
 */
export default () =>
{
    if (!polyfillRequired())
    {
        return;
    }

    const usages = find("svg use");
    const uses = {};

    for (let i = 0; i < usages.length; i++)
    {
        const url = getAttr(usages[i], "xlink:href").split("#");

        if (2 !== url.length)
        {
            return;
        }

        if (uses[url[0]] === undefined)
        {
            uses[url[0]] = [];
        }

        uses[url[0]].push({
            hash: url[1],
            element: usages[i],
        });
    }

    for (const url in uses)
    {
        if (!uses.hasOwnProperty(url))
        {
            continue;
        }

        fetch(url)
            .then(response => response.text())
            .then((data) => {
                const svg = (new DOMParser()).parseFromString(data, "image/svg+xml");
                document.body.appendChild(svg.firstChild);

                for (let i = 0; i < uses[url].length; i++)
                {
                    const el = uses[url][i];

                    setAttrs(el.element, {
                        "xlink:href": `#${el.hash}`,
                    });
                }
            });
    }
};
