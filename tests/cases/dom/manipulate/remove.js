import QUnit from "qunitjs";
import {remove} from "../../../../dom/manipulate";

QUnit.module("dom/manipulate/remove()",
    {
        beforeEach: () =>
        {
            document.getElementById("qunit-fixture").innerHTML = `
                <div id="parent">
                    <div id="first"></div>
                    <div id="second"></div>
                    <div id="third"></div>
                </div>
            `;
        },
    }
);


QUnit.test(
    "with valid node element",
    (assert) =>
    {
        remove(document.getElementById("first"));

        assert.ok(document.getElementById("parent"), "parent still exists");
        assert.notOk(document.getElementById("first"), "has no occurrence");
    }
);


QUnit.test(
    "with an array of elements",
    (assert) =>
    {
        remove([
            document.getElementById("first"),
            document.getElementById("second")
        ]);

        assert.notOk(document.getElementById("first"), "first element has no occurrence");
        assert.notOk(document.getElementById("second"), "second element has no occurrence");
        assert.ok(document.getElementById("third"), "third element has not been removed");
    }
);


QUnit.test(
    "with an (query) string as an element",
    (assert) =>
    {
        assert.throws(
            () => {
                remove("#first");
            },
            "function threw an error"
        );
    }
);


QUnit.test(
    "with an empty array",
    (assert) =>
    {
        remove([]);
        assert.ok(true, "the previous code should have run successfully");
    }
);


QUnit.test(
    "with an invalid element",
    (assert) =>
    {
        remove(null);
        assert.ok(true, "the previous code should have run successfully");
    }
);
