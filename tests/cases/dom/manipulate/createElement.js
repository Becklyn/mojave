import QUnit from "qunit";
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
                createElement(null);
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
                createElement("");
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
                    display: "none",
                },
            }
        );

        assert.ok(element, "created <div> with the expected class");
        assert.equal(element.getAttribute("width"), 100, "width attribute has the expected value");
        assert.equal(element.style.display, "none", "style attribute has the expected value");
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
                createElement("div", null);
            },
            "function threw an error"
        );
    }
);


QUnit.test(
    "with string input",
    (assert) =>
    {
        const element = createElement(`<p class="test">test</p>`);
        assert.equal("P", element.tagName);
        assert.equal("test", element.textContent);
        assert.ok(element.classList.contains("test"));
    }
);


QUnit.test(
    "with invalid root node",
    (assert) =>
    {
        assert.throws(
            () => {
                createElement(`<th class="test">test</th>`);
            },
            "function threw an error"
        );
    }
);
