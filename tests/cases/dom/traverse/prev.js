import {findOne, prev} from "../../../../dom/traverse";
import QUnit from "qunitjs";

QUnit.module("dom/traverse/prev()",
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
    "prev() with an element in the middle, without selector",
    (assert) =>
    {
        const element = findOne(".element3");

        const result = prev(element);

        assert.ok(result, "found 1 element");
        assert.ok(result.classList.contains("element2"), "found .element2");
    }
);


QUnit.test(
    "prev() with an element at the start, without selector",
    (assert) =>
    {
        const element = findOne(".element1");

        const result = prev(element);

        assert.ok(null === result, "found 0 elements");
    }
);


QUnit.test(
    "prev() with an element at the end, with selector",
    (assert) =>
    {
        const element = findOne(".element6");

        const result = prev(element, ".element2");

        assert.ok(result, "found 1 element");
        assert.ok(result.classList.contains("element2"), "found .element2");
    }
);
