import {closest, findOne} from "../../../../dom/traverse";
import QUnit from "qunit";

QUnit.module("dom/traverse/closest()",
    {
        beforeEach: () =>
        {
            findOne("#qunit-fixture").innerHTML = `
                <div class="element1">
                    <div class="element1_1">
                        <div class="element1_1_1"></div>
                        <div class="element1_1_2"></div>
                    </div>
                    <div class="element1_2">
                        <div class="element1_2_1"></div>
                        <div class="element1_2_2"></div>
                    </div>
                </div>
                <div class="element2">
                    <div class="element2_1"></div>
                    <div class="element2_2">
                        <div class="element2_2_1"></div>
                        <div class="element2_2_2"></div>
                    </div>
                </div>
                Test123
            `;
        },
    }
);


QUnit.test(
    "find parent",
    (assert) =>
    {
        const fixture = findOne("#qunit-fixture");

        const start = findOne(".element1_2_1", fixture);
        const expected = findOne(".element1_2", fixture);

        const actual = closest(start, ".element1_2");
        assert.strictEqual(actual, expected, "find parent");
    }
);

QUnit.test(
    "find ancestor",
    (assert) =>
    {
        const fixture = findOne("#qunit-fixture");

        const start = findOne(".element1_2_1", fixture);
        const expected = findOne(".element1", fixture);

        const actual = closest(start, ".element1");
        assert.strictEqual(actual, expected, "find ancestor");
    }
);

QUnit.test(
    "find nothing",
    (assert) =>
    {
        const fixture = findOne("#qunit-fixture");

        const start = findOne(".element1_2_1", fixture);
        const actual = closest(start, ".missing");

        assert.strictEqual(actual, null, "nothing found");
    }
);

QUnit.test(
    "does not find itself",
    (assert) =>
    {
        const fixture = findOne("#qunit-fixture");

        const start = findOne(".element1_2_1", fixture);
        const actual = closest(start, ".element1_2_1");

        assert.strictEqual(actual, null, "closest search does not find itself");
    }
);

QUnit.test(
    "with root element, match",
    (assert) =>
    {
        const fixture = findOne("#qunit-fixture");

        const start = findOne(".element1_1_1", fixture);
        const root = findOne(".element1", fixture);
        const expected = findOne(".element1_1", fixture);
        const actual = closest(start, ".element1_1", root);

        assert.strictEqual(actual, expected, "with root element, match");
    }
);


QUnit.test(
    "with root element, no match",
    (assert) =>
    {
        const fixture = findOne("#qunit-fixture");

        const start = findOne(".element1_2_1", fixture);
        const root = findOne(".element1", fixture);
        const actual = closest(start, ".element2", root);

        assert.strictEqual(actual, null, "with root element, no match");
    }
);


QUnit.test(
    "with root element, root itself is excluded",
    (assert) =>
    {
        const fixture = findOne("#qunit-fixture");

        const start = findOne(".element1_2_1", fixture);
        const root = findOne(".element1", fixture);
        const actual = closest(start, ".element1", root);

        assert.strictEqual(actual, null, "with root element, root itself is excluded");
    }
);

