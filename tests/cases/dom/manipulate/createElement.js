import QUnit from "qunitjs";
import {createElement} from "../../../../dom/manipulate";

QUnit.module("dom/manipulate/createElement()");


QUnit.test(
    "with one parameter",
    (assert) =>
    {
        const element = createElement("div");

        assert.equal(element.tagName.toLowerCase(), "div", "created element with <div> tag");
        assert.ok(element instanceof HTMLElement, "is HTMLElement");
    }
);


QUnit.test(
    "with one parameter (parameter is custom tag)",
    (assert) =>
    {
        const element = createElement("customtagname");

        assert.equal(element.tagName.toLowerCase(), "customtagname", "created with custom tag");
        assert.ok(element instanceof HTMLElement, "is HTMLElement");
    }
);


QUnit.test(
    "with one parameter (first parameter is null)",
    (assert) =>
    {
        assert.throws(
            () => {
                const element = createElement(null);
            },
            "function threw an error"
        );
    }
);


QUnit.test(
    "with one parameter (first parameter is an empty string)",
    (assert) =>
    {
        assert.throws(
            () => {
                const element = createElement("");
            },
            "function threw an error"
        );
    }
);


QUnit.test(
    "with two parameters",
    (assert) =>
    {
        const element = createElement("div",
            {
                class: "className",
                width: 100,
                css: {
                    "display": "none",
                },
            }
        );

        assert.ok(element, "created <div> with the expected class");
        assert.equal(element.getAttribute("width"), 100, "width attribute has the expected value");
        assert.equal(element.getAttribute("style"), "display: none;", "style attribute has the expected value");
    }
);


QUnit.test(
    "with two parameters (second parameter contains html)",
    (assert) =>
    {
        const element = createElement("div",
            {
                class: "className",
                html: "<div></div>",
            }
        );

        assert.equal(element.innerHTML, "<div></div>", "innerHTML was added");
    }
);


QUnit.test(
    "with two parameters (second parameter contains text and html)",
    (assert) =>
    {
        const element = createElement("div",
            {
                class: "className",
                html: "<div></div>",
                text: "test text",
            }
        );

        assert.equal(element.textContent, "test text", "text was added");
        assert.equal(element.innerHTML.indexOf("<div>"), -1, "innerHTML was ignored");
    }
);


QUnit.test(
    "with two parameters (second parameter is null)",
    (assert) =>
    {
        assert.throws(
            () => {
                const element = createElement("div", null);
            },
            "function threw an error"
        );
    }
);
