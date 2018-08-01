import { hasData, setData } from "../../../../dom/attr";
import { findOne } from "../../../../dom/traverse";
import QUnit from "qunit";

QUnit.module("dom/attr/hasData()",
    {
        beforeEach: () =>
        {
            findOne("#qunit-fixture").innerHTML = `<input id="id" data-foo="bar" data-empty class="className test test2" style="display: none; visibility: hidden;" data-test="test" readonly>`;
        },
    }
);


QUnit.test(
    "find attribute with value",
    (assert) =>
    {
        const fixture = findOne("#id");

        const actual = hasData(fixture, "foo");
        assert.strictEqual(actual, true, "find attribute with value");
    }
);


QUnit.test(
    "find attribute with no value",
    (assert) =>
    {
        const fixture = findOne("#id");

        const actual = hasData(fixture, "empty");
        assert.strictEqual(actual, true, "find attribute with no value");
    }
);


QUnit.test(
    "find dynamically set attribute",
    (assert) =>
    {
        const fixture = findOne("#id");

        let actual = hasData(fixture, "new-attribute");
        assert.strictEqual(actual, false, "pre set: find dynamically set attribute");

        setData(fixture, "new-attribute", "value");

        actual = hasData(fixture, "new-attribute");
        assert.strictEqual(actual, true, "post set: find dynamically set attribute");
    }
);


QUnit.test(
    "can't find unset attribute",
    (assert) =>
    {
        const fixture = findOne("#id");

        const actual = hasData(fixture, "non-set-attr");
        assert.strictEqual(actual, false, "can't find unset attribute");
    }
);

