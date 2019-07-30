import {hasOwnProperty} from "../runtime";
import fetch from "./fetch";
import {find} from "../dom/traverse";


type SvgUsages = {
    [key: string]: {
        hash: string,
        element: HTMLElement,
    }[],
};

/**
 * Adds support for <svg><use xlink:href="url#id"/></svg> for older IE and Edge
 */
export default () =>
{
    if (
        // IE 10+
        !/\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/.test(navigator.userAgent) &&
        // Edge 12
        !/\bEdge\/12\.(\d+)\b/.test(navigator.userAgent)
    )
    {
        return;
    }

    const useElements = find("svg use");
    const usages : SvgUsages = {};

    for (let i = 0; i < useElements.length; i++)
    {
        const url = (useElements[i].getAttribute("xlink:href") || "").split("#");

        if (2 !== url.length)
        {
            return;
        }

        if (usages[url[0]] === undefined)
        {
            usages[url[0]] = [];
        }

        usages[url[0]].push({
            hash: url[1],
            element: useElements[i],
        });
    }

    for (const url in usages)
    {
        if (!hasOwnProperty(usages, url))
        {
            continue;
        }

        fetch(url)
            .then(response => response.text())
            .then((data) => {
                const svg = (new DOMParser()).parseFromString(data, "image/svg+xml");
                const root = svg.firstElementChild;

                if (null === root)
                {
                    return;
                }

                document.body.appendChild(root);

                for (let i = 0; i < usages[url].length; i++)
                {
                    const el = usages[url][i];

                    el.element.setAttribute("xlink:href", `#${el.hash}`);
                }
            });
    }
};
