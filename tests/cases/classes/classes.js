import {classes} from "../../../classes";
import QUnit from "qunit";

QUnit.module("classes/classes");

QUnit.test("different test cases", assert => {
    const cases = [
        {
            description: "empty",
            actual: classes(),
            expected: "",
        },
        {
            description: "empty map",
            actual: classes({}),
            expected: "",
        },
        {
            description: "true / false",
            actual: classes({
                a: false,
                b: true,
            }),
            expected: "b",
        },
        {
            description: "none true",
            actual:  classes({
                a: false,
                b: false,
            }),
            expected: "",
        },
        {
            description: "all true",
            actual:  classes({
                a: true,
                b: true,
            }),
            expected: "a b",
        },
        {
            description: "mixed true / false",
            actual:  classes({
                a: true,
                b: false,
                c: true,
            }),
            expected: "a c",
        },
        {
            description: "different truthy and falsy values",
            actual: classes({
                a: 1,
                b: null,
                c: undefined,
                d: 0,
                e: "",
                f: "a",
                g: [],
                h: [1],
                i: {},
                j: {a: 1},
            }),
            expected: "a f g h i j",
        },
        {
            description: "multiple strings",
            actual: classes("a", "b", "c", "d"),
            expected: "a b c d",
        },
        {
            description: "mixed strings and objects",
            actual: classes("a", {b: true, c: false}, "d"),
            expected: "a b d",
        },
    ];

    cases.forEach(({actual, expected, description}) => {
        assert.strictEqual(actual, expected, `Test Case: ${description}`);
    });
});
