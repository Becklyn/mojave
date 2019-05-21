import {ComponentFactory} from "preact";


declare namespace mojave
{
    export interface StandaloneComponentInterface
    {
        init(): void;
    }


    export type MountableType = "func" | "jsx" | "class";
    export type Mountable = StandaloneComponentInterface|ComponentFactory<any>;


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
        /**
         * Additional parameters to pass as props / constructor arguments
         */
        params?: any[];
    }

    export interface ComponentMountOptions extends MountOptions
    {
        /**
         * Additional parameters to pass as props / constructor arguments
         */
        params?: {[k: string]: any};
    }
}
