import QUnit from "qunitjs";
import {before} from "../../../../dom/manipulate";
import {find} from "../../../../dom/traverse";

QUnit.module("dom/manipulate/before()",
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
    "with node as reference and insert",
    (assert) =>
    {
        const children = document.getElementById("test-parent").children;
        const insert = document.createElement("div");
        const reference = children[1];
        before(reference, insert);

        assert.equal(children[1], insert, "is at the spot of the reference element");
        assert.equal(children[2], reference, "reference element still exists and is positioned right after the insert");
    }
);


QUnit.test(
    "with node as reference and html string as an insert",
    (assert) =>
    {
        const children = document.getElementById("test-parent").children;
        before(children[1], `<div class="test"></div>`);

        assert.ok(children[1].classList.contains("test"), "is before the reference element");
    }
);


QUnit.test(
    "with node as reference and an array of nodes as inserts",
    (assert) =>
    {
        const children = document.getElementById("test-parent").children;
        const reference = children[1];
        const insertArray = [document.createElement("div"), document.createElement("div")];
        before(reference, insertArray);

        assert.equal(children[1], insertArray[0], "first insert is at the spot of the reference element");
        assert.equal(children[2], insertArray[1], "second insert is after the first insert");
        assert.equal(children[3], reference, "reference element still exists and is positioned right after the inserts");
    }
);


QUnit.test(
    "with node as reference and an invalid insert",
    (assert) =>
    {
        assert.throws(
            () => {
                before(document.getElementById("test-parent").children[0], null);
            },
            "function threw an error"
        );
    }
);


QUnit.test(
    "with invalid reference and a node as an insert",
    (assert) =>
    {
        assert.throws(
            () => {
                before(null, document.createElement("div"));
            },
            "function threw an error"
        );
    }
);


QUnit.test(
    "with node as reference and empty string as an insert",
    (assert) =>
    {
        before(find(".second")[0], "");
        assert.ok(true, "the previous code should have run successfully");
    }
);
