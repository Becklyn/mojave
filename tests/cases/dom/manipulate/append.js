import QUnit from "qunitjs";
import {append} from "../../../../dom/manipulate";

QUnit.module("dom/manipulate/append()",
    {
        beforeEach: () =>
        {
            document.getElementById("qunit-fixture").innerHTML = `
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
        const parent = document.getElementById("test-parent");
        const appendingChild = document.createElement("div");
        const className = "identifier";
        appendingChild.classList.add(className);
        append(parent, appendingChild);

        assert.equal(document.getElementsByClassName(className).length, 1, "has one occurrence");
        assert.equal(parent.lastElementChild, appendingChild, "is last element");
    }
);


QUnit.test(
    "with node as parent and html string as a child",
    (assert) =>
    {
        const parent = document.getElementById("test-parent");
        const className = "identifier";
        append(parent, `<div class="${className}"></div>`);

        assert.ok(parent.lastElementChild.classList.contains(className), "is last element");
    }
);


QUnit.test(
    "with node as parent and an array of nodes as children",
    (assert) =>
    {
        const parent = document.getElementById("test-parent");
        const appendingChild = document.createElement("div");
        const secondAppendingChild = document.createElement("div");
        append(parent, [appendingChild, secondAppendingChild]);

        assert.equal(parent.children[parent.children.length - 2], appendingChild, "is second to last element");
        assert.equal(parent.lastElementChild, secondAppendingChild, "is last element");
    }
);


QUnit.test(
    "with node as parent and an invalid child",
    (assert) =>
    {
        assert.throws(
            () => {
                append(document.getElementById("test-parent"), null);
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
