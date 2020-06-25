import {ComponentClass, FunctionComponent, VNode} from "preact";
import {Tuple} from "ts-toolbelt";

declare namespace mojave
{
    type MountableClass = {
        new(...args: any[]): {
            init(): void;
        }
    };
    export type MountableFunction = (element: HTMLElement, ...args: any[]) => void;


    export interface MountOptions
    {
        /**
         * The context to mount into
         */
        context?: Document|HTMLElement;
    }

    export interface ClassMountOptions<T extends mojave.MountableClass> extends MountOptions
    {
        /**
         * Additional parameters to pass as props / constructor arguments
         */
        params?: Tuple.Drop<ConstructorParameters<T>, "1", "->">;
    }

    export interface FunctionMountOptions<T extends mojave.MountableFunction> extends MountOptions
    {
        /**
         * Additional parameters to pass as props / constructor arguments
         */
        params?: Tuple.Drop<Parameters<T>, "1", "->">;
    }

    export interface ComponentMountOptions<T extends ComponentClass<any> | FunctionComponent<any>> extends MountOptions
    {
        /**
         * Additional parameters to pass as props / constructor arguments
         */
        params?: T extends ComponentClass<infer TClassProps>
            ? Partial<TClassProps>
            : T extends (props: infer TFunctionProps, context?: any) => VNode<any> | null
                ? Partial<TFunctionProps>
                : never;

        /**
         * Flag whether the element should be hydrated (if possible) or the mounting element should be removed.
         */
        hydrate?: boolean;
    }


    export type DismissableContainerDirector = {
        (): void;
        destroy(): void;
    }


    /**
     * The generic AJAX protocol.
     */
    export interface AjaxResponse<TData extends object> extends AjaxResponseData<TData>
    {
        /**
         * A redirect target, where the AJAX handler should
         * redirect to.
         */
        redirect?: string;

        /**
         * A toast message with optional type and action target.
         */
        message?: {
            text: string;
            impact: mojaveIntegration.Impact;
            action?: mojaveIntegration.ToastAction;
        };
    }

    /**
     * The actual data of the response.
     *
     * That's the value the promise of the FetchClient is resolved to.
     */
    export interface AjaxResponseData<TData extends object>
    {
        /**
         * Whether the call succeeded.
         */
        ok: boolean;

        /**
         * Any string status, like "ok" or "invalid-id" that
         * you can react to in your code (if you need to).
         */
        status: string;

        /**
         * The response data.
         */
        data: TData;
    }
}

declare namespace mojave.types
{
    /**
     * The default HTMLElement's d.ts only exposes a numbered indexer
     */
    interface StringIndexedHTMLElement extends HTMLElement {
        [index: string]: any;
        style: StringIndexedCSSStyleDeclaration;
    }

    /**
     * The default CSSStyleDeclaration's d.ts only exposes a numbered indexer
     */
    interface StringIndexedCSSStyleDeclaration extends CSSStyleDeclaration {
        [index: string]: any;
    }
}

/**
 * Defines integration interfaces
 */
export module mojaveIntegration
{
    import AjaxResponseData = mojave.AjaxResponseData;
    export type Impact = "positive" | "negative" | "neutral";

    //region Loader
    export interface LoaderInterface
    {
        start (message: string | null): void;
        end (): void;
    }
    //endregion


    //region Toasts
    export interface ToastAction
    {
        label: string;
        action: (() => void) | string;
    }

    export interface ToastManagerInterface
    {
        /**
         * Adds a toast message
         */
        add (message: string, type: Impact, action?: ToastAction): void;
    }

    //endregion

    //region Fetch Client
    export interface FetchOptions
    {
        data?: BodyInit|null;
        headers?: Record<string, string>;
        json?: Record<string|number, any>|Array<any>|null;
        method?: string;

        /**
         * undefined|null = silent mode, no loader
         * string         = use the given string as message
         */
        loading?: string|null;

        /**
         * Flag whether to automatically handle generic request errors:
         *
         *      + posts an error to the console
         *      + displays an error toast
         */
        handleGenericRequestErrors?: boolean;
    }

    export interface FetchClientInterface
    {
        request <TData extends object> (url: string, options: FetchOptions) : Promise<AjaxResponseData<TData>>
    }
    //endregion
}
