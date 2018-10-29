declare namespace mojave.types
{
    /**
     * Options for createElement()
     */
    type CreateElementOptions = KeyMap & {
        css? : KeyMap,
        text? : string,
        html? : string,
    }

    /**
     * Allowed argument for DOM insert methods.
     */
    type InsertableElement = string | Element | Element[];

    /**
     * Generic map from string keys -> string | number
     */
    type KeyMap = {[key : string] : string | number};

    /**
     * Generic map from string keys -> string | number | null | boolean
     */
    type OptionalKeyMap = {[key : string] : string | number | null | boolean};

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
