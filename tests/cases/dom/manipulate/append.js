import {append, createElement} from "../../../../dom/manipulate";
import {children, find, findOne} from "../../../../dom/traverse";
import QUnit from "qunit";

QUnit.module("dom/manipulate/append()",
    {
        beforeEach: () =>
        {
            findOne("#qunit-fixture").innerHTML = `
                <div id="test-parent">
                    <div class="first"></div>
                    <div class="second"></div>
                </div>
            `;
        },
    }
);


QUnit.test(
    "with node as parent and child",
    (assert) =>
    {
        const parent = findOne("#test-parent");
        const appendingChild = createElement(`<div class="className"></div>`);
        append(parent, appendingChild);

        assert.equal(find(".className").length, 1, "has one occurrence");
        assert.equal(parent.lastElementChild, appendingChild, "is last element");
    }
);


QUnit.test(
    "with node as parent and html string as a child",
    (assert) =>
    {
        const parent = findOne("#test-parent");
        append(parent, `<div class="className"></div>`);

        assert.ok(parent.lastElementChild.classList.contains("className"), "is last element");
    }
);


QUnit.test(
    "with node as parent and an array of nodes as children",
    (assert) =>
    {
        const parent = findOne("#test-parent");
        const appendingChildren = [createElement("div"), createElement("div")];
        append(parent, appendingChildren);

        const childElements = children(parent);
        assert.equal(childElements[2], appendingChildren[0], "is second to last element");
        assert.equal(childElements[3], appendingChildren[1], "is last element");
    }
);


QUnit.test(
    "with node as parent and an invalid child",
    (assert) =>
    {
        assert.throws(
            () => {
                append(findOne("#test-parent"), null);
            },
            "function threw an error"
        );
    }
);


QUnit.test(
    "with invalid parent and a node as a child",
    (assert) =>
    {
        assert.throws(
            () => {
                append(null, document.createElement("div"));
            },
            "function threw an error"
        );
    }
);
