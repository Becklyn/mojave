import {findOne, nextAll} from "../../../../dom/traverse";
import QUnit from "qunit";

QUnit.module("dom/traverse/nextAll()",
    {
        beforeEach: () =>
        {
            findOne("#qunit-fixture").innerHTML = `
                <div class="test-element element1"></div>
                <div class="test-element test-class element2">
                    <div class="test-element element2-1"></div>
                </div>
                Some text
               <div class="test-element test-class element3"></div>
                <div class="test-element element4"></div>
                <div class="test-element element5"></div>
                <div class="test-element element6"></div>
            `;
        },
    }
);


QUnit.test(
    "nextAll() with an element in the middle, without selector",
    (assert) =>
    {
        const element = findOne(".element4");

        const result = nextAll(element);

        assert.equal(result.length, 2, "found 2 elements");
        assert.ok(result[0].classList.contains("element5"), "found .element5");
        assert.ok(result[1].classList.contains("element6"), "found .element6");
    }
);


QUnit.test(
    "nextAll() with an element at the start, without selector",
    (assert) =>
    {
        const element = findOne(".element1");

        const result = nextAll(element);

        assert.equal(result.length, 5, "found 5 elements");
        assert.ok(result[0].classList.contains("element2"), "found .element2");
        assert.ok(result[1].classList.contains("element3"), "found .element3");
        assert.ok(result[2].classList.contains("element4"), "found .element4");
        assert.ok(result[3].classList.contains("element5"), "found .element5");
        assert.ok(result[4].classList.contains("element6"), "found .element6");
    }
);


QUnit.test(
    "nextAll() with an element at the end, without selector",
    (assert) =>
    {
        const element = findOne(".element6");

        const result = nextAll(element);

        assert.equal(result.length, 0, "found 0 elements");
    }
);


QUnit.test(
    "nextAll() with an element at the start, with selector",
    (assert) =>
    {
        const element = findOne(".element1");

        const result = nextAll(element, ".test-class");

        assert.equal(result.length, 2, "found 2 elements");
        assert.ok(result[0].classList.contains("element2"), "found .element2");
        assert.ok(result[1].classList.contains("element3"), "found .element3");
    }
);
