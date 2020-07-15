import {ComponentChildren, ComponentFactory, h, render} from "preact";
import {act} from "preact/test-utils";
import {mojaveIntegration} from "../@types/mojave";
import {createUnstyledElement} from "../dom/manipulate";
import {inNextFrame} from "../timing";
import {DefaultToast, DefaultToastProps} from "./Toast/DefaultToast";
import {calculateToastDuration} from "./toasts-helper";

interface ToastEntry
{
    impact: mojaveIntegration.Impact;
    text: ComponentChildren;
    action?: mojaveIntegration.ToastAction;
}

// actual duration + buffer
const TRANSITION_DURATION = 400 + 200;


export class ToastManager implements mojaveIntegration.ToastManagerInterface
{
    private queue: ToastEntry[] = [];
    private hasVisible : boolean = false;
    private container : HTMLElement;
    private hideTimeout: number|null = null;
    private toastImplementation: preact.ComponentFactory<DefaultToastProps>;

    /**
     *
     */
    public constructor (toastImplementation?: ComponentFactory<DefaultToastProps>)
    {
        this.toastImplementation = toastImplementation || DefaultToast;
        this.container = createUnstyledElement('div', {
            class: "toast-container",
        });
        document.body.appendChild(this.container);
    }


    /**
     * Adds a neutral toast.
     */
    public neutral (text: ComponentChildren, action?: mojaveIntegration.ToastAction) : void
    {
        this.add(text, "neutral", action);
    }


    /**
     * Adds a positive toast.
     */
    public positive (text: ComponentChildren, action?: mojaveIntegration.ToastAction) : void
    {
        this.add(text, "positive", action);
    }


    /**
     * Adds a negative toast.
     */
    public negative (text: ComponentChildren, action?: mojaveIntegration.ToastAction) : void
    {
        this.add(text, "negative", action);
    }


    /**
     * Adds a toast
     */
    public add (text: ComponentChildren, impact?: mojaveIntegration.Impact, action?: mojaveIntegration.ToastAction) : void
    {
        this.queue.push({
            impact: impact || "neutral",
            text,
            action,
        });
        this.show();
    }


    /**
     * Shows the next toast from the queue
     */
    private show ()
    {
        if (this.hasVisible)
        {
            return;
        }

        const toast = this.queue.shift();

        if (!toast)
        {
            return;
        }

        this.hasVisible = true;
        let action = toast.action;

        if (action && typeof action.action === "function")
        {
            let oldCallback = action.action;
            action = {
                label: action.label,
                action: () => {
                    this.abortShow();
                    oldCallback();
                }
            }
        }

        const Toast = this.toastImplementation;

        render(
            <Toast action={action} impact={toast.impact}>{toast.text}</Toast>,
            this.container
        );

        inNextFrame(() => this.beforeShow(toast));
    }


    /**
     * Callback on when the show of the action should be aborted
     */
    private abortShow () : void
    {
        if (this.hideTimeout)
        {
            window.clearTimeout(this.hideTimeout);
            this.beforeHide();
        }
    }


    /**
     * Callback on when the toast is about to be shown
     */
    private beforeShow (toast: ToastEntry) : void
    {
        this.container.classList.add("is-visible");
        this.hideTimeout = window.setTimeout(
            () => this.beforeHide(),
            TRANSITION_DURATION + calculateToastDuration(toast.text, toast.action)
        );
    }


    /**
     * Callback on when the toast is about to be hidden
     */
    private beforeHide () : void
    {
        this.hideTimeout = null;
        this.container.classList.remove("is-visible");
        window.setTimeout(() => this.afterHide(), TRANSITION_DURATION);
    }


    /**
     * Callback after the toast was hidden
     */
    private afterHide () : void
    {
        // empty the container
        render(null, this.container);
        this.container.innerHTML = "";

        // reset flag
        this.hasVisible = false;

        // start from the beginning
        this.show();
    }
}
