import {ComponentClass, FunctionComponent, VNode} from "preact";
import {Tuple} from "ts-toolbelt";

declare namespace mojave
{
    type MountableClass = {
        new(...args: any[]): {
            init(): void;
        }
    };
    export type MountableFunction = (element: HTMLElement, ...args: any[]) => any;


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
            ? TClassProps
            : T extends (props: infer TFunctionProps, context?: any) => VNode<any> | null
                ? TFunctionProps
                : never;

        /**
         * Flag whether the element should be hydrated (if possible) or the mounting element should be removed.
         */
        hydrate?: boolean;
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
