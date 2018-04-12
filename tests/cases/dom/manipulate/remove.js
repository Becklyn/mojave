import QUnit from "qunit";
import {findOne} from "../../../../dom/traverse";
import {remove} from "../../../../dom/manipulate";

QUnit.module("dom/manipulate/remove()",
    {
        beforeEach: () =>
        {
            findOne("#qunit-fixture").innerHTML = `
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
        remove(findOne("#first"));

        assert.ok(findOne("#parent"), "parent still exists");
        assert.notOk(findOne("#first"), "has no occurrence");
    }
);


QUnit.test(
    "with an array of elements",
    (assert) =>
    {
        remove([
            findOne("#first"),
            findOne("#second"),
        ]);

        assert.notOk(findOne("#first"), "first element has no occurrence");
        assert.notOk(findOne("#second"), "second element has no occurrence");
        assert.ok(findOne("#third"), "third element has not been removed");
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
