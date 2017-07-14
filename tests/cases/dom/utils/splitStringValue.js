import QUnit from "qunitjs";
import {splitStringValue} from "../../../../dom/utils";

QUnit.module("dom/utils/splitStringValue()");


QUnit.test(
    "with string as parameter",
    (assert) =>
    {
        const values = splitStringValue("Value1 Value2 Value3 Value4 Value5");

        assert.equal(values.length, 5, "recognised all values");
        assert.ok(Array.isArray(values), "is Array");
    }
);


QUnit.test(
    "with array as parameter",
    (assert) =>
    {
        const values = splitStringValue(
            ["Value1", "Value2", "Value3", "Value4", "Value5"]
        );

        assert.equal(values.length, 5, "recognised all values");
        assert.ok(Array.isArray(values), "is Array");
    }
);


QUnit.test(
    "with an empty string as parameter",
    (assert) =>
    {
        const values = splitStringValue("");

        assert.equal(values.length, 0, "result has no values");
        assert.ok(Array.isArray(values), "is Array");
    }
);


QUnit.test(
    "with an null as parameter",
    (assert) =>
    {
        assert.throws(
            () => {
                splitStringValue(null);
            },
            "function threw an error"
        );
    }
);
