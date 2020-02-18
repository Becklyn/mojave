import QUnit from "qunit";
import {toStringArray} from "../../../../string/manipulate";

QUnit.module("string/manipulate/toStringArray()");


QUnit.test("Test transforms", assert => {
    const cases = [
        [null, []],
        [undefined, []],
        ["", []],
        ["test", ["test"]],
        [["a", "b"], ["a", "b"]],
    ];

    cases.forEach(([input, expected], index) => {
        assert.deepEqual(toStringArray(input), expected, `Test Case: ${index}`);
    });
});
