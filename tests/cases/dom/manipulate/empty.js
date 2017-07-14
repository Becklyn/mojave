import QUnit from "qunitjs";
import {empty} from "../../../../dom/manipulate";
import {find} from "../../../../dom/traverse";

QUnit.module("dom/manipulate/empty()",
    {
        beforeEach: () =>
        {
            document.getElementById("qunit-fixture").innerHTML = `
                <p class="test">content</p>
                <p class="test">content</p>
            `;
        },
    }
);


QUnit.test(
    "with valid node element",
    (assert) =>
    {
        const element = find(".test")[0];

        assert.notEqual(element.innerHTML.length, 0, "element contains something before the empty() was executed");
        empty(element);
        assert.equal(element.innerHTML, "", "element is empty");
    }
);


QUnit.test(
    "with an array of elements",
    (assert) =>
    {
        const elements = find(".test");

        assert.notEqual(elements[0].innerHTML, 0, "first element contains something before the empty() was executed");
        assert.notEqual(elements[1].innerHTML, 0, "second element contains something before the empty() was executed");
        empty(elements);
        assert.equal(elements[0].innerHTML, "", "first element is empty");
        assert.equal(elements[1].innerHTML, "", "second element is empty");
    }
);


QUnit.test(
    "with an (query) string as an element",
    (assert) =>
    {
        assert.throws(
            () => {
                empty("#test-element");
            },
            "function threw an error"
        );
    }
);


QUnit.test(
    "with an empty array",
    (assert) =>
    {
        empty([]);
        assert.ok(true, "the previous code should have run successfully");
    }
);
