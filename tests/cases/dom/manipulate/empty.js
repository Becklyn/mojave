import QUnit from "qunitjs";
import {empty} from "../../../../dom/manipulate";

QUnit.module("dom/manipulate/empty()",
    {
        beforeEach: () =>
        {
            document.getElementById("qunit-fixture").innerHTML = `
                <p id="test-element" class="test">content</p>
                <p id="test-element-two" class="test">content</p>
            `;
        },
    }
);


QUnit.test(
    "with valid node element",
    (assert) =>
    {
        const element = document.getElementById("test-element");
        empty(element);

        const result = document.getElementById("test-element");
        assert.equal(result.innerHTML, "", "element is empty");
    }
);


QUnit.test(
    "with an array of elements",
    (assert) =>
    {
        const elements = document.getElementsByClassName("test");
        empty([elements[0], elements[1]]);

        const results = document.getElementsByClassName("test");
        assert.equal(results[0].innerHTML,"", "first element is empty");
        assert.equal(results[1].innerHTML,"", "second element is empty");
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
