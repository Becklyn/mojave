import QUnit from "qunitjs";
import {createElement} from "../../../../dom/manipulate";

QUnit.module("dom/manipulate/createElement()");


QUnit.test(
    "with one parameter",
    (assert) =>
    {
        const tagName = "div";
        const className = "identifier";
        const element = createElement(tagName);
        element.classList.add(className);
        document.getElementById("qunit-fixture").appendChild(element);

        const result = document.getElementsByClassName(className);
        assert.equal(result.length, 1, "element was only created once");
        assert.equal(result[0], element, `created <${tagName}>`);
    }
);


QUnit.test(
    "with one parameter (parameter is custom tag)",
    (assert) =>
    {
        const tagName = "customtagname";
        const className = "identifier";
        const element = createElement(tagName);
        element.classList.add(className);
        document.getElementById("qunit-fixture").appendChild(element);

        assert.equal(document.getElementsByClassName(className)[0], element, `created <${tagName}>`);
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
        const tagName = "div";
        const className = "identifier";
        const width = 100;
        const cssAttributeName = "display";
        const cssAttributeValue = "none";
        const element = createElement(tagName,
            {
                class: className,
                width: width,
                css: {
                    [cssAttributeName]: cssAttributeValue,
                },
            }
        );
        document.getElementById("qunit-fixture").appendChild(element);

        const result = document.getElementsByClassName(className)[0];
        assert.equal(result, element, `created <${tagName}> with the expected class`);
        assert.equal(result.getAttribute("width"), width, "width attribute has the expected value");
        assert.equal(result.getAttribute("style"), `${cssAttributeName}: ${cssAttributeValue};`, "style attribute has the expected value");
    }
);


QUnit.test(
    "with two parameters (second parameter contains html)",
    (assert) =>
    {
        const tagName = "div";
        const className = "identifier";
        const innerHtml = "<div></div>";
        const element = createElement(tagName,
            {
                class: className,
                html: innerHtml,
            }
        );
        document.getElementById("qunit-fixture").appendChild(element);

        assert.equal(document.getElementsByClassName(className)[0].innerHTML, innerHtml, "innerHTML was added");
    }
);


QUnit.test(
    "with two parameters (second parameter contains text and html)",
    (assert) =>
    {
        const tagName = "div";
        const className = "identifier";
        const text = "test text";
        const innerHtml = "<div></div>";
        const element = createElement(tagName,
            {
                class: className,
                html: innerHtml,
                text: text,
            }
        );
        document.getElementById("qunit-fixture").appendChild(element);

        const result = document.getElementsByClassName(className)[0];
        assert.equal(result.textContent, text, "text was added");
        assert.equal(result.innerHTML.indexOf(innerHtml.substr(0, (innerHtml.indexOf(">") + 1))), -1, "innerHTML was ignored");
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
