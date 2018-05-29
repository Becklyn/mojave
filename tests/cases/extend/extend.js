import QUnit from "qunit";
import {extend} from "../../../extend";

QUnit.module("extend/extend()");


QUnit.test(
    "basic extend() tests",
    (assert) => {
        const cases = [
            {
                target: {a: "a"},
                sources: [],
                expected: {a: "a"},
            },
            {
                target: {a: 1},
                sources: [{b: 2}],
                expected: {
                    a: 1,
                    b: 2,
                },
            },
            {
                target: {
                    a: 1,
                    b: 2,
                },
                sources: [{b: 3}],
                expected: {
                    a: 1,
                    b: 3,
                },
            },
            {
                target: {
                    a: 1,
                    b: ["a"],
                },
                sources: [{
                    c: 4,
                    b: ["b"],
                }],
                expected: {
                    a: 1,
                    b: ["b"],
                    c: 4,
                },
            },
            {
                target: {
                    a: 1,
                    b: {
                        c: 4,
                        d: 5,
                    },
                    f: true,
                },
                sources: [{
                    b: {
                        c: 6,
                        e: 7,
                    },
                    f: false,
                }],
                expected: {
                    a: 1,
                    b: {
                        c: 6,
                        e: 7,
                    },
                    f: false,
                },
            },
            {
                target: {
                    a: 1,
                    b: 2,
                },
                sources: [{b: 3}, {b: 5}],
                expected: {
                    a: 1,
                    b: 5,
                },
            },
            {
                target: {
                    a: 1,
                },
                sources: [{a: null}],
                expected: {
                    a: null,
                },
            },
            {
                target: {
                    a: null,
                },
                sources: [{a: 1}],
                expected: {
                    a: 1,
                },
            },
            // even invalid types are supported
            {
                target: {
                    a: 1,
                },
                sources: [{a: [1, 2, 3]}],
                expected: {a: [1, 2, 3]},
            },
        ];

        cases.forEach((data, index) => {
            assert.deepEqual(extend(data.target, ...data.sources), data.expected, `Testcase ${index}`);
        });
    }
);
