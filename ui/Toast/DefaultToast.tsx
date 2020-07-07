import {h, JSX, RenderableProps} from "preact";
import {mojaveIntegration} from "../../@types/mojave";

export interface DefaultToastProps
{
    impact?: mojaveIntegration.Impact;
    action?: mojaveIntegration.ToastAction;
}

/**
 * Renders a single toast message
 */
export function DefaultToast (props: RenderableProps<DefaultToastProps>): JSX.Element
{
    let wrapperClasses = "toast";
    let action: preact.ComponentChild = null;

    if (props.impact)
    {
        wrapperClasses += ` toast-${props.impact}`;
    }

    if (null != props.action)
    {
        let doAction = props.action.action;
        // if 0 idea why we need to suddenly cast these, but without it, the TS compilation fails with
        action = (typeof doAction === "string")
            ? <a href={doAction} class="toast-action-button">{props.action.label}</a> as any
            : <button type="button" class="toast-action-button" onClick={doAction}>{props.action.label}</button> as any;
    }

    return (
        <div class={wrapperClasses}>
            <div class="toast-message content">{props.children}</div>
            {null !== action && (
                <div class="toast-action">{action}</div>
            )}
        </div>
    ) as any;
}
