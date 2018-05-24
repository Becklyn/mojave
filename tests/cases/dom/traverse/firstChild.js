import { firstChild, findOne } from "../../../../dom/traverse";
import QUnit from "qunit";

QUnit.module("dom/traverse/firstChild()",
    {
        beforeEach: () =>
        {
            findOne("#qunit-fixture").innerHTML = `
                <div class="element1"></div>
                <div class="element2"></div>
                Test123
            `;
        },
    }
);


QUnit.test(
    "firstChild() without selector",
    (assert) =>
    {
        const fixture = findOne("#qunit-fixture");

        const result = firstChild(fixture);
        assert.ok(result.classList.contains("element1"), "contains .element1");
    }
);


QUnit.test(
    "firstChild() with selector that matches no elements",
    (assert) =>
    {
        const fixture = findOne("#qunit-fixture");

        const result = firstChild(fixture, ".non-existing-element");
        assert.strictEqual(result, null, "is empty");
    }
);


QUnit.test(
    "firstChild() with selector matching two elements",
    (assert) =>
    {
        const fixture = findOne("#qunit-fixture");

        const result = firstChild(fixture, "div");
        assert.ok(result.classList.contains("element1"), "the match has the correct class");
    }
);


QUnit.test(
    "firstChild() with selector",
    (assert) =>
    {
        const fixture = findOne("#qunit-fixture");

        const result = firstChild(fixture, ".element2");
        assert.ok(result.classList.contains("element2"), "the match has the correct class");
    }
);
