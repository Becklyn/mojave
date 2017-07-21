import {children, findOne} from "../../../../dom/traverse";
import QUnit from "qunitjs";

QUnit.module("dom/traverse/children()",
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
    "children() without selector",
    (assert) =>
    {
        const fixture = findOne("#qunit-fixture");

        const result = children(fixture);
        assert.equal(result.length, 2, "has 2 children");
        assert.ok(result[0].classList.contains("element1"), "contains .element1");
        assert.ok(result[1].classList.contains("element2"), "contains .element2");
    }
);


QUnit.test(
    "children() with selector",
    (assert) =>
    {
        const fixture = findOne("#qunit-fixture");

        const result = children(fixture, ".element2");
        assert.equal(result.length, 1, "only one match");
        assert.ok(result[0].classList.contains("element2"), "the match has the correct class");
    }
);
