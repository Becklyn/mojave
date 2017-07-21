import {findOne, next} from "../../../../dom/traverse";
import QUnit from "qunitjs";

QUnit.module("dom/traverse/next()",
    {
        beforeEach: () =>
        {
            findOne("#qunit-fixture").innerHTML = `
                <div class="test-element element1"></div>
                <div class="test-element element2">
                    <div class="test-element element2-1"></div>
                </div>
                Some text
                <div class="test-element element3"></div>
                <div class="test-element element4"></div>
                <div class="test-element element5"></div>
                <div class="test-element element6"></div>
            `;
        },
    }
);


QUnit.test(
    "next() with an element in the middle, without selector",
    (assert) =>
    {
        const element = findOne(".element2");

        const result = next(element);

        assert.ok(result, "found 1 element");
        assert.ok(result.classList.contains("element3"), "found .element3");
    }
);


QUnit.test(
    "next() with an element at the end, without selector",
    (assert) =>
    {
        const element = findOne(".element6");

        const result = next(element);

        assert.ok(null === result, "found 0 elements");
    }
);


QUnit.test(
    "next() with an element at the start, with selector",
    (assert) =>
    {
        const element = findOne(".element1");

        const result = next(element, ".element3");

        assert.ok(result, "found 1 element");
        assert.ok(result.classList.contains("element3"), "found .element3");
    }
);


QUnit.test(
    "next() with a selector where nothing matches",
    (assert) =>
    {
        const element = findOne(".element1");

        const result = next(element, ".missing");

        assert.ok(null === result, "found 0 elements");
    }
);
