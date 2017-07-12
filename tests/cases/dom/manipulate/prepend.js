import QUnit from "qunitjs";
import {prepend} from "../../../../dom/manipulate";

QUnit.module("dom/manipulate/prepend()",
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
        const prependingChild = document.createElement("div");
        prependingChild.classList.add("className");
        prepend(parent, prependingChild);

        assert.equal(document.getElementsByClassName("className").length, 1, "has one occurrence");
        assert.equal(parent.firstElementChild, prependingChild, "is first element");
    }
);


QUnit.test(
    "with node as parent and html string as a child",
    (assert) =>
    {
        const parent = document.getElementById("test-parent");
        prepend(parent, `<div class="className"></div>`);

        assert.ok(parent.firstElementChild.classList.contains("className"), "is first element");
    }
);


QUnit.test(
    "with node as parent and an array of nodes as children",
    (assert) =>
    {
        const parent = document.getElementById("test-parent");
        const prependingChild = document.createElement("div");
        const secondPrependingChild = document.createElement("div");
        prepend(parent, [prependingChild, secondPrependingChild]);

        assert.equal(parent.firstElementChild, prependingChild, "is first element");
        assert.equal(parent.children[1], secondPrependingChild, "is second element");
    }
);


QUnit.test(
    "with node as parent and invalid child",
    (assert) =>
    {
        assert.throws(
            () => {
                prepend(document.getElementById("test-parent"), null);
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
                prepend(null, document.createElement("div"));
            },
            "function threw an error"
        );
    }
);
