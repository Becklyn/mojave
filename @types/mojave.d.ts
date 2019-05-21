import {ComponentFactory} from "preact";

declare namespace mojave
{
    type MountableClass = {
        new(...args: any[]): {
            init(): void;
        }
    };
    export type MountableType = "func" | "jsx" | "class";
    export type MountableFunction = (element: HTMLElement) => void;
    export type Mountable = MountableFunction|MountableClass|ComponentFactory<any>;


    export interface MountOptions
    {
        /**
         * The context to mount into
         */
        context?: Document|HTMLElement;
    }

    export interface ClassMountOptions extends MountOptions
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
