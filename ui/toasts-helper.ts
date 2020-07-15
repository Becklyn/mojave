import {ComponentChildren} from "preact";
import {mojaveIntegration} from "../@types/mojave";


/**
 * @internal
 */
export function extractTextFromComponentChildren (value: any) : string
{
    if (!value)
    {
        return "";
    }

    if (typeof value == "string" || typeof value == "number")
    {
        return "" + value;
    }

    if (Array.isArray(value))
    {
        return value.map(nested => extractTextFromComponentChildren(nested))
            .join("");
    }
    else if (value.type && value.props && value.props.children)
    {
        return extractTextFromComponentChildren(value.props.children);
    }

    return "";
}


/**
 * Calculates how long the toast should be visible
 *
 * @internal
 */
export function calculateToastDuration (message: ComponentChildren, action?: mojaveIntegration.ToastAction) : number
{
    let duration = 5000;
    const text = extractTextFromComponentChildren(message);

    if (text)
    {
        // allow 80ms per character in the text
        duration = text.length * 80;
    }

    if (action)
    {
        // add 3 seconds if there is an action
        duration += 3000;
    }

    // the duration should at least be 5s and at most 15s
    return Math.max(5000, Math.min(15000, duration));
}
