import {after, createElement} from "../../../../dom/manipulate";
import {find, findOne} from "../../../../dom/traverse";
import QUnit from "qunitjs";

QUnit.module("dom/manipulate/after()",
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
    "with node as reference and insert",
    (assert) =>
    {
        const children = findOne("#test-parent").children;
        const insert = createElement("div");
        const afterReference = children[0];
        after(afterReference, insert);

        assert.equal(children[0], afterReference, "element after the reference element still exists and is positioned right before the insert");
        assert.equal(children[1], insert, "reference element still exists and is positioned right after the insert");
    }
);


QUnit.test(
    "with node as reference and html string as a child",
    (assert) =>
    {
        const children = findOne("#test-parent").children;
        const afterReference = children[0];
        after(afterReference, `<div class="test"></div>`);

        assert.equal(children[0], afterReference, "element after the reference element still exists and is positioned right after the insert");
        assert.ok(children[1].classList.contains("test"), "is before the reference element");
    }
);


QUnit.test(
    "with node as reference and an array of nodes as children",
    (assert) =>
    {
        const children = findOne("#test-parent").children;
        const afterReference = children[0];
        const insertArray = [createElement("div"), createElement("div")];
        after(afterReference, insertArray);

        assert.equal(children[0], afterReference, "reference element still exists and is positioned right before the inserts");
        assert.equal(children[1], insertArray[0], "first insert is at the spot after the reference element");
        assert.equal(children[2], insertArray[1], "second insert is after the first insert");
    }
);


QUnit.test(
    "with node as reference and an invalid child",
    (assert) =>
    {
        assert.throws(
            () => {
                after(find(".first")[0], null);
            },
            "function threw an error"
        );
    }
);


QUnit.test(
    "with invalid reference and a node as a child",
    (assert) =>
    {
        assert.throws(
            () => {
                after(null, document.createElement("div"));
            },
            "function threw an error"
        );
    }
);


QUnit.test(
    "with node as reference and an empty child as insert",
    (assert) =>
    {
        after(find(".first")[0], "null");
        assert.ok(true, "the previous code should have run successfully");
    }
);
