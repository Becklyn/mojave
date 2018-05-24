import {classes} from "../../../classes";
import QUnit from "qunit";

QUnit.module("classes/classes");

QUnit.test(
    "different test cases",
    (assert) =>
    {
        const cases = [
            {
                input: {},
                expected: "",
            },
            {
                input: {
                    a: false,
                    b: true,
                },
                expected: "b",
            },
            {
                input: {
                    a: false,
                    b: false,
                },
                expected: "",
            },
            {
                input: {
                    a: true,
                    b: true,
                },
                expected: "a b",
            },
            {
                input: {
                    a: true,
                    b: false,
                    c: true,
                },
                expected: "a c",
            },
        ];

        cases.forEach(({input, expected}, index) => {
            assert.strictEqual(classes(input), expected, `Test case ${index}`);
        });
    }
);
