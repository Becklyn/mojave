import {ComponentFactory} from "preact";


declare namespace mojave
{
    export interface StandaloneComponentInterface
    {
        init(): void;
    }


    export type MountableType = "func" | "jsx" | "class";
    export type MountableFunction = (element: HTMLElement) => void;
    export type Mountable = MountableFunction|StandaloneComponentInterface|ComponentFactory<any>;


    export interface MountOptions
    {
        /**
         * The context to mount into
         */
        context?: Document|HTMLElement;

        /**
         * The type of the component.
         *      * jsx
         *      * func (default)
         *      * class
         */
        type?: MountableType;
    }

    export interface StandaloneMountOptions extends MountOptions
    {
        type: "class";


        /**
         * Additional parameters to pass as props / constructor arguments
         */
        params?: any[];
    }

    export interface FunctionMountOptions extends MountOptions
    {
        type?: "func";

        /**
         * Additional parameters to pass as props / constructor arguments
         */
        params?: any[];
    }

    export interface ComponentMountOptions extends MountOptions
    {
        type: "jsx";


        /**
         * Additional parameters to pass as props / constructor arguments
         */
        params?: {[k: string]: any};
    }
}
