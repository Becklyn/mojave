import {findOne, siblings} from "../../../../dom/traverse";
import QUnit from "qunit";

QUnit.module("dom/traverse/siblings()",
    {
        beforeEach: () =>
        {
            findOne("#qunit-fixture").innerHTML = `
                <div class="test-element-find element1"></div>
                <div class="test-element-find element2">
                    <div class="test-element-find element2-1"></div>
                </div>
                Some text
                <div class="test-element-find element3"></div>
            `;
        },
    }
);


QUnit.test(
    "siblings() with an element in the middle",
    (assert) =>
    {
        const element = findOne(".test-element-find.element2");

        const result = siblings(element);

        assert.strictEqual(result.length, 2, "found 2 elements");
        assert.ok(result[0].classList.contains("element1"), "contains .element1");
        assert.ok(result[1].classList.contains("element3"), "contains .element3");
    }
);


QUnit.test(
    "siblings() with an element at the start",
    (assert) =>
    {
        const element = findOne(".test-element-find.element1");

        const result = siblings(element);

        assert.strictEqual(result.length, 2, "found 2 elements");
        assert.ok(result[0].classList.contains("element2"), "contains .element2");
        assert.ok(result[1].classList.contains("element3"), "contains .element3");
    }
);


QUnit.test(
    "siblings() with an element at the end",
    (assert) =>
    {
        const element = findOne(".test-element-find.element3");

        const result = siblings(element);

        assert.strictEqual(result.length, 2, "found 2 elements");
        assert.ok(result[0].classList.contains("element1"), "contains .element1");
        assert.ok(result[1].classList.contains("element2"), "contains .element2");
    }
);


QUnit.test(
    "siblings() with an element without siblings",
    (assert) =>
    {
        const element = findOne(".test-element-find.element2-1");

        const result = siblings(element);

        assert.strictEqual(result.length, 0, "found no elements");
    }
);
