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
        const id = "first";
        remove(document.getElementById(id));

        assert.ok(document.getElementById("parent"), "parent still exists");
        assert.notOk(document.getElementById(id), "has no occurrence");
    }
);


QUnit.test(
    "with an array of elements",
    (assert) =>
    {
        const firstId = "first";
        const secondId = "second";

        remove([
            document.getElementById(firstId),
            document.getElementById(secondId)
        ]);

        assert.notOk(document.getElementById(firstId), "first element has no occurrence");
        assert.notOk(document.getElementById(secondId), "second element has no occurrence");
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
