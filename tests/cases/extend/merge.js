import QUnit from "qunit";
import {merge} from "../../../extend";

QUnit.module("extend/merge()");


QUnit.test(
    "basic merge() tests",
    (assert) => {
        const cases = [
            {
                target: "a",
                sources: [],
                expected: "a",
            },
            {
                target: "a",
                sources: ["b"],
                expected: "b",
            },
            {
                target: "a",
                sources: [1],
                expected: "a",
            },
            {
                target: true,
                sources: [false],
                expected: false,
            },
            {
                target: ["a"],
                sources: ["b"],
                expected: ["a"],
            },
            {
                target: ["a"],
                sources: [["b"]],
                expected: ["a", "b"],
            },
            {
                target: {a: 1},
                sources: [["b"]],
                expected: {a: 1},
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
                    b: ["a", "b"],
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
                        d: 5,
                        e: 7,
                    },
                    f: false,
                },
            },
            {
                target: "a",
                sources: ["b", "c"],
                expected: "c",
            },
            {
                target: ["a"],
                sources: [["b"], ["c"]],
                expected: ["a", "b", "c"],
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
        ];

        cases.forEach((data, index) => {
            assert.deepEqual(merge(data.target, ...data.sources), data.expected, `Testcase ${index}`);
        });
    }
);


QUnit.test(
    "merge() with functions",
    (assert) => {
        const cases = [
            {
                target: () => { return 1; },
                sources: [() => { return 2; }],
                expected: 2,
            },
            {
                target: () => { return 1; },
                sources: ["a"],
                expected: 1,
            },
        ];

        cases.forEach((data, index) => {
            const merged = merge(data.target, ...data.sources);
            const result = merged();

            assert.deepEqual(result, data.expected, `Testcase ${index}`);
        });
    }
);
