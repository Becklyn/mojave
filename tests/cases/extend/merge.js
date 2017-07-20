import QUnit from "qunitjs";
import {merge} from "../../../extend";

QUnit.module("extend/merge()");


QUnit.test(
    "merge() tests",
    function (assert)
    {
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
                expected: 1,
            },
            {
                target: ["a"],
                sources: ["b"],
                expected: "b",
            },
            {
                target: ["a"],
                sources: [["b"]],
                expected: ["a", "b"],
            },
            {
                target: {a: 1},
                sources: [["b"]],
                expected: ["b"],
            },
            {
                target: {a: 1},
                sources: [{b: 2}],
                expected: {a: 1, b: 2},
            },
            {
                target: {a: 1, b: 2},
                sources: [{b: 3}],
                expected: {a: 1, b: 3},
            },
            {
                target: {a: 1, b: ["a"]},
                sources: [{c: 4, b: ["b"]}],
                expected: {a: 1, b: ["a", "b"], c: 4},
            },
            {
                target: {a: 1, b: {c: 4, d: 5}},
                sources: [{b: {c: 6, e: 7}}],
                expected: {a: 1, b: {c: 6, d: 5, e: 7}},
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
                target: {a: 1, b: 2},
                sources: [{b: 3}, {b: 5}],
                expected: {a: 1, b: 5},
            },
        ];

        cases.forEach((data, index) => {
            assert.deepEqual(merge(data.target, ...data.sources), data.expected, `Testcase ${index}`);
        });
    }
);
