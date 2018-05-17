import QUnit from "qunit";
import {typeOf} from "../../../types";


QUnit.module("types/typeOf");


QUnit.test(
    "several test cases",
    (assert) =>
    {
        const cases = [
            [null, "null"],
            [undefined, "undefined"],
            [5, "number"],
            [5.1, "number"],
            ["5", "string"],
            [[], "array"],
            [{}, "object"],
        ];

        cases.forEach((testCase, index) => {

            assert.deepEqual(typeOf(testCase[0]), testCase[1], `TestCase #${index} (${testCase[1]})`);
        });
    }
);
