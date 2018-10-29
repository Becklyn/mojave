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
