import {mojaveIntegration} from "../@types/mojave";
import {createUnstyledElement, toggleClass} from "../dom/manipulate";
import {inNextFrame} from "../timing";


/**
 * Implements a global loader that appends itself on the body.
 * Allows nested "loading" calls.
 */
export class OverlayLoader implements mojaveIntegration.LoaderInterface
{
    private spinnerHtml: string;
    private stack: Array<string[]> = [];
    private overlay: HTMLElement;

    /**
     *
     */
    public constructor (spinnerHtml: string)
    {
        this.spinnerHtml = spinnerHtml;
        this.overlay = createUnstyledElement('div', {
            class: "overlay-loader",
        });
        document.body.appendChild(this.overlay);
    }


    /**
     *
     */
    public start (...messages: string[]) : void
    {
        this.stack.push(messages);
        this.render();
    }


    /**
     *
     */
    public end () : void
    {
        this.stack.pop();
        this.render();
    }


    /**
     * Renders the loader
     */
    private render () : void
    {
        toggleClass(this.overlay, "is-active", this.stack.length > 0);

        // clear content
        this.overlay.innerHTML = "";

        if (this.stack.length)
        {
            const element = createUnstyledElement(`
                <div class="loader">
                    <div class="loader-graphic">${this.spinnerHtml}</div>
                </div>
            `);

            const messages = this.stack[this.stack.length - 1];

            if (messages.length)
            {
                const messageElement = createUnstyledElement('div', {
                    class: "loader-message",
                });

                element.appendChild(messageElement);

                messages.forEach(
                    line => messageElement.appendChild(createUnstyledElement("span", {
                        text: line,
                    }))
                );
            }

            this.overlay.appendChild(element);
            inNextFrame(() => this.overlay.classList.add("is-visible"));
        }
        else
        {
            this.overlay.classList.remove("is-visible");
        }
    }
}
