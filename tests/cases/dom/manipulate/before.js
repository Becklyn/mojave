import QUnit from "qunitjs";
import {before} from "../../../../dom/manipulate";

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
        const parent = document.getElementById("test-parent");
        const insert = document.createElement("div");
        const reference = document.getElementsByClassName("second")[0];
        before(reference, insert);

        assert.equal(
            Array.prototype.indexOf.call(parent.children, insert),
            Array.prototype.indexOf.call(parent.children, reference) - 1,
            "is before the reference element"
        );
    }
);


QUnit.test(
    "with node as reference and html string as a child",
    (assert) =>
    {
        const parent = document.getElementById("test-parent");
        const reference = document.getElementsByClassName("second")[0];
        const className = "identifierForMyTest";
        before(reference, `<div class="${className}"></div>`);

        assert.ok(
            parent.children[Array.prototype.indexOf.call(parent.children, reference) - 1].classList.contains(className),
            "is before the reference element"
        );
    }
);


QUnit.test(
    "with node as reference and an array of nodes as children",
    (assert) =>
    {
        const parent = document.getElementById("test-parent");
        const reference = document.getElementsByClassName("second")[0];
        const insertArray = [document.createElement("div"), document.createElement("div")];
        before(reference, insertArray);

        assert.equal(
            Array.prototype.indexOf.call(parent.children, insertArray[0]),
            Array.prototype.indexOf.call(parent.children, reference) - insertArray.length,
            "first element of array is before the reference element"
        );
        assert.equal(
            Array.prototype.indexOf.call(parent.children, insertArray[1]),
            Array.prototype.indexOf.call(parent.children, reference) - (insertArray.length - 1),
            "second element of array is after first element of array and is before the reference element"
        );
    }
);


QUnit.test(
    "with node as reference and an invalid child",
    (assert) =>
    {
        assert.throws(
            () => {
                before(document.getElementsByClassName("second")[0], null);
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
                before(null, document.createElement("div"));
            },
            "function threw an error"
        );
    }
);


QUnit.test(
    "with node as reference and empty string as a child",
    (assert) =>
    {
        assert.throws(
            () => {
                before(document.getElementById("testParentElement"), "");
            },
            "function threw an error"
        );
    }
);
