import {extractTextFromComponentChildren} from "../../../../ui/toasts-helper";
import {h} from "preact";
import QUnit from "qunit";


QUnit.module("toasts-helper/extractTextFromComponentChildren()");


QUnit.test("Extract correctly", assert => {
    const cases = [
        ["Test", "Test"],
        ["", ""],
        [
            ["test", "abc"],
            "testabc",
        ],
        [
            h("div", {}, [
                h("p", {}, "Hello there"),
                h("p", {}, "Hi"),
            ]),
            "Hello thereHi",
        ],
        [
            h("div", {}, "single"),
            "single",
        ],
        [
            [h("div", {}, "fragment")],
            "fragment",
        ],
        [
            [h("div", {}, undefined)],
            "",
        ],
    ];

    cases.forEach(([input, expected]) => assert.strictEqual(extractTextFromComponentChildren(input), expected));
});
